import React from "react";
import { COINS } from "../data/coins.js";
import { useLanguage } from "../context/LanguageContext.jsx";
import styles from "./CountrySelector.module.css";

export default function CountrySelector({ coinId, onChange, disabled }) {
  const { t } = useLanguage();

  return (
    <div className={styles.row} role="radiogroup" aria-label="Choose a coin design">
      {COINS.map((coin) => {
        const coinName = t("coins", coin.id, coin.name);
        return (
          <button
            key={coin.id}
            type="button"
            role="radio"
            aria-checked={coinId === coin.id}
            className={`${styles.chip} ${coinId === coin.id ? styles.active : ""}`}
            onClick={() => onChange(coin.id)}
            disabled={disabled}
            title={coinName}
          >
            <span className={styles.flag} aria-hidden="true">
              {coin.flag}
            </span>
            <span className={styles.name}>{coinName}</span>
          </button>
        );
      })}
    </div>
  );
}
