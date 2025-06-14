import IORedis from "ioredis";
import { Queue } from "bullmq";
import { config } from "@/config/env.config";

export const connection = new IORedis(config.REDIS_URI, {
  maxRetriesPerRequest: null,
});

export const emailQueue = new Queue("emailQueue", {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 1000,
    },
    removeOnComplete: true,
    removeOnFail: true,
  },
});
