import React from "react";
import { COINS } from "../data/coins.js";
import { useLanguage } from "../context/LanguageContext.jsx";
import styles from "./CountrySelector.module.css";

function PreviewFace({ coin, image, symbol, caption }) {
  return (
    <div className={styles.previewFace}>
      <div
        className={styles.previewDisc}
        style={{
          "--coin-light": coin.colors.light,
          "--coin-mid": coin.colors.mid,
          "--coin-dark": coin.colors.dark,
        }}
      >
        {image ? (
          <img src={image} alt="" className={styles.previewImage} />
        ) : (
          <span className={styles.previewSymbol}>{symbol}</span>
        )}
      </div>
      <span className={styles.previewCaption}>{caption}</span>
    </div>
  );
}

export default function CountrySelector({ coinId, onChange, disabled }) {
  const { t } = useLanguage();

  return (
    <div className={styles.row} role="radiogroup" aria-label="Choose a coin design">
      {COINS.map((coin) => {
        const coinName = t("coins", coin.id, coin.name);
        return (
          <div key={coin.id} className={styles.itemWrapper}>
            <button
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

            <div className={styles.preview} role="presentation">
              <div className={styles.previewInner}>
                <span className={styles.previewTitle}>{coinName}</span>
                <div className={styles.previewFacesRow}>
                  <PreviewFace
                    coin={coin}
                    image={coin.headsImage}
                    symbol={coin.headsSymbol}
                    caption={t("game", "heads")}
                  />
                  <PreviewFace
                    coin={coin}
                    image={coin.tailsImage}
                    symbol={coin.tailsSymbol}
                    caption={t("game", "tails")}
                  />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
