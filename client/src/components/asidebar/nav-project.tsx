/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Permissions } from "@/constants";
import { useGetProjectsInWorkspace } from "@/hooks";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useConfirmDialog, useCreateProjectDialog } from "@/hooks/dialog";
import { deleteProjectMutationFn } from "@/lib/api";
import type { Pagination } from "@/types/common.type";
import {
  ArrowRight,
  Folder,
  Loader,
  MoreHorizontal,
  Plus,
  Trash2,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DialogLayout } from "@/components/common/dialog-layout";
import { PermissionsGuard } from "@/components/common/permission-guard";

export function NavProjects() {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;

  const queryClient = useQueryClient();
  const workspaceId = useWorkspaceId();

  const { isMobile } = useSidebar();
  const { onOpen } = useCreateProjectDialog();
  const {
    content,
    open,
    onOpen: onOpenDialog,
    onClose: onCloseDialog,
  } = useConfirmDialog();

  const [pageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const { mutate, isPending: isLoading } = useMutation({
    mutationFn: deleteProjectMutationFn,
  });

  const { data, isPending, isFetching, isError } = useGetProjectsInWorkspace({
    workspaceId,
    pageSize,
    pageNumber,
  });

  const projects = data?.data?.projects || [];
  const pagination = data?.data?.pagination || ({} as Pagination);
  const hasMore = pagination?.totalPages > pageNumber;

  const fetchNextPage = () => {
    if (!hasMore || isFetching) return;
    setPageSize((prev) => prev + 5);
  };

  const handleDelete = () => {
    if (!content) return;
    mutate(
      {
        workspaceId,
        projectId: content?._id,
      },
      {
        onSuccess: (result) => {
          queryClient.invalidateQueries({
            queryKey: ["all-projects", workspaceId],
          });
          toast.success(result.message);
          navigate(`/workspace/${workspaceId}`);
          setTimeout(() => onCloseDialog(), 100);
        },
        onError: (error: any) => {
          toast.error(
            error?.response?.data?.message ?? "Error during delete project",
          );
        },
      },
    );
  };

  return (
    <>
      <SidebarGroup className='group-data-[collapsible=icon]:hidden'>
        <SidebarGroupLabel className='w-full justify-between pr-0'>
          <span>Projects</span>
          <PermissionsGuard requiredPermission={Permissions.CREATE_PROJECT}>
            <button
              onClick={onOpen}
              type='button'
              className='flex size-5 items-center justify-center rounded-full border'
            >
              <Plus className='size-3.5' />
            </button>
          </PermissionsGuard>
        </SidebarGroupLabel>
        <ScrollArea className='h-[220px] pb-6 pr-1'>
          <SidebarMenu>
            {isError ? <div>Error occured</div> : null}
            {isPending ? (
              <Loader className='size-5 animate-spin place-self-center' />
            ) : null}

            {!isPending && projects?.length === 0 ? (
              <div className='pl-3'>
                <p className='text-xs text-muted-foreground'>
                  There is no projects in this Workspace yet. Projects you
                  create will show up here.
                </p>
                <PermissionsGuard
                  requiredPermission={Permissions.CREATE_PROJECT}
                >
                  <Button
                    variant='link'
                    type='button'
                    className='h-0 p-0 text-[13px] underline font-semibold mt-4'
                    onClick={onOpen}
                  >
                    Create a project
                    <ArrowRight />
                  </Button>
                </PermissionsGuard>
              </div>
            ) : (
              projects.map((item) => {
                const projectUrl = `/workspace/${workspaceId}/project/${item._id}`;

                return (
                  <SidebarMenuItem key={item._id}>
                    <SidebarMenuButton
                      asChild
                      isActive={projectUrl === pathname}
                    >
                      <Link to={projectUrl}>
                        <img src='/bar-chart.svg' alt='P' className='w-6 h-6' />
                        <span>{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <SidebarMenuAction showOnHover>
                          <MoreHorizontal />
                          <span className='sr-only'>More</span>
                        </SidebarMenuAction>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        className='w-48 rounded-lg'
                        side={isMobile ? "bottom" : "right"}
                        align={isMobile ? "end" : "start"}
                      >
                        <DropdownMenuItem
                          onClick={() => navigate(`${projectUrl}`)}
                        >
                          <Folder className='text-muted-foreground' />
                          <span>View Project</span>
                        </DropdownMenuItem>

                        <PermissionsGuard
                          requiredPermission={Permissions.DELETE_PROJECT}
                        >
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            disabled={isLoading}
                            onClick={() => onOpenDialog(item)}
                          >
                            <Trash2 className='text-muted-foreground' />
                            <span>Delete Project</span>
                          </DropdownMenuItem>
                        </PermissionsGuard>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </SidebarMenuItem>
                );
              })
            )}

            {hasMore && (
              <SidebarMenuItem>
                <SidebarMenuButton
                  className='text-sidebar-foreground/70'
                  disabled={isFetching}
                  onClick={fetchNextPage}
                >
                  <MoreHorizontal className='text-sidebar-foreground/70' />
                  <span>{isFetching ? "Loading..." : "More"}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
          </SidebarMenu>
        </ScrollArea>
      </SidebarGroup>

      <DialogLayout
        open={open}
        onClose={onCloseDialog}
        header={`Delete ${content?.name} Project`}
        description={`Are you sure you want to delete? This action cannot be undone.`}
      >
        <div className='w-full flex justify-center gap-8'>
          <Button
            disabled={isLoading}
            onClick={onCloseDialog}
            variant='outline'
          >
            Cancel
          </Button>
          <Button disabled={isLoading} onClick={handleDelete}>
            {isLoading ? <Loader className='w-4 h-4 animate-spin' /> : "Delete"}
          </Button>
        </div>
      </DialogLayout>
    </>
  );
}
