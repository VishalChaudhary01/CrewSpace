import mongoose from "mongoose";
import { RoleModel } from "@/models/role.model";
import { RolePermissions } from "@/utils/role-premissions";
import { logError, logger } from "@/utils/logger";

export const seedRoles = async () => {
  const existingRoles = await RoleModel.countDocuments();
  if (existingRoles > 0) {
    logger.info("Roles already exist, skipping seeding.");
    return;
  }

  const session = await mongoose.startSession();
  try {
    logger.info("Seeding roles....");
    session.startTransaction();

    for (const roleName in RolePermissions) {
      const role = roleName as keyof typeof RolePermissions;
      const permission = RolePermissions[role];

      const newRole = new RoleModel({
        name: role,
        permissions: permission,
      });
      await newRole.save({ session });
      logger.info(`Role ${role} added with permissions.`);
    }

    await session.commitTransaction();
    logger.info("🎉 Role Seeding completed!");
  } catch (error) {
    await session.abortTransaction();
    logError("Error during Role seed", error);
  } finally {
    session.endSession();
  }
};
