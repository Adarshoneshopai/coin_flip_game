import { Helmet } from "react-helmet-async";
import Coin from "../components/Coin.jsx";
import ChoiceSelector from "../components/ChoiceSelector.jsx";
import CountrySelector from "../components/CountrySelector.jsx";
import ScoreBoard from "../components/ScoreBoard.jsx";
import HistoryList from "../components/HistoryList.jsx";
import AdSlot from "../components/AdSlot.jsx";
import { useCoinGame } from "../hooks/useCoinGame.js";
import { getCoinById } from "../data/coins.js";
import styles from "./Home.module.css";

export default function Home() {
  const {
    choice,
    setChoice,
    coinId,
    setCoinId,
    isFlipping,
    result,
    pendingResult,
    lastWin,
    history,
    stats,
    flip,
    offline,
    animationMs,
  } = useCoinGame();

  const activeCoin = getCoinById(coinId);

  const statusText = isFlipping
    ? "Flipping…"
    : result
    ? lastWin
      ? `${result.toUpperCase()} — you called it right!`
      : `${result.toUpperCase()} — better luck next flip.`
    : "Pick a side and flip.";

  return (
    <>
      <Helmet>
        <title>Heads or Tails — Free Online 3D Coin Flip Game</title>
        <meta
          name="description"
          content="Flip a realistic 3D coin online. Pick heads or tails, watch it spin, and track your wins, losses, and streaks."
        />
      </Helmet>

      <main className={styles.main}>
        <section className={styles.gameCard} aria-labelledby="game-heading">
          <h1 id="game-heading" className={styles.srOnly}>
            Heads or Tails — Online Coin Flip Game
          </h1>

          <Coin
            isFlipping={isFlipping}
            pendingResult={pendingResult}
            animationMs={animationMs}
            coinId={coinId}
          />

          <p
            className={styles.status}
            role="status"
            aria-live="polite"
            data-win={result ? lastWin : undefined}
          >
            {statusText}
          </p>

          <ChoiceSelector choice={choice} onChange={setChoice} disabled={isFlipping} />

          <CountrySelector coinId={coinId} onChange={setCoinId} disabled={isFlipping} />
          <p className={styles.coinCaption}>
            {activeCoin.flag} Flipping the {activeCoin.name} coin
          </p>

          <button className={styles.flipButton} onClick={flip} disabled={isFlipping}>
            {isFlipping ? "Flipping…" : "Flip the coin"}
          </button>

          {offline && (
            <p className={styles.offlineNote}>
              Playing offline — scores are saved on this device only.
            </p>
          )}
        </section>

        <ScoreBoard stats={stats} />

        {/* Ad sits between the game and the history list — visible without
           competing with the flip interaction, and never causes layout
           shift under the coin. */}
        <AdSlot slot="1111111111" label="Advertisement" />

        <section className={styles.historyCard} aria-labelledby="history-heading">
          <h2 id="history-heading" className={styles.historyHeading}>
            Recent flips
          </h2>
          <HistoryList history={history} />
        </section>

        <AdSlot slot="2222222222" label="Advertisement" />

        <section className={styles.about}>
          <h2>How the coin flip game works</h2>
          <p>
            Choose heads or tails, pick a coin design, then flip. Each result comes from a fair,
            independent 50/50 random draw — server-side when you're online, so no two players can
            influence each other's outcome. Your streak, win rate, and last 20 flips are tracked
            automatically.
          </p>
        </section>
      </main>
    </>
  );
}
