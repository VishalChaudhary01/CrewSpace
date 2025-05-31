/* eslint-disable @typescript-eslint/no-explicit-any */
import { TaskPriority, TaskStatus } from "@/enums/task.enum";
import { BadRequestError } from "@/errors/bad-request.error";
import { NotFoundError } from "@/errors/not-found.error";
import { MemberModel } from "@/models/member.model";
import { TaskModel } from "@/models/task.model";
import { CreateTaskDto, UpdateTaskDto } from "@/validators/task.validator";
import { getProjectService } from "./project.service";

export const createTaskService = async (
  workspaceId: string,
  projectId: string,
  userId: string,
  data: CreateTaskDto,
) => {
  const { title, description, priority, status, assignedTo, dueDate } = data;

  await getProjectService(projectId, workspaceId);

  if (assignedTo) {
    const isAssignedUserMember = await MemberModel.exists({
      userId: assignedTo,
      workspaceId,
    });
    if (!isAssignedUserMember) {
      throw new Error("Assigned user is not a member of this workspace.");
    }
  }

  const task = new TaskModel({
    title,
    description,
    priority: priority || TaskPriority.MEDIUM,
    status: status || TaskStatus.TODO,
    assignedTo,
    createdBy: userId,
    workspace: workspaceId,
    project: projectId,
    dueDate,
  });

  await task.save();

  return { task };
};

export const updateTaskService = async (
  workspaceId: string,
  projectId: string,
  taskId: string,
  data: UpdateTaskDto,
) => {
  await getProjectService(projectId, workspaceId);

  const task = await TaskModel.findById(taskId);
  if (!task || task.project.toString() !== projectId.toString()) {
    throw new NotFoundError(
      "Task not found or does not belong to this project",
    );
  }

  const updatedTask = await TaskModel.findByIdAndUpdate(
    taskId,
    { ...data },
    { new: true },
  );
  if (!updatedTask) {
    throw new BadRequestError("Failed to update task");
  }

  return { updatedTask };
};

export const getAllTasksService = async (
  workspaceId: string,
  filters: {
    projectId?: string;
    status?: string[];
    priority?: string[];
    assignedTo?: string[];
    keyword?: string;
    dueDate?: string;
  },
  paging: {
    pageSize: number;
    pageNumber: number;
  },
) => {
  const query: Record<string, any> = {
    workspace: workspaceId,
  };

  if (filters.projectId) {
    query.project = filters.projectId;
  }

  if (filters.status && filters.status?.length > 0) {
    query.status = { $in: filters.status };
  }

  if (filters.priority && filters.priority?.length > 0) {
    query.priority = { $in: filters.priority };
  }

  if (filters.assignedTo && filters.assignedTo?.length > 0) {
    query.assignedTo = { $in: filters.assignedTo };
  }

  if (filters.keyword && filters.keyword !== undefined) {
    query.title = { $regex: filters.keyword, $options: "i" };
  }

  if (filters.dueDate) {
    query.dueDate = {
      $eq: new Date(filters.dueDate),
    };
  }

  const { pageSize, pageNumber } = paging;
  const skip = (pageNumber - 1) * pageSize;

  const [tasks, totalCount] = await Promise.all([
    TaskModel.find(query)
      .skip(skip)
      .limit(pageSize)
      .sort({ createdAt: -1 })
      .populate("assignedTo", "_id name profilePicture -password")
      .populate("project", "_id emoji name"),
    TaskModel.countDocuments(query),
  ]);

  const totalPages = Math.ceil(totalCount / pageSize);

  return {
    tasks,
    pagination: {
      pageSize,
      pageNumber,
      totalCount,
      totalPages,
      skip,
    },
  };
};

export const getTaskByIdService = async (
  workspaceId: string,
  projectId: string,
  taskId: string,
) => {
  await getProjectService(projectId, workspaceId);

  const task = await TaskModel.findOne({
    _id: taskId,
    workspace: workspaceId,
    project: projectId,
  }).populate("assignedTo", "_id name");
  if (!task) {
    throw new NotFoundError("Task not found.");
  }

  return { task };
};

export const deleteTaskService = async (
  workspaceId: string,
  taskId: string,
) => {
  const task = await TaskModel.findOneAndDelete({
    _id: taskId,
    workspace: workspaceId,
  });
  if (!task) {
    throw new NotFoundError(
      "Task not found or does not belong to the specified workspace",
    );
  }

  return;
};
