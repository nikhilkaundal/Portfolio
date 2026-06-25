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
      {/* Hidden SVG for the gooey liquid mercury 3D specular chrome filter */}
      <svg xmlns="http://www.w3.org/2000/svg" version="1.1" style={{ display: "none" }}>
        <defs>
          <filter id="gooey-cursor">
            {/* 1. Gooey blur and alpha threshold to merge shapes into organic blobs */}
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
              result="goo"
            />
            
            {/* 2. Create heightmap from gooey alpha channel for 3D normals */}
            <feGaussianBlur in="goo" stdDeviation="2.5" result="heightField" />
            
            {/* 3. Specular lighting for realistic metallic highlights */}
            <feSpecularLighting
              in="heightField"
              specularExponent="30"
              specularConstant="1.6"
              surfaceScale="5"
              lighting-color="#ffffff"
              result="specular"
            >
              <feDistantLight azimuth="225" elevation="50" />
            </feSpecularLighting>
            
            {/* 4. Base liquid metal color fill */}
            <feFlood flood-color="#606668" result="metal-color" />
            <feComposite in="metal-color" in2="goo" operator="in" result="colored-goo" />
            
            {/* 5. Blend specular highlights with base shape */}
            <feComposite in="specular" in2="goo" operator="in" result="specular-clipped" />
            <feBlend in="specular-clipped" in2="colored-goo" mode="screen" />
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
