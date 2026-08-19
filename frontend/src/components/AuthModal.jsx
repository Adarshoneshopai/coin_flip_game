import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";
import styles from "./AuthModal.module.css";

export default function AuthModal() {
  const {
    isAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    closeAuthModal,
    login,
    signup,
    authError,
    setAuthError,
  } = useAuth();

  const { t } = useLanguage();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState("");

  const emailInputRef = useRef(null);

  useEffect(() => {
    if (isAuthModalOpen) {
      setLocalError("");
      setName("");
      setEmail("");
      setPassword("");
      setShowPassword(false);
      // Focus first relevant input
      setTimeout(() => {
        if (emailInputRef.current) emailInputRef.current.focus();
      }, 100);
    }
  }, [isAuthModalOpen, authModalMode]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isAuthModalOpen) {
        closeAuthModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isAuthModalOpen, closeAuthModal]);

  if (!isAuthModalOpen) return null;

  const isLogin = authModalMode === "login";
  const errorMessage = localError || authError;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");
    setAuthError(null);

    // Basic frontend validation
    if (!isLogin && !name.trim()) {
      setLocalError("Please enter your name.");
      return;
    }

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setLocalError("Please enter a valid email address.");
      return;
    }

    if (!password || password.length < 6) {
      setLocalError("Password must be at least 6 characters long.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (isLogin) {
        await login(email.trim(), password);
      } else {
        await signup(name.trim(), email.trim(), password);
      }
    } catch (err) {
      // Error handled by AuthContext state
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      closeAuthModal();
    }
  };

  return (
    <div
      className={styles.backdrop}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div className={styles.modal}>
        <button
          type="button"
          className={styles.closeButton}
          onClick={closeAuthModal}
          aria-label="Close authentication modal"
        >
          ✕
        </button>

        <div className={styles.modalHeader}>
          <div className={styles.coinBadge} aria-hidden="true">
            H
          </div>
          <h2 id="auth-modal-title" className={styles.modalTitle}>
            {isLogin ? t("auth", "loginTitle") : t("auth", "signupTitle")}
          </h2>
          <p className={styles.modalSubtitle}>
            {isLogin ? t("auth", "loginSubtitle") : t("auth", "signupSubtitle")}
          </p>
        </div>

        <div className={styles.tabs} role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={isLogin}
            className={`${styles.tab} ${isLogin ? styles.tabActive : ""}`}
            onClick={() => {
              setLocalError("");
              setAuthError(null);
              setAuthModalMode("login");
            }}
          >
            {t("nav", "login")}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={!isLogin}
            className={`${styles.tab} ${!isLogin ? styles.tabActive : ""}`}
            onClick={() => {
              setLocalError("");
              setAuthError(null);
              setAuthModalMode("signup");
            }}
          >
            {t("nav", "signup")}
          </button>
        </div>

        {errorMessage && (
          <div className={styles.errorAlert} role="alert">
            <span aria-hidden="true">⚠️</span>
            <span>{errorMessage}</span>
          </div>
        )}

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          {!isLogin && (
            <div className={styles.formGroup}>
              <label htmlFor="auth-name" className={styles.label}>
                {t("auth", "nameLabel")}
              </label>
              <input
                id="auth-name"
                type="text"
                className={styles.input}
                placeholder={t("auth", "namePlaceholder")}
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                required
                disabled={isSubmitting}
              />
            </div>
          )}

          <div className={styles.formGroup}>
            <label htmlFor="auth-email" className={styles.label}>
              {t("auth", "emailLabel")}
            </label>
            <input
              ref={emailInputRef}
              id="auth-email"
              type="email"
              className={styles.input}
              placeholder={t("auth", "emailPlaceholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="auth-password" className={styles.label}>
              {t("auth", "passwordLabel")}
            </label>
            <div className={styles.inputWrapper}>
              <input
                id="auth-password"
                type={showPassword ? "text" : "password"}
                className={`${styles.input} ${styles.passwordInput}`}
                placeholder={t("auth", "passwordPlaceholder")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={isLogin ? "current-password" : "new-password"}
                required
                disabled={isSubmitting}
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                tabIndex={-1}
              >
                {showPassword ? "👁️" : "🔒"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={isSubmitting}
            id="auth-submit-button"
          >
            {isSubmitting ? (
              <>
                <span className={styles.spinner} aria-hidden="true" />
                <span>
                  {isLogin ? t("auth", "loggingIn") : t("auth", "signingUp")}
                </span>
              </>
            ) : isLogin ? (
              t("auth", "loginSubmit")
            ) : (
              t("auth", "signupSubmit")
            )}
          </button>
        </form>

        <div className={styles.footerSwitch}>
          <span>{isLogin ? t("auth", "noAccount") : t("auth", "hasAccount")}</span>
          <button
            type="button"
            className={styles.switchLink}
            onClick={() => {
              setLocalError("");
              setAuthError(null);
              setAuthModalMode(isLogin ? "signup" : "login");
            }}
          >
            {isLogin ? t("auth", "switchSignup") : t("auth", "switchLogin")}
          </button>
        </div>
      </div>
    </div>
  );
}
