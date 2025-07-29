import jwt from "jsonwebtoken";

import { signJwt, TPayload, verifyJwt } from "@/utils/jwt";

jest.mock("@/config/env.config", () => ({
  config: {
    JWT_SECRET: "my-secret",
    JWT_EXPIRES_IN: "1h",
  },
}));

describe("JWT utilities", () => {
  const payload: TPayload = { userId: "123" };

  describe("signJwt", () => {
    it("should call jwt.sign with correct args", () => {
      const signSpy = jest
        .spyOn(jwt, "sign")
        .mockReturnValue(
          "mocked.token" as unknown as ReturnType<typeof jwt.sign>,
        );

      const token = signJwt(payload);

      expect(signSpy).toHaveBeenCalledWith(
        payload,
        "my-secret",
        expect.objectContaining({ expiresIn: "1h" }),
      );
      expect(token).toBe("mocked.token");

      signSpy.mockRestore();
    });
  });

  describe("verifyJwt", () => {
    it("should return payload on valid token", () => {
      const verifySpy = jest
        .spyOn(jwt, "verify")
        .mockReturnValue(payload as unknown as ReturnType<typeof jwt.verify>);

      const result = verifyJwt<TPayload>("valid.token");

      expect(verifySpy).toHaveBeenCalledWith("valid.token", "my-secret");
      expect(result).toEqual({ payload });

      verifySpy.mockRestore();
    });

    it("should return error on invalid token", () => {
      const error = new Error("jwt malformed");
      const verifySpy = jest.spyOn(jwt, "verify").mockImplementation(() => {
        throw error;
      });

      const result = verifyJwt<TPayload>("invalid.token");

      expect(result).toEqual({ error: "jwt malformed" });

      verifySpy.mockRestore();
    });
  });
});
