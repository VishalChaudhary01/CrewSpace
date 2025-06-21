import { CheckIcon, CopyIcon, Loader } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { PermissionsGuard } from "@/components/common/permission-guard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Permissions } from "@/constants";
import { useAuthContext } from "@/contexts/auth.context";
import { BASE_ROUTE } from "@/routes/comman/route-path";

export const InviteMember = () => {
  const { workspace, isWorkspaceLoading } = useAuthContext();
  const [copied, setCopied] = useState(false);

  const inviteUrl = workspace
    ? `${window.location.origin}${BASE_ROUTE.INVITE_URL.replace(
        ":inviteCode",
        workspace.inviteCode,
      )}`
    : "";

  const handleCopy = () => {
    if (inviteUrl) {
      navigator.clipboard.writeText(inviteUrl).then(() => {
        setCopied(true);
        toast.success("Invite url copied to clipboard");
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  return (
    <div className="flex flex-col px-0 pt-0.5">
      <h5 className="mb-1 text-lg leading-[30px] font-semibold">
        Invite members to join you
      </h5>
      <p className="text-muted-foreground text-sm leading-tight">
        Anyone with an invite link can join this free Workspace. You can also
        disable and create a new invite link for this Workspace at any time.
      </p>

      <PermissionsGuard showMessage requiredPermission={Permissions.ADD_MEMBER}>
        {isWorkspaceLoading ? (
          <Loader className="flex h-8 w-8 animate-spin place-self-center" />
        ) : (
          <div className="flex gap-2 py-3">
            <Label htmlFor="link" className="sr-only">
              Link
            </Label>
            <Input
              id="link"
              disabled={true}
              className="disabled:pointer-events-none disabled:opacity-100"
              value={inviteUrl}
              readOnly
            />
            <Button
              disabled={false}
              className="shrink-0"
              size="icon"
              onClick={handleCopy}
            >
              {copied ? (
                <CheckIcon className="h-4 w-4" />
              ) : (
                <CopyIcon className="h-4 w-4" />
              )}
            </Button>
          </div>
        )}
      </PermissionsGuard>
    </div>
  );
};
