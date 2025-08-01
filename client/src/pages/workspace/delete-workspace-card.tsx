/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { DialogLayout } from "@/components/common/dialog-layout";
import { PermissionsGuard } from "@/components/common/permission-guard";
import { Button } from "@/components/ui/button";

import { Permissions } from "@/constants";
import { useAuthContext } from "@/contexts/auth.context";
import { useGetAllWorkspacesUserIsMember } from "@/hooks";
import { useConfirmDialog } from "@/hooks/dialog";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { deleteWorkspaceMutationFn } from "@/lib/api";

export const DeleteWorkspaceCard = () => {
  const { workspace } = useAuthContext();
  const navigate = useNavigate();

  const queryClient = useQueryClient();
  const workspaceId = useWorkspaceId();
  const {
    open,
    onOpen: onOpenDialog,
    onClose: onCloseDialog,
  } = useConfirmDialog();

  const { data } = useGetAllWorkspacesUserIsMember();
  const nextWorkspace = data?.data?.workspaces[0]._id;

  const { mutate, isPending } = useMutation({
    mutationFn: deleteWorkspaceMutationFn,
  });

  const handleDelete = () => {
    mutate(
      { workspaceId },
      {
        onSuccess: (result) => {
          queryClient.invalidateQueries({
            queryKey: ["user-workspaces"],
          });
          toast.success(result.message);
          onCloseDialog();
          navigate(`/workspace/${nextWorkspace}`);
        },
        onError: (error: any) => {
          toast.error(
            error?.response?.data?.message ?? "Failed to Delete Wrokspace",
          );
        },
      },
    );
  };

  return (
    <>
      <div className="w-full">
        <div className="mb-5 border-b">
          <h1 className="mb-1.5 text-center text-[17px] font-semibold tracking-[-0.16px] sm:text-left">
            Delete Workspace
          </h1>
        </div>

        <PermissionsGuard
          showMessage
          requiredPermission={Permissions.DELETE_WORKSPACE}
        >
          <div className="flex flex-col items-start justify-between py-0">
            <div className="mb-2 flex-1">
              <p>
                Deleting a workspace is a permanent action and cannot be undone.
                Once you delete a workspace, all its associated data, including
                projects, tasks, and member roles, will be permanently removed.
                Please proceed with caution and ensure this action is
                intentional.
              </p>
            </div>
            <Button
              className="flex place-self-end"
              variant="destructive"
              onClick={onOpenDialog}
            >
              Delete Workspace
            </Button>
          </div>
        </PermissionsGuard>
      </div>

      <DialogLayout
        open={open}
        onClose={onCloseDialog}
        header={`Delete "${workspace?.name}" Workspace`}
        description={`Are you sure you want to delete? This action cannot be undone.`}
      >
        <div className="flex w-full justify-center gap-8">
          <Button
            disabled={isPending}
            onClick={onCloseDialog}
            variant="outline"
          >
            Cancel
          </Button>
          <Button disabled={isPending} onClick={handleDelete}>
            {isPending ? <Loader className="h-4 w-4 animate-spin" /> : "Delete"}
          </Button>
        </div>
      </DialogLayout>
    </>
  );
};
