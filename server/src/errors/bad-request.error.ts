import { AppError } from "./app.error";
import { StatusCode } from "@/config/http.config";
import { ErrorCode, ErrorCodeType } from "@/enums/error-code.enum";

export class BadRequestError extends AppError {
  constructor(message = "Bad Request", errorCode?: ErrorCodeType) {
    super(
      message,
      StatusCode.BAD_REQUEST,
      errorCode || ErrorCode.VALIDATION_ERROR,
    );
  }
}
