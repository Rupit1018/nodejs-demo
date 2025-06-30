import { client as db } from "../db.js";

const createtodo = async (req, res) => {
  const { orgId } = req.params;
  const { title, description } = req.body;

  console.log("Received body:", req.body);

  try {
    const org = await db.query(
      `SELECT * FROM organizations WHERE id = $1 AND user_id = $2`,
      [orgId, req.userId]
    );

    if (org.rows.length === 0) {
      return res.status(403).json({
        error: "You are not the owner of this organization or it doesn't exist",
      });
    }

    const result = await db.query(
      `
      INSERT INTO todos (title, description, org_id, user_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `,
      [title, description, orgId, req.userId]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({
      error: "Failed to create todo",
      details: err.message,
    });
  }
};

const gettodo = async (req, res) => {
  const { orgId } = req.params;

  try {
    const data = await db.query(
      `
      SELECT 
        t.id, t.title, t.description, t.org_id,
        o.user_id 
      FROM todos t
      JOIN organizations o ON t.org_id = o.id
      WHERE o.id = $1
    `,
      [orgId]
    );

    res.status(200).json({
      data: data.rows,
      message: "Get all todos",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      message: "Error fetching todos",
    });
  }
};

const updatetodo = async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;

  try {
    const todo = await db.query(
      `
      SELECT 
        t.id, t.title, t.description, t.org_id,
        o.user_id AS org_owner_id
      FROM todos t
      JOIN organizations o ON t.org_id = o.id
      WHERE t.id = $1
    `,
      [id]
    );

    if (!todo.rows.length) {
      return res.status(404).json({ error: "Todo not found" });
    }

    const todoData = todo.rows[0];

    if (String(todoData.org_owner_id) !== String(req.userId)) {
      return res.status(403).json({ error: "Not your todo" });
    }

    const result = await db.query(
      `
      UPDATE todos
      SET title = $1, description = $2
      WHERE id = $3
      RETURNING *
    `,
      [title, description, id]
    );

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Update Todo Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const deletetodo = async (req, res) => {
  const { id } = req.params;
  console.log(id);

  const todo = await db.query(
    `SELECT t.*, o.user_id FROM todos t JOIN organizations o ON t.org_id = o.id WHERE t.id=$1`,
    [id]
  );
  console.log("req.userId:", req.userId);
  console.log("DB result:", todo.rows[0]);
  if (todo.rows[0]?.user_id !== req.userId) {
    return res.status(403).json({ error: "Not your todo" });
  }

  await db.query(`DELETE FROM todos WHERE id=$1`, [id]);
  res.send("Deleted");
};

export default { createtodo, gettodo, updatetodo, deletetodo };
