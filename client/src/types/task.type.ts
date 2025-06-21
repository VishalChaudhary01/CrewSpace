import type { z } from "zod";

import type { Filters } from "@/components/workspace/task/task-table";

import type {
  BaseEntity,
  BaseResponse,
  BaseUser,
  Pagination,
} from "./common.type";

import type { TaskPriorityType, TaskStatusType } from "@/constants";
import type {
  createTaskSchema,
  updateTaskSchema,
} from "@/validators/task.validator";

export interface Task extends BaseEntity {
  title: string;
  description?: string;
  project?: {
    _id: string;
    name: string;
  };
  priority: TaskPriorityType;
  status: TaskStatusType;
  assignedTo: BaseUser | null;
  createdBy?: string;
  dueDate: string;
  taskCode: string;
}

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;

// REQUEST TYPES
export interface CreateTaskRequest {
  workspaceId: string;
  inputs: CreateTaskInput;
}

export interface UpdateTaskRequest {
  workspaceId: string;
  projectId: string;
  taskId: string;
  inputs: UpdateTaskInput;
}

export interface AllTaskRequest {
  workspaceId: string;
  projectId?: string | null;
  pageSize?: number;
  pageNumber?: number;
  filters?: Filters;
  dueDate?: string | null;
}

export interface DeleteTaskRequest {
  workspaceId: string;
  taskId: string;
}

// Response Types
export type TaskResponse = BaseResponse<{ task: Task }>;

export type AllTaskResponse = BaseResponse<{
  tasks: Task[];
  pagination: Pagination;
}>;
