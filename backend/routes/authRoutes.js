import { Router } from "express";
import {
  signup,
  login,
  getMe,
  logout,
  forgotPassword,
  resetPassword,
  googleLogin,
} from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", protect, getMe);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/google", googleLogin);

export default router;
