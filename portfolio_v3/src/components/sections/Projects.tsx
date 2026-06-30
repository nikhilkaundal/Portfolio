import React, { useEffect, useRef, useState, useCallback } from "react";
import ReactDOM from "react-dom";
import { PROJECTS, MORE_PROJECTS } from "../../data/portfolio";
import type { ProjectData } from "../../data/portfolio";
import {
  MessageSquare,
  Database,
  BookOpen,
  Newspaper,
  ExternalLink,
  Lock,
  ChevronRight,
  Play,
  X,
  Globe,
  ArrowRight,
  ArrowDown,
  FileText,
  Search,
  Sparkles,
} from "lucide-react";

/* GitHub brand icon (not in lucide-react) */
const GitHubIcon: React.FC<{ size?: number; className?: string }> = ({ size = 16, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
  </svg>
);

/* ═══════════════════════════════════════════════════════════
   useProjectReveal — Intersection Observer for scroll reveal
   ═══════════════════════════════════════════════════════════ */
const useProjectReveal = () => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible");
          io.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
};

/* ═══════════════════════════════════════════════════════════
   MetricCounter — scramble counter
   ═══════════════════════════════════════════════════════════ */
const MetricCounter: React.FC<{ val: string; label: string }> = ({ val, label }) => {
  const [display, setDisplay] = useState(val);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        let tick = 0;
        const iv = setInterval(() => {
          tick++;
          if (tick > 6) { clearInterval(iv); setDisplay(val); return; }
          setDisplay(val.replace(/[0-9]/g, () => String(Math.floor(Math.random() * 10))));
        }, 60);
      },
      { threshold: 0.5 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [val]);

  return (
    <div ref={ref} className="text-left">
      <p className="font-display text-3xl lg:text-4xl font-light text-amber leading-none mb-1">{display}</p>
      <p className="font-mono text-[0.55rem] tracking-[0.1em] uppercase text-bark/30">{label}</p>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   PremiumGlowCard — holographic sheen, scanning grid mesh,
   spotlight borders, and magnetic reverse-watermark parallax.
   ═══════════════════════════════════════════════════════════ */
interface PremiumGlowCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  watermark?: string;
  watermarkClass?: string;
}

