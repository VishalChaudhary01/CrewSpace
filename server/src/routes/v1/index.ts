import { Router } from "express";

import authRoutes from "./auth.route";
import memberRoutes from "./member.route";
import projectRoutes from "./project.workspace";
import taskRoutes from "./task.routes";
import userRoutes from "./user.route";
import workspaceRoutes from "./workspace.route";

import { authRequire } from "@/middlewares/auth-require.middleware";
import { authLimiter } from "@/utils/limiter";

const v1Routes = Router();

v1Routes.use("/auth", authLimiter, authRoutes);
v1Routes.use("/user", userRoutes);
v1Routes.use("/workspace", authRequire, workspaceRoutes);
v1Routes.use("/project", authRequire, projectRoutes);
v1Routes.use("/task", authRequire, taskRoutes);
v1Routes.use("/member", authRequire, memberRoutes);

export default v1Routes;
