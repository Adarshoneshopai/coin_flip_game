import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";
import GoogleSignInButton from "./GoogleSignInButton.jsx";
import styles from "./AuthModal.module.css";

export default function AuthModal() {
  const {
    isAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    closeAuthModal,
    login,
    signup,
    forgotPassword,
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
  const [forgotSubmitted, setForgotSubmitted] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const emailInputRef = useRef(null);

  useEffect(() => {
    if (isAuthModalOpen) {
      setLocalError("");
      setName("");
      setEmail("");
      setPassword("");
      setShowPassword(false);
      setForgotSubmitted(false);
      setAgreedToTerms(false);
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
  const isForgot = authModalMode === "forgot";
  const errorMessage = localError || authError;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");
    setAuthError(null);

    // Basic frontend validation
    if (!isForgot && !isLogin && !name.trim()) {
      setLocalError("Please enter your name.");
      return;
    }

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setLocalError("Please enter a valid email address.");
      return;
    }

    if (!isForgot && (!password || password.length < 6)) {
      setLocalError("Password must be at least 6 characters long.");
      return;
    }

    if (!isForgot && !agreedToTerms) {
      setLocalError(t("auth", "agreeRequired"));
      return;
    }

    setIsSubmitting(true);
    try {
      if (isForgot) {
        await forgotPassword(email.trim());
        setForgotSubmitted(true);
      } else if (isLogin) {
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
            {isForgot
              ? t("auth", "forgotTitle")
              : isLogin
              ? t("auth", "loginTitle")
              : t("auth", "signupTitle")}
          </h2>
          <p className={styles.modalSubtitle}>
            {isForgot
              ? t("auth", "forgotSubtitle")
              : isLogin
              ? t("auth", "loginSubtitle")
              : t("auth", "signupSubtitle")}
          </p>
        </div>

        {!isForgot && (
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
        )}

        {errorMessage && (
          <div className={styles.errorAlert} role="alert">
            <span aria-hidden="true">⚠️</span>
            <span>{errorMessage}</span>
          </div>
        )}

        {isForgot && forgotSubmitted ? (
          <div className={styles.successAlert} role="status">
            <span aria-hidden="true">✅</span>
            <span>{t("auth", "forgotSuccess")}</span>
          </div>
        ) : (
          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            {!isForgot && !isLogin && (
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

            {!isForgot && (
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
            )}

            {isLogin && !isForgot && (
              <button
                type="button"
                className={styles.forgotLink}
                onClick={() => {
                  setLocalError("");
                  setAuthError(null);
                  setAuthModalMode("forgot");
                }}
                id="auth-forgot-password-link"
              >
                {t("auth", "forgotLink")}
              </button>
            )}

            {!isForgot && (
              <label className={styles.agreeRow} htmlFor="auth-agree-terms">
                <input
                  id="auth-agree-terms"
                  type="checkbox"
                  className={styles.agreeCheckbox}
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  disabled={isSubmitting}
                  required
                />
                <span className={styles.agreeText}>
                  {t("auth", "agreePrefix")}{" "}
                  <a
                    href="?legal=terms"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.agreeLink}
                    id="auth-terms-link"
                  >
                    {t("footer", "terms")}
                  </a>{" "}
                  {t("auth", "agreeAnd")}{" "}
                  <a
                    href="?legal=privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.agreeLink}
                    id="auth-privacy-link"
                  >
                    {t("footer", "privacy")}
                  </a>
                  .
                </span>
              </label>
            )}

            <button
              type="submit"
              className={styles.submitBtn}
              disabled={isSubmitting || (!isForgot && !agreedToTerms)}
              id="auth-submit-button"
            >
              {isSubmitting ? (
                <>
                  <span className={styles.spinner} aria-hidden="true" />
                  <span>
                    {isForgot
                      ? t("auth", "sendingReset")
                      : isLogin
                      ? t("auth", "loggingIn")
                      : t("auth", "signingUp")}
                  </span>
                </>
              ) : isForgot ? (
                t("auth", "forgotSubmit")
              ) : isLogin ? (
                t("auth", "loginSubmit")
              ) : (
                t("auth", "signupSubmit")
              )}
            </button>
          </form>
        )}

        {!isForgot && <GoogleSignInButton />}

        <div className={styles.footerSwitch}>
          {isForgot ? (
            <button
              type="button"
              className={styles.switchLink}
              onClick={() => {
                setLocalError("");
                setAuthError(null);
                setForgotSubmitted(false);
                setAuthModalMode("login");
              }}
            >
              {t("auth", "backToLogin")}
            </button>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}
