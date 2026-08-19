import styles from "./ChoiceSelector.module.css";

export default function ChoiceSelector({ choice, onChange, disabled }) {
  return (
    <div className={styles.group} role="radiogroup" aria-label="Choose heads or tails">
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
          {option === "heads" ? "Heads" : "Tails"}
        </button>
      ))}
    </div>
  );
}
