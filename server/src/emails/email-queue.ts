import IORedis from "ioredis";
import { Queue } from "bullmq";

export const connection = new IORedis({ maxRetriesPerRequest: null });

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
