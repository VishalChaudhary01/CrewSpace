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
} from "@/types/task.type";

/************ AUTH API ************/
export const signinMutationFn = async ({
  data,
}: SigninRequest): Promise<SigninResponse> => {
  const response = await API.post("/auth/signin", data);
  return response.data;
};

export const signupMutationFn = async ({
  data,
}: SignupRequest): Promise<BaseResponse<null>> => {
  const response = await API.post("/auth/register", data);
  return response.data;
};

export const logoutMutationFn = async (): Promise<BaseResponse<null>> => {
  const response = await API.post("/auth/logout");
  return response.data;
};

/************ USER API ************/
export const getCurrentUserQueryFn = async (): Promise<UserResponse> => {
  const response = await API.get("/user/current");
  return response.data;
};

/************ WORKSPACE API ************/
export const createWorkspaceMutationFn = async ({
  data,
}: CreateWorkspaceRequest): Promise<WorkspaceResponse> => {
  const response = await API.post("/workspace/create/new", data);
  return response.data;
};

export const updateWorkspaceMutationFn = async ({
  workspaceId,
  data,
}: UpdateWorkspaceRequest): Promise<WorkspaceResponse> => {
  const response = await API.put(`/workspace/update/${workspaceId}`, data);
  return response.data;
};

export const getAllWorkspacesUserIsMemberQueryFn =
  async (): Promise<AllWorkspacesResponse> => {
    const response = await API.get(`/workspace/all`);
    return response.data;
  };

export const getWorkspaceByIdQueryFn = async ({
  workspaceId,
}: WorkspaceRequest): Promise<WorkspaceResponse> => {
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
  data,
}: ChangeWorkspaceMemberRoleRequest): Promise<ChangeWorkspaceMemberRoleResponse> => {
  const response = await API.put(
    `/workspace/change/member/role/${workspaceId}`,
    data,
  );
  return response.data;
};

export const deleteWorkspaceMutationFn = async ({
  workspaceId,
}: WorkspaceRequest): Promise<BaseResponse<null>> => {
  const response = await API.delete(`/workspace/delete/${workspaceId}`);
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
  data,
}: CreateProjectRequest): Promise<ProjectResponse> => {
  const response = await API.post(
    `/project/workspace/${workspaceId}/create`,
    data,
  );
  return response.data;
};

export const updateProjectMutationFn = async ({
  projectId,
  workspaceId,
  data,
}: UpdateProjectRequest): Promise<ProjectResponse> => {
  const response = await API.put(
    `/project/${projectId}/workspace/${workspaceId}/update`,
    data,
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
  data,
}: CreateTaskRequest): Promise<TaskResponse> => {
  const response = await API.post(
    `/task/project/${data.projectId}/workspace/${workspaceId}/create`,
    data,
  );
  return response.data;
};

export const getAllTasksQueryFn = async ({
  workspaceId,
  projectId,
  keyword,
  assignedTo,
  priority,
  status,
  dueDate,
  pageNumber,
  pageSize,
}: AllTaskRequest): Promise<AllTaskResponse> => {
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
  console.log("All Tasks:: ", response);
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
