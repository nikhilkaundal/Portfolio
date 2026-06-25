import { useEffect } from "react";

export function useLenis() {
  useEffect(() => {
    let lenis: any;
    let rafId: number;
    let isMounted = true;

    // Dynamically import lenis (ESM)
    import("lenis").then((mod) => {
      if (!isMounted) return;
      const Lenis = mod.default;
      lenis = new Lenis({
        duration: 1.3,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });

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
      
      // If it's a page route hash, let the route state handle it
      if (href.startsWith("#/work") || href.startsWith("#/projects")) {
        return;
      }
      
      // Convert route-style hash section link to standard selector (e.g. #/about -> #about)
      let selector = href;
      if (href.startsWith("#/")) {
        selector = href.replace("#/", "#");
      }
      
      try {
        const dest = document.querySelector(selector);
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
      if (lenis) lenis.destroy();
      document.removeEventListener("click", handleClick);
    };
  }, []);
}
