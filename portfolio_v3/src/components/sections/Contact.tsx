import React, { useEffect, useRef, useCallback } from "react";

const SocialBtn: React.FC<{ href: string; label: string; icon: React.ReactNode }> = ({ href, label, icon }) => {
  const ref = useRef<HTMLAnchorElement>(null);

  const onMove = useCallback((e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.45;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.45;
    el.style.transform = `translate(${x}px, ${y}px)`;
  }, []);

  const onLeave = useCallback(() => {
    if (ref.current) ref.current.style.transform = "";
  }, []);

  return (
    <a
      ref={ref}
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel="noreferrer"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="w-14 h-14 rounded-full border border-bark/20 flex items-center justify-center text-bark/60
        hover:border-amber hover:text-amber hover:shadow-[0_0_20px_rgba(255,122,26,0.3)] transition-all duration-300
        text-xs font-mono tracking-wider cursor-none"
      title={label}
    >
      {icon}
    </a>
  );
};

const Contact: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const emailRef = useRef<HTMLAnchorElement>(null);

  const onEmailMove = useCallback((e: React.MouseEvent) => {
    const el = emailRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.25;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.25;
    el.style.transform = `translate(${x}px, ${y}px)`;
  }, []);

  const onEmailLeave = useCallback(() => {
    if (emailRef.current) emailRef.current.style.transform = "";
  }, []);

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;

    const resize = () => {
      cv.width = cv.offsetWidth;
      cv.height = cv.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const ctx = cv.getContext("2d")!;
    
    // Create particles
    const particleCount = 45;
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;
    }> = [];
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * cv.width,
        y: Math.random() * cv.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 2 + 1,
      });
    }

    let mouse = { x: -1000, y: -1000 };
    const handleMouseMove = (e: MouseEvent) => {
      const rect = cv.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    let animId: number;
    const draw = () => {
      animId = requestAnimationFrame(draw);
      const W = cv.width, H = cv.height;
      ctx.clearRect(0, 0, W, H);

      // Draw subtle grid lines
      ctx.strokeStyle = "rgba(192, 88, 0, 0.015)";
      ctx.lineWidth = 1;
      const gridSize = 100;
      for (let x = 0; x < W; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.stroke();
      }
      for (let y = 0; y < H; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }

      particles.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H;
        if (p.y > H) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(192, 88, 0, 0.18)";
        ctx.fill();

        // Connect to mouse
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 180) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(255, 122, 26, ${(1 - dist / 180) * 0.12})`;
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }

        // Connect to other particles
        for (let j = idx + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx2 = p.x - p2.x;
          const dy2 = p.y - p2.y;
          const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
          if (dist2 < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(192, 88, 0, ${(1 - dist2 / 120) * 0.06})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      });
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <section id="contact" className="relative min-h-[90vh] flex flex-col justify-center bg-night overflow-hidden py-24 select-none">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none opacity-50" />

      <div className="relative z-10 max-w-4xl mx-auto px-8 text-center reveal" data-reveal>
        <div className="flex items-center justify-center gap-4 mb-6">
          <span className="h-px w-8 bg-amber/20 block" />
          <span className="font-mono text-[0.65rem] tracking-[0.3em] uppercase text-amber">LET'S CONNECT</span>
          <span className="h-px w-8 bg-amber/20 block" />
        </div>

        <h2
          className="font-display font-light mb-8 leading-none text-white tracking-tight"
          style={{ fontSize: "clamp(3.5rem, 8vw, 7.5rem)", letterSpacing: "-0.04em" }}
        >
          Let's build <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber via-amber-glow to-amber font-serif italic">something crazy</span>
        </h2>

        <p className="font-body text-bark/60 max-w-lg mx-auto mb-12 text-[1rem] leading-relaxed">
          Actively seeking full-stack developer roles. If you're building something ambitious or have an opening, let's work together.
        </p>

        <div className="mb-14">
          <a
            ref={emailRef}
            href="mailto:nikhilkaundal1257@gmail.com"
            onMouseMove={onEmailMove}
            onMouseLeave={onEmailLeave}
            className="font-mono text-[0.8rem] tracking-[0.15em] uppercase
              inline-block border border-amber/30 text-amber px-10 py-4.5
              bg-surface/50 backdrop-blur-md rounded-none cursor-none
              hover:border-amber-glow hover:text-white transition-all duration-300
              hover:shadow-[0_0_40px_rgba(255,122,26,0.25)]"
          >
            nikhilkaundal1257@gmail.com
          </a>
        </div>

        <div className="flex items-center justify-center gap-6">
          {[
            {
              label: "LinkedIn",
              href: "https://linkedin.com/in/nikhilkaundal",
              icon: (
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              )
            },
            {
              label: "GitHub",
              href: "https://github.com/nikhilkaundal",
              icon: (
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              )
            },
            {
              label: "Phone",
              href: "tel:+919592729319",
              icon: (
                <svg className="w-5 h-5 stroke-current fill-none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
              )
            },
          ].map((s) => (
            <SocialBtn key={s.label} href={s.href} label={s.label} icon={s.icon} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Contact;
