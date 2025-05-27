import { Worker } from "bullmq";
import { connection } from "./email-queue";
import { FROM, resend } from "@/config/resend.config";
import { logError, logger } from "@/utils/logger";

const emailWorker = new Worker(
  "emailQueue",
  async (job) => {
    const { to, subject, html } = job.data;

    await resend.emails.send({
      from: FROM,
      to: to,
      subject,
      html,
    });

    logger.info("Email send to: ", to);
  },
  { connection },
);

emailWorker.on("failed", (job, err) => {
  if (job?.opts.attempts && job?.attemptsMade >= job?.opts.attempts) {
    logError(`Failed to send mail to $${job?.data?.to}`, err);
  } else {
    logger.warn(
      `Retrying to send mail to ${job?.data?.to}, attempts - ${job && job.attemptsMade + 1}`,
    );
  }
});
