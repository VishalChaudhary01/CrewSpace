import { getCurrentUser } from "@/controllers/user.controller";
import { authRequire } from "@/middlewares/auth-require.middleware";
import { Router } from "express";

const userRoutes = Router();

userRoutes.get("/profile", authRequire, getCurrentUser);

export default userRoutes;
