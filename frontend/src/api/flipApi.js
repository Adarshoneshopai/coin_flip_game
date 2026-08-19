const BASE_URL = import.meta.env.VITE_API_URL || "/api";

async function request(path, options = {}) {
  const token = localStorage.getItem("coin_auth_token");
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
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

export const fetchUserHistory = (limit = 20) =>
  request(`/flips/user/history?limit=${limit}`);

export const fetchUserStats = () => request("/flips/user/stats");

export const fetchHistory = (sessionId, limit = 20) =>
  request(`/flips/history/${sessionId}?limit=${limit}`);

export const fetchStats = (sessionId) => request(`/flips/stats/${sessionId}`);
