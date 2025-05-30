import { UserModel } from "@/models/user.model";
import { BadRequestError } from "@/errors/bad-request.error";

export const getUserByIdService = async (userId: string) => {
  const user = await UserModel.findById(userId);
  if (!user) {
    throw new BadRequestError("User not Found");
  }

  return { user };
};

export const getCurrentUserService = async (userId: string) => {
  const user = await UserModel.findById(userId)
    .populate("currentWorkspace")
    .select("-password");

  if (!user) {
    throw new BadRequestError("User not Found");
  }

  return { user };
};
