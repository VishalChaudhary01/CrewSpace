import { z } from "zod";

import { emailSchema, nameSchema, passwordSchema } from "./common.validator";

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

export type SignupDto = z.infer<typeof signupSchema>;
export type SigninDto = z.infer<typeof signinSchema>;
