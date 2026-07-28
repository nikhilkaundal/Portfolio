import React, { useState, useEffect, useCallback } from "react";
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

// Hooks
import { useLenis }        from "./hooks/useLenis";
import { useScrollReveal } from "./hooks/useScrollReveal";

const App: React.FC = () => {
  const [loaded, setLoaded] = useState(false);
  const location = useLocation();

  const handleLoaded = useCallback(() => setLoaded(true), []);

  useLenis();
  useScrollReveal("[data-reveal]", location.pathname);

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

  return (
    <>
      <Cursor />
      {!loaded && <Preloader onComplete={handleLoaded} />}
      <div className="transition-opacity duration-500" style={{ opacity: loaded ? 1 : 0 }}>
        <Navbar />
        <main className="min-h-[85vh]">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/skills" element={<SkillsPage />} />
            <Route path="/work" element={<WorkPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
      <Analytics />
      <SpeedInsights />
    </>
  );
};

export default App;
