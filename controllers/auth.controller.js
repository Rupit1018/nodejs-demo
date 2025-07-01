// Backend/Controller/authcontroller.js
import bcrypt from "bcrypt";
import authService from "../services/auth.service.js";
export const signup = async (req, res) => {
  console.log("BODY RECEIVED:", req.body);

  if (!req.body) {
    return res.status(400).send("No body received!");
  }

  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).send("All fields are required");
  }

  const hashPassword = bcrypt.hashSync(password, 10);

  try {
    const user = await authService.createUser({ name, email, hashPassword });
    res.status(201).json({
      message: "Signup Successfully!",
      user,
    });
  } catch (error) {
    console.error("Error during signup:", error.message);
    res.status(500).send("Signup failed. Possibly duplicate email.");
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const checkuser = await authService.findUserByEmail(email);
    if (!checkuser) {
      return res.status(404).send("User not found");
    }
    const isMatch = bcrypt.compareSync(password, checkuser.password);

    if (!isMatch) {
      return res.status(401).send("Incorrect password");
    }

    const token = await authService.createToken(checkuser);

    // Return success and token
    res.status(200).json({
      message: "Login Successfully!",
      token: token,
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).send("Error during login");
  }
};
