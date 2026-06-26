import React from "react";
import Projects from "../components/sections/Projects";
import Contact from "../components/sections/Contact";

const ProjectsPage: React.FC = () => {
  return (
    <>
      <Projects />
      <div className="divider-warm" />
      <Contact />
    </>
  );
};

export default ProjectsPage;
