import { Router } from "express";
import authRoutes from "./auth.route";
import userRoutes from "./user.route";
import { authLimiter } from "@/utils/limiter";

const v1Routes = Router();

v1Routes.use("/auth", authLimiter, authRoutes);
v1Routes.use("/user", userRoutes);

export default v1Routes;
