import { z } from "zod";

export const UserSignUpSchema = z.object({
  email: z.string().email("Invalid Email"),

  password: z
    .string()
    .min(8, "Password must contain at least 8 characters")
    .max(20, "Password must not contain more than 20 characters"),

  username: z.string().min(1, "Username is required").max(100).trim(),
});

export const UserSignInSchema = z.object({
  email: z.string().email("Invalid Email"),

  password: z
    .string()
    .min(8, "Password must contain at least 8 characters")
    .max(20, "Password must not contain more than 20 characters"),
});

export const RoomSchema = z.object({
  roomname: z.string().min(1, "Room name is required"),
});
