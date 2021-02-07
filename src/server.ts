import "reflect-metadata";
import { createConnection } from "typeorm";
import chalk from "chalk";
import express from "express";
import morgan from "morgan";

import { User } from "./entities/User";
import authRoutes from "./routes/auth";
import trim from "./middleware/trim";

const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(trim);

app.get("/", (req, res) => res.send("hello "));
app.use("/api/auth", authRoutes);

app.listen(5000, async () => {
  console.log("Server running");

  try {
    await createConnection();
    console.log("database connected");
  } catch (err) {
    console.log(err);
  }
});
