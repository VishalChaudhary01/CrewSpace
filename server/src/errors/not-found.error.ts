import { AppError } from "./app.error";
import { StatusCode } from "@/config/http.config";
import { ErrorCode, ErrorCodeType } from "@/enums/error-code.enum";

export class NotFoundError extends AppError {
  constructor(message = "Resource not found", errorCode?: ErrorCodeType) {
    super(
      message,
      StatusCode.NOT_FOUND,
      errorCode || ErrorCode.RESOURCE_NOT_FOUND,
    );
  }
}
