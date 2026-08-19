import React from "react";
import { useLanguage } from "../context/LanguageContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import styles from "./Footer.module.css";

export default function Footer({ onNavigate }) {
  const { t } = useLanguage();
  const { isAuthenticated, openLoginModal } = useAuth();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNav = (view) => {
    if (onNavigate) {
      onNavigate(view);
    }
    scrollToTop();
  };

  return (
    <footer className={styles.footerContainer} aria-label="Site Footer">
      <div className={styles.footerInner}>
        <div className={styles.grid}>
          {/* Brand Column */}
          <div className={styles.brandCol}>
            <button
              type="button"
              className={styles.brandLogo}
              onClick={() => handleNav("game")}
              aria-label="Heads or Tails Home"
            >
              <div className={styles.coinMark} aria-hidden="true">
                H
              </div>
              <span className={styles.brandName}>{t("footer", "aboutTitle")}</span>
            </button>
            <p className={styles.aboutText}>{t("footer", "aboutText")}</p>
            <div className={styles.statusBadge} title="Backend API & Database Connection">
              <span className={styles.statusDot} aria-hidden="true" />
              <span>{t("footer", "statusOnline")}</span>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className={styles.column}>
            <h3 className={styles.columnTitle}>{t("footer", "quickLinks")}</h3>
            <ul className={styles.linkList}>
              <li>
                <button
                  type="button"
                  className={styles.linkBtn}
                  onClick={() => handleNav("game")}
                  id="footer-game-link"
                >
                  🪙 {t("footer", "playGame")}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className={styles.linkBtn}
                  onClick={() => handleNav("blog")}
                  id="footer-blog-link"
                >
                  📰 {t("footer", "blog")}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className={styles.linkBtn}
                  onClick={() => handleNav("faq")}
                  id="footer-faq-link"
                >
                  ❓ {t("footer", "faq")}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className={styles.linkBtn}
                  onClick={() => handleNav("history")}
                  id="footer-history-link"
                >
                  📜 {t("footer", "history")}
                </button>
              </li>
            </ul>
          </div>

          {/* Legal Column */}
          <div className={styles.column}>
            <h3 className={styles.columnTitle}>{t("footer", "legal")}</h3>
            <ul className={styles.linkList}>
              <li>
                <button
                  type="button"
                  className={styles.linkBtn}
                  onClick={() => handleNav("terms")}
                  id="footer-terms-link"
                >
                  📄 {t("footer", "terms")}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className={styles.linkBtn}
                  onClick={() => handleNav("privacy")}
                  id="footer-privacy-link"
                >
                  🔒 {t("footer", "privacy")}
                </button>
              </li>
              {!isAuthenticated && (
                <li>
                  <button
                    type="button"
                    className={styles.linkBtn}
                    onClick={openLoginModal}
                    id="footer-login-link"
                  >
                    🔑 {t("nav", "login")} / {t("nav", "signup")}
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Features Column */}
          <div className={styles.column}>
            <h3 className={styles.columnTitle}>
              <button
                type="button"
                className={styles.columnTitleLink}
                onClick={() => handleNav("features")}
                id="footer-features-link"
              >
                {t("footer", "features")}
              </button>
            </h3>
            <ul className={styles.linkList}>
              <li className={styles.featureItem}>
                <span className={styles.featureIcon}>✦</span>
                <span>{t("footer", "fairRng")}</span>
              </li>
              <li className={styles.featureItem}>
                <span className={styles.featureIcon}>✦</span>
                <span>{t("footer", "soundEffects")}</span>
              </li>
              <li className={styles.featureItem}>
                <span className={styles.featureIcon}>✦</span>
                <span>{t("footer", "globalCoins")}</span>
              </li>
              <li className={styles.featureItem}>
                <span className={styles.featureIcon}>✦</span>
                <span>{t("footer", "statsTracker")}</span>
              </li>
            </ul>
          </div>

          {/* Social Media Column (Instagram, Facebook, YouTube, etc.) */}
          <div className={styles.column}>
            <h3 className={styles.columnTitle}>{t("footer", "socialTitle")}</h3>
            <div className={styles.socialGrid}>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer noopener"
                className={styles.socialBtn}
                aria-label="Instagram"
                title="Instagram"
              >
                📸
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer noopener"
                className={styles.socialBtn}
                aria-label="Facebook"
                title="Facebook"
              >
                👥
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer noopener"
                className={styles.socialBtn}
                aria-label="YouTube"
                title="YouTube"
              >
                ▶️
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer noopener"
                className={styles.socialBtn}
                aria-label="Twitter / X"
                title="Twitter / X"
              >
                🐦
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer noopener"
                className={styles.socialBtn}
                aria-label="GitHub repository"
                title="GitHub"
              >
                🐙
              </a>
              <a
                href="mailto:support@heads-or-tails.app"
                className={styles.socialBtn}
                aria-label="Contact support via email"
                title="Email Support"
              >
                ✉️
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={styles.bottomBar}>
          <p className={styles.disclaimer}>{t("footer", "disclaimer")}</p>
          <div className={styles.copyrightRow}>
            <span>
              © {new Date().getFullYear()} {t("footer", "copyright")}
            </span>
            <button
              type="button"
              className={styles.backToTopBtn}
              onClick={scrollToTop}
              aria-label="Scroll back to top of page"
            >
              ↑ {t("footer", "backToTop")}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
