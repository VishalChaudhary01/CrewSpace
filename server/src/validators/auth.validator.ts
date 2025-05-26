import { z } from "zod";
import {
  emailSchema,
  nameSchema,
  passwordSchema,
  verificationCodeSchema,
} from "./common.validator";

// Signup schema
export const signupSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
});

// Signin schema
export const signinSchema = z.object({
  email: emailSchema,
  password: z
    .string({ required_error: "Password is required" })
    .trim()
    .min(1, { message: "Password cannot be empty" }),
});

export const verifyVerificationCodeSchema = z.object({
  code: verificationCodeSchema,
});

export const resetPasswordRequestSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z.object({
  password: passwordSchema,
});

export type SignupDto = z.infer<typeof signupSchema>;
export type SigninDto = z.infer<typeof signinSchema>;
