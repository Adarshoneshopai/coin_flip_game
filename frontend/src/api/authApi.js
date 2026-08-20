const BASE_URL = import.meta.env.VITE_API_URL || "/api";

async function authRequest(path, options = {}) {
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

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const errorMsg = data.message || `Request failed with status ${res.status}`;
    const error = new Error(errorMsg);
    error.status = res.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const signupApi = (name, email, password) =>
  authRequest("/auth/signup", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });

export const loginApi = (email, password) =>
  authRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

export const getMeApi = () =>
  authRequest("/auth/me", {
    method: "GET",
  });

export const logoutApi = () =>
  authRequest("/auth/logout", {
    method: "POST",
  });

export const forgotPasswordApi = (email) =>
  authRequest("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });

export const resetPasswordApi = (token, password) =>
  authRequest(`/auth/reset-password/${encodeURIComponent(token)}`, {
    method: "POST",
    body: JSON.stringify({ password }),
  });

export const googleLoginApi = (credential) =>
  authRequest("/auth/google", {
    method: "POST",
    body: JSON.stringify({ credential }),
  });
