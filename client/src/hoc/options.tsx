import type { Project } from "@/types/project.type";
import type { Member } from "@/types/workspace.type";
import { cn, getAvatarColor, getAvatarText } from "@/lib/utils";

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
        <div className='flex items-center space-x-2'>
          <div
            className={cn(
              "w-6 rounded-full p-1 flex items-center justify-center",
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
