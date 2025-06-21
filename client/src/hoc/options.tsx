import { cn, getAvatarColor, getAvatarText } from "@/lib/utils";
import type { Project } from "@/types/project.type";
import type { Member } from "@/types/workspace.type";

export const getProjectOptions = (projects: Project[]) => {
  const projectOptions = projects?.map((project) => {
    return {
      label: <div>{project.name}</div>,
      value: project._id,
    };
  });

  return projectOptions;
};

export const getMemberOptions = (members: Member[]) => {
  const assigneesOptions = members?.map((member) => {
    const name = member.userId?.name || "Unknown";
    const initials = getAvatarText(name);
    const avatarColor = getAvatarColor(name);

    return {
      label: (
        <div className="flex items-center space-x-2">
          <div
            className={cn(
              "flex w-6 items-center justify-center rounded-full p-1",
              avatarColor,
            )}
          >
            {initials}
          </div>
          <span>{name}</span>
        </div>
      ),
      value: member.userId._id,
    };
  });

  return assigneesOptions;
};
