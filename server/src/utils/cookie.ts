import { CookieOptions, Response } from "express";
import { config } from "@/config/env.config";

type CookiePayloadType = {
  res: Response;
  token: string;
};

const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: config.NODE_ENV === "production" ? true : false,
  sameSite: config.NODE_ENV === "production" ? "strict" : "lax",
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
  path: "/",
};

export const setAuthenticationCookies = ({
  res,
  token,
}: CookiePayloadType): Response =>
  res.cookie(config.AUTH_COOKIE_NAME, token, cookieOptions);

export const clearAuthenticationCookies = (res: Response): Response =>
  res.clearCookie(config.AUTH_COOKIE_NAME);
