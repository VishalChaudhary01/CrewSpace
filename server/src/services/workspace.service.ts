import mongoose from "mongoose";
import { TaskModel } from "@/models/task.model";
import { RoleModel } from "@/models/role.model";
import { UserModel } from "@/models/user.model";
import { MemberModel } from "@/models/member.model";
import { ProjectModel } from "@/models/project.model";
import { WorkspaceDocument, WorkspaceModel } from "@/models/wrokspace.model";
import { Roles } from "@/enums/role.enum";
import { TaskStatus } from "@/enums/task.enum";
import { AppError } from "@/errors/app.error";
import { NotFoundError } from "@/errors/not-found.error";
import { UnauthorizedError } from "@/errors/unauthorize.error";
import { logError } from "@/utils/logger";
import {
  CreateWorkspaceDto,
  UpdateWorkspaceDto,
} from "@/validators/workspace.validator";
import { getUserByIdService } from "./user.service";
import { BadRequestError } from "@/errors/bad-request.error";

// GET WORKSPACE BY ID -> utils
export const getWorkspaceByIdService = async (workspaceId: string) => {
  const workspace = await WorkspaceModel.findById(workspaceId);
  if (!workspace) {
    throw new NotFoundError("Workspace not found");
  }
  return { workspace };
};

// CREATE NEW WORKSPACE
export const createWorkspaceService = async (
  userId: string,
  data: CreateWorkspaceDto,
) => {
  const { user } = await getUserByIdService(userId);

  const ownerRole = await RoleModel.findOne({ name: Roles.OWNER });
  if (!ownerRole) {
    throw new NotFoundError("Owner role not found");
  }

  let workspace: WorkspaceDocument | null = null;

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    workspace = new WorkspaceModel({
      ...data,
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
    logError("Failed to create workspace", error);
    await session.abortTransaction();
    throw new AppError("Failed to create workspace, Please try again later.");
  } finally {
    session.endSession();
  }

  return {
    workspace,
  };
};

// GET WORKSPACES WHERE USER IS A MEMBER
export const getAllWorkspacesUserIsMemberService = async (userId: string) => {
  const memberships = await MemberModel.find({ userId })
    .populate("workspaceId")
    .exec();

  // Extract workspace details from memberships
  const workspaces = memberships.map((membership) => membership.workspaceId);

  return { workspaces };
};

// GET WORKSPACES DETAILS WITH ALL MEMBERS
export const getWorkspaceWithMembersService = async (workspaceId: string) => {
  const { workspace } = await getWorkspaceByIdService(workspaceId);

  const members = await MemberModel.find({
    workspaceId,
  }).populate("role");

  const workspaceWithMembers = {
    ...workspace.toObject(),
    members,
  };

  return {
    workspace: workspaceWithMembers,
  };
};

// GET ALL MEMEBERS IN WORKSPACE
export const getWorkspaceMembersService = async (workspaceId: string) => {
  const members = await MemberModel.find({ workspaceId })
    .populate("userId", "name email")
    .populate("role", "name");

  const roles = await RoleModel.find({}, { name: 1 })
    .select("-permission")
    .lean();

  return { members, roles };
};

// GET WORKSPACE ANALYTICS
export const getWorkspaceAnalyticsService = async (workspaceId: string) => {
  const currentDate = new Date();

  const result = await TaskModel.aggregate([
    {
      $match: {
        workspace: new mongoose.Types.ObjectId(workspaceId),
      },
    },
    {
      $facet: {
        totalTasks: [{ $count: "count" }],
        overdueTasks: [
          {
            $match: {
              dueDate: { $lt: currentDate },
              status: { $ne: TaskStatus.DONE },
            },
          },
          { $count: "count" },
        ],
        completedTasks: [
          {
            $match: {
              status: TaskStatus.DONE,
            },
          },
          { $count: "count" },
        ],
      },
    },
  ]);

  const analytics = {
    totalTasks: result[0].totalTasks[0]?.count || 0,
    overdueTasks: result[0].overdueTasks[0]?.count || 0,
    completedTasks: result[0].completedTasks[0]?.count || 0,
  };

  return { analytics };
};

// CHANGE MEMBER ROLE
export const changeMemberRoleService = async (
  workspaceId: string,
  memberId: string,
  roleId: string,
) => {
  await getWorkspaceByIdService(workspaceId);
  const role = await RoleModel.findById(roleId);
  if (!role) {
    throw new NotFoundError("Role not found");
  }

  const member = await MemberModel.findOne({
    userId: memberId,
    workspaceId,
  });
  if (!member) {
    throw new BadRequestError("Member not found in the workspace");
  }

  member.role = role;
  await member.save();

  return { member };
};

// UPDATE WORKSPACE BY ID
export const updateWorkspaceByIdService = async (
  workspaceId: string,
  inputs: UpdateWorkspaceDto,
) => {
  const { name, description } = inputs;

  const { workspace } = await getWorkspaceByIdService(workspaceId);

  if (name) workspace.name = name;
  if (description) workspace.description = description;
  await workspace.save();

  return {
    workspace,
  };
};

// DELETE WORKSPACE BY ID
export const deleteWorkspaceService = async (
  workspaceId: string,
  userId: string,
) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { workspace } = await getWorkspaceByIdService(workspaceId);

    // Check if the user owns the workspace
    if (workspace.owner.toString() !== userId) {
      throw new UnauthorizedError(
        "You are not authorized to delete this workspace",
      );
    }

    const user = await UserModel.findById(userId).session(session);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    await ProjectModel.deleteMany({ workspace: workspace._id }).session(
      session,
    );
    await TaskModel.deleteMany({ workspace: workspace._id }).session(session);

    await MemberModel.deleteMany({ workspaceId: workspace._id }).session(
      session,
    );

    // Update the user's currentWorkspace if it matches the deleted workspace
    if (user?.currentWorkspace?.equals(workspaceId)) {
      const memberWorkspace = await MemberModel.findOne({ userId }).session(
        session,
      );
      // Update the user's currentWorkspace
      user.currentWorkspace = memberWorkspace
        ? memberWorkspace.workspaceId
        : null;

      await user.save({ session });
    }

    await workspace.deleteOne({ session });

    await session.commitTransaction();
    session.endSession();

    return {
      currentWorkspace: user.currentWorkspace,
    };
  } catch (error) {
    logError(`Failed to delete workspace of id: ${workspaceId}`, error);
    await session.abortTransaction();
    session.endSession();
    throw new AppError("Failed to delete workspace. Please try again later.");
  }
};
