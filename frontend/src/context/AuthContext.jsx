import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  signupApi,
  loginApi,
  getMeApi,
  logoutApi,
  forgotPasswordApi,
  googleLoginApi,
} from "../api/authApi.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("coin_auth_token") || null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Modal Controls
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState("login"); // 'login' or 'signup'

  // Validate existing token on mount
  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      const storedToken = localStorage.getItem("coin_auth_token");
      if (!storedToken) {
        if (isMounted) {
          setIsLoading(false);
        }
        return;
      }

      try {
        const data = await getMeApi();
        if (isMounted && data.user) {
          setUser(data.user);
          setToken(storedToken);
        }
      } catch (err) {
        // Only clear the stored session on a genuine auth failure (401) —
        // a network blip or transient server error shouldn't log the user
        // out; the token stays in localStorage so the next successful
        // check on a later load can restore the session.
        if (err.status === 401) {
          console.warn("Session token expired or invalid:", err.message);
          localStorage.removeItem("coin_auth_token");
          if (isMounted) {
            setUser(null);
            setToken(null);
          }
        } else {
          console.warn("Could not verify session, will retry next load:", err.message);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  const openLoginModal = useCallback(() => {
    setAuthError(null);
    setAuthModalMode("login");
    setIsAuthModalOpen(true);
  }, []);

  const openSignupModal = useCallback(() => {
    setAuthError(null);
    setAuthModalMode("signup");
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
    setAuthError(null);
  }, []);

  const login = async (email, password) => {
    setAuthError(null);
    try {
      const data = await loginApi(email, password);
      localStorage.setItem("coin_auth_token", data.token);
      setToken(data.token);
      setUser(data.user);
      setIsAuthModalOpen(false);
      return data;
    } catch (err) {
      setAuthError(err.message || "Failed to log in. Please check your credentials.");
      throw err;
    }
  };

  const signup = async (name, email, password) => {
    setAuthError(null);
    try {
      const data = await signupApi(name, email, password);
      localStorage.setItem("coin_auth_token", data.token);
      setToken(data.token);
      setUser(data.user);
      setIsAuthModalOpen(false);
      return data;
    } catch (err) {
      setAuthError(err.message || "Failed to create account. Please try again.");
      throw err;
    }
  };

  const loginWithGoogle = async (credential) => {
    setAuthError(null);
    try {
      const data = await googleLoginApi(credential);
      localStorage.setItem("coin_auth_token", data.token);
      setToken(data.token);
      setUser(data.user);
      setIsAuthModalOpen(false);
      return data;
    } catch (err) {
      setAuthError(err.message || "Google sign-in failed. Please try again.");
      throw err;
    }
  };

  const forgotPassword = async (email) => {
    setAuthError(null);
    try {
      const data = await forgotPasswordApi(email);
      return data;
    } catch (err) {
      setAuthError(err.message || "Failed to send reset link. Please try again.");
      throw err;
    }
  };

  const logout = async () => {
    try {
      await logoutApi();
    } catch (err) {
      // Ignore network errors during logout
    } finally {
      localStorage.removeItem("coin_auth_token");
      setToken(null);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(user && token),
        isLoading,
        authError,
        setAuthError,
        isAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        openLoginModal,
        openSignupModal,
        closeAuthModal,
        login,
        signup,
        loginWithGoogle,
        forgotPassword,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
