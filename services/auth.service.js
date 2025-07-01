import { client as db } from "../config/db.js";
import jwt from "jsonwebtoken";

const createUser = async ({ name, email, hashPassword }) => {
  const sql = `
    INSERT INTO users (name, email, password)
    VALUES ($1, $2, $3)
    RETURNING id, name, email;
  `;
  const { rows } = await db.query(sql, [name, email, hashPassword]);
  return rows[0];
};

const findUserByEmail = async (email) => {
  const { rows } = await db.query(
    "SELECT id, name, email, password FROM users WHERE email = $1",
    [email]
  );
  return rows[0]; 
};

const createToken = async (checkuser) => {
  return jwt.sign({ userId: checkuser.id }, "RUPIT");
};
export default { createUser, findUserByEmail, createToken };
