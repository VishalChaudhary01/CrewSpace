import { CookieOptions, Request, Response } from "express";
import { config } from "@/config/env.config";
import {
  AUTHENTICATION_COOKIE_EXPIRES_AT,
  EMAIL_VERIFICATION_COOKIE_EXPIRES_AT,
} from "./date-time";

const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: config.NODE_ENV === "production" ? true : false,
  sameSite: "lax",
  expires: AUTHENTICATION_COOKIE_EXPIRES_AT,
  path: "/",
};

// Authenticatoin Cookie
export const setAuthenticationCookies = (
  res: Response,
  token: string,
): Response => res.cookie(config.AUTH_COOKIE_NAME, token, cookieOptions);

export const clearAuthenticationCookies = (res: Response): Response =>
  res.clearCookie(config.AUTH_COOKIE_NAME);

// Store Pending Email Verification User ID
export const setEmailVerificationCookie = (
  res: Response,
  userId: string,
): Response =>
  res.cookie(config.PENDING_EMAIL_VERIFICATION_USER_ID, userId, {
    ...cookieOptions,
    expires: EMAIL_VERIFICATION_COOKIE_EXPIRES_AT,
  });

export const getEmailVerificationCookie = (req: Request): string | undefined =>
  req.cookies?.[config.PENDING_EMAIL_VERIFICATION_USER_ID];

export const clearEmailVerificationCookie = (res: Response): Response =>
  res.clearCookie(config.PENDING_EMAIL_VERIFICATION_USER_ID);
