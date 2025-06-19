import { CookieOptions, Response } from "express";
import { config } from "@/config/env.config";

const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: config.NODE_ENV === "production" ? true : false,
  sameSite: config.NODE_ENV === "production" ? "none" : "lax",
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
  path: "/",
};

// Authenticatoin Cookie
export const setAuthenticationCookies = (
  res: Response,
  token: string,
): Response => res.cookie(config.AUTH_COOKIE_NAME, token, cookieOptions);

export const clearAuthenticationCookies = (res: Response): Response =>
  res.clearCookie(config.AUTH_COOKIE_NAME);
