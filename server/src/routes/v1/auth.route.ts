import { Router } from "express";
import {
  resetPasswordRequest,
  resetPassword,
  signin,
  signup,
  verifyVerificationCode,
  signout,
  resendVerificationCode,
} from "@/controllers/auth.controller";
import { authRequire } from "@/middlewares/auth-require.middleware";

const authRoutes = Router();

authRoutes.post("/signup", signup);
authRoutes.post("/signin", signin);
authRoutes.post("/resend-verification-code", resendVerificationCode);
authRoutes.post("/verify-verification-code", verifyVerificationCode);
authRoutes.post("/reset-password-request", resetPasswordRequest);
authRoutes.post("/reset-password/:token", resetPassword);

authRoutes.post("/signout", authRequire, signout);

export default authRoutes;
