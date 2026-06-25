import React, { useEffect, useState } from "react";
import { useCursor } from "../../hooks/useCursor";

const Cursor: React.FC = () => {
  const { dotRef, ringRef, wrapperRef, dropletsRef } = useCursor();
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

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  if (isMobile) return null;

  return (
    <>
      {/* Hidden SVG container - styled to remain in layout so filters compile, but invisible to user */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
        style={{ position: "absolute", width: 0, height: 0, pointerEvents: "none", opacity: 0 }}
      >
        <defs>
          <filter id="gooey-cursor" x="-50%" y="-50%" width="200%" height="200%">
            {/* 1. Blur and threshold to create the organic liquid merging mask */}
            <feGaussianBlur in="SourceGraphic" stdDeviation="4.5" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
              result="goo"
            />
            {/* 2. Composite the sharp SourceGraphic (with its chrome gradient) on top of the gooey mask */}
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      {/* The precision core dot remains sharp outside the gooey filter */}
      <div ref={dotRef} className="cursor-dot" />

      {/* Ring and droplets merge inside the gooey wrapper */}
      <div ref={wrapperRef} className="cursor-wrapper">
        <div ref={ringRef} className="cursor-ring" />
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            ref={(el) => {
              if (dropletsRef.current) {
                dropletsRef.current[i] = el;
              }
            }}
            className="cursor-droplet"
          />
        ))}
      </div>
    </>
  );
};

export default Cursor;
