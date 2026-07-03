import React, { useEffect, useRef, useState, Suspense, useCallback } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { motion, useScroll, useTransform, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { PROJECTS } from "../../data/portfolio";
import RoomScene from "../hero/RoomScene";
import RoomSkeleton from "../hero/RoomSkeleton";
import SplineErrorBoundary from "../hero/SplineErrorBoundary";

/* ── Magnetic button component ── */
const MagneticBtn: React.FC<{ href: string; children: React.ReactNode; variant?: "filled" | "outline" }> = ({
  href, children, variant = "filled"
}) => {
  const ref = useRef<HTMLAnchorElement>(null);

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

  const base = "magnetic-btn font-mono text-[0.72rem] tracking-[0.12em] uppercase px-8 py-4 transition-all duration-300";
  const styles = variant === "filled"
    ? `${base} bg-amber text-night hover:shadow-[0_0_40px_rgba(192,88,0,0.4)] hover:bg-amber-glow`
    : `${base} border border-bark/20 text-bark/70 hover:border-amber/50 hover:text-amber`;

  return (
    <a ref={ref} href={href} className={styles} onMouseMove={onMove} onMouseLeave={onLeave}>
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
  const [interactive, setInteractive] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isLaptopOpen, setIsLaptopOpen] = useState(false);

  // Spline instance references for camera animation
  const splineRef = useRef<any>(null);
  const cameraRef = useRef<any>(null);
  const initialCameraPos = useRef<{ x: number; y: number; z: number } | null>(null);
  const initialCameraZoom = useRef<number | null>(null);

  // Scroll animations values (Framer Motion)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Scroll text fading, shrinking, and scrolling up
  const textOpacity = useTransform(scrollYProgress, [0, 0.45], [1, 0]);
  const textScale = useTransform(scrollYProgress, [0, 0.45], [1, 0.9]);
  const textY = useTransform(scrollYProgress, [0, 0.45], ["0px", "-350px"]);

  // Room container translation to focus directly on the laptop desk
  const roomScale = useTransform(scrollYProgress, [0, 1], [1, 2.0]);
  const roomX = useTransform(scrollYProgress, [0, 1], ["0%", "-75%"]);
  const roomY = useTransform(scrollYProgress, [0, 1], ["0%", "0%"]);

  // Smooth camera zoom animation using a requestAnimationFrame loop + linear interpolation (lerp)
  const targetProgress = useRef(0);
  const currentProgress = useRef(0);
  const animFrameRef = useRef<number | null>(null);

  const handleSplineLoad = useCallback((splineApp: any) => {
    splineRef.current = splineApp;
    console.log("--- SPLINE SCENE LOADED ---");
    
    // Log all objects in the scene graph to find their names and types
    let allObjects: any[] = [];
    if (splineApp._scene) {
      try {
        splineApp._scene.traverse((obj: any) => {
          if (obj.name) {
            allObjects.push({ name: obj.name, type: obj.type });
          }
        });
      } catch (err) {
        console.warn("Could not traverse scene graph:", err);
      }
    }

    // Resolve camera object
    let cam = splineApp.findObjectByName("Camera") || 
              splineApp.findObjectByName("Personal Camera") || 
              splineApp.findObjectByName("Default Camera");

    if (!cam && allObjects.length > 0) {
      cam = allObjects.find(
        (obj: any) =>
          obj.type === "Camera" ||
          obj.isCamera ||
          (obj.name && obj.name.toLowerCase().includes("camera"))
      );
    }

    if (cam) {
      console.log("Successfully found camera object:", cam.name, "Type:", cam.type);
      cameraRef.current = cam;
      initialCameraPos.current = { x: cam.position.x, y: cam.position.y, z: cam.position.z };
      if (typeof cam.zoom === "number") {
        initialCameraZoom.current = cam.zoom;
      }
    } else {
      console.error("CRITICAL: No camera object found in Spline scene!");
    }

    setIsSplineLoaded(true);
  }, []);

  const tick = () => {
    if (!cameraRef.current) {
      animFrameRef.current = null;
      return;
    }

    const target = targetProgress.current;
    const current = currentProgress.current;
    
    // Linear interpolation (lerp) for frame-rate decoupled smooth transitions
    const next = current + (target - current) * 0.08;
    currentProgress.current = next;

    const cam = cameraRef.current;

    // Perspective Camera Zoom (reducing coordinates toward scene origin for fly-in effect)
    if (initialCameraPos.current) {
      const start = initialCameraPos.current;
      const targetZ = start.z * 0.08;
      const targetY = start.y * 0.08;
      const targetX = start.x * 0.08;

      cam.position.x = start.x + (targetX - start.x) * next;
      cam.position.y = start.y + (targetY - start.y) * next;
      cam.position.z = start.z + (targetZ - start.z) * next;
    }

    // Orthographic Camera Zoom support (zoom closer to laptop desk)
    if (initialCameraZoom.current !== null) {
      const startZoom = initialCameraZoom.current;
      const targetZoom = startZoom * 10.0;
      cam.zoom = startZoom + (targetZoom - startZoom) * next;
    }

    // Continue loop if we haven't reached target yet
    if (Math.abs(target - next) > 0.0001) {
      animFrameRef.current = requestAnimationFrame(tick);
    } else {
      currentProgress.current = target;
      animFrameRef.current = null;
    }
  };

  // Sync motion value updates with the lerp loop and set interaction pointer events
  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    targetProgress.current = progress;
    if (animFrameRef.current === null) {
      animFrameRef.current = requestAnimationFrame(tick);
    }
    // Enable pointer events for clickables when text is faded and room is centered
    setInteractive(progress > 0.35);
    setIsZoomed(progress > 0.88);
  });

  // Graceful load timeout fallback (e.g. adblocker, network failures)
  useEffect(() => {
    if (isDesktop && !isSplineLoaded) {
      const timer = setTimeout(() => {
        if (!isSplineLoaded) {
          console.warn("Spline loading timed out. Falling back to static image.");
          setIsSplineTimeout(true);
        }
      }, 8000); // 8 seconds timeout limit
      return () => clearTimeout(timer);
    }
  }, [isDesktop, isSplineLoaded]);

  // Clean up animation frames on component unmount
  useEffect(() => {
    return () => {
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

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

    const scene  = new THREE.Scene();
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

  /* ── GSAP text entrance timeline ── */
  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.2 });
    tl.to(".hero-line", { opacity: 1, scaleX: 1, duration: 0.8, ease: "power3.out" })
      .to(".hero-eyebrow", { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }, "-=0.3")
      .to(".hero-n1", { opacity: 1, y: 0, duration: 1.2, ease: "power4.out" }, "-=0.2")
      .to(".hero-n2", { opacity: 1, y: 0, duration: 1.2, ease: "power4.out" }, "-=0.8")
      .to(".hero-room", { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: "power3.out" }, "-=1.0")
      .to(".hero-sub", { opacity: 1, duration: 0.7, ease: "power3.out" }, "-=0.4")
      .to(".hero-ctas", { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }, "-=0.3")
      .to(".hero-side", { opacity: 1, duration: 0.5 }, "-=0.3")
      .to(".hero-scroll", { opacity: 1, duration: 0.5 }, "-=0.2");
  }, []);

  // Determine section layout parameters natively in CSS classes to prevent hydration issues
  const sectionClass = "relative h-[300vh] bg-night";
  const pinChildClass = "sticky top-0 h-screen w-full overflow-hidden flex items-center";

  // Static fallback image render
  const renderStaticFallback = () => (
    <img
      src="/images/room-static.png"
      alt="Interactive 3D Music Room Studio Illustration"
      className="w-full h-full object-cover rounded-2xl select-none pointer-events-none"
    />
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
        <div className="grid grid-cols-12 gap-8 w-full px-8 lg:px-20 max-w-7xl mx-auto relative h-full items-center z-10">
          {/* Left Column: Text (Transforms opacity/scale/y on scroll via framer-motion) */}
          <motion.div
            style={isDesktop ? { opacity: textOpacity, scale: textScale, y: textY } : undefined}
            className="col-span-12 lg:col-span-7 select-none relative z-10 pointer-events-auto flex flex-col justify-center text-left py-6 lg:py-0"
          >
            {/* Decorative line */}
            <div
              className="hero-line h-px w-20 bg-amber/50 mb-8 origin-left"
              style={{ opacity: 0, transform: "scaleX(0)" }}
            />

            {/* Eyebrow */}
            <div
              className="hero-eyebrow font-mono text-[0.65rem] tracking-[0.35em] uppercase text-amber/80 mb-6"
              style={{ opacity: 0, transform: "translateY(16px)" }}
            >
              Available for Full Stack Roles · 2026
            </div>

            {/* Name */}
            <div className="overflow-hidden mb-1">
              <span
                className="hero-n1 font-display block leading-[0.88] tracking-[-0.03em] text-bark"
                style={{
                  fontSize: "clamp(4.5rem, 12vw, 10rem)",
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
                  fontSize: "clamp(4.5rem, 12vw, 10rem)",
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
              className="hero-sub font-body font-light text-bark/40 tracking-[0.18em] uppercase mt-8 text-sm"
              style={{ opacity: 0 }}
            >
              React &nbsp;·&nbsp; Next.js &nbsp;·&nbsp; Node.js &nbsp;·&nbsp; Production-Grade
            </p>

            {/* CTAs */}
            <div
              className="hero-ctas flex items-center gap-4 mt-10 flex-wrap pointer-events-auto"
              style={{ opacity: 0, transform: "translateY(16px)" }}
            >
              <MagneticBtn href="#projects" variant="filled">View Projects</MagneticBtn>
              <MagneticBtn href="#contact" variant="outline">Get in Touch</MagneticBtn>
            </div>
          </motion.div>

          {/* Right Column: Pinned absolute room element */}
          <motion.div
            style={isDesktop ? { scale: roomScale, x: roomX, y: roomY } : undefined}
            className={`col-span-12 lg:col-span-5 w-full lg:w-[48vw] h-[50vh] lg:h-[75vh] z-20 overflow-visible relative lg:absolute lg:right-[-12%] lg:top-[12%] flex items-center justify-center ${
              interactive ? "pointer-events-auto" : "pointer-events-none"
            }`}
          >
            {/* GSAP Entrance Wrapper - Animates opacity/y on load */}
            <div
              className="w-full h-full relative hero-room flex items-center justify-center"
              style={{ opacity: 0, transform: "translateY(24px) scale(0.98)" }}
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

        {/* Laptop screen hotspot interactive overlay */}
        {isDesktop && isZoomed && (
          <div className="absolute inset-0 flex items-center justify-center z-40 pointer-events-none">
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={() => setIsLaptopOpen(true)}
              className="pointer-events-auto cursor-pointer group relative flex flex-col items-center justify-center"
              style={{
                width: "350px",
                height: "250px",
                transform: "translate(-50px, -20px)" // Positioned centered on the zoomed Spline laptop
              }}
            >
              {/* Pulsing ring indicator */}
              <div className="absolute inset-0 border-2 border-amber/40 rounded-xl animate-pulse bg-amber/5 backdrop-blur-[1px] group-hover:border-amber group-hover:bg-amber/10 transition-all duration-300 shadow-[0_0_30px_rgba(192,88,0,0.15)]" />
              
              {/* Glowing core indicator */}
              <div className="w-3.5 h-3.5 bg-amber rounded-full shadow-[0_0_15px_rgb(192,88,0)] mb-3 animate-bounce" />
              
              {/* Floating tooltip */}
              <div className="bg-night/95 border border-border px-4 py-2 rounded-lg shadow-2xl text-center pointer-events-none group-hover:scale-105 transition-transform duration-200">
                <p className="font-mono text-[0.65rem] tracking-[0.12em] text-amber uppercase font-semibold">
                  💻 PROJECTS WORKSPACE
                </p>
                <p className="font-sans text-[0.58rem] text-bark/70 whitespace-nowrap mt-0.5">
                  Click to open Laptop Monitor
                </p>
              </div>
            </motion.button>
          </div>
        )}

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

        {/* Scroll indicator */}
        <div className="hero-scroll absolute bottom-10 left-8 lg:left-20 flex items-center gap-3" style={{ opacity: 0 }}>
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
