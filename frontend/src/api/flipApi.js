const BASE_URL = import.meta.env.VITE_API_URL || "/api";

async function request(path, options) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `Request failed: ${res.status}`);
  }
  return res.json();
}

export const postFlip = (sessionId, choice) =>
  request("/flips", {
    method: "POST",
    body: JSON.stringify({ sessionId, choice }),
  });

export const fetchHistory = (sessionId, limit = 20) =>
  request(`/flips/history/${sessionId}?limit=${limit}`);

export const fetchStats = (sessionId) => request(`/flips/stats/${sessionId}`);
