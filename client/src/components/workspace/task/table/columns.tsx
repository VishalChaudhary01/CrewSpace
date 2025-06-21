import type { Column, ColumnDef, Row } from "@tanstack/react-table";
import { format } from "date-fns";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

import { priorities, statuses } from "./data";
import { DataTableColumnHeader } from "./table-column-header";
import { DataTableRowActions } from "./table-row-action";

import { type TaskPriorityType, type TaskStatusType } from "@/constants";
import {
  cn,
  getAvatarColor,
  getAvatarText,
  getPriorityColor,
  getStatusColor,
} from "@/lib/utils";
import type { Task } from "@/types/task.type";

export const getColumns = (projectId?: string): ColumnDef<Task>[] => {
  const columns: ColumnDef<Task>[] = [
    {
      id: "_id",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select All"
          className="translate-y-[2px]"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select Row"
          className="translate-y-[2px]"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "title",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Title" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex flex-wrap space-x-2">
            <Badge variant="outline" className="h-[25px] shrink-0 capitalize">
              {row.original.taskCode}
            </Badge>
            <span className="block max-w-[200px] font-medium lg:max-w-[220px]">
              {row.original.title}
            </span>
          </div>
        );
      },
    },
    ...(projectId
      ? [] // If projectId exists, exclude the "Project" column
      : [
          {
            accessorKey: "project",
            header: ({ column }: { column: Column<Task, unknown> }) => (
              <DataTableColumnHeader column={column} title="Project" />
            ),
            cell: ({ row }: { row: Row<Task> }) => {
              const project = row.original.project;

              if (!project) {
                return null;
              }

              return (
                <div className="flex items-center gap-1">
                  <span className="block w-[100px] truncate text-ellipsis capitalize">
                    {project.name}
                  </span>
                </div>
              );
            },
          },
        ]),

    {
      accessorKey: "assignedTo",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Assigned To" />
      ),
      cell: ({ row }) => {
        const assignee = row.original.assignedTo || null;
        const name = assignee?.name || "";

        const initials = getAvatarText(name);
        const avatarColor = getAvatarColor(name);

        return (
          name && (
            <div className="flex items-center gap-1">
              <div
                className={cn(
                  "flex size-6 items-center justify-center rounded-full text-sm font-medium",
                  avatarColor,
                )}
              >
                {initials}
              </div>

              <span className="block w-[100px] truncate text-ellipsis">
                {assignee?.name}
              </span>
            </div>
          )
        );
      },
    },
    {
      accessorKey: "dueDate",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Due Date" />
      ),
      cell: ({ row }) => {
        return (
          <span className="text-sm lg:max-w-[100px]">
            {row.original.dueDate
              ? format(new Date(row.original.dueDate), "PPP")
              : null}
          </span>
        );
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => {
        const status = statuses.find(
          (status) => status.value === row.getValue("status"),
        );

        if (!status) {
          return null;
        }
        const statusColor = getStatusColor(status.value as TaskStatusType);
        const Icon = status.icon;

        if (!Icon) {
          return null;
        }

        return (
          <div className="flex items-center lg:w-[120px]">
            <Badge
              className={cn(
                "flex w-auto gap-1 border-0 p-1 px-2 font-medium uppercase shadow-sm",
                statusColor,
              )}
            >
              <Icon className="h-4 w-4 rounded-full text-inherit" />
              <span>{status.label}</span>
            </Badge>
          </div>
        );
      },
    },
    {
      accessorKey: "priority",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Priority" />
      ),
      cell: ({ row }) => {
        const priority = priorities.find(
          (priority) => priority.value === row.getValue("priority"),
        );

        if (!priority) {
          return null;
        }

        const Icon = priority.icon;
        const priorityColor = getPriorityColor(
          priority.value as TaskPriorityType,
        );

        if (!Icon) {
          return null;
        }

        return (
          <div className="flex items-center">
            <Badge
              className={cn(
                "flex gap-1 p-1 font-medium uppercase !shadow-none lg:w-[110px]",
                priorityColor,
              )}
            >
              <Icon className="h-4 w-4 rounded-full text-inherit" />
              <span>{priority.label}</span>
            </Badge>
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return (
          <>
            <DataTableRowActions row={row} />
          </>
        );
      },
    },
  ];
  return columns;
};
