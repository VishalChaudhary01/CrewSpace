import { Separator } from "@/components/ui/separator";

import { DeleteWorkspaceCard } from "./delete-workspace-card";
import { EditWorkspaceForm } from "./update-workspace-form";
import { WorkspaceHeader } from "./workspace-header";

import { Permissions } from "@/constants";
import { withPermission } from "@/hoc/with-permission";

const Settings = () => {
  return (
    <div className="h-auto w-full py-2">
      <WorkspaceHeader />
      <Separator className="my-4" />
      <main>
        <div className="mx-auto w-full max-w-3xl py-3">
          <h2 className="mb-3 text-[20px] leading-[30px] font-semibold">
            Workspace settings
          </h2>

          <div className="flex flex-col px-0 pt-0.5">
            <div className="pt-2">
              <EditWorkspaceForm />
            </div>
            <div className="pt-2">
              <DeleteWorkspaceCard />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export const SettingsPage = withPermission(
  Settings,
  Permissions.MANAGE_WORKSPACE_SETTINGS,
);
