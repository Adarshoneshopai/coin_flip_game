import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useLanguage } from "../context/LanguageContext.jsx";
import styles from "./FAQ.module.css";

export default function FAQ({ onBackToGame }) {
  const { t } = useLanguage();
  const [openId, setOpenId] = useState(1);

  const faqs = [
    {
      id: 1,
      q: t("faq", "q1"),
      a: t("faq", "a1"),
    },
    {
      id: 2,
      q: t("faq", "q2"),
      a: t("faq", "a2"),
    },
    {
      id: 3,
      q: t("faq", "q3"),
      a: t("faq", "a3"),
    },
    {
      id: 4,
      q: t("faq", "q4"),
      a: t("faq", "a4"),
    },
    {
      id: 5,
      q: t("faq", "q5"),
      a: t("faq", "a5"),
    },
  ];

  const toggleAccordion = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <>
      <Helmet>
        <title>FAQ — Heads or Tails Online</title>
        <meta
          name="description"
          content="Frequently asked questions about coin flip fairness, odds, statistics, and security."
        />
      </Helmet>

      <main className={styles.faqContainer}>
        <header className={styles.faqHeader}>
          <button
            type="button"
            className={styles.backBtn}
            onClick={onBackToGame}
            id="faq-back-button"
          >
            ← {t("faq", "backToGame")}
          </button>
          <h1 className={styles.mainTitle}>{t("faq", "title")}</h1>
          <p className={styles.subTitle}>{t("faq", "subtitle")}</p>
        </header>

        <section className={styles.accordionList} aria-label="FAQ questions list">
          {faqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className={`${styles.accordionItem} ${
                  isOpen ? styles.accordionItemOpen : ""
                }`}
              >
                <button
                  type="button"
                  className={styles.accordionHeader}
                  onClick={() => toggleAccordion(faq.id)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${faq.id}`}
                >
                  <span>{faq.q}</span>
                  <span
                    className={`${styles.icon} ${isOpen ? styles.iconOpen : ""}`}
                    aria-hidden="true"
                  >
                    ▼
                  </span>
                </button>

                {isOpen && (
                  <div
                    id={`faq-answer-${faq.id}`}
                    className={styles.accordionBody}
                    role="region"
                  >
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </section>
      </main>
    </>
  );
}
