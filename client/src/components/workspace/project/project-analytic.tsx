import { useParams } from "react-router-dom";

import { AnalyticsCard } from "@/components/common/analytics-card";

import { useGetProjectAnalytics } from "@/hooks";
import { useWorkspaceId } from "@/hooks/use-workspace-id";

export const ProjectAnalytic = () => {
  const param = useParams();
  const workspaceId = useWorkspaceId();
  const projectId = param.projectId as string;
  const { data, isPending } = useGetProjectAnalytics({
    workspaceId,
    projectId,
  });
  const analytics = data?.data?.analytics;

  return (
    <div className="grid gap-4 md:gap-5 lg:grid-cols-2 xl:grid-cols-3">
      <AnalyticsCard
        isLoading={isPending}
        title="Total Task"
        value={analytics?.totalTasks || 0}
      />
      <AnalyticsCard
        isLoading={isPending}
        title="Overdue Task"
        value={analytics?.overdueTasks || 0}
      />
      <AnalyticsCard
        isLoading={isPending}
        title="Completed Task"
        value={analytics?.completedTasks || 0}
      />
    </div>
  );
};
