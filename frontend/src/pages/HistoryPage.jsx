import React from "react";
import { Helmet } from "react-helmet-async";
import { useLanguage } from "../context/LanguageContext.jsx";
import styles from "./HistoryPage.module.css";

export default function HistoryPage({ onBackToGame }) {
  const { t } = useLanguage();

  const eras = [
    {
      id: 1,
      badge: t("coinHistory", "era1Badge"),
      title: t("coinHistory", "era1Title"),
      text: t("coinHistory", "era1P"),
    },
    {
      id: 2,
      badge: t("coinHistory", "era2Badge"),
      title: t("coinHistory", "era2Title"),
      text: t("coinHistory", "era2P"),
    },
    {
      id: 3,
      badge: t("coinHistory", "era3Badge"),
      title: t("coinHistory", "era3Title"),
      text: t("coinHistory", "era3P"),
    },
    {
      id: 4,
      badge: t("coinHistory", "era4Badge"),
      title: t("coinHistory", "era4Title"),
      text: t("coinHistory", "era4P"),
    },
    {
      id: 5,
      badge: t("coinHistory", "era5Badge"),
      title: t("coinHistory", "era5Title"),
      text: t("coinHistory", "era5P"),
    },
  ];

  return (
    <>
      <Helmet>
        <title>Coin Toss History — Heads or Tails Online</title>
        <meta
          name="description"
          content="Explore the 2,000-year history of the coin toss from Ancient Rome to the Wright Brothers and the NFL Super Bowl."
        />
      </Helmet>

      <main className={styles.historyContainer}>
        <header className={styles.historyHeader}>
          <button
            type="button"
            className={styles.backBtn}
            onClick={onBackToGame}
            id="history-back-button"
          >
            ← {t("coinHistory", "backToGame")}
          </button>
          <h1 className={styles.mainTitle}>{t("coinHistory", "title")}</h1>
          <p className={styles.subTitle}>{t("coinHistory", "subtitle")}</p>
        </header>

        <section className={styles.timeline} aria-label="Coin toss historical eras">
          {eras.map((era) => (
            <article key={era.id} className={styles.timelineCard}>
              <div className={styles.badgeRow}>
                <span className={styles.badge}>{era.badge}</span>
              </div>
              <h2 className={styles.cardTitle}>{era.title}</h2>
              <p className={styles.cardBody}>{era.text}</p>
            </article>
          ))}
        </section>
      </main>
    </>
  );
}
