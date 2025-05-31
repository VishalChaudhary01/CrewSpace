import { Request, Response } from "express";
import { getUserId } from "./user.controller";
import { StatusCode } from "@/config/http.config";
import { Permissions } from "@/enums/role.enum";
import { logger } from "@/utils/logger";
import { roleGuard } from "@/utils/roleGuard";
import { idSchema } from "@/validators/common.validator";
import {
  createProjectSchema,
  updateProjectSchema,
} from "@/validators/project.validator";
import {
  createProjectService,
  deleteProjectService,
  getProjectAnalyticsService,
  getProjectByIdAndWorkspaceIdService,
  getProjectsInWorkspaceService,
  updateProjectService,
} from "@/services/project.service";
import { getMemberRoleInWorkspaceService } from "@/services/member.service";

export const createProject = async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const data = createProjectSchema.parse(req.body);
  const workspaceId = idSchema.parse(req.params.workspaceId);

  const { role } = await getMemberRoleInWorkspaceService(userId, workspaceId);
  roleGuard(role, [Permissions.CREATE_PROJECT]);

  logger.info(
    `Creating project for  user ${userId} in workspace ${workspaceId}`,
  );

  const { project } = await createProjectService(userId, workspaceId, data);

  res.status(StatusCode.CREATED).json({
    message: "Project created successfully",
    data: {
      project,
    },
  });
};

export const getAllProjectsInWorkspace = async (
  req: Request,
  res: Response,
) => {
  const userId = getUserId(req);
  const workspaceId = idSchema.parse(req.params.workspaceId);

  const { role } = await getMemberRoleInWorkspaceService(userId, workspaceId);
  roleGuard(role, [Permissions.VIEW_ONLY]);

  const pageSize = parseInt(req.query.pageSize as string) || 10;
  const pageNumber = parseInt(req.query.pageNumber as string) || 1;

  logger.info(
    `Fetching all projects in workspace: ${workspaceId} for user ${userId}`,
  );

  const { projects, totalCount, totalPages, skip } =
    await getProjectsInWorkspaceService(workspaceId, pageSize, pageNumber);

  res.status(StatusCode.OK).json({
    message: "Project fetched successfully",
    data: {
      projects,
      pagination: {
        totalCount,
        pageSize,
        pageNumber,
        totalPages,
        skip,
        limit: pageSize,
      },
    },
  });
};

export const getProjectByIdAndWorkspaceId = async (
  req: Request,
  res: Response,
) => {
  const userId = getUserId(req);
  const projectId = idSchema.parse(req.params.id);
  const workspaceId = idSchema.parse(req.params.workspaceId);

  const { role } = await getMemberRoleInWorkspaceService(userId, workspaceId);
  roleGuard(role, [Permissions.VIEW_ONLY]);

  logger.info(
    `Fetching project-by-id id in workspace: ${workspaceId} for user ${userId}`,
  );

  const { project } = await getProjectByIdAndWorkspaceIdService(
    workspaceId,
    projectId,
  );

  res.status(StatusCode.OK).json({
    message: "Project fetched successfully",
    data: {
      project,
    },
  });
};

export const getProjectAnalytics = async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const projectId = idSchema.parse(req.params.id);
  const workspaceId = idSchema.parse(req.params.workspaceId);

  const { role } = await getMemberRoleInWorkspaceService(userId, workspaceId);
  roleGuard(role, [Permissions.VIEW_ONLY]);

  logger.info(
    `Fetching project analytics of project: ${projectId} in workspace: ${workspaceId} for user ${userId}`,
  );

  const { analytics } = await getProjectAnalyticsService(
    workspaceId,
    projectId,
  );

  res.status(StatusCode.OK).json({
    message: "Project analytics retrieved successfully",
    data: {
      analytics,
    },
  });
};

export const updateProject = async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const projectId = idSchema.parse(req.params.id);
  const workspaceId = idSchema.parse(req.params.workspaceId);
  const data = updateProjectSchema.parse(req.body);

  const { role } = await getMemberRoleInWorkspaceService(userId, workspaceId);
  roleGuard(role, [Permissions.EDIT_PROJECT]);

  logger.info(
    `Updating projects ${projectId} in workspace: ${workspaceId} by user ${userId}`,
  );

  const { project } = await updateProjectService(workspaceId, projectId, data);

  logger.info(
    `Project ${projectId} updated in workspace: ${workspaceId} by user ${userId}`,
  );

  res.status(StatusCode.OK).json({
    message: "Project updated successfully",
    data: {
      project,
    },
  });
};

export const deleteProject = async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const projectId = idSchema.parse(req.params.id);
  const workspaceId = idSchema.parse(req.params.workspaceId);

  const { role } = await getMemberRoleInWorkspaceService(userId, workspaceId);
  roleGuard(role, [Permissions.DELETE_PROJECT]);

  logger.info(
    `Delete request of project ${projectId} in workspace: ${workspaceId} by user ${userId}`,
  );

  await deleteProjectService(workspaceId, projectId);

  logger.info(
    `Project ${projectId} deleted in workspace: ${workspaceId} by user ${userId}`,
  );

  res.status(StatusCode.OK).json({
    message: "Project deleted successfully",
  });
};
