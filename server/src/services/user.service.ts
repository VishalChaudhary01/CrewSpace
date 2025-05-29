import { UserModel } from "@/models/user.model";
import { BadRequestError } from "@/errors/bad-request.error";
import { WorkspaceModel } from "@/models/wrokspace.model";

export const getCurrentUserService = async (userId: string) => {
  const user = await UserModel.findById(userId)
    .populate("currentWorkspace")
    .select("-password");

  if (!user) {
    throw new BadRequestError("User not Found");
  }
  const works = await WorkspaceModel.find({ userId: user._id });
  console.log(works, user);

  return { user };
};
