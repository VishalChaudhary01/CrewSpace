/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from "sonner";
import { useCallback, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AudioWaveform, EllipsisIcon, Loader, LogOut } from "lucide-react";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useAuthContext } from "@/contexts/auth.context";
import { signoutMutationFn } from "@/lib/api";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroupContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NavMain } from "./nav-main";
import { NavProjects } from "./nav-project";
import { NavWorkspace } from "./nav-workspace";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DialogLayout } from "@/components/common/dialog-layout";

export const Asidebar = () => {
  const { user, isAuthLoading } = useAuthContext();
  const { open } = useSidebar();
  const workspaceId = useWorkspaceId();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: signoutMutationFn,
    onSuccess: () => {
      queryClient.resetQueries({
        queryKey: ["auth-user"],
      });
      navigate("/");
      setIsOpen(false);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message ?? "Filed to Log out");
    },
  });

  const handleLogout = useCallback(() => {
    if (isPending) return;
    mutate();
  }, [isPending, mutate]);

  return (
    <>
      <Sidebar collapsible='icon'>
        <SidebarHeader className='!py-0'>
          <div className='flex h-[50px] items-center justify-start w-full px-1'>
            {open && (
              <Link
                to={`/workspace/${workspaceId}`}
                className='hidden md:flex ml-2 items-center gap-2 self-center font-medium'
              >
                <Button size='sm'>
                  <AudioWaveform size={6} />
                </Button>
                <span className='font-semibold text-base'>Crew Space</span>
              </Link>
            )}
          </div>
        </SidebarHeader>
        <SidebarContent className='!mt-0 flex-1 overflow-hidden'>
          <SidebarGroup className='!py-0 flex flex-col h-full'>
            <SidebarGroupContent>
              <NavWorkspace />
              <Separator />
              <NavMain />
              <Separator />
            </SidebarGroupContent>
            <SidebarGroupContent className='flex-1 min-h-0'>
              <NavProjects />
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              {isAuthLoading ? (
                <Loader className='size-6 place-self-center self-center animate-spin' />
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton
                      size='lg'
                      className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
                    >
                      <div className='rounded-full p-2 size-8 flex justify-center items-center bg-primary text-primary-foreground'>
                        {user?.name?.split(" ")?.[0]?.charAt(0)}
                      </div>
                      <div className='grid flex-1 text-left text-sm leading-tight'>
                        <span className='truncate font-semibold'>
                          {user?.name}
                        </span>
                        <span className='truncate text-xs'>{user?.email}</span>
                      </div>
                      <EllipsisIcon className='ml-auto size-4' />
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className='w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg'
                    side={"bottom"}
                    align='start'
                    sideOffset={4}
                  >
                    <DropdownMenuItem onClick={() => setIsOpen(true)}>
                      <LogOut />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <DialogLayout
        open={isOpen}
        onClose={() => setIsOpen(false)}
        header='Are you sure you want to log out?'
        description='This will end your current session and you will need to log in
              again to access your account.'
      >
        <div className='flex gap-4 justify-center'>
          <Button
            type='button'
            variant='outline'
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </Button>
          <Button disabled={isPending} type='button' onClick={handleLogout}>
            {isPending ? (
              <Loader className='size-4 animate-spin' />
            ) : (
              "Sign out"
            )}
          </Button>
        </div>
      </DialogLayout>
    </>
  );
};
