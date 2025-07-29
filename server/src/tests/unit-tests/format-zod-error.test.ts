import { Response } from "express";
import { ZodError } from "zod";

import { StatusCode } from "@/config/http.config";
import { ErrorCode } from "@/enums/error-code.enum";
import { formatZodError } from "@/utils/format-zod-error";

describe("formarZodError", () => {
  it("should respond with status 400 and formatted zod error", () => {
    const statusMock = jest.fn();
    const jsonMock = jest.fn();

    const res = {
      status: statusMock.mockReturnThis(),
      json: jsonMock,
    } as unknown as Response;

    const fakeZodError = new ZodError([
      {
        path: ["email"],
        message: "Invalid email address",
        code: "custom",
      },
      {
        path: ["password"],
        message: "Password too short",
        code: "custom",
      },
    ]);

    formatZodError(res, fakeZodError);

    expect(statusMock).toHaveBeenCalledWith(StatusCode.BAD_REQUEST);
    expect(jsonMock).toHaveBeenCalledWith({
      message: "Validation Failed",
      error: [
        { field: "email", message: "Invalid email address" },
        { field: "password", message: "Password too short" },
      ],
      errorCode: ErrorCode.VALIDATION_ERROR,
    });
  });
});
