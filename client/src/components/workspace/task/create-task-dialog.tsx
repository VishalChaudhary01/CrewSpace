import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { CalendarIcon, Loader } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { DialogLayout } from "@/components/common/dialog-layout";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { TaskPriority, TaskStatus } from "@/constants";
import { getMemberOptions, getProjectOptions } from "@/hoc/options";
import { useGetMembersInWorkspace, useGetProjectsInWorkspace } from "@/hooks";
import { useCreateTaskDialog } from "@/hooks/dialog";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { createTaskMutationFn } from "@/lib/api";
import { cn, transformOptions } from "@/lib/utils";
import type { CreateTaskInput } from "@/types/task.type";
import { createTaskSchema } from "@/validators/task.validator";

export const CreateTaskDialog = ({ projectId }: { projectId?: string }) => {
  const queryClient = useQueryClient();
  const workspaceId = useWorkspaceId();
  const { open, onClose } = useCreateTaskDialog();

  const { mutate, isPending } = useMutation({
    mutationFn: createTaskMutationFn,
  });

  const { data, isLoading } = useGetProjectsInWorkspace({
    workspaceId,
    skip: !!projectId,
  });

  const { data: memberData } = useGetMembersInWorkspace({ workspaceId });

  const projects = data?.data?.projects || [];
  const members = memberData?.data?.members || [];

  const projectOptions = getProjectOptions(projects);
  const memberOptions = getMemberOptions(members);

  const taskStatusList = Object.values(TaskStatus);
  const taskPriorityList = Object.values(TaskPriority);

  const statusOptions = transformOptions(taskStatusList);
  const priorityOptions = transformOptions(taskPriorityList);

  const form = useForm<CreateTaskInput>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: "",
      description: "",
      projectId: projectId ? projectId : "",
    },
  });

  const onSubmit = (inputs: CreateTaskInput) => {
    if (isPending) return;
    mutate(
      { workspaceId, inputs },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["project-analytics", projectId],
          });
          queryClient.invalidateQueries({
            queryKey: ["all-tasks", workspaceId],
          });

          toast.success("Task created successfully");
          setTimeout(() => onClose(), 100);
        },
        onError: (error) => {
          toast.error(error.message || "Failed to create Task");
        },
      },
    );
  };

  return (
    <DialogLayout
      open={open}
      onClose={onClose}
      header="Create New Project"
      description="Organize and manage tasks, resources, and team collaboration"
      footer={
        <Button
          type="submit"
          disabled={isPending}
          form="create-task-form"
          className="w-full"
        >
          {isPending && <Loader className="h-4 w-4 animate-spin" />}
          Create
        </Button>
      }
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          id="create-task-form"
          className="space-y-4"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Task title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter task title" {...field} />
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
                <FormLabel>Task description</FormLabel>
                <FormControl>
                  <Textarea
                    rows={4}
                    placeholder="Enter task description"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* ProjectId */}
          {!projectId && (
            <div>
              <FormField
                control={form.control}
                name="projectId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Project" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {isLoading && (
                          <div className="my-2">
                            <Loader className="flex size-4 animate-spin place-self-center" />
                          </div>
                        )}
                        <div className="scrollbar max-h-[200px] w-full overflow-y-auto">
                          {projectOptions?.map((project) => (
                            <SelectItem
                              key={project.value}
                              className="cursor-pointer !capitalize"
                              value={project.value}
                            >
                              {project.label}
                            </SelectItem>
                          ))}
                        </div>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          {/* Assigned To */}
          <FormField
            control={form.control}
            name="assignedTo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Assigned To</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value as string}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Assignee" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <div className="scrollbar max-h-[200px] w-full overflow-y-auto">
                      {memberOptions?.map((member) => (
                        <SelectItem
                          className="cursor-pointer"
                          key={member.value}
                          value={member.value}
                        >
                          {member.label}
                        </SelectItem>
                      ))}
                    </div>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Due Date */}
          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Due Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value ? (
                          format(new Date(field.value), "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="z-50 w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) => {
                        if (date) {
                          field.onChange(date.toISOString());
                        }
                      }}
                      disabled={
                        (date) =>
                          date < new Date(new Date().setHours(0, 0, 0, 0)) || // Disable past dates
                          date > new Date("2050-12-31") //Prevent selection beyond a far future date
                      }
                      initialFocus
                      defaultMonth={new Date()}
                      fromMonth={new Date()}
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* {Status} */}
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        className="!text-muted-foreground !capitalize"
                        placeholder="Select a status"
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {statusOptions?.map((status) => (
                      <SelectItem
                        className="!capitalize"
                        key={status.value}
                        value={status.value}
                      >
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* {Priority} */}
          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priority</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a priority" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {priorityOptions?.map((priority) => (
                      <SelectItem
                        className="!capitalize"
                        key={priority.value}
                        value={priority.value}
                      >
                        {priority.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </DialogLayout>
  );
};
