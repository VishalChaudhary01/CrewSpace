import { getErrorMessage } from "@/utils/get-error-message";

describe("getErrorMessage", () => {
  it("Should return message from an Error instance", () => {
    const error = new Error("Something went wrong");
    expect(getErrorMessage(error)).toBe("Something went wrong");
  });

  it("should return message from an object with a message property", () => {
    const error = { message: "Custom error message" };
    expect(getErrorMessage(error)).toBe("Custom error message");
  });

  it("should return error if error is string type", () => {
    const error = "Error occure";
    expect(getErrorMessage(error)).toBe("Error occure");
  });
});
