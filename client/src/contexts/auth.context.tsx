/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useContext } from "react";

import type { PermissionType } from "@/constants";
import type { User } from "@/types/user.type";
import type { WorkspaceWithMembers } from "@/types/workspace.type";

type AuthContextType = {
  user?: User;
  workspace?: WorkspaceWithMembers;
  hasPermission: (permission: PermissionType) => boolean;
  error: any;
  isAuthLoading: boolean;
  isWorkspaceLoading: boolean;
  refetchAuth: () => void;
  refetchWorkspace: () => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within a AuthProvider");
  }
  return context;
};
