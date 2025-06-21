/* eslint-disable @typescript-eslint/no-explicit-any */
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Textarea } from "@/components//ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { Permissions } from "@/constants";
import { useAuthContext } from "@/contexts/auth.context";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { updateWorkspaceMutationFn } from "@/lib/api";
import type { UpdateWorkspaceInput } from "@/types/workspace.type";
import { updateWorkspaceSchema } from "@/validators/workspace.validator";

export const EditWorkspaceForm = () => {
  const { workspace, hasPermission } = useAuthContext();
  const canEditWorkspace = hasPermission(Permissions.EDIT_WORKSPACE);

  const queryClient = useQueryClient();
  const workspaceId = useWorkspaceId();

  const { mutate, isPending } = useMutation({
    mutationFn: updateWorkspaceMutationFn,
  });

  const form = useForm<UpdateWorkspaceInput>({
    resolver: zodResolver(updateWorkspaceSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  useEffect(() => {
    if (workspace) {
      form.setValue("name", workspace.name);
      form.setValue("description", workspace?.description || "");
    }
  }, [form, workspace]);

  const onSubmit = (inputs: UpdateWorkspaceInput) => {
    if (isPending) return;
    mutate(
      { workspaceId, inputs },
      {
        onSuccess: (result) => {
          queryClient.invalidateQueries({
            queryKey: ["workspace"],
          });
          queryClient.invalidateQueries({
            queryKey: ["user-workspaces"],
          });
          toast.success(result.message);
        },
        onError: (error: any) => {
          toast.error(
            error?.response?.data?.message ?? "Failed to Update Workspace",
          );
        },
      },
    );
  };

  return (
    <div className="h-auto w-full max-w-full">
      <div className="h-full">
        <div className="mb-5 border-b">
          <h1 className="mb-1.5 text-center text-[17px] font-semibold tracking-[-0.16px] sm:text-left">
            Update Workspace
          </h1>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Workspace Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter workspace name"
                      disabled={!canEditWorkspace}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Workspace description
                    <span className="ml-2 text-xs font-extralight">
                      Optional
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      rows={6}
                      disabled={!canEditWorkspace}
                      placeholder="Enter description of workspace."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {canEditWorkspace && (
              <Button
                className="mt-2 flex place-self-end"
                disabled={isPending}
                type="submit"
              >
                {isPending ? (
                  <Loader className="h-4 w-4 animate-spin" />
                ) : (
                  "Update Workspace"
                )}
              </Button>
            )}
          </form>
        </Form>
      </div>
    </div>
  );
};
