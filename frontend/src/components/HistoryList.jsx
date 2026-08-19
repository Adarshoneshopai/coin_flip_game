import React from "react";
import { useLanguage } from "../context/LanguageContext.jsx";
import styles from "./HistoryList.module.css";

const timeFormatter = new Intl.DateTimeFormat(undefined, {
  hour: "2-digit",
  minute: "2-digit",
});

export default function HistoryList({ history }) {
  const { t } = useLanguage();

  if (!history.length) {
    return <p className={styles.empty}>{t("history", "empty")}</p>;
  }

  return (
    <ol className={styles.list} aria-label={t("history", "title")}>
      {history.map((entry, i) => {
        const choiceLabel =
          entry.choice === "heads" ? t("game", "heads") : t("game", "tails");
        const resultLabel =
          entry.result === "heads" ? t("game", "heads") : t("game", "tails");

        return (
          <li key={`${entry.createdAt}-${i}`} className={styles.row}>
            <span className={`${styles.badge} ${entry.win ? styles.win : styles.lose}`}>
              {entry.win ? t("history", "winBadge") : t("history", "lossBadge")}
            </span>
            <span className={styles.detail}>
              {t("history", "called")} <strong>{choiceLabel}</strong> ·{" "}
              {t("history", "landed")} <strong>{resultLabel}</strong>
            </span>
            <time className={styles.time} dateTime={entry.createdAt}>
              {timeFormatter.format(new Date(entry.createdAt))}
            </time>
          </li>
        );
      })}
    </ol>
  );
}
