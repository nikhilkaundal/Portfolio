import React, { useState } from "react";
import { DIC_EXP } from "../../data/dic_experience";

// ── Types ─────────────────────────────────────────────────────────
interface Module {
  id: string;
  name: string;
  shortDesc: string;
  details: string[];
  tech: string[];
}

// ── ModuleRow ─────────────────────────────────────────────────────
const ModuleRow: React.FC<{
  mod: Module;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}> = ({ mod, index, isOpen, onToggle }) => (
  <div
    className={`transition-colors duration-200
      ${isOpen ? "bg-amber/[0.05]" : "hover:bg-amber/[0.03]"}`}
  >
    {/* Row header */}
    <button
      onClick={onToggle}
      className="w-full flex items-center gap-4 px-4 py-3.5 sm:px-5 sm:py-4 text-left group"
    >
      {/* Numbered index badge */}
      <span
        className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center border font-mono text-[0.58rem] tracking-[0.06em] transition-all duration-200
          ${isOpen
            ? "border-amber text-amber bg-amber/15 shadow-[0_0_12px_rgba(235,94,0,0.2)]"
            : "border-bark/15 text-bark/40 group-hover:border-amber/40 group-hover:text-amber"
          }`}
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      <div className="flex-1 min-w-0">
        <p
          className={`font-body font-medium text-sm transition-colors duration-200
            ${isOpen ? "text-amber" : "text-bark group-hover:text-amber"}`}
        >
          {mod.name}
        </p>
        <p className="font-mono text-[0.6rem] tracking-[0.08em] text-bark/40 truncate mt-0.5">
          {mod.shortDesc}
        </p>
      </div>

      {/* Tech pills — collapsed only */}
      {!isOpen && (
        <div className="hidden lg:flex gap-1.5 flex-shrink-0">
          {mod.tech.slice(0, 3).map((t) => (
            <span
              key={t}
              className="font-mono text-[0.55rem] tracking-[0.06em] uppercase
                px-2 py-0.5 rounded-md border border-amber/15 bg-amber/[0.02] text-bark/40"
            >
              {t}
            </span>
          ))}
        </div>
      )}

      {/* Chevron SVG */}
      <svg
        className={`w-3.5 h-3.5 flex-shrink-0 text-amber/50 transition-transform duration-300
          ${isOpen ? "rotate-180 text-amber" : "rotate-0"}`}
        viewBox="0 0 12 12"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M2 4l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>

    {/* Expanded details */}
    <div
      className={`overflow-hidden transition-all duration-400 ease-in-out
        ${isOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"}`}
    >
      <div className="px-4 pb-5 pl-14 sm:pl-16 border-t border-amber/10">
        <ul className="space-y-2.5 mb-4 pt-4">
          {mod.details.map((detail, i) => (
            <li
              key={i}
              className="font-body text-[0.84rem] text-bark/60 leading-relaxed flex gap-3"
            >
              <span className="text-amber/40 font-mono text-[0.6rem] mt-0.5 flex-shrink-0">—</span>
              <span>{detail}</span>
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap gap-1.5">
          {mod.tech.map((t) => (
            <span
              key={t}
              className="font-mono text-[0.6rem] tracking-[0.08em] uppercase
                px-2.5 py-1 rounded-lg border border-amber/20 text-amber/70 bg-amber/[0.04]
                hover:border-amber/40 hover:text-amber transition-all duration-200"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// ── Main DICCard ──────────────────────────────────────────────────

interface DICCardProps {
  isActive?: boolean;
}

const DICCard: React.FC<DICCardProps> = ({ isActive = false }) => {
  const [openModuleId, setOpenModuleId] = useState<string | null>(null);
  const [showAllModules, setShowAllModules] = useState(false);
  const exp = DIC_EXP;

  const visibleModules = showAllModules
    ? exp.modules
    : exp.modules.slice(0, 4);

  const toggle = (id: string) =>
    setOpenModuleId((prev) => (prev === id ? null : id));

  return (
    <div
      className={`relative border rounded-3xl overflow-hidden transition-all duration-500 hover:border-amber/30
        hover:shadow-[0_16px_60px_rgba(192,88,0,0.08)]
        ${isActive ? "border-amber/25 bg-surface/60 shadow-[0_0_30px_rgba(192,88,0,0.08)]" : "border-amber/15 bg-surface/40 backdrop-blur-md"}`}
    >
      {/* ── Watermark ── */}
      <div
        className="absolute top-4 right-0 font-display font-light italic
          leading-none text-bark/[0.04] pointer-events-none
          select-none overflow-hidden whitespace-nowrap"
        style={{ fontSize: "clamp(3rem,7vw,6rem)" }}
        aria-hidden
      >
        Design
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
                  text-bark bg-amber px-3 py-1 rounded-full font-medium"
              >
                {exp.period}
              </span>
              <span className="font-mono text-[0.6rem] tracking-[0.08em] text-bark/40">
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
            <p className="font-body text-[0.85rem] font-medium text-bark/60 mb-3">
              {exp.company}&nbsp;·&nbsp;
              <span className="text-amber/80">{exp.product}</span>
            </p>

            {/* Tagline */}
            <p className="font-body text-[0.88rem] text-bark/50 leading-relaxed max-w-xl">
              {exp.tagline}
            </p>
          </div>

          {/* ── Metric badges ── */}
          <div className="grid grid-cols-3 lg:flex lg:flex-col gap-3 w-full lg:w-auto flex-shrink-0">
            {exp.metrics.map((m) => (
              <div
                key={m.label}
                className="border border-amber/20 bg-surface/80 rounded-2xl px-2 py-2.5 sm:px-4 sm:py-3 text-center min-w-0 sm:min-w-[80px]"
              >
                <p
                  className="font-display font-light text-amber leading-none mb-1"
                  style={{ fontSize: "clamp(1.4rem, 2vw, 2rem)" }}
                >
                  {m.value}
                </p>
                <p className="font-mono text-[0.55rem] tracking-[0.1em] uppercase text-bark/40">
                  {m.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Highlights ── */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="font-mono text-[0.62rem] tracking-[0.2em] uppercase text-amber/80 font-medium">
              Key Contributions
            </span>
            <span className="h-px flex-1 bg-amber/15" />
          </div>
          <ul className="space-y-3">
            {exp.highlights.map((h, i) => (
              <li
                key={i}
                className="font-body text-[0.875rem] text-bark/65 leading-relaxed flex gap-3"
              >
                <span className="text-amber/60 font-mono text-xs mt-1 flex-shrink-0">
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
            <span className="font-mono text-[0.62rem] tracking-[0.2em] uppercase text-amber/80 font-medium">
              Tech Stack
            </span>
            <span className="h-px flex-1 bg-amber/15" />
          </div>
          <div className="flex flex-wrap gap-2">
            {exp.tech.map((t) => (
              <span
                key={t}
                className="font-mono text-[0.62rem] tracking-[0.07em] uppercase
                  px-3 py-1 rounded-lg border border-amber/20 text-bark/55 bg-amber/[0.02]
                  hover:border-amber/40 hover:text-amber transition-all duration-200"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* ── Modules Accordion ── */}
        <div>
          <div className="flex items-center gap-3 mb-3">
            <span className="font-mono text-[0.62rem] tracking-[0.2em] uppercase text-amber/80 font-medium">
              What I Built
            </span>
            <span className="h-px flex-1 bg-amber/15" />
            <span className="font-mono text-[0.58rem] text-bark/40">
              Click to expand
            </span>
          </div>

          <div className="rounded-2xl border border-amber/15 bg-bark/[0.02] overflow-hidden divide-y divide-amber/10 shadow-sm">
            {visibleModules.map((mod, i) => (
              <ModuleRow
                key={mod.id}
                mod={mod}
                index={i}
                isOpen={openModuleId === mod.id}
                onToggle={() => toggle(mod.id)}
              />
            ))}
          </div>

          {exp.modules.length > 4 && (
            <button
              onClick={() => setShowAllModules((p) => !p)}
              className="mt-3.5 w-full rounded-xl font-mono text-[0.65rem] tracking-[0.15em] uppercase
                text-amber bg-amber/[0.04] border border-amber/20
                hover:bg-amber/12 hover:border-amber/40 py-3 transition-all duration-300 font-medium"
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

export default DICCard;