const PremiumGlowCard: React.FC<PremiumGlowCardProps> = ({
  children,
  className = "",
  watermark,
  watermarkClass = "",
  ...rest
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCoords({ x, y });

    // Magnetic parallax: shift content slightly towards cursor
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const dx = ((x - centerX) / centerX) * 5; // max 5px
    const dy = ((y - centerY) / centerY) * 5;
    setParallax({ x: dx, y: dy });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setParallax({ x: 0, y: 0 });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className={`glow-card rounded-2xl relative overflow-hidden transition-all duration-500 ease-out border border-white/[0.06] bg-[#0E0E10] ${className}`}
      style={{
        transform: isHovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: isHovered
          ? "0 30px 60px rgba(0, 0, 0, 0.5), 0 0 50px rgba(192, 88, 0, 0.08)"
          : "0 4px 20px rgba(0, 0, 0, 0.2)",
        ...rest.style
      }}
      {...rest}
    >
      {/* 1. Reverse Parallax Watermark Number */}
      {watermark && (
        <div
          className={`absolute font-display outline-number z-0 select-none pointer-events-none transition-transform duration-500 ease-out ${watermarkClass}`}
          style={{
            transform: `translate3d(${-parallax.x * 2.2}px, ${-parallax.y * 2.2}px, 0)`,
            opacity: isHovered ? 0.18 : 0.12,
          }}
        >
          {watermark}
        </div>
      )}

      {/* 2. Spotlight Background Glow (Amber) */}
      <div
        className="absolute pointer-events-none inset-0 z-0 transition-opacity duration-500 rounded-inherit"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(400px circle at ${coords.x}px ${coords.y}px, rgba(255, 122, 26, 0.08), transparent 80%)`,
        }}
      />
      
      {/* 3. Futuristic Laser Scanline Grid Mesh */}
      <div
        className="absolute pointer-events-none inset-0 z-0 opacity-0 transition-opacity duration-500 rounded-inherit mix-blend-overlay"
        style={{
          opacity: isHovered ? 0.35 : 0,
          backgroundImage: `linear-gradient(rgba(255,122,26,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,122,26,0.12) 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
          backgroundPosition: "center",
          WebkitMask: `radial-gradient(160px circle at ${coords.x}px ${coords.y}px, black, transparent)`,
        }}
      />

      {/* 4. Glass Holographic Sheen Sweep */}
      <div
        className="absolute pointer-events-none inset-0 z-0 transition-opacity duration-500 rounded-inherit"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(250px circle at ${coords.x}px ${coords.y}px, rgba(255,255,255,0.05), transparent 60%)`,
        }}
      />

      {/* 5. Spotlight Border glow */}
      <div
        className="absolute pointer-events-none -inset-[1px] z-20 transition-opacity duration-500 rounded-inherit"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(130px circle at ${coords.x}px ${coords.y}px, rgba(255, 122, 26, 0.4), transparent 80%)`,
          padding: "1px",
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />

      {/* 6. Parallax Content Wrapper */}
      <div
        className="relative z-10 h-full flex flex-col justify-between transition-transform duration-500 ease-out"
        style={{
          transform: `translate3d(${parallax.x}px, ${parallax.y}px, 0)`,
        }}
      >
        {children}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   1. InteractiveChatMockup — RAG Chatbot live preview
   ═══════════════════════════════════════════════════════════ */
const InteractiveChatMockup: React.FC = () => {
  const [messages, setMessages] = useState<Array<{ sender: "user" | "bot"; text: string; hasPdf?: boolean }>>([
    {
      sender: "bot",
      text: "How can I help you today?\n\nAsk me anything about Panjab University admissions.",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentTypingText, setCurrentTypingText] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = [
    "What are the fees for B.Tech CSE?",
    "Admission process for B.Tech",
    "Hostel fees details",
    "Important dates"
  ];

  const handleSend = (text: string) => {
    if (isTyping) return;
    
    setMessages(prev => [...prev, { sender: "user", text }]);
    setIsTyping(true);

    setTimeout(() => {
      let botResponse = "";
      let hasPdf = false;

      if (text.includes("B.Tech CSE")) {
        botResponse = "The total tuition fees for B.Tech CSE is approximately ₹1,42,540 per year. For detailed breakdown, download the official PDF.";
        hasPdf = true;
      } else if (text.includes("Admission process")) {
        botResponse = "Admissions to B.Tech at Panjab University are based on JEE Main ranks followed by JAC Chandigarh counselling. You must have passed 10+2 with Physics, Mathematics, and Chemistry/Biotechnology.";
      } else if (text.includes("Hostel fees")) {
        botResponse = "The hostel fees at PU range from ₹5,000 to ₹10,000 per semester depending on the hostel allocated. Rent, mess charges, and security deposits are calculated separately.";
      } else if (text.includes("Important dates")) {
        botResponse = "JAC Chandigarh counselling typically starts in June-July. PU admission portal for other courses opens in May. Check the official admission website for current schedules.";
      } else {
        botResponse = "I am a PU Assistant chatbot. Please select one of the suggested queries or ask about B.Tech CSE fees, admissions, hostel fees, or important dates!";
      }

      let currentLength = 0;
      const interval = setInterval(() => {
        currentLength += 3;
        if (currentLength >= botResponse.length) {
          clearInterval(interval);
          setMessages(prev => [...prev, { sender: "bot", text: botResponse, hasPdf }]);
          setIsTyping(false);
          setCurrentTypingText("");
        } else {
          setCurrentTypingText(botResponse.slice(0, currentLength));
        }
      }, 15);
    }, 800);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, currentTypingText]);

  return (
    <div className="flex h-full bg-[#0E0E10] text-[#E8E4DD] font-body text-xs overflow-hidden select-none">
      {/* Sidebar */}
      <div className="hidden sm:flex w-[140px] bg-[#0A0A0C] border-r border-white/[0.04] p-2.5 flex-col justify-between flex-shrink-0">
        <div>
          {/* Logo */}
          <div className="flex items-center gap-1.5 mb-4 px-1">
            <MessageSquare size={13} className="text-amber" />
            <span className="font-display font-light text-[0.8rem] tracking-tight truncate">PU Assistant</span>
          </div>
          {/* New Chat Button */}
          <button
            onClick={() => {
              setMessages([{ sender: "bot", text: "How can I help you today?\n\nAsk me anything about Panjab University admissions." }]);
              setIsTyping(false);
              setCurrentTypingText("");
            }}
            className="w-full py-1.5 px-2 bg-amber hover:bg-[#D46200] text-night font-mono text-[0.55rem] font-bold rounded transition-colors cursor-none mb-4"
          >
            + New Chat
          </button>
          {/* Nav links */}
          <div className="flex flex-col gap-2.5 px-1 text-[0.62rem] text-bark/45">
            <span className="hover:text-bark/80 transition-colors cursor-none truncate">Chat History</span>
            <span className="hover:text-bark/80 transition-colors cursor-none truncate">About</span>
            <span className="hover:text-bark/80 transition-colors cursor-none truncate">Feedback</span>
          </div>
        </div>
      </div>

      {/* Main chat window */}
      <div className="flex-1 flex flex-col justify-between bg-[#0E0E10] relative">
        {/* Floating badge inside main window */}
        <div className="absolute top-2 right-2 z-10 flex items-center gap-1 bg-[#161618]/90 border border-white/[0.06] rounded-full px-2 py-0.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#28C840] animate-pulse" />
          <span className="font-mono text-[0.45rem] tracking-[0.1em] text-bark/50">LIVE DEMO</span>
        </div>

        {/* Chat History Area */}
        <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2.5 scrollbar-thin">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] rounded-lg p-2.5 leading-relaxed whitespace-pre-line text-[0.7rem] ${
                  msg.sender === "user"
                    ? "bg-white/[0.05] text-[#FAEFD0] border border-white/[0.04]"
                    : "bg-[#161618] text-bark/80 border border-white/[0.03]"
                }`}
              >
                {msg.text}
                {msg.hasPdf && (
                  <button className="mt-2 block w-full py-1 px-2 bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] text-amber text-[0.58rem] font-mono rounded text-center transition-colors cursor-none">
                    View Fee Structure PDF ↗
                  </button>
                )}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="max-w-[85%] rounded-lg p-2.5 bg-[#161618] text-bark/80 border border-white/[0.03] text-[0.7rem]">
                {currentTypingText ? (
                  currentTypingText
                ) : (
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-bark/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 bg-bark/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 bg-bark/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </span>
                )}
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Suggested questions & input */}
        <div className="p-3 bg-[#0A0A0C]/50 border-t border-white/[0.03]">
          {/* Suggested pills */}
          <div className="mb-2">
            <span className="font-mono text-[0.5rem] tracking-[0.1em] text-bark/20 block mb-1">SUGGESTED QUESTIONS</span>
            <div className="flex flex-wrap gap-1.5">
              {suggestedQuestions.map((q) => (
                <button
                  key={q}
                  onClick={() => handleSend(q)}
                  disabled={isTyping}
                  className="px-2 py-1 bg-[#161618] hover:bg-white/[0.05] border border-white/[0.06] text-bark/60 hover:text-bark/85 text-[0.58rem] rounded transition-colors cursor-none disabled:opacity-50"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
          {/* Input field */}
          <div className="flex items-center gap-2 bg-[#0A0A0B]/80 rounded-md border border-white/[0.04] p-1.5">
            <input
              type="text"
              placeholder="Ask anything..."
              disabled={isTyping}
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.currentTarget.value.trim()) {
                  handleSend(e.currentTarget.value);
                  e.currentTarget.value = "";
                }
              }}
              className="bg-transparent outline-none flex-1 text-bark/70 placeholder-bark/25 text-[0.7rem] px-1 disabled:opacity-50"
            />
            <button className="w-5 h-5 rounded-md bg-[#161618] flex items-center justify-center border border-white/[0.06] hover:border-amber/40 transition-colors cursor-none">
              <ChevronRight size={11} className="text-bark/50" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   2. SalaryManagerMockup — Live expense tracking dashboard
   ═══════════════════════════════════════════════════════════ */
const SalaryManagerMockup: React.FC = () => {
  return (
    <div className="w-full h-full bg-[#0A0A0C] text-[#E8E4DD] font-body text-[0.55rem] p-3 flex flex-col justify-between select-none">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-white/[0.04] pb-2">
        <span className="font-mono tracking-wider text-bark/40">SALARY MANAGER</span>
        <div className="flex gap-1.5 items-center">
          <span className="w-1.5 h-1.5 rounded-full bg-[#28C840] animate-pulse" />
          <span className="text-[0.5rem] text-bark/25 uppercase font-mono">Live Ingestion</span>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-[60%_40%] gap-2 py-2 overflow-hidden">
        {/* Left Stats & Chart */}
        <div className="flex flex-col justify-between">
          <div className="grid grid-cols-3 gap-1.5">
            <div className="bg-[#111113] border border-white/[0.04] p-1 rounded">
              <p className="text-bark/30 text-[0.45rem] font-mono uppercase">SMS Read</p>
              <p className="text-amber font-mono font-bold text-xs">142</p>
            </div>
            <div className="bg-[#111113] border border-white/[0.04] p-1 rounded">
              <p className="text-bark/30 text-[0.45rem] font-mono uppercase">Spend</p>
              <p className="text-amber font-mono font-bold text-xs">₹24.5K</p>
            </div>
            <div className="bg-[#111113] border border-white/[0.04] p-1 rounded">
              <p className="text-bark/30 text-[0.45rem] font-mono uppercase">Saves</p>
              <p className="text-amber font-mono font-bold text-xs">₹35.5K</p>
            </div>
          </div>

          <div className="flex-1 bg-[#111113]/50 border border-white/[0.03] rounded p-2 mt-2 flex flex-col justify-between">
            <p className="text-bark/35 text-[0.45rem] font-mono uppercase mb-1">Expense Breakdown</p>
            <div className="flex items-end justify-between h-[36px] px-2">
              {[
                { label: "Rent", height: "85%", color: "#C05800" },
                { label: "Food", height: "55%", color: "#FF7A1A" },
                { label: "Util", height: "30%", color: "#8B4513" },
                { label: "Trav", height: "45%", color: "#C05800" },
                { label: "Misc", height: "20%", color: "#FAEFD0" },
              ].map((bar, i) => (
                <div key={i} className="flex flex-col items-center flex-1 mx-1">
                  <div className="w-2.5 rounded-t-sm transition-all duration-500" style={{ height: bar.height, backgroundColor: bar.color }} />
                  <span className="text-[0.4rem] text-bark/20 mt-1 font-mono">{bar.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Parsed SMS Log */}
        <div className="hidden sm:flex bg-[#111113] border border-white/[0.04] rounded p-2 flex-col overflow-hidden">
          <p className="text-bark/30 text-[0.45rem] font-mono uppercase mb-1.5 border-b border-white/[0.03] pb-1">SMS Parser Logs</p>
          <div className="flex-1 flex flex-col gap-1.5 overflow-y-auto scrollbar-none">
            {[
              { type: "debit", source: "HDFC", amt: "₹850", tag: "Swiggy", time: "Just now" },
              { type: "debit", source: "SBI", amt: "₹2,400", tag: "Fuel", time: "1h ago" },
              { type: "credit", source: "ICICI", amt: "₹60K", tag: "Salary", time: "1d ago" },
            ].map((log, i) => (
              <div key={i} className="bg-white/[0.02] border border-white/[0.03] p-1 rounded flex flex-col gap-0.5">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-bark/20 text-[0.45rem]">{log.source} SMS</span>
                  <span className={log.type === "credit" ? "text-green-500 font-bold" : "text-amber font-bold"}>{log.amt}</span>
                </div>
                <div className="flex justify-between text-bark/40 text-[0.45rem]">
                  <span className="truncate max-w-[50px]">{log.tag}</span>
                  <span>{log.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   3. SP500PredictorMockup — Live interactive stock chart
   ═══════════════════════════════════════════════════════════ */
const SP500PredictorMockup: React.FC = () => {
  return (
    <div className="w-full h-full bg-[#0A0A0C] text-[#E8E4DD] font-body text-[0.55rem] p-3 flex flex-col justify-between select-none relative">
      <div className="absolute top-2.5 right-3 bg-amber/10 border border-amber/30 text-amber px-1.5 py-0.5 rounded font-mono text-[0.48rem] font-bold animate-pulse">
        78.6% CONFIDENCE
      </div>

      <div>
        <p className="font-mono tracking-wider text-bark/30">S&P 500 FORECASTER</p>
        <h4 className="text-bark/80 text-xs font-light font-display">LSTM Trend Prediction</h4>
      </div>

      <div className="flex-1 relative my-2 border-b border-l border-white/[0.05] flex items-end">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 80" preserveAspectRatio="none">
          <defs>
            <linearGradient id="gradientActual" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#C05800" stopOpacity="0.2"/>
              <stop offset="100%" stopColor="#C05800" stopOpacity="0"/>
            </linearGradient>
            <linearGradient id="gradientPredict" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FF7A1A" stopOpacity="0.15"/>
              <stop offset="100%" stopColor="#FF7A1A" stopOpacity="0"/>
            </linearGradient>
          </defs>

          <path
            d="M 0 60 Q 20 40 40 50 T 80 30 T 120 45 T 140 25 L 140 80 L 0 80 Z"
            fill="url(#gradientActual)"
          />
          <path
            d="M 0 60 Q 20 40 40 50 T 80 30 T 120 45 T 140 25"
            fill="none"
            stroke="#C05800"
            strokeWidth="1.5"
          />

          <path
            d="M 140 25 Q 160 15 180 20 T 200 10 L 200 80 L 140 80 Z"
            fill="url(#gradientPredict)"
          />
          <path
            d="M 140 25 Q 160 15 180 20 T 200 10"
            fill="none"
            stroke="#FF7A1A"
            strokeWidth="1.5"
            strokeDasharray="2,2"
          />

          <line x1="140" y1="0" x2="140" y2="80" stroke="rgba(255,255,255,0.06)" strokeWidth="1" strokeDasharray="1,2" />
        </svg>

        <div className="absolute left-[142px] top-4 border-l border-amber/40 pl-1.5 animate-bounce" style={{ animationDuration: "3s" }}>
          <p className="text-[0.45rem] font-mono text-amber uppercase">Prediction</p>
          <p className="text-bark/80 font-mono text-[0.55rem] font-bold">+$26.40 (Bullish)</p>
        </div>

        <div className="absolute left-2 bottom-1 text-[0.45rem] font-mono text-bark/20">Historical</div>
      </div>

      <div className="flex justify-between items-center text-[0.5rem] text-bark/25 font-mono">
        <span>Jan 2026</span>
        <span>Mar 2026</span>
        <span>Jun 2026</span>
        <span className="text-amber">Forecast</span>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   4. OkQuotedMockup — B2B Procurement dashboard (light theme)
   ═══════════════════════════════════════════════════════════ */
const OkQuotedMockup: React.FC = () => {
  return (
    <div className="w-full h-full bg-[#FAFAFC] text-[#1E1E24] font-body text-[0.55rem] p-3 flex flex-col justify-between select-none">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-black/[0.06] pb-2">
        <div className="flex items-center gap-1">
          <div className="w-2.5 h-2.5 bg-amber rounded" />
          <span className="font-mono font-bold tracking-tight text-black text-[0.6rem]">OkQuoted</span>
        </div>
        <div className="flex gap-1.5 items-center">
          <span className="w-1.5 h-1.5 rounded-full bg-amber animate-pulse" />
          <span className="text-[0.5rem] text-black/40 uppercase font-mono">Negotiation SLA</span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-3 gap-1.5 mt-1.5">
        <div className="bg-white border border-black/[0.04] p-1 rounded shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <p className="text-black/35 text-[0.45rem] font-mono uppercase">Open RFQs</p>
          <p className="text-black font-mono font-bold text-xs">28</p>
        </div>
        <div className="bg-white border border-black/[0.04] p-1 rounded shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <p className="text-black/35 text-[0.45rem] font-mono uppercase">Avg Savings</p>
          <p className="text-black font-mono font-bold text-xs">14.2%</p>
        </div>
        <div className="bg-white border border-black/[0.04] p-1 rounded shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <p className="text-black/35 text-[0.45rem] font-mono uppercase">Active Vendors</p>
          <p className="text-black font-mono font-bold text-xs">53</p>
        </div>
      </div>

      {/* Negotiations Table */}
      <div className="flex-1 bg-white border border-black/[0.05] rounded shadow-[0_1px_2px_rgba(0,0,0,0.02)] mt-2 p-2 flex flex-col justify-between overflow-hidden">
        <div className="flex justify-between items-center text-[0.45rem] font-mono font-bold text-black/50 border-b border-black/[0.04] pb-1 mb-1">
          <span>PRODUCT</span>
          <span>VENDOR</span>
          <span>ROUND</span>
          <span>STATUS</span>
        </div>
        <div className="flex-1 flex flex-col gap-1 overflow-y-auto scrollbar-none">
          {[
            { prod: "Steel Tubes", vend: "TATA Steel", round: "R2", status: "Awaiting Vendor", color: "#C05800" },
            { prod: "Copper Wire", vend: "Finolex", round: "R3", status: "Action Required", color: "#FF7A1A" },
            { prod: "PVC Pipes", vend: "Supreme", round: "R1", status: "Completed", color: "#28C840" },
          ].map((row, i) => (
            <div key={i} className="flex justify-between items-center text-[0.48rem] text-black/75 py-0.5 border-b border-black/[0.02] last:border-b-0">
              <span className="font-bold truncate max-w-[42px]">{row.prod}</span>
              <span className="truncate max-w-[40px] text-black/50">{row.vend}</span>
              <span className="font-mono">{row.round}</span>
              <span className="font-mono text-[0.45rem] px-1 rounded-sm text-white" style={{ backgroundColor: row.color }}>{row.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   LiveIframeMockup — embeds actual live webpage via iframe
   ═══════════════════════════════════════════════════════════ */
const LiveIframeMockup: React.FC<{ src: string }> = ({ src }) => {
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateScale = () => {
      const width = el.getBoundingClientRect().width;
      const mobileMode = width < 768;
      setIsMobile(mobileMode);
      
      if (mobileMode) {
        setScale(1);
      } else {
        setScale(width / 1920);
      }
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full relative bg-[#0E0E10] overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#0E0E10] z-10">
          <div className="w-8 h-8 border-2 border-amber/25 border-t-amber rounded-full animate-spin" />
          <span className="font-mono text-[0.55rem] tracking-[0.12em] text-bark/40 uppercase">
            Loading Live Website...
          </span>
        </div>
      )}
      <iframe
        src={src}
        title="Live Project Demo"
        className="absolute border-0"
        style={{
          width: isMobile ? "100%" : "1920px",
          height: isMobile ? "100%" : "876px",
          transform: isMobile ? "none" : `scale(${scale})`,
          transformOrigin: "top left",
          opacity: isLoading ? 0 : 1,
          transition: "opacity 500ms ease",
          top: 0,
          left: 0,
        }}
        onLoad={() => setIsLoading(false)}
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
      />
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   DemoFrame — browser window chrome + media
   ═══════════════════════════════════════════════════════════ */
interface DemoFrameProps {
  id: string;
  mediaType: "video" | "image";
  mediaSrc: string;
  urlBarText: string;
  badge: "live" | "demo" | "preview";
}

const BADGE_CONFIG = {
  live:    { dotColor: "#28C840", text: "LIVE DEMO" },
  demo:    { dotColor: "#C05800", text: "DEMO" },
  preview: { dotColor: "#C05800", text: "PREVIEW" },
};

const DemoFrame: React.FC<DemoFrameProps> = ({ id, mediaType, mediaSrc, urlBarText, badge }) => {
  const [mediaError, setMediaError] = useState(false);
  const [viewMode, setViewMode] = useState<"video" | "live" | "interactive">("video");
  const badgeCfg = BADGE_CONFIG[badge];

  return (
    <div className="relative rounded-xl overflow-hidden border border-white/[0.06] bg-[#111113] group/frame transition-shadow duration-500 hover:shadow-2xl hover:shadow-black/60">
      {/* Floating badge */}
      <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 bg-[#111113]/90 backdrop-blur-sm border border-white/[0.08] rounded-full px-3 py-1.5">
        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: badgeCfg.dotColor, boxShadow: `0 0 6px ${badgeCfg.dotColor}` }} />
        <span className="font-mono text-[0.55rem] tracking-[0.12em] uppercase text-bark/60">{badgeCfg.text}</span>
      </div>

      {/* Title bar */}
      <div className="flex items-center gap-3 px-4 py-2.5 bg-[#161618] border-b border-white/[0.04] group/title">
        {/* Traffic lights */}
        <div className="flex items-center gap-[6px]">
          <span className="w-[8px] h-[8px] rounded-full transition-transform duration-300 hover:scale-110" style={{ backgroundColor: "#FF5F57" }} />
          <span className="w-[8px] h-[8px] rounded-full transition-transform duration-300 hover:scale-110" style={{ backgroundColor: "#FEBC2E" }} />
          <span className="w-[8px] h-[8px] rounded-full transition-transform duration-300 hover:scale-110" style={{ backgroundColor: "#28C840" }} />
        </div>
        {/* URL bar */}
        <div className="flex-1 flex items-center gap-2 bg-[#0A0A0B]/60 rounded-md px-3 py-1.5 transition-colors duration-300 group-hover/frame:bg-[#0A0A0B]/85">
          <Lock size={10} className="text-bark/20 flex-shrink-0" />
          <span className="font-mono text-[0.65rem] text-bark/30 truncate">{urlBarText}</span>
        </div>
      </div>

      {/* RAG Chatbot Dual Mode tab bar switcher */}
      {id === "proj-01" && (
        <div className="flex bg-[#161618] border-b border-white/[0.04] px-4 py-1.5 gap-2 select-none relative z-20 overflow-x-auto whitespace-nowrap flex-nowrap scrollbar-none">
          <button
            onClick={() => setViewMode("video")}
            className={`flex-shrink-0 font-mono text-[0.55rem] tracking-wider uppercase px-2.5 py-1 rounded transition-colors cursor-none ${
              viewMode === "video"
                ? "text-amber bg-white/[0.04] border border-white/[0.08]"
                : "text-bark/40 hover:text-bark/70 border border-transparent"
            }`}
          >
            📹 Demo Video
          </button>
          <button
            onClick={() => setViewMode("live")}
            className={`flex-shrink-0 font-mono text-[0.55rem] tracking-wider uppercase px-2.5 py-1 rounded transition-colors cursor-none ${
              viewMode === "live"
                ? "text-amber bg-white/[0.04] border border-white/[0.08]"
                : "text-bark/40 hover:text-bark/70 border border-transparent"
            }`}
          >
            🌐 Live Website
          </button>
          <button
            onClick={() => setViewMode("interactive")}
            className={`flex-shrink-0 font-mono text-[0.55rem] tracking-wider uppercase px-2.5 py-1 rounded transition-colors cursor-none ${
              viewMode === "interactive"
                ? "text-amber bg-white/[0.04] border border-white/[0.08]"
                : "text-bark/40 hover:text-bark/70 border border-transparent"
            }`}
          >
            💬 Interactive Simulator
          </button>
        </div>
      )}

      {/* Media area — dynamic aspect ratio depending on project */}
      <div
        className="relative overflow-hidden bg-[#0A0A0B]"
        style={{ aspectRatio: id === "proj-01" ? "1920 / 876" : "16 / 9" }}
      >
        {id === "proj-01" ? (
          viewMode === "interactive" ? (
            <InteractiveChatMockup />
          ) : viewMode === "live" ? (
            <LiveIframeMockup src="https://rag-based-chatbot-for-pu-campus.vercel.app" />
          ) : (
            <video
              src={mediaSrc}
              autoPlay
              muted
              loop
              playsInline
              onError={() => setMediaError(true)}
              className="w-full h-full video-fit-contain bg-[#0E0E10] transition-transform duration-[500ms] ease-out hover:scale-[1.03]"
            />
          )
        ) : id === "proj-02" ? (
          <SalaryManagerMockup />
        ) : id === "proj-03" ? (
          <SP500PredictorMockup />
        ) : id === "proj-04" ? (
          <OkQuotedMockup />
        ) : mediaError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <Play size={32} className="text-bark/15" />
            <span className="font-mono text-[0.65rem] tracking-[0.1em] uppercase text-bark/20">
              Demo coming soon
            </span>
          </div>
        ) : mediaType === "video" ? (
          <video
            src={mediaSrc}
            autoPlay
            muted
            loop
            playsInline
            onError={() => setMediaError(true)}
            className="w-full h-full video-fit-contain bg-[#0E0E10] transition-transform duration-[500ms] ease-out hover:scale-[1.03]"
          />
        ) : (
          <img
            src={mediaSrc}
            alt="Project demo"
            onError={() => setMediaError(true)}
            className="w-full h-full object-cover screenshot-pan hover:scale-[1.03] transition-transform duration-[500ms] ease-out"
          />
        )}
        {/* Bottom gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   ArchitectureStrip — Query → Retrieval → Response
   ═══════════════════════════════════════════════════════════ */
const ArchitectureStrip: React.FC = () => {
  const steps = [
    { icon: MessageSquare, label: "Query" },
    { icon: Database,      label: "Retrieval" },
    { icon: MessageSquare, label: "Response" },
  ];

  return (
    <div className="flex items-center gap-2 sm:gap-3 select-none">
      {steps.map((step, i) => (
        <React.Fragment key={step.label}>
          <div className="flex items-center gap-2 border border-white/[0.06] rounded-lg px-3 py-2 bg-white/[0.02] hover:border-amber/40 hover:bg-amber/[0.03] hover:scale-105 transition-all duration-300">
            <step.icon size={14} className="text-amber/50" />
            <span className="hidden sm:inline font-mono text-[0.6rem] tracking-[0.08em] uppercase text-bark/40">{step.label}</span>
          </div>
          {i < steps.length - 1 && (
            <ChevronRight size={14} className="text-amber/35 flex-shrink-0 animate-pulse" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   ConfirmModal — styled confirm dialog for Live Demo
   ═══════════════════════════════════════════════════════════ */
const ConfirmModal: React.FC<{ url: string; onClose: () => void }> = ({ url, onClose }) => {
  const handleContinue = () => {
    window.open(url, "_blank", "noopener,noreferrer");
    onClose();
  };

  return (
    <div className="confirm-overlay" onClick={onClose}>
      <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <span className="font-mono text-[0.6rem] tracking-[0.15em] uppercase text-amber/60">
            Before you go
          </span>
          <button onClick={onClose} className="text-bark/30 hover:text-bark/60 transition-colors cursor-none">
            <X size={16} />
          </button>
        </div>
        <p className="font-body text-[0.9rem] text-bark/60 leading-relaxed mb-6">
          This demo may be temporarily down due to free-tier hosting limits. Continue anyway?
        </p>
        <div className="flex items-center gap-3 justify-end">
          <button
            onClick={onClose}
            className="font-mono text-[0.68rem] tracking-[0.1em] uppercase
              text-bark/40 border border-white/[0.08] rounded-full px-5 py-2.5
              hover:border-white/[0.15] hover:text-bark/60
              transition-all duration-300 cursor-none"
          >
            Cancel
          </button>
          <button
            onClick={handleContinue}
            className="font-mono text-[0.68rem] tracking-[0.1em] uppercase
              text-night bg-amber rounded-full px-5 py-2.5
              hover:bg-[#FF7A1A]
              transition-all duration-300 cursor-none"
          >
            Continue →
          </button>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   TagList — renders tiered tags (Core Stack + Tools)
   ═══════════════════════════════════════════════════════════ */
const TagList: React.FC<{ coreStack: string[]; tools: string[]; showLabels?: boolean }> = ({
  coreStack, tools, showLabels = false
}) => (
  <div className="select-none">
    {showLabels && (
      <p className="font-mono text-[0.5rem] tracking-[0.15em] uppercase text-bark/50 mb-2">Core Stack</p>
    )}
    <div className="flex flex-wrap gap-2 mb-2">
      {coreStack.map((t) => (
        <span key={t} className="tag-core">{t}</span>
      ))}
    </div>
    {showLabels && (
      <p className="font-mono text-[0.5rem] tracking-[0.15em] uppercase text-bark/50 mb-2 mt-3">Tools &amp; Technologies</p>
    )}
    <div className="flex flex-wrap gap-2">
      {tools.map((t) => (
        <span key={t} className="tag-tool">{t}</span>
      ))}
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════════
   FeaturedCard — full-width hero project card
   ═══════════════════════════════════════════════════════════ */
interface FeaturedCardProps {
  project: ProjectData;
  onOpenCaseStudy: () => void;
}

const FeaturedCard: React.FC<FeaturedCardProps> = ({ project, onOpenCaseStudy }) => {
  const revealRef = useProjectReveal();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleLiveDemoClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setShowConfirm(true);
  }, []);

  return (
    <>
      <div ref={revealRef} className="project-reveal mb-6">
        <PremiumGlowCard
          watermark={project.index}
          watermarkClass="-left-2 -top-4 lg:left-2 lg:-top-2 z-0"
          className="p-6 sm:p-8 lg:p-12 pb-6 lg:pb-8"
        >
          {/* Featured label */}
          <div className="flex items-center gap-3 mb-6 relative z-10">
            <span className="font-mono text-[0.55rem] tracking-[0.15em] uppercase bg-amber/10 text-amber border border-amber/20 px-2.5 py-1 rounded-sm">
              Featured Project
            </span>
            <span className="h-px flex-1 bg-white/[0.04]" />
          </div>

          {/* Grid: text left, demo right */}
          <div className="grid grid-cols-1 lg:grid-cols-[38%_62%] gap-8 lg:gap-10 relative z-10 items-stretch">
            {/* Left — text content */}
            <div className="flex flex-col justify-between">
              <div>
                <h3
                  className="font-display font-light text-bark mb-1 relative hover:text-amber transition-colors duration-300"
                  style={{ fontSize: "clamp(2rem, 3.5vw, 2.6rem)", letterSpacing: "-0.02em" }}
                >
                  {project.title}
                </h3>
                {project.subtitle && (
                  <p className="font-display italic text-amber/60 text-lg font-light mb-4">
                    {project.subtitle}
                  </p>
                )}
                <p className="font-body text-[0.875rem] text-bark/75 leading-relaxed mb-6">
                  {project.desc}
                </p>

                {/* Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                  {project.metrics.map((m) => (
                    <MetricCounter key={m.label} val={m.val} label={m.label} />
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div className="mb-2">
                <TagList coreStack={project.coreStack} tools={project.tools} showLabels />
              </div>
            </div>

            {/* Right — demo frame */}
            <div className="flex flex-col justify-center">
              <DemoFrame
                id={project.id}
                mediaType={project.mediaType}
                mediaSrc={project.mediaSrc}
                urlBarText={project.urlBarText}
                badge={project.badge}
              />
            </div>
          </div>

          {/* Bottom row: Info on left, architecture in middle, CTAs on right */}
          <div className="border-t border-white/[0.04] mt-8 pt-6 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
            <p className="font-mono text-[0.52rem] sm:text-[0.58rem] tracking-[0.05em] text-bark/60 text-center md:text-left max-w-xs md:max-w-none">
              Built with modern AI stack &amp; RAG pipeline for accurate, context-aware responses.
            </p>

            <div className="flex-shrink-0 w-full md:w-auto flex justify-center md:justify-start">
              <ArchitectureStrip />
            </div>

            <div className="flex items-center justify-center md:justify-end gap-3 flex-wrap w-full md:w-auto">
              {/* Read Case Study Button */}
              <button
                onClick={onOpenCaseStudy}
                className="font-mono text-[0.68rem] tracking-[0.1em] uppercase group/btn
                  text-amber border border-amber/30 rounded px-6 py-2.5
                  hover:bg-amber hover:text-night hover:shadow-lg hover:shadow-amber/20
                  transition-all duration-300 cursor-none
                  inline-flex items-center gap-2 w-full sm:w-auto justify-center"
              >
                Read Case Study
                <ArrowRight size={12} className="group-hover/btn:translate-x-0.5 transition-transform duration-300" />
              </button>

              {/* Live Demo with tooltip */}
              <div className="project-tooltip">
                <span className="tooltip-text">
                  Hosted on free-tier infra — may be temporarily unavailable due to model size limits.
                </span>
                <button
                  onClick={handleLiveDemoClick}
                  className="font-mono text-[0.68rem] tracking-[0.1em] uppercase group/btn
                    text-night bg-amber rounded px-6 py-2.5
                    hover:bg-[#D46200] hover:shadow-lg hover:shadow-amber/20
                    transition-all duration-300 cursor-none
                    inline-flex items-center gap-2"
                >
                  {project.primaryCta}
                </button>
              </div>

              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[0.68rem] tracking-[0.1em] uppercase group/btn
                  text-bark/50 border border-white/[0.08] rounded px-6 py-2.5
                  hover:border-amber/30 hover:text-amber/70
                  transition-all duration-300 cursor-none
                  inline-flex items-center gap-2"
              >
                Source Code 
                <ExternalLink size={12} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform duration-300" />
              </a>
            </div>
          </div>
        </PremiumGlowCard>
      </div>

      {/* Confirm modal */}
      {showConfirm && project.liveUrl && (
        <ConfirmModal url={project.liveUrl} onClose={() => setShowConfirm(false)} />
      )}
    </>
  );
};

/* ═══════════════════════════════════════════════════════════
   SecondaryCard — smaller project card
   ═══════════════════════════════════════════════════════════ */
const SecondaryCard: React.FC<{ project: ProjectData; revealDelay?: number }> = ({ project, revealDelay = 0 }) => {
  const revealRef = useProjectReveal();

  return (
    <div
      ref={revealRef}
      className="project-reveal"
      style={{ transitionDelay: `${revealDelay}ms` }}
    >
      <PremiumGlowCard
        watermark={project.index}
        watermarkClass="-right-2 -top-4 z-0"
        className="p-6 sm:p-8 h-full flex flex-col justify-between"
      >
        <div>
          {/* Demo frame */}
          <div className="mb-6 relative z-10">
            <DemoFrame
              id={project.id}
              mediaType={project.mediaType}
              mediaSrc={project.mediaSrc}
              urlBarText={project.urlBarText}
              badge={project.badge}
            />
          </div>

          {/* Title */}
          <h3
            className="font-display font-light text-bark mb-1.5 leading-tight relative z-10 hover:text-amber transition-colors duration-300"
            style={{ fontSize: "clamp(1.3rem, 2.5vw, 1.8rem)", letterSpacing: "-0.02em" }}
          >
            {project.title}
          </h3>
          {project.subtitle && (
            <p className="font-display italic text-amber/50 text-sm font-light mb-3 relative z-10">
              {project.subtitle}
            </p>
          )}
          <p className="font-body text-[0.85rem] text-bark/70 leading-relaxed mb-5 relative z-10">
            {project.desc}
          </p>

          {/* Metric */}
          {project.metrics.length > 0 && (
            <div className="grid grid-cols-2 gap-4 mb-5 relative z-10">
              {project.metrics.map((m) => (
                <MetricCounter key={m.label} val={m.val} label={m.label} />
              ))}
            </div>
          )}
        </div>

        <div>
          {/* Tags */}
          <div className="mb-6 relative z-10">
            <TagList coreStack={project.coreStack} tools={project.tools} />
          </div>

          {/* CTAs */}
          <div className="flex items-center gap-3 flex-wrap relative z-10">
            <button
              className="font-mono text-[0.65rem] tracking-[0.1em] uppercase group/btn
                text-night bg-amber rounded px-5 py-2
                hover:bg-amber-glow hover:shadow-lg hover:shadow-amber/20
                transition-all duration-300 cursor-none
                inline-flex items-center gap-2"
            >
              <Play size={11} className="group-hover/btn:scale-110 transition-transform duration-300" />
              {project.primaryCta}
            </button>
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[0.65rem] tracking-[0.1em] uppercase group/btn
                text-bark/50 border border-white/[0.08] rounded px-5 py-2
                hover:border-amber/30 hover:text-amber/70
                transition-all duration-300 cursor-none
                inline-flex items-center gap-2"
            >
              Source Code 
              <ExternalLink size={11} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform duration-300" />
            </a>
          </div>
        </div>
      </PremiumGlowCard>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   MoreProjectsRow — compact pill items + GitHub link
   ═══════════════════════════════════════════════════════════ */
const MoreProjectsRow: React.FC = () => {
  const revealRef = useProjectReveal();
  const iconMap = {
    book: BookOpen,
    newspaper: Newspaper,
    globe: Globe,
  };

  return (
    <div ref={revealRef} className="project-reveal mt-10">
      {/* Section label */}
      <div className="flex items-center gap-4 mb-5">
        <span className="font-mono text-[0.55rem] tracking-[0.15em] uppercase text-bark/55">
          More Projects
        </span>
        <span className="h-px flex-1 bg-white/[0.04]" />
      </div>

      <div className="flex flex-wrap items-center gap-4">
        {MORE_PROJECTS.map((item) => {
          const Icon = iconMap[item.icon];
          return (
            <a
              key={item.title}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 border border-white/[0.06] rounded-xl px-5 py-3.5
                bg-white/[0.02] hover:border-amber/20 hover:bg-amber/[0.03] hover:-translate-y-1
                transition-all duration-300 cursor-none group"
            >
              <div className="w-8 h-8 rounded-lg bg-amber/10 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                <Icon size={15} className="text-amber/60 group-hover:text-amber-glow transition-colors duration-300" />
              </div>
              <div>
                <p className="font-body text-[0.8rem] text-bark/70 group-hover:text-bark/95 transition-colors">
                  {item.title}
                </p>
                <p className="font-mono text-[0.55rem] tracking-[0.08em] uppercase text-bark/25">
                  {item.sub}
                </p>
              </div>
              <ExternalLink size={12} className="text-bark/15 ml-1 group-hover:text-amber/40 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
            </a>
          );
        })}

        {/* View all on GitHub */}
        <a
          href="https://github.com/nikhilkaundal?tab=repositories"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 border border-white/[0.08] rounded-full px-5 py-2.5 group
            text-bark/40 hover:border-amber/30 hover:text-amber/70 hover:shadow-lg hover:shadow-amber/5
            transition-all duration-300 cursor-none ml-auto"
        >
          <GitHubIcon size={14} className="group-hover:scale-110 transition-transform duration-300" />
          <span className="font-mono text-[0.65rem] tracking-[0.1em] uppercase">
            View all on GitHub
          </span>
          <ExternalLink size={11} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
        </a>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   PipelineDiagram — Ingestion → Retrieval → Generation
   ═══════════════════════════════════════════════════════════ */
const PipelineDiagram: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-2 my-10 max-w-4xl mx-auto">
      {/* Ingestion */}
      <div className="flex-1 w-full bg-white/[0.02] border border-white/[0.06] rounded-xl p-5 text-center hover:border-amber/40 hover:bg-amber/[0.02] transition-all duration-300 group/box">
        <div className="w-10 h-10 rounded-full bg-amber/10 flex items-center justify-center mx-auto mb-3 border border-amber/20 group-hover/box:scale-110 transition-transform">
          <FileText size={18} className="text-amber" />
        </div>
        <h4 className="font-mono text-xs uppercase tracking-wider text-bark mb-1">Ingestion</h4>
        <p className="text-[0.62rem] text-bark/60 leading-relaxed max-w-[200px] mx-auto">
          Documents → vector embeddings → ChromaDB
        </p>
      </div>

      {/* Arrow 1 */}
      <div className="flex items-center justify-center py-2 md:py-0 md:px-2 flex-shrink-0">
        <ArrowRight className="hidden md:block text-amber/35 animate-pulse" size={18} />
        <ArrowDown className="block md:hidden text-amber/35 animate-pulse" size={18} />
      </div>

      {/* Retrieval */}
      <div className="flex-1 w-full bg-white/[0.02] border border-white/[0.06] rounded-xl p-5 text-center hover:border-amber/40 hover:bg-amber/[0.02] transition-all duration-300 group/box">
        <div className="w-10 h-10 rounded-full bg-amber/10 flex items-center justify-center mx-auto mb-3 border border-amber/20 group-hover/box:scale-110 transition-transform">
          <Search size={18} className="text-amber" />
        </div>
        <h4 className="font-mono text-xs uppercase tracking-wider text-bark mb-1">Retrieval</h4>
        <p className="text-[0.62rem] text-bark/60 leading-relaxed max-w-[200px] mx-auto">
          Semantic search via LlamaIndex
        </p>
      </div>

      {/* Arrow 2 */}
      <div className="flex items-center justify-center py-2 md:py-0 md:px-2 flex-shrink-0">
        <ArrowRight className="hidden md:block text-amber/35 animate-pulse" size={18} />
        <ArrowDown className="block md:hidden text-amber/35 animate-pulse" size={18} />
      </div>

      {/* Generation */}
      <div className="flex-1 w-full bg-white/[0.02] border border-white/[0.06] rounded-xl p-5 text-center hover:border-amber/40 hover:bg-amber/[0.02] transition-all duration-300 group/box">
        <div className="w-10 h-10 rounded-full bg-amber/10 flex items-center justify-center mx-auto mb-3 border border-amber/20 group-hover/box:scale-110 transition-transform">
          <Sparkles size={18} className="text-amber" />
        </div>
        <h4 className="font-mono text-xs uppercase tracking-wider text-bark mb-1">Generation</h4>
        <p className="text-[0.62rem] text-bark/60 leading-relaxed max-w-[200px] mx-auto">
          Grounded response via Groq LLM
        </p>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   CaseStudyRagChatbot — full detailed case study view
   ═══════════════════════════════════════════════════════════ */
interface CaseStudyRagChatbotProps {
  onClose: () => void;
  project: ProjectData;
}

const CaseStudyRagChatbot: React.FC<CaseStudyRagChatbotProps> = ({ onClose, project }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    // Reset scroll to top when opened
    scrollRef.current?.scrollTo({ top: 0 });
    
    // Lock background scroll
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  const handleLiveDemoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowConfirm(true);
  };

  return ReactDOM.createPortal(
    <div
      ref={scrollRef}
      data-lenis-prevent
      className="fixed inset-0 z-[90] bg-[#0A0A0C] overflow-y-auto pt-24 pb-20 case-study-overlay"
      style={{ scrollBehavior: "smooth" }}
    >
      {/* Top back button row */}
      <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 mb-8">
        <button
          onClick={onClose}
          className="font-mono text-[0.68rem] tracking-[0.12em] uppercase text-bark/50 hover:text-amber inline-flex items-center gap-2 transition-colors cursor-none"
        >
          ← Back to all projects
        </button>
      </div>

      <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 space-y-24">
        {/* A. Hero Block */}
        <div className="space-y-6">
          <div className="space-y-2">
            <span className="font-mono text-[0.55rem] tracking-[0.2em] uppercase text-amber">
              Case Study · 01
            </span>
            <h1
              className="font-display font-light text-bark"
              style={{ fontSize: "clamp(2.8rem, 5vw, 5rem)", letterSpacing: "-0.02em", lineHeight: 1.0 }}
            >
              {project.title}
            </h1>
            <p className="font-display italic text-amber/60 text-xl sm:text-2xl font-light">
              {project.subtitle}
            </p>
            <div className="font-mono text-[0.58rem] sm:text-[0.65rem] tracking-[0.05em] text-bark/40 pt-1">
              Panjab University · Design Innovation Centre · AI Internship · Team of 4
            </div>
          </div>

          {/* Hero visual — large DemoFrame */}
          <div className="w-full">
            <DemoFrame
              id={project.id}
              mediaType={project.mediaType}
              mediaSrc={project.mediaSrc}
              urlBarText={project.urlBarText}
              badge={project.badge}
            />
          </div>
        </div>

        {/* B. The Problem Section */}
        <div className="space-y-6 border-t border-white/[0.04] pt-14">
          <div className="flex items-center gap-4 mb-4">
            <span className="font-mono text-[0.55rem] tracking-[0.15em] uppercase text-bark/55">The Problem</span>
            <span className="h-px flex-1 bg-white/[0.04]" />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-10 lg:gap-14 items-start">
            <div className="max-w-[680px] space-y-4">
              <h2 className="font-display font-light text-bark text-2xl sm:text-3xl tracking-tight">
                Why this needed to exist
              </h2>
              <p className="font-body text-[0.875rem] text-bark/70 leading-relaxed">
                Every admission season at Panjab University, the same scene repeated itself. Students would walk into the admissions office holding printouts, scrolling through their phones, trying to find one specific answer buried somewhere in a sprawling university website (fee structure for a particular course, hostel deadlines, eligibility criteria that changed slightly every year).
              </p>
              <p className="font-body text-[0.875rem] text-bark/70 leading-relaxed">
                I spent time around the admissions office during my internship at the Design Innovation Centre and watched this happen first-hand. The information wasn't missing. It was just scattered across dozens of pages, PDFs, and notice boards, with no single place to just <em>ask</em> and get a direct answer. Search bars returned page links, not answers. The website wasn't built to be searched conversationally; it was built to be browsed.
              </p>
              <p className="font-body text-[0.875rem] text-bark/70 leading-relaxed">
                That gap became the brief: build something that could sit between a student's question and the university's information, and close that distance to a single response. I worked on this as part of a four-person team during my internship, and took on the system's frontend, the end-to-end pipeline build, and the API integration connecting Flask backend to the chat interface, while a teammate handled data cleaning and vector database conversion.
              </p>
            </div>
            
            {/* Screenshot Placeholder graphic */}
            <div className="relative aspect-[4/3] w-full bg-white/[0.01] border border-white/[0.06] rounded-xl flex flex-col items-center justify-center p-6 select-none overflow-hidden group hover:border-amber/20 transition-all duration-300">
              {/* Decorative grid pattern */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:16px_16px]" />
              <MessageSquare size={28} className="text-amber/40 mb-3 group-hover:scale-110 transition-transform duration-500" />
              <span className="font-mono text-[0.6rem] tracking-[0.15em] uppercase text-bark/40">Screenshot: chat interface</span>
              <span className="text-[0.5rem] text-bark/20 mt-1 font-mono uppercase">PU Admission Bot UI</span>
            </div>
          </div>
        </div>

        {/* C. The Approach Section */}
        <div className="space-y-6 border-t border-white/[0.04] pt-14">
          <div className="flex items-center gap-4 mb-4">
            <span className="font-mono text-[0.55rem] tracking-[0.15em] uppercase text-bark/55">The Approach</span>
            <span className="h-px flex-1 bg-white/[0.04]" />
          </div>

          <div className="space-y-6">
            <div className="max-w-[680px] space-y-4">
              <h2 className="font-display font-light text-bark text-2xl sm:text-3xl tracking-tight">
                How I broke the problem down
              </h2>
              <p className="font-body text-[0.875rem] text-bark/70 leading-relaxed">
                The core challenge wasn't "build a chatbot" (that part is almost commodity now). The real problem was <strong>trust</strong>. A chatbot that confidently gives a <em>wrong</em> fee amount or a wrong deadline is worse than no chatbot at all. So the system had to be grounded in actual university documents, not in whatever a language model "remembered" from training.
              </p>
              <p className="font-body text-[0.875rem] text-bark/70 leading-relaxed">
                That's what pulled the team toward a Retrieval-Augmented Generation architecture instead of a plain LLM wrapper. The idea is simple in concept and harder in execution: instead of asking the model to recall an answer, you first retrieve the most relevant pieces of real source documents, then ask the model to <em>compose</em> an answer strictly from that retrieved context.
              </p>
              <p className="font-body text-[0.875rem] text-bark/70 leading-relaxed">
                The pipeline came together in three layers:
              </p>
              <div className="pl-4 border-l-2 border-amber/30 space-y-3 pt-2 pb-2">
                <p className="font-body text-[0.875rem] text-bark/70 leading-relaxed">
                  <strong>Ingestion</strong>: university documents (admission guidelines, fee structures, hostel policies) get chunked and converted into vector embeddings, then indexed into ChromaDB so they can be searched by meaning, not just keyword matching. A teammate led the data cleaning and vector conversion work here.
                </p>
                <p className="font-body text-[0.875rem] text-bark/70 leading-relaxed">
                  <strong>Retrieval</strong>: when a student asks a question, the system doesn't go straight to the language model. It first searches the vector index for the most semantically relevant chunks of real content, using LlamaIndex to orchestrate the retrieval logic.
                </p>
                <p className="font-body text-[0.875rem] text-bark/70 leading-relaxed">
                  <strong>Generation</strong>: only after relevant context is retrieved does the query go to the LLM (via Groq's API, for fast inference), with strict instructions to answer using only the retrieved material, not general knowledge.
                </p>
              </div>
              <p className="font-body text-[0.875rem] text-bark/70 leading-relaxed">
                My focus was the system end to end: the Flask backend, the API integration tying retrieval and generation together, and the React frontend that gives students a familiar chat interface instead of forcing them to think in terms of "search" at all.
              </p>
            </div>

            {/* Pipeline Diagram */}
            <div className="pt-6">
              <PipelineDiagram />
            </div>
          </div>
        </div>

        {/* D. The Hard Part Section */}
        <div className="space-y-6 border-t border-white/[0.04] pt-14">
          <div className="flex items-center gap-4 mb-4">
            <span className="font-mono text-[0.55rem] tracking-[0.15em] uppercase text-bark/55">The Hard Part</span>
            <span className="h-px flex-1 bg-white/[0.04]" />
          </div>

          <div className="space-y-6">
            <h2 className="font-display font-light text-bark text-2xl sm:text-3xl tracking-tight">
              Where it actually got difficult
            </h2>

            <div className="bg-white/[0.015] border border-white/[0.06] rounded-2xl p-6 sm:p-8 md:p-10 relative overflow-hidden group">
              <div className="max-w-[680px] mb-8">
                <p className="font-body text-[0.875rem] text-bark/70 leading-relaxed">
                  Getting <em>a</em> chatbot working is a weekend project. Getting one that's <em>accurate enough to trust</em> is a different problem entirely, and that's where most of the real engineering time went.
                </p>
                <p className="font-body text-[0.875rem] text-bark/70 leading-relaxed mt-4">
                  Two things kept breaking in early versions:
                </p>
              </div>

              {/* Side-by-side challenges */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Challenge 1 */}
                <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-6 hover:border-amber/25 transition-all duration-300">
                  <h4 className="font-display font-medium text-bark text-base mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber" />
                    Retrieval precision
                  </h4>
                  <p className="font-body text-[0.8rem] text-bark/60 leading-relaxed">
                    Early on, the system would sometimes pull chunks of text that were topically related but not actually answering the question, a query about hostel fees would retrieve a chunk about hostel rules instead. The team had to iterate on chunking strategy (how documents get split before embedding) and tune the retrieval scoring together, since pulling the <em>wrong</em> but <em>related</em> context is more dangerous than pulling nothing, because the model will confidently generate an answer from it anyway.
                  </p>
                </div>

                {/* Challenge 2 */}
                <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-6 hover:border-amber/25 transition-all duration-300">
                  <h4 className="font-display font-medium text-bark text-base mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber" />
                    Response consistency
                  </h4>
                  <p className="font-body text-[0.8rem] text-bark/60 leading-relaxed">
                    The same question phrased two different ways needs to return the same factual answer. That meant testing the system against repeated variations of common questions and adjusting the prompt structure until the answers stopped drifting based on phrasing alone. Both of these were solved the unglamorous way through repeated testing cycles, not a single clever fix.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* E. The Result Section */}
        <div className="space-y-6 border-t border-white/[0.04] pt-14">
          <div className="flex items-center gap-4 mb-4">
            <span className="font-mono text-[0.55rem] tracking-[0.15em] uppercase text-bark/55">The Result</span>
            <span className="h-px flex-1 bg-white/[0.04]" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[45%_55%] gap-8 lg:gap-14 items-center">
            <div className="max-w-[680px] space-y-4">
              <h2 className="font-display font-light text-bark text-2xl sm:text-3xl tracking-tight">
                What came out of it
              </h2>
              <p className="font-body text-[0.875rem] text-bark/70 leading-relaxed">
                The result is a standalone, fully functional RAG system, not a prototype or a notebook demo. It indexes real admission documents, retrieves relevant context per query, and generates grounded answers through a clean chat interface, with suggested-question prompts to help students who don't know exactly what to ask yet.
              </p>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              <div className="bg-white/[0.015] border border-white/[0.04] rounded-xl p-6 text-center md:text-left hover:border-amber/20 transition-all duration-300">
                <div className="font-display text-4xl sm:text-5xl text-amber font-light tracking-tight mb-2">~60%</div>
                <div className="font-mono text-[0.58rem] tracking-[0.15em] uppercase text-bark/40 mb-2">Faster Query Resolution</div>
                <p className="text-[0.7rem] text-bark/60 leading-relaxed">
                  Compared to manually searching and browsing through the official university website.
                </p>
              </div>
              
              <div className="bg-white/[0.015] border border-white/[0.04] rounded-xl p-6 text-center md:text-left hover:border-amber/20 transition-all duration-300">
                <div className="font-display text-4xl sm:text-5xl text-amber font-light tracking-tight mb-2">~95%</div>
                <div className="font-mono text-[0.58rem] tracking-[0.15em] uppercase text-bark/40 mb-2">Data Consistency</div>
                <p className="text-[0.7rem] text-bark/60 leading-relaxed">
                  The same underlying question, asked different ways, returns consistent factual answers.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* F. What I'd Do Differently Section */}
        <div className="space-y-6 border-t border-white/[0.04] pt-14">
          <div className="flex items-center gap-4 mb-4">
            <span className="font-mono text-[0.55rem] tracking-[0.15em] uppercase text-bark/55">Future Work</span>
            <span className="h-px flex-1 bg-white/[0.04]" />
          </div>

          <div className="max-w-[680px] space-y-4">
            <h2 className="font-display font-light text-bark text-2xl sm:text-3xl tracking-tight">
              If I rebuilt this today
            </h2>
            <p className="font-body text-[0.875rem] text-bark/70 leading-relaxed">
              I'd add a feedback loop to let students flag when an answer felt wrong or incomplete, and feed that signal back into retraining the retrieval scoring over time. Right now the system is static once deployed; the next version I'd want it to get measurably better the more it's used, instead of staying frozen at whatever accuracy it shipped with.
            </p>
          </div>
        </div>

        {/* G. Footer / CTA Block */}
        <div className="border-t border-white/[0.04] pt-14 pb-10 space-y-8">
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <span className="font-mono text-[0.55rem] tracking-[0.15em] uppercase text-bark/45">Tech Stack Used</span>
            <div className="flex flex-wrap gap-2 justify-center max-w-2xl select-none">
              {["PYTHON", "FLASK", "LLAMAINDEX", "CHROMADB", "GROQ", "HUGGINGFACE", "REACT", "VERCEL"].map((tech) => (
                <span key={tech} className="tag-core">{tech}</span>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            {/* Live Demo with tooltip */}
            <div className="project-tooltip w-full sm:w-auto">
              <span className="tooltip-text">
                Hosted on free-tier infra (may be temporarily unavailable due to model size limits).
              </span>
              <button
                onClick={handleLiveDemoClick}
                className="font-mono text-[0.68rem] tracking-[0.12em] uppercase group/btn
                  text-night bg-amber rounded px-8 py-3.5 w-full sm:w-auto justify-center
                  hover:bg-[#D46200] hover:shadow-lg hover:shadow-amber/20
                  transition-all duration-300 cursor-none
                  inline-flex items-center gap-2"
              >
                Live Demo ↗
              </button>
            </div>

            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[0.68rem] tracking-[0.12em] uppercase group/btn
                text-bark/50 border border-white/[0.08] rounded px-8 py-3.5 w-full sm:w-auto justify-center
                hover:border-amber/30 hover:text-amber/70
                transition-all duration-300 cursor-none
                inline-flex items-center gap-2"
            >
              Source Code ↗
            </a>

            <button
              onClick={onClose}
              className="font-mono text-[0.68rem] tracking-[0.12em] uppercase group/btn
                text-bark/30 hover:text-bark/70 border border-transparent rounded px-8 py-3.5 w-full sm:w-auto justify-center
                transition-all duration-300 cursor-none
                inline-flex items-center gap-2"
            >
              ← Back to Projects
            </button>
          </div>
        </div>
      </div>

      {/* Confirm modal for Live Demo in Case Study */}
      {showConfirm && project.liveUrl && (
        <ConfirmModal url={project.liveUrl} onClose={() => setShowConfirm(false)} />
      )}
    </div>,
    document.body
  );
};

/* ═══════════════════════════════════════════════════════════
   Projects — main section
   ═══════════════════════════════════════════════════════════ */
const Projects: React.FC = () => {
  const featured = PROJECTS.find((p) => p.featured) || PROJECTS[0];
  const rest     = featured ? PROJECTS.filter((p) => p.id !== featured.id) : PROJECTS;
  const [showCaseStudy, setShowCaseStudy] = useState(false);

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === "#case-study-rag-chatbot") {
        setShowCaseStudy(true);
      } else {
        setShowCaseStudy(false);
      }
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  if (!featured) return null;

  return (
    <section id="projects" className="py-28 lg:py-36 bg-[#0A0A0C]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16">
        {/* Header */}
        <div className="flex items-center gap-4 mb-5 reveal" data-reveal>
          <span className="section-label">Projects</span>
          <span className="h-px w-10 bg-amber/30 block" />
        </div>
        <h2
          className="font-display font-light text-bark mb-8 reveal"
          data-reveal
          style={{ fontSize: "clamp(2.8rem, 5vw, 5rem)", letterSpacing: "-0.02em", lineHeight: 1.0 }}
        >
          Things I've<br />
          <em className="italic text-amber">built &amp; shipped</em>
        </h2>

        <p className="font-body text-[0.95rem] sm:text-[1.05rem] text-bark/70 leading-relaxed max-w-[680px] mb-12 reveal" data-reveal>
          I don't just ship features, I think in systems. Every project here started as a real constraint, not a tutorial: a university with no way to answer student questions at scale, an internship dashboard that needed three way negotiation logic, a phone full of bank SMS that no one wanted to sort manually. I care less about using the trendiest stack and more about whether the thing actually holds up, proper data flow, no hardcoded shortcuts, edge cases considered before they bite someone in production. What's below is a mix of internship work and personal builds, picked because each one taught me something I couldn't have learned by following a guide.
        </p>

        {/* Featured project */}
        <FeaturedCard
          project={featured}
          onOpenCaseStudy={() => {
            window.location.hash = "case-study-rag-chatbot";
          }}
        />

        {/* Other projects label */}
        <div className="flex items-center gap-4 mb-6 mt-14 reveal" data-reveal>
          <span className="font-mono text-[0.55rem] tracking-[0.15em] uppercase text-bark/55">
            Other Projects
          </span>
          <span className="h-px flex-1 bg-white/[0.04]" />
        </div>

        {/* Secondary project grid - 3 Columns on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rest.map((proj, idx) => (
            <SecondaryCard key={proj.id} project={proj} revealDelay={idx * 100} />
          ))}
        </div>

        {/* More projects row */}
        <MoreProjectsRow />
      </div>

      {/* Case Study Overlay */}
      {showCaseStudy && (
        <CaseStudyRagChatbot
          project={featured}
          onClose={() => {
            window.location.hash = "";
          }}
        />
      )}
    </section>
  );
};

export default Projects;
