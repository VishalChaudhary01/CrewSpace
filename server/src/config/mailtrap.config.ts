import { MailtrapClient } from "mailtrap";
import { config } from "./env.config";

export const mailtrapClient = new MailtrapClient({
  token: config.MAILTRAP_TOKEN,
});

export const sender = {
  email: config.MAILTRAP_SENDER_EMAIL,
  name: config.MAILTRAP_SENDER_NAME,
};
