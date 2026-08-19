import styles from "./ScoreBoard.module.css";

const CELLS = [
  { key: "totalFlips", label: "Flips" },
  { key: "wins", label: "Wins" },
  { key: "losses", label: "Losses" },
  { key: "winRate", label: "Win rate", suffix: "%" },
  { key: "bestStreak", label: "Best streak" },
];

export default function ScoreBoard({ stats }) {
  return (
    <section className={styles.board} aria-label="Score summary">
      {CELLS.map(({ key, label, suffix }) => (
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
