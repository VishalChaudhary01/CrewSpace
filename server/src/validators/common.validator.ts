import { TaskPriority, TaskStatus } from "@/enums/task.enum";
import { z } from "zod";

// Email schema
export const emailSchema = z
  .string({ required_error: "Email is required" })
  .trim()
  .min(1, { message: "Email cannot be empty" })
  .email("Please enter a valid email address");

// Password schema
export const passwordSchema = z
  .string({ required_error: "Password is required" })
  .trim()
  .min(8, { message: "Password must be at least 8 characters" })
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[@$!%*?&#]/, "Password must contain at least one special character");

// Name schema
export const nameSchema = z
  .string({ required_error: "Name is required" })
  .trim()
  .min(2, { message: "Name must be at least 2 characters" })
  .max(50, { message: "Name must be under 50 characters" });

export const verificationCodeSchema = z
  .string({ required_error: "Verification code is required" })
  .trim()
  .length(6, { message: "Verification code must be exactly 6 digits" })
  .regex(/^\d{6}$/, { message: "Verification code must contain only digits" });

export const titleSchema = z
  .string({ required_error: "Title is required" })
  .trim()
  .min(1, "Title is required")
  .max(50, "Title should be less then 50 characters");

export const descriptionSchema = z
  .string()
  .trim()
  .max(500, "Description should be less then 500 characters")
  .optional();

export const idSchema = z
  .string({ required_error: "Id is required" })
  .trim()
  .min(1, "Id is Required");

export const assignedToSchema = z
  .string()
  .trim()
  .min(1, "Assigned To is required")
  .optional()
  .nullable();

export const prioritySchema = z
  .enum(Object.values(TaskPriority) as [string, ...string[]], {
    required_error: "Priority is required",
  })
  .optional();

export const statusSchema = z
  .enum(Object.values(TaskStatus) as [string, ...string[]], {
    required_error: "Status is required",
  })
  .optional();

export const dueDateSchema = z
  .string()
  .trim()
  .optional()
  .refine((val) => !val || !isNaN(Date.parse(val)), {
    message: "Due date must be a valid date string (e.g., YYYY-MM-DD)",
  });

export const inviteCodeSchema = z
  .string({
    required_error: "Invite code is required",
  })
  .trim();
