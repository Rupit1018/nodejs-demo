import todoService from "../services/todo.service.js";

export const createtodo = async (req, res) => {
  const { orgId } = req.params;
  const { title, description } = req.body;
  const userId = req.userId;
  console.log("Received body:", req.body);

  try {
    const getUserOrg = await todoService.getUserOrg(orgId, userId);

    if (!getUserOrg) {
      return res.status(403).json({
        error: "You are not the owner of this organization or it doesn't exist",
      });
    }

    const createTodo = await todoService.createTodo(
      title,
      description,
      orgId,
      userId
    );

    res.status(201).json(createTodo);
  } catch (err) {
    res.status(500).json({
      error: "Failed to create todo",
      details: err.message,
    });
  }
};

export const gettodo = async (req, res) => {
  const { orgId } = req.params;

  try {
    const getAllTodo = await todoService.getAllTodo(orgId);

    res.status(200).json({
      data: getAllTodo,
      message: "Get all todos",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      message: "Error fetching todos",
    });
  }
};

export const updatetodo = async (req, res) => {
  const id = Number.parseInt(req.params.id, 10);
  const { title, description } = req.body;
  const userId = req.userId;

  try {
    const todo = await todoService.getTodo(id);

    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }

    if (String(todo.org_owner_id) !== String(userId)) {
      return res.status(403).json({ error: "Not your todo" });
    }

    const updated = await todoService.updateTodo({ title, description, id });

    if (!updated) {
      return res.status(404).json({ error: "Todo not found or not modified" });
    }

    return res.status(200).json(updated);
  } catch (err) {
    console.error("Update Todo Error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const deletetodo = async (req, res) => {
  const id = Number.parseInt(req.params.id, 10);
  const userId = req.userId;

  try {
    console.log("Attempting delete", { id, userId });

    const deleteTodo = await todoService.deleteTodo({ id, userId });
    console.log("Deleting todo:", {
      todoId: id,
      currentUser: userId,
    });

    if (!deleteTodo) {
      return res.status(403).json({ error: "Not your todo or not found" });
    }

    return res.status(200).json({
      message: "Todo deleted",
      data: deleteTodo,
    });
  } catch (err) {
    console.error("Delete Todo Error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
