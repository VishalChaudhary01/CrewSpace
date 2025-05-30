import { PermissionType } from "@/enums/role.enum";
import { RolePermissions } from "./role-premissions";
import { UnauthorizedError } from "@/errors/unauthorize.error";

export const roleGuard = (
  role: keyof typeof RolePermissions,
  requiredPermissions: PermissionType[],
) => {
  const permissions = RolePermissions[role];
  const hasPermission = requiredPermissions.every((permission) => {
    return permissions.includes(permission);
  });
  if (!hasPermission) {
    throw new UnauthorizedError(
      "You do not have the necessary permissions to perform this action",
    );
  }
};
