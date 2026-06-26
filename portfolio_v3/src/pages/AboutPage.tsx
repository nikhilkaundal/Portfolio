import React from "react";
import About from "../components/sections/About";
import Contact from "../components/sections/Contact";

const AboutPage: React.FC = () => {
  return (
    <>
      <About />
      <div className="divider-warm" />
      <Contact />
    </>
  );
};

export default AboutPage;
