import React, { useEffect, useState } from "react";
import { useCursor } from "../../hooks/useCursor";

const Cursor: React.FC = () => {
  const { dotRef, ringRef } = useCursor();
  const [expanded, setExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Hide cursor on touch devices/mobile viewports
    const checkMobile = () => {
      const hasTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
      const isSmallScreen = window.innerWidth <= 768;
      setIsMobile(hasTouch || isSmallScreen);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        target.closest("a, button, .tilt-card, .skill-pill, .magnetic-btn, .project-card, [role='button'], input, textarea")
      ) {
        setExpanded(true);
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const relatedTarget = e.relatedTarget as HTMLElement | null;

      const wasInteractable =
        target &&
        target.closest("a, button, .tilt-card, .skill-pill, .magnetic-btn, .project-card, [role='button'], input, textarea");
      const isStillInteractable =
        relatedTarget &&
        relatedTarget.closest("a, button, .tilt-card, .skill-pill, .magnetic-btn, .project-card, [role='button'], input, textarea");

      if (wasInteractable && !isStillInteractable) {
        setExpanded(false);
      }
    };

    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseout", handleMouseOut);

    return () => {
      window.removeEventListener("resize", checkMobile);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
    };
  }, []);

  if (isMobile) return null;

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className={`cursor-ring ${expanded ? "expand" : ""}`} />
    </>
  );
};

export default Cursor;
