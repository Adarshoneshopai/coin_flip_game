import styles from "./Header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <span className={styles.coinMark} aria-hidden="true">
          H
        </span>
        <span className={styles.title}>Heads&nbsp;or&nbsp;Tails</span>
      </div>
      <p className={styles.tagline}>Call it in the air.</p>
    </header>
  );
}
