import mongoose, { Document, Schema } from "mongoose";
import {
  VerificationEnum,
  VerificationEnumType,
} from "@/enums/verification.enum";

export interface VerificationDocument extends Document {
  userId: mongoose.Types.ObjectId;
  code?: string;
  token?: string;
  type: VerificationEnumType;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const verificationSchema = new Schema<VerificationDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "UserModel",
      required: true,
    },
    code: {
      type: String,
      default: null,
    },
    token: {
      type: String,
      default: null,
    },
    type: {
      type: String,
      enum: Object.values(VerificationEnum),
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true },
);

export const VerificationModel = mongoose.model(
  "VerificationModel",
  verificationSchema,
);
