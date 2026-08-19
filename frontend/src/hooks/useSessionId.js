import { useState } from "react";

const STORAGE_KEY = "coinflip_session_id";

function makeId() {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `sess_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

// No login required — a stable per-browser id lets us track score/history
// server-side without asking the player to sign up.
export function useSessionId() {
  const [sessionId] = useState(() => {
    const existing = localStorage.getItem(STORAGE_KEY);
    if (existing) return existing;
    const id = makeId();
    localStorage.setItem(STORAGE_KEY, id);
    return id;
  });
  return sessionId;
}
