import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Spline from "@splinetool/react-spline";
import type { SplineEvent } from "@splinetool/runtime";

// Resolved once from env at module load — never changes at runtime
const SCENE_URL =
  process.env.REACT_APP_SPLINE_SCENE_URL ||
  process.env.NEXT_PUBLIC_SPLINE_SCENE_URL ||
  "https://prod.spline.design/Sl5IZaek3stpaL-m/scene.splinecode";

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
  onError?: (error: any) => void;
  targetObjectName?: string;
}

const RoomScene: React.FC<RoomSceneProps> = React.memo(({
  onLoad,
  onError,
  targetObjectName = "computer"
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const splineRef = useRef<any>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
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
      if (rect.width > 0 && rect.height > 0) {
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;

        if (typeof splineApp.setSize === "function") {
          splineApp.setSize(rect.width, rect.height);
        }
      }
    }
  }, []);

  // Listen for window resize events to maintain crisp resolution and correct canvas aspect ratio.
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

  // Sync Spline theme variables and object states with current website theme
  const syncSplineTheme = useCallback((dark: boolean) => {
    const app = splineRef.current;
    if (!app) return;

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

    syncCanvasResolution();

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

    const dataThemeAttr = document.documentElement.getAttribute('data-theme');
    syncSplineTheme(dataThemeAttr === 'dark');

    if (onLoad) {
      onLoad(splineApp);
    }
  };

  const handleError = (err: any) => {
    console.error("[Spline Load Error]:", err);
    setHasError(true);
    if (onError) {
      onError(err);
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
    console.log("[Spline Debug] Raw e.target.name clicked:", name, "Parent name:", parentName);

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
      navigate("/projects");
    } else if (isFootball) {
      const skillsEl = document.getElementById("skills");
      if (skillsEl) {
        skillsEl.scrollIntoView({ behavior: "smooth" });
      } else {
        navigate("/skills");
      }
    } else if (isMan) {
      const aboutEl = document.getElementById("about");
      if (aboutEl) {
        aboutEl.scrollIntoView({ behavior: "smooth" });
      } else {
        navigate("/about");
      }
    } else if (INTERACTIVE_OBJECTS.TELEPHONE.includes(name as any)) {
      const contactEl = document.getElementById("contact");
      if (contactEl) {
        contactEl.scrollIntoView({ behavior: "smooth" });
      } else {
        navigate("/about");
      }
    } else if (INTERACTIVE_OBJECTS.VIDEO_UI.includes(name as any)) {
      const expEl = document.getElementById("experience");
      if (expEl) {
        expEl.scrollIntoView({ behavior: "smooth" });
      } else {
        navigate("/work");
      }
    } else if (INTERACTIVE_OBJECTS.CD.includes(name as any)) {
      window.dispatchEvent(new CustomEvent("toggle-music"));
    }
  };

  const handleSplineMouseHover = (e: SplineEvent) => {
    if (INTERACTIVE_OBJECTS_LIST.includes(e.target.name)) {
      if (containerRef.current) {
        containerRef.current.style.cursor = "pointer";
      }
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
        hoverTimeoutRef.current = null;
      }
    } else {
      if (containerRef.current) {
        containerRef.current.style.cursor = "default";
      }
    }
  };

  const handleMouseMove = () => {
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

  useEffect(() => {
    const handleThemeChange = () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      syncSplineTheme(currentTheme === 'dark');
    };
    window.addEventListener('themechange', handleThemeChange);
    return () => window.removeEventListener('themechange', handleThemeChange);
  }, [syncSplineTheme]);

  useEffect(() => {
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

  if (hasError) return null;

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
      <Spline
        scene={SCENE_URL}
        onLoad={handleLoad}
        onError={handleError}
        style={{ width: "100%", height: "100%", background: "transparent" }}
        onSplineMouseDown={handleSplineMouseDown}
        onSplineMouseHover={handleSplineMouseHover}
      />
    </div>
  );
});

export default RoomScene;
