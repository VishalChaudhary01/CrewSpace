import { z } from "zod";
import { descriptionSchema, idSchema, nameSchema } from "./common.validator";

export const createWorkspaceSchema = z.object({
  name: nameSchema,
  description: descriptionSchema,
});

export const updateWorkspaceSchema = createWorkspaceSchema.partial();

export const changeRoleSchema = z.object({
  roleId: idSchema,
  memberId: idSchema,
});

export type CreateWorkspaceDto = z.infer<typeof createWorkspaceSchema>;
export type UpdateWorkspaceDto = z.infer<typeof updateWorkspaceSchema>;
