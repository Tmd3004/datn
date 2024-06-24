import express from "express";
import path from "path";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/userRoutes.js";
import uploadRouter from "./routes/uploadRoutes.js";
import cors from "cors"
import { baseUrl } from "./utils.js";
import projectRouter from "./routes/projectRoutes.js";

dotenv.config();

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err.message);
  });

const app = express();

app.use(cors({ origin: baseUrl(), credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/upload", uploadRouter);
app.use("/api/users", userRouter);
app.use("/api/project", projectRouter);

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "/frontend/build")));
app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "/frontend/build/index.html"))
);

app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`server at http://103.161.112.186:${port}`);
});
