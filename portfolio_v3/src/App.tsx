import React, { useState, useEffect, useCallback } from "react";
import "./index.css";

// Layout
import Navbar   from "./components/layout/Navbar";
import Footer   from "./components/layout/Footer";

// UI
import Cursor    from "./components/ui/Cursor";
import Preloader from "./components/ui/Preloader";
import Marquee   from "./components/ui/Marquee";

// Sections
import Hero       from "./components/sections/Hero";
import About      from "./components/sections/About";
import Skills     from "./components/sections/Skills";
import Experience from "./components/sections/Experience";
import Projects   from "./components/sections/Projects";
import Contact    from "./components/sections/Contact";

// Hooks
import { useLenis }        from "./hooks/useLenis";
import { useScrollReveal } from "./hooks/useScrollReveal";

const App: React.FC = () => {
  const [loaded, setLoaded] = useState(false);
  const [route, setRoute] = useState<"home" | "work" | "projects">("home");
  
  // Transition state
  const [transitioning, setTransitioning] = useState(false);
  const [activeRoute, setActiveRoute] = useState<"home" | "work" | "projects">("home");

  const handleLoaded = useCallback(() => setLoaded(true), []);

  useLenis();
  useScrollReveal("[data-reveal]", activeRoute);

  // Reset hash to top on page refresh/initial mount for home sections
  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash !== "#/" && !hash.startsWith("#/work") && !hash.startsWith("#/projects")) {
      window.location.hash = "#/";
    }
  }, []);

  // Hash listener for custom routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith("#/work")) {
        setRoute("work");
      } else if (hash.startsWith("#/projects")) {
        setRoute("projects");
      } else {
        setRoute("home");
        // Scroll navigation on home page sections
        if (hash === "#/about" || hash === "#/skills" || hash === "#/contact" || hash === "#/hero") {
          const id = hash.replace("#/", "");
          setTimeout(() => {
            const dest = document.getElementById(id);
            if (dest) {
              dest.scrollIntoView({ behavior: "smooth" });
            }
          }, 100);
        }
      }
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Handle route change transition
  useEffect(() => {
    if (route !== activeRoute) {
      setTransitioning(true);
      const timer = setTimeout(() => {
        window.scrollTo({ top: 0 });
        setActiveRoute(route);
        setTransitioning(false);
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [route, activeRoute]);

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
            {activeRoute === "home" && (
              <>
                <Hero />
                <Marquee />
                <div className="divider-warm" />
                <About />
                <div className="divider-warm" />
                <Skills />
                <div className="divider-warm" />
                <Contact />
              </>
            )}

            {activeRoute === "work" && (
              <>
                <Experience />
                <div className="divider-warm" />
                <Contact />
              </>
            )}

            {activeRoute === "projects" && (
              <>
                <Projects />
                <div className="divider-warm" />
                <Contact />
              </>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default App;
