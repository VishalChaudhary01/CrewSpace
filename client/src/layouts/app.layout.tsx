import { Outlet } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AuthProvider } from "@/providers/auth.provider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Asidebar } from "@/components/asidebar/asidebar";
import { CreateWorkspaceDialog } from "@/components/workspace/create-workspace-dialog";
import { CreateProjectDialog } from "@/components/workspace/project/create-project-dialog";

export const AppLayout = () => {
  return (
    <AuthProvider>
      <SidebarProvider>
        <Asidebar />
        <div className='flex min-h-screen w-full overflow-y-hidden'>
          <div className='flex flex-col w-full'>
            <ScrollArea className='flex-1 max-h-[calc(100vh-30px)]'>
              <main className='py-6 px-4 md:px-6 max-w-7xl mx-auto'>
                <Outlet />
              </main>
            </ScrollArea>
          </div>
          <CreateWorkspaceDialog />
          <CreateProjectDialog />
        </div>
      </SidebarProvider>
    </AuthProvider>
  );
};
