import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Skill, SKILLS_DATA, SkillCategory } from "../../data/skillsData";

// Category colors (Hex codes from spec)
const CATEGORY_COLORS: Record<SkillCategory, string> = {
  FRONTEND: "#E8724A",
  BACKEND:  "#6B8CBA",
  DATABASE: "#7BAF7B",
  AI:       "#A97EC4",
  DEVOPS:   "#C4A45A",
  DATA:     "#7AABB8",
};

// Helper to force specific dark/black logos to white for visibility on dark background
const getIconUrl = (slug: string) => {
  if (slug === "llamaindex") {
    return "/proof/llamaindex.png";
  }
  if (slug === "chromadb") {
    return "/proof/chromadb.svg";
  }
  const darkLogos = ["nextdotjs", "express", "flask", "jsonwebtokens", "github"];
  if (darkLogos.includes(slug)) {
    const theme = typeof document !== "undefined" ? document.documentElement.getAttribute("data-theme") : "dark";
    const color = theme === "light" ? "1a1613" : "ffffff";
    return `https://cdn.simpleicons.org/${slug}/${color}`;
  }
  return `https://cdn.simpleicons.org/${slug}`;
};

const renderStatsStrip = (skill: Skill) => {
  return (
    <div className="flex gap-2.5 items-stretch w-full mb-5 select-none">
      {/* Box 1: Used At */}
      <div className="flex-1 min-w-0 bg-night border border-skills-borderInactive rounded-[6px] p-2 sm:p-3">
        <span className="block text-[9px] font-bold text-skills-dark uppercase tracking-[0.1em] mb-1">
          Used At
        </span>
        <span className="block text-[11px] sm:text-[13px] font-semibold text-skills-white break-words">
          {skill.stats.usedAt}
        </span>
      </div>

      {/* Box 2: Impact */}
      <div className="flex-1 min-w-0 bg-night border border-skills-borderInactive rounded-[6px] p-2 sm:p-3">
        <span className="block text-[9px] font-bold text-skills-dark uppercase tracking-[0.1em] mb-1">
          Impact
        </span>
        <span className="block text-[11px] sm:text-[13px] font-semibold text-skills-white break-words" title={skill.stats.impact}>
          {skill.stats.impact}
        </span>
      </div>

      {/* Box 3: Since */}
      <div className="flex-1 min-w-0 bg-night border border-skills-borderInactive rounded-[6px] p-2 sm:p-3">
        <span className="block text-[9px] font-bold text-skills-dark uppercase tracking-[0.1em] mb-1">
          Since
        </span>
        <span className="block text-[11px] sm:text-[13px] font-semibold text-skills-white break-words">
          {skill.stats.since}
        </span>
      </div>
    </div>
  );
};

const renderPreviewImage = (skill: Skill) => {
  const previewImage = skill.proof.previewImage;

  if (previewImage) {
    return (
      <img
        src={previewImage}
        alt={`${skill.name} project preview`}
        className="w-full h-[160px] object-cover rounded-[6px] border border-skills-borderInactive mt-5 mb-2 bg-skills-bgInactive"
        loading="lazy"
      />
    );
  }
  return null;
};

interface SkillsSectionProps {
  activeCategory: string;
  selectedSkill: Skill | null;
  setSelectedSkill: (skill: Skill | null) => void;
}

