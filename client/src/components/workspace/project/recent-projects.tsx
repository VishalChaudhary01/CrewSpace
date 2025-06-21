import { format } from "date-fns";
import { Loader } from "lucide-react";
import { Link } from "react-router-dom";

import { useGetProjectsInWorkspace } from "@/hooks";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { getAvatarColor, getAvatarText } from "@/lib/utils";

export const RecentProjects = () => {
  const workspaceId = useWorkspaceId();

  const { data, isPending } = useGetProjectsInWorkspace({
    workspaceId,
    pageNumber: 1,
    pageSize: 10,
  });

  const projects = data?.data?.projects || [];

  return (
    <div className="flex flex-col pt-2">
      {isPending ? (
        <Loader className="flex h-8 w-8 animate-spin place-self-center" />
      ) : projects?.length === 0 ? (
        <div className="text-muted-foreground py-5 text-center text-sm font-semibold">
          No Project created yet
        </div>
      ) : (
        <ul role="list" className="divide-border/50 space-y-2 divide-y">
          {projects.map((project) => {
            const name = project.createdBy.name;
            const initials = getAvatarText(name);
            const avatarColor = getAvatarColor(name);

            return (
              <li
                key={project._id}
                role="listitem"
                className="cursor-pointer rounded-md p-2 transition-colors duration-200 ease-in-out hover:bg-gray-50 md:px-4"
              >
                <Link
                  to={`/workspace/${workspaceId}/project/${project._id}`}
                  className="grid gap-8 p-0"
                >
                  <div className="flex items-center justify-start gap-2">
                    <img src="/bar-chart.svg" className="h-6 w-6" />
                    <div className="grid gap-1">
                      <p className="text-sm leading-none font-medium">
                        {project.name}
                      </p>
                      <p className="text-muted-foreground text-sm">
                        {project.createdAt
                          ? format(new Date(project.createdAt), "PPP")
                          : null}
                      </p>
                    </div>
                    <div className="ml-auto flex items-center gap-4">
                      <span className="text-muted-foreground text-sm">
                        Created by
                      </span>
                      <div
                        className={`hidden size-8 items-center justify-center rounded-full p-2 text-sm sm:flex ${avatarColor}`}
                      >
                        {initials}
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
