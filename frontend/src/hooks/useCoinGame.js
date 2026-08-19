import { useCallback, useEffect, useState } from "react";
import { postFlip, fetchHistory, fetchStats } from "../api/flipApi.js";
import { useSessionId } from "./useSessionId.js";
import { DEFAULT_COIN_ID } from "../data/coins.js";
import { playCoinFlipSound, playCoinLandSound } from "../utils/soundEffects.js";

const LOCAL_HISTORY_KEY = "coinflip_local_history";
const COIN_ID_KEY = "coinflip_coin_id";
const MUTED_KEY = "coinflip_muted";
const FLIP_ANIMATION_MS = 1800;

function loadLocalHistory() {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_HISTORY_KEY)) || [];
  } catch {
    return [];
  }
}

function computeLocalStats(history) {
  const totalFlips = history.length;
  const wins = history.filter((h) => h.win).length;
  const heads = history.filter((h) => h.result === "heads").length;
  const tails = totalFlips - heads;

  let best = 0;
  let current = 0;
  for (let i = history.length - 1; i >= 0; i--) {
    current = history[i].win ? current + 1 : 0;
    if (current > best) best = current;
  }

  return {
    totalFlips,
    wins,
    losses: totalFlips - wins,
    heads,
    tails,
    winRate: totalFlips ? Number(((wins / totalFlips) * 100).toFixed(1)) : 0,
    bestStreak: best,
  };
}

export function useCoinGame() {
  const sessionId = useSessionId();
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
  const [history, setHistory] = useState(loadLocalHistory);
  const [stats, setStats] = useState(computeLocalStats(loadLocalHistory()));
  const [offline, setOffline] = useState(false);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      localStorage.setItem(MUTED_KEY, String(next));
      return next;
    });
  }, []);

  const persistLocal = useCallback((nextHistory) => {
    localStorage.setItem(LOCAL_HISTORY_KEY, JSON.stringify(nextHistory));
    setHistory(nextHistory);
    setStats(computeLocalStats(nextHistory));
  }, []);

  const setCoinId = useCallback((id) => {
    localStorage.setItem(COIN_ID_KEY, id);
    setCoinIdState(id);
  }, []);

  // Try to hydrate from the server so history survives across devices
  // sharing the same session id; silently fall back to local data.
  useEffect(() => {
    (async () => {
      try {
        const [{ history: serverHistory }, serverStats] = await Promise.all([
          fetchHistory(sessionId, 20),
          fetchStats(sessionId),
        ]);
        if (serverHistory.length || serverStats.totalFlips) {
          setHistory(serverHistory);
          setStats(serverStats);
        }
      } catch {
        setOffline(true);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

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

    // The outcome is known now, so the coin can start spinning toward it —
    // but we hold off revealing the text/score until the animation finishes.
    setPendingResult(outcome.result);

    setTimeout(() => {
      // Play coin landing impact clink / result sound
      playCoinLandSound(outcome.win, isMuted);

      setResult(outcome.result);
      setLastWin(outcome.win);
      setIsFlipping(false);

      const nextHistory = [outcome, ...history].slice(0, 20);
      if (offline) {
        persistLocal(nextHistory);
      } else {
        setHistory(nextHistory);
        fetchStats(sessionId)
          .then(setStats)
          .catch(() => persistLocal(nextHistory));
      }
    }, FLIP_ANIMATION_MS);
  }, [choice, history, isFlipping, isMuted, offline, persistLocal, sessionId]);

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
  };
}
