import { z } from "zod";
import { emailSchema, nameSchema, passwordSchema } from "./common.validator";

export const signupSchema = z
  .object({
    name: nameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string({
      required_error: "Please confirm your password",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const signinSchema = z.object({
  email: emailSchema,
  password: z
    .string({ required_error: "Please enter your password" })
    .trim()
    .min(1, { message: "Password is required" }),
});
