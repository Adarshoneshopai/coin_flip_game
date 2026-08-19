import React from "react";
import { useLanguage } from "../context/LanguageContext.jsx";
import styles from "./ChoiceSelector.module.css";

export default function ChoiceSelector({ choice, onChange, disabled }) {
  const { t } = useLanguage();

  return (
    <div
      className={styles.group}
      role="radiogroup"
      aria-label={`${t("game", "heads")} or ${t("game", "tails")}`}
    >
      {["heads", "tails"].map((option) => (
        <button
          key={option}
          type="button"
          role="radio"
          aria-checked={choice === option}
          className={`${styles.option} ${choice === option ? styles.active : ""}`}
          onClick={() => onChange(option)}
          disabled={disabled}
        >
          {option === "heads" ? t("game", "heads") : t("game", "tails")}
        </button>
      ))}
    </div>
  );
}
