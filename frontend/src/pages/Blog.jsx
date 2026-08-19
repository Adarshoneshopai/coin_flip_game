import React from "react";
import { Helmet } from "react-helmet-async";
import { useLanguage } from "../context/LanguageContext.jsx";
import styles from "./Blog.module.css";

export default function Blog({ onBackToGame }) {
  const { t } = useLanguage();

  const articles = [
    {
      id: 1,
      tag: t("blog", "article1Tag"),
      readTime: 4,
      title: t("blog", "article1Title"),
      paragraphs: [
        t("blog", "article1P1"),
        t("blog", "article1P2"),
        t("blog", "article1P3"),
      ],
      takeaway: t("blog", "article1Takeaway"),
    },
    {
      id: 2,
      tag: t("blog", "article2Tag"),
      readTime: 3,
      title: t("blog", "article2Title"),
      paragraphs: [
        t("blog", "article2P1"),
        t("blog", "article2P2"),
        t("blog", "article2P3"),
      ],
      takeaway: t("blog", "article2Takeaway"),
    },
    {
      id: 3,
      tag: t("blog", "article3Tag"),
      readTime: 5,
      title: t("blog", "article3Title"),
      paragraphs: [
        t("blog", "article3P1"),
        t("blog", "article3P2"),
        t("blog", "article3P3"),
      ],
      takeaway: t("blog", "article3Takeaway"),
    },
  ];

  return (
    <>
      <Helmet>
        <title>Blog & Insights — Heads or Tails Online</title>
        <meta
          name="description"
          content="Explore the mathematics of coin tossing, overcoming decision fatigue, and the rich 2,000-year history of Heads or Tails."
        />
      </Helmet>

      <main className={styles.blogContainer}>
        <header className={styles.blogHeader}>
          <button
            type="button"
            className={styles.backBtn}
            onClick={onBackToGame}
            id="blog-back-button"
          >
            ← {t("blog", "backToGame")}
          </button>
          <h1 className={styles.mainTitle}>{t("blog", "title")}</h1>
          <p className={styles.subTitle}>{t("blog", "subtitle")}</p>
        </header>

        <section className={styles.articleGrid} aria-label="Blog articles list">
          {articles.map((article) => (
            <article key={article.id} className={styles.articleCard}>
              <div className={styles.metaRow}>
                <span className={styles.tag}>{article.tag}</span>
                <span className={styles.readTime}>
                  ⏱️ {article.readTime} {t("blog", "readTime")}
                </span>
              </div>

              <h2 className={styles.articleTitle}>{article.title}</h2>

              <div className={styles.articleBody}>
                {article.paragraphs.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>

              <div className={styles.keyTakeaway}>
                <strong>{t("blog", "takeaway")}: </strong>
                {article.takeaway}
              </div>
            </article>
          ))}
        </section>
      </main>
    </>
  );
}
