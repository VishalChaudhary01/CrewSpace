import { Plus } from "lucide-react";

import { PermissionsGuard } from "@/components/common/permission-guard";
import { Button } from "@/components/ui/button";
import { TaskTable } from "@/components/workspace/task/task-table";

import { Permissions } from "@/constants";
import { useCreateTaskDialog } from "@/hooks/dialog";

export const TasksPage = () => {
  const { onOpen: onOpenCreateTask } = useCreateTaskDialog();

  return (
    <div className="h-full w-full flex-col space-y-8 pt-3">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">All Tasks</h2>
          <p className="text-muted-foreground">
            Here&apos;s the list of tasks for this workspace!
          </p>
        </div>
        <PermissionsGuard requiredPermission={Permissions.CREATE_TASK}>
          <Button onClick={() => onOpenCreateTask()}>
            <Plus className="h-4 w-4" />
            <span>Create Task</span>
          </Button>
        </PermissionsGuard>
      </div>
      <TaskTable />
    </div>
  );
};
