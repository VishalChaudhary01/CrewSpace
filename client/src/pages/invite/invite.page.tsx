/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import { CardLayout } from "@/components/common/card-layout";
import { Button } from "@/components/ui/button";

import { useAuth } from "@/hooks";
import { invitedUserJoinWorkspaceMutationFn } from "@/lib/api";
import { BASE_ROUTE } from "@/routes/comman/route-path";

export const InvitePage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const param = useParams();
  const inviteCode = param.inviteCode as string;

  const { data: authData, isPending } = useAuth();
  const user = authData?.data?.user;

  const { mutate, isPending: isLoading } = useMutation({
    mutationFn: invitedUserJoinWorkspaceMutationFn,
  });

  const returnUrl = encodeURIComponent(
    `${BASE_ROUTE.INVITE_URL.replace(":inviteCode", inviteCode)}`,
  );

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    mutate(
      { inviteCode },
      {
        onSuccess: (result) => {
          queryClient.resetQueries({
            queryKey: ["user-workspaces"],
          });
          toast.success(result.message);
          navigate(`/workspace/${result.data?.workspaceId}`);
        },
        onError: (error: any) => {
          toast.error(
            error?.response?.data?.message ?? "Failed to Delete Wrokspace",
          );
        },
      },
    );
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="flex w-full max-w-md flex-col gap-6">
        <Link
          to="/"
          className="flex items-center gap-2 self-center text-base font-semibold"
        >
          CrewSpace
        </Link>
        <div className="flex flex-col gap-6">
          <CardLayout
            header="Hey there! You are invited to join a CrewSpace Workspace!"
            description="Looks like you need to be logged into your CrewSpace account to
                join this Workspace."
          >
            {isPending ? (
              <Loader className="flex h-8 w-8 animate-spin place-self-center" />
            ) : (
              <div>
                {user ? (
                  <div className="my-3 flex items-center justify-center">
                    <form onSubmit={handleSubmit}>
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="!bg-green-600 !text-white"
                      >
                        {isLoading ? (
                          <Loader className="h-4 w-4 animate-spin" />
                        ) : (
                          "Join the Workspace"
                        )}
                      </Button>
                    </form>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 md:flex-row">
                    <Link
                      className="w-full flex-1 text-base"
                      to={`/signup?returnUrl=${returnUrl}`}
                    >
                      <Button className="w-full">Signup</Button>
                    </Link>
                    <Link
                      className="w-full flex-1 text-base"
                      to={`/?returnUrl=${returnUrl}`}
                    >
                      <Button variant="secondary" className="w-full border">
                        Login
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </CardLayout>
        </div>
      </div>
    </div>
  );
};
