import { COINS } from "../data/coins.js";
import styles from "./CountrySelector.module.css";

export default function CountrySelector({ coinId, onChange, disabled }) {
  return (
    <div className={styles.row} role="radiogroup" aria-label="Choose a coin">
      {COINS.map((coin) => (
        <button
          key={coin.id}
          type="button"
          role="radio"
          aria-checked={coinId === coin.id}
          className={`${styles.chip} ${coinId === coin.id ? styles.active : ""}`}
          onClick={() => onChange(coin.id)}
          disabled={disabled}
          title={coin.name}
        >
          <span className={styles.flag} aria-hidden="true">
            {coin.flag}
          </span>
          <span className={styles.name}>{coin.name}</span>
        </button>
      ))}
    </div>
  );
}
