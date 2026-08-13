import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function useLenis() {
  const location = useLocation();

  useEffect(() => {
    const lenis = (window as any).__lenis;
    const isAssistant = location.pathname === "/assistant" || location.pathname === "/chat";

    if (isAssistant) {
      if (lenis) lenis.stop();
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      if (lenis) lenis.start();
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [location.pathname]);

  useEffect(() => {
    let lenis: any;
    let rafId: number;
    let isMounted = true;

    // Dynamically import lenis (ESM)
    import("lenis").then((mod) => {
      if (!isMounted) return;
      const Lenis = mod.default;
      lenis = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });

      (window as any).__lenis = lenis;

      const raf = (time: number) => {
        if (!isMounted) return;
        lenis.raf(time);
        rafId = requestAnimationFrame(raf);
      };
      rafId = requestAnimationFrame(raf);
    });

    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a[href^="#"]') as HTMLAnchorElement | null;
      if (!target || !lenis) return;
      
      const href = target.getAttribute("href")!;
      if (href === "#") return;
      
      try {
        const dest = document.querySelector(href);
        if (dest) {
          e.preventDefault();
          lenis.scrollTo(dest as HTMLElement, { offset: -80 });
        }
      } catch (err) {
        // Ignore invalid selectors
      }
    };
    document.addEventListener("click", handleClick);

    return () => {
      isMounted = false;
      if (rafId) cancelAnimationFrame(rafId);
      if (lenis) {
        delete (window as any).__lenis;
        lenis.destroy();
      }
      document.removeEventListener("click", handleClick);
    };
  }, []);
}
