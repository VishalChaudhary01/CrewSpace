import mongoose, { Document, Schema } from "mongoose";
import { Verification, VerificationType } from "@/enums/verification.enum";

export interface VerificationDocument extends Document {
  userId: mongoose.Types.ObjectId;
  code?: string;
  token?: string;
  type: VerificationType;
  expiresAt: Date;
  createdAt: Date;
}

const verificationSchema = new Schema<VerificationDocument>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "UserModel",
    required: true,
    index: true,
  },
  code: {
    type: String,
    default: null,
  },
  token: {
    type: String,
    default: null,
    index: true,
  },
  type: {
    type: String,
    enum: Object.values(Verification),
    required: true,
  },
  createdAt: {
    type: Date,
    default: () => new Date(),
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

export const VerificationModel = mongoose.model(
  "VerificationModel",
  verificationSchema,
);
