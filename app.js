import express from "express";
import dotenv from "dotenv";

import connect from "./config/db.js";
import routes from "./routes/index.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// DB Connect
await connect();

// user routes
app.use("/auth", routes.authRouter);
app.use("/org", routes.orgRouter);
app.use("/todo", routes.todoRouter);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
