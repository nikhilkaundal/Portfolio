import React from "react";
import Skills from "../components/sections/Skills";
import Contact from "../components/sections/Contact";

const SkillsPage: React.FC = () => {
  return (
    <>
      <Skills />
      <div className="divider-warm" />
      <Contact />
    </>
  );
};

export default SkillsPage;
