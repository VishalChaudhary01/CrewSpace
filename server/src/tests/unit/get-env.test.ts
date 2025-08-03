import { getEnv } from "@/utils/get-env";

describe("getEnv", () => {
  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV };
  });

  afterEach(() => {
    process.env = ORIGINAL_ENV;
  });

  it("should return the environment variable when it is set", () => {
    process.env.TEST_KEY = "test_value";
    expect(getEnv("TEST_KEY")).toBe("test_value");
  });

  it("should return the default value when the environment variable is not set", () => {
    expect(getEnv("MISSING_KEY", "default_value")).toBe("default_value");
  });

  it("should throw an error when the environment variable is not set and no default is provided", () => {
    expect(() => getEnv("MISSING_KEY")).toThrow(
      "Environment variable MISSING_KEY is not set",
    );
  });
});
