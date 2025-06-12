import API from "./axios-client";
import type { UserResponse } from "@/types/user.type";
import type {
  SigninRequest,
  SigninResponse,
  SignupRequest,
} from "@/types/auth.type";
import type {
  AllWorkspacesResponse,
  ChangeWorkspaceMemberRoleRequest,
  ChangeWorkspaceMemberRoleResponse,
  CreateWorkspaceRequest,
  GetMembersInWorkspaceResponse,
  InvitedUserJoinWorkspaceRequest,
  InvitedUserJoinWorkspaceResponse,
  UpdateWorkspaceRequest,
  WorkspaceRequest,
  WorkspaceResponse,
  WorkspaceWithMembersResponse,
} from "@/types/workspace.type";
import type { AnalyticsResponse, BaseResponse } from "@/types/common.type";
import type {
  AllProjectRequest,
  AllProjectResponse,
  CreateProjectRequest,
  ProjectRequest,
  ProjectResponse,
  UpdateProjectRequest,
} from "@/types/project.type";
import type {
  AllTaskRequest,
  AllTaskResponse,
  CreateTaskRequest,
  DeleteTaskRequest,
  TaskResponse,
  UpdateTaskRequest,
} from "@/types/task.type";

/************ AUTH API ************/
export const signinMutationFn = async ({
  inputs,
}: SigninRequest): Promise<SigninResponse> => {
  const response = await API.post("/auth/signin", inputs);
  return response.data;
};

export const signupMutationFn = async ({
  inputs,
}: SignupRequest): Promise<BaseResponse<null>> => {
  const response = await API.post("/auth/signup", inputs);
  return response.data;
};

export const signoutMutationFn = async (): Promise<BaseResponse<null>> => {
  const response = await API.post("/auth/signout");
  return response.data;
};

/************ USER API ************/
export const getCurrentUserQueryFn = async (): Promise<UserResponse> => {
  const response = await API.get("/user/profile");
  return response.data;
};

/************ WORKSPACE API ************/
export const createWorkspaceMutationFn = async ({
  inputs,
}: CreateWorkspaceRequest): Promise<WorkspaceResponse> => {
  const response = await API.post("/workspace", inputs);
  return response.data;
};

export const updateWorkspaceMutationFn = async ({
  workspaceId,
  inputs,
}: UpdateWorkspaceRequest): Promise<WorkspaceResponse> => {
  const response = await API.put(`/workspace/${workspaceId}`, inputs);
  return response.data;
};

export const getAllWorkspacesUserIsMemberQueryFn =
  async (): Promise<AllWorkspacesResponse> => {
    const response = await API.get(`/workspace/all`);
    return response.data;
  };

export const getWorkspaceWithMembersQueryFn = async ({
  workspaceId,
}: WorkspaceRequest): Promise<WorkspaceWithMembersResponse> => {
  const response = await API.get(`/workspace/${workspaceId}`);
  return response.data;
};

export const getMembersInWorkspaceQueryFn = async ({
  workspaceId,
}: WorkspaceRequest): Promise<GetMembersInWorkspaceResponse> => {
  const response = await API.get(`/workspace/members/${workspaceId}`);
  return response.data;
};

export const getWorkspaceAnalyticsQueryFn = async ({
  workspaceId,
}: WorkspaceRequest): Promise<AnalyticsResponse> => {
  const response = await API.get(`/workspace/analytics/${workspaceId}`);
  return response.data;
};

export const changeWorkspaceMemberRoleMutationFn = async ({
  workspaceId,
  inputs,
}: ChangeWorkspaceMemberRoleRequest): Promise<ChangeWorkspaceMemberRoleResponse> => {
  const response = await API.put(
    `/workspace/change/member/role/${workspaceId}`,
    inputs,
  );
  return response.data;
};

export const deleteWorkspaceMutationFn = async ({
  workspaceId,
}: WorkspaceRequest): Promise<BaseResponse<null>> => {
  const response = await API.delete(`/workspace/${workspaceId}`);
  return response.data;
};

