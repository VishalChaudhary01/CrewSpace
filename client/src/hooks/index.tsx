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
import type { WorkspaceRequest } from "@/types/workspace.type";
import type { AllProjectRequest, ProjectRequest } from "@/types/project.type";
import type { AllTaskRequest } from "@/types/task.type";

export const useAuth = () => {
  const query = useQuery({
    queryKey: ["auth-user"],
    queryFn: getCurrentUserQueryFn,
    staleTime: 0,
    retry: 2,
  });

  return query;
};

export const useGetWorkspace = ({ workspaceId }: WorkspaceRequest) => {
  const query = useQuery({
    queryKey: ["workspace", workspaceId],
    queryFn: () => getWorkspaceWithMembersQueryFn({ workspaceId }),
    staleTime: 0,
    retry: 2,
    enabled: !!workspaceId,
  });

  return query;
};

export const useGetMembersInWorkspace = ({ workspaceId }: WorkspaceRequest) => {
  const query = useQuery({
    queryKey: ["members", workspaceId],
    queryFn: () => getMembersInWorkspaceQueryFn({ workspaceId }),
    staleTime: Infinity,
  });

  return query;
};

export const useGetAllWorkspacesUserIsMember = () => {
  const query = useQuery({
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
  const query = useQuery({
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

export const useGetProjectAnalytics = (
  workspaceId: string,
  projectId: string,
) => {
  const query = useQuery({
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
  const query = useQuery({
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

export const useGetAllTasks = ({
  workspaceId,
  filters,
  pageSize,
  pageNumber,
}: AllTaskRequest) => {
  const query = useQuery({
    queryKey: ["all-tasks", workspaceId, pageSize, pageNumber, filters],
    queryFn: () =>
      getAllTasksQueryFn({
        workspaceId,
        filters: {
          ...filters,
        },
        pageNumber,
        pageSize,
      }),
    staleTime: 0,
    enabled: !!workspaceId,
  });
  return query;
};
