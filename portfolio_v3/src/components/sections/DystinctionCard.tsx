import React, { useState } from "react";
import { DYSTINCTION_EXP } from "../../data/portfolio";

// ── Types ─────────────────────────────────────────────────────────
interface Module {
  id: string;
  name: string;
  emoji: string;
  shortDesc: string;
  details: string[];
  tech: string[];
}

// ── Sub-components ────────────────────────────────────────────────

/** Single accordion row */
const ModuleRow: React.FC<{ mod: Module; isOpen: boolean; onToggle: () => void }> = ({
  mod,
  isOpen,
  onToggle,
}) => (
  <div
    className={`border-b border-amber/10 last:border-b-0 transition-colors duration-200
      ${isOpen ? "bg-amber/[0.03]" : "hover:bg-amber/[0.02]"}`}
  >
    {/* Row header — click to toggle */}
    <button
      onClick={onToggle}
      className="w-full flex items-center gap-4 px-4 py-3.5 sm:px-5 sm:py-4 text-left group"
    >
      {/* Emoji icon */}
      <span className="text-xl flex-shrink-0 w-7">{mod.emoji}</span>

      {/* Name + short desc */}
      <div className="flex-1 min-w-0">
        <p
          className={`font-body font-medium text-sm transition-colors duration-200
            ${isOpen ? "text-amber" : "text-bark group-hover:text-amber"}`}
        >
          {mod.name}
        </p>
        <p className="font-mono text-[0.6rem] tracking-[0.08em] text-bark/35 truncate mt-0.5">
          {mod.shortDesc}
        </p>
      </div>

      {/* Tech pills — visible only when collapsed */}
      {!isOpen && (
        <div className="hidden lg:flex gap-1.5 flex-shrink-0">
          {mod.tech.slice(0, 3).map((t) => (
            <span
              key={t}
              className="font-mono text-[0.55rem] tracking-[0.06em] uppercase
                px-1.5 py-0.5 border border-amber/15 text-bark/35"
            >
              {t}
            </span>
          ))}
        </div>
      )}

      {/* Arrow */}
      <span
        className={`font-mono text-amber/50 text-xs flex-shrink-0 transition-transform duration-300
          ${isOpen ? "rotate-180" : "rotate-0"}`}
      >
        ▼
      </span>
    </button>

    {/* Expanded content */}
    <div
      className={`overflow-hidden transition-all duration-400 ease-in-out
        ${isOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"}`}
    >
      <div className="px-4 pb-4 pl-10 sm:pl-16">
        {/* Detail bullets */}
        <ul className="space-y-2 mb-4">
          {mod.details.map((detail, i) => (
            <li
              key={i}
              className="font-body text-[0.84rem] text-bark/55 leading-relaxed"
            >
              {detail}
            </li>
          ))}
        </ul>

        {/* Tech tags */}
        <div className="flex flex-wrap gap-1.5">
          {mod.tech.map((t) => (
            <span
              key={t}
              className="font-mono text-[0.6rem] tracking-[0.08em] uppercase
                px-2 py-1 border border-amber/20 text-amber/60 bg-amber/[0.04]"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  </div>
);

interface DystinctionCardProps {
  isActive?: boolean;
}

// ── Main Card ─────────────────────────────────────────────────────
const DystinctionCard: React.FC<DystinctionCardProps> = ({ isActive = false }) => {
  const [openModuleId, setOpenModuleId] = useState<string | null>(null);
  const [showAllModules, setShowAllModules] = useState(false);
  const exp = DYSTINCTION_EXP;

  const visibleModules = showAllModules
    ? exp.modules
    : exp.modules.slice(0, 4);

  const toggle = (id: string) =>
    setOpenModuleId((prev) => (prev === id ? null : id));

  return (
    <div
      className={`relative border overflow-hidden transition-all duration-500 hover:border-amber/25
        hover:shadow-[0_16px_60px_rgba(192,88,0,0.08)]
        ${isActive ? "border-amber/20 bg-surface/60 shadow-[0_0_30px_rgba(192,88,0,0.08)]" : "border-amber/12 bg-surface/40 backdrop-blur-md"}`}
    >
      {/* ── Watermark company name ── */}
      <div
        className="absolute top-4 right-0 font-display font-light italic
          text-[5rem] leading-none text-bark/[0.04] pointer-events-none
          select-none overflow-hidden whitespace-nowrap"
        style={{ fontSize: "clamp(3rem,7vw,6rem)" }}
        aria-hidden
      >
        Dystinction
      </div>

      {/* ── Card body ── */}
      <div className="relative p-5 sm:p-8 lg:p-10">

        {/* ── Header row ── */}
        <div className="flex flex-col lg:flex-row lg:items-start gap-6 mb-8">
          <div className="flex-1">

            {/* Period + location */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span
                className="font-mono text-[0.65rem] tracking-[0.12em] uppercase
                  text-bark bg-amber px-2.5 py-1"
              >
                {exp.period}
              </span>
              <span className="font-mono text-[0.6rem] tracking-[0.08em] text-bark/35">
                {exp.location}
              </span>
            </div>

            {/* Role */}
            <h3
              className="font-display font-light text-bark leading-tight mb-1"
              style={{
                fontSize: "clamp(1.6rem, 2.8vw, 2.4rem)",
                letterSpacing: "-0.02em",
              }}
            >
              {exp.role}
            </h3>
            <p className="font-display italic text-amber text-lg font-light mb-1">
              {exp.roleTag}
            </p>

            {/* Company */}
            <p className="font-body text-[0.85rem] font-medium text-bark/55 mb-3">
              {exp.company} &nbsp;·&nbsp;{" "}
              <span className="text-amber/70">{exp.product}</span>
            </p>

            {/* Tagline */}
            <p className="font-body text-[0.88rem] text-bark/45 leading-relaxed max-w-xl">
              {exp.tagline}
            </p>
          </div>

          {/* ── Metric badges ── */}
          <div className="grid grid-cols-3 lg:flex lg:flex-col gap-3 w-full lg:w-auto flex-shrink-0">
            {exp.metrics.map((m) => (
              <div
                key={m.label}
                className="border border-amber/20 bg-surface/80 px-1 py-2.5 sm:px-4 sm:py-3 text-center
                  min-w-0 sm:min-w-[80px]"
              >
                <p
                  className="font-display font-light text-amber leading-none mb-1"
                  style={{ fontSize: "clamp(1.4rem, 2vw, 2rem)" }}
                >
                  {m.value}
                </p>
                <p className="font-mono text-[0.55rem] tracking-[0.1em] uppercase text-bark/35">
                  {m.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Highlights ── */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="font-mono text-[0.62rem] tracking-[0.2em] uppercase text-amber/70">
              Key Contributions
            </span>
            <span className="h-px flex-1 bg-amber/10" />
          </div>
          <ul className="space-y-3">
            {exp.highlights.map((h, i) => (
              <li
                key={i}
                className="font-body text-[0.875rem] text-bark/60 leading-relaxed
                  flex gap-3"
              >
                <span className="text-amber/50 font-mono text-xs mt-1 flex-shrink-0">
                  0{i + 1}
                </span>
                <span>{h}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Tech stack ── */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="font-mono text-[0.62rem] tracking-[0.2em] uppercase text-amber/70">
              Tech Stack
            </span>
            <span className="h-px flex-1 bg-amber/10" />
          </div>
          <div className="flex flex-wrap gap-2">
            {exp.tech.map((t) => (
              <span
                key={t}
                className="font-mono text-[0.62rem] tracking-[0.07em] uppercase
                  px-2.5 py-1 border border-amber/15 text-bark/45
                  hover:border-amber/35 hover:text-amber transition-all duration-200"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* ── Modules Accordion ── */}
        <div>
          <div className="flex items-center gap-3 mb-1">
            <span className="font-mono text-[0.62rem] tracking-[0.2em] uppercase text-amber/70">
              Modules Shipped
            </span>
            <span className="h-px flex-1 bg-amber/10" />
            <span className="font-mono text-[0.58rem] text-bark/30">
              Click to expand
            </span>
          </div>

          {/* Accordion container */}
          <div className="border border-amber/12 divide-y divide-amber/8">
            {visibleModules.map((mod) => (
              <ModuleRow
                key={mod.id}
                mod={mod}
                isOpen={openModuleId === mod.id}
                onToggle={() => toggle(mod.id)}
              />
            ))}
          </div>

          {/* Show more / less */}
          {exp.modules.length > 4 && (
            <button
              onClick={() => setShowAllModules((p) => !p)}
              className="mt-3 w-full font-mono text-[0.65rem] tracking-[0.15em] uppercase
                text-amber/50 hover:text-amber border border-dashed border-amber/20
                hover:border-amber/40 py-2.5 transition-all duration-200"
            >
              {showAllModules
                ? `↑ Show less`
                : `↓ Show all ${exp.modules.length} modules`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DystinctionCard;
