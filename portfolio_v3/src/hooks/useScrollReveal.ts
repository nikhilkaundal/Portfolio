import { useEffect } from "react";

/**
 * Observes elements with [data-reveal] and adds 'visible' class
 * when they scroll into view. Supports delay via data-reveal-delay attribute.
 * Works with CSS classes: .reveal, .reveal-left, .reveal-scale, .reveal-clip
 */
export function useScrollReveal(selector = "[data-reveal]", trigger: any = null) {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(selector);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const delay = el.dataset.revealDelay;
            if (delay) {
              el.style.animationDelay = delay + "s";
            }
            el.classList.add("visible");
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.1 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [selector, trigger]);
}
