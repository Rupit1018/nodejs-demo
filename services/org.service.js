import { Query } from "pg";
import { client as db } from "../config/db.js";

export const createOrg = async ({ name, userId }) => {
  const sql = `
    INSERT INTO organizations (name, user_id)
    VALUES ($1, $2)
    RETURNING id, name, user_id;
  `;
  const { rows } = await db.query(sql, [name, userId]);
  return rows[0]; 
};

export const getMyOrg = async ({ userId }) => {
  const sql = `
    SELECT * FROM organizations WHERE user_id=$1;
  `;
  const { rows } = await db.query(sql, [userId]);
  return rows;
};

export const getAllOrg = async () => {
  const sql = `
    SELECT * FROM organizations ;
  `;
  const { rows } = await db.query(sql);
  return rows;
};

export const updateOrg = async (name, id, userId) => {
  const sql = `UPDATE organizations SET name=$1 WHERE id=$2 AND user_id=$3 RETURNING *`;

  const { rows } = await db.query(sql, [name, id, userId]);
  return rows[0] || null;
};

export const deleteOrg = async (id, userId) => {
  const sql = `DELETE FROM organizations WHERE id = $1 AND user_id = $2 RETURNING *`;

  const { rows } = await db.query(sql, [id, userId]);
  return rows[0] || null;
};
export default { createOrg, getMyOrg, getAllOrg, updateOrg, deleteOrg };
