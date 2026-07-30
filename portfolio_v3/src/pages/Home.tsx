import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import Hero from "../components/sections/Hero";
import Marquee from "../components/ui/Marquee";
import Contact from "../components/sections/Contact";
import { useTheme } from "../hooks/useTheme";
import {
  ArrowRight,
  Code2,
  Cpu,
  Database,
  Bot,
  User,
  ArrowUpRight,
  Sparkles,
  MapPin,
  GraduationCap,
  Layers,
  Camera
} from "lucide-react";

const FEATURED_CAPSULE_PROJECTS = [
  {
    id: "rag-chatbot",
    index: "01",
    category: "RAG AI Conversational System & Document Grounding",
    title: "RAG-Based PU Chatbot",
    subtitle: "Python · LlamaIndex · ChromaDB · Groq API · Flask · React",
    desc: "Context-aware AI assistant built with a Retrieval-Augmented Generation (RAG) pipeline to answer university admission queries with document grounding and ~60% faster resolution.",
    metric: "~60% Faster Query Resolution",
    tags: ["Python", "LlamaIndex", "ChromaDB", "Groq API", "Flask", "React.js"],
    imageSrc: "/images/projects/rag-chatbot-3d.png",
    link: "/projects",
  },
  {
    id: "salary-manager",
    index: "02",
    category: "Fintech Automated SMS Parsing & Expense Analytics",
    title: "Salary & Expense Tracker",
    subtitle: "Node.js · Express · PostgreSQL · Tailwind · Regex NLP",
    desc: "Automated expense manager that parses transaction SMS alerts using custom regex & NLP, automatically categorizing budgets into interactive charts without manual entry.",
    metric: "Zero Manual Data Entry Required",
    tags: ["Node.js", "Express", "PostgreSQL", "Tailwind CSS", "Regex NLP"],
    imageSrc: "/images/projects/salary-manager-3d.png",
    link: "/projects",
  },
  {
    id: "sp500-predictor",
    index: "03",
    category: "Quantitative Machine Learning & LSTM Market Forecaster",
    title: "S&P 500 Trend Predictor",
    subtitle: "Python · LSTM Neural Network · Streamlit · Pandas",
    desc: "Quantitative stock market forecasting web dashboard powered by an LSTM recurrent neural network analyzing historical S&P 500 trend cycles and predicting next-day directions.",
    metric: "~80% Market Trend Accuracy",
    tags: ["Python", "LSTM", "Machine Learning", "Streamlit", "Pandas"],
    imageSrc: "/images/projects/sp500-predictor-3d.png",
    link: "/projects",
  },
];

