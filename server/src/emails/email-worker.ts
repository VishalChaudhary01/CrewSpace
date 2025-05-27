import { Worker } from "bullmq";
import { connection } from "./email-queue";
import { FROM, resend } from "@/config/resend.config";

const emailWorker = new Worker(
  "emailQueue",
  async (job) => {
    const { to, subject, html } = job.data;

    console.log("JOb data:: ", job.data);

    await resend.emails.send({
      from: FROM,
      to: to,
      subject,
      html,
    });

    console.log("Email send to: ", to);
  },
  { connection },
);

emailWorker.on("failed", (job, err) => {
  if (job?.opts.attempts && job?.attemptsMade >= job?.opts.attempts) {
    console.error(`Failed to send mail to $${job?.data?.to}:`, err);
  } else {
    console.error(
      `Retrying to send mail to ${job?.data?.to}, attempts - ${job && job.attemptsMade + 1}`,
    );
  }
});
