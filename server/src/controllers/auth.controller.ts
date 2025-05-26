import { Request, Response } from "express";
import { config } from "@/config/env.config";
import { StatusCode } from "@/config/http.config";
import {
  clearAuthenticationCookies,
  setAuthenticationCookies,
} from "@/utils/cookie";
import { signJwt } from "@/utils/jwt";
import {
  sendResetPasswordRequestEmail,
  sendResetPasswordSuccessEmail,
  sendVerificationEmail,
} from "@/mailtrap/emails";
import {
  resetPasswordRequestService,
  resetPasswordService,
  signinService,
  signupService,
  verifyVerificationCodeService,
} from "@/services/auth.service";
import {
  resetPasswordRequestSchema,
  resetPasswordSchema,
  signinSchema,
  signupSchema,
  verifyVerificationCodeSchema,
} from "@/validators/auth.validator";

export const signup = async (req: Request, res: Response) => {
  const data = signupSchema.parse(req.body);

  const { user, verificationCode } = await signupService(data);

  sendVerificationEmail(user.email, verificationCode);

  res.status(StatusCode.CREATED).json({
    message: "User registered successfully. Please verify your email.",
  });
};

export const signin = async (req: Request, res: Response) => {
  const data = signinSchema.parse(req.body);

  const { user } = await signinService(data);

  const token = signJwt({ userId: user._id as string });

  setAuthenticationCookies({ res, token });

  res.status(StatusCode.OK).json({
    message: "Signin successful",
    data: {
      user,
    },
  });
};

export const verifyVerificationCode = async (req: Request, res: Response) => {
  const { code } = verifyVerificationCodeSchema.parse(req.body);

  const { user } = await verifyVerificationCodeService(code);

  res.status(StatusCode.OK).json({
    message: "Email verified successfully, now you can login",
    data: {
      user,
    },
  });
};

export const resetPasswordRequest = async (req: Request, res: Response) => {
  const { email } = resetPasswordRequestSchema.parse(req.body);

  const { user, token } = await resetPasswordRequestService(email);
  const resetURL = `${config.FRONTEND_URL}/reset-password/${token}`;

  sendResetPasswordRequestEmail(user.email, resetURL);

  res.status(StatusCode.OK).json({
    message: "A password reset link has send to your email",
  });
};

export const resetPassword = async (req: Request, res: Response) => {
  const token = req.params.token;
  const { password } = resetPasswordSchema.parse(req.body);

  const { user } = await resetPasswordService(token, password);

  console.log("Reseponse: ", user);
  sendResetPasswordSuccessEmail(user.email);

  res.status(StatusCode.OK).json({
    message: "Password reset successfully",
    data: {
      user,
    },
  });
};

export const signout = async (_req: Request, res: Response) => {
  clearAuthenticationCookies(res);
  res.status(StatusCode.OK).json({
    message: "User logged out successfully",
  });
};
