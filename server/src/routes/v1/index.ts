import { Router } from "express";
import authRoutes from "./auth.route";
import userRoutes from "./user.route";
import { authLimiter } from "@/utils/limiter";
import workspaceRoutes from "./workspace.route";
import { authRequire } from "@/middlewares/auth-require.middleware";
import projectRoutes from "./project.workspace";
import taskRoutes from "./task.routes";

const v1Routes = Router();

v1Routes.use("/auth", authLimiter, authRoutes);
v1Routes.use("/user", userRoutes);
v1Routes.use("/workspace", authRequire, workspaceRoutes);
v1Routes.use("/project", authRequire, projectRoutes);
v1Routes.use("/task", authRequire, taskRoutes);

export default v1Routes;
