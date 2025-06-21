import { format } from "date-fns";
import { Loader } from "lucide-react";

import { Badge } from "@/components/ui/badge";

import { useGetAllTasks } from "@/hooks";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import {
  getAvatarColor,
  getAvatarText,
  getPriorityColor,
  getStatusColor,
  transformStatusEnum,
} from "@/lib/utils";
import type { Task } from "@/types/task.type";

export const RecentTasks = () => {
  const workspaceId = useWorkspaceId();

  const { data, isLoading } = useGetAllTasks({ workspaceId });

  const tasks: Task[] = data?.data?.tasks || [];

  return (
    <div className="flex flex-col space-y-6">
      {isLoading ? (
        <Loader className="flex h-8 w-8 animate-spin place-self-center" />
      ) : null}

      {tasks?.length === 0 && (
        <div className="text-muted-foreground py-5 text-center text-sm font-semibold">
          No Task created yet
        </div>
      )}

      <ul role="list" className="divide-border/50 divide-y">
        {tasks.map((task) => {
          const name = task?.assignedTo?.name || "";
          const initials = getAvatarText(name);
          const avatarColor = getAvatarColor(name);
          const statusColor = getStatusColor(task.status);
          const priorityColor = getPriorityColor(task.priority);
          return (
            <li
              key={task._id}
              className="flex items-center justify-between rounded-md p-4 transition-colors duration-200 ease-in-out hover:bg-gray-50"
            >
              {/* Task Info */}
              <div className="flex flex-grow flex-col space-y-1">
                <span className="text-muted-foreground text-sm font-medium capitalize">
                  {task.taskCode}
                </span>
                <p className="text-md truncate font-semibold">{task.title}</p>
                <span className="text-muted-foreground text-sm">
                  Due:{" "}
                  {task.dueDate ? format(new Date(task.dueDate), "PPP") : null}
                </span>
              </div>

              {/* Task Status */}
              <div className="text-sm font-medium">
                <Badge
                  className={`flex w-auto gap-1 border-0 p-1 px-2 font-medium uppercase shadow-sm ${statusColor}`}
                >
                  <span>{transformStatusEnum(task.status)}</span>
                </Badge>
              </div>

              {/* Task Priority */}
              <div className="ml-2 text-sm">
                <Badge
                  className={`flex w-auto gap-1 border-0 p-1 px-2 font-medium uppercase shadow-sm ${priorityColor}`}
                >
                  <span>{transformStatusEnum(task.priority)}</span>
                </Badge>
              </div>

              {/* Assignee */}
              <div className="ml-2 flex items-center space-x-2">
                <div
                  className={`hidden size-8 items-center justify-center rounded-full p-2 text-sm sm:flex ${avatarColor}`}
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
