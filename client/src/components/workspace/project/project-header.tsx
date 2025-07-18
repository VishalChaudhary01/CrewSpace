import { Edit, Loader, Plus } from "lucide-react";
import { useParams } from "react-router-dom";

import { PermissionsGuard } from "@/components/common/permission-guard";
import { Button } from "@/components/ui/button";

import { UpdateProjectDialog } from "./update-project-dialog";

import { Permissions } from "@/constants";
import { useGetProjectById } from "@/hooks";
import { useCreateTaskDialog, useUpdateProjectDialog } from "@/hooks/dialog";
import { useWorkspaceId } from "@/hooks/use-workspace-id";

export const ProjectHeader = () => {
  const param = useParams();
  const projectId = param.projectId as string;
  const workspaceId = useWorkspaceId();
  const { onOpen } = useUpdateProjectDialog();
  const { onOpen: onOpenCreateTask } = useCreateTaskDialog();

  const { data, isPending, isError } = useGetProjectById({
    workspaceId,
    projectId,
  });

  const project = data?.data?.project;

  const projectName = project?.name || "Untitled project";

  const renderContent = () => {
    if (isPending)
      return <Loader className="w-6 h-6 animate-spin place-self-center flex" />;
    if (isError) return <span>Error occured</span>;
    return (
      <>
        <img src="/bar-chart.svg" className="w-6 h-6" />
        <span className="capitalize">{projectName}</span>
      </>
    );
  };

  return (
    <div className="flex items-center justify-between space-y-2">
      <div className="flex items-center justify-between w-full gap-2">
        <div className="flex items-center gap-2">
          <h2 className="flex items-center gap-3 text-xl font-medium truncate tracking-tight">
            {renderContent()}
          </h2>
          <PermissionsGuard requiredPermission={Permissions.EDIT_PROJECT}>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTimeout(() => onOpen(), 100)}
            >
              <Edit className="w-4 h-4 " />
            </Button>
            {project && <UpdateProjectDialog project={project} />}
          </PermissionsGuard>
        </div>
        <PermissionsGuard requiredPermission={Permissions.CREATE_TASK}>
          <Button onClick={() => setTimeout(() => onOpenCreateTask(), 100)}>
            <Plus className="w-4 h-4 " />
            <span>Create Task</span>
          </Button>
        </PermissionsGuard>
      </div>
    </div>
  );
};
