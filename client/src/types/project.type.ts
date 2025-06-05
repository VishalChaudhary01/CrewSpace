import type { z } from "zod";
import type {
  createProjectSchema,
  updateProjectSchema,
} from "@/validators/project.validator";
import type {
  BaseEntity,
  BaseResponse,
  BaseUser,
  Pagination,
} from "./common.type";

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;

export type Project = BaseEntity &
  CreateProjectInput & {
    workspace: string;
    createdBy: BaseUser;
  };

// REQUEST TYPES
export type ProjectRequest = {
  workspaceId: string;
  projectId: string;
};

export type CreateProjectRequest = {
  workspaceId: string;
  data: CreateProjectInput;
};

export type UpdateProjectRequest = ProjectRequest & {
  data: UpdateProjectInput;
};

export type AllProjectRequest = {
  workspaceId: string;
  pageNumber?: number;
  pageSize?: number;
  keyword?: string;
  skip?: boolean;
};

// Response Types
export type ProjectResponse = BaseResponse<{ project: Project }>;

export type AllProjectResponse = BaseResponse<{
  projects: Project[];
  pagination: Pagination;
}>;
