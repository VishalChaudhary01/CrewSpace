import { Request, Response } from "express";
import { config } from "@/config/env.config";
import { StatusCode } from "@/config/http.config";
import {
  clearAuthenticationCookies,
  clearEmailVerificationCookie,
  getEmailVerificationCookie,
  setAuthenticationCookies,
  setEmailVerificationCookie,
} from "@/utils/cookie";
import { signJwt } from "@/utils/jwt";
import {
  sendVerificationEmail,
  sendResetPasswordEmail,
  sendResetPasswordSuccessEmail,
} from "@/emails/email-service";
import {
  resendVerificationCodeService,
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
import { BadRequestError } from "@/errors/bad-request.error";
import { logger } from "@/utils/logger";

export const signup = async (req: Request, res: Response) => {
  const data = signupSchema.parse(req.body);
  logger.info(`New user registration initiated for email: ${data.email}`);

  const { user, verificationCode } = await signupService(data);

  await sendVerificationEmail(user.email, verificationCode);

  setEmailVerificationCookie(res, user._id.toString());

  logger.info(`Verification email sent to: ${user.email}`);
  res.status(StatusCode.CREATED).json({
    message: "User registered successfully. Please verify your email.",
  });
};

export const signin = async (req: Request, res: Response) => {
  const data = signinSchema.parse(req.body);
  logger.info(`User attempting to sign in: ${data.email}`);

  const { user } = await signinService(data);

  const token = signJwt({ userId: user._id.toString() });

  setAuthenticationCookies(res, token);

  logger.info(`User signed in successfully: ${user.email}`);
  res.status(StatusCode.OK).json({
    message: "Signin successful",
    data: {
      user,
    },
  });
};

export const resendVerificationCode = async (req: Request, res: Response) => {
  const unverifiedUserId = getEmailVerificationCookie(req);
  logger.info(`Resend verification requested for userId: ${unverifiedUserId}`);

  if (!unverifiedUserId) {
    throw new BadRequestError("Missing verification context");
  }

  const { userEmail, verificationCode } =
    await resendVerificationCodeService(unverifiedUserId);

  await sendVerificationEmail(userEmail, verificationCode);

  res.status(StatusCode.OK).json({
    message: "Verification code resent to your email",
  });
};

export const verifyVerificationCode = async (req: Request, res: Response) => {
  const { code } = verifyVerificationCodeSchema.parse(req.body);

  const { user } = await verifyVerificationCodeService(code);

  clearEmailVerificationCookie(res);

  logger.info(`User verified email using code: ${code}`);
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

  await sendResetPasswordEmail(user.email, resetURL);

  logger.info(`Password reset requested for email: ${email}`);
  res.status(StatusCode.OK).json({
    message: "A password reset link has send to your email",
  });
};

export const resetPassword = async (req: Request, res: Response) => {
  const token = req.params.token;

  const { password } = resetPasswordSchema.parse(req.body);

  const { user } = await resetPasswordService(token, password);

  await sendResetPasswordSuccessEmail(user.email);

  logger.info(`Password reset for user: ${user.email}`);
  res.status(StatusCode.OK).json({
    message: "Password reset successfully",
    data: {
      user,
    },
  });
};

export const signout = async (_req: Request, res: Response) => {
  clearAuthenticationCookies(res);

  logger.info(`User signed out`);
  res.status(StatusCode.OK).json({
    message: "User logged out successfully",
  });
};
