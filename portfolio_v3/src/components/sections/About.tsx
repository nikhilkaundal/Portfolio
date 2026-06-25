import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

/* ── Animated counter ── */
const Counter: React.FC<{ target: string; label: string }> = ({ target, label }) => {
  const [val, setVal] = useState("0");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();

      const num = parseInt(target);
      const suffix = target.replace(/\d+/, "");
      const dur = 1200;
      const start = performance.now();

      const tick = (now: number) => {
        const prog = Math.min((now - start) / dur, 1);
        const ease = 1 - Math.pow(1 - prog, 3); // easeOutCubic
        setVal(Math.floor(num * ease) + suffix);
        if (prog < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.5 });
    io.observe(el);
    return () => io.disconnect();
  }, [target]);

  return (
    <div ref={ref}>
      <p className="font-display text-4xl lg:text-5xl font-light text-bark leading-none mb-1">{val}</p>
      <p className="font-mono text-[0.6rem] tracking-[0.12em] uppercase text-bark/30">{label}</p>
    </div>
  );
};

const About: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  /* ── Torus knot 3D visual ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const W = canvas.offsetWidth || 280;
    const H = canvas.offsetHeight || 280;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.setClearColor(0x000000, 0);

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 100);
    camera.position.z = 3.8;

    const geo = new THREE.TorusKnotGeometry(1, 0.3, 160, 20, 2, 3);

    const solidMat = new THREE.MeshStandardMaterial({
      color: 0x1A1A1D,
      metalness: 0.6,
      roughness: 0.3,
    });
    scene.add(new THREE.Mesh(geo, solidMat));

    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xC05800,
      wireframe: true,
      transparent: true,
      opacity: 0.18,
    });
    scene.add(new THREE.Mesh(geo, wireMat));

    scene.add(new THREE.AmbientLight(0xE8E4DD, 0.8));
    const l1 = new THREE.PointLight(0xC05800, 6, 12);
    l1.position.set(3, 3, 3);
    scene.add(l1);
    const l2 = new THREE.PointLight(0xFF7A1A, 3, 10);
    l2.position.set(-3, -2, 2);
    scene.add(l2);

    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      scene.children.forEach((c) => {
        if (c instanceof THREE.Mesh) {
          c.rotation.x += 0.004;
          c.rotation.y += 0.006;
        }
      });
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      renderer.dispose();
      geo.dispose();
      solidMat.dispose();
      wireMat.dispose();
    };
  }, []);

  return (
    <section id="about" className="py-28 lg:py-36 bg-night">
      <div className="max-w-7xl mx-auto px-8 lg:px-16">
        {/* Label */}
        <div className="flex items-center gap-4 mb-6 reveal" data-reveal>
          <span className="section-label">About</span>
          <span className="h-px w-10 bg-amber/30 block" />
        </div>

        {/* Bento Grid */}
        <div className="bento-grid" style={{ gridTemplateRows: "auto auto auto" }}>
          {/* ── Main bio card (spans 2 cols) ── */}
          <div
            className="glass-card p-8 lg:p-10 col-span-1 lg:col-span-2 row-span-2 reveal"
            data-reveal
          >
            <h2
              className="font-display font-light leading-tight mb-8 text-bark"
              style={{ fontSize: "clamp(2.4rem, 4vw, 4.5rem)", letterSpacing: "-0.02em" }}
            >
              Turning ideas<br />
              into <em className="italic text-amber" style={{ fontStyle: "italic" }}>shipped</em><br />
              products
            </h2>

            <p className="font-body text-bark/45 leading-relaxed mb-4 text-[0.95rem] max-w-lg">
              I'm a final year Computer Science student at{" "}
              <strong className="text-bark/70 font-medium">UIET, Panjab University</strong>.
              Not the kind who builds only side projects, I've been shipping real,
              production B2B SaaS platforms with real users.
            </p>
            <p className="font-body text-bark/45 leading-relaxed mb-4 text-[0.95rem] max-w-lg">
              At{" "}
              <strong className="text-bark/70 font-medium">Dystinction Technology</strong>,
              I engineered 5+ production modules for <em className="text-amber/60">OkQuoted</em> a procurement
              platform across the full stack: Next.js 15, Supabase RLS, Turborepo
              monorepo, and role-based KPI dashboards.
            </p>
            <p className="font-body text-bark/45 leading-relaxed text-[0.95rem] max-w-lg">
              My core: <strong className="text-bark/70 font-medium">Next.js · React · TypeScript · Node.js · Supabase</strong>.
              I care about the details and I actually ship.
            </p>
          </div>

          {/* ── 3D Visual card ── */}
          <div
            className="glass-card p-6 flex items-center justify-center col-span-1 lg:col-span-2 row-span-2 reveal-scale"
            data-reveal
            data-reveal-delay="0.15"
          >
            <div className="relative w-full h-64 lg:h-80 flex items-center justify-center">
              <canvas ref={canvasRef} className="w-64 h-64 lg:w-72 lg:h-72" />
              {/* Glow behind torus */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-48 h-48 rounded-full bg-amber/5 blur-3xl" />
              </div>
            </div>
          </div>

          {/* ── Stat cards ── */}
          <div
            className="glass-card p-6 flex flex-col justify-center reveal"
            data-reveal data-reveal-delay="0.2"
          >
            <Counter target="12+" label="Technologies" />
          </div>

          <div
            className="glass-card p-6 flex flex-col justify-center reveal"
            data-reveal data-reveal-delay="0.3"
          >
            <Counter target="5+" label="Modules Shipped" />
          </div>

          <div
            className="glass-card p-6 flex flex-col justify-center reveal"
            data-reveal data-reveal-delay="0.4"
          >
            <Counter target="2" label="Internships" />
          </div>

          <div
            className="glass-card p-6 flex flex-col justify-center reveal"
            data-reveal data-reveal-delay="0.5"
          >
            <Counter target="3+" label="Projects Live" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
