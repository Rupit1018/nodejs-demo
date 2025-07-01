import { Router } from "express";
import {
  createorg,
  getMyorg,
  getorg,
  updateorg,
  deleteorg,
} from "../controllers/org.controller.js";
import authenticate from "../middleware/auth.middleware.js";
const orgRouter = Router();

orgRouter.post("/org", authenticate, createorg);
orgRouter.get("/myorg", authenticate, getMyorg);
orgRouter.get("/org", authenticate, getorg);
orgRouter.put("/org/:id", authenticate, updateorg);
orgRouter.delete("/org/:id", authenticate, deleteorg);

export default orgRouter;
