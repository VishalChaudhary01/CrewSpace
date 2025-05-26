import { Router } from "express";
import authRoutes from "./auth.route";
import { authLimiter } from "@/utils/limiter";

const v1Routes = Router();

v1Routes.use("/auth", authLimiter, authRoutes);

export default v1Routes;
