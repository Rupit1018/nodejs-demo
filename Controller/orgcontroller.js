import { client as db } from "../db.js";

const createorg = async (req, res) => {
  try {
    const { name } = req.body;
    const data = await db.query(
      `INSERT INTO organizations (name, user_id) VALUES ($1, $2)`,
      [name, req.userId]
    );

    res.status(200).json({
      data: data.rows,
      message: "Organization Created",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      message: "Error to create Organization ",
    });
  }
};
const getMyorg = async (req, res) => {
  const data = await db.query(`select * from organizations where user_id=$1`, [req.userId])
  try {
    res.status(200).json({
      data: data.rows,
      message: "Get All Organization"
    })
  } catch (error) {
    res.status(404).json({
      error: error.message,
      message: "Error to Get All Organization"
    })
  }
}
const getorg = async (req, res) => {
  const data = await db.query(`select * from organizations`)
  try {
    res.status(200).json({
      data: data.rows,
      message: "Get All Organization"
    })
  } catch (error) {
    res.status(404).json({
      error: error.message,
      message: "Error to Get All Organization"
    })
  }
}
const updateorg = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { name } = req.body;

  console.log('Updating organization with:', { id, name, userId: req.userId });

  try {
    const data = await db.query(`UPDATE organizations SET name=$1 WHERE id=$2 AND user_id=$3 RETURNING *`, [name, id, req.userId]);

    if (data.rows.length === 0) {
      return res.status(404).json({
        message: "Organization not found or you're not authorized",
        debug: { id, userId: req.userId }
      });
    }

    res.status(200).json({
      data: data.rows[0],
      message: "Organization Updated"
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      message: "Error updating organization"
    });
  }
};

const deleteorg = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await db.query(
      `DELETE FROM organizations WHERE id = $1 AND user_id = $2 RETURNING *`,
      [id, req.userId]
    );
    console.log('Trying to delete org:', { id, userId: req.userId });
    if (data.rowCount === 0) {
      return res.status(404).json({
        message: "Organization not found or you're not authorized",
      });
    }

    res.status(200).json({
      data: data.rows[0],
      message: "Organization deleted",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      message: "Error deleting organization",
    });
  }
};



export default { createorg, updateorg, getMyorg, getorg, deleteorg };
