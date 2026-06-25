import React, { useEffect, useState } from "react";
import { useCursor } from "../../hooks/useCursor";

const Cursor: React.FC = () => {
  const { spotlightRef } = useCursor();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Hide spotlight on touch devices/mobile viewports
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

  return <div ref={spotlightRef} className="cursor-spotlight" />;
};

export default Cursor;
