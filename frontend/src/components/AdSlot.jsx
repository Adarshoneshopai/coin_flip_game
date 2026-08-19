import { useEffect, useRef } from "react";
import styles from "./AdSlot.module.css";

/**
 * Drop-in AdSense unit.
 *
 * Placement rules baked into how this is used across the app (see Home.jsx):
 *   - never inside the coin/flip interaction area
 *   - never above the fold on first load (nothing shifts the coin down)
 *   - always visually separated with a label + spacing so it doesn't look
 *     like part of the game UI (AdSense policy + basic UX hygiene)
 *
 * Renders an empty placeholder until VITE_ADSENSE_CLIENT is set, so the
 * layout can be built/tested before AdSense approval without console errors.
 */
export default function AdSlot({ slot, format = "auto", label = "Advertisement" }) {
  const insRef = useRef(null);
  const client = import.meta.env.VITE_ADSENSE_CLIENT;

  useEffect(() => {
    if (!client) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error("AdSense failed to load:", err);
    }
  }, [client]);

  return (
    <div className={styles.wrap}>
      <span className={styles.label}>{label}</span>
      {client ? (
        <ins
          ref={insRef}
          className={`adsbygoogle ${styles.unit}`}
          style={{ display: "block" }}
          data-ad-client={client}
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive="true"
        />
      ) : (
        <div className={styles.placeholder}>Ad slot ({slot})</div>
      )}
    </div>
  );
}
