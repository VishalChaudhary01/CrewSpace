import { Permissions, Roles } from "@/enums/role.enum";
import { UnauthorizedError } from "@/errors/unauthorize.error";
import { roleGuard } from "@/utils/roleGuard";

describe("roleGuard", () => {
  it("should allow if all required permissions are present", () => {
    expect(() => {
      roleGuard(Roles.OWNER, [
        Permissions.CREATE_WORKSPACE,
        Permissions.DELETE_PROJECT,
      ]);
    }).not.toThrow();
  });

  it("should throw UnauthorizedError if any required permission is missing", () => {
    expect(() => {
      roleGuard(Roles.ADMIN, [Permissions.DELETE_WORKSPACE]);
    }).toThrow(UnauthorizedError);
  });

  it("should not throw if no permissions are required", () => {
    expect(() => {
      roleGuard(Roles.MEMBER, []);
    }).not.toThrow();
  });
});
