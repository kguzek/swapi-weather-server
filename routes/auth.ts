import express, { Request, Response } from "express";
import { User } from "../sequelize";
import jwt from "jsonwebtoken";
const hasher = require("s-salt-pepper");

const router = express.Router();

function getCredentials(req: Request, res: Response) {
  const returnValue: { [key: string]: string } = {};

  for (const requiredProperty of ["email", "password"]) {
    const property = req.body[requiredProperty];
    if (!property) {
      return void res
        .status(400)
        .json({ error: `No ${requiredProperty} provided.` });
    }
    returnValue[requiredProperty] = property;
  }
  return returnValue;
}

async function generateJWT(uuid: string, email: string) {
  return jwt.sign({ uuid, email }, process.env.JWT_SECRET as jwt.Secret);
}

router.post("/register", async (req, res) => {
  // Ensure the request payload is valid
  const credentials = getCredentials(req, res);
  if (!credentials) return;
  const { email, password } = credentials;
  // Ensure the email address does not already exist in the database
  const matches = await User.findAll({ where: { email } });
  if (matches.length > 0) {
    return void res.status(400).json({ error: "Email is taken." });
  }
  // Hash the password and store in db
  const { hash, salt } = await hasher.hash(password);
  const user = await User.create({ email, hash, salt });
  // Generate JWT

  const uuid = user.get("uuid") as string;
  const token = await generateJWT(uuid, email);
  // Return user details
  res.status(201).json({ ...user, token });
});

router.post("/login", async (req, res) => {
  // Ensure the request payload is valid
  const credentials = getCredentials(req, res);
  if (!credentials) return;
  const { email, password } = credentials;
  // Query the database for the given email address
  const matches = await User.findAll({ where: { email } });
  if (matches.length === 0) {
    return void res.status(401).json({ error: "Invalid email." });
  }
  // Retrieve the user details as well as hashed credentials to compare against
  const { hash, salt, ...userDetails } = matches.shift()?.get();
  const isValid = await hasher.compare(password, { hash, salt });
  if (isValid) {
    // Generate JWT
    const token = await generateJWT(userDetails.uuid, email);
    res.status(200).json({ ...userDetails, token });
  } else {
    res.status(401).json({ error: "Invalid password." });
  }
});

export default router;
