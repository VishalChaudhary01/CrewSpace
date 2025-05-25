import mongoose, { Document, Schema } from "mongoose";
import { generateTaskCode } from "../utils/uuid";
import {
  TaskPriority,
  TaskPriorityType,
  TaskStatus,
  TaskStatusType,
} from "@/enums/task.enum";

export interface TaskDocument extends Document {
  taskCode: string;
  title: string;
  description?: string;
  project: mongoose.Types.ObjectId;
  workspace: mongoose.Types.ObjectId;
  status: TaskStatusType;
  priority: TaskPriorityType;
  assignedTo: mongoose.Types.ObjectId | null;
  createdBy: mongoose.Types.ObjectId;
  dueDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new Schema<TaskDocument>(
  {
    taskCode: {
      type: String,
      unique: true,
      default: generateTaskCode,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: "ProjectModel",
      required: true,
    },
    workspace: {
      type: Schema.Types.ObjectId,
      ref: "WorkspaceModel",
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(TaskStatus),
      default: TaskStatus.TODO,
    },
    priority: {
      type: String,
      enum: Object.values(TaskPriority),
      default: TaskPriority.MEDIUM,
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "UserModel",
      default: null,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "UserModel",
      required: true,
    },
    dueDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

export const TaskModel = mongoose.model<TaskDocument>("TaskModel", taskSchema);
