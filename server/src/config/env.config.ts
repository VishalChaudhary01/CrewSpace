import { getEnv } from "@/utils/get-env";

export const config = {
  PORT: getEnv("PORT", "5000"),
  BASE_PATH: getEnv("BASE_PATH", "/api/v1"),
  NODE_ENV: getEnv("NODE_ENV", "development"),
  MONGODB_URI: getEnv("MONGODB_URI"),
} as const;
