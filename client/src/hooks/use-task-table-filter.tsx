import { parseAsString, parseAsStringEnum, useQueryStates } from "nuqs";

import {
  type TaskStatusType,
  TaskStatus,
  TaskPriority,
  type TaskPriorityType,
} from "@/constants";

export const useTaskTableFilter = () => {
  return useQueryStates({
    status: parseAsStringEnum<TaskStatusType>(Object.values(TaskStatus)),
    priority: parseAsStringEnum<TaskPriorityType>(Object.values(TaskPriority)),
    keyword: parseAsString,
    projectId: parseAsString,
    assignedTo: parseAsString,
  });
};
