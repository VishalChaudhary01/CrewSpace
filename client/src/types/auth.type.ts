import type { z } from "zod";
import type { BaseResponse } from "./common.type";
import type { signinSchema, signupSchema } from "@/validators/auth.validator";
import type { User } from "./user.type";

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
export type SigninResponse = BaseResponse<{ user: User }>;
