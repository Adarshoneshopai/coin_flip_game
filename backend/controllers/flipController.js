import crypto from "crypto";
import Flip from "../models/Flip.js";

// Cryptographically-secure 50/50 outcome
const randomOutcome = () =>
  crypto.randomInt(0, 2) === 0 ? "heads" : "tails";

// POST /api/flips (Supports optional auth to associate flip with logged-in user)
export const createFlip = async (req, res, next) => {
  try {
    const { sessionId, choice } = req.body;

    if (!["heads", "tails"].includes(choice)) {
      return res.status(400).json({
        message: "A choice of 'heads' or 'tails' is required.",
      });
    }

    const result = randomOutcome();
    const win = result === choice;
    const userId = req.user?._id || null;

    const flip = await Flip.create({
      userId,
      sessionId: sessionId || "anonymous",
      choice,
      result,
      win,
    });

    res.status(201).json({ flip });
  } catch (err) {
    next(err);
  }
};

// GET /api/flips/user/history (Protected: Fetch history ONLY for logged-in user)
export const getUserHistory = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const limit = Math.min(Number(req.query.limit) || 20, 100);

    const history = await Flip.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .select("choice result win createdAt -_id");

    res.json({ history });
  } catch (err) {
    next(err);
  }
};

// GET /api/flips/user/stats (Protected: Fetch stats ONLY for logged-in user)
export const getUserStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const [stats] = await Flip.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: null,
          totalFlips: { $sum: 1 },
          wins: { $sum: { $cond: ["$win", 1, 0] } },
          heads: { $sum: { $cond: [{ $eq: ["$result", "heads"] }, 1, 0] } },
          tails: { $sum: { $cond: [{ $eq: ["$result", "tails"] }, 1, 0] } },
        },
      },
    ]);

    const totalFlips = stats?.totalFlips || 0;
    const wins = stats?.wins || 0;

    res.json({
      totalFlips,
      wins,
      losses: totalFlips - wins,
      heads: stats?.heads || 0,
      tails: stats?.tails || 0,
      winRate: totalFlips ? Number(((wins / totalFlips) * 100).toFixed(1)) : 0,
      bestStreak: await getUserBestStreak(userId),
    });
  } catch (err) {
    next(err);
  }
};

// Helper: Calculate longest winning streak for a specific user
async function getUserBestStreak(userId) {
  const flips = await Flip.find({ userId })
    .sort({ createdAt: 1 })
    .select("win -_id");

  let best = 0;
  let current = 0;
  for (const { win } of flips) {
    current = win ? current + 1 : 0;
    if (current > best) best = current;
  }
  return best;
}

// GET /api/flips/history/:sessionId (Legacy/Fallback)
export const getHistory = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const limit = Math.min(Number(req.query.limit) || 20, 100);

    const history = await Flip.find({ sessionId, userId: null })
      .sort({ createdAt: -1 })
      .limit(limit)
      .select("choice result win createdAt -_id");

    res.json({ history });
  } catch (err) {
    next(err);
  }
};

// GET /api/flips/stats/:sessionId (Legacy/Fallback)
export const getStats = async (req, res, next) => {
  try {
    const { sessionId } = req.params;

    const [stats] = await Flip.aggregate([
      { $match: { sessionId, userId: null } },
      {
        $group: {
          _id: null,
          totalFlips: { $sum: 1 },
          wins: { $sum: { $cond: ["$win", 1, 0] } },
          heads: { $sum: { $cond: [{ $eq: ["$result", "heads"] }, 1, 0] } },
          tails: { $sum: { $cond: [{ $eq: ["$result", "tails"] }, 1, 0] } },
        },
      },
    ]);

    const totalFlips = stats?.totalFlips || 0;
    const wins = stats?.wins || 0;

    res.json({
      totalFlips,
      wins,
      losses: totalFlips - wins,
      heads: stats?.heads || 0,
      tails: stats?.tails || 0,
      winRate: totalFlips ? Number(((wins / totalFlips) * 100).toFixed(1)) : 0,
      bestStreak: 0,
    });
  } catch (err) {
    next(err);
  }
};
