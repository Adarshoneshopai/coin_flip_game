import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";
import styles from "./GoogleSignInButton.module.css";

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export default function GoogleSignInButton() {
  const { loginWithGoogle } = useAuth();
  const { t } = useLanguage();
  const containerRef = useRef(null);
  const loginWithGoogleRef = useRef(loginWithGoogle);
  const [scriptReady, setScriptReady] = useState(false);

  // Always call the latest loginWithGoogle without re-running the init
  // effect below on every AuthContext re-render.
  useEffect(() => {
    loginWithGoogleRef.current = loginWithGoogle;
  });

  // The GIS script tag is async/defer, so it may not be attached to
  // `window` yet on first mount — poll briefly until it is.
  useEffect(() => {
    if (!CLIENT_ID) return;
    let cancelled = false;

    const tryInit = () => {
      if (cancelled) return;
      if (window.google?.accounts?.id) {
        setScriptReady(true);
      } else {
        setTimeout(tryInit, 150);
      }
    };
    tryInit();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!scriptReady || !containerRef.current) return;

    window.google.accounts.id.initialize({
      client_id: CLIENT_ID,
      callback: (response) => {
        // Failures (invalid/expired credential, account issues) surface
        // through AuthContext's authError, shown by AuthModal's existing
        // error banner — no separate error UI needed here.
        loginWithGoogleRef.current(response.credential).catch(() => {});
      },
    });

    window.google.accounts.id.renderButton(containerRef.current, {
      type: "standard",
      theme: "filled_black",
      size: "large",
      text: "continue_with",
      shape: "pill",
      width: 320,
    });
  }, [scriptReady]);

  // No client ID configured — hide the button entirely rather than show a
  // broken one (dev/local setups without Google credentials still work).
  if (!CLIENT_ID) return null;

  return (
    <div className={styles.wrapper}>
      <div className={styles.divider} role="separator">
        <span>{t("auth", "orDivider")}</span>
      </div>
      <div ref={containerRef} className={styles.googleBtn} id="google-signin-button" />
    </div>
  );
}
