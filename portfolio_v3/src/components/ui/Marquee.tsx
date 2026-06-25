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
  <div className="overflow-hidden py-2">
    <div
      className="flex gap-0 whitespace-nowrap"
      style={{ animation: `${reverse ? "marqueeRev" : "marquee"} ${speed} linear infinite`, width: "max-content" }}
    >
      {[...items, ...items].map((item, i) => (
        <React.Fragment key={i}>
          <span
            className={`font-display italic text-lg lg:text-xl font-light px-6 lg:px-8 tracking-wide transition-all duration-300
              ${outline ? "text-stroke text-transparent" : "text-bark/25"}`}
          >
            {item}
          </span>
          <span className="text-amber/30 self-center text-xs">◆</span>
        </React.Fragment>
      ))}
    </div>
  </div>
);

const Marquee: React.FC = () => (
  <div className="border-t border-b border-white/[0.04] py-3 overflow-hidden bg-night select-none">
    <MarqueeRow items={ROW1} speed="32s" />
    <MarqueeRow items={ROW2} reverse speed="38s" outline />
  </div>
);

export default Marquee;
