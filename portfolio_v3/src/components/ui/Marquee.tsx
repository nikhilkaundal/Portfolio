import React from "react";

const ROW1 = [
  "React.js", "Next.js 15", "TypeScript", "Node.js",
  "Supabase", "PostgreSQL", "RAG Systems", "Flask · Python",
];
const ROW2 = [
  "Tailwind CSS", "Full Stack Developer", "LlamaIndex", "Turborepo",
  "Power BI", "ChromaDB", "JWT Auth", "RBAC",
];

const MarqueeRow: React.FC<{ items: string[]; reverse?: boolean; speed?: string; outline?: boolean }> = ({
  items, reverse = false, speed = "28s", outline = false
}) => (
  <div className="overflow-hidden py-1.5 sm:py-2">
    <div
      className="flex gap-0 whitespace-nowrap items-center"
      style={{ animation: `${reverse ? "marqueeRev" : "marquee"} ${speed} linear infinite`, width: "max-content" }}
    >
      {[...items, ...items].map((item, i) => (
        <React.Fragment key={i}>
          <span
            className={`font-mono text-xs sm:text-sm uppercase tracking-[0.2em] font-medium px-4 sm:px-6 lg:px-8 transition-all duration-300
              ${outline ? "text-amber/80 font-semibold" : "text-bark/60 hover:text-bark"}`}
          >
            {item}
          </span>
          <span className="text-amber/55 self-center text-[0.65rem] sm:text-xs">◆</span>
        </React.Fragment>
      ))}
    </div>
  </div>
);

const Marquee: React.FC = () => (
  <div className="border-t border-b border-bark/10 py-3 overflow-hidden bg-night select-none">
    <MarqueeRow items={ROW1} speed="32s" />
    <MarqueeRow items={ROW2} reverse speed="38s" outline />
  </div>
);

export default Marquee;
