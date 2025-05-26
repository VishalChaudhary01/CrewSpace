import mongoose from "mongoose";
import { UserModel } from "@/models/user.model";
import { Verification } from "@/enums/verification.enum";
import { BadRequestError } from "@/errors/bad-request.error";
import { VerificationModel } from "@/models/verification.model";
import { generateResetToken, generateVerificationCode } from "@/utils/crypto";
import { SigninDto, SignupDto } from "@/validators/auth.validator";
import { WorkspaceModel } from "@/models/wrokspace.model";
import { RoleModel } from "@/models/role.model";
import { Roles } from "@/enums/role.enum";
import { NotFoundError } from "@/errors/not-found.error";
import { MemberModel } from "@/models/member.model";
import { AppError } from "@/errors/app.error";

export const signupService = async (data: SignupDto) => {
  const userExist = await UserModel.findOne({ email: data.email });
  if (userExist) {
    throw new BadRequestError("Email is already registered");
  }

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const user = new UserModel(data);
    await user.save({ session });

    const workspace = new WorkspaceModel({
      name: "My Workspace",
      description: `Workspace created for ${user.name}`,
      owner: user._id,
    });
    await workspace.save({ session });

    const ownerRole = await RoleModel.findOne({ name: Roles.OWNER }).session(
      session,
    );
    if (!ownerRole) {
      throw new NotFoundError("Owner role not found");
    }

    const member = new MemberModel({
      userId: user._id,
      workspaceId: workspace._id,
      role: ownerRole._id,
      joinedAt: new Date(),
    });
    await member.save({ session });

    const verificationCode = generateVerificationCode();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    const verification = new VerificationModel({
      userId: user._id,
      code: verificationCode,
      expiresAt,
      type: Verification.EMAIL_VERIFICATION,
    });
    await verification.save({ session });

    if (!verification.code) {
      throw new AppError(
        "Something went wrong while generating verification code",
      );
    }

    await session.commitTransaction();

    return {
      user: user.omitPassword(),
      verificationCode: verification.code,
    };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
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

export const verifyVerificationCodeService = async (code: string) => {
  const verification = await VerificationModel.findOne({
    code,
    type: Verification.EMAIL_VERIFICATION,
  });

  if (!verification || verification.expiresAt < new Date()) {
    throw new BadRequestError("Invalid or expired verification code");
  }

  const user = await UserModel.findById(verification.userId);
  if (!user) {
    throw new NotFoundError("User not found");
  }

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    user.isVerified = true;
    await user.save({ session });
    await verification.deleteOne({ session });

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw error;
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
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    await VerificationModel.deleteMany({
      userId: user._id,
      type: Verification.PASSWORD_RESET,
    }).session(session);

    const verification = new VerificationModel({
      userId: user._id,
      token,
      expiresAt,
      type: Verification.PASSWORD_RESET,
    });

    await verification.save({ session });

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw error;
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
    type: Verification.PASSWORD_RESET,
  });

  console.log("verificationinot::", verification);

  if (!verification || verification.expiresAt < new Date()) {
    throw new BadRequestError("Invalid or expired token");
  }

  const user = await UserModel.findById(verification.userId);
  if (!user) {
    throw new NotFoundError("User not found");
  }

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    user.password = password;
    await user.save({ session });

    await verification.deleteOne({ session });

    await VerificationModel.deleteMany({
      userId: user._id,
      type: Verification.PASSWORD_RESET,
    }).session(session);

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }

  return {
    user: user.omitPassword(),
  };
};
