import React from "react";
import { useLanguage } from "../context/LanguageContext.jsx";
import styles from "./ScoreBoard.module.css";

export default function ScoreBoard({ stats }) {
  const { t } = useLanguage();

  const cells = [
    { key: "totalFlips", label: t("scoreboard", "flips") },
    { key: "wins", label: t("scoreboard", "wins") },
    { key: "losses", label: t("scoreboard", "losses") },
    { key: "winRate", label: t("scoreboard", "winRate"), suffix: "%" },
    { key: "bestStreak", label: t("scoreboard", "bestStreak") },
  ];

  return (
    <section className={styles.board} aria-label={t("scoreboard", "flips")}>
      {cells.map(({ key, label, suffix }) => (
        <div className={styles.cell} key={key}>
          <span className={styles.value}>
            {stats[key] ?? 0}
            {suffix || ""}
          </span>
          <span className={styles.label}>{label}</span>
        </div>
      ))}
    </section>
  );
}
