import React from "react";
import Experience from "../components/sections/Experience";
import Contact from "../components/sections/Contact";

const WorkPage: React.FC = () => {
  return (
    <>
      <Experience />
      <div className="divider-warm" />
      <Contact />
    </>
  );
};

export default WorkPage;
