import mongoose, { Document, Schema } from "mongoose";
import { RoleDocument } from "./role.model";

export interface MemberDocument extends Document {
  userId: mongoose.Types.ObjectId;
  workspaceId: mongoose.Types.ObjectId;
  role: RoleDocument;
  joinedAt: Date;
}

const memberSchema = new Schema<MemberDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "UserModel",
      required: true,
    },
    workspaceId: {
      type: Schema.Types.ObjectId,
      ref: "WorkspaceModel",
      required: true,
    },
    role: {
      type: Schema.Types.ObjectId,
      ref: "RoleModel",
      required: true,
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

export const MemberModel = mongoose.model<MemberDocument>(
  "MemberModel",
  memberSchema,
);
