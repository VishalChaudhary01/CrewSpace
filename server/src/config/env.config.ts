import { getEnv } from "@/utils/get-env";

export const config = {
  PORT: getEnv("PORT", "5000"),
  BASE_PATH: getEnv("BASE_PATH", "/api"),
  NODE_ENV: getEnv("NODE_ENV", "development"),
  FRONTEND_URL: getEnv("FRONTEND_URL"),
  MONGODB_URI: getEnv("MONGODB_URI"),
  JWT_SECRET: getEnv("JWT_SECRET"),
  JWT_EXPIRES_IN: getEnv("JWT_EXPIRES_IN"),
  AUTH_COOKIE_NAME: getEnv("AUTH_COOKIE_NAME"),
  PENDING_EMAIL_VERIFICATION_USER_ID: getEnv(
    "PENDING_EMAIL_VERIFICATION_USER_ID",
  ),
  MAILTRAP_TOKEN: getEnv("MAILTRAP_TOKEN"),
  MAILTRAP_SENDER_EMAIL: getEnv("MAILTRAP_SENDER_EMAIL"),
  MAILTRAP_SENDER_NAME: getEnv("MAILTRAP_SENDER_NAME"),
} as const;
