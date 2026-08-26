import React, { useState, useEffect, useCallback, Component, ErrorInfo, ReactNode } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import "./index.css";

// Layout
import Navbar   from "./components/layout/Navbar";
import Footer   from "./components/layout/Footer";

// UI
import Cursor    from "./components/ui/Cursor";
import Preloader from "./components/ui/Preloader";

// Pages
import Home          from "./pages/Home";
import AboutPage     from "./pages/AboutPage";
import SkillsPage    from "./pages/SkillsPage";
import WorkPage      from "./pages/WorkPage";
import ProjectsPage  from "./pages/ProjectsPage";
import AssistantPage from "./pages/AssistantPage";

// Hooks
import { useLenis }        from "./hooks/useLenis";
import { useScrollReveal } from "./hooks/useScrollReveal";
import { playMechanicalMouseClick } from "./utils/sound";

class AppErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError(_: Error) {
    return { hasError: true };
  }
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("App render error caught:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-night text-bark flex flex-col items-center justify-center p-6 text-center">
          <h1 className="font-display text-3xl mb-4 text-amber">Something went wrong</h1>
          <p className="font-mono text-sm text-bark/60 mb-6">An unexpected UI error occurred.</p>
          <button
            onClick={() => {
              sessionStorage.clear();
              window.location.reload();
            }}
            className="font-mono text-xs px-6 py-3 bg-amber text-night font-bold uppercase rounded-full"
          >
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const App: React.FC = () => {
  const [loaded, setLoaded] = useState(() => {
    try {
      return sessionStorage.getItem("portfolio_v3_loaded") === "true";
    } catch {
      return false;
    }
  });

  const location = useLocation();

  const handleLoaded = useCallback(() => setLoaded(true), []);

  useLenis();
  useScrollReveal("[data-reveal]", location.pathname);

  // Global Classic Mechanical Mouse Click Sound (skips game container so game.wav plays exclusively)
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent | PointerEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && target.closest && target.closest(".byte-defender-card, canvas")) {
        return;
      }
      playMechanicalMouseClick();
    };
    window.addEventListener("pointerdown", handleGlobalClick, { capture: true, passive: true });
    return () => {
      window.removeEventListener("pointerdown", handleGlobalClick, { capture: true });
    };
  }, []);

  // Guarantee loaded state within 1.5 seconds under all conditions
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Instant clean route navigation & scroll reset
  useEffect(() => {
    // Reset Lenis smooth scroll to top immediately
    if ((window as any).__lenis) {
      (window as any).__lenis.scrollTo(0, { immediate: true });
    }
    window.scrollTo(0, 0);

    // Refresh scroll triggers & intersection observers
    const timer = setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
      window.dispatchEvent(new Event("scroll"));
    }, 60);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  const isAssistantPage = location.pathname === "/assistant" || location.pathname === "/chat";

  return (
    <AppErrorBoundary>
      <Cursor />
      {!loaded && <Preloader onComplete={handleLoaded} />}
      <div className="transition-opacity duration-500" style={{ opacity: loaded ? 1 : 0 }}>
        {!isAssistantPage && <Navbar />}
        <main className={isAssistantPage ? "h-[100dvh] w-full overflow-hidden" : "min-h-[85vh]"}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/skills" element={<SkillsPage />} />
            <Route path="/work" element={<WorkPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/assistant" element={<AssistantPage />} />
            <Route path="/chat" element={<AssistantPage />} />
          </Routes>
        </main>
        {!isAssistantPage && <Footer />}
      </div>
      <Analytics />
      <SpeedInsights />
    </AppErrorBoundary>
  );
};

export default App;

