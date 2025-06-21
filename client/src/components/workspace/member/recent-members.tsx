import { format } from "date-fns";
import { Loader } from "lucide-react";

import { useGetMembersInWorkspace } from "@/hooks";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { getAvatarColor, getAvatarText } from "@/lib/utils";

export const RecentMembers = () => {
  const workspaceId = useWorkspaceId();
  const { data, isPending } = useGetMembersInWorkspace({ workspaceId });

  const members = data?.data?.members || [];

  return (
    <div className="flex flex-col pt-2">
      {isPending ? (
        <Loader className="flex h-8 w-8 animate-spin place-self-center" />
      ) : null}
      <ul role="list" className="divide-border/50 space-y-2 divide-y">
        {members.map((member, index) => {
          const name = member?.userId?.name || "";
          const initials = getAvatarText(name);
          const avatarColor = getAvatarColor(name);
          return (
            <li
              key={index}
              role="listitem"
              className="flex items-center gap-4 rounded-md p-3 transition-colors duration-200 ease-in-out hover:bg-gray-50"
            >
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div
                  className={`hidden size-8 items-center justify-center rounded-full p-2 text-sm sm:flex ${avatarColor}`}
                >
                  {initials}
                </div>
              </div>

              {/* Member Details */}
              <div className="flex flex-col">
                <p className="text-base font-medium">{member.userId.name}</p>
                <p className="text-muted-foreground text-sm">
                  {member.role.name}
                </p>
              </div>

              {/* Joined Date */}
              <div className="text-muted-foreground ml-auto text-sm">
                <p>Joined</p>
                <p>
                  {member.joinedAt
                    ? format(new Date(member.joinedAt), "PPP")
                    : null}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
