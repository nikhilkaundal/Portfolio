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
      {/* Hidden SVG for the gooey liquid / metaball effect threshold filter */}
      <svg xmlns="http://www.w3.org/2000/svg" version="1.1" style={{ display: "none" }}>
        <defs>
          <filter id="gooey-cursor">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8"
              result="goo"
            />
            <feBlend in="SourceGraphic" in2="goo" />
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
