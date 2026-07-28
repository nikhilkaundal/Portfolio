import React, { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { SplineEvent } from "@splinetool/runtime";

// ── Lazy-load Spline runtime ──
// Moves ~800 KB of @splinetool/* into a separate async chunk so it doesn't
// block the main bundle parse and lets critical above-the-fold content
// (hero text, buttons) paint first.
const LazySpline = lazy(() => import("@splinetool/react-spline"));

// Resolved once from env at module load — never changes at runtime
const SCENE_URL =
  process.env.REACT_APP_SPLINE_SCENE_URL ||
  process.env.NEXT_PUBLIC_SPLINE_SCENE_URL ||
  "https://prod.spline.design/wE2djS2PkGrlqcom/scene.splinecode";

// Interactive Spline object name constants (supporting both the 3D models and their text labels)
export const INTERACTIVE_OBJECTS = {
  COMPUTER: ["computer", "Projects", "projects"],
  FOOTBALL: ["Americanfootball", "AmericanFootball", "ball", "Ball", "Skills", "skills"],
  TELEPHONE: ["Telephone", "Contact", "contact", "telephone"],
  VIDEO_UI: ["video-ui", "Work", "work", "experience"],
  CD: ["cd-4", "CD", "cd"],
  MAN: ["Man Sit", "Man", "man", "man-sit", "man_sit", "About Me", "About me", "AboutMe", "about-me", "About", "about", "headphones", "chair", "shoes", "shoe", "Text"]
} as const;

const INTERACTIVE_OBJECTS_LIST: readonly string[] = Object.values(INTERACTIVE_OBJECTS).flat() as string[];

interface RoomSceneProps {
  onLoad?: (splineApp: any) => void;
  targetObjectName?: string;
}

const RoomScene: React.FC<RoomSceneProps> = React.memo(({
  onLoad,
  targetObjectName = "computer"
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const splineRef = useRef<any>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const navigate = useNavigate();

  // Shared function to synchronize canvas drawing buffer resolution with devicePixelRatio
  // and force the canvas background to transparent.
  const syncCanvasResolution = useCallback(() => {
    const splineApp = splineRef.current;
    if (!splineApp) return;

    const canvas = splineApp.canvas || containerRef.current?.querySelector("canvas");
    if (canvas) {
      canvas.style.setProperty("background", "transparent", "important");

      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      if (typeof splineApp.setSize === "function") {
        splineApp.setSize(rect.width, rect.height);
      }
    }
  }, []);

  // Listen for window resize events to maintain crisp resolution and correct canvas aspect ratio.
  // Debounced to 150ms to avoid excessive recalculation during drag-resize.
  useEffect(() => {
    let resizeTimer: NodeJS.Timeout | null = null;
    const debouncedResize = () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(syncCanvasResolution, 150);
    };
    window.addEventListener("resize", debouncedResize);
    return () => {
      window.removeEventListener("resize", debouncedResize);
      if (resizeTimer) clearTimeout(resizeTimer);
    };
  }, [syncCanvasResolution]);

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

  // Sync Spline theme variables and object states with current website theme
  const syncSplineTheme = useCallback((dark: boolean) => {
    const app = splineRef.current;
    if (!app) return;

    console.log("[Spline Theme Sync] Setting theme dark =", dark);

    // 1. Set Spline variables in all formats (boolean, numeric 1/0, string)
    try {
      if (typeof app.setVariable === 'function') {
        app.setVariable('isDarkMode', dark);
        app.setVariable('isDarkMode', dark ? 1 : 0);
        app.setVariable('isDarkMode', dark ? 'true' : 'false');

        app.setVariable('isDark', dark);
        app.setVariable('isDark', dark ? 1 : 0);

        app.setVariable('theme', dark ? 'dark' : 'light');
      }
    } catch (e) {
      console.warn("[Spline Theme Sync] Could not setVariable on Spline app:", e);
    }

    // 2. Trigger events on Walls object for state transition
    try {
      if (typeof app.emitEvent === 'function') {
        app.emitEvent('variableChange', 'isDarkMode');
        app.emitEvent('variableChange', 'Walls');

        if (dark) {
          app.emitEvent('mouseDown', 'Walls');
          app.emitEvent('keyDown', 'Walls');
          app.emitEvent('themeDark', 'Walls');
          app.emitEvent('dark', 'Walls');
          app.emitEvent('Dark', 'Walls');
        } else {
          app.emitEvent('mouseUp', 'Walls');
          app.emitEvent('keyUp', 'Walls');
          app.emitEvent('themeLight', 'Walls');
          app.emitEvent('base', 'Walls');
          app.emitEvent('Base State', 'Walls');
          app.emitEvent('Base', 'Walls');
          app.emitEvent('light', 'Walls');
          app.emitEvent('Light', 'Walls');
        }
      }
    } catch (e) {
      console.warn("[Spline Theme Sync] Could not emitEvent on Spline app:", e);
    }
  }, []);

  const handleLoad = (splineApp: any) => {
    splineRef.current = splineApp;
    setIsLoaded(true);

    // Synchronize resolution and enforce transparent background on the canvas
    syncCanvasResolution();

    // Force clearAlpha to 0 if renderer is available to override spline-runtime default fills
    if (splineApp) {
      const renderer = splineApp.renderer || splineApp._renderer;
      if (renderer && typeof renderer.setClearAlpha === "function") {
        try {
          renderer.setClearAlpha(0);
        } catch {
          // Renderer may not support setClearAlpha in all Spline versions
        }
      }
    }

    // Set initial dark mode state to match current website theme
    const dataThemeAttr = document.documentElement.getAttribute('data-theme');
    syncSplineTheme(dataThemeAttr === 'dark');

    if (onLoad) {
      onLoad(splineApp);
    }
  };

  // Continuously remove/hide Spline logo watermark badge from DOM & Shadow DOM
  useEffect(() => {
    const removeWatermark = () => {
      const selectors = [
        'a[href*="spline.design"]',
        '#spline-logo',
        '#logo',
        '.spline-watermark',
        '.spline-logo',
        'a[target="_blank"][href*="spline"]',
        'div[class*="watermark"]'
      ];
      selectors.forEach((selector) => {
        document.querySelectorAll(selector).forEach((el) => {
          (el as HTMLElement).style.setProperty('display', 'none', 'important');
          (el as HTMLElement).style.setProperty('opacity', '0', 'important');
          (el as HTMLElement).style.setProperty('pointer-events', 'none', 'important');
          (el as HTMLElement).style.setProperty('visibility', 'hidden', 'important');
        });
      });

      // Search inside shadowRoots of any spline-viewer or custom elements
      document.querySelectorAll('spline-viewer').forEach((viewer) => {
        if (viewer.shadowRoot) {
          const shadowElements = viewer.shadowRoot.querySelectorAll('a, #logo, #spline-logo, .watermark, [href*="spline"]');
          shadowElements.forEach((el) => {
            (el as HTMLElement).style.setProperty('display', 'none', 'important');
            (el as HTMLElement).style.setProperty('opacity', '0', 'important');
            (el as HTMLElement).style.setProperty('pointer-events', 'none', 'important');
            (el as HTMLElement).style.setProperty('visibility', 'hidden', 'important');
          });
        }
      });
    };

    removeWatermark();
    const interval = setInterval(removeWatermark, 200);
    return () => clearInterval(interval);
  }, []);

  const handleSplineMouseDown = (e: SplineEvent) => {
    const name = e.target.name;
    const parentName = (e.target as any)?.parent?.name || (e.target as any)?.parentNode?.name;
    console.log("[Spline Debug] Raw e.target.name clicked:", name, "Parent name:", parentName, "Full target object:", e.target);

    const isFootball =
      INTERACTIVE_OBJECTS.FOOTBALL.includes(name as any) ||
      name === "ball" ||
      name === "Ball" ||
      name === "Americanfootball" ||
      parentName === "Americanfootball" ||
      parentName === "AmericanFootball";

    const isMan =
      INTERACTIVE_OBJECTS.MAN.includes(name as any) ||
      parentName === "Man Sit" ||
      parentName === "man" ||
      parentName === "man-sit" ||
      parentName === "man_sit";

    if (INTERACTIVE_OBJECTS.COMPUTER.includes(name as any)) {
      // Navigate to Projects page
      navigate("/projects");
    } else if (isFootball) {
      // Scroll to Skills section, or navigate to /skills if not on this page
      const skillsEl = document.getElementById("skills");
      if (skillsEl) {
        skillsEl.scrollIntoView({ behavior: "smooth" });
      } else {
        navigate("/skills");
      }
    } else if (isMan) {
      // Scroll to About section, or navigate to /about if not on this page
      const aboutEl = document.getElementById("about");
      if (aboutEl) {
        aboutEl.scrollIntoView({ behavior: "smooth" });
      } else {
        navigate("/about");
      }
    } else if (INTERACTIVE_OBJECTS.TELEPHONE.includes(name as any)) {
      // Scroll to Contact section, or navigate to /about if not on this page
      const contactEl = document.getElementById("contact");
      if (contactEl) {
        contactEl.scrollIntoView({ behavior: "smooth" });
      } else {
        navigate("/about");
      }
    } else if (INTERACTIVE_OBJECTS.VIDEO_UI.includes(name as any)) {
      // Scroll to Experience (Work) section, or navigate to /work if not on this page
      const expEl = document.getElementById("experience");
      if (expEl) {
        expEl.scrollIntoView({ behavior: "smooth" });
      } else {
        navigate("/work");
      }
    } else if (INTERACTIVE_OBJECTS.CD.includes(name as any)) {
      // Toggle background music via custom event (received by MusicPlayer)
      window.dispatchEvent(new CustomEvent("toggle-music"));
    }
  };

  const handleSplineMouseHover = (e: SplineEvent) => {
    if (INTERACTIVE_OBJECTS_LIST.includes(e.target.name)) {
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
      syncSplineTheme(currentTheme === 'dark');
    };
    window.addEventListener('themechange', handleThemeChange);
    return () => window.removeEventListener('themechange', handleThemeChange);
  }, [syncSplineTheme]);

  useEffect(() => {
    // Cleanup WebGL contexts on component unmount to prevent memory leaks and browser crash
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      if (splineRef.current) {
        try {
          splineRef.current.dispose();
        } catch (error) {
          console.error("Failed to dispose Spline WebGL context:", error);
        }
      }
    };
  }, []);

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
        background: "transparent",
      }}
    >
      {isInView && (
        <Suspense fallback={null}>
          <LazySpline
            scene={SCENE_URL}
            onLoad={handleLoad}
            style={{ width: "100%", height: "100%", background: "transparent" }}
            onSplineMouseDown={handleSplineMouseDown}
            onSplineMouseHover={handleSplineMouseHover}
          />
        </Suspense>
      )}
    </div>
  );
});

export default RoomScene;
