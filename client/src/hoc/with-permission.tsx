/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { PermissionType } from "@/constants";
import { useAuthContext } from "@/contexts/auth.context";
import { useWorkspaceId } from "@/hooks/use-workspace-id";

export const withPermission = (
  WrappedComponent: React.ComponentType,
  requiredPermission: PermissionType,
) => {
  const WithPermission = (props: any) => {
    const { user, hasPermission, isAuthLoading } = useAuthContext();
    const navigate = useNavigate();
    const workspaceId = useWorkspaceId();

    useEffect(() => {
      if (!user || !hasPermission(requiredPermission)) {
        navigate(`/workspace/${workspaceId}`);
      }
    }, [user, hasPermission, navigate, workspaceId]);

    if (isAuthLoading) {
      return <div>Loading...</div>;
    }

    if (!user || !hasPermission(requiredPermission)) {
      return;
    }

    return <WrappedComponent {...props} />;
  };

  return WithPermission;
};
