import crypto from "crypto";
import Flip from "../models/Flip.js";

// Cryptographically-secure 50/50 outcome, not Math.random(), so results
// are fair and can't be nudged by a predictable PRNG.
const randomOutcome = () =>
  crypto.randomInt(0, 2) === 0 ? "heads" : "tails";

// POST /api/flips
export const createFlip = async (req, res, next) => {
  try {
    const { sessionId, choice } = req.body;

    if (!sessionId || !["heads", "tails"].includes(choice)) {
      return res.status(400).json({
        message: "A sessionId and a choice of 'heads' or 'tails' are required.",
      });
    }

    const result = randomOutcome();
    const win = result === choice;

    const flip = await Flip.create({ sessionId, choice, result, win });

    res.status(201).json({ flip });
  } catch (err) {
    next(err);
  }
};

// GET /api/flips/history/:sessionId?limit=20
export const getHistory = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const limit = Math.min(Number(req.query.limit) || 20, 100);

    const history = await Flip.find({ sessionId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .select("choice result win createdAt -_id");

    res.json({ history });
  } catch (err) {
    next(err);
  }
};

// GET /api/flips/stats/:sessionId
export const getStats = async (req, res, next) => {
  try {
    const { sessionId } = req.params;

    const [stats] = await Flip.aggregate([
      { $match: { sessionId } },
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
      bestStreak: await getBestStreak(sessionId),
    });
  } catch (err) {
    next(err);
  }
};

// Longest consecutive-win streak for a session
async function getBestStreak(sessionId) {
  const flips = await Flip.find({ sessionId })
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
