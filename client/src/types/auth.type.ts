import type { z } from "zod";

import type { BaseResponse } from "./common.type";
import type { User } from "./user.type";

import type { signinSchema, signupSchema } from "@/validators/auth.validator";

export type SignupInput = z.infer<typeof signupSchema>;
export type SigninInput = z.infer<typeof signinSchema>;

// REQUEST TYPES
export type SigninRequest = {
  inputs: SigninInput;
};

export type SignupRequest = {
  inputs: SignupInput;
};

// Response Type
export type AuthResponse = BaseResponse<{ user: User }>;
