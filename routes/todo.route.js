import { Router } from "express";
import {
  createtodo,
  gettodo,
  updatetodo,
  deletetodo,
} from "../controllers/todo.controller.js";
import authenticate from "../middleware/auth.middleware.js";
const todoRouter = Router();

todoRouter.post("/todo/:orgId", authenticate, createtodo);
todoRouter.get("/todo/:orgId", authenticate, gettodo);
todoRouter.put("/todo/:id", authenticate, updatetodo);
todoRouter.delete("/todo/:id", authenticate, deletetodo);

export default todoRouter;
