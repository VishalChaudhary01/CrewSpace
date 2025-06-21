import React from "react";

import type { PermissionType } from "@/constants";
import { useAuthContext } from "@/contexts/auth.context";

type PermissionsGuardProps = {
  requiredPermission: PermissionType;
  children: React.ReactNode;
  showMessage?: boolean;
};

export const PermissionsGuard: React.FC<PermissionsGuardProps> = ({
  requiredPermission,
  showMessage = false,
  children,
}) => {
  const { hasPermission } = useAuthContext();

  if (!hasPermission(requiredPermission)) {
    return (
      showMessage && (
        <div className="text-muted-foreground w-full pt-3 text-center text-sm italic">
          You do not have the permission to view this
        </div>
      )
    );
  }

  return <>{children}</>;
};
