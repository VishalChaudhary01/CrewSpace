import { Loader } from "lucide-react";
import { useAuthContext } from "@/contexts/auth.context";

export const WorkspaceHeader = () => {
  const { isWorkspaceLoading, workspace } = useAuthContext();

  return (
    <div className='w-full max-w-3xl mx-auto pb-2'>
      {isWorkspaceLoading ? (
        <div className='w-full flex items-center justify-center'>
          <Loader className='w-8 h-8 animate-spin place-self-center flex' />
        </div>
      ) : (
        <div className='flex items-center gap-4'>
          <div className="flex items-center justify-center rounded-full size-8 p-1 bg-primary text-primary-foreground ">
              {workspace?.name?.split(" ")?.[0]?.charAt(0).toUpperCase() || "W"}
          </div>
     
          <div className='grid flex-1 text-left leading-tight'>
            <span className='truncate capitalize font-semibold text-xl'>
              {workspace?.name}
            </span>
            <span className='truncate text-sm'>Free</span>
          </div>
        </div>
      )}
    </div>
  );
};
