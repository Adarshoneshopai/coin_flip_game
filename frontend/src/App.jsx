import React, { useState } from "react";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import Features from "./pages/Features.jsx";
import Blog from "./pages/Blog.jsx";
import FAQ from "./pages/FAQ.jsx";
import HistoryPage from "./pages/HistoryPage.jsx";
import LegalPage from "./pages/LegalPage.jsx";
import ResetPasswordPage from "./pages/ResetPasswordPage.jsx";
import AuthModal from "./components/AuthModal.jsx";

export default function App() {
  const [currentView, setCurrentView] = useState("game"); // 'game' | 'features' | 'blog' | 'faq' | 'history' | 'terms' | 'privacy'

  // A password-reset email link lands here as ?resetToken=... on the root
  // path (no router / no server rewrites needed for a dedicated route).
  const [resetToken, setResetToken] = useState(
    () => new URLSearchParams(window.location.search).get("resetToken") || null
  );

  const clearResetToken = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete("resetToken");
    window.history.replaceState({}, "", url.toString());
    setResetToken(null);
    setCurrentView("game");
  };

  const renderView = () => {
    if (resetToken) {
      return <ResetPasswordPage token={resetToken} onBackToGame={clearResetToken} />;
    }

    switch (currentView) {
      case "features":
        return <Features onBackToGame={() => setCurrentView("game")} />;
      case "blog":
        return <Blog onBackToGame={() => setCurrentView("game")} />;
      case "faq":
        return <FAQ onBackToGame={() => setCurrentView("game")} />;
      case "history":
        return <HistoryPage onBackToGame={() => setCurrentView("game")} />;
      case "terms":
        return (
          <LegalPage
            initialTab="terms"
            onBackToGame={() => setCurrentView("game")}
          />
        );
      case "privacy":
        return (
          <LegalPage
            initialTab="privacy"
            onBackToGame={() => setCurrentView("game")}
          />
        );
      case "game":
      default:
        return <Home />;
    }
  };

  return (
    <div className="app-shell">
      <Navbar currentView={currentView} setCurrentView={setCurrentView} />
      {renderView()}
      <Footer onNavigate={setCurrentView} />
      <AuthModal />
    </div>
  );
}