const Home: React.FC = () => {
  const projectsRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: projectsRef,
    offset: ["start end", "end start"],
  });

  const { isDark } = useTheme();

  // Smooth Vertical Parallax Motion — travels full height of section (top → bottom)
  const watermarkY = useTransform(scrollYProgress, [0, 1], ["-200px", "1400px"]);

  return (
    <>
      {/* 1. Hero Section */}
      <Hero />

      {/* Marquee Banner */}
      <Marquee />

      {/* 2. About Overview Section */}
      <section id="about" className="py-24 lg:py-36 bg-night border-t border-bark/10 relative overflow-hidden">
        {/* Background Subtle Grid & Ambient Glow */}
        <div className="absolute inset-0 pointer-events-none select-none z-0" aria-hidden>
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "linear-gradient(to right, var(--color-bark-raw, 180 172 160) / 0.03 1px, transparent 1px), linear-gradient(to bottom, var(--color-bark-raw, 180 172 160) / 0.03 1px, transparent 1px)",
              backgroundSize: "80px 80px"
            }}
          />
          <div className="absolute top-[10%] right-[5%] w-[400px] h-[400px] rounded-full bg-amber/[0.04] blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Column: Bio & Impact Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="lg:col-span-7 flex flex-col justify-center"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="section-label">01 // BIOGRAPHY &amp; IDENTITY</span>
                <span className="h-px w-10 bg-amber/40 block" />
              </div>

              <h2
                className="font-display font-light text-bark mb-6"
                style={{ fontSize: "clamp(2.2rem, 4.5vw, 4rem)", letterSpacing: "-0.02em", lineHeight: 1.1 }}
              >
                Building digital products with <em className="italic text-amber">purpose &amp; precision</em>
              </h2>

              <p className="font-body text-bark/60 text-base lg:text-[1.05rem] leading-relaxed mb-5">
                Full-Stack Developer skilled in React.js, Node.js, Flask &amp; PostgreSQL — building end-to-end web apps that are fast, scalable, and data-driven.
              </p>
              
              <p className="font-body text-bark/45 text-sm lg:text-base leading-relaxed mb-8">
                Delivered RESTful APIs, automated data ingestion workflows &amp; KPI dashboards — cutting manual effort by ~40%. Combines full-stack dev with data engineering to drive product decisions at scale.
              </p>

              {/* Impact Stat Chips */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-9">
                <div className="bg-night-light border border-bark/10 p-2.5 sm:p-4 rounded-2xl text-center sm:text-left">
                  <div className="font-display text-xl sm:text-3xl text-amber font-light leading-none mb-1">~40%</div>
                  <div className="font-mono text-[0.55rem] sm:text-[0.62rem] text-bark/50 uppercase tracking-wider leading-tight">Manual Effort Saved</div>
                </div>
                <div className="bg-night-light border border-bark/10 p-2.5 sm:p-4 rounded-2xl text-center sm:text-left">
                  <div className="font-display text-xl sm:text-3xl text-bark font-light leading-none mb-1">6 Mo.</div>
                  <div className="font-mono text-[0.55rem] sm:text-[0.62rem] text-bark/50 uppercase tracking-wider leading-tight">SaaS Internship</div>
                </div>
                <div className="bg-night-light border border-bark/10 p-2.5 sm:p-4 rounded-2xl text-center sm:text-left">
                  <div className="font-display text-xl sm:text-3xl text-amber font-light leading-none mb-1">1st</div>
                  <div className="font-mono text-[0.55rem] sm:text-[0.62rem] text-bark/50 uppercase tracking-wider leading-tight">Spectrum Art Winner</div>
                </div>
              </div>

              <div>
                <Link
                  to="/about"
                  className="inline-flex items-center gap-3 font-mono text-[0.72rem] tracking-[0.18em] uppercase text-amber border border-amber/30 px-7 py-3.5 bg-amber/5 hover:bg-amber hover:text-night transition-all duration-300 group cursor-none rounded-full"
                >
                  <span>Explore Full Journey →</span>
                  <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>

            {/* Right Column: Developer Passport / Identity Card with Photo Integration */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.75, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-5"
            >
              <motion.div
                whileHover={{ y: -6, scale: 1.015 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="group relative bg-night-light/95 backdrop-blur-xl border border-bark/15 hover:border-amber/50 rounded-3xl p-6 sm:p-8 transition-all duration-500 hover:shadow-[0_0_60px_rgba(235,94,0,0.18)] overflow-hidden cursor-none"
              >
                {/* Background Ambient Radial Glow Blobs */}
                <div className="absolute -top-24 -right-24 w-60 h-60 rounded-full bg-amber/10 blur-[70px] pointer-events-none group-hover:bg-amber/25 transition-all duration-700" />
                <div className="absolute -bottom-24 -left-24 w-60 h-60 rounded-full bg-amber/[0.04] blur-[70px] pointer-events-none group-hover:bg-amber/15 transition-all duration-700" />

                {/* Top Profile Header with Photo */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 mb-7 relative z-10">
                  {/* Photo Container with Camera Viewfinder Frame */}
                  <div className="relative group/photo flex-shrink-0">
                    <div className="w-24 h-28 sm:w-28 sm:h-32 rounded-2xl overflow-hidden border-2 border-amber/30 group-hover:border-amber bg-gradient-to-b from-amber/20 via-night-light to-night shadow-xl relative transition-all duration-500">
                      {/* Photo Image */}
                      <img
                        src="/proof/mee.png"
                        alt="Nikhil Kaundal"
                        className="w-full h-full object-cover object-top group-hover:scale-108 transition-transform duration-700 ease-out"
                      />
                      
                      {/* Dark Vignette Gradient Overlay at Bottom */}
                      <div className="absolute inset-0 bg-gradient-to-t from-night/85 via-transparent to-transparent pointer-events-none" />

                      {/* Camera Viewfinder Reticle Corners */}
                      <div className="absolute top-1.5 left-1.5 w-2.5 h-2.5 border-t-2 border-l-2 border-amber/80 opacity-80" />
                      <div className="absolute top-1.5 right-1.5 w-2.5 h-2.5 border-t-2 border-r-2 border-amber/80 opacity-80" />
                      <div className="absolute bottom-1.5 left-1.5 w-2.5 h-2.5 border-b-2 border-l-2 border-amber/80 opacity-80" />
                      <div className="absolute bottom-1.5 right-1.5 w-2.5 h-2.5 border-b-2 border-r-2 border-amber/80 opacity-80" />

                      {/* Micro Camera Tag */}
                      <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-night/90 border border-amber/40 px-2 py-0.5 rounded-full flex items-center gap-1 opacity-0 group-hover/photo:opacity-100 transition-opacity duration-300 shadow-md">
                        <Camera size={9} className="text-amber" />
                        <span className="font-mono text-[0.5rem] text-amber tracking-tighter uppercase font-semibold">PORTRAIT</span>
                      </div>
                    </div>

                    {/* Monogram NK Seal Badge */}
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-amber border-2 border-night text-night flex items-center justify-center font-display font-bold text-xs shadow-lg group-hover:rotate-12 transition-transform duration-300">
                      NK
                    </div>
                  </div>

                  {/* Info Header Details */}
                  <div className="text-center sm:text-left flex-1">
                    <h3 className="font-display text-2xl sm:text-3xl text-bark font-light leading-tight mb-1 tracking-tight">
                      Nikhil Kaundal
                    </h3>
                    <p className="font-mono text-[0.68rem] text-amber tracking-wider uppercase mb-3 font-semibold">
                      Full-Stack &amp; RAG AI Engineer
                    </p>
                    
                    {/* Status Pills */}
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                      <div className="inline-flex items-center gap-2 bg-amber/10 border border-amber/30 px-3 py-1 rounded-full">
                        <span className="w-2 h-2 rounded-full bg-amber shadow-[0_0_8px_rgba(235,94,0,0.9)] animate-pulse" />
                        <span className="font-mono text-[0.58rem] text-amber tracking-widest uppercase font-medium">
                          Systems &amp; AI Specialist
                        </span>
                      </div>

                      <div className="inline-flex items-center gap-1.5 bg-bark/5 border border-bark/15 px-2.5 py-1 rounded-full text-bark/60">
                        <Camera size={10} className="text-amber/80" />
                        <span className="font-mono text-[0.56rem] tracking-wider uppercase">Visual Artist</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Specs List */}
                <div className="space-y-2.5 font-mono text-[0.72rem] mb-6 relative z-10">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-bark/[0.04] border border-bark/10 group-hover:border-amber/20 transition-colors duration-300">
                    <div className="flex items-center gap-2 text-bark/40 uppercase">
                      <MapPin size={12} className="text-amber/70" />
                      <span>Location</span>
                    </div>
                    <span className="text-bark font-medium">Chandigarh, IN</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 rounded-xl bg-bark/[0.04] border border-bark/10 group-hover:border-amber/20 transition-colors duration-300">
                    <div className="flex items-center gap-2 text-bark/40 uppercase">
                      <GraduationCap size={12} className="text-amber/70" />
                      <span>Education</span>
                    </div>
                    <span className="text-bark font-medium">Panjab University (UIET)</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 rounded-xl bg-bark/[0.04] border border-bark/10 group-hover:border-amber/20 transition-colors duration-300">
                    <div className="flex items-center gap-2 text-bark/40 uppercase">
                      <Layers size={12} className="text-amber/70" />
                      <span>Core Stack</span>
                    </div>
                    <span className="text-amber font-medium">React 19 · Next.js · Node · AI</span>
                  </div>
                </div>

                {/* Developer Quote Banner */}
                <div className="relative z-10 p-4 rounded-2xl bg-amber/8 border border-amber/20 text-bark/80">
                  <p className="font-serif italic text-xs sm:text-[0.82rem] leading-relaxed text-bark/90">
                    "I write code the way I shoot photos until every line and detail feels exactly right."
                  </p>
                </div>

                {/* Hover Accent Glow Line */}
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber/60 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
              </motion.div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 3. Skills Overview Section */}
      <section id="skills" className="py-24 lg:py-36 bg-night border-t border-bark/10 relative overflow-hidden">
        {/* Background Grid & Ambient Glows */}
        <div className="absolute inset-0 pointer-events-none select-none z-0" aria-hidden>
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "linear-gradient(to right, var(--color-bark-raw, 180 172 160) / 0.03 1px, transparent 1px), linear-gradient(to bottom, var(--color-bark-raw, 180 172 160) / 0.03 1px, transparent 1px)",
              backgroundSize: "60px 60px"
            }}
          />
          <div className="absolute top-[20%] left-[-5%] w-[450px] h-[450px] rounded-full bg-amber/[0.04] blur-[130px]" />
          <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-amber/[0.03] blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 relative z-10">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-14 gap-6"
          >
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="section-label">02 // TECH STACK &amp; ARCHITECTURE</span>
                <span className="h-px w-10 bg-amber/40 block" />
              </div>
              <h2
                className="font-display font-light text-bark"
                style={{ fontSize: "clamp(2.2rem, 4.5vw, 4rem)", letterSpacing: "-0.02em" }}
              >
                Core Engineering <em className="italic text-amber">Capabilities</em>
              </h2>
            </div>
            <Link
              to="/skills"
              className="inline-flex items-center gap-2 font-mono text-[0.68rem] tracking-[0.15em] uppercase text-amber hover:text-night hover:bg-amber border border-amber/30 bg-amber/5 px-5 py-2.5 transition-all duration-300 group cursor-none rounded-full"
            >
              <span>Skills Matrix</span>
              <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {/* Bento Tech Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Code2,
                category: "Frontend",
                tagline: "UI Architecture & 3D Web",
                skills: [
                  { name: "React 19", highlight: true },
                  { name: "Next.js 15", highlight: true },
                  { name: "TypeScript", highlight: false },
                  { name: "Tailwind CSS", highlight: false },
                  { name: "Spline / Three.js", highlight: true },
                ],
              },
              {
                icon: Cpu,
                category: "Backend",
                tagline: "APIs & Server Architecture",
                skills: [
                  { name: "Node.js", highlight: true },
                  { name: "Python", highlight: true },
                  { name: "Express.js", highlight: false },
                  { name: "REST APIs", highlight: false },
                  { name: "JWT / Auth", highlight: false },
                ],
              },
              {
                icon: Bot,
                category: "AI & RAG",
                tagline: "LLM Pipelines & Vector DBs",
                skills: [
                  { name: "LlamaIndex", highlight: true },
                  { name: "LangChain", highlight: false },
                  { name: "Vector DBs", highlight: true },
                  { name: "Embeddings", highlight: false },
                  { name: "ChromaDB", highlight: true },
                ],
              },
              {
                icon: Database,
                category: "Data & DevOps",
                tagline: "Storage, Cloud & Tooling",
                skills: [
                  { name: "PostgreSQL", highlight: true },
                  { name: "Supabase", highlight: true },
                  { name: "Redis", highlight: false },
                  { name: "Vercel", highlight: false },
                  { name: "Git / GitHub", highlight: false },
                ],
              }
            ].map((pillar, idx) => (
              <motion.div
                key={pillar.category}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="group relative bg-night-light border border-bark/10 hover:border-amber/50 rounded-3xl p-6 transition-all duration-500 hover:shadow-[0_0_40px_rgba(192,88,0,0.12)] flex flex-col justify-between overflow-hidden cursor-none"
              >
                <div>
                  {/* Icon & Category Header */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-amber/10 border border-amber/25 flex items-center justify-center text-amber group-hover:scale-110 group-hover:bg-amber group-hover:text-night transition-all duration-500 shadow-sm">
                      <pillar.icon size={22} />
                    </div>
                    <span className="font-mono text-[0.58rem] tracking-[0.18em] uppercase text-amber/70 bg-amber/8 border border-amber/15 px-2.5 py-1 rounded-full">
                      0{idx + 1}
                    </span>
                  </div>

                  <h3 className="font-display text-2xl text-bark font-light mb-1">{pillar.category}</h3>
                  <p className="font-mono text-[0.65rem] text-bark/40 mb-6 tracking-wide">{pillar.tagline}</p>

                  {/* Skills Pills List */}
                  <div className="flex flex-col gap-2 mb-2">
                    {pillar.skills.map((s) => (
                      <div
                        key={s.name}
                        className={`group/item flex items-center justify-between font-mono text-[0.75rem] px-3.5 py-2.5 rounded-xl border transition-all duration-300 ${
                          s.highlight
                            ? "bg-amber/10 border-amber/30 text-bark font-medium hover:border-amber hover:bg-amber/20"
                            : "bg-bark/[0.04] border-bark/10 text-bark/70 hover:border-bark/25 hover:text-bark"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`rounded-full transition-all duration-300 ${
                              s.highlight
                                ? "w-2 h-2 bg-amber shadow-[0_0_10px_rgba(235,94,0,0.9)]"
                                : "w-1.5 h-1.5 bg-bark/30 group-hover/item:bg-amber"
                            }`}
                          />
                          <span className="tracking-wide">{s.name}</span>
                        </div>
                        {s.highlight && (
                          <span className="font-mono text-[0.52rem] uppercase tracking-widest text-amber/80 bg-amber/10 border border-amber/20 px-2 py-0.5 rounded-md">
                            CORE
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Subtle Hover Glow Line */}
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
              </motion.div>
            ))}
          </div>

          {/* CTA Footer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-12 text-center"
          >
            <Link
              to="/skills"
              className="inline-flex items-center gap-3 font-mono text-[0.72rem] tracking-[0.18em] uppercase text-amber border border-amber/30 px-8 py-3.5 bg-amber/5 hover:bg-amber hover:text-night transition-all duration-300 cursor-none rounded-full"
            >
              <span>Explore Interactive Skills Matrix &amp; Proof Projects →</span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 4. Work / Experience Overview Section */}
      <section id="experience" className="py-24 lg:py-36 bg-night border-t border-bark/10 relative overflow-hidden">

        {/* Decorative Grid Lines */}
        <div className="absolute inset-0 pointer-events-none select-none z-0" aria-hidden>
          <div className="absolute inset-0"
            style={{
              backgroundImage: "linear-gradient(to right, var(--color-bark-raw, 180 172 160) / 0.04 1px, transparent 1px), linear-gradient(to bottom, var(--color-bark-raw, 180 172 160) / 0.04 1px, transparent 1px)",
              backgroundSize: "80px 80px"
            }}
          />
          {/* Ambient glow blobs */}
          <div className="absolute top-[-10%] right-[10%] w-[420px] h-[420px] rounded-full bg-amber/[0.04] blur-[120px]" />
          <div className="absolute bottom-[5%] left-[5%] w-[300px] h-[300px] rounded-full bg-amber/[0.03] blur-[100px]" />
        </div>

        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 relative z-10">

          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-16 gap-6"
          >
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="section-label">03 // EXPERIENCE</span>
                <span className="h-px w-10 bg-amber/40 block" />
              </div>
              <h2
                className="font-display font-light text-bark"
                style={{ fontSize: "clamp(2.2rem, 4.5vw, 4rem)", letterSpacing: "-0.02em" }}
              >
                Where I've <em className="italic text-amber">built &amp; delivered</em>
              </h2>
            </div>
            <Link
              to="/work"
              className="inline-flex items-center gap-2 font-mono text-[0.68rem] tracking-[0.15em] uppercase text-amber hover:text-night hover:bg-amber border border-amber/30 bg-amber/5 px-5 py-2.5 transition-all duration-300 group cursor-none rounded-full"
            >
              <span>Full History</span>
              <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {/* Bento Experience Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">

            {/* Card 1 — Dystinction (Left, Highlighted) */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-5 group relative bg-night-light border border-amber/40 hover:border-amber rounded-3xl p-7 sm:p-9 transition-all duration-500 shadow-[0_0_40px_rgba(192,88,0,0.10)] hover:shadow-[0_0_70px_rgba(192,88,0,0.22)] overflow-hidden cursor-none flex flex-col justify-between"
            >
              {/* Number Indicator */}
              <span className="absolute top-7 right-8 font-mono text-[4.5rem] font-black text-bark/[0.04] leading-none select-none group-hover:text-bark/[0.07] transition-all duration-500">01</span>

              <div className="relative z-10">
                {/* Role Badge + Date */}
                <div className="flex items-start justify-between mb-7 gap-2">
                  <span className="font-mono text-[0.6rem] tracking-[0.18em] uppercase text-amber bg-amber/15 border border-amber/40 px-3.5 py-1.5 rounded-full whitespace-nowrap">
                    Software Trainee · Internship
                  </span>
                  <span className="font-mono text-[0.65rem] text-bark/35 tracking-wider pt-1">6 Months · 2024</span>
                </div>

                {/* Company */}
                <div className="mb-6">
                  {/* Dystinction Logo — dark container in both modes for brand consistency */}
                  <div className="inline-flex items-center justify-center bg-[#1a1a1a] border border-bark/10 rounded-2xl px-4 py-3 mb-4 group-hover:border-amber/40 transition-all duration-300 shadow-sm">
                    <img
                      src="/images/Logos/Dystinction white .png"
                      alt="Dystinction Technology"
                      className="h-8 w-auto max-w-[160px] object-contain"
                    />
                  </div>
                  <h3 className="font-display text-2xl sm:text-[1.7rem] text-bark font-light mb-1 leading-tight">Dystinction Technology</h3>
                  <p className="font-mono text-[0.68rem] text-amber/60 tracking-wider">OkQuoted SaaS · Chandigarh, IN</p>
                </div>

                {/* Description */}
                <p className="font-body text-bark/55 text-sm leading-relaxed mb-7">
                  Built negotiation systems, KYC workflows &amp; role-based dashboards on a live B2B SaaS platform. Improved load performance by ~40%.
                </p>

                {/* Impact Badge */}
                <div className="flex items-center gap-2 bg-amber/8 border border-amber/20 rounded-xl px-4 py-2 w-fit mb-7">
                  <ArrowUpRight size={12} className="text-amber" />
                  <span className="font-mono text-[0.62rem] text-amber tracking-wider uppercase">~40% Perf Boost</span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 relative z-10">
                {["Next.js", "TypeScript", "Tailwind CSS", "REST API"].map((t) => (
                  <span key={t} className="font-mono text-[0.58rem] text-bark/50 bg-bark/5 border border-bark/10 px-3 py-1 rounded-lg hover:border-amber/30 hover:text-amber transition-all duration-200">
                    {t}
                  </span>
                ))}
              </div>

              {/* Always-on accent line at bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber/70 to-transparent opacity-80 group-hover:opacity-100 transition-all duration-500" />
            </motion.div>

            {/* Card 2 — DIC (Right) */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-7 group relative bg-night-light border border-bark/10 hover:border-amber/60 rounded-3xl p-7 sm:p-9 transition-all duration-500 hover:shadow-[0_0_60px_rgba(192,88,0,0.12)] overflow-hidden cursor-none"
            >
              {/* Number Indicator */}
              <span className="absolute top-7 right-8 font-mono text-[4.5rem] font-black text-bark/[0.04] leading-none select-none group-hover:text-bark/[0.07] transition-all duration-500">02</span>

              {/* Role Badge + Date */}
              <div className="flex items-center justify-between mb-7 relative z-10">
                <span className="font-mono text-[0.6rem] sm:text-[0.65rem] tracking-[0.18em] uppercase text-amber bg-amber/10 border border-amber/25 px-3.5 py-1.5 rounded-full">
                  Full-Stack Developer
                </span>
                <span className="font-mono text-[0.65rem] text-bark/35 tracking-wider">1 Month · 2025</span>
              </div>

              {/* Company */}
              <div className="relative z-10 mb-6">
                {/* DIC Logo — frosted glass highlighted container */}
                <div className="inline-flex items-center justify-center bg-bark/5 border border-bark/10 rounded-2xl px-5 py-3 mb-4 group-hover:border-amber/25 transition-all duration-300">
                  <img
                    src="/images/Logos/DIC logo.png"
                    alt="Design Innovation Centre"
                    className="h-12 w-auto max-w-[180px] object-contain"
                  />
                </div>
                <h3 className="font-display text-2xl sm:text-3xl text-bark font-light mb-1 leading-tight">Design Innovation Centre</h3>
                <p className="font-mono text-[0.68rem] text-amber/60 tracking-wider">Panjab University · Chandigarh, IN</p>
              </div>

              {/* Description */}
              <p className="font-body text-bark/55 text-sm sm:text-[0.92rem] leading-relaxed mb-7 relative z-10 max-w-lg">
                Architected &amp; deployed a RAG-based AI system for university admissions — automated student inquiry resolution and optimized response latency end-to-end.
              </p>

              {/* Impact Badge */}
              <div className="flex items-center gap-3 mb-7 relative z-10">
                <div className="flex items-center gap-2 bg-amber/8 border border-amber/20 rounded-xl px-4 py-2">
                  <Sparkles size={12} className="text-amber" />
                  <span className="font-mono text-[0.62rem] text-amber tracking-wider uppercase">AI-Powered · RAG Pipeline</span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 relative z-10">
                {["React", "Node.js", "Python", "LlamaIndex", "Vector DB"].map((t) => (
                  <span key={t} className="font-mono text-[0.58rem] text-bark/50 bg-bark/5 border border-bark/10 px-3 py-1 rounded-lg hover:border-amber/30 hover:text-amber transition-all duration-200">
                    {t}
                  </span>
                ))}
              </div>

              {/* Hover accent line */}
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
            </motion.div>


          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-10 text-center"
          >
            <Link
              to="/work"
              className="inline-flex items-center gap-3 font-mono text-[0.72rem] tracking-[0.18em] uppercase text-amber border border-amber/30 px-8 py-3.5 bg-amber/5 hover:bg-amber hover:text-night transition-all duration-300 cursor-none rounded-full"
            >
              <span>View Full Experience &amp; Achievements →</span>
            </Link>
          </motion.div>

        </div>
      </section>

      <section id="projects" ref={projectsRef} className="py-24 lg:py-36 bg-night border-t border-bark/10 relative overflow-hidden">
        {/* Sticky Pinned Highlighted Parallax Background Watermark Text "WORK" */}
        <div className="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden">
          <div className="sticky top-[26vh] w-full flex items-center justify-center">
            <motion.span
              style={{ y: watermarkY }}
              className="font-display text-[16vw] sm:text-[11vw] font-black uppercase tracking-[0.14em] text-bark/[0.12] leading-none block whitespace-nowrap"
            >
              PROJECTS
            </motion.span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 flex flex-col relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex justify-between items-end mb-10 sm:mb-16 flex-wrap gap-4 relative z-10"
          >
            <div>
              <div className="flex items-center gap-3 mb-2 sm:mb-3">
                <span className="section-label">04 // FEATURED PROJECTS</span>
                <span className="h-px w-10 sm:w-12 bg-amber/40 block" />
              </div>
              <h2
                className="font-display font-light text-bark"
                style={{ fontSize: "clamp(2rem, 4.5vw, 4.2rem)", letterSpacing: "-0.02em" }}
              >
                Selected <em className="italic text-amber">Works & Applications</em>
              </h2>
            </div>
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 font-mono text-[0.68rem] sm:text-[0.72rem] tracking-[0.15em] uppercase text-amber hover:text-amber-glow transition-colors group cursor-none bg-amber/5 border border-amber/20 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full"
            >
              <span>Explore All ({FEATURED_CAPSULE_PROJECTS.length})</span>
              <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {/* Theme-Adaptive Rectangular Project Cards */}
          <div className="w-full flex flex-col gap-6 sm:gap-9 relative z-10">
            {FEATURED_CAPSULE_PROJECTS.map((p, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, x: isEven ? -20 : 20, y: 20 }}
                  whileInView={{ opacity: 1, x: 0, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.75, delay: idx * 0.06, ease: [0.16, 1, 0.3, 1] }}
                  className={`group relative bg-night-light border border-amber/30 hover:border-amber/80 rounded-2xl p-4 sm:p-6 lg:py-5 lg:px-7 transition-all duration-700 hover:shadow-[0_0_40px_rgba(235,94,0,0.18)] flex flex-col lg:flex-row items-center justify-between gap-4 sm:gap-6 lg:gap-7 overflow-hidden w-full ${
                    isEven ? "lg:w-[94%] lg:self-start" : "lg:w-[94%] lg:self-end lg:ml-auto"
                  }`}
                >
                  {/* Subtle Amber Ambient Glow */}
                  <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-amber/10 blur-[80px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                  {/* Left Side: Project Metadata & Title */}
                  <div className="w-full lg:w-3/5 flex flex-col justify-between z-10">
                    <div>
                      {/* Index + Arrow & Category */}
                      <div className="flex items-center gap-2.5 mb-2">
                        <span className="font-mono text-xs text-amber font-semibold tracking-widest">
                          {p.index} &rarr;
                        </span>
                        <span className="font-mono text-[0.58rem] sm:text-[0.6rem] tracking-[0.18em] uppercase text-bark/60 truncate">
                          {p.category}
                        </span>
                      </div>

                      {/* Project Title */}
                      <h3 className="font-display font-semibold uppercase tracking-wide text-bark text-base sm:text-xl lg:text-2xl mb-1 group-hover:text-amber transition-colors duration-300">
                        {p.title}
                      </h3>

                      {/* Project Subtitle */}
                      <p className="font-mono text-[0.62rem] sm:text-[0.65rem] uppercase tracking-[0.1em] text-amber/80 mb-2">
                        {p.subtitle}
                      </p>

                      {/* Description */}
                      <p className="font-body text-bark/70 text-xs leading-relaxed mb-3 line-clamp-2">
                        {p.desc}
                      </p>

                      {/* Tag Pills */}
                      <div className="flex flex-wrap gap-1.5 mb-3 sm:mb-4">
                        {p.tags.map((tag) => (
                          <span
                            key={tag}
                            className="font-mono text-[0.55rem] sm:text-[0.58rem] tracking-wider uppercase text-bark/90 bg-bark/5 border border-bark/15 px-2 py-0.5 rounded hover:bg-amber hover:text-night hover:border-amber transition-all cursor-default"
                          >
                            ● {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Highlights / Metric & Actions */}
                    <div className="flex flex-wrap items-center justify-between gap-2.5 pt-3 border-t border-bark/10">
                      <div className="flex items-center gap-1.5">
                        <Sparkles size={12} className="text-amber animate-pulse" />
                        <span className="font-mono text-[0.65rem] sm:text-[0.68rem] text-bark/85 font-medium">{p.metric}</span>
                      </div>

                      <Link
                        to={p.link}
                        className="inline-flex items-center gap-1.5 font-mono text-[0.62rem] sm:text-[0.65rem] tracking-[0.12em] uppercase text-amber hover:text-amber-glow transition-all group/btn bg-amber/10 border border-amber/30 hover:border-amber px-3 py-1.5 rounded-md"
                      >
                        <span>Explore Case Study</span>
                        <ArrowUpRight size={12} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                      </Link>
                    </div>
                  </div>

                  {/* Right Side: Low-Height Mobile Image Window */}
                  <div className="w-full lg:w-2/5 flex items-center justify-center z-10 mt-1 lg:mt-0">
                    <div className="w-full h-[125px] sm:h-[155px] lg:h-[165px] rounded-xl overflow-hidden relative border border-amber/30 bg-night-light group-hover:border-amber transition-all duration-500 shadow-md">
                      <img
                        src={p.imageSrc}
                        alt={p.title}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-night/40 via-transparent to-transparent pointer-events-none" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-16 text-center">
            <Link
              to="/projects"
              className="inline-flex items-center gap-3 font-mono text-[0.75rem] tracking-[0.2em] uppercase text-amber border border-amber/40 px-9 py-4 rounded-full bg-amber/5 hover:bg-amber hover:text-night transition-all duration-300 shadow-[0_0_30px_rgba(235,94,0,0.12)] hover:shadow-[0_0_50px_rgba(235,94,0,0.3)] cursor-none"
            >
              <span>Browse All Projects & Interactive Demos →</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 6. Contact Section */}
      <Contact />
    </>
  );
};

export default Home;
