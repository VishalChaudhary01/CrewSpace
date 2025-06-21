import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RecentMembers } from "@/components/workspace/member/recent-members";
import { RecentProjects } from "@/components/workspace/project/recent-projects";
import { RecentTasks } from "@/components/workspace/task/recent-tasks";
import { WorkspaceAnalytics } from "@/components/workspace/workspace-analytics";

import { useCreateProjectDialog } from "@/hooks/dialog";

export const WorkspaceDashboardPage = () => {
  const { onOpen } = useCreateProjectDialog();

  return (
    <main className="flex flex-1 flex-col">
      <div className="mb-6 flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Workspace Overview
          </h2>
          <p className="text-muted-foreground">
            Here&apos;s an overview for this workspace!
          </p>
        </div>
        <Button onClick={onOpen}>
          <Plus className="h-4 w-4" />
          New Project
        </Button>
      </div>
      Workspace Analytics
      <WorkspaceAnalytics />
      <div className="mt-4">
        <Tabs defaultValue="projects" className="w-full rounded-lg border p-2">
          <TabsList className="h-12 w-full justify-start border-0 bg-gray-50 px-1">
            <TabsTrigger className="py-2" value="projects">
              Recent Projects
            </TabsTrigger>
            <TabsTrigger className="py-2" value="tasks">
              Recent Tasks
            </TabsTrigger>
            <TabsTrigger className="py-2" value="members">
              Recent Members
            </TabsTrigger>
          </TabsList>
          <TabsContent value="projects">
            <RecentProjects />
          </TabsContent>
          <TabsContent value="tasks">
            <RecentTasks />
          </TabsContent>
          <TabsContent value="members">
            <RecentMembers />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
};
