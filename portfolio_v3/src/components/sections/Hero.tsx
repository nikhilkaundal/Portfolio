import React, { useEffect, useRef, useState, Suspense, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import * as THREE from "three";
import gsap from "gsap";
import { motion, AnimatePresence } from "framer-motion";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { PROJECTS } from "../../data/portfolio";
import RoomScene from "../hero/RoomScene";
import RoomSkeleton from "../hero/RoomSkeleton";
import SplineErrorBoundary from "../hero/SplineErrorBoundary";

/* ── Magnetic button component ── */
const MagneticBtn: React.FC<{ href: string; children: React.ReactNode; variant?: "filled" | "outline"; target?: string; rel?: string }> = ({
  href, children, variant = "filled", target, rel
}) => {
  const ref = useRef<HTMLAnchorElement>(null);
  const navigate = useNavigate();

  const onMove = useCallback((e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.25;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.25;
    el.style.transform = `translate(${x}px, ${y}px)`;
  }, []);
  const onLeave = useCallback(() => {
    if (ref.current) ref.current.style.transform = "";
  }, []);

  const base = "font-mono text-[0.68rem] sm:text-[0.72rem] tracking-[0.15em] uppercase px-7 sm:px-8 py-3.5 sm:py-4 rounded-full transition-all duration-300 w-full sm:w-auto text-center flex justify-center items-center gap-2 group font-semibold";
  const styles = variant === "filled"
    ? `${base} bg-amber text-night shadow-[0_0_25px_rgba(235,94,0,0.35)] hover:shadow-[0_0_40px_rgba(235,94,0,0.6)] hover:bg-amber-glow`
    : `${base} bg-bark/5 border border-bark/30 text-bark hover:border-amber hover:bg-amber/15 hover:text-amber shadow-sm`;

  return (
    <a ref={ref} href={href} className={styles} onMouseMove={onMove} onMouseLeave={onLeave} target={target} rel={rel}>
      {children}
    </a>
  );
};

const Hero: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Responsive device verification
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  // State management for Spline load lifecycle and interactivity
  const [isSplineLoaded, setIsSplineLoaded] = useState(false);
  const [isSplineTimeout, setIsSplineTimeout] = useState(false);
  const [isLaptopOpen, setIsLaptopOpen] = useState(false);

  // Spline instance reference
  const splineRef = useRef<any>(null);

  const handleSplineLoad = useCallback((splineApp: any) => {
    splineRef.current = splineApp;
    setIsSplineLoaded(true);
  }, []);

  // Graceful load timeout fallback (e.g. adblocker, network failures)
  useEffect(() => {
    if (isDesktop && !isSplineLoaded) {
      const timer = setTimeout(() => {
        if (!isSplineLoaded) {
          console.warn("Spline loading timed out. Falling back to static image.");
          setIsSplineTimeout(true);
        }
      }, 30000); // 30 seconds timeout limit
      return () => clearTimeout(timer);
    }
  }, [isDesktop, isSplineLoaded]);

  /* ── Keyboard listener to close projects modal ── */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsLaptopOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  /* ── Three.js dark particle field background ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    /* Particles — amber glow cores on dark */
    const COUNT = 4200;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(COUNT * 3);
    const col = new Float32Array(COUNT * 3);

    for (let i = 0; i < COUNT; i++) {
      const phi = Math.acos(-1 + (2 * i) / COUNT);
      const theta = Math.sqrt(COUNT * Math.PI) * phi;
      const r = 2.8 + (Math.random() - 0.5) * 1.1;

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);

      const t = Math.random();
      if (t > 0.85) {
        col[i * 3] = 1.0;
        col[i * 3 + 1] = 0.48;
        col[i * 3 + 2] = 0.1;
      } else {
        col[i * 3] = 0.35 + t * 0.2;
        col[i * 3 + 1] = 0.18 + t * 0.12;
        col[i * 3 + 2] = 0.05 + t * 0.05;
      }
    }

    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(col, 3));

    const mat = new THREE.PointsMaterial({
      size: 0.02,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true,
    });
    const pts = new THREE.Points(geo, mat);
    scene.add(pts);

    /* Orbit rings */
    const ringMat1 = new THREE.MeshBasicMaterial({ color: 0xC05800, transparent: true, opacity: 0.12 });
    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(2.8, 0.003, 2, 180), ringMat1);
    ring1.rotation.x = Math.PI / 2;
    scene.add(ring1);

    const ringMat2 = new THREE.MeshBasicMaterial({ color: 0xFF7A1A, transparent: true, opacity: 0.06 });
    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(2.3, 0.002, 2, 180), ringMat2);
    ring2.rotation.x = Math.PI / 3.5;
    scene.add(ring2);

    /* Mouse parallax */
    let mx = 0, my = 0;
    const onMouse = (e: MouseEvent) => {
      mx = (e.clientX / window.innerWidth - 0.5) * 2;
      my = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMouse);

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    let t0 = 0, animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      t0 += 0.003;
      pts.rotation.y += 0.001 + mx * 0.0015;
      pts.rotation.x += 0.0003 + my * 0.0008;
      ring1.rotation.z = t0 * 0.35;
      ring2.rotation.z = -t0 * 0.2;
      ring2.rotation.y = t0 * 0.12;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      geo.dispose();
      mat.dispose();
    };
  }, []);

  /* ── GSAP text entrance timeline with safe context & route cleanup ── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.1 });
      tl.to(".hero-line", { opacity: 1, scaleX: 1, duration: 0.6, ease: "power3.out" })
        .to(".hero-eyebrow", { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }, "-=0.3")
        .to(".hero-n1", { opacity: 1, y: 0, duration: 0.8, ease: "power4.out" }, "-=0.2")
        .to(".hero-n2", { opacity: 1, y: 0, duration: 0.8, ease: "power4.out" }, "-=0.6")
        .to(".hero-room", { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, "-=0.7")
        .to(".hero-sub", { opacity: 1, duration: 0.5, ease: "power3.out" }, "-=0.4")
        .to(".hero-ctas", { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }, "-=0.3")
        .to(".hero-side", { opacity: 1, duration: 0.4 }, "-=0.3")
        .to(".hero-scroll", { opacity: 1, duration: 0.4 }, "-=0.2");
    }, containerRef);

    // Guaranteed fallback: ensures text is 100% visible even if GSAP timeline is interrupted on route change
    const fallbackTimer = setTimeout(() => {
      if (containerRef.current) {
        const els = containerRef.current.querySelectorAll(".hero-line, .hero-eyebrow, .hero-n1, .hero-n2, .hero-sub, .hero-ctas, .hero-side, .hero-scroll");
        els.forEach((el) => {
          (el as HTMLElement).style.opacity = "1";
          (el as HTMLElement).style.transform = "none";
        });
      }
    }, 800);

    return () => {
      ctx.revert();
      clearTimeout(fallbackTimer);
    };
  }, []);

  // Determine section layout parameters natively in CSS classes to prevent hydration issues
  const sectionClass = "relative min-h-[82vh] lg:min-h-screen lg:h-screen bg-night overflow-hidden flex items-center justify-center pt-24 sm:pt-28 pb-12 lg:py-0 select-none";
  const pinChildClass = "relative w-full h-auto lg:h-full flex items-center justify-center overflow-visible";

  // Static fallback image render for mobile or slow connections
  const renderStaticFallback = () => (
    <div className="w-full h-full flex items-center justify-center p-2 sm:p-4">
      <img
        src="/images/room-static.png"
        alt="Interactive 3D Music Room Studio Illustration"
        className="w-full max-w-[500px] h-auto object-contain rounded-2xl shadow-xl select-none pointer-events-none border border-bark/10"
      />
    </div>
  );

  return (
    <section id="hero" ref={containerRef} className={sectionClass}>
      <div className={pinChildClass}>
        {/* Three.js background canvas */}
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-500 opacity-[var(--hero-canvas-opacity)]" />

        {/* Dark radial vignette wrapper */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 60% at 70% 50%, rgba(var(--night-rgb),0.4) 0%, rgba(var(--night-rgb),0.85) 60%, rgba(var(--night-rgb),0.97) 80%)",
          }}
        />

        {/* Primary layout container */}
        <div className="grid grid-cols-12 gap-6 w-full px-6 sm:px-8 lg:px-16 max-w-7xl mx-auto relative h-full items-center justify-center z-10">
          {/* Left Column: Text */}
          <motion.div
            className="col-span-12 lg:col-span-6 select-none relative z-10 pointer-events-auto flex flex-col justify-center items-center lg:items-start text-center lg:text-left py-0 lg:py-0"
          >
            {/* Decorative line */}
            <div
              className="hero-line h-px w-16 sm:w-20 bg-amber/50 mb-4 sm:mb-8 origin-center lg:origin-left"
              style={{ opacity: 0, transform: "scaleX(0)" }}
            />

            {/* Eyebrow */}
            <div
              className="hero-eyebrow font-mono text-[0.6rem] sm:text-[0.65rem] tracking-[0.3em] sm:tracking-[0.35em] uppercase text-amber font-semibold mb-3 sm:mb-6"
              style={{ opacity: 0, transform: "translateY(16px)" }}
            >
              ENGINEERING SCALABLE WEB &amp; AI SYSTEMS
            </div>

            {/* Name */}
            <div className="overflow-hidden mb-1">
              <span
                className="hero-n1 font-display block leading-[0.88] tracking-[-0.03em] text-bark"
                style={{
                  fontSize: "clamp(3.8rem, 11vw, 10rem)",
                  fontWeight: 300,
                  opacity: 0,
                  transform: "translateY(110%)",
                }}
              >
                NIKHIL
              </span>
            </div>
            <div className="overflow-hidden">
              <span
                className="hero-n2 font-display italic block leading-[0.88] tracking-[-0.03em] text-amber"
                style={{
                  fontSize: "clamp(3.8rem, 11vw, 10rem)",
                  fontWeight: 300,
                  opacity: 0,
                  transform: "translateY(110%)",
                }}
              >
                Kaundal
              </span>
            </div>

            {/* Subtitle */}
            <p
              className="hero-sub font-body font-medium text-bark/70 tracking-[0.15em] sm:tracking-[0.18em] uppercase mt-3 sm:mt-8 text-xs sm:text-sm"
              style={{ opacity: 0 }}
            >
              React &nbsp;·&nbsp; Next.js &nbsp;·&nbsp; Node.js &nbsp;·&nbsp; Production-Grade
            </p>

            {/* CTAs */}
            <div
              className="hero-ctas flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 mt-7 sm:mt-10 pointer-events-auto w-full sm:w-auto max-w-xs sm:max-w-none mx-auto lg:mx-0"
              style={{ opacity: 0, transform: "translateY(16px)" }}
            >
              <MagneticBtn href="/proof/resume_16.pdf" variant="filled" target="_blank" rel="noopener noreferrer">View Resume</MagneticBtn>
              <MagneticBtn href="#contact" variant="outline">Get in Touch</MagneticBtn>
            </div>
          </motion.div>

          {/* Right Column: 3D Room element (Desktop/Laptop only: hidden on mobile, visible on lg+) */}
          <motion.div
            style={{ background: "transparent" }}
            className="hidden lg:flex col-span-12 lg:col-span-6 w-full lg:w-[54vw] h-screen z-20 overflow-visible absolute right-[-1.9vw] top-0 bottom-0 items-center justify-center pointer-events-auto"
          >
            {/* GSAP Entrance Wrapper - Animates opacity/y on load */}
            <div
              className="w-full h-full relative hero-room flex items-center justify-center overflow-visible"
              style={{ opacity: 0, transform: "translateY(24px)", background: "transparent" }}
            >
              {isDesktop && !isSplineTimeout ? (
                <SplineErrorBoundary fallback={renderStaticFallback()}>
                  <Suspense fallback={<RoomSkeleton />}>
                    <RoomScene onLoad={handleSplineLoad} />
                  </Suspense>

                  {/* Fade out loading skeleton once Spline load confirms */}
                  <div
                    className="absolute inset-0 transition-opacity duration-700 ease-out-quad pointer-events-none z-30"
                    style={{
                      opacity: isSplineLoaded ? 0 : 1,
                      visibility: isSplineLoaded ? "hidden" : "visible",
                    }}
                  >
                    <RoomSkeleton />
                  </div>
                </SplineErrorBoundary>
              ) : (
                // Mobile or Timeout fallback
                renderStaticFallback()
              )}
            </div>
          </motion.div>
        </div>

        {/* Laptop Window Modal (Glassmorphic Browser Interface) */}
        <AnimatePresence>
          {isLaptopOpen && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-md px-4 sm:px-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="w-full max-w-5xl h-[80vh] rounded-xl border border-border bg-night-light/95 shadow-2xl flex flex-col overflow-hidden text-left"
              >
                {/* Browser Header Bar */}
                <div className="flex items-center justify-between px-4 py-3 bg-surface border-b border-border select-none">
                  {/* Left: Chrome Dots */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsLaptopOpen(false)}
                      className="w-3.5 h-3.5 rounded-full bg-[#FF5F56] border border-[#E0443E] hover:opacity-85 transition-opacity cursor-pointer"
                    />
                    <div className="w-3.5 h-3.5 rounded-full bg-[#FFBD2E] border border-[#DEA123]" />
                    <div className="w-3.5 h-3.5 rounded-full bg-[#27C93F] border border-[#1AAB29]" />
                  </div>

                  {/* Middle: Tab Title */}
                  <div className="flex items-center bg-night-light border border-border px-6 py-1 rounded-md text-[0.65rem] font-mono tracking-wide text-bark/80">
                    <span className="text-amber mr-2">🔒</span> nikhildev.workspace / projects.ts
                  </div>

                  {/* Right: Dummy spacing to balance layout */}
                  <div className="w-16" />
                </div>

                {/* Main Content Area */}
                <div className="flex-1 flex overflow-hidden">
                  {/* Sidebar (File Explorer Tree) */}
                  <div className="w-56 bg-surface/50 border-r border-border p-4 hidden md:block select-none">
                    <p className="font-mono text-[0.6rem] tracking-[0.1em] text-bark/30 uppercase font-bold mb-4">
                      WORKSPACE EXPLORER
                    </p>
                    <div className="flex flex-col gap-2 font-mono text-[0.7rem] text-bark/60">
                      <div className="flex items-center gap-2 text-bark">
                        <span>📂</span> portfolio_v3
                      </div>
                      <div className="pl-4 flex flex-col gap-2 border-l border-border/20 ml-2 py-1">
                        <div className="flex items-center gap-2 text-bark">
                          <span>📂</span> src
                        </div>
                        <div className="pl-4 flex flex-col gap-2 border-l border-border/20 ml-2 py-1">
                          <div className="flex items-center gap-2 text-bark">
                            <span>📂</span> data
                          </div>
                          <div className="pl-4 flex items-center gap-2 text-amber">
                            <span>📄</span> projects.ts
                          </div>
                          <div className="flex items-center gap-2">
                            <span>📄</span> experience.ts
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Project Showcase Panel */}
                  <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-night-light/50 custom-scrollbar">
                    <div className="mb-8">
                      <h2 className="font-display italic text-3xl text-bark">
                        Projects <span className="text-amber">Workspace</span>
                      </h2>
                      <p className="font-mono text-[0.65rem] tracking-[0.05em] text-bark/40 mt-1">
                        Displaying all production-ready deployments and full-stack modules.
                      </p>
                    </div>

                    {/* Projects Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {PROJECTS.map((project) => (
                        <div
                          key={project.id}
                          className="border border-border bg-surface/30 hover:border-amber/40 hover:bg-surface/50 p-6 rounded-xl transition-all duration-300 flex flex-col justify-between group shadow-lg hover:shadow-black/20"
                        >
                          <div>
                            <div className="flex items-center justify-between mb-4">
                              <span className="font-mono text-xs text-amber font-bold">
                                [{project.index}]
                              </span>
                              <span className="font-mono text-[0.55rem] uppercase tracking-widest bg-amber/10 border border-amber/25 text-amber px-2 py-0.5 rounded">
                                {project.badge}
                              </span>
                            </div>

                            <h3 className="font-display text-xl text-bark group-hover:text-amber transition-colors duration-200">
                              {project.title}
                            </h3>
                            {project.subtitle && (
                              <p className="font-mono text-[0.62rem] text-bark/40 mt-0.5 tracking-wide">
                                {project.subtitle}
                              </p>
                            )}

                            <p className="font-sans text-xs text-bark/60 leading-relaxed mt-4">
                              {project.desc}
                            </p>

                            {/* Core stack labels */}
                            <div className="flex flex-wrap gap-1.5 mt-5">
                              {project.coreStack.map((tech) => (
                                <span
                                  key={tech}
                                  className="font-mono text-[0.55rem] bg-night border border-border/40 text-bark/50 px-2 py-0.5 rounded"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="border-t border-border/50 pt-4 mt-6 flex items-center justify-between select-none">
                            <a
                              href={project.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-mono text-[0.62rem] tracking-wider text-bark/40 hover:text-amber transition-colors duration-200"
                            >
                              // VIEW GITHUB ↗
                            </a>
                            {project.liveUrl && (
                              <a
                                href={project.liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-mono text-[0.62rem] tracking-wider text-amber hover:text-amber-glow font-bold transition-colors duration-200"
                              >
                                LIVE DEMO ↗
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Side decorations */}
        <div className="hero-side absolute right-8 lg:right-16 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-4" style={{ opacity: 0 }}>
          <span className="font-mono text-[0.55rem] tracking-[0.12em] text-bark/20 rotate-90 whitespace-nowrap origin-center" style={{ writingMode: "vertical-lr" }}>
            {"// FULL STACK DEVELOPER"}
          </span>
          <div className="w-px h-24 bg-gradient-to-b from-amber/30 to-transparent" />
          <span className="font-mono text-[0.55rem] text-bark/20">001</span>
        </div>

        {/* Desktop Scroll indicator */}
        <div className="hero-scroll absolute bottom-8 left-8 lg:left-20 hidden sm:flex items-center gap-3" style={{ opacity: 0 }}>
          <div className="w-px h-12 bg-gradient-to-b from-amber/40 to-transparent animate-pulse" />
          <span className="font-mono text-[0.55rem] tracking-[0.2em] uppercase text-bark/25">Scroll</span>
        </div>

        {/* Coordinates - bottom right */}
        <div className="absolute bottom-10 right-8 lg:right-16 text-right hidden lg:block" style={{ opacity: 0 }}>
          <p className="hero-side font-mono text-[0.55rem] tracking-[0.1em] text-bark/20 leading-relaxed">
            30.7333° N<br />76.7794° E<br />Chandigarh, IN
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
