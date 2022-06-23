import express, { Request, Response } from "express";
const fetch = require("node-fetch");
const router = express.Router();

router.get("/getall", async (_req: Request, res: Response) => {
  try {
    const response = await fetch("https://swapi.dev/api/people/?format=json");
    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    console.error((err as Error).message);
    res.status(500).json({ error: "Could not fetch from the remote API." });
  }
});

export default router;
