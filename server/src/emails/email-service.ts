import { addEmailToQueue } from "./email-producer";
import { EmailTemplate } from "./email-templates";

export const sendVerificationEmail = async (email: string, code: string) => {
  const html = EmailTemplate.VERIFICATION_EMAIL_TEMPLATE.replace(
    "{verificationCode}",
    code,
  );
  await addEmailToQueue({
    to: email,
    subject: "Verify your email",
    html,
  });
};

export const sendResetPasswordEmail = async (
  email: string,
  resetURL: string,
) => {
  const html = EmailTemplate.PASSWORD_RESET_REQUEST_TEMPLATE.replace(
    "{resetURL}",
    resetURL,
  );
  await addEmailToQueue({
    to: email,
    subject: "Password reset link",
    html,
  });
};

export const sendResetPasswordSuccessEmail = async (email: string) => {
  await addEmailToQueue({
    to: email,
    subject: "Password Reset Successful",
    html: EmailTemplate.PASSWORD_RESET_SUCCESS_TEMPLATE,
  });
};
