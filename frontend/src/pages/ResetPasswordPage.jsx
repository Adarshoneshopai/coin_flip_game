import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { resetPasswordApi } from "../api/authApi.js";
import { useLanguage } from "../context/LanguageContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import styles from "./ResetPasswordPage.module.css";

export default function ResetPasswordPage({ token, onBackToGame }) {
  const { t } = useLanguage();
  const { openLoginModal } = useAuth();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!password || password.length < 6) {
      setError(t("resetPassword", "weakPasswordError"));
      return;
    }

    if (password !== confirmPassword) {
      setError(t("resetPassword", "mismatchError"));
      return;
    }

    setIsSubmitting(true);
    try {
      await resetPasswordApi(token, password);
      setSuccess(true);
    } catch (err) {
      setError(err.message || t("resetPassword", "genericError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Reset Password — Heads or Tails</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <main className={styles.container}>
        <div className={styles.card}>
          <div className={styles.coinBadge} aria-hidden="true">
            H
          </div>

          {success ? (
            <>
              <h1 className={styles.title}>{t("resetPassword", "successTitle")}</h1>
              <p className={styles.subtitle}>{t("resetPassword", "successText")}</p>
              <button
                type="button"
                className={styles.submitBtn}
                onClick={() => {
                  onBackToGame();
                  openLoginModal();
                }}
                id="reset-success-login-button"
              >
                {t("resetPassword", "loginBtn")}
              </button>
            </>
          ) : (
            <>
              <h1 className={styles.title}>{t("resetPassword", "title")}</h1>
              <p className={styles.subtitle}>{t("resetPassword", "subtitle")}</p>

              {error && (
                <div className={styles.errorAlert} role="alert">
                  <span aria-hidden="true">⚠️</span>
                  <span>{error}</span>
                </div>
              )}

              <form className={styles.form} onSubmit={handleSubmit} noValidate>
                <div className={styles.formGroup}>
                  <label htmlFor="reset-new-password" className={styles.label}>
                    {t("resetPassword", "newPasswordLabel")}
                  </label>
                  <input
                    id="reset-new-password"
                    type="password"
                    className={styles.input}
                    placeholder={t("auth", "passwordPlaceholder")}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="reset-confirm-password" className={styles.label}>
                    {t("resetPassword", "confirmPasswordLabel")}
                  </label>
                  <input
                    id="reset-confirm-password"
                    type="password"
                    className={styles.input}
                    placeholder={t("auth", "passwordPlaceholder")}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <button
                  type="submit"
                  className={styles.submitBtn}
                  disabled={isSubmitting}
                  id="reset-password-submit-button"
                >
                  {isSubmitting ? t("resetPassword", "submitting") : t("resetPassword", "submitBtn")}
                </button>
              </form>
            </>
          )}

          <button type="button" className={styles.backLink} onClick={onBackToGame}>
            {t("resetPassword", "backToHome")}
          </button>
        </div>
      </main>
    </>
  );
}
