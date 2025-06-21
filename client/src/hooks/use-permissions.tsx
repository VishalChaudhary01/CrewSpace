import { useEffect, useMemo, useState } from "react";

import type { PermissionType } from "@/constants";
import type { User } from "@/types/user.type";
import type { WorkspaceWithMembers } from "@/types/workspace.type";

export const usePermissions = (
  user?: User,
  workspace?: WorkspaceWithMembers,
) => {
  const [permissions, setPermissions] = useState<PermissionType[]>([]);

  useEffect(() => {
    if (user && workspace) {
      const member = workspace.members.find(
        (member) => member.userId.toString() === user._id.toString(),
      );
      if (member) {
        setPermissions(member.role.permissions || []);
      }
    }
  }, [user, workspace]);

  return useMemo(() => permissions, [permissions]);
};
