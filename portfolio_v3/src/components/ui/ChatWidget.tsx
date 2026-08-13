import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Sparkles, Bot } from "lucide-react";

// ═══════════════════════════════════════════════════════════════
//  ChatWidget — Floating trigger linking to dedicated AI Assistant page
// ═══════════════════════════════════════════════════════════════

const ChatWidget: React.FC = () => {
  const location = useLocation();

  // Hide floating button on the assistant page itself
  if (location.pathname === "/assistant" || location.pathname === "/chat") {
    return null;
  }

  return (
    <Link
      to="/assistant"
      className="fixed bottom-6 right-6 z-[9800] group cursor-none flex items-center gap-3 select-none"
      aria-label="Open AI Assistant"
    >
      {/* Tooltip Pill */}
      <div className="hidden sm:flex items-center gap-1.5 font-mono text-[0.62rem] tracking-[0.12em] uppercase bg-surface/90 border border-amber/30 text-amber px-3.5 py-2 rounded-full shadow-2xl backdrop-blur-md opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300">
        <Sparkles size={12} className="animate-spin" style={{ animationDuration: "4s" }} />
        <span>Ask AI Assistant</span>
      </div>

      {/* Floating Action Button */}
      <div className="relative w-14 h-14 rounded-full bg-surface border border-amber/30 flex items-center justify-center text-amber shadow-[0_0_25px_rgba(192,88,0,0.25)] group-hover:shadow-[0_0_35px_rgba(255,122,26,0.5)] group-hover:border-amber group-hover:bg-amber group-hover:text-night transition-all duration-300">
        <Bot size={22} className="group-hover:scale-110 transition-transform duration-300" />
        <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-surface" />
      </div>
    </Link>
  );
};

export default ChatWidget;
