import { Router } from "express";
import { createFlip, getHistory, getStats } from "../controllers/flipController.js";

const router = Router();

router.post("/", createFlip);
router.get("/history/:sessionId", getHistory);
router.get("/stats/:sessionId", getStats);

export default router;
