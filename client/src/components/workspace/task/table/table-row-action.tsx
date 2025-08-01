/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Row } from "@tanstack/react-table";
import { Loader, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";

import { DialogLayout } from "@/components/common/dialog-layout";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useConfirmDialog } from "@/hooks/dialog";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { deleteTaskMutationFn } from "@/lib/api";
import { cn } from "@/lib/utils";
import type { Task } from "@/types/task.type";

interface DataTableRowActionsProps {
  row: Row<Task>;
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const queryClient = useQueryClient();
  const workspaceId = useWorkspaceId();

  const { open, onOpen, onClose } = useConfirmDialog();

  const { mutate, isPending } = useMutation({
    mutationFn: deleteTaskMutationFn,
  });

  const taskId = row.original._id as string;
  const taskCode = row.original.taskCode;

  const handleDelete = () => {
    mutate(
      {
        workspaceId,
        taskId,
      },
      {
        onSuccess: (data) => {
          queryClient.invalidateQueries({
            queryKey: ["all-tasks", workspaceId],
          });
          toast(data.message);
          setTimeout(() => onClose(), 100);
        },
        onError: (error: any) => {
          toast(error?.response?.data?.message || "Failed to fetch all tasks");
        },
      },
    );
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="data-[state=open]:bg-muted flex h-8 w-8 p-0"
          >
            <MoreHorizontal />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem className="cursor-pointer">
            Edit Task
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className={cn("!text-destructive cursor-pointer", taskId)}
            onClick={() => onOpen(true)}
          >
            Delete Task
            <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DialogLayout
        open={open}
        onClose={onClose}
        header={`Delete Task ${taskCode}`}
        description="Are you sure you want to delete."
      >
        <div className="flex justify-center gap-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button disabled={isPending} type="button" onClick={handleDelete}>
            {isPending ? <Loader className="size-4 animate-spin" /> : "Delete"}
          </Button>
        </div>
      </DialogLayout>
    </>
  );
}
