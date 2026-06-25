import { useEffect, useRef } from "react";

export function useCursor() {
  const spotlightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mx = 0, my = 0; // Mouse coordinates
    let rx = 0, ry = 0; // Spotlight trailing coordinates
    let currentOpacity = 0.11; // Spotlight opacity
    let currentSize = 260; // Spotlight size (width & height)

    let hoveredEl: HTMLElement | null = null;

    let targetX = 0, targetY = 0;
    let targetOpacity = 0.11;
    let targetSize = 260;

    let animId: number;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
    };

    document.addEventListener("mousemove", onMove);

    const handleMouseOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest(
        "a, button, .skill-pill, .magnetic-btn, [role='button'], input, textarea, .hover-magnetic"
      );
      if (target) {
        hoveredEl = target as HTMLElement;
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest(
        "a, button, .skill-pill, .magnetic-btn, [role='button'], input, textarea, .hover-magnetic"
      );
      const relatedTarget = e.relatedTarget as HTMLElement | null;
      const isStillInSameTarget = relatedTarget && target && target.contains(relatedTarget);
      
      if (target && !isStillInSameTarget && hoveredEl === target) {
        hoveredEl = null;
      }
    };

    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseout", handleMouseOut);

    const loop = () => {
      // 1. Determine target variables
      if (hoveredEl) {
        const rect = hoveredEl.getBoundingClientRect();
        
        // Center of target element
        const bx = rect.left + rect.width / 2;
        const by = rect.top + rect.height / 2;
        
        // Magnetic snap with soft resistance offset (allows cursor to float within the button)
        targetX = bx + (mx - bx) * 0.35;
        targetY = by + (my - by) * 0.35;
        
        targetOpacity = 0.28; // Concentrated brightness (28% opacity)
        targetSize = 320; // Enlarged light radius
      } else {
        targetX = mx;
        targetY = my;
        targetOpacity = 0.11; // Softer default glow (11% opacity)
        targetSize = 260; // Normal light radius
      }

      // 2. Smoothly interpolate coordinates using lerp (lower = smoother/more delay)
      rx += (targetX - rx) * 0.08;
      ry += (targetY - ry) * 0.08;
      
      // Easing size and opacity transitions
      currentSize += (targetSize - currentSize) * 0.08;
      currentOpacity += (targetOpacity - currentOpacity) * 0.08;

      // 3. Apply style transform directly to DOM for GPU acceleration
      if (spotlightRef.current) {
        spotlightRef.current.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
        spotlightRef.current.style.width = `${currentSize}px`;
        spotlightRef.current.style.height = `${currentSize}px`;
        spotlightRef.current.style.opacity = currentOpacity.toString();
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
      cancelAnimationFrame(animId);
    };
  }, []);

  return { spotlightRef };
}
