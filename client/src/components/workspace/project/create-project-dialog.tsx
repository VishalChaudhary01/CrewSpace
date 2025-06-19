/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from "sonner";
import { Loader } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { createProjectMutationFn } from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCreateProjectDialog } from "@/hooks/dialog";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import type { CreateProjectInput } from "@/types/project.type";
import { createProjectSchema } from "@/validators/project.validator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { DialogLayout } from "@/components/common/dialog-layout";

export const CreateProjectDialog = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const workspaceId = useWorkspaceId();
  const { open, onClose } = useCreateProjectDialog();

  const { mutate, isPending } = useMutation({
    mutationFn: createProjectMutationFn,
  });

  const form = useForm<CreateProjectInput>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit = (inputs: CreateProjectInput) => {
    if (isPending) return;
    mutate(
      { workspaceId, inputs },
      {
        onSuccess: (result) => {
          const project = result.data?.project;
          queryClient.invalidateQueries({
            queryKey: ["all-projects", workspaceId],
          });
          toast.success(result.message);
          onClose();
          navigate(`/workspace/${workspaceId}/project/${project?._id}`);
        },
        onError: (error: any) => {
          toast.error(
            error.response.data.message || "Failed to create project",
          );
        },
      },
    );
  };

  return (
    <DialogLayout
      open={open}
      onClose={onClose}
      header='Add New Project'
      description='Organize and manage tasks, resources, and team collaboration'
      footer={
        <Button
          type='submit'
          disabled={isPending}
          form='create-project-form'
          className='w-full'
        >
          {isPending && <Loader className='w-4 h-4 animate-spin' />}
          Create
        </Button>
      }
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          id='create-project-form'
          className='space-y-4'
        >
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project title</FormLabel>
                <FormControl>
                  <Input placeholder='Enter project name' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='description'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project description</FormLabel>
                <FormControl>
                  <Textarea
                    rows={4}
                    placeholder='Enter Projects description'
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
