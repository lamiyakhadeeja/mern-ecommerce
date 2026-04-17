import { Router } from "express";
import {
  register,
  verifySignup,
  resendSignupOtp,
  login,
  forgotPassword,
  resetPassword,
  getMe,
} from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.post("/register", register);
router.post("/verify-signup", verifySignup);
router.post("/resend-signup-otp", resendSignupOtp);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/me", protect, getMe);

export default router;
