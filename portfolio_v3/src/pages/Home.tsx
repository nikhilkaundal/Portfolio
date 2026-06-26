import React from "react";
import Hero from "../components/sections/Hero";
import Marquee from "../components/ui/Marquee";
import Contact from "../components/sections/Contact";

const Home: React.FC = () => {
  return (
    <>
      <Hero />
      <Marquee />
      <div className="divider-warm" />
      <Contact />
    </>
  );
};

export default Home;
