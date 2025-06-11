import type { z } from "zod";
import type { Role } from "./user.type";
import {
  createWorkspaceSchema,
  updateWorkspaceSchema,
} from "@/validators/workspace.validator";
import type { BaseEntity, BaseResponse, BaseUser } from "./common.type";

export interface WorkspaceBasic extends BaseEntity {
  name: string;
  owner: string;
  inviteCode: string;
}

export interface Workspace extends WorkspaceBasic {
  description?: string;
}

export interface WorkspaceWithMembers extends Workspace {
  members: Member[];
}

export interface Member extends BaseEntity {
  userId: BaseUser;
  workspaceId: string;
  role: Role;
  joinedAt: string;
}

export type CreateWorkspaceInput = z.infer<typeof createWorkspaceSchema>;
export type UpdateWorkspaceInput = z.infer<typeof updateWorkspaceSchema>;

// REQUEST TYPES
export interface WorkspaceRequest {
  workspaceId: string;
}

export type CreateWorkspaceRequest = WorkspaceRequest & {
  inputs: UpdateWorkspaceInput;
};

export type UpdateWorkspaceRequest = WorkspaceRequest & {
  inputs: UpdateWorkspaceInput;
};

export type ChangeWorkspaceMemberRoleRequest = WorkspaceRequest & {
  inputs: {
    roleId: string;
    memberId: string;
  };
};

export type InvitedUserJoinWorkspaceRequest = {
  inviteCode: string;
};

// RESPONSE TYPES
export type WorkspaceResponse = BaseResponse<{ workspace: Workspace }>;

export type WorkspaceWithMembersResponse = BaseResponse<{
  workspace: WorkspaceWithMembers;
}>;

export type AllWorkspacesResponse = BaseResponse<{
  workspaces: Workspace[];
}>;

export type GetMembersInWorkspaceResponse = BaseResponse<{
  members: Member[];
  roles: Role[];
}>;

export type ChangeWorkspaceMemberRoleResponse = BaseResponse<{
  member: Member;
}>;

export type InvitedUserJoinWorkspaceResponse = BaseResponse<{
  workspaceId: string;
}>;
