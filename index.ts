import express from "express";
import dotenv from "dotenv";
dotenv.config();

import authMiddleware from "./authMiddleware";
import authRoute from "./routes/auth";
import starwarsRoute from "./routes/starwars";
import weatherRoute from "./routes/weather";

const hasher = require("s-salt-pepper");

const app = express();

app.use(express.json());
app.use(authMiddleware);
app.use("/", authRoute);
app.use("/starwars", starwarsRoute);
app.use("/weather", weatherRoute);

const PORT = process.env.NODE_PORT;
const ITERATIONS = process.env.HASH_ITERATIONS;
const PEPPER = process.env.HASH_PEPPER;

if (PORT && ITERATIONS && PEPPER) {
  hasher.iterations(parseInt(ITERATIONS));
  hasher.pepper(PEPPER);
  app.listen(PORT, () => console.info(`Server started on port ${PORT}.`));
} else {
  console.error("FATAL: Environment variables not set.");
}
