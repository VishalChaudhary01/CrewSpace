import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  getAllTasksQueryFn,
  getAllWorkspacesUserIsMemberQueryFn,
  getCurrentUserQueryFn,
  getMembersInWorkspaceQueryFn,
  getProjectAnalyticsQueryFn,
  getProjectByIdQueryFn,
  getProjectsInWorkspaceQueryFn,
  getWorkspaceWithMembersQueryFn,
} from "@/lib/api";
import type {
  AllWorkspacesResponse,
  GetMembersInWorkspaceResponse,
  WorkspaceRequest,
  WorkspaceWithMembersResponse,
} from "@/types/workspace.type";
import type { CustomError } from "@/types/error.type";
import type { UserResponse } from "@/types/user.type";
import type { AnalyticsResponse } from "@/types/common.type";
import type { AllTaskRequest, AllTaskResponse } from "@/types/task.type";
import type {
  AllProjectRequest,
  AllProjectResponse,
  ProjectRequest,
  ProjectResponse,
} from "@/types/project.type";

export const useAuth = () => {
  const query = useQuery<UserResponse, CustomError>({
    queryKey: ["auth-user"],
    queryFn: getCurrentUserQueryFn,
    staleTime: 0,
    retry: 2,
  });

  return query;
};

export const useGetWorkspace = ({ workspaceId }: WorkspaceRequest) => {
  const query = useQuery<WorkspaceWithMembersResponse, CustomError>({
    queryKey: ["workspace", workspaceId],
    queryFn: () => getWorkspaceWithMembersQueryFn({ workspaceId }),
    staleTime: 0,
    retry: 2,
    enabled: !!workspaceId,
  });

  return query;
};

export const useGetMembersInWorkspace = ({ workspaceId }: WorkspaceRequest) => {
  const query = useQuery<GetMembersInWorkspaceResponse, CustomError>({
    queryKey: ["members", workspaceId],
    queryFn: () => getMembersInWorkspaceQueryFn({ workspaceId }),
    staleTime: Infinity,
  });

  return query;
};

export const useGetAllWorkspacesUserIsMember = () => {
  const query = useQuery<AllWorkspacesResponse, CustomError>({
    queryKey: ["user-workspaces"],
    queryFn: () => getAllWorkspacesUserIsMemberQueryFn(),
    staleTime: Infinity,
  });

  return query;
};

export const useGetProjectsInWorkspace = ({
  workspaceId,
  pageSize,
  pageNumber,
  skip = false,
}: AllProjectRequest) => {
  const query = useQuery<AllProjectResponse, CustomError>({
    queryKey: ["all-projects", workspaceId, pageNumber, pageSize],
    queryFn: () =>
      getProjectsInWorkspaceQueryFn({
        workspaceId,
        pageNumber,
        pageSize,
      }),
    staleTime: Infinity,
    placeholderData: skip ? undefined : keepPreviousData,
    enabled: !skip,
  });

  return query;
};

export const useGetProjectAnalytics = ({
  workspaceId,
  projectId,
}: ProjectRequest) => {
  const query = useQuery<AnalyticsResponse, CustomError>({
    queryKey: ["project-analytics", projectId],
    queryFn: () => getProjectAnalyticsQueryFn({ workspaceId, projectId }),
    staleTime: 0,
    enabled: !!projectId,
  });

  return query;
};

export const useGetProjectById = ({
  workspaceId,
  projectId,
}: ProjectRequest) => {
  const query = useQuery<ProjectResponse, CustomError>({
    queryKey: ["project", projectId],
    queryFn: () =>
      getProjectByIdQueryFn({
        workspaceId,
        projectId,
      }),
    staleTime: Infinity,
    enabled: !!projectId,
    placeholderData: keepPreviousData,
  });

  return query;
};

// Hook
export const useGetAllTasks = ({
  workspaceId,
  projectId,
  pageSize,
  pageNumber,
  filters,
  dueDate,
}: AllTaskRequest) => {
  const query = useQuery<AllTaskResponse, CustomError>({
    queryKey: [
      "all-tasks",
      workspaceId,
      projectId,
      pageSize,
      pageNumber,
      filters,
      dueDate,
    ],
    queryFn: () =>
      getAllTasksQueryFn({
        workspaceId,
        projectId,
        pageSize,
        pageNumber,
        dueDate,
        filters,
      }),
    staleTime: 0,
    enabled: !!workspaceId,
  });

  return query;
};
