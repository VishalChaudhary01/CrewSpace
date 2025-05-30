import mongoose from "mongoose";
import { UserDocument, UserModel } from "@/models/user.model";
import { RoleModel } from "@/models/role.model";
import { MemberModel } from "@/models/member.model";
import { WorkspaceModel } from "@/models/wrokspace.model";
import {
  VerificationDocument,
  VerificationModel,
} from "@/models/verification.model";
import { AppError } from "@/errors/app.error";
import { NotFoundError } from "@/errors/not-found.error";
import { BadRequestError } from "@/errors/bad-request.error";
import { Roles } from "@/enums/role.enum";
import { VerificationEnum } from "@/enums/verification.enum";
import { logError } from "@/utils/logger";
import {
  EMAIL_VERIFICATION_CODE_RESENT_TIME,
  VERIFICATION_EXPIRES_AT,
} from "@/utils/date-time";
import { generateResetToken, generateVerificationCode } from "@/utils/crypto";
import { SigninDto, SignupDto } from "@/validators/auth.validator";
import { getUserByIdService } from "./user.service";

export const signupService = async (data: SignupDto) => {
  const userExist = await UserModel.findOne({ email: data.email });
  if (userExist) {
    throw new BadRequestError("Email is already registered");
  }

  let user: UserDocument | null = null;
  let verification: VerificationDocument | null = null;

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    user = new UserModel(data);

    const ownerRole = await RoleModel.findOne({ name: Roles.OWNER }).session(
      session,
    );
    if (!ownerRole) {
      throw new NotFoundError("Owner role not found");
    }

    const workspace = new WorkspaceModel({
      name: "My Workspace",
      description: `Workspace created for ${user.name}`,
      owner: user._id,
    });
    await workspace.save({ session });

    const verificationCode = generateVerificationCode();
    verification = new VerificationModel({
      userId: user._id,
      code: verificationCode,
      expiresAt: VERIFICATION_EXPIRES_AT,
      type: VerificationEnum.EMAIL_VERIFICATION,
    });
    await verification.save({ session });

    const member = new MemberModel({
      userId: user._id,
      workspaceId: workspace._id,
      role: ownerRole._id,
      joinedAt: new Date(),
    });
    await member.save({ session });

    user.currentWorkspace = workspace._id;

    await user.save({ session });

    await session.commitTransaction();
  } catch (error) {
    logError("Error during signupService", error);
    await session.abortTransaction();
    throw new AppError("Failed to register user. Please try again.");
  } finally {
    session.endSession();
  }

  if (!user || !verification?.code) {
    throw new AppError("Unexpected error: user or verification not created.");
  }

  return {
    user: user.omitPassword(),
    verificationCode: verification.code,
  };
};

export const signinService = async (data: SigninDto) => {
  const user = await UserModel.findOne({ email: data.email });

  if (!user) {
    throw new BadRequestError("Invalid credentials");
  }

  if (!user.isVerified) {
    throw new BadRequestError("Please verify your email first");
  }

  const isPasswordValid = await user.comparePassword(data.password);
  if (!isPasswordValid) {
    throw new BadRequestError("Invalid credentials");
  }

  user.isActive = true;
  user.lastLogin = new Date();
  await user.save();

  return {
    user: user.omitPassword(),
  };
};

export const resendVerificationCodeService = async (
  unverifiedUserId: string,
) => {
  const { user: unverifiedUser } = await getUserByIdService(unverifiedUserId);

  const verification = await VerificationModel.findOne({
    userId: unverifiedUserId,
    type: VerificationEnum.EMAIL_VERIFICATION,
  });

  if (!verification || verification.expiresAt < new Date()) {
    throw new BadRequestError("No valid verification record found");
  }

  const now = Date.now();
  const updatedAt = new Date(verification.updatedAt).getTime();

  const isTooEarlyToResend =
    now - updatedAt < EMAIL_VERIFICATION_CODE_RESENT_TIME;

  if (isTooEarlyToResend) {
    throw new BadRequestError(
      "Too many requests. Please wait before retrying.",
    );
  }

  const newCode = generateVerificationCode();

  await verification.updateOne({
    code: newCode,
    expiresAt: VERIFICATION_EXPIRES_AT,
  });

  return {
    userEmail: unverifiedUser.email,
    verificationCode: newCode,
  };
};

export const verifyVerificationCodeService = async (code: string) => {
  const verification = await VerificationModel.findOne({
    code,
    type: VerificationEnum.EMAIL_VERIFICATION,
  });

  if (!verification || verification.expiresAt < new Date()) {
    throw new BadRequestError("Invalid or expired verification code");
  }

  const { user } = await getUserByIdService(verification.userId.toString());
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    user.isVerified = true;
    await user.save({ session });
    await verification.deleteOne({ session });

    await session.commitTransaction();
  } catch (error) {
    logError("Error in verifyVerificationCodeService", error);
    await session.abortTransaction();
    throw new AppError("Failed to verify verification code, Please try again");
  } finally {
    session.endSession();
  }

  return {
    user: user.omitPassword(),
  };
};

export const resetPasswordRequestService = async (email: string) => {
  const user = await UserModel.findOne({ email });
  if (!user) {
    throw new NotFoundError("User not found");
  }

  const token = generateResetToken();

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    await VerificationModel.deleteMany({
      userId: user._id,
      type: VerificationEnum.PASSWORD_RESET,
    }).session(session);

    const verification = new VerificationModel({
      userId: user._id,
      token,
      expiresAt: VERIFICATION_EXPIRES_AT,
      type: VerificationEnum.PASSWORD_RESET,
    });

    await verification.save({ session });

    await session.commitTransaction();
  } catch (error) {
    logError("Error in resetPasswordRequestService", error);
    await session.abortTransaction();
    throw new AppError(
      "Failed to serve reset password request, please try again",
    );
  } finally {
    session.endSession();
  }

  return {
    user: user.omitPassword(),
    token,
  };
};

export const resetPasswordService = async (token: string, password: string) => {
  const verification = await VerificationModel.findOne({
    token,
    type: VerificationEnum.PASSWORD_RESET,
  });

  if (!verification || verification.expiresAt < new Date()) {
    throw new BadRequestError("Invalid or expired token");
  }

  const { user } = await getUserByIdService(verification.userId.toString());

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    user.password = password;
    await user.save({ session });

    await verification.deleteOne({ session });

    await VerificationModel.deleteMany({
      userId: user._id,
      type: VerificationEnum.PASSWORD_RESET,
    }).session(session);

    await session.commitTransaction();
  } catch (error) {
    logError("Error in resetPasswordService", error);
    await session.abortTransaction();
    throw new AppError("Failed to reset password, please try again");
  } finally {
    session.endSession();
  }

  return {
    user: user.omitPassword(),
  };
};
