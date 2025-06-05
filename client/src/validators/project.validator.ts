import { z } from "zod";
import { descriptionSchema, nameSchema } from "./common.validator";

export const createProjectSchema = z.object({
  name: nameSchema,
  description: descriptionSchema,
});

export const updateProjectSchema = createProjectSchema.partial();
