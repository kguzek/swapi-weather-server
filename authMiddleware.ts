import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const PUBLIC_ROUTES = ["/register/", "/login/", "/starwars/getall/"];

export default async function authorise(
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.info(req.method, req.path);

  /** Either reject the request or allow it, depending on if the queried endpoint is public. */
  function reject(code: number, message: string) {
    const path = req.path.endsWith("/") ? req.path : req.path + "/";
    if (PUBLIC_ROUTES.includes(path)) {
      next();
    } else {
      res.status(code).json({ error: message });
    }
  }

  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")?.[1];
  if (!token) {
    return reject(401, "Missing authorisation token.");
  }

  jwt.verify(token, process.env.JWT_SECRET as jwt.Secret, (err) => {
    if (err) {
      console.error(err);
      return reject(401, "Invalid authorisation token.");
    }
    next();
  });
}
