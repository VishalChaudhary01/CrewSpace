import mongoose from "mongoose";
import { config } from "./env.config";

export const connectMongoDB = async () => {
  try {
    await mongoose.connect(config.MONGODB_URI, {
      family: 4, // 👈 forces IPv4
    });
    console.log("✅ MongoDB Database connected!");
  } catch (error) {
    console.error("❌ Failed to connect MongoDB Database: ", error);
    process.exit(1);
  }
};
