import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { failure } from "../helperFunction";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in env");
}

export function verifyToken(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json(failure("Unauthorized: No token found"));
    }

    const decoded = jwt.verify(token, JWT_SECRET!);

    if (typeof decoded === "string") {
      return res.status(401).json(failure("Invalid token"));
    }

    req.userId = decoded.userId;

    next();
  } catch (error) {
    console.error("verifyToken error:", error);
    return res.status(401).json(failure("Invalid or expired token"));
  }
}
