import React, { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { SplineEvent } from "@splinetool/runtime";
import { useTheme } from "../../hooks/useTheme";

// ── Lazy-load Spline runtime ──
// Moves ~800 KB of @splinetool/* into a separate async chunk so it doesn't
// block the main bundle parse and lets critical above-the-fold content
// (hero text, buttons) paint first.
const LazySpline = lazy(() => import("@splinetool/react-spline"));

// Interactive Spline object name constants
export const INTERACTIVE_OBJECTS = {
  COMPUTER: "computer",
} as const;

interface RoomSceneProps {
  onLoad?: (splineApp: any) => void;
  targetObjectName?: string;
}

const RoomScene: React.FC<RoomSceneProps> = React.memo(({
  onLoad,
  targetObjectName = INTERACTIVE_OBJECTS.COMPUTER
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const splineRef = useRef<any>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const navigate = useNavigate();
  const { isDark } = useTheme();

  // ── IntersectionObserver viewport gate ──
  // Defer Spline mount until container is in (or about to enter) the viewport.
  // For the above-fold Hero this fires almost immediately (within the first
  // animation frame), but crucially *after* the browser has had a chance to
  // paint the critical text and buttons — decoupling LCP from Spline parse.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" } // start loading slightly before fully in view
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Sync Spline isDarkMode variable with current theme
  const syncSplineTheme = useCallback((dark: boolean, caller: string) => {
    console.log(`[RoomScene syncSplineTheme] Called by: ${caller}`);
    console.log(`[RoomScene syncSplineTheme] splineRef.current exists: ${!!splineRef.current}`);
    console.log(`[RoomScene syncSplineTheme] Setting isDarkMode to: ${dark} (type: ${typeof dark})`);
    if (splineRef.current) {
      try {
        splineRef.current.setVariable('isDarkMode', dark);
        console.log(`[RoomScene syncSplineTheme] ✅ setVariable('isDarkMode', ${dark}) succeeded`);
      } catch (error) {
        console.warn('[RoomScene syncSplineTheme] ❌ setVariable failed:', error);
      }
    } else {
      console.warn(`[RoomScene syncSplineTheme] ⚠️ SKIPPED — splineRef.current is null (scene not loaded yet)`);
    }
  }, []);

  const handleLoad = (splineApp: any) => {
    splineRef.current = splineApp;
    setIsLoaded(true);

    // Debug: dump all available Spline variables to confirm "isDarkMode" exists
    console.log('[RoomScene handleLoad] 🔍 Spline scene loaded.');
    try {
      const vars = splineApp.getVariables?.();
      console.log('[RoomScene handleLoad] Available Spline variables:', JSON.stringify(vars, null, 2));
    } catch (e) {
      console.log('[RoomScene handleLoad] Could not read variables via getVariables():', e);
    }

    // Set initial dark mode state to match current website theme
    const dataThemeAttr = document.documentElement.getAttribute('data-theme');
    const htmlClassList = document.documentElement.classList.toString();
    const localStorageTheme = localStorage.getItem('theme');
    console.log('[RoomScene handleLoad] DOM data-theme attr:', JSON.stringify(dataThemeAttr));
    console.log('[RoomScene handleLoad] <html> classList:', JSON.stringify(htmlClassList));
    console.log('[RoomScene handleLoad] localStorage theme:', JSON.stringify(localStorageTheme));
    console.log('[RoomScene handleLoad] isDark from useTheme():', isDark);
    console.log('[RoomScene handleLoad] Computed boolean (dataThemeAttr === "dark"):', dataThemeAttr === 'dark');

    syncSplineTheme(dataThemeAttr === 'dark', 'handleLoad');

    if (onLoad) {
      onLoad(splineApp);
    }
  };

  const handleSplineMouseDown = (e: SplineEvent) => {
    if (e.target.name === targetObjectName) {
      navigate("/projects");
    }
  };

  const handleSplineMouseHover = (e: SplineEvent) => {
    if (e.target.name === targetObjectName) {
      if (containerRef.current) {
        containerRef.current.style.cursor = "pointer";
      }
      // Clear any scheduled reset timeout
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
        hoverTimeoutRef.current = null;
      }
    } else {
      // Over other objects: reset instantly
      if (containerRef.current) {
        containerRef.current.style.cursor = "default";
      }
    }
  };

  const handleSplineMouseOut = (e: SplineEvent) => {
    if (e.target.name === targetObjectName) {
      if (containerRef.current) {
        containerRef.current.style.cursor = "default";
      }
    }
  };

  const handleMouseMove = () => {
    // Debounced reset to default. If the cursor is still on the computer, 
    // the next onSplineMouseHover event will clear this timeout.
    if (containerRef.current && containerRef.current.style.cursor === "pointer") {
      if (!hoverTimeoutRef.current) {
        hoverTimeoutRef.current = setTimeout(() => {
          if (containerRef.current) {
            containerRef.current.style.cursor = "default";
          }
          hoverTimeoutRef.current = null;
        }, 50);
      }
    }
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    if (containerRef.current) {
      containerRef.current.style.cursor = "default";
    }
  };

  // React to theme changes from the Navbar toggle (dispatches "themechange" event)
  useEffect(() => {
    const handleThemeChange = () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const localStorageTheme = localStorage.getItem('theme');
      console.log('[RoomScene themechange event] 🔔 "themechange" event fired!');
      console.log('[RoomScene themechange event] DOM data-theme attr:', JSON.stringify(currentTheme));
      console.log('[RoomScene themechange event] localStorage theme:', JSON.stringify(localStorageTheme));
      console.log('[RoomScene themechange event] Computed boolean:', currentTheme === 'dark');
      syncSplineTheme(currentTheme === 'dark', 'themechange-event');
    };
    window.addEventListener('themechange', handleThemeChange);
    return () => window.removeEventListener('themechange', handleThemeChange);
  }, [syncSplineTheme]);

  // Also sync when isDark changes (covers initial render race conditions)
  useEffect(() => {
    console.log('[RoomScene isDark useEffect] isDark value changed to:', isDark);
    console.log('[RoomScene isDark useEffect] isLoaded:', isLoaded);
    syncSplineTheme(isDark, 'isDark-useEffect');
  }, [isDark, syncSplineTheme]);

  useEffect(() => {
    // Cleanup WebGL contexts on component unmount to prevent memory leaks and browser crash
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      if (splineRef.current) {
        console.log("Disposing Spline WebGL context...");
        try {
          splineRef.current.dispose();
        } catch (error) {
          console.error("Failed to dispose Spline WebGL context:", error);
        }
      }
    };
  }, []);

  const sceneUrl =
    process.env.REACT_APP_SPLINE_SCENE_URL ||
    process.env.NEXT_PUBLIC_SPLINE_SCENE_URL ||
    "https://prod.spline.design/wE2djS2PkGrlqcom/scene.splinecode";

  console.log("Resolved Spline Scene URL:", sceneUrl);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="w-full h-full relative pointer-events-auto overflow-visible transition-opacity duration-700 ease-out"
      style={{
        opacity: isLoaded ? 1 : 0,
        willChange: "transform",
        transform: "translateZ(0)",
      }}
    >
      {isInView && (
        <Suspense fallback={null}>
          <LazySpline
            scene={sceneUrl}
            onLoad={handleLoad}
            style={{ width: "100%", height: "100%" }}
            onSplineMouseDown={handleSplineMouseDown}
            onSplineMouseHover={handleSplineMouseHover}
            {...({ onSplineMouseOut: handleSplineMouseOut } as any)}
          />
        </Suspense>
      )}
    </div>
  );
});

export default RoomScene;
