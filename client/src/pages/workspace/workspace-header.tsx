import { Loader } from "lucide-react";

import { useAuthContext } from "@/contexts/auth.context";

export const WorkspaceHeader = () => {
  const { isWorkspaceLoading, workspace } = useAuthContext();

  return (
    <div className="mx-auto w-full max-w-3xl pb-2">
      {isWorkspaceLoading ? (
        <div className="flex w-full items-center justify-center">
          <Loader className="flex h-8 w-8 animate-spin place-self-center" />
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-full p-1">
            {workspace?.name?.split(" ")?.[0]?.charAt(0).toUpperCase() || "W"}
          </div>

          <div className="grid flex-1 text-left leading-tight">
            <span className="truncate text-xl font-semibold capitalize">
              {workspace?.name}
            </span>
            <span className="truncate text-sm">Free</span>
          </div>
        </div>
      )}
    </div>
  );
};
