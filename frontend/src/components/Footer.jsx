import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p>
        For entertainment only — no real money or prizes. Coin outcomes are generated with a
        cryptographically fair 50/50 random draw.
      </p>
      <p className={styles.small}>© {new Date().getFullYear()} Heads or Tails.</p>
    </footer>
  );
}
