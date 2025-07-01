import { client as db } from "../config/db.js";

export const getUserOrg = async (orgId, userId) => {
  const { rows } = await db.query(
    `SELECT * FROM organizations WHERE id = $1 AND user_id = $2`,
    [orgId, userId]
  );
  return rows[0] || null;
};

export const createTodo = async (title, description, orgId, userId) => {
  const sql = `
      INSERT INTO todos (title, description, org_id, user_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
  const { rows } = await db.query(sql, [title, description, orgId, userId]);
  return rows[0] || null;
};

export const getAllTodo = async (orgId) => {
  const sql = `
    SELECT
      t.id, t.title, t.description, t.org_id,
      o.user_id
    FROM todos t
    JOIN organizations o ON t.org_id = o.id
    WHERE o.id = $1
  `;
  const { rows } = await db.query(sql, [orgId]);
  return rows;                    // ← every todo for that org
};

export const getTodo = async (id) => {
  const sql = `
    SELECT
      t.*,
      o.user_id AS org_owner_id
    FROM todos t
    JOIN organizations o ON t.org_id = o.id
    WHERE t.id = $1
  `;
  const { rows } = await db.query(sql, [id]);
  return rows[0] || null;          // ← single row, not array
};

export const updateTodo = async ({ title, description, id }) => {
  const sql = `
    UPDATE todos
    SET
      title       = COALESCE($1, title),
      description = COALESCE($2, description)
    WHERE id = $3
    RETURNING *;
  `;
  const { rows } = await db.query(sql, [title, description, id]);
  return rows[0] || null;
};

export const deleteTodo = async ({ id, userId }) => {
  const sql = `
    DELETE FROM todos t
    USING organizations o
    WHERE t.id = $1
      AND t.org_id = o.id
      AND o.user_id = $2
    RETURNING t.*;
  `;
  const { rows } = await db.query(sql, [id, userId]);
  return rows[0] || null;
};

export default {
  getUserOrg,
  createTodo,
  getAllTodo,
  getTodo,
  updateTodo,
  deleteTodo,
};
