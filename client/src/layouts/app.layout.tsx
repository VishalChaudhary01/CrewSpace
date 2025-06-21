import { Outlet, useParams } from "react-router-dom";

import { Asidebar } from "@/components/asidebar/asidebar";
import { Header } from "@/components/common/header";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SidebarProvider } from "@/components/ui/sidebar";
import { CreateWorkspaceDialog } from "@/components/workspace/create-workspace-dialog";
import { CreateProjectDialog } from "@/components/workspace/project/create-project-dialog";
import { CreateTaskDialog } from "@/components/workspace/task/create-task-dialog";

import { AuthProvider } from "@/providers/auth.provider";

export const AppLayout = () => {
  const param = useParams();
  const projectId = param.projectId as string;

  return (
    <AuthProvider>
      <SidebarProvider>
        <Asidebar />
        <div className="flex min-h-screen w-full overflow-y-hidden">
          <div className="flex w-full flex-col">
            <Header />
            <ScrollArea className="max-h-[calc(100vh-30px)] flex-1">
              <main className="mx-auto max-w-7xl px-4 py-6 md:px-6">
                <Outlet />
              </main>
            </ScrollArea>
          </div>
          <CreateWorkspaceDialog />
          <CreateProjectDialog />
          <CreateTaskDialog projectId={projectId || undefined} />
        </div>
      </SidebarProvider>
    </AuthProvider>
  );
};
