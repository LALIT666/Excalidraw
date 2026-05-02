import z, { email } from "zod";

export const UserSchema = z.object({
  email: z.email("Invalid Email"),
  password: z
    .string()
    .min(8, "Password must contain 8 characters")
    .max(20, "Password must not contain more than 20 characters"),
  username: z.string().min(1, "Username is required").max(100).trim(),
});