const SkillsSection: React.FC<SkillsSectionProps> = ({
  activeCategory,
  selectedSkill,
  setSelectedSkill,
}) => {
  const [iconErrors, setIconErrors] = useState<Record<string, boolean>>({});
  const [isMobile, setIsMobile] = useState(false);
  const [animateKey, setAnimateKey] = useState(0);
  const [activeSkill, setActiveSkill] = useState<Skill | null>(null);
  const [mounted, setMounted] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [, setTick] = useState(0);

  // Set mounted on client side
  useEffect(() => {
    setMounted(true);
  }, []);

  // Listen to custom themechange events to force re-render icon URLs
  useEffect(() => {
    const handleThemeChange = () => setTick((t) => t + 1);
    window.addEventListener("themechange", handleThemeChange);
    return () => window.removeEventListener("themechange", handleThemeChange);
  }, []);

  // Check if screen is mobile
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Prevent background scroll on body when mobile popup is open
  useEffect(() => {
    if (isMobile && selectedSkill) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedSkill, isMobile]);

  // Whenever selected skill changes, trigger fade-in slide-up animation in proof panel
  // Also track the active skill for smooth mobile drawer exit transitions, and reset scroll
  useEffect(() => {
    if (selectedSkill) {
      setActiveSkill(selectedSkill);
      setAnimateKey((prev) => prev + 1);

      // Auto scroll the mobile bottom sheet details back to the top when switching skills
      setTimeout(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTop = 0;
        }
      }, 0);
    }
  }, [selectedSkill]);

  // Handle icon load errors
  const handleIconError = (skillId: string) => {
    setIconErrors((prev) => ({ ...prev, [skillId]: true }));
  };

  // Get matching skills for active filter
  const visibleSkills = SKILLS_DATA;

  // Render initials for SVG fallback
  const getInitials = (name: string) => {
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="w-full">
      {/* Local custom keyframe styles to avoid external CSS requirements */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes slideUpFade {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .proof-animate {
          animation: slideUpFade 200ms ease-out forwards;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(var(--bark-rgb), 0.01);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(var(--bark-rgb), 0.1);
          border-radius: 2px;
        }
      `}} />

      <div className="flex flex-col md:flex-row gap-6 items-stretch w-full">
        {/* LEFT PANEL: Grid of Cards (65% width on desktop) */}
        <div className="w-full md:w-[65%]">
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-3">
            {visibleSkills.map((skill) => {
               const isActive = selectedSkill?.id === skill.id;
               const isPrimary = skill.tier === "primary";
               
               // Filter fade opacity logic:
               // When activeCategory is "All", cards are full opacity.
               // When a specific category is selected, matching cards are full opacity (1),
               // and non-matching cards fade to 0.25 opacity.
               const matchesFilter = activeCategory === "All" || skill.category === activeCategory.toUpperCase();
               const cardOpacity = matchesFilter ? "opacity-100" : "opacity-25";
 
               // Category specific styling
               const categoryColor = CATEGORY_COLORS[skill.category];
 
               return (
                 <div
                   key={skill.id}
                   onClick={() => matchesFilter && setSelectedSkill(skill)}
                   className={`
                     flex items-center gap-2 sm:gap-3 rounded-lg border cursor-pointer select-none
                     transition-all duration-150 ease-in-out
                     ${cardOpacity}
                     ${isPrimary ? "p-3 sm:p-5" : "p-2.5 sm:p-4"}
                     ${isActive
                       ? "border-skills-borderActive bg-skills-bgActive"
                       : "border-skills-borderInactive bg-skills-bgInactive hover:border-skills-borderHover hover:scale-[1.01]"
                     }
                   `}
                 >
                   {/* Left Side: Skill Icon */}
                   <div className="flex-shrink-0 flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded">
                     {iconErrors[skill.id] ? (
                       <div
                         className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-mono text-[0.6rem] sm:text-[0.7rem] font-bold"
                         style={{
                           backgroundColor: `${categoryColor}15`,
                           color: categoryColor,
                           border: `1px solid ${categoryColor}30`,
                         }}
                       >
                         {getInitials(skill.name)}
                       </div>
                     ) : (
                       <img
                         src={getIconUrl(skill.iconSlug)}
                         alt={skill.name}
                         width="32"
                         height="32"
                         onError={() => handleIconError(skill.id)}
                         className="w-6 h-6 sm:w-8 sm:h-8 object-contain"
                       />
                     )}
                   </div>
 
                   {/* Right Side: Label + Category Name */}
                   <div className="min-w-0 flex-1">
                     <h4
                      className={`font-body truncate leading-tight font-semibold
                         ${isPrimary ? "text-[0.8rem] sm:text-[0.94rem]" : "text-[0.72rem] sm:text-[0.88rem]"}
                         ${isActive ? "text-skills-borderActive" : "text-skills-white"}
                       `}
                    >
                      {skill.name}
                    </h4>
                    <span className="block font-mono text-[0.5rem] sm:text-[0.62rem] tracking-[0.1em] text-skills-muted uppercase mt-0.5">
                      {skill.category}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT PANEL: Proof of Work Details (35% width on desktop) */}
        <div className="hidden md:block md:w-[35%]">
          {!selectedSkill ? (
            // Default placeholder state
            <div className="h-full min-h-[320px] flex flex-col items-center justify-center p-8 rounded-lg border border-dashed border-skills-borderInactive text-center">
              <span className="font-mono text-[0.7rem] tracking-[0.1em] text-skills-muted uppercase">
                Click any skill to see proof of work
              </span>
            </div>
          ) : (
            // Proof Detail Panel Content
            <div
              key={animateKey}
              className="proof-animate h-full border border-skills-borderInactive bg-skills-bgInactive p-6 rounded-lg flex flex-col justify-between"
            >
              <div>
                {/* Header (Icon + Name side by side) */}
                <div className="flex items-center gap-3 mb-6 pb-6 border-b border-skills-borderInactive">
                  <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded">
                    {iconErrors[selectedSkill.id] ? (
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center font-mono text-[0.85rem] font-bold"
                        style={{
                          backgroundColor: `${CATEGORY_COLORS[selectedSkill.category]}15`,
                          color: CATEGORY_COLORS[selectedSkill.category],
                          border: `1px solid ${CATEGORY_COLORS[selectedSkill.category]}30`,
                        }}
                      >
                        {getInitials(selectedSkill.name)}
                      </div>
                    ) : (
                      <img
                        src={getIconUrl(selectedSkill.iconSlug)}
                        alt={selectedSkill.name}
                        width="40"
                        height="40"
                        onError={() => handleIconError(selectedSkill.id)}
                        className="w-10 h-10 object-contain"
                      />
                    )}
                  </div>
                  <div>
                    <h3 className="font-body text-[1.25rem] font-bold text-skills-white leading-tight">
                      {selectedSkill.name}
                    </h3>
                    <span
                      className="inline-block font-mono text-[0.58rem] font-bold tracking-[0.1em] uppercase px-2 py-0.5 rounded mt-1.5"
                      style={{
                        backgroundColor: `${CATEGORY_COLORS[selectedSkill.category]}10`,
                        color: CATEGORY_COLORS[selectedSkill.category],
                      }}
                    >
                      {selectedSkill.category}
                    </span>
                  </div>
                </div>

                {/* Stats Section */}
                {renderStatsStrip(selectedSkill)}

                {/* Section title */}
                <span className="block font-mono text-[0.62rem] font-bold tracking-[0.15em] text-skills-borderActive uppercase mb-4">
                  PROOF OF WORK
                </span>

                {/* Info Rows */}
                <div className="space-y-4">
                  {/* Row 1: Used In */}
                  <div>
                    <span className="block text-[0.72rem] text-skills-muted mb-1">
                      Used in
                    </span>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[0.88rem] font-semibold text-skills-white">
                        {selectedSkill.proof.usedIn}
                      </span>
                      {selectedSkill.proof.note?.toLowerCase().includes("private") && (
                        <span className="inline-flex items-center gap-1 text-[0.68rem] text-skills-muted bg-bark/5 px-2 py-0.5 rounded border border-bark/10">
                          <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                            <path d="M12 2c-2.76 0-5 2.24-5 5v3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2v-8c0-1.1-.9-2-2-2V7c0-2.76-2.24-5-5-5zm-3 5c0-1.66 1.34-3 3-3s3 1.34 3 3v3H9V7zm3 9c-.83 0-1.5-.67-1.5-1.5S11.17 13 12 13s1.5.67 1.5 1.5S12.83 16 12 16z" />
                          </svg>
                          Private repo
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Row 2: What I Built */}
                  <div>
                    <span className="block text-[0.72rem] text-skills-muted mb-1">
                      What I built
                    </span>
                    <p className="text-[0.88rem] leading-relaxed text-bark/80">
                      {selectedSkill.proof.whatIBuilt}
                    </p>
                  </div>
                </div>

                {/* Preview Image at the bottom */}
                {renderPreviewImage(selectedSkill)}
              </div>

              {/* Row 3 & 4 Links at the bottom */}
              <div className="border-t border-skills-borderInactive mt-6 pt-4 space-y-2">
                {/* GitHub repository */}
                {selectedSkill.proof.note?.toLowerCase().includes("private repo") ? (
                  <div className="flex flex-col gap-0.5 select-none">
                    <span className="text-[13px] text-skills-dark font-medium flex items-center gap-1.5">
                      🔒 Private codebase (company IP)
                    </span>
                    <span className="text-[11px] text-skills-darker italic">
                      Happy to walk through it in an interview
                    </span>
                  </div>
                ) : (
                  <div>
                    <a
                      href={selectedSkill.proof.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-[0.8rem] text-skills-borderActive font-semibold hover:underline"
                    >
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                      </svg>
                      View Repository
                    </a>
                  </div>
                )}

                {/* Live Link */}
                {selectedSkill.proof.liveLink && (
                  <div>
                    <a
                      href={selectedSkill.proof.liveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-[0.8rem] text-skills-borderActive font-semibold hover:underline"
                    >
                      <svg className="w-4 h-4 fill-none stroke-current" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      View Live
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MOBILE PROOF SHEET (Slide-up bottom sheet via Portal to body) */}
      {mounted && isMobile && activeSkill && createPortal(
        <div 
          className={`fixed inset-0 z-[9999] flex flex-col justify-end transition-all duration-300 ${
            selectedSkill ? "visible pointer-events-auto" : "invisible pointer-events-none"
          }`}
        >
          {/* Backdrop overlay */}
          <div
            onClick={() => setSelectedSkill(null)}
            className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ${
              selectedSkill ? "opacity-100" : "opacity-0"
            }`}
          />

          {/* Sheet */}
          <div 
            className={`relative bg-skills-bgInactive border-t border-skills-drag-handle rounded-t-2xl h-[60vh] w-full flex flex-col z-10 transition-transform duration-300 ease-out transform ${
              selectedSkill ? "translate-y-0" : "translate-y-full"
            }`}
          >
            {/* Drag handle bar at top */}
            <div className="w-10 h-1 bg-skills-drag-handle rounded-full mx-auto my-3 flex-shrink-0" />

            {/* Close button X */}
            <button
              onClick={() => setSelectedSkill(null)}
              className="absolute top-3 right-4 text-skills-muted hover:text-skills-white p-1 focus:outline-none"
            >
              <svg className="w-6 h-6 fill-none stroke-current" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Content (Scrollable) */}
            <div ref={scrollContainerRef} className="flex-1 overflow-y-auto px-6 pb-8 custom-scrollbar">
              {/* Header */}
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-skills-borderInactive">
                <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded">
                  {iconErrors[activeSkill.id] ? (
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center font-mono text-[0.85rem] font-bold"
                      style={{
                        backgroundColor: `${CATEGORY_COLORS[activeSkill.category]}15`,
                        color: CATEGORY_COLORS[activeSkill.category],
                        border: `1px solid ${CATEGORY_COLORS[activeSkill.category]}30`,
                      }}
                    >
                      {getInitials(activeSkill.name)}
                    </div>
                  ) : (
                    <img
                      src={getIconUrl(activeSkill.iconSlug)}
                      alt={activeSkill.name}
                      width="40"
                      height="40"
                      onError={() => handleIconError(activeSkill.id)}
                      className="w-10 h-10 object-contain"
                    />
                  )}
                </div>
                <div>
                  <h3 className="font-body text-[1.2rem] font-bold text-skills-white leading-tight">
                    {activeSkill.name}
                  </h3>
                  <span
                    className="inline-block font-mono text-[0.55rem] font-bold tracking-[0.1em] uppercase px-2 py-0.5 rounded mt-1.5"
                    style={{
                      backgroundColor: `${CATEGORY_COLORS[activeSkill.category]}10`,
                      color: CATEGORY_COLORS[activeSkill.category],
                    }}
                  >
                    {activeSkill.category}
                  </span>
                </div>
              </div>

              {/* Stats Section */}
              {renderStatsStrip(activeSkill)}

              {/* Section title */}
              <span className="block font-mono text-[0.6rem] font-bold tracking-[0.15em] text-skills-borderActive uppercase mb-4">
                PROOF OF WORK
              </span>

              {/* Info Rows */}
              <div className="space-y-4 mb-6">
                {/* Row 1: Used In */}
                <div>
                  <span className="block text-[0.7rem] text-skills-muted mb-1">
                    Used in
                  </span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[0.85rem] font-semibold text-skills-white">
                      {activeSkill.proof.usedIn}
                    </span>
                    {activeSkill.proof.note?.toLowerCase().includes("private") && (
                      <span className="inline-flex items-center gap-1 text-[0.65rem] text-skills-muted bg-bark/5 px-2 py-0.5 rounded border border-bark/10">
                        <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                          <path d="M12 2c-2.76 0-5 2.24-5 5v3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2v-8c0-1.1-.9-2-2-2V7c0-2.76-2.24-5-5-5zm-3 5c0-1.66 1.34-3 3-3s3 1.34 3 3v3H9V7zm3 9c-.83 0-1.5-.67-1.5-1.5S11.17 13 12 13s1.5.67 1.5 1.5S12.83 16 12 16z" />
                        </svg>
                        Private repo
                      </span>
                    )}
                  </div>
                </div>

                {/* Row 2: What I Built */}
                <div>
                  <span className="block text-[0.7rem] text-skills-muted mb-1">
                    What I built
                  </span>
                  <p className="text-[0.85rem] leading-relaxed text-bark/80">
                    {activeSkill.proof.whatIBuilt}
                  </p>
                </div>
              </div>

              {/* Preview Image at the bottom */}
              {renderPreviewImage(activeSkill)}

              {/* Row 3 & 4 Links */}
              <div className="border-t border-skills-borderInactive pt-4 space-y-2">
                {activeSkill.proof.note?.toLowerCase().includes("private repo") ? (
                  <div className="flex flex-col gap-0.5 select-none">
                    <span className="text-[13px] text-skills-dark font-medium flex items-center gap-1.5">
                      🔒 Private codebase (company IP)
                    </span>
                    <span className="text-[11px] text-skills-darker italic">
                      Happy to walk through it in an interview
                    </span>
                  </div>
                ) : (
                  <div>
                    <a
                      href={activeSkill.proof.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-[0.78rem] text-skills-borderActive font-semibold hover:underline"
                    >
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                      </svg>
                      View Repository
                    </a>
                  </div>
                )}

                {activeSkill.proof.liveLink && (
                  <div>
                    <a
                      href={activeSkill.proof.liveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-[0.78rem] text-skills-borderActive font-semibold hover:underline"
                    >
                      <svg className="w-4 h-4 fill-none stroke-current" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      View Live
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default SkillsSection;
