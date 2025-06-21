import { Separator } from "@/components/ui/separator";
import { ProjectAnalytic } from "@/components/workspace/project/project-analytic";
import { ProjectHeader } from "@/components/workspace/project/project-header";
import { TaskTable } from "@/components/workspace/task/task-table";

export const ProjectDetailsPage = () => {
  return (
    <div className="w-full space-y-6 py-4 md:pt-3">
      <ProjectHeader />
      <div className="space-y-5">
        <ProjectAnalytic />
        <Separator />
        <TaskTable />
      </div>
    </div>
  );
};
