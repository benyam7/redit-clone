import "reflect-metadata";
import { createConnection } from "typeorm";

import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth";
import postRoutes from "./routes/post";
import subRoutes from "./routes/sub";

import trim from "./middleware/trim";

dotenv.config();
const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(morgan("dev"));
app.use(trim);
app.use(cookieParser());

app.get("/", (_, res) => res.send("hello "));
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/subs", subRoutes);

app.listen(PORT, async () => {
  console.log("Server running");

  try {
    await createConnection();
    console.log("database connected");
  } catch (err) {
    console.log(err);
  }
});
