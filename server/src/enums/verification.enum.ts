export const VerificationEnum = {
  EMAIL_VERIFICATION: "EMAIL_VERIFICATION",
  PASSWORD_RESET: "PASSWORD_RESET",
};

export type VerificationEnumType = keyof typeof VerificationEnum;
