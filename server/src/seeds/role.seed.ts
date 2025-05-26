import mongoose from "mongoose";
import { RoleModel } from "@/models/role.model";
import { RolePermissions } from "@/utils/role-premissions";

export const seedRoles = async () => {
  const existingRoles = await RoleModel.countDocuments();
  if (existingRoles > 0) {
    console.log("🛑 Roles already exist, skipping seeding.");
    return;
  }

  const session = await mongoose.startSession();
  try {
    console.log("🌱 Seeding roles....");
    session.startTransaction();

    for (const roleName in RolePermissions) {
      const role = roleName as keyof typeof RolePermissions;
      const permission = RolePermissions[role];

      const newRole = new RoleModel({
        name: role,
        permissions: permission,
      });
      await newRole.save({ session });
      console.log(`✅ Role ${role} added with permissions.`);
    }

    await session.commitTransaction();
    console.log("🎉 Role Seeding completed!");
  } catch (error) {
    await session.abortTransaction();
    console.error("❌ Error during Role seed:", error);
  } finally {
    session.endSession();
  }
};
