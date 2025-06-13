import { format } from "date-fns";
import { Loader } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  getAvatarColor,
  getAvatarText,
  getPriorityColor,
  getStatusColor,
  transformStatusEnum,
} from "@/lib/utils";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useGetAllTasks } from "@/hooks";
import type { Task } from "@/types/task.type";

export const RecentTasks = () => {
  const workspaceId = useWorkspaceId();

  const { data, isLoading } = useGetAllTasks({ workspaceId });

  const tasks: Task[] = data?.data?.tasks || [];

  return (
    <div className='flex flex-col space-y-6'>
      {isLoading ? (
        <Loader className='w-8 h-8  animate-spin place-self-center flex' />
      ) : null}

      {tasks?.length === 0 && (
        <div className='font-semibold text-sm text-muted-foreground text-center py-5'>
          No Task created yet
        </div>
      )}

      <ul role='list' className='divide-y divide-border/50'>
        {tasks.map((task) => {
          const name = task?.assignedTo?.name || "";
          const initials = getAvatarText(name);
          const avatarColor = getAvatarColor(name);
          const statusColor = getStatusColor(task.status);
          const priorityColor = getPriorityColor(task.priority);
          return (
            <li
              key={task._id}
              className='p-4 flex items-center justify-between hover:bg-gray-50 rounded-md transition-colors ease-in-out duration-200'
            >
              {/* Task Info */}
              <div className='flex flex-col space-y-1 flex-grow'>
                <span className='text-sm capitalize text-muted-foreground font-medium'>
                  {task.taskCode}
                </span>
                <p className='text-md font-semibold truncate'>{task.title}</p>
                <span className='text-sm text-muted-foreground'>
                  Due:{" "}
                  {task.dueDate ? format(new Date(task.dueDate), "PPP") : null}
                </span>
              </div>

              {/* Task Status */}
              <div className='text-sm font-medium '>
                <Badge
                  className={`flex w-auto p-1 px-2 gap-1 font-medium shadow-sm uppercase border-0 ${statusColor}`}
                >
                  <span>{transformStatusEnum(task.status)}</span>
                </Badge>
              </div>

              {/* Task Priority */}
              <div className='text-sm ml-2'>
                <Badge
                  className={`flex w-auto p-1 px-2 gap-1 font-medium shadow-sm uppercase border-0 ${priorityColor}`}
                >
                  <span>{transformStatusEnum(task.priority)}</span>
                </Badge>
              </div>

              {/* Assignee */}
              <div className='flex items-center space-x-2 ml-2'>
                <div
                  className={`hidden sm:flex items-center justify-center rounded-full p-2 size-8 text-sm ${avatarColor}`}
                >
                  {initials}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
