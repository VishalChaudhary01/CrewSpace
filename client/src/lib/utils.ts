import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import type { TaskPriorityType, TaskStatusType } from "@/constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const transformStatusEnum = (status: string): string => {
  return status.replace(/_/g, " ");
};

export const getStatusColor = (status: TaskStatusType): string => {
  switch (status) {
    case "BACKLOG":
      return "bg-gray-200 text-gray-800";
    case "TODO":
      return "bg-blue-200 text-blue-800";
    case "IN_PROGRESS":
      return "bg-yellow-200 text-yellow-800";
    case "IN_REVIEW":
      return "bg-purple-200 text-purple-800";
    case "DONE":
      return "bg-green-200 text-green-800";
    default:
      return "bg-gray-200 text-gray-800";
  }
};

export const getPriorityColor = (priority: TaskPriorityType): string => {
  switch (priority) {
    case "LOW":
      return "bg-green-200 text-green-800";
    case "MEDIUM":
      return "bg-yellow-200 text-yellow-800";
    case "HIGH":
      return "bg-red-200 text-red-800";
    default:
      return "bg-gray-200 text-gray-800";
  }
};

export const getAvatarColor = (initials: string): string => {
  const colors = [
    "bg-red-500 text-white",
    "bg-blue-500 text-white",
    "bg-green-500 text-white",
    "bg-yellow-500 text-black",
    "bg-purple-500 text-white",
    "bg-pink-500 text-white",
    "bg-teal-500 text-white",
    "bg-orange-500 text-black",
  ];

  const hash = initials
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);

  return colors[hash % colors.length];
};

export const getAvatarText = (name: string) => {
  if (!name) return "UN";
  const initials = name
    .split(" ")
    .map((n) => n.charAt(0).toUpperCase())
    .join("")
    .slice(0, 2);
  return initials || "UN";
};

export const transformOptions = (
  options: string[],
  iconMap?: Record<string, React.ComponentType<{ className?: string }>>,
) =>
  options.map((value) => ({
    label: value
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase()),
    value: value,
    icon: iconMap ? iconMap[value] : undefined,
  }));

export const formatStatusToEnum = (status: string): string => {
  return status.toUpperCase().replace(/\s+/g, "_");
};
