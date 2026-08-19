import React from "react";
import { Helmet } from "react-helmet-async";
import Coin from "../components/Coin.jsx";
import ChoiceSelector from "../components/ChoiceSelector.jsx";
import CountrySelector from "../components/CountrySelector.jsx";
import ScoreBoard from "../components/ScoreBoard.jsx";
import HistoryList from "../components/HistoryList.jsx";
import AdSlot from "../components/AdSlot.jsx";
import { useCoinGame } from "../hooks/useCoinGame.js";
import { useLanguage } from "../context/LanguageContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { getCoinById } from "../data/coins.js";
import styles from "./Home.module.css";

export default function Home() {
  const {
    choice,
    setChoice,
    coinId,
    setCoinId,
    isMuted,
    toggleMute,
    isFlipping,
    result,
    pendingResult,
    lastWin,
    history,
    stats,
    flip,
    offline,
    animationMs,
    isAuthenticated,
  } = useCoinGame();

  const { t } = useLanguage();
  const { openLoginModal } = useAuth();

  const activeCoin = getCoinById(coinId);
  const activeCoinName = t("coins", activeCoin.id, activeCoin.name);

  const resultLabel = result === "heads" ? t("game", "heads") : t("game", "tails");

  const statusText = isFlipping
    ? t("game", "statusFlipping")
    : result
    ? lastWin
      ? `${resultLabel.toUpperCase()} ${t("game", "statusWonSuffix")}`
      : `${resultLabel.toUpperCase()} ${t("game", "statusLostSuffix")}`
    : t("game", "statusPrompt");

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
          <div className={styles.gameTopBar}>
            <button
              type="button"
              className={styles.soundButton}
              onClick={toggleMute}
              aria-label={
                isMuted ? t("game", "soundUnmuteAria") : t("game", "soundMuteAria")
              }
              title={isMuted ? t("game", "soundMuted") : t("game", "soundOn")}
            >
              <span className={styles.soundIcon} aria-hidden="true">
                {isMuted ? "🔇" : "🔊"}
              </span>
              <span className={styles.soundLabel}>
                {isMuted ? t("game", "soundMuted") : t("game", "soundOn")}
              </span>
            </button>
          </div>

          <h1 id="game-heading" className={styles.srOnly}>
            {t("game", "srTitle")}
          </h1>

          <Coin
            isFlipping={isFlipping}
            pendingResult={pendingResult}
            animationMs={animationMs}
            coinId={coinId}
            choice={choice}
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
            {activeCoin.flag}{" "}
            {t("game", "flippingCaption").replace("{name}", activeCoinName)}
          </p>

          <button
            className={styles.flipButton}
            onClick={flip}
            disabled={isFlipping}
            id="game-flip-button"
          >
            {isFlipping ? t("game", "flippingBtn") : t("game", "flipBtn")}
          </button>

          {offline && <p className={styles.offlineNote}>{t("game", "offlineNote")}</p>}
        </section>

        <ScoreBoard stats={stats} />

        {/* Ad slot */}
        <AdSlot slot="1111111111" label="Advertisement" />

        {/* Recent Flips: Only show history list for authenticated users */}
        {isAuthenticated ? (
          <section className={styles.historyCard} aria-labelledby="history-heading">
            <h2 id="history-heading" className={styles.historyHeading}>
              {t("history", "title")}
            </h2>
            <HistoryList history={history} />
          </section>
        ) : (
          <section className={styles.guestCard} aria-labelledby="history-heading">
            <h2 id="history-heading" className={styles.guestHeading}>
              🔒 {t("history", "title")}
            </h2>
            <p className={styles.guestPrompt}>{t("history", "guestPrompt")}</p>
            <button
              type="button"
              className={styles.guestBtn}
              onClick={openLoginModal}
              id="guest-signin-btn"
            >
              {t("nav", "login")} / {t("nav", "signup")}
            </button>
          </section>
        )}

        <AdSlot slot="2222222222" label="Advertisement" />

        <section className={styles.about}>
          <h2>{t("game", "howItWorksTitle")}</h2>
          <p>{t("game", "howItWorksText")}</p>
        </section>
      </main>
    </>
  );
}
