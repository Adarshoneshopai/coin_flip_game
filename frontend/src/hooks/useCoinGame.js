import { useCallback, useEffect, useState } from "react";
import { postFlip, fetchUserHistory, fetchUserStats } from "../api/flipApi.js";
import { useSessionId } from "./useSessionId.js";
import { useAuth } from "../context/AuthContext.jsx";
import { DEFAULT_COIN_ID } from "../data/coins.js";
import { playCoinFlipSound, playCoinLandSound } from "../utils/soundEffects.js";

const COIN_ID_KEY = "coinflip_coin_id";
const MUTED_KEY = "coinflip_muted";
const FLIP_ANIMATION_MS = 1800;

const DEFAULT_STATS = {
  totalFlips: 0,
  wins: 0,
  losses: 0,
  heads: 0,
  tails: 0,
  winRate: 0,
  bestStreak: 0,
};

export function useCoinGame() {
  const sessionId = useSessionId();
  const { user, isAuthenticated } = useAuth();

  const [choice, setChoice] = useState("heads");
  const [coinId, setCoinIdState] = useState(
    () => localStorage.getItem(COIN_ID_KEY) || DEFAULT_COIN_ID
  );
  const [isMuted, setIsMuted] = useState(
    () => localStorage.getItem(MUTED_KEY) === "true"
  );
  const [isFlipping, setIsFlipping] = useState(false);
  const [result, setResult] = useState(null); // "heads" | "tails" | null — revealed after the spin
  const [pendingResult, setPendingResult] = useState(null); // known immediately, drives the coin's target rotation
  const [lastWin, setLastWin] = useState(null);

  // History & Stats: ONLY populated for authenticated users
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState(DEFAULT_STATS);
  const [offline, setOffline] = useState(false);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      localStorage.setItem(MUTED_KEY, String(next));
      return next;
    });
  }, []);

  const setCoinId = useCallback((id) => {
    localStorage.setItem(COIN_ID_KEY, id);
    setCoinIdState(id);
  }, []);

  // Fetch flip history & stats from MongoDB Atlas ONLY when user is authenticated
  useEffect(() => {
    if (!isAuthenticated || !user) {
      setHistory([]);
      setStats(DEFAULT_STATS);
      return;
    }

    let isMounted = true;

    const loadUserFlipData = async () => {
      try {
        const [{ history: userHistory }, userStats] = await Promise.all([
          fetchUserHistory(20),
          fetchUserStats(),
        ]);
        if (isMounted) {
          setHistory(userHistory || []);
          setStats(userStats || DEFAULT_STATS);
        }
      } catch (err) {
        console.warn("Failed to load user flips:", err.message);
        if (isMounted) {
          setHistory([]);
          setStats(DEFAULT_STATS);
        }
      }
    };

    loadUserFlipData();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, user]);

  const flip = useCallback(async () => {
    if (isFlipping) return;
    setIsFlipping(true);
    setResult(null);

    // Play initial coin flip sound immediately on user interaction
    playCoinFlipSound(isMuted);

    let outcome;
    try {
      const { flip: serverFlip } = await postFlip(sessionId, choice);
      outcome = serverFlip;
      setOffline(false);
    } catch {
      // Backend unreachable — keep the game playable with a local RNG.
      setOffline(true);
      const localResult = Math.random() < 0.5 ? "heads" : "tails";
      outcome = {
        choice,
        result: localResult,
        win: localResult === choice,
        createdAt: new Date().toISOString(),
      };
    }

    // The outcome is known now, so the coin can start spinning toward it
    setPendingResult(outcome.result);

    setTimeout(() => {
      // Play coin landing impact clink / result sound
      playCoinLandSound(outcome.win, isMuted);

      setResult(outcome.result);
      setLastWin(outcome.win);
      setIsFlipping(false);

      if (isAuthenticated) {
        setHistory((prev) => [outcome, ...prev].slice(0, 20));
        fetchUserStats()
          .then(setStats)
          .catch(() => {});
      }
    }, FLIP_ANIMATION_MS);
  }, [choice, isAuthenticated, isFlipping, isMuted, sessionId]);

  return {
    choice,
    setChoice,
    coinId,
    setCoinId,
    isMuted,
    toggleMute,
    isFlipping,
    result,
    pendingResult,
    lastWin,
    history,
    stats,
    flip,
    offline,
    animationMs: FLIP_ANIMATION_MS,
    isAuthenticated,
  };
}
