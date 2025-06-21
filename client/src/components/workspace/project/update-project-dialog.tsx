import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { DialogLayout } from "@/components/common/dialog-layout";
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
import { Textarea } from "@/components/ui/textarea";

import { useUpdateProjectDialog } from "@/hooks/dialog";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { updateProjectMutationFn } from "@/lib/api";
import type { Project, UpdateProjectInput } from "@/types/project.type";
import { updateProjectSchema } from "@/validators/project.validator";

export const UpdateProjectDialog = ({ project }: { project: Project }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const workspaceId = useWorkspaceId();

  const { open, onClose } = useUpdateProjectDialog();

  const { mutate, isPending } = useMutation({
    mutationFn: updateProjectMutationFn,
  });

  const form = useForm<UpdateProjectInput>({
    resolver: zodResolver(updateProjectSchema),
    defaultValues: {
      name: project.name ?? "",
      description: project.description ?? "",
    },
  });

  const onSubmit = (inputs: UpdateProjectInput) => {
    if (isPending) return;

    mutate(
      { workspaceId, projectId: project._id, inputs },
      {
        onSuccess: (result) => {
          const project = result.data?.project;

          queryClient.invalidateQueries({
            queryKey: ["project", project?._id],
          });
          queryClient.invalidateQueries({
            queryKey: ["all-projects", workspaceId],
          });
          toast.success("Project updated successfully");
          onClose();

          navigate(`/workspace/${workspaceId}/project/${project?._id}`);
        },
        onError: (error) => {
          toast.error(error.message || "Failed to create project");
        },
      },
    );
  };

  return (
    <DialogLayout
      open={open}
      onClose={onClose}
      header="Edit Project"
      description="Update the project details to refine task management"
      footer={
        <Button
          type="submit"
          disabled={isPending}
          form="edit-project-form"
          className="w-full"
        >
          {isPending && <Loader className="w-4 h-4 animate-spin" />}
          Update
        </Button>
      }
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          id="edit-project-form"
          className="space-y-4"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project title</FormLabel>
                <FormControl>
                  <Input placeholder="Update project name" {...field} />
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
                <FormLabel>Project description</FormLabel>
                <FormControl>
                  <Textarea
                    rows={4}
                    placeholder="Update Projects description"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </DialogLayout>
  );
};
