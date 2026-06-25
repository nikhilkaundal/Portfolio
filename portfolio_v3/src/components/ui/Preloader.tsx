import React, { useEffect, useState, useRef } from "react";
import gsap from "gsap";

interface PreloaderProps {
  onComplete: () => void;
}

/* ── Scramble text effect ── */
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&";
function useScrambleText(finalText: string, startDelay = 200, duration = 800) {
  const [display, setDisplay] = useState(finalText.replace(/./g, " "));
  const started = useRef(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      started.current = true;
      const len = finalText.length;
      const perChar = duration / len;
      let resolved = 0;

      const iv = setInterval(() => {
        resolved++;
        if (resolved > len) {
          clearInterval(iv);
          setDisplay(finalText);
          return;
        }
        let s = "";
        for (let i = 0; i < len; i++) {
          if (finalText[i] === " ") { s += " "; continue; }
          s += i < resolved
            ? finalText[i]
            : CHARS[Math.floor(Math.random() * CHARS.length)];
        }
        setDisplay(s);
      }, perChar);

      return () => clearInterval(iv);
    }, startDelay);
    return () => clearTimeout(timeout);
  }, [finalText, startDelay, duration]);

  return display;
}

const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const name = useScrambleText("NIKHIL KAUNDAL", 300, 900);

  useEffect(() => {
    const tl = gsap.timeline({
      delay: 1.8,
      onComplete,
    });

    // Split curtains apart
    tl.to(".pre-name", { opacity: 0, scale: 1.1, duration: 0.4, ease: "power2.in" })
      .to(".pre-left",  { xPercent: -100, duration: 0.8, ease: "power3.inOut" }, "-=0.1")
      .to(".pre-right", { xPercent: 100,  duration: 0.8, ease: "power3.inOut" }, "<");
  }, [onComplete]);

  return (
    <div id="preloader" className="fixed inset-0 z-[9500]">
      {/* Left curtain */}
      <div className="pre-left absolute top-0 left-0 w-1/2 h-full bg-night" />
      {/* Right curtain */}
      <div className="pre-right absolute top-0 right-0 w-1/2 h-full bg-night" />

      {/* Center content */}
      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
        <div className="pre-name text-center">
          <p
            className="font-display font-light tracking-[0.2em] text-bark"
            style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)" }}
          >
            {name.split(" ")[0]}
            <span className="text-amber">.</span>
          </p>
          <p
            className="font-display italic font-light tracking-[0.15em] text-amber/70 mt-1"
            style={{ fontSize: "clamp(1rem, 2vw, 1.4rem)" }}
          >
            {name.split(" ").slice(1).join(" ")}
          </p>
          <div className="mt-6 mx-auto w-16 h-px bg-gradient-to-r from-transparent via-amber/50 to-transparent" />
        </div>
      </div>
    </div>
  );
};

export default Preloader;
