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

const authRoutes = Router();

authRoutes.post("/signup", signup);
authRoutes.post("/signin", signin);
authRoutes.post("/resend-verification-code", resendVerificationCode);
authRoutes.post("/verify-verification-code", verifyVerificationCode);
authRoutes.post("/reset-password-request", resetPasswordRequest);
authRoutes.post("/reset-password/:token", resetPassword);

// Todo: need to add auth-require middleware
authRoutes.post("/signout", signout);

export default authRoutes;
