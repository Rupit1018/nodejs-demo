
import orgService from "../services/org.service.js";
export const createorg = async (req, res) => {
  try {
    const { name } = req.body || {};
    const userId = req.userId; // set by your auth middleware

    if (!name) {
      return res.status(400).send("Name is required");
    }

    const org = await orgService.createOrg({ name, userId });

    return res.status(201).json({
      message: "Organization created",
      organization: org,
    });
  } catch (err) {
    console.error("Org create error:", err.message);
    res.status(500).json({
      message: "Error creating organization",
      error: err.message,
    });
  }
};
export const getMyorg = async (req, res) => {
  const userId = req.userId;
  const myOrg = await orgService.getMyOrg({ userId });
  try {
    res.status(200).json({
      data: myOrg,
      message: "Get All Organization",
    });
  } catch (error) {
    res.status(404).json({
      error: error.message,
      message: "Error to Get All Organization",
    });
  }
};
export const getorg = async (req, res) => {
  const getAllOrg = await orgService.getAllOrg();
  try {
    res.status(200).json({
      data: getAllOrg,
      message: "Get All Organization",
    });
  } catch (error) {
    res.status(404).json({
      error: error.message,
      message: "Error to Get All Organization",
    });
  }
};
export const updateorg = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { name } = req.body;
  const userId = req.userId;
  console.log("Updating organization with:", { id, name, userId: req.userId });

  try {
    const updateOrg = await orgService.updateOrg(name, id, userId);

    if (!updateOrg) {
      return res.status(404).json({
        message: "Organization not found or you're not authorized",
        debug: { id, userId },
      });
    }

    res.status(200).json({
      data: updateOrg,
      message: "Organization Updated",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      message: "Error updating organization",
    });
  }
};

export const deleteorg = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const deleteOrg = await orgService.deleteOrg(id, userId);
    console.log("Trying to delete org:", { id, userId: userId });
    if (!deleteOrg) {
      return res.status(404).json({
        message: "Organization not found or you're not authorized",
      });
    }

    res.status(200).json({
      data: deleteOrg,
      message: "Organization deleted",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      message: "Error deleting organization",
    });
  }
};
