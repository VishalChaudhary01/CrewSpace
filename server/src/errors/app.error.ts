import { StatusCode, StatusCodeType } from "@/config/http.config";
import { ErrorCodeType } from "@/enums/error-code.enum";

export class AppError extends Error {
  public statusCode: StatusCodeType;
  public errorCode?: ErrorCodeType;

  constructor(
    message: string,
    statusCode: StatusCodeType = StatusCode.INTERNAL_SERVER_ERROR,
    errorCode?: ErrorCodeType,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    Error.captureStackTrace(this, this.constructor);
  }
}
