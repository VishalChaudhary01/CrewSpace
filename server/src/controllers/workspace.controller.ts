import { Request, Response } from "express";
import { StatusCode } from "@/config/http.config";
import { Permissions } from "@/enums/role.enum";
import { getMemberRoleInWorkspaceService } from "@/services/member.service";
import {
  createWorkspaceService,
  getAllWorkspacesUserIsMemberService,
  getWorkspaceAnalyticsService,
  getWorkspaceWithMembersService,
  getWorkspaceMembersService,
  changeMemberRoleService,
  updateWorkspaceByIdService,
  deleteWorkspaceService,
} from "@/services/workspace.service";
import { roleGuard } from "@/utils/roleGuard";
import { idSchema } from "@/validators/common.validator";
import {
  changeRoleSchema,
  createWorkspaceSchema,
  updateWorkspaceSchema,
} from "@/validators/workspace.validator";
import { logger } from "@/utils/logger";
import { getUserId } from "./user.controller";

export const createWorkspace = async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const body = createWorkspaceSchema.parse(req.body);
  logger.info(`User ${userId} is creating a workspace`);

  const { workspace } = await createWorkspaceService(userId, body);

  logger.info(
    `Workspace ${workspace._id} created successfully by user ${userId}`,
  );
  res.status(StatusCode.CREATED).json({
    message: "Workspace created successfully",
    data: {
      workspace,
    },
  });
};

export const getAllWorkspacesUserIsMember = async (
  req: Request,
  res: Response,
) => {
  const userId = getUserId(req);
  logger.info(`Fetching all workspaces for user ${userId}`);

  const { workspaces } = await getAllWorkspacesUserIsMemberService(userId);

  res.status(StatusCode.OK).json({
    message: "User workspaces fetched successfully",
    data: {
      workspaces,
    },
  });
};

export const getWorkspaceWithMembers = async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const workspaceId = idSchema.parse(req.params.id);

  await getMemberRoleInWorkspaceService(userId, workspaceId);
  logger.info(`User ${userId} fetching workspace ${workspaceId} with members`);

  const { workspace } = await getWorkspaceWithMembersService(workspaceId);

  res.status(StatusCode.OK).json({
    message: "Workspace fetched successfully",
    workspace,
  });
};

export const getWorkspaceMembers = async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const workspaceId = idSchema.parse(req.params.id);

  const { role } = await getMemberRoleInWorkspaceService(userId, workspaceId);
  roleGuard(role, [Permissions.VIEW_ONLY]);

  logger.info(`User ${userId} fetching workspace ${workspaceId} members`);

  const { members, roles } = await getWorkspaceMembersService(workspaceId);

  res.status(StatusCode.OK).json({
    message: "Workspace members retrieved successfully",
    data: {
      members,
      roles,
    },
  });
};

export const getWorkspaceAnalytics = async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const workspaceId = idSchema.parse(req.params.id);

  const { role } = await getMemberRoleInWorkspaceService(userId, workspaceId);
  roleGuard(role, [Permissions.VIEW_ONLY]);

  logger.info(
    `User ${userId} fetching workspace ${workspaceId} analytics with members`,
  );
  const { analytics } = await getWorkspaceAnalyticsService(workspaceId);

  res.status(StatusCode.OK).json({
    message: "Workspace analytics retrieved successfully",
    data: {
      analytics,
    },
  });
};

export const changeWorkspaceMemberRole = async (
  req: Request,
  res: Response,
) => {
  const userId = getUserId(req);
  const workspaceId = idSchema.parse(req.params.id);
  const { memberId, roleId } = changeRoleSchema.parse(req.body);

  const { role } = await getMemberRoleInWorkspaceService(userId, workspaceId);
  roleGuard(role, [Permissions.CHANGE_MEMBER_ROLE]);

  logger.info(
    `Changing role for member ${memberId} in workspace ${workspaceId} to role ${roleId}`,
  );
  const { member } = await changeMemberRoleService(
    workspaceId,
    memberId,
    roleId,
  );

  logger.info(
    `Member ${memberId}'s role updated to ${roleId} in workspace ${workspaceId}`,
  );

  res.status(StatusCode.OK).json({
    message: "Member Role changed successfully",
    data: {
      member,
    },
  });
};

export const updateWorkspaceById = async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const workspaceId = idSchema.parse(req.params.id);
  const { name, description } = updateWorkspaceSchema.parse(req.body);

  const { role } = await getMemberRoleInWorkspaceService(userId, workspaceId);
  roleGuard(role, [Permissions.EDIT_WORKSPACE]);

  const { workspace } = await updateWorkspaceByIdService(workspaceId, {
    name,
    description,
  });

  res.status(StatusCode.OK).json({
    message: "Workspace updated successfully",
    data: {
      workspace,
    },
  });
};

export const deleteWorkspaceById = async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const workspaceId = idSchema.parse(req.params.id);

  const { role } = await getMemberRoleInWorkspaceService(userId, workspaceId);
  roleGuard(role, [Permissions.DELETE_WORKSPACE]);
  logger.info(`User ${userId} attempting to delete workspace ${workspaceId}`);

  const { currentWorkspace } = await deleteWorkspaceService(
    workspaceId,
    userId,
  );

  res.status(StatusCode.OK).json({
    message: "Workspace deleted successfully",
    currentWorkspace,
  });
};
