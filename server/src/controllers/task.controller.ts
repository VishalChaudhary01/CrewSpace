import { StatusCode } from "@/config/http.config";
import { Request, Response } from "express";
import { getUserId } from "./user.controller";
import { idSchema } from "@/validators/common.validator";
import { getMemberRoleInWorkspaceService } from "@/services/member.service";
import { roleGuard } from "@/utils/roleGuard";
import { Permissions } from "@/enums/role.enum";
import {
  createTaskSchema,
  updateTaskSchema,
} from "@/validators/task.validator";
import {
  createTaskService,
  deleteTaskService,
  getAllTasksService,
  getTaskByIdService,
  updateTaskService,
} from "@/services/task.service";
import { logger } from "@/utils/logger";

export const createTask = async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const data = createTaskSchema.parse(req.body);
  const projectId = idSchema.parse(req.params.projectId);
  const workspaceId = idSchema.parse(req.params.workspaceId);

  logger.info(
    `Create new task request in workspace: ${workspaceId} by user: ${userId}`,
  );

  const { role } = await getMemberRoleInWorkspaceService(userId, workspaceId);
  roleGuard(role, [Permissions.CREATE_TASK]);

  const { task } = await createTaskService(
    workspaceId,
    projectId,
    userId,
    data,
  );

  logger.info(`Task created in workspace: ${workspaceId} by user: ${userId}`);

  res.status(StatusCode.OK).json({
    message: "Task created successfully",
    data: {
      task,
    },
  });
};

export const updateTask = async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const body = updateTaskSchema.parse(req.body);
  const taskId = idSchema.parse(req.params.id);
  const projectId = idSchema.parse(req.params.projectId);
  const workspaceId = idSchema.parse(req.params.workspaceId);

  logger.info(
    `Update task: ${taskId} request of project: ${projectId} in workspace: ${workspaceId} by user: ${userId}`,
  );

  const { role } = await getMemberRoleInWorkspaceService(userId, workspaceId);
  roleGuard(role, [Permissions.EDIT_TASK]);

  const { updatedTask } = await updateTaskService(
    workspaceId,
    projectId,
    taskId,
    body,
  );

  logger.info(
    `Task: ${taskId} updated of project: ${projectId} in workspace: ${workspaceId} by user: ${userId}`,
  );
  res.status(StatusCode.OK).json({
    message: "Task updated successfully",
    data: {
      updatedTask,
    },
  });
};

export const getAllTasks = async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const workspaceId = idSchema.parse(req.params.workspaceId);

  const filters = {
    projectId: req.query.projectId as string | undefined,
    status: req.query.status
      ? (req.query.status as string)?.split(",")
      : undefined,
    priority: req.query.priority
      ? (req.query.priority as string)?.split(",")
      : undefined,
    assignedTo: req.query.assignedTo
      ? (req.query.assignedTo as string)?.split(",")
      : undefined,
    keyword: req.query.keyword as string | undefined,
    dueDate: req.query.dueDate as string | undefined,
  };

  const paging = {
    pageSize: parseInt(req.query.pageSize as string) || 10,
    pageNumber: parseInt(req.query.pageNumber as string) || 1,
  };

  const { role } = await getMemberRoleInWorkspaceService(userId, workspaceId);
  roleGuard(role, [Permissions.VIEW_ONLY]);

  logger.info(
    `Fetching all tasks in workspace: ${workspaceId} for user: ${userId}`,
  );

  const { tasks, pagination } = await getAllTasksService(
    workspaceId,
    filters,
    paging,
  );

  res.status(StatusCode.OK).json({
    message: "All tasks fetched successfully",
    data: {
      tasks,
      pagination,
    },
  });
};

export const getTaskById = async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const taskId = idSchema.parse(req.params.id);
  const projectId = idSchema.parse(req.params.projectId);
  const workspaceId = idSchema.parse(req.params.workspaceId);

  const { role } = await getMemberRoleInWorkspaceService(userId, workspaceId);
  roleGuard(role, [Permissions.VIEW_ONLY]);

  logger.info(
    `Fetching task: ${taskId} of project: ${projectId} in workspace: ${workspaceId} for user: ${userId}`,
  );

  const { task } = await getTaskByIdService(workspaceId, projectId, taskId);

  res.status(StatusCode.OK).json({
    message: "Task fetched successfully",
    data: {
      task,
    },
  });
};

export const deleteTask = async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const taskId = idSchema.parse(req.params.id);
  const workspaceId = idSchema.parse(req.params.workspaceId);

  logger.info(
    `Delete task: ${taskId} request in workspace: ${workspaceId} by user: ${userId}`,
  );

  const { role } = await getMemberRoleInWorkspaceService(userId, workspaceId);
  roleGuard(role, [Permissions.DELETE_TASK]);

  await deleteTaskService(workspaceId, taskId);

  logger.info(
    `Task: ${taskId} Deleted in workspace: ${workspaceId} by user: ${userId}`,
  );
  res.status(StatusCode.OK).json({
    message: "Task deleted successfully",
  });
};
