import React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { cn } from "@/lib/utils";

type CardLayoutProps = {
  children: React.ReactNode;
  header: string;
  description?: string;
  footer?: React.ReactNode;
  className?: string;
};

export const CardLayout: React.FC<CardLayoutProps> = ({
  children,
  header,
  description,
  footer,
  className,
}) => {
  return (
    <Card className={cn("max-w-[700px] min-w-[350px]", className)}>
      <CardHeader>
        <CardTitle className="text-center text-2xl font-bold md:text-3xl">
          {header}
        </CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>{children}</CardContent>
      {footer && (
        <CardFooter className="text-muted-foreground flex justify-center text-sm">
          {footer}
        </CardFooter>
      )}
    </Card>
  );
};
