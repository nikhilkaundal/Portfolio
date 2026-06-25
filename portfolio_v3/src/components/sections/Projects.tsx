import React, { useEffect, useRef, useState } from "react";
import { PROJECTS } from "../../data/portfolio";

/* ── Animated network canvas ── */
const NetworkCanvas: React.FC<{ color?: string; nodeCount?: number }> = ({
  color = "192,88,0", nodeCount = 22
}) => {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;

    const ctx = cv.getContext("2d")!;
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      cv.width  = cv.offsetWidth * dpr;
      cv.height = cv.offsetHeight * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    const W = cv.offsetWidth || 300;
    const H = cv.offsetHeight || 260;
    const nodes = Array.from({ length: nodeCount }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
      r: 1.5 + Math.random() * 2.5, p: Math.random() * Math.PI * 2,
    }));

    let animId: number;
    const draw = () => {
      animId = requestAnimationFrame(draw);
      const cW = cv.offsetWidth || 300;
      const cH = cv.offsetHeight || 260;
      ctx.clearRect(0, 0, cW, cH);

      nodes.forEach((n) => {
        n.x += n.vx; n.y += n.vy; n.p += 0.03;
        if (n.x < 8) { n.x = 8; n.vx = Math.abs(n.vx); }
        else if (n.x > cW - 8) { n.x = cW - 8; n.vx = -Math.abs(n.vx); }
        if (n.y < 8) { n.y = 8; n.vy = Math.abs(n.vy); }
        else if (n.y > cH - 8) { n.y = cH - 8; n.vy = -Math.abs(n.vy); }
      });

      // Edges
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[j].x - nodes[i].x;
          const dy = nodes[j].y - nodes[i].y;
          const d  = Math.sqrt(dx * dx + dy * dy);
          if (d < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(${color},${Math.max(0, 0.35 - d / 285)})`;
            ctx.lineWidth   = 0.6;
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Nodes with glow
      nodes.forEach((n) => {
        const alpha = 0.5 + Math.sin(n.p) * 0.3;
        const glowR = Math.max(0.1, n.r * 3);
        const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, glowR);
        g.addColorStop(0, `rgba(${color},${alpha})`);
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.beginPath(); ctx.fillStyle = g; ctx.arc(n.x, n.y, glowR, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.fillStyle = `rgba(${color},${alpha})`; ctx.arc(n.x, n.y, Math.max(0.1, n.r), 0, Math.PI * 2); ctx.fill();
      });
    };
    draw();

    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, [color, nodeCount]);

  return <canvas ref={ref} className="w-full h-full" />;
};

/* ── Counter for metrics ── */
const MetricCounter: React.FC<{ val: string; label: string }> = ({ val, label }) => {
  const [display, setDisplay] = useState(val);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      // Quick scramble then resolve
      let tick = 0;
      const iv = setInterval(() => {
        tick++;
        if (tick > 6) { clearInterval(iv); setDisplay(val); return; }
        setDisplay(val.replace(/[0-9]/g, () => String(Math.floor(Math.random() * 10))));
      }, 60);
    }, { threshold: 0.5 });
    io.observe(el);
    return () => io.disconnect();
  }, [val]);

  return (
    <div ref={ref}>
      <p className="font-display text-3xl lg:text-4xl font-light text-amber leading-none mb-1">{display}</p>
      <p className="font-mono text-[0.58rem] tracking-[0.1em] uppercase text-bark/25">{label}</p>
    </div>
  );
};

/* ── 3D Tilt wrapper ── */
const TiltCard: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = "", ...rest }) => {
  const ref = useRef<HTMLDivElement>(null);
  const rectRef = useRef<DOMRect | null>(null);

  const onMove = (e: React.MouseEvent) => {
    const card = ref.current;
    if (!card) return;
    if (!rectRef.current) rectRef.current = card.getBoundingClientRect();
    const rect = rectRef.current;
    const rx = ((e.clientY - rect.top - rect.height / 2) / (rect.height / 2)) * -6;
    const ry = ((e.clientX - rect.left - rect.width / 2) / (rect.width / 2)) * 6;
    card.style.transform = `perspective(1200px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
  };
  const onLeave = () => {
    rectRef.current = null;
    if (ref.current) ref.current.style.transform = "";
  };

  return (
    <div ref={ref} className={`tilt-card transition-transform duration-300 ease-out ${className}`}
      onMouseMove={onMove} onMouseLeave={onLeave} {...rest}>
      {children}
    </div>
  );
};

const Projects: React.FC = () => {
  const featured = PROJECTS.find((p) => p.featured) || PROJECTS[0];
  const rest     = featured ? PROJECTS.filter((p) => p.id !== featured.id) : PROJECTS;

  if (!featured) return null;

  return (
    <section id="projects" className="py-28 lg:py-36 bg-surface-dark">
      <div className="max-w-7xl mx-auto px-8 lg:px-16">
        {/* Header */}
        <div className="flex items-center gap-4 mb-5 reveal" data-reveal>
          <span className="section-label">Projects</span>
          <span className="h-px w-10 bg-amber/30 block" />
        </div>
        <h2
          className="font-display font-light text-bark mb-14 reveal"
          data-reveal
          style={{ fontSize: "clamp(2.8rem, 5vw, 5rem)", letterSpacing: "-0.02em", lineHeight: 1.0 }}
        >
          Things I've<br />
          <em className="italic text-amber">built &amp; shipped</em>
        </h2>

        {/* Featured project */}
        <TiltCard className="reveal mb-6" data-reveal>
          <div className="glow-card grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 lg:p-12">
            <div>
              {/* Featured badge */}
              <div className="flex items-center gap-3 mb-6">
                <span className="font-mono text-[0.6rem] tracking-[0.15em] uppercase text-amber/50">
                  {featured.index}
                </span>
                <span className="font-mono text-[0.55rem] tracking-[0.1em] uppercase bg-amber/10 text-amber border border-amber/20 px-2.5 py-1">
                  ★ Featured
                </span>
              </div>

              <h3
                className="font-display font-light text-bark mb-2 leading-tight"
                style={{ fontSize: "clamp(1.8rem, 3vw, 2.8rem)", letterSpacing: "-0.02em" }}
              >
                {featured.title}
              </h3>
              <p className="font-display italic text-amber/60 text-lg font-light mb-5">{featured.sub}</p>
              <p className="font-body text-[0.875rem] text-bark/40 leading-relaxed mb-6">{featured.desc}</p>

              {/* Metrics */}
              <div className="flex gap-8 mb-6">
                {featured.metrics.map((m) => (
                  <MetricCounter key={m.label} val={m.val} label={m.label} />
                ))}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-7">
                {featured.tags.map((t) => (
                  <span key={t} className="font-mono text-[0.58rem] tracking-[0.08em] uppercase
                    text-bark/30 border border-white/[0.06] px-2.5 py-1 hover:border-amber/25 hover:text-amber/60 transition-all duration-300">
                    {t}
                  </span>
                ))}
              </div>

              <a href={featured.github} target="_blank" rel="noreferrer"
                className="font-mono text-[0.68rem] tracking-[0.12em] uppercase text-amber
                  inline-flex items-center gap-2 border-b border-amber/30 pb-0.5
                  hover:gap-4 hover:border-amber transition-all duration-300 relative z-10">
                View on GitHub <span>→</span>
              </a>
            </div>

            {/* Network visual */}
            <div className="relative border border-white/[0.04] bg-night/50 overflow-hidden min-h-[260px] flex items-center justify-center">
              <NetworkCanvas color="255,122,26" nodeCount={28} />
              <div className="absolute inset-0 bg-gradient-to-br from-night/30 to-transparent pointer-events-none" />
            </div>
          </div>
        </TiltCard>

        {/* Other projects */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rest.map((proj, idx) => (
            <TiltCard key={proj.id} className="reveal" data-reveal data-reveal-delay={String(idx * 0.1)}>
              <div className="glow-card p-8 h-full flex flex-col relative overflow-hidden">
                {/* Project number watermark */}
                <span className="absolute -right-3 -top-6 font-display text-stroke pointer-events-none select-none"
                  style={{ fontSize: "8rem", opacity: 0.4 }}>
                  {proj.index}
                </span>

                <p className="font-mono text-[0.6rem] tracking-[0.15em] uppercase text-amber/40 mb-5 relative z-10">
                  {proj.index}
                </p>
                <h3
                  className="font-display font-light text-bark mb-3 leading-tight relative z-10"
                  style={{ fontSize: "clamp(1.4rem, 2.5vw, 2rem)", letterSpacing: "-0.02em" }}
                >
                  {proj.title}
                </h3>
                <p className="font-body text-[0.875rem] text-bark/35 leading-relaxed mb-5 flex-1 relative z-10">
                  {proj.desc}
                </p>

                <div className="flex flex-wrap gap-2 mb-6 relative z-10">
                  {proj.tags.map((t) => (
                    <span key={t} className="font-mono text-[0.58rem] tracking-[0.08em] uppercase
                      text-bark/20 border border-white/[0.04] px-2.5 py-1">
                      {t}
                    </span>
                  ))}
                </div>

                <a href={proj.github} target="_blank" rel="noreferrer"
                  className="font-mono text-[0.68rem] tracking-[0.12em] uppercase text-amber/70
                    inline-flex items-center gap-2 border-b border-amber/20 pb-0.5 self-start
                    hover:gap-4 hover:border-amber hover:text-amber transition-all duration-300 relative z-10">
                  GitHub <span>→</span>
                </a>
              </div>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
