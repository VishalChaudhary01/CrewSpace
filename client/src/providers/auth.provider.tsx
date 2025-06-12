import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { PermissionType } from "@/constants";
import { AuthContext } from "@/contexts/auth.context";
import { useAuth, useGetWorkspace } from "@/hooks";
import { usePermissions } from "@/hooks/use-permissions";
import { useWorkspaceId } from "@/hooks/use-workspace-id";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const navigate = useNavigate();
  const workspaceId = useWorkspaceId();

  const {
    data: authData,
    isLoading: isAuthLoading,
    refetch: refetchAuth,
    error: authError,
  } = useAuth();

  const {
    data: workspaceData,
    isLoading: isWorkspaceLoading,
    refetch: refetchWorkspace,
    error: workspaceError,
  } = useGetWorkspace({ workspaceId });

  const user = authData?.data?.user;
  const workspace = workspaceData?.data?.workspace;

  useEffect(() => {
    if (workspaceError) {
      if (workspaceError.errorCode === "ACCESS_UNAUTHORIZED") {
        navigate("/");
      }
    }
  }, [navigate, workspaceError]);

  const permissions = usePermissions(user, workspace);

  const hasPermission = (permission: PermissionType): boolean => {
    return permissions.includes(permission);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        workspace,
        hasPermission,
        error: authError || workspaceError,
        isAuthLoading,
        isWorkspaceLoading,
        refetchAuth,
        refetchWorkspace,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
