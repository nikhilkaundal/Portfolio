import React, { useState, useEffect, useCallback } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
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
  
  // Transition state
  const [transitioning, setTransitioning] = useState(false);
  const [displayLocation, setDisplayLocation] = useState(location);

  const handleLoaded = useCallback(() => setLoaded(true), []);

  useLenis();
  useScrollReveal("[data-reveal]", displayLocation.pathname);

  // Handle route change transition
  useEffect(() => {
    if (location.pathname !== displayLocation.pathname) {
      setTransitioning(true);
      const timer = setTimeout(() => {
        window.scrollTo({ top: 0 });
        setDisplayLocation(location);
        setTransitioning(false);
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [location, displayLocation]);

  return (
    <>
      <Cursor />
      {!loaded && <Preloader onComplete={handleLoaded} />}
      <div className="transition-opacity duration-700" style={{ opacity: loaded ? 1 : 0 }}>
        <Navbar />
        <main className="min-h-[85vh]">
          <div 
            className={`transition-all duration-300 transform-gpu
              ${transitioning ? "opacity-0 translate-y-3 blur-[2px]" : "opacity-100 translate-y-0 blur-0"}`}
          >
            <Routes location={displayLocation}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/skills" element={<SkillsPage />} />
              <Route path="/work" element={<WorkPage />} />
              <Route path="/projects" element={<ProjectsPage />} />
            </Routes>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default App;

