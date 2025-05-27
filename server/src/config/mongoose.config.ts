import mongoose from "mongoose";
import { config } from "./env.config";
import { logError, logger } from "@/utils/logger";

export const connectMongoDB = async () => {
  try {
    await mongoose.connect(config.MONGODB_URI, {
      family: 4, // 👈 forces IPv4
    });
    logger.info("MongoDB Database connected!");
  } catch (error) {
    logError("Failed to connect MongoDB Database", error);
    process.exit(1);
  }
};
