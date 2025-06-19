import { Request, Response } from "express";
import { StatusCode } from "@/config/http.config";
import {
  clearAuthenticationCookies,
  setAuthenticationCookies,
} from "@/utils/cookie";
import { signJwt } from "@/utils/jwt";
import { signinService, signupService } from "@/services/auth.service";
import { signinSchema, signupSchema } from "@/validators/auth.validator";
import { logger } from "@/utils/logger";

export const signup = async (req: Request, res: Response) => {
  const data = signupSchema.parse(req.body);
  logger.info(`New user registration initiated for email: ${data.email}`);

  const { user } = await signupService(data);

  const token = signJwt({ userId: user._id.toString() });

  setAuthenticationCookies(res, token);

  logger.info(`User signed up successfully: ${user._id}`);
  res.status(StatusCode.CREATED).json({
    message: "Signup successful",
  });
};

export const signin = async (req: Request, res: Response) => {
  const data = signinSchema.parse(req.body);
  logger.info(`User attempting to sign in: ${data.email}`);

  const { user } = await signinService(data);

  const token = signJwt({ userId: user._id.toString() });

  setAuthenticationCookies(res, token);

  logger.info(`User signed in successfully: ${user._id}`);
  res.status(StatusCode.OK).json({
    message: "Signin successful",
    data: {
      user,
    },
  });
};

export const signout = async (_req: Request, res: Response) => {
  clearAuthenticationCookies(res);

  logger.info(`User signed out`);
  res.status(StatusCode.OK).json({
    message: "Logged successful",
  });
};
