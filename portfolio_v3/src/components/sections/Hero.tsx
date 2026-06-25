import React, { useEffect, useRef, useCallback } from "react";
import * as THREE from "three";
import gsap from "gsap";

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

  /* ── Three.js dark particle field ── */
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
    const geo   = new THREE.BufferGeometry();
    const pos   = new Float32Array(COUNT * 3);
    const col   = new Float32Array(COUNT * 3);

    for (let i = 0; i < COUNT; i++) {
      const phi   = Math.acos(-1 + (2 * i) / COUNT);
      const theta = Math.sqrt(COUNT * Math.PI) * phi;
      const r     = 2.8 + (Math.random() - 0.5) * 1.1;

      pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);

      const t = Math.random();
      // Mix of amber glow and dimmer particles
      if (t > 0.85) {
        // Bright amber accent
        col[i * 3]     = 1.0;
        col[i * 3 + 1] = 0.48;
        col[i * 3 + 2] = 0.1;
      } else {
        // Muted warm
        col[i * 3]     = 0.35 + t * 0.2;
        col[i * 3 + 1] = 0.18 + t * 0.12;
        col[i * 3 + 2] = 0.05 + t * 0.05;
      }
    }

    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geo.setAttribute("color",    new THREE.BufferAttribute(col, 3));

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
      mx = (e.clientX / window.innerWidth  - 0.5) * 2;
      my = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMouse);

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    let t = 0, animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      t += 0.003;
      pts.rotation.y  += 0.001 + mx * 0.0015;
      pts.rotation.x  += 0.0003 + my * 0.0008;
      ring1.rotation.z = t * 0.35;
      ring2.rotation.z = -t * 0.2;
      ring2.rotation.y = t * 0.12;
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

  /* ── GSAP text entrance ── */
  useEffect(() => {
    const tl = gsap.timeline({ delay: 2.0 });
    tl.to(".hero-line", { opacity: 1, scaleX: 1, duration: 0.8, ease: "power3.out" })
      .to(".hero-eyebrow", { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }, "-=0.3")
      .to(".hero-n1",      { opacity: 1, y: 0, duration: 1.2, ease: "power4.out" }, "-=0.2")
      .to(".hero-n2",      { opacity: 1, y: 0, duration: 1.2, ease: "power4.out" }, "-=0.8")
      .to(".hero-sub",     { opacity: 1,        duration: 0.7, ease: "power3.out" }, "-=0.4")
      .to(".hero-ctas",    { opacity: 1, y: 0,  duration: 0.7, ease: "power3.out" }, "-=0.3")
      .to(".hero-side",    { opacity: 1,         duration: 0.5                    }, "-=0.3")
      .to(".hero-scroll",  { opacity: 1,         duration: 0.5                    }, "-=0.2");
  }, []);

  return (
    <section id="hero" className="relative w-full h-screen flex items-center overflow-hidden">
      {/* Three.js canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Dark radial vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 60% at 70% 50%, rgba(10,10,11,0.4) 0%, rgba(10,10,11,0.85) 60%, rgba(10,10,11,0.97) 80%)",
        }}
      />

      {/* Content — LEFT ALIGNED */}
      <div className="relative z-10 px-8 lg:px-20 max-w-4xl select-none">
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
          className="hero-ctas flex items-center gap-4 mt-10 flex-wrap"
          style={{ opacity: 0, transform: "translateY(16px)" }}
        >
          <MagneticBtn href="#projects" variant="filled">View Projects</MagneticBtn>
          <MagneticBtn href="#contact" variant="outline">Get in Touch</MagneticBtn>
        </div>
      </div>

      {/* Side decorations */}
      <div className="hero-side absolute right-8 lg:right-16 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-4" style={{ opacity: 0 }}>
        <span className="font-mono text-[0.55rem] tracking-[0.12em] text-bark/20 rotate-90 whitespace-nowrap origin-center" style={{ writingMode: "vertical-lr" }}>
          // FULL STACK DEVELOPER
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
    </section>
  );
};

export default Hero;
