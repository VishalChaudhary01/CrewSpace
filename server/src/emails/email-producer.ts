import { emailQueue } from "./email-queue";

interface EmailPayload {
  to: string;
  subject: string;
  html: string;
}

export const addEmailToQueue = async (payload: EmailPayload) => {
  await emailQueue.add("sendEmail", payload);
};