/************ MEMBER API ************/
export const invitedUserJoinWorkspaceMutationFn = async ({
  inviteCode,
}: InvitedUserJoinWorkspaceRequest): Promise<InvitedUserJoinWorkspaceResponse> => {
  const response = await API.post(`/member/workspace/${inviteCode}/join`);
  return response.data;
};

/************ PROJECT API ************/
export const createProjectMutationFn = async ({
  workspaceId,
  inputs,
}: CreateProjectRequest): Promise<ProjectResponse> => {
  const response = await API.post(
    `/project/workspace/${workspaceId}/create`,
    inputs,
  );
  return response.data;
};

export const updateProjectMutationFn = async ({
  projectId,
  workspaceId,
  inputs,
}: UpdateProjectRequest): Promise<ProjectResponse> => {
  const response = await API.put(
    `/project/${projectId}/workspace/${workspaceId}/update`,
    inputs,
  );
  return response.data;
};

export const getProjectsInWorkspaceQueryFn = async ({
  workspaceId,
  pageSize = 10,
  pageNumber = 1,
}: AllProjectRequest): Promise<AllProjectResponse> => {
  const response = await API.get(
    `/project/workspace/${workspaceId}/all?pageSize=${pageSize}&pageNumber=${pageNumber}`,
  );
  return response.data;
};

export const getProjectByIdQueryFn = async ({
  workspaceId,
  projectId,
}: ProjectRequest): Promise<ProjectResponse> => {
  const response = await API.get(
    `/project/${projectId}/workspace/${workspaceId}`,
  );
  return response.data;
};

export const getProjectAnalyticsQueryFn = async ({
  workspaceId,
  projectId,
}: ProjectRequest): Promise<AnalyticsResponse> => {
  const response = await API.get(
    `/project/${projectId}/workspace/${workspaceId}/analytics`,
  );
  return response.data;
};

export const deleteProjectMutationFn = async ({
  workspaceId,
  projectId,
}: ProjectRequest): Promise<BaseResponse<null>> => {
  const response = await API.delete(
    `/project/${projectId}/workspace/${workspaceId}/delete`,
  );
  return response.data;
};

/************ TASKS API ************/
export const createTaskMutationFn = async ({
  workspaceId,
  inputs,
}: CreateTaskRequest): Promise<TaskResponse> => {
  const response = await API.post(
    `/task/project/${inputs.projectId}/workspace/${workspaceId}/create`,
    inputs,
  );
  return response.data;
};

export const updateTaskMutationFn = async ({
  workspaceId,
  projectId,
  taskId,
  inputs,
}: UpdateTaskRequest): Promise<TaskResponse> => {
  const response = await API.post(
    `/task/${taskId}/project/${projectId}/workspace/${workspaceId}`,
    inputs,
  );
  return response.data;
};

export const getAllTasksQueryFn = async ({
  workspaceId,
  filters,
  pageNumber,
  pageSize,
}: AllTaskRequest): Promise<AllTaskResponse> => {
  const { projectId, keyword, assignedTo, priority, status, dueDate } = filters;
  const baseUrl = `/task/workspace/${workspaceId}/all`;

  const queryParams = new URLSearchParams();
  if (keyword) queryParams.append("keyword", keyword);
  if (projectId) queryParams.append("projectId", projectId);
  if (assignedTo) queryParams.append("assignedTo", assignedTo);
  if (priority) queryParams.append("priority", priority);
  if (status) queryParams.append("status", status);
  if (dueDate) queryParams.append("dueDate", dueDate);
  if (pageNumber) queryParams.append("pageNumber", pageNumber?.toString());
  if (pageSize) queryParams.append("pageSize", pageSize?.toString());

  const url = queryParams.toString() ? `${baseUrl}?${queryParams}` : baseUrl;
  const response = await API.get(url);
  return response.data;
};

export const deleteTaskMutationFn = async ({
  workspaceId,
  taskId,
}: DeleteTaskRequest): Promise<BaseResponse<null>> => {
  const response = await API.delete(
    `task/${taskId}/workspace/${workspaceId}/delete`,
  );
  return response.data;
};
