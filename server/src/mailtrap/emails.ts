import { mailtrapClient, sender } from "@/config/mailtrap.config";
import { Verification } from "@/enums/verification.enum";
import {
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  VERIFICATION_EMAIL_TEMPLATE,
} from "./email-templates";

export const sendVerificationEmail = async (
  email: string,
  verificationCode: string,
) => {
  const recipient = [{ email }];
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Verify your email",
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        "{verificationCode}",
        verificationCode,
      ),
      category: Verification.EMAIL_VERIFICATION,
    });
    console.log("Email sent for verification: ", response);
  } catch (error) {
    console.error("Error during sending email verification: ", error);
    throw new Error("Failed to send verification email.");
  }
};

export const sendResetPasswordRequestEmail = async (
  email: string,
  resetURL: string,
) => {
  const recipient = [{ email }];
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Password reset link",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
      category: "PASSWORD_RESET",
    });
    console.log("Password reset link send to your email: ", response);
  } catch (error) {
    console.error("Error during sending password reset link: ", error);
    throw new Error("Failed to send password reset email.");
  }
};

export const sendResetPasswordSuccessEmail = async (email: string) => {
  const recipient = [{ email }];
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Password Reset Successful",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
      category: "PASSWORD_RESET",
    });
    console.log("Password reset success email:", response);
  } catch (error) {
    console.error(`Error sending password reset success email`, error);
    throw new Error(`Error sending password reset success email: ${error}`);
  }
};
