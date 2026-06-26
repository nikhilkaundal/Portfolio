import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import MusicPlayer from "../ui/MusicPlayer";

const LINKS = [
  { label: "About",    path: "/about"    },
  { label: "Skills",   path: "/skills"   },
  { label: "Work",     path: "/work"     },
  { label: "Projects", path: "/projects" },
  { label: "Contact",  path: "#contact"  },
];

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const [active, setActive] = useState(location.pathname);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);

      const contactEl = document.getElementById("contact");
      if (contactEl) {
        const rect = contactEl.getBoundingClientRect();
        if (rect.top <= 350) {
          setActive("contact");
          return;
        }
      }
      setActive(location.pathname);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  // Prevent background scroll when mobile drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[100] flex items-center justify-between transition-all duration-500 select-none
          ${scrolled
            ? "px-8 lg:px-16 py-3 bg-night/80 backdrop-blur-xl border-b border-white/[0.04]"
            : "px-8 lg:px-16 py-6"
          }`}
      >
        {/* Logo */}
        <Link
          to="/"
          className="font-display text-xl font-light tracking-[0.2em] text-bark group cursor-none"
          onClick={() => setIsOpen(false)}
        >
          NK
          <span className="text-amber inline-block group-hover:animate-pulse transition-all duration-300">.</span>
        </Link>

        {/* Desktop Links */}
        <ul className="hidden md:flex items-center gap-8 lg:gap-10 list-none m-0 p-0">
          {LINKS.map((link) => {
            const isLinkActive = link.path === "#contact" ? active === "contact" : active === link.path;
            return (
              <li key={link.path} className="relative">
                {link.path.startsWith("#") ? (
                  <a
                    href={link.path}
                    onClick={(e) => {
                      e.preventDefault();
                      setIsOpen(false);
                      const el = document.getElementById("contact");
                      if (el) {
                        el.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                    className={`font-mono text-[0.65rem] tracking-[0.18em] uppercase transition-colors duration-300 cursor-none
                      ${isLinkActive ? "text-amber" : "text-bark/40 hover:text-bark/70"}`}
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`font-mono text-[0.65rem] tracking-[0.18em] uppercase transition-colors duration-300 cursor-none
                      ${isLinkActive ? "text-amber" : "text-bark/40 hover:text-bark/70"}`}
                  >
                    {link.label}
                  </Link>
                )}
                {/* Active indicator dot */}
                {isLinkActive && (
                  <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-amber shadow-[0_0_8px_rgba(192,88,0,0.6)] transition-all duration-500" />
                )}
              </li>
            );
          })}
        </ul>

        {/* Action Group */}
        <div className="flex items-center gap-6">
          {/* Music Player */}
          <MusicPlayer />

          {/* Desktop Contact CTA */}
          <a
            href="mailto:nikhilkaundal1257@gmail.com"
            className="hidden sm:inline-block font-mono text-[0.62rem] tracking-[0.15em] uppercase text-amber border border-amber/30 px-5 py-2.5 cursor-none
              hover:bg-amber hover:text-night hover:border-amber hover:shadow-[0_0_30px_rgba(192,88,0,0.3)]
              transition-all duration-400"
          >
            Contact Me
          </a>

          {/* Hamburger Menu Trigger for Mobile */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden flex flex-col justify-between w-6 h-3.5 bg-transparent border-0 cursor-none relative z-[110] focus:outline-none"
            aria-label="Toggle Menu"
          >
            <span className={`w-6 h-[1.5px] bg-bark transition-all duration-300 ${isOpen ? "rotate-45 translate-y-[6px] bg-amber" : ""}`} />
            <span className={`w-6 h-[1.5px] bg-bark transition-all duration-300 ${isOpen ? "opacity-0 scale-x-0" : ""}`} />
            <span className={`w-6 h-[1.5px] bg-bark transition-all duration-300 ${isOpen ? "-rotate-45 -translate-y-[6px] bg-amber" : ""}`} />
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-[104] bg-black/60 backdrop-blur-sm md:hidden transition-opacity duration-500 ease-in-out"
        />
      )}

      {/* Mobile Drawer (70% Width) */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-[105] w-[70vw] max-w-[320px] bg-night/95 border-l border-white/[0.04] md:hidden 
          transition-all duration-500 ease-in-out flex flex-col justify-between p-8 pt-28
          ${isOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 pointer-events-none"}`}
      >
        <div className="flex flex-col gap-6">
          <span className="font-mono text-[0.6rem] tracking-[0.2em] text-amber mb-2 uppercase">Menu</span>
          <ul className="flex flex-col gap-5 list-none p-0 m-0">
            {LINKS.map((link, idx) => {
              const isLinkActive = link.path === "#contact" ? active === "contact" : active === link.path;
              return (
                <li key={link.path} className="overflow-hidden">
                  {link.path.startsWith("#") ? (
                    <a
                      href={link.path}
                      onClick={(e) => {
                        e.preventDefault();
                        setIsOpen(false);
                        const el = document.getElementById("contact");
                        if (el) {
                          el.scrollIntoView({ behavior: "smooth" });
                        }
                      }}
                      className={`font-display text-4xl font-light tracking-wide block transition-all duration-300 cursor-none
                        ${isLinkActive ? "text-amber translate-x-2" : "text-bark/50 hover:text-bark"}`}
                      style={{ transitionDelay: `${idx * 0.05}s` }}
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className={`font-display text-4xl font-light tracking-wide block transition-all duration-300 cursor-none
                        ${isLinkActive ? "text-amber translate-x-2" : "text-bark/50 hover:text-bark"}`}
                      style={{ transitionDelay: `${idx * 0.05}s` }}
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        <div className="flex flex-col gap-6">
          {/* Mobile CTA inside Drawer */}
          <a
            href="mailto:nikhilkaundal1257@gmail.com"
            className="w-full text-center font-mono text-[0.72rem] tracking-[0.15em] uppercase text-amber border border-amber/30 py-4 cursor-none
              hover:bg-amber hover:text-night hover:border-amber hover:shadow-[0_0_30px_rgba(192,88,0,0.3)]
              transition-all duration-400"
          >
            Contact Me
          </a>
          
          <div className="flex justify-between items-center font-mono text-[0.6rem] text-bark/40">
            <span>© 2026 NK</span>
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-glow animate-pulse" />
              <span className="text-amber-glow text-[0.58rem] tracking-wider">CHANDIGARH, IN</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
