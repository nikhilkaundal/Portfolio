import React, { useCallback } from "react";

const Footer: React.FC = () => {
  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <footer className="relative border-t border-white/5 px-8 md:px-16 py-8 flex flex-col md:flex-row items-center justify-between bg-night gap-4">
      {/* Top Border Glow Accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-amber/30 to-transparent" />

      <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6">
        <span className="font-mono text-[0.65rem] tracking-[0.12em] text-bark/45">
          © {new Date().getFullYear()} NIKHIL KAUNDAL
        </span>
        <span className="hidden sm:inline text-bark/20 text-[0.65rem]">•</span>
        <span className="font-mono text-[0.65rem] tracking-[0.12em] text-bark/45">
          CHANDIGARH · INDIA
        </span>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber/70 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber"></span>
          </span>
          <span className="font-mono text-[0.65rem] tracking-[0.12em] text-amber">
            AVAILABLE FOR PROJECTS
          </span>
        </div>

        <button
          onClick={scrollToTop}
          className="font-mono text-[0.65rem] tracking-[0.15em] text-bark/40 hover:text-amber transition-colors duration-300 uppercase cursor-none"
        >
          BACK TO TOP ↑
        </button>
      </div>
    </footer>
  );
};

export default Footer;
