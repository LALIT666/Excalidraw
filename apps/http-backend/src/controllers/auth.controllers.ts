import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import { prisma } from "db/client";
import { UserSchema } from "../schemas/auth.schema";
import { failure, successFunc } from "../helperFunction";
import { generateJwtToken } from "../utils/generate-jwt-token.utils";

export async function signupUser(req: Request, res: Response) {
  try {
    const parsed = UserSchema.safeParse(req.body);

    if (!parsed.success) {
      return res
        .status(400)
        .json(failure(JSON.stringify(parsed.error.flatten().fieldErrors)));
    }

    const { email, password, username } = parsed.data;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json(failure("User already exists"));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        username,
        hashPassword: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        username: true,
      },
    });

    const token = generateJwtToken(newUser.id, res);

    return res.status(201).json(
      successFunc({
        message: "User created successfully",
        user: newUser,
        token,
      }),
    );
  } catch (error) {
    console.error("signupUser error:", error);
    return res.status(500).json(failure("Server Error"));
  }
}

export async function signInUser(req: Request, res: Response) {
  try {
    const parsed = UserSchema.safeParse(req.body);

    if (!parsed.success) {
      return res
        .status(400)
        .json(failure(JSON.stringify(parsed.error.flatten().fieldErrors)));
    }

    const { email, password } = parsed.data;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json(failure("User not found"));
    }

    const isPasswordValid = await bcrypt.compare(password, user.hashPassword);

    if (!isPasswordValid) {
      return res.status(401).json(failure("Incorrect password"));
    }

    const token = generateJwtToken(user.id, res);

    return res.status(200).json(
      successFunc({
        message: "Logged in successfully",
        token,
      }),
    );
  } catch (error) {
    console.error("signInUser error:", error);
    return res.status(500).json(failure("Server Error"));
  }
}
