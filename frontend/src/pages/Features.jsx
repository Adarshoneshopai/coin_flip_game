import React from "react";
import { Helmet } from "react-helmet-async";
import { useLanguage } from "../context/LanguageContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import styles from "./Features.module.css";

export default function Features({ onBackToGame }) {
  const { t } = useLanguage();
  const { isAuthenticated, openSignupModal } = useAuth();

  const features = [
    { icon: t("features", "f1Icon"), title: t("features", "f1Title"), text: t("features", "f1Text") },
    { icon: t("features", "f2Icon"), title: t("features", "f2Title"), text: t("features", "f2Text") },
    { icon: t("features", "f3Icon"), title: t("features", "f3Title"), text: t("features", "f3Text") },
    { icon: t("features", "f4Icon"), title: t("features", "f4Title"), text: t("features", "f4Text") },
    { icon: t("features", "f5Icon"), title: t("features", "f5Title"), text: t("features", "f5Text") },
    { icon: t("features", "f6Icon"), title: t("features", "f6Title"), text: t("features", "f6Text") },
    { icon: t("features", "f7Icon"), title: t("features", "f7Title"), text: t("features", "f7Text") },
    { icon: t("features", "f8Icon"), title: t("features", "f8Title"), text: t("features", "f8Text") },
  ];

  const handleCta = () => {
    if (isAuthenticated) {
      onBackToGame?.();
    } else {
      openSignupModal();
    }
  };

  return (
    <>
      <Helmet>
        <title>Features — Heads or Tails Online</title>
        <meta
          name="description"
          content="Explore every feature of the Heads or Tails coin flip game: 3D coin flip animation, secure authentication, flip history, live score tracking, sound effects, and MongoDB Atlas cloud storage."
        />
      </Helmet>

      <main className={styles.featuresContainer}>
        <header className={styles.featuresHeader}>
          <button
            type="button"
            className={styles.backBtn}
            onClick={onBackToGame}
            id="features-back-button"
          >
            ← {t("features", "backToGame")}
          </button>
          <h1 className={styles.mainTitle}>{t("features", "title")}</h1>
          <p className={styles.subTitle}>{t("features", "subtitle")}</p>
        </header>

        <section className={styles.grid} aria-label="Game features">
          {features.map((f, i) => (
            <article key={i} className={styles.card}>
              <div className={styles.cardIcon} aria-hidden="true">
                {f.icon}
              </div>
              <h2 className={styles.cardTitle}>{f.title}</h2>
              <p className={styles.cardText}>{f.text}</p>
            </article>
          ))}
        </section>

        <section className={styles.ctaBand} aria-labelledby="features-cta-heading">
          <div className={styles.ctaInner}>
            <h2 id="features-cta-heading" className={styles.ctaTitle}>
              🪙 {t("game", "statusPrompt")}
            </h2>
            <button
              type="button"
              className={styles.ctaBtn}
              onClick={handleCta}
              id="features-cta-button"
            >
              {isAuthenticated ? t("features", "ctaPlay") : t("features", "ctaSignup")}
            </button>
          </div>
        </section>
      </main>
    </>
  );
}
