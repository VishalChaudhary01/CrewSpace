import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  CheckCircle,
  Circle,
  HelpCircle,
  Timer,
  View,
} from "lucide-react";

import { TaskPriority, TaskStatus } from "@/constants";
import { transformOptions } from "@/lib/utils";

const statusIcons = {
  [TaskStatus.BACKLOG]: HelpCircle,
  [TaskStatus.TODO]: Circle,
  [TaskStatus.IN_PROGRESS]: Timer,
  [TaskStatus.IN_REVIEW]: View,
  [TaskStatus.DONE]: CheckCircle,
};

const priorityIcons = {
  [TaskPriority.LOW]: ArrowDown,
  [TaskPriority.MEDIUM]: ArrowRight,
  [TaskPriority.HIGH]: ArrowUp,
};

export const statuses = transformOptions(
  Object.values(TaskStatus),
  statusIcons,
);

export const priorities = transformOptions(
  Object.values(TaskPriority),
  priorityIcons,
);
