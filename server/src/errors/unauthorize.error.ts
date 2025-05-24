import { AppError } from "./app.error";
import { StatusCode } from "@/config/http.config";
import { ErrorCode, ErrorCodeType } from "@/enums/error-code.enum";

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized Access", errorCode?: ErrorCodeType) {
    super(
      message,
      StatusCode.UNAUTHORIZED,
      errorCode || ErrorCode.ACCESS_UNAUTHORIZED,
    );
  }
}
