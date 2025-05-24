import { Response } from "express";
import { ZodError } from "zod";
import { StatusCode } from "@/config/http.config";
import { ErrorCode } from "@/enums/error-code.enum";

export const formatZodError = (res: Response, error: ZodError) => {
  const errors = error?.issues?.map((err) => ({
    field: err.path.join("."),
    message: err.message,
  }));
  return res.status(StatusCode.BAD_REQUEST).json({
    message: "Validation Failed",
    error: errors,
    errorCode: ErrorCode.VALIDATION_ERROR,
  });
};
