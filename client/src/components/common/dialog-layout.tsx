import React from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { ScrollArea } from "../ui/scroll-area";

interface DialogLayoutProps {
  open: boolean;
  onClose: (open: boolean) => void;
  header: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const DialogLayout: React.FC<DialogLayoutProps> = ({
  open,
  onClose,
  header,
  description,
  children,
  footer,
}) => {
  return (
    <Dialog modal={true} open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold md:text-2xl">
            {header}
          </DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-4">{children}</ScrollArea>
        <DialogFooter>{footer}</DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
