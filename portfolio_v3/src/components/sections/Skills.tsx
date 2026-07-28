import React, { useState } from "react";
import { SKILL_CATEGORIES } from "../../data/portfolio";
import { Skill } from "../../data/skillsData";
import SkillsSection from "../skills/SkillsSection";

const Skills: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setSelectedSkill(null); // Reset selection on filter change
  };

  return (
    <section id="skills" className="py-28 lg:py-36 overflow-hidden bg-surface-dark">
      <div className="max-w-7xl mx-auto px-8 lg:px-16">
        {/* Header */}
        <div className="reveal" data-reveal>
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
        <div className="flex flex-wrap gap-2 my-10 reveal" data-reveal data-reveal-delay="0.1">
          {SKILL_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`font-mono text-[0.62rem] tracking-[0.12em] uppercase px-4 py-2
                border transition-all duration-300 cursor-pointer
                ${activeCategory === cat
                  ? "border-amber/50 text-amber bg-amber/8 shadow-[0_0_15px_rgba(192,88,0,0.1)]"
                  : "border-bark/10 text-bark/30 hover:border-amber/20 hover:text-bark/50"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Interactive Skills Card Grid and Proof Panel */}
        <div className="reveal" data-reveal data-reveal-delay="0.15">
          <SkillsSection
            activeCategory={activeCategory}
            selectedSkill={selectedSkill}
            setSelectedSkill={setSelectedSkill}
          />
        </div>
      </div>
    </section>
  );
};

export default Skills;
