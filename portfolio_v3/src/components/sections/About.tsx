import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AchievementCard from "../ui/AchievementCard";
import Lightbox from "../ui/Lightbox";
import { useLightbox } from "../../hooks/useLightbox";
import { ACHIEVEMENTS } from "../../data/portfolio";

const STATS_ITEMS = [
  { value: "5+", label: "Modules Shipped" },
  { value: "1ST", label: "Spectrum PEC" },
  { value: "30%", label: "Reach Increase" },
  { value: "~60%", label: "RAG Improvement" },
  { value: "12+", label: "Team Members Led" },
  { value: "2", label: "Internships" },
  { value: "1", label: "University Certificate" },
  { value: "12+", label: "Tech Stack" }
];

const About: React.FC = () => {
  const zoneARef = useRef<HTMLDivElement>(null);
  const lightbox = useLightbox();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // ZONE A: entrance staggers
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.2 });
      tl.to(".about-badge", { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" })
        .to(".about-hero-word-line1", { y: 0, duration: 0.8, ease: "power4.out" }, "-=0.3")
        .to(".about-hero-word-line2", { y: 0, duration: 0.8, ease: "power4.out" }, "-=0.6")
        .to(".about-identity-sub", { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, "-=0.4")
        .to(".about-watermark", { opacity: 0.04, duration: 1.2, ease: "power2.out" }, "-=0.8");

      // ZONE B: Quote block animation
      gsap.fromTo(".about-quote-border", 
        { scaleY: 0 },
        { 
          scaleY: 1, 
          transformOrigin: "top",
          duration: 0.8, 
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".about-quote",
            start: "top 80%",
            toggleActions: "play none none none"
          }
        }
      );

      gsap.fromTo(".about-quote-text",
        { opacity: 0, x: -15 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".about-quote",
            start: "top 80%",
            toggleActions: "play none none none"
          }
        }
      );

      // ZONE C: Achievements slide-in
      gsap.fromTo(".achievement-card", 
        { opacity: 0, x: -60 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".achievements-container",
            start: "top 75%",
            toggleActions: "play none none none"
          }
        }
      );

      // Watermark 3D scroll effect
      gsap.fromTo(".about-watermark",
        {
          xPercent: -8,
          yPercent: -15,
          rotationY: -15,
          rotationX: 10,
          z: -80,
        },
        {
          xPercent: 8,
          yPercent: 15,
          rotationY: 15,
          rotationX: -10,
          z: 80,
          ease: "none",
          scrollTrigger: {
            trigger: zoneARef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          }
        }
      );
    }, zoneARef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section ref={zoneARef} id="about" className="py-24 lg:py-32 bg-night relative overflow-hidden select-none" style={{ perspective: "1500px", transformStyle: "preserve-3d" }}>
      {/* ZONE A: Watermark Background */}
      <div 
        className="about-watermark absolute inset-0 flex items-center justify-center pointer-events-none text-bark font-serif tracking-tighter select-none"
        style={{ fontSize: "20vw", opacity: 0, zIndex: 0, letterSpacing: "-0.05em", transformStyle: "preserve-3d", willChange: "transform" }}
      >
        NIKHIL
      </div>

      <div className="max-w-5xl mx-auto px-8 lg:px-16 relative z-10">
        
        {/* ZONE A: Identity Block */}
        <div className="mb-20">
          {/* Availability Badge */}
          <div 
            className="about-badge flex items-center gap-2 border border-emerald-500/20 bg-emerald-500/5 px-3 py-1 rounded-full text-emerald-400 font-mono text-[0.62rem] tracking-[0.12em] uppercase select-none w-fit"
            style={{ opacity: 0, transform: "translateY(10px)" }}
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
            </span>
            CHANDIGARH, IN · 2026
          </div>

          {/* Heading Section */}
          <h1 className="font-display font-light text-bark leading-tight mt-6 max-w-4xl" style={{ fontSize: "clamp(2.5rem, 6vw, 5.2rem)", lineHeight: "0.95" }}>
            <div className="overflow-hidden pb-1">
              <span className="about-hero-word-line1 inline-block" style={{ transform: "translateY(110%)" }}>
                I don't wait for opportunities.
              </span>
            </div>
            <div className="overflow-hidden text-amber italic mt-1 pb-1">
              <span className="about-hero-word-line2 inline-block" style={{ transform: "translateY(110%)" }}>
                I build them.
              </span>
            </div>
          </h1>

          <p 
            className="about-identity-sub font-mono text-[0.68rem] tracking-[0.18em] uppercase text-bark/40 mt-6"
            style={{ opacity: 0, transform: "translateY(10px)" }}
          >
            Final-year CS · UIET · Full Stack Developer · Visual Storyteller
          </p>
        </div>

        {/* ZONE B: Story Paragraph */}
        <div className="mb-24 max-w-2xl">
          <p className="font-body text-bark/80 leading-relaxed text-[1rem] font-light mb-6">
            I started college the way most people do, attending lectures, taking notes, not really sure what I was building toward.
          </p>
          <p className="font-body text-bark/80 leading-relaxed text-[1rem] font-light mb-6">
            First year passed. I was average at best. Academically weak, if I'm being honest. But something shifted when I stopped waiting to learn and started trying to build.
          </p>
          <p className="font-body text-bark/80 leading-relaxed text-[1rem] font-light mb-6">
            By second year, I was making things. Small things, clones, experiments, anything to understand how the web actually worked. A Netflix clone. JavaScript projects. HTML and CSS until it stopped feeling foreign. Nothing production-ready. But every broken layout and every fixed bug was teaching me something a classroom wasn't.
          </p>
          <p className="font-body text-bark/80 leading-relaxed text-[1rem] font-light mb-6">
            Third year is when it got real. I built <em className="italic text-amber">Pratibimb</em>, a news website pulling live data from external APIs. Nothing fancy, but it was mine, and it worked. That project made me want more.
          </p>
          <p className="font-body text-bark/80 leading-relaxed text-[1rem] font-light mb-6">
            Then I joined <em className="italic text-amber">AISOC</em>. And something clicked, not just interest, but obsession. I built a <em className="italic text-amber">RAG-based chatbot</em> for Panjab University as part of a 4-person team. I designed the retrieval pipeline, engineered the prompts, built the frontend, and made sure the LLM actually gave useful answers, not just confident-sounding ones. The university recognized it. I have the certificate to prove it.
          </p>
          <p className="font-body text-bark/80 leading-relaxed text-[1rem] font-light mb-6">
            After that, I didn't stop. I picked up React properly. Went deeper into Python. Learned the <em className="italic text-amber">MERN stack</em>. Explored <em className="italic text-amber">React Native</em>. Built a todo list app, not because it was impressive, but because shipping something end-to-end, even something small, teaches you what tutorials never do. It's on my GitHub.
          </p>
          <p className="font-body text-bark/80 leading-relaxed text-[1rem] font-light mb-6">
            By eighth semester, I had landed an off-campus internship at <em className="italic text-amber">Dystinction Technology</em> as a full stack developer on <em className="italic text-amber">OkQuoted</em>, a B2B SaaS procurement platform. Real codebase. Real users. Real deadlines. I wasn't fetching data and calling it a day; I was building negotiation systems, role-based dashboards, KYC workflows, and features that actual businesses were depending on.
          </p>
          <p className="font-body text-bark/80 leading-relaxed text-[1rem] font-light mb-6">
            But here's what my resume doesn't fully show: I also shoot photographs. I won <em className="italic text-amber">First Place at Spectrum</em>, PEC Chandigarh's inter-college art and photography festival. I shoot under the name <em className="italic text-amber">@capturedvisionnn</em> because I believe how you see the world changes how you build for it.
          </p>
          <p className="font-body text-bark/80 leading-relaxed text-[1rem] font-light mb-6">
            I led content teams. I ran social media campaigns. I introduced automation into workflows that didn't have any. I made things more efficient, not just in code, but in people.
          </p>
          <p className="font-body text-bark/80 leading-relaxed text-[1rem] font-light mb-6">
            I listen to music while I work. I think better at night. I care deeply about the details, in a photograph, in a UI, in an API response.
          </p>
          <p className="font-body text-bark/80 leading-relaxed text-[1rem] font-light">
            I'm not the loudest person in the room. But I'm usually the one who's <em className="italic text-amber">already built what everyone else is still talking about</em>.
          </p>

          {/* Philosophy Line / Quote Block */}
          <div className="about-quote relative pl-6 py-2 my-10 max-w-xl">
            <div className="about-quote-border absolute left-0 top-0 bottom-0 w-[3px] bg-amber" style={{ transform: "scaleY(0)" }} />
            <p className="about-quote-text font-display italic text-lg lg:text-xl text-bark/90 leading-relaxed" style={{ opacity: 0 }}>
              "The best code I've written wasn't the cleverest. It was the one that actually got used."
            </p>
          </div>
        </div>

        {/* ZONE C: Achievements */}
        <div className="mb-24">
          <div className="mb-10">
            <p className="font-mono text-[0.62rem] tracking-[0.2em] uppercase text-bark/30 mb-2">01 / Who I Am</p>
            <h2 className="font-display font-light text-amber italic text-2xl lg:text-3xl">Beyond the Code</h2>
          </div>

          <div className="achievements-container flex flex-col border-b border-[var(--border)]">
            {ACHIEVEMENTS.map((a) => (
              <AchievementCard
                key={a.id}
                achievement={a}
                onOpenLightbox={lightbox.open}
              />
            ))}
          </div>
        </div>

        {/* ZONE D: Photography Standalone Block */}
        <div className="my-24 relative p-8 border border-bark/10 bg-bark/[0.01] overflow-hidden group">
          {/* Viewfinder corners */}
          <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-bark/20 group-hover:border-amber/50 transition-colors duration-500" />
          <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-bark/20 group-hover:border-amber/50 transition-colors duration-500" />
          <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-bark/20 group-hover:border-amber/50 transition-colors duration-500" />
          <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-bark/20 group-hover:border-amber/50 transition-colors duration-500" />
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10 py-4 px-2">
            <div>
              <h3 className="font-display font-light text-2xl lg:text-3xl italic text-bark mb-3">
                I Also See The World Differently
              </h3>
              <p className="font-body text-bark/80 text-sm max-w-xl leading-relaxed">
                Beyond code, I'm a photographer. 1st place at Spectrum, PEC Chandigarh. Core member, Imagen - UIET Photography Club. The same eye that frames a photograph frames a user interface. The same patience that waits for the right light debugs the right bug.
              </p>
            </div>
            
            <a 
              href="https://instagram.com/capturedvisionnn" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center p-6 border border-amber/20 hover:border-amber hover:bg-amber/5 transition-all duration-300 group/insta cursor-none"
            >
              <span className="font-mono text-[0.62rem] tracking-[0.2em] uppercase text-amber mb-1">Instagram</span>
              <span className="font-display italic text-lg text-bark group-hover/insta:text-amber transition-colors duration-300">@capturedvisionnn</span>
              <span className="font-mono text-[0.55rem] text-bark/30 mt-3 group-hover/insta:text-bark/50">View My Photography →</span>
            </a>
          </div>
        </div>

        {/* ZONE E: Stats Strip */}
        <div className="border-t border-b border-amber/15 py-6 overflow-hidden bg-night select-none my-16">
          <div
            className="flex gap-12 whitespace-nowrap items-center hover:[animation-play-state:paused]"
            style={{ animation: "marquee 22s linear infinite", width: "max-content" }}
          >
            {[...STATS_ITEMS, ...STATS_ITEMS].map((stat, i) => (
              <React.Fragment key={i}>
                <div className="flex items-baseline gap-3">
                  <span className="font-display font-light text-4xl lg:text-5xl text-bark">
                    {stat.value}
                  </span>
                  <span className="font-mono text-[0.62rem] tracking-[0.15em] uppercase text-bark/40">
                    {stat.label}
                  </span>
                </div>
                <span className="text-amber self-center text-sm">◆</span>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* ZONE F: Closer Block */}
        <div className="max-w-2xl mt-16">
          <p className="font-mono text-[0.65rem] tracking-[0.2em] uppercase text-amber mb-4">
            {"// Closer"}
          </p>
          <h3 className="font-display font-light text-bark text-2xl lg:text-3xl leading-snug tracking-tight mb-6">
            I write code. I lead teams. I shoot photographs.<br />
            <span className="text-amber italic">I'm the kind of person who figures things out.</span>
          </h3>
          <p className="font-body text-bark/80 leading-relaxed text-[0.92rem] max-w-lg mb-6">
            I've shipped production software, built AI systems, won photography competitions, and managed content teams, all before graduation. I'm not looking for a place to prove myself. I'm looking for a place to keep building.
          </p>

          {/* Relocation / Status Badge */}
          <div className="flex items-center gap-2.5 border border-amber/10 bg-amber/[0.02] p-4 rounded-none text-bark/60 font-mono text-[0.65rem] tracking-[0.1em] uppercase leading-relaxed max-w-xl">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber"></span>
            </span>
            <span>I write code the way I shoot photos until it feels exactly right.</span>
          </div>
        </div>

      </div>
      <Lightbox lightbox={lightbox} />
    </section>
  );
};

export default About;
