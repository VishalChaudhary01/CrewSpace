import { Plus } from "lucide-react";
import { Permissions } from "@/constants";
import { useCreateTaskDialog } from "@/hooks/dialog";
import { Button } from "@/components/ui/button";
import { PermissionsGuard } from "@/components/common/permission-guard";
import { TaskTable } from "@/components/workspace/task/task-table";

export const TasksPage = () => {
  const { onOpen: onOpenCreateTask } = useCreateTaskDialog();

  return (
    <div className='w-full h-full flex-col space-y-8 pt-3'>
      <div className='flex items-center justify-between space-y-2'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>All Tasks</h2>
          <p className='text-muted-foreground'>
            Here&apos;s the list of tasks for this workspace!
          </p>
        </div>
        <PermissionsGuard requiredPermission={Permissions.CREATE_TASK}>
          <Button onClick={() => onOpenCreateTask()}>
            <Plus className='w-4 h-4 ' />
            <span>Create Task</span>
          </Button>
        </PermissionsGuard>
      </div>
      {/* TODO - NEED TO ADD TABLE FOR ALL TASKS */}
      <TaskTable />
      {/* <span>
        <strong>Todo: </strong>Need to add Tasks table
      </span> */}
    </div>
  );
};
