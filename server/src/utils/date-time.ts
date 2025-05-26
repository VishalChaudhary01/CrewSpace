export const VERIFICATION_EXPIRES_AT = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

export const AUTHENTICATION_COOKIE_EXPIRES_AT = new Date(
  Date.now() + 24 * 60 * 60 * 1000,
); // 24 hours

export const EMAIL_VERIFICATION_COOKIE_EXPIRES_AT = new Date(
  Date.now() + 5 * 60 * 1000,
); // 5 minutes
