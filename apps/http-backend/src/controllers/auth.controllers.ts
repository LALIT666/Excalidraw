import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import { prisma } from "db/client";
import { UserSignInSchema, UserSignUpSchema } from "@repo/common/schema";
import { generateJwtToken } from "../utils/generate-jwt-token.utils";

export async function signupUser(req: Request, res: Response) {
  try {
    const parsed = UserSignUpSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: parsed.error.flatten().fieldErrors,
      });
    }

    const { email, password, username } = parsed.data;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await prisma.user.create({
      data: {
        email,
        username,
        hashPassword: hashedPassword,
        avatar: "",
      },
      select: {
        id: true,
        email: true,
        username: true,
        avatar: true,
      },
    });

    const token = generateJwtToken(newUser.id);

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user: newUser,
      token,
    });
  } catch (error) {
    console.error("signupUser error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
}

export async function signInUser(req: Request, res: Response) {
  try {
    const parsed = UserSignInSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: parsed.error.flatten().fieldErrors,
      });
    }

    const { email, password } = parsed.data;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.hashPassword);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password",
      });
    }

    const token = generateJwtToken(user.id);

    return res.status(200).json({
      success: true,
      message: "Logged in successfully",
      token,
    });
  } catch (error) {
    console.error("signInUser error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
}
