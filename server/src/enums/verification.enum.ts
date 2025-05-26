export const Verification = {
  EMAIL_VERIFICATION: "EMAIL_VERIFICATION",
  PASSWORD_RESET: "PASSWORD_RESET",
} as const;

export const EMAIL_VERIFICATION_CODE_RESENT_TIME = 60 * 1000; // 30 sec.

export type VerificationType = keyof typeof Verification;
