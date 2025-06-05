import type { PermissionType } from "@/constants";
import type { BaseEntity, BaseResponse } from "./common.type";
import type { WorkspaceBasic } from "./workspace.type";

export interface User extends BaseEntity {
  name: string;
  email: string;
  isActive: boolean;
  lastLogin: string | null;
  currentWorkspace: WorkspaceBasic;
}

export interface Role extends BaseEntity {
  name: string;
  permissions?: PermissionType[];
}

// RESPONSE TYPES
export type UserResponse = BaseResponse<{ user: User }>;
