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

          {/* Social Media Column (Instagram, Facebook, GitHub, Email) */}
          <div className={styles.column}>
            <h3 className={styles.columnTitle}>{t("footer", "socialTitle")}</h3>
            <div className={styles.socialGrid}>
              <span className={styles.socialBtn} aria-label="Instagram" title="Instagram">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                  <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06zm0 3.678a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm7.846-10.405a1.441 1.441 0 100-2.882 1.441 1.441 0 000 2.882z" />
                </svg>
              </span>
              <span className={styles.socialBtn} aria-label="Facebook" title="Facebook">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                  <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 011.141.195v3.325a8.623 8.623 0 00-.653-.036 26.805 26.805 0 00-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 00-.679.622c-.239.386-.343.919-.343 1.641v1.588h3.936l-.494 2.494-.161.831-.107.343h-3.174v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z" />
                </svg>
              </span>
              <span className={styles.socialBtn} aria-label="GitHub" title="GitHub">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                </svg>
              </span>
              <span className={styles.socialBtn} aria-label="Email" title="Email">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                  <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-10.023 6.03a1 1 0 01-1.045 0L1.5 8.67z" />
                  <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l10.5 6.3 10.5-6.3z" />
                </svg>
              </span>
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
