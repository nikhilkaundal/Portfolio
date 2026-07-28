import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { EXPERIENCES } from "../../data/portfolio";
import DystinctionCard from "./DystinctionCard";
import DICCard from "./DICCard";

// ── Main Experience Section ─────────────────────────────────────────
const Experience: React.FC = () => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Parallax scroll effect for background "WORK" watermark text
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Smooth spring physics for buttery fluid scroll glide
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 24,
    restDelta: 0.001,
  });

  // Parallax drift inside sticky viewport container (glides down across entire section)
  const watermarkY = useTransform(smoothProgress, [0, 1], ["-40px", "320px"]);
  // Glowing laser fill for timeline rail
  const railFillHeight = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);

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
      { threshold: 0.3 }
    );
    cards.forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, []);

  return (
    <section id="experience" ref={sectionRef} className="py-28 lg:py-36 bg-night relative overflow-hidden">
      {/* Sticky Watermark Track — Stays pinned & glides down 100% of Work section until Contact begins */}
      <div className="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden" aria-hidden>
        <div className="sticky top-[16vh] h-[calc(100%-16vh)] w-full flex items-start justify-start pl-3 sm:pl-8 lg:pl-14">
          <motion.div
            style={{ y: watermarkY }}
            className="origin-left"
          >
            <span className="font-display text-[25vw] sm:text-[18vw] font-black uppercase tracking-[0.12em] text-bark/[0.08] dark:text-bark/[0.05] leading-none block whitespace-nowrap">
              WORK
            </span>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 lg:px-16 relative z-10">
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
          Where I&apos;ve<br />
          <em className="italic text-amber">built things</em>
        </h2>

        {/* Timeline layout */}
        <div className="relative">
          {/* Vertical timeline line with glowing scroll progress fill */}
          <div className="absolute left-3 sm:left-4 lg:left-8 top-0 bottom-0 w-px bg-bark/10">
            <motion.div
              style={{ height: railFillHeight }}
              className="w-full bg-gradient-to-b from-amber via-amber-glow to-amber shadow-[0_0_12px_rgba(235,94,0,0.6)]"
            />
          </div>

          {EXPERIENCES.map((exp, idx) => {
            const isActive = activeId === exp.id;
            return (
              <div
                key={exp.id}
                data-exp-id={exp.id}
                className="relative pl-8 sm:pl-12 lg:pl-20 mb-8 lg:mb-12 last:mb-0 reveal"
                data-reveal
                data-reveal-delay={String(idx * 0.15)}
              >
                {/* Timeline dot */}
                <div
                  className={`absolute left-[6px] sm:left-[10px] lg:left-[26px] top-8 w-3 h-3 rounded-full border-2 border-night transition-all duration-500
                    ${isActive
                      ? "bg-amber-glow shadow-[0_0_16px_rgba(255,122,26,0.6),0_0_40px_rgba(255,122,26,0.2)]"
                      : "bg-amber/50 shadow-[0_0_8px_rgba(192,88,0,0.3)]"
                    }`}
                />

                {/* Card */}
                {exp.id === "exp-dystinction" ? (
                  <div onMouseEnter={() => setActiveId(exp.id)}>
                    <DystinctionCard isActive={isActive} />
                  </div>
                ) : exp.id === "exp-dic" ? (
                  <div onMouseEnter={() => setActiveId(exp.id)}>
                    <DICCard isActive={isActive} />
                  </div>
                ) : (
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
                      <span className="font-mono text-[0.58rem] tracking-[0.08em] text-bark/40">
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
                    <p className="font-body text-[0.85rem] text-amber/70 mb-6 font-medium tracking-wide">
                      {exp.company}
                    </p>

                    {/* Points */}
                    <ul className="space-y-3 mb-6">
                      {exp.points.map((pt, i) => (
                        <li
                          key={i}
                          className="font-body text-[0.875rem] text-bark/55 leading-relaxed
                            pl-5 relative before:content-['▸'] before:absolute before:left-0
                            before:text-amber/50 before:text-sm"
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
                              : "border-bark/15 text-bark/35"
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
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Experience;
