// Backend/Controller/authcontroller.js
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { client as db } from '../db.js';

const signup = async (req, res) => {
  console.log("BODY RECEIVED:", req.body);

  if (!req.body) {
    return res.status(400).send("No body received!");
  }

  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).send("All fields are required");
  }

  const hashpassword = bcrypt.hashSync(password, 10);

  try {
    await db.query(
      `INSERT INTO users (name, email, password) VALUES ($1, $2, $3)`,
      [name, email, hashpassword]
    );
    res.send("Signup Successfully!");
  } catch (error) {
    console.error("Error during signup:", error.message);
    res.status(500).send("Signup failed. Possibly duplicate email.");
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await db.query(`SELECT * FROM users WHERE email = $1`, [email]);

    if (result.rows.length === 0) {
      return res.status(404).send("User not found");
    }

    const user = result.rows[0];
    const isMatch = bcrypt.compareSync(password, user.password);

    if (!isMatch) {
      return res.status(401).send("Incorrect password");
    }

    // Generate token using user.id (not result object)
    const token = jwt.sign({ userId: user.id }, 'RUPIT');

    // Return success and token
    res.status(200).json({
      message: "Login Successfully!",
      token: token
    });

  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).send("Error during login");
  }
};

export default { signup, login };
