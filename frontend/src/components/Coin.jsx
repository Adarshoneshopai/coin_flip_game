import { useEffect, useRef, useState } from "react";
import { getCoinById } from "../data/coins.js";
import styles from "./Coin.module.css";

const EDGE_SLICES = 72;
const DIAMETER = 220; // px
const THICKNESS = 5; // px
const RADIUS = DIAMETER / 2;
// Each slice's width is one arc segment of the rim's circumference, so the
// slices tile the cylinder edge with no gaps or overlap.
const SLICE_WIDTH = (2 * Math.PI * RADIUS) / EDGE_SLICES + 0.5;

// Pre-build the cylinder wall once — it never changes, only the parent rotates.
const edgeSlices = Array.from({ length: EDGE_SLICES }, (_, i) => {
  const angle = (360 / EDGE_SLICES) * i;
  return (
    <span
      key={i}
      className={styles.edgeSlice}
      style={{
        width: `${SLICE_WIDTH}px`,
        height: `${THICKNESS}px`,
        transform: `rotateZ(${angle}deg) translateY(-${RADIUS}px) rotateX(90deg)`,
      }}
    />
  );
});

export default function Coin({ isFlipping, pendingResult, animationMs, coinId, choice }) {
  const coin = getCoinById(coinId);
  const [rotation, setRotation] = useState(() => (choice === "tails" ? 180 : 0));
  const rotationRef = useRef(choice === "tails" ? 180 : 0);
  const [headsError, setHeadsError] = useState(false);
  const [tailsError, setTailsError] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);
  const selectingTimeoutRef = useRef(null);

  // Reset image error states when the user switches coins
  useEffect(() => {
    setHeadsError(false);
    setTailsError(false);
  }, [coinId]);

  // Picking Heads/Tails in "Pick a Side" immediately spins the coin to that
  // side using the same 3D flip animation as a real flip — a visual
  // confirmation of the pick, not a game outcome (no result/scoring here).
  useEffect(() => {
    if (isFlipping) return;
    const targetOffset = choice === "tails" ? 180 : 0;
    const current = rotationRef.current;
    const currentModulo = ((current % 360) + 360) % 360;
    if (currentModulo === targetOffset) return;

    const fullTurnsBase = current - (current % 360);
    const extraSpins = 5 + Math.floor(Math.random() * 3); // 5–7 full spins
    let target = fullTurnsBase + extraSpins * 360 + targetOffset;
    if (target <= current) target += 360;

    rotationRef.current = target;
    setRotation(target);
    setIsSelecting(true);

    clearTimeout(selectingTimeoutRef.current);
    selectingTimeoutRef.current = setTimeout(() => setIsSelecting(false), animationMs);
    // choice is the only thing that should retrigger this preview spin
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [choice]);

  useEffect(() => () => clearTimeout(selectingTimeoutRef.current), []);

  useEffect(() => {
    if (!isFlipping || pendingResult === null) return;

    const current = rotationRef.current;
    const fullTurnsBase = current - (current % 360);
    const extraSpins = 5 + Math.floor(Math.random() * 3); // 5–7 full spins
    const targetOffset = pendingResult === "tails" ? 180 : 0;

    let target = fullTurnsBase + extraSpins * 360 + targetOffset;
    if (target <= current) target += 360;

    rotationRef.current = target;
    setRotation(target);
    // isFlipping/pendingResult are the only things that should retrigger a spin
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFlipping, pendingResult]);

  const landed = !isFlipping && pendingResult !== null;

  return (
    <div className={styles.stage} role="img" aria-label={landed ? `${coin.name} coin landed on ${pendingResult}` : `${coin.name} coin`}>
      <div
        className={`${styles.coin} ${isFlipping || isSelecting ? styles.spinning : ""} ${landed ? styles.landed : ""}`}
        style={{
          transform: `rotateY(${rotation}deg)`,
          transitionDuration: `${animationMs}ms`,
          width: DIAMETER,
          height: DIAMETER,
          "--coin-light": coin.colors.light,
          "--coin-mid": coin.colors.mid,
          "--coin-dark": coin.colors.dark,
        }}
      >
        <div className={`${styles.face} ${styles.heads}`}>
          {coin.headsImage && !headsError ? (
            <img
              src={coin.headsImage}
              alt={coin.headsLabel || "Heads"}
              className={styles.faceImage}
              loading="eager"
              onError={() => setHeadsError(true)}
            />
          ) : (
            <div className={styles.faceRing}>
              <span className={styles.faceSymbol}>{coin.headsSymbol}</span>
              <span className={styles.faceLabel}>{coin.headsLabel}</span>
            </div>
          )}
        </div>

        <div className={styles.edge}>{edgeSlices}</div>

        <div className={`${styles.face} ${styles.tails}`}>
          {coin.tailsImage && !tailsError ? (
            <img
              src={coin.tailsImage}
              alt={coin.tailsLabel || "Tails"}
              className={styles.faceImage}
              loading="eager"
              onError={() => setTailsError(true)}
            />
          ) : (
            <div className={styles.faceRing}>
              <span className={styles.faceSymbol}>{coin.tailsSymbol}</span>
              <span className={styles.faceLabel}>{coin.tailsLabel}</span>
            </div>
          )}
        </div>
      </div>

      <div className={styles.shadow} aria-hidden="true" />
    </div>
  );
}
