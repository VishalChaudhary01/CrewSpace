import { Outlet } from "react-router-dom";

import { ScrollArea } from "@/components/ui/scroll-area";

export const BaseLayout = () => {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[1440px] overflow-hidden">
      <ScrollArea className="max-h-screen flex-1 pr-4">
        <Outlet />
      </ScrollArea>
    </div>
  );
};
