import crypto from "crypto";

export const generateVerificationCode = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

export const generateResetToken = () => crypto.randomBytes(32).toString("hex");
