/* eslint-disable @typescript-eslint/no-explicit-any */
import jwt, { SignOptions } from "jsonwebtoken";
import { config } from "@/config/env.config";

type Unit = "s" | "m" | "h" | "d";
type StringValues = `${number}${Unit}`;

export type TPayload = {
  userId: string;
};

export const signOptions: SignOptions = {
  expiresIn: config.JWT_EXPIRES_IN as StringValues,
};

export const signJwt = (
  payload: TPayload,
  secret: string = config.JWT_SECRET,
) => {
  return jwt.sign(payload, secret, signOptions);
};

export const verifyJwt = <TPayload>(
  token: string,
  secret: string = config.JWT_SECRET,
) => {
  try {
    const payload = jwt.verify(token, secret) as TPayload;
    return { payload };
  } catch (error: any) {
    return {
      error: error.message || "Unknown error verifying JWT",
    };
  }
};
