import mongoose from "mongoose";

import { Roles } from "@/enums/role.enum";
import { AppError } from "@/errors/app.error";
import { BadRequestError } from "@/errors/bad-request.error";
import { NotFoundError } from "@/errors/not-found.error";
import { MemberModel } from "@/models/member.model";
import { RoleModel } from "@/models/role.model";
import { UserDocument, UserModel } from "@/models/user.model";
import { WorkspaceModel } from "@/models/wrokspace.model";
import { logError } from "@/utils/logger";
import { SigninDto, SignupDto } from "@/validators/auth.validator";

export const signupService = async (data: SignupDto) => {
  const userExist = await UserModel.findOne({ email: data.email });
  if (userExist) {
    throw new BadRequestError("Email is already registered");
  }

  let user: UserDocument | null = null;

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

  if (!user) {
    throw new AppError("Unexpected error, Filed to create new User");
  }

  return {
    user: user.omitPassword(),
  };
};

export const signinService = async (data: SigninDto) => {
  const user = await UserModel.findOne({ email: data.email });

  if (!user) {
    throw new BadRequestError("Invalid credentials");
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
