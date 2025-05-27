import { Resend } from "resend";
import { config } from "./env.config";

export const resend = new Resend(config.RESEND_TOKEN);
export const FROM = config.RESEND_SENDER;
