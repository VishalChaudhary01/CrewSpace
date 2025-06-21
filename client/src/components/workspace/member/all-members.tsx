/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ChevronDown, Loader } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Permissions } from "@/constants";
import { useAuthContext } from "@/contexts/auth.context";
import { useGetMembersInWorkspace } from "@/hooks";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { changeWorkspaceMemberRoleMutationFn } from "@/lib/api";
import { getAvatarColor, getAvatarText } from "@/lib/utils";
import type { Member } from "@/types/workspace.type";

export const AllMembers = () => {
  const queryClient = useQueryClient();
  const workspaceId = useWorkspaceId();
  const { user, hasPermission } = useAuthContext();
  const canChangeMemberRole = hasPermission(Permissions.CHANGE_MEMBER_ROLE);
  const { data, isPending } = useGetMembersInWorkspace({ workspaceId });

  const members = data?.data?.members || [];
  const roles = data?.data?.roles || [];

  const { mutate, isPending: isLoading } = useMutation({
    mutationFn: changeWorkspaceMemberRoleMutationFn,
  });

  const handleSelect = (roleId: string, memberId: string) => {
    if (!roleId || !memberId) return;

    mutate(
      { workspaceId, inputs: { roleId, memberId } },
      {
        onSuccess: (result) => {
          queryClient.invalidateQueries({
            queryKey: ["members", workspaceId],
          });
          toast.success(result.message);
        },
        onError: (error: any) => {
          toast(
            error?.response?.data?.message ??
              "Failed to change workspace member",
          );
        },
      },
    );
  };

  return (
    <div className="grid gap-6 pt-2">
      {isPending ? (
        <Loader className="flex h-8 w-8 animate-spin place-self-center" />
      ) : null}

      {members?.map((member: Member) => {
        const name = member.userId?.name;
        const initials = getAvatarText(name);
        const avatarColor = getAvatarColor(name);
        return (
          <div
            key={member._id}
            className="flex items-center justify-between space-x-4"
          >
            <div className="flex items-center space-x-4">
              <div
                className={`flex size-8 items-center justify-center rounded-full p-2 text-sm ${avatarColor}`}
              >
                {initials}
              </div>
              <div>
                <p className="text-sm leading-none font-medium">{name}</p>
                <p className="text-muted-foreground text-sm">
                  {member.userId.email}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="ml-auto min-w-24 capitalize disabled:pointer-events-none disabled:opacity-95"
                    disabled={
                      isLoading ||
                      !canChangeMemberRole ||
                      member.userId._id === user?._id
                    }
                  >
                    {member.role.name?.toLowerCase()}{" "}
                    {canChangeMemberRole && member.userId._id !== user?._id && (
                      <ChevronDown className="text-muted-foreground" />
                    )}
                  </Button>
                </PopoverTrigger>
                {canChangeMemberRole && (
                  <PopoverContent className="p-0" align="end">
                    <Command>
                      <CommandInput
                        placeholder="Select new role..."
                        disabled={isLoading}
                        className="disabled:pointer-events-none"
                      />
                      <CommandList>
                        {isLoading ? (
                          <Loader className="my-4 flex h-8 w-8 animate-spin place-self-center" />
                        ) : (
                          <>
                            <CommandEmpty>No roles found.</CommandEmpty>
                            <CommandGroup>
                              {roles?.map(
                                (role) =>
                                  role.name !== "OWNER" && (
                                    <CommandItem
                                      key={role._id}
                                      disabled={isLoading}
                                      className="mb-1 flex cursor-pointer flex-col items-start gap-1 px-4 py-2 disabled:pointer-events-none"
                                      onSelect={() => {
                                        handleSelect(
                                          role._id,
                                          member.userId._id,
                                        );
                                      }}
                                    >
                                      <p className="capitalize">
                                        {role.name?.toLowerCase()}
                                      </p>
                                      <p className="text-muted-foreground text-sm">
                                        {role.name === "ADMIN" &&
                                          `Can view, create, edit tasks, project and manage settings .`}

                                        {role.name === "MEMBER" &&
                                          `Can view,edit only task created by.`}
                                      </p>
                                    </CommandItem>
                                  ),
                              )}
                            </CommandGroup>
                          </>
                        )}
                      </CommandList>
                    </Command>
                  </PopoverContent>
                )}
              </Popover>
            </div>
          </div>
        );
      })}
    </div>
  );
};
