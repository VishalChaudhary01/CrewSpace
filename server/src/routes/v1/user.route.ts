import { Router } from "express";

import { getCurrentUser } from "@/controllers/user.controller";
import { authRequire } from "@/middlewares/auth-require.middleware";

const userRoutes = Router();

userRoutes.get("/profile", authRequire, getCurrentUser);

export default userRoutes;
