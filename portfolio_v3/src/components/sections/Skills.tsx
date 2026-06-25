import React, { useState, useMemo } from "react";
import { SKILLS_LIST, SKILL_CATEGORIES, Skill } from "../../data/portfolio";

const CATEGORY_COLORS: Record<string, string> = {
  Frontend: "from-amber/20 to-amber-glow/10",
  Backend:  "from-amber-dark/20 to-amber/10",
  Database: "from-emerald-500/10 to-amber/10",
  AI:       "from-purple-500/10 to-amber/10",
  DevOps:   "from-blue-500/10 to-amber/10",
  Data:     "from-amber-muted/20 to-amber/10",
};

const SkillCard: React.FC<{ skill: Skill; index: number }> = ({ skill, index }) => (
  <div
    className="glass-card group p-5 cursor-default animate-scale-in"
    style={{ animationDelay: `${0.03 * (index % 12)}s` }}
  >
    <div className="flex items-start justify-between mb-3">
      <h4 className="font-body text-[0.92rem] font-medium text-bark group-hover:text-amber transition-colors duration-300">
        {skill.name}
      </h4>
      {/* Glow dot */}
      <div className="w-1.5 h-1.5 rounded-full bg-amber/30 group-hover:bg-amber-glow group-hover:shadow-[0_0_8px_rgba(255,122,26,0.5)] transition-all duration-300 mt-1.5" />
    </div>
    <span className="font-mono text-[0.58rem] tracking-[0.1em] uppercase text-bark/25 group-hover:text-amber/50 transition-colors duration-300">
      {skill.category}
    </span>
    {/* Bottom gradient line */}
    <div
      className={`h-px w-0 group-hover:w-full mt-4 bg-gradient-to-r ${CATEGORY_COLORS[skill.category] || "from-amber/20 to-transparent"} transition-all duration-500`}
    />
  </div>
);

const Skills: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const filteredSkills = useMemo(() => {
    if (activeCategory === "All") return SKILLS_LIST;
    return SKILLS_LIST.filter((s) => s.category === activeCategory);
  }, [activeCategory]);

  return (
    <section id="skills" className="py-28 lg:py-36 overflow-hidden bg-surface-dark">
      <div className="max-w-7xl mx-auto px-8 lg:px-16">
        {/* Header */}
        <div className="mb-14 reveal" data-reveal>
          <div className="flex items-center gap-4 mb-5">
            <span className="section-label">Skills</span>
            <span className="h-px w-10 bg-amber/30 block" />
          </div>
          <h2
            className="font-display font-light text-bark"
            style={{ fontSize: "clamp(2.8rem, 5vw, 5rem)", letterSpacing: "-0.02em", lineHeight: 1.0 }}
          >
            The full stack,<br />
            <em className="italic text-amber">top to bottom</em>
          </h2>
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap gap-2 mb-10 reveal" data-reveal data-reveal-delay="0.1">
          {SKILL_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`font-mono text-[0.62rem] tracking-[0.12em] uppercase px-4 py-2
                border transition-all duration-300 cursor-pointer
                ${activeCategory === cat
                  ? "border-amber/50 text-amber bg-amber/8 shadow-[0_0_15px_rgba(192,88,0,0.1)]"
                  : "border-white/[0.06] text-bark/30 hover:border-amber/20 hover:text-bark/50"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Skill grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 reveal" data-reveal data-reveal-delay="0.15">
          {filteredSkills.map((skill, i) => (
            <SkillCard key={skill.name} skill={skill} index={i} />
          ))}
        </div>

        {/* Skill count */}
        <div className="mt-8 text-right reveal" data-reveal data-reveal-delay="0.2">
          <span className="font-mono text-[0.6rem] tracking-[0.1em] text-bark/20">
            {filteredSkills.length} {activeCategory === "All" ? "total" : activeCategory.toLowerCase()} skills
          </span>
        </div>
      </div>
    </section>
  );
};

export default Skills;
