import mongoose, { Document, Schema } from "mongoose";

export interface ProjectDocument extends Document {
  name: string;
  description?: string;
  workspace: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<ProjectDocument>(
  {
    name: {
      type: String,
      required: true,
    },
    description: { type: String },
    workspace: {
      type: Schema.Types.ObjectId,
      ref: "WorkspaceModel",
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "UserModel",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const ProjectModel = mongoose.model<ProjectDocument>(
  "ProjectModel",
  projectSchema,
);
