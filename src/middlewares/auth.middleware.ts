import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt";
import jwt from "jsonwebtoken";


export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;

  if (!auth || !auth.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "No token provided" });
  }

  const token = auth.split(" ")[1];

  try {
    const decoded = verifyAccessToken(token);
    (req as any).user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
}
