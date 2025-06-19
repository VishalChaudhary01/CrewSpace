import { Router } from "express";
import { signin, signup, signout } from "@/controllers/auth.controller";
import { authRequire } from "@/middlewares/auth-require.middleware";

const authRoutes = Router();

authRoutes.post("/signup", signup);
authRoutes.post("/signin", signin);
authRoutes.post("/signout", authRequire, signout);

export default authRoutes;
