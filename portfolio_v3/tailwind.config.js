/** @type {import('tailwindcss').Config} */
function withOpacity(variableName) {
  return ({ opacityValue }) => {
    if (opacityValue !== undefined) {
      return `rgba(var(${variableName}), ${opacityValue})`;
    }
    return `rgb(var(${variableName}))`;
  };
}

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        night: {
          DEFAULT: withOpacity('--night-rgb'),
          light: withOpacity('--night-light-rgb'),
        },
        surface: {
          DEFAULT: withOpacity('--surface-rgb'),
          light: withOpacity('--surface-light-rgb'),
          dark: withOpacity('--surface-dark-rgb'),
        },
        amber: {
          DEFAULT: withOpacity('--amber-rgb'),
          dark: withOpacity('--amber-dark-rgb'),
          glow: withOpacity('--amber-glow-rgb'),
          muted: withOpacity('--amber-muted-rgb'),
        },
        bark: {
          DEFAULT: withOpacity('--bark-rgb'),
          muted: withOpacity('--bark-muted-rgb'),
          dim: withOpacity('--bark-dim-rgb'),
        },
        cream: withOpacity('--cream-rgb'),
        ivory: withOpacity('--ivory-rgb'),
        
        // Skills specific classes mapped to CSS variables
        skills: {
          bg: 'var(--skills-bg)',
          bgInactive: 'var(--skills-bg)',
          bgActive: 'var(--skills-accent-bg)',
          borderInactive: 'var(--skills-border)',
          borderHover: 'var(--skills-border-hover)',
          borderActive: 'var(--skills-accent)',
          white: 'var(--skills-text-white)',
          muted: 'var(--skills-text-muted)',
          dark: 'var(--skills-private-text)',
          darker: 'var(--skills-private-subtext)',
        },
        
        // Mockups specific classes mapped to CSS variables
        mock: {
          bg: 'var(--mock-bg)',
          surface: 'var(--mock-surface)',
          surfaceLight: 'var(--mock-surface-light)',
          border: 'var(--mock-border)',
          borderLight: 'var(--mock-border-light)',
        }
      },
      fontFamily: {
        display: ["'Cormorant Garamond'", "Georgia", "serif"],
        body:    ["'DM Sans'", "system-ui", "sans-serif"],
        mono:    ["'Space Mono'", "monospace"],
      },
      letterSpacing: { widest2: "0.3em" },
      animation: {
        marquee:      "marquee 28s linear infinite",
        marqueeRev:   "marqueeRev 34s linear infinite",
        grain:        "grain 6s steps(1) infinite",
        "fade-up":    "fadeUp 0.8s ease forwards",
        "slide-left": "slideLeft 0.9s cubic-bezier(.19,1,.22,1) forwards",
        "scale-in":   "scaleIn 0.7s cubic-bezier(.19,1,.22,1) forwards",
        "clip-up":    "clipUp 1s cubic-bezier(.19,1,.22,1) forwards",
        "glow-pulse": "glowPulse 3s ease-in-out infinite",
        "float-y":    "floatY 6s ease-in-out infinite",
        "border-glow":"borderGlow 3s ease-in-out infinite",
      },
      keyframes: {
        marquee:      { "0%": { transform: "translateX(0)" },    "100%": { transform: "translateX(-50%)" } },
        marqueeRev:   { "0%": { transform: "translateX(-50%)" }, "100%": { transform: "translateX(0)"   } },
        grain: {
          "0%, 100%": { backgroundPosition: "0 0" },
          "10%": { backgroundPosition: "-5% -10%" },
          "20%": { backgroundPosition: "-15% 5%" },
          "30%": { backgroundPosition: "7% -25%" },
          "40%": { backgroundPosition: "-5% 25%" },
          "50%": { backgroundPosition: "-15% 10%" },
          "60%": { backgroundPosition: "15% 0%" },
          "70%": { backgroundPosition: "0% 15%" },
          "80%": { backgroundPosition: "3% 35%" },
          "90%": { backgroundPosition: "-10% 10%" },
        },
        fadeUp:     { from: { opacity: "0", transform: "translateY(24px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        slideLeft:  { from: { opacity: "0", transform: "translateX(-60px)" }, to: { opacity: "1", transform: "translateX(0)" } },
        scaleIn:    { from: { opacity: "0", transform: "scale(0.85)" }, to: { opacity: "1", transform: "scale(1)" } },
        clipUp:     { from: { clipPath: "inset(100% 0 0 0)" }, to: { clipPath: "inset(0 0 0 0)" } },
        glowPulse:  { "0%, 100%": { boxShadow: "0 0 20px rgba(192,88,0,0.15)" }, "50%": { boxShadow: "0 0 40px rgba(255,122,26,0.3)" } },
        floatY:     { "0%, 100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-12px)" } },
        borderGlow: { "0%, 100%": { borderColor: "rgba(192,88,0,0.15)" }, "50%": { borderColor: "rgba(255,122,26,0.4)" } },
      },
    },
  },
  plugins: [],
};
