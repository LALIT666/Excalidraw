import jwt from "jsonwebtoken";

import { JWT_SECRET } from "@repo/backend-common/config";

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in env");
}

export function generateJwtToken(userId: string) {
  const token = jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: "1d",
  });

  // res.cookie("token", token, {
  //   httpOnly: true,
  //   secure: process.env.NODE_ENV === "production",
  //   sameSite: "strict",
  //   maxAge: 24 * 60 * 60 * 1000,
  // });

  return token;
}
