import { Router } from "express";
import {
  createFlip,
  getUserHistory,
  getUserStats,
  getHistory,
  getStats,
} from "../controllers/flipController.js";
import { protect, optionalAuth } from "../middleware/auth.js";

const router = Router();

// Flip action: optionalAuth attaches req.user if logged in
router.post("/", optionalAuth, createFlip);

// User-specific history and stats (Authenticated)
router.get("/user/history", protect, getUserHistory);
router.get("/user/stats", protect, getUserStats);

// Legacy session routes
router.get("/history/:sessionId", getHistory);
router.get("/stats/:sessionId", getStats);

export default router;
