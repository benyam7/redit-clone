import "reflect-metadata";
import { createConnection } from "typeorm";
import chalk from "chalk";
import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth";
import trim from "./middleware/trim";

dotenv.config();
const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(trim);
app.use(cookieParser());

app.get("/", (req, res) => res.send("hello "));
app.use("/api/auth", authRoutes);

app.listen(process.env.PORT, async () => {
  console.log("Server running");

  try {
    await createConnection();
    console.log("database connected");
  } catch (err) {
    console.log(err);
  }
});
