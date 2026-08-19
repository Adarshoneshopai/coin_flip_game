import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";
import styles from "./Navbar.module.css";

export default function Navbar({ currentView, setCurrentView }) {
  const { user, isAuthenticated, openLoginModal, openSignupModal, logout } = useAuth();
  const { languages, activeLanguage, setLanguage, t } = useLanguage();

  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const langRef = useRef(null);

  // Close language dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) {
        setIsLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // Close mobile menu on screen resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 960) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const handleNavClick = (view) => {
    if (setCurrentView) {
      setCurrentView(view);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
    setIsMobileMenuOpen(false);
    setIsLangOpen(false);
  };

  return (
    <nav className={styles.navContainer} aria-label="Main Navigation">
      <div className={styles.navInner}>
        {/* Left: Brand Logo */}
        <button
          type="button"
          className={styles.brand}
          onClick={() => handleNavClick("game")}
          aria-label="Heads or Tails Home"
        >
          <div className={styles.brandCoin} aria-hidden="true">
            H
          </div>
          <div className={styles.brandText}>
            <span className={styles.brandTitle}>Heads&nbsp;or&nbsp;Tails</span>
            <span className={styles.brandTagline}>Call it in the air</span>
          </div>
        </button>

        {/* Center / Right: Desktop Navigation */}
        <div className={styles.desktopNav}>
          <ul className={styles.navLinks}>
            <li>
              <button
                type="button"
                className={`${styles.navLink} ${
                  currentView === "game" ? styles.navLinkActive : ""
                }`}
                onClick={() => handleNavClick("game")}
                id="nav-game-link"
              >
                🪙 {t("nav", "game")}
              </button>
            </li>
            <li>
              <button
                type="button"
                className={`${styles.navLink} ${
                  currentView === "features" ? styles.navLinkActive : ""
                }`}
                onClick={() => handleNavClick("features")}
                id="nav-features-link"
              >
                ✨ {t("nav", "features")}
              </button>
            </li>
            <li>
              <button
                type="button"
                className={`${styles.navLink} ${
                  currentView === "blog" ? styles.navLinkActive : ""
                }`}
                onClick={() => handleNavClick("blog")}
                id="nav-blog-link"
              >
                📰 {t("nav", "blog")}
              </button>
            </li>
            <li>
              <button
                type="button"
                className={`${styles.navLink} ${
                  currentView === "faq" ? styles.navLinkActive : ""
                }`}
                onClick={() => handleNavClick("faq")}
                id="nav-faq-link"
              >
                ❓ {t("nav", "faq")}
              </button>
            </li>
            <li>
              <button
                type="button"
                className={`${styles.navLink} ${
                  currentView === "history" ? styles.navLinkActive : ""
                }`}
                onClick={() => handleNavClick("history")}
                id="nav-history-link"
              >
                📜 {t("nav", "history")}
              </button>
            </li>
          </ul>

          {/* Language Selector Dropdown */}
          <div className={styles.langDropdownWrapper} ref={langRef}>
            <button
              type="button"
              className={styles.langBtn}
              onClick={() => setIsLangOpen(!isLangOpen)}
              aria-expanded={isLangOpen}
              aria-haspopup="listbox"
              id="nav-language-button"
            >
              <span className={styles.langFlag} aria-hidden="true">
                {activeLanguage.flag}
              </span>
              <span>{activeLanguage.name}</span>
              <span
                className={`${styles.chevron} ${isLangOpen ? styles.chevronOpen : ""}`}
                aria-hidden="true"
              >
                ▼
              </span>
            </button>

            {isLangOpen && (
              <div className={styles.langMenu} role="listbox" id="nav-language-menu">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    type="button"
                    role="option"
                    aria-selected={lang.code === activeLanguage.code}
                    className={`${styles.langOption} ${
                      lang.code === activeLanguage.code ? styles.langOptionActive : ""
                    }`}
                    onClick={() => {
                      setLanguage(lang.code);
                      setIsLangOpen(false);
                    }}
                  >
                    <span className={styles.langOptionLabel}>
                      <span>{lang.flag}</span>
                      <span>{lang.native}</span>
                    </span>
                    {lang.code === activeLanguage.code && (
                      <span className={styles.checkMark} aria-hidden="true">
                        ✓
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Dynamic Authentication Options */}
          <div className={styles.authControls}>
            {!isAuthenticated ? (
              <>
                <button
                  type="button"
                  className={styles.loginBtn}
                  onClick={openLoginModal}
                  id="nav-login-button"
                >
                  {t("nav", "login")}
                </button>
                <button
                  type="button"
                  className={styles.signupBtn}
                  onClick={openSignupModal}
                  id="nav-signup-button"
                >
                  {t("nav", "signup")}
                </button>
              </>
            ) : (
              <>
                <div className={styles.userBadge} title={`Logged in as ${user?.email}`}>
                  <div className={styles.userAvatar} aria-hidden="true">
                    {getInitials(user?.name)}
                  </div>
                  <span className={styles.userName}>{user?.name || "Player"}</span>
                </div>
                <button
                  type="button"
                  className={styles.logoutBtn}
                  onClick={logout}
                  id="nav-logout-button"
                  title="Sign out of your account"
                >
                  <span aria-hidden="true">🚪</span>
                  <span>{t("nav", "logout")}</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Mobile Hamburger Toggle Button */}
        <button
          type="button"
          className={styles.mobileToggle}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-expanded={isMobileMenuOpen}
          aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          id="nav-mobile-toggle"
        >
          <span
            className={`${styles.hamburgerLine} ${
              isMobileMenuOpen ? styles.hamburgerLineOpen : ""
            }`}
          />
          <span
            className={`${styles.hamburgerLine} ${
              isMobileMenuOpen ? styles.hamburgerLineOpen : ""
            }`}
          />
          <span
            className={`${styles.hamburgerLine} ${
              isMobileMenuOpen ? styles.hamburgerLineOpen : ""
            }`}
          />
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      <div
        className={`${styles.mobileDrawer} ${
          isMobileMenuOpen ? styles.mobileDrawerOpen : ""
        }`}
        id="nav-mobile-drawer"
      >
        <ul className={styles.mobileLinks}>
          <li>
            <button
              type="button"
              className={`${styles.mobileNavLink} ${
                currentView === "game" ? styles.mobileNavLinkActive : ""
              }`}
              onClick={() => handleNavClick("game")}
            >
              <span>🪙 {t("nav", "game")}</span>
              <span>→</span>
            </button>
          </li>
          <li>
            <button
              type="button"
              className={`${styles.mobileNavLink} ${
                currentView === "features" ? styles.mobileNavLinkActive : ""
              }`}
              onClick={() => handleNavClick("features")}
            >
              <span>✨ {t("nav", "features")}</span>
              <span>→</span>
            </button>
          </li>
          <li>
            <button
              type="button"
              className={`${styles.mobileNavLink} ${
                currentView === "blog" ? styles.mobileNavLinkActive : ""
              }`}
              onClick={() => handleNavClick("blog")}
            >
              <span>📰 {t("nav", "blog")}</span>
              <span>→</span>
            </button>
          </li>
          <li>
            <button
              type="button"
              className={`${styles.mobileNavLink} ${
                currentView === "faq" ? styles.mobileNavLinkActive : ""
              }`}
              onClick={() => handleNavClick("faq")}
            >
              <span>❓ {t("nav", "faq")}</span>
              <span>→</span>
            </button>
          </li>
          <li>
            <button
              type="button"
              className={`${styles.mobileNavLink} ${
                currentView === "history" ? styles.mobileNavLinkActive : ""
              }`}
              onClick={() => handleNavClick("history")}
            >
              <span>📜 {t("nav", "history")}</span>
              <span>→</span>
            </button>
          </li>
        </ul>

        {/* Mobile Language Picker */}
        <div className={styles.mobileLangSection}>
          <p className={styles.mobileSectionTitle}>{t("nav", "language")}</p>
          <div className={styles.mobileLangGrid}>
            {languages.map((lang) => (
              <button
                key={lang.code}
                type="button"
                className={`${styles.mobileLangChip} ${
                  lang.code === activeLanguage.code ? styles.mobileLangChipActive : ""
                }`}
                onClick={() => {
                  setLanguage(lang.code);
                }}
              >
                <span>{lang.flag}</span>
                <span>{lang.native}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Auth Actions */}
        <div className={styles.mobileAuthSection}>
          {!isAuthenticated ? (
            <>
              <button
                type="button"
                className={styles.mobileLoginBtn}
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  openLoginModal();
                }}
              >
                {t("nav", "login")}
              </button>
              <button
                type="button"
                className={styles.mobileSignupBtn}
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  openSignupModal();
                }}
              >
                {t("nav", "signup")}
              </button>
            </>
          ) : (
            <>
              <div className={styles.mobileUserProfile}>
                <div className={styles.mobileUserAvatar}>
                  {getInitials(user?.name)}
                </div>
                <div className={styles.mobileUserInfo}>
                  <span className={styles.mobileUserName}>{user?.name}</span>
                  <span className={styles.mobileUserEmail}>{user?.email}</span>
                </div>
              </div>
              <button
                type="button"
                className={styles.mobileLogoutBtn}
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  logout();
                }}
              >
                🚪 {t("nav", "logout")}
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
