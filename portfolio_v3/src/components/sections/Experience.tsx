import React, { useState, useEffect, useRef } from "react";
import { EXPERIENCES } from "../../data/portfolio";

const Experience: React.FC = () => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  /* Auto-activate card when it scrolls into center */
  useEffect(() => {
    const cards = document.querySelectorAll<HTMLElement>("[data-exp-id]");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId((entry.target as HTMLElement).dataset.expId || null);
          }
        });
      },
      { threshold: 0.5 }
    );
    cards.forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, []);

  return (
    <section id="experience" className="py-28 lg:py-36 bg-night">
      <div className="max-w-7xl mx-auto px-8 lg:px-16">
        {/* Header */}
        <div className="flex items-center gap-4 mb-5 reveal" data-reveal>
          <span className="section-label">Work</span>
          <span className="h-px w-10 bg-amber/30 block" />
        </div>
        <h2
          className="font-display font-light text-bark mb-16 lg:mb-20 reveal"
          data-reveal
          style={{ fontSize: "clamp(2.8rem, 5vw, 5rem)", letterSpacing: "-0.02em", lineHeight: 1.0 }}
        >
          Where I've<br />
          <em className="italic text-amber">built things</em>
        </h2>

        {/* Timeline layout */}
        <div ref={sectionRef} className="relative">
          {/* Vertical timeline line */}
          <div className="absolute left-4 lg:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-amber/20 to-transparent" />

          {EXPERIENCES.map((exp, idx) => {
            const isActive = activeId === exp.id;
            return (
              <div
                key={exp.id}
                data-exp-id={exp.id}
                className="relative pl-12 lg:pl-20 mb-8 lg:mb-12 last:mb-0 reveal"
                data-reveal
                data-reveal-delay={String(idx * 0.15)}
              >
                {/* Timeline dot */}
                <div
                  className={`absolute left-[11px] lg:left-[27px] top-8 w-3 h-3 rounded-full border-2 border-night transition-all duration-500
                    ${isActive
                      ? "bg-amber-glow shadow-[0_0_16px_rgba(255,122,26,0.6),0_0_40px_rgba(255,122,26,0.2)]"
                      : "bg-amber/50 shadow-[0_0_8px_rgba(192,88,0,0.3)]"
                    }`}
                />

                {/* Card */}
                <div
                  className={`glass-card p-8 lg:p-10 relative overflow-hidden transition-all duration-500
                    ${isActive ? "border-amber/20 shadow-[0_0_30px_rgba(192,88,0,0.08)]" : ""}`}
                  onMouseEnter={() => setActiveId(exp.id)}
                >
                  {/* Company watermark */}
                  <div
                    className="absolute -right-4 -top-4 font-display font-light text-stroke-lg pointer-events-none select-none hidden lg:block"
                    style={{
                      fontSize: "clamp(4rem, 8vw, 7rem)",
                      opacity: isActive ? 0.7 : 0.3,
                      transition: "opacity 0.5s",
                    }}
                  >
                    {exp.company.split("·")[0].trim().split(" ")[0]}
                  </div>

                  {/* Period badge */}
                  <div className="flex items-center gap-3 mb-4">
                    <span className="font-mono text-[0.62rem] tracking-[0.12em] uppercase text-amber bg-amber/8 px-3 py-1.5 border border-amber/15">
                      {exp.period}
                    </span>
                    <span className="font-mono text-[0.58rem] tracking-[0.08em] text-bark/25">
                      {exp.location}
                    </span>
                  </div>

                  {/* Role & Company */}
                  <h3
                    className="font-display font-light text-bark mb-1"
                    style={{ fontSize: "clamp(1.5rem, 2.5vw, 2.2rem)", letterSpacing: "-0.01em" }}
                  >
                    {exp.role}
                  </h3>
                  <p className="font-body text-[0.85rem] text-amber/60 mb-6 font-medium tracking-wide">
                    {exp.company}
                  </p>

                  {/* Points */}
                  <ul className="space-y-3 mb-6">
                    {exp.points.map((pt, i) => (
                      <li
                        key={i}
                        className="font-body text-[0.875rem] text-bark/40 leading-relaxed
                          pl-5 relative before:content-['▸'] before:absolute before:left-0
                          before:text-amber/40 before:text-sm"
                      >
                        {pt}
                      </li>
                    ))}
                  </ul>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {exp.tags.map((tag, tagIdx) => (
                      <span
                        key={tag}
                        className={`font-mono text-[0.58rem] tracking-[0.08em] uppercase px-3 py-1.5
                          border transition-all duration-300
                          ${isActive
                            ? "border-amber/25 text-amber/70"
                            : "border-white/[0.04] text-bark/20"
                          }`}
                        style={{
                          transitionDelay: isActive ? `${tagIdx * 50}ms` : "0ms",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Experience;
