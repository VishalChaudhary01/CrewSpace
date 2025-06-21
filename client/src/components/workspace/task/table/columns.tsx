import { format } from "date-fns";
import type { Column, ColumnDef, Row } from "@tanstack/react-table";
import { type TaskPriorityType, type TaskStatusType } from "@/constants";
import type { Task } from "@/types/task.type";
import { priorities, statuses } from "./data";
import {
  cn,
  getAvatarColor,
  getAvatarText,
  getPriorityColor,
  getStatusColor,
} from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableRowActions } from "./table-row-action";
import { DataTableColumnHeader } from "./table-column-header";

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
          aria-label='Select All'
          className='translate-y-[2px]'
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label='Select Row'
          className='translate-y-[2px]'
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "title",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Title' />
      ),
      cell: ({ row }) => {
        return (
          <div className='flex flex-wrap space-x-2'>
            <Badge variant='outline' className='capitalize shrink-0 h-[25px]'>
              {row.original.taskCode}
            </Badge>
            <span className='block lg:max-w-[220px] max-w-[200px] font-medium'>
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
              <DataTableColumnHeader column={column} title='Project' />
            ),
            cell: ({ row }: { row: Row<Task> }) => {
              const project = row.original.project;

              if (!project) {
                return null;
              }

              return (
                <div className='flex items-center gap-1'>
                  <span className='block capitalize truncate w-[100px] text-ellipsis'>
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
        <DataTableColumnHeader column={column} title='Assigned To' />
      ),
      cell: ({ row }) => {
        const assignee = row.original.assignedTo || null;
        const name = assignee?.name || "";

        const initials = getAvatarText(name);
        const avatarColor = getAvatarColor(name);

        return (
          name && (
            <div className='flex items-center gap-1'>
              <div
                className={cn(
                  "flex items-center justify-center rounded-full size-6 font-medium text-sm",
                  avatarColor,
                )}
              >
                {initials}
              </div>

              <span className='block text-ellipsis w-[100px] truncate'>
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
        <DataTableColumnHeader column={column} title='Due Date' />
      ),
      cell: ({ row }) => {
        return (
          <span className='lg:max-w-[100px] text-sm'>
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
        <DataTableColumnHeader column={column} title='Status' />
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
          <div className='flex lg:w-[120px] items-center'>
            <Badge
              className={cn(
                "flex w-auto p-1 px-2 gap-1 font-medium shadow-sm uppercase border-0",
                statusColor,
              )}
            >
              <Icon className='h-4 w-4 rounded-full text-inherit' />
              <span>{status.label}</span>
            </Badge>
          </div>
        );
      },
    },
    {
      accessorKey: "priority",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Priority' />
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
          <div className='flex items-center'>
            <Badge
              className={cn(
                "flex lg:w-[110px] p-1 gap-1 font-medium !shadow-none uppercase",
                priorityColor,
              )}
            >
              <Icon className='h-4 w-4 rounded-full text-inherit' />
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
