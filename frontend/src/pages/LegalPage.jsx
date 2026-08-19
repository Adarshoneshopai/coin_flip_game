import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useLanguage } from "../context/LanguageContext.jsx";
import styles from "./LegalPage.module.css";

export default function LegalPage({ initialTab = "terms", onBackToGame }) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState(initialTab);

  const isTerms = activeTab === "terms";

  return (
    <>
      <Helmet>
        <title>
          {isTerms ? t("legal", "termsTitle") : t("legal", "privacyTitle")} — Heads or
          Tails Online
        </title>
        <meta
          name="description"
          content={isTerms ? t("legal", "termsSubtitle") : t("legal", "privacySubtitle")}
        />
      </Helmet>

      <main className={styles.legalContainer}>
        <header className={styles.legalHeader}>
          <button
            type="button"
            className={styles.backBtn}
            onClick={onBackToGame}
            id="legal-back-button"
          >
            ← {t("legal", "backToGame")}
          </button>
          <h1 className={styles.mainTitle}>
            {isTerms ? t("legal", "termsTitle") : t("legal", "privacyTitle")}
          </h1>
          <p className={styles.subTitle}>
            {isTerms ? t("legal", "termsSubtitle") : t("legal", "privacySubtitle")}
          </p>
          <span className={styles.lastUpdated}>{t("legal", "lastUpdated")}</span>
        </header>

        <div className={styles.tabSwitch} role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={isTerms}
            className={`${styles.tabBtn} ${isTerms ? styles.tabBtnActive : ""}`}
            onClick={() => setActiveTab("terms")}
          >
            {t("legal", "termsTitle")}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={!isTerms}
            className={`${styles.tabBtn} ${!isTerms ? styles.tabBtnActive : ""}`}
            onClick={() => setActiveTab("privacy")}
          >
            {t("legal", "privacyTitle")}
          </button>
        </div>

        <article className={styles.card}>
          {isTerms ? (
            <>
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>{t("legal", "termsSec1Title")}</h2>
                <p className={styles.sectionText}>{t("legal", "termsSec1Text")}</p>
              </div>

              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>{t("legal", "termsSec2Title")}</h2>
                <p className={styles.sectionText}>{t("legal", "termsSec2Text")}</p>
              </div>

              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>{t("legal", "termsSec3Title")}</h2>
                <p className={styles.sectionText}>{t("legal", "termsSec3Text")}</p>
              </div>

              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>{t("legal", "termsSec4Title")}</h2>
                <p className={styles.sectionText}>{t("legal", "termsSec4Text")}</p>
              </div>
            </>
          ) : (
            <>
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>{t("legal", "privacySec1Title")}</h2>
                <p className={styles.sectionText}>{t("legal", "privacySec1Text")}</p>
              </div>

              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>{t("legal", "privacySec2Title")}</h2>
                <p className={styles.sectionText}>{t("legal", "privacySec2Text")}</p>
              </div>

              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>{t("legal", "privacySec3Title")}</h2>
                <p className={styles.sectionText}>{t("legal", "privacySec3Text")}</p>
              </div>

              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>{t("legal", "privacySec4Title")}</h2>
                <p className={styles.sectionText}>{t("legal", "privacySec4Text")}</p>
              </div>
            </>
          )}
        </article>
      </main>
    </>
  );
}
