import express from "express";
import dotenv from "dotenv";
import { connectMongo } from "./config/mongo.config.js";
import bodyParser from "body-parser";
import Route from "./routes/routes.js";
import cors from "cors";

dotenv.config();

const app = express();
const router = express.Router();

connectMongo();

const port = process.env.PORT;

app.use(cors());

app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/v1", Route(router));

app.get("/", (req, res) => {
  return res.status(201).json({
    status: "success",
    msg: "Welcome to Todo App Server",
    data: [],
  });
});

app.use("/*", (req, res) => {
  return res
    .status(404)
    .json({ status: "error", msg: "Invalid Route", data: [] });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
