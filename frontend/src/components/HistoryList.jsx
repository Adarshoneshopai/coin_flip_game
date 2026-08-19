import styles from "./HistoryList.module.css";

const timeFormatter = new Intl.DateTimeFormat(undefined, {
  hour: "2-digit",
  minute: "2-digit",
});

export default function HistoryList({ history }) {
  if (!history.length) {
    return (
      <p className={styles.empty}>
        Your flips will show up here — call it in the air and go.
      </p>
    );
  }

  return (
    <ol className={styles.list} aria-label="Recent flips">
      {history.map((entry, i) => (
        <li key={`${entry.createdAt}-${i}`} className={styles.row}>
          <span className={`${styles.badge} ${entry.win ? styles.win : styles.lose}`}>
            {entry.win ? "WIN" : "LOSS"}
          </span>
          <span className={styles.detail}>
            Called <strong>{entry.choice}</strong> · Landed <strong>{entry.result}</strong>
          </span>
          <time className={styles.time} dateTime={entry.createdAt}>
            {timeFormatter.format(new Date(entry.createdAt))}
          </time>
        </li>
      ))}
    </ol>
  );
}
