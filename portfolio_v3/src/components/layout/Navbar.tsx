import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import MusicPlayer from "../ui/MusicPlayer";
import Clock from "../ui/Clock";
import { useTheme } from "../../hooks/useTheme";
import { Sun, Moon } from "lucide-react";

const LINKS = [
  { label: "Home",     path: "/"         },
  { label: "About",    path: "/about"    },
  { label: "Skills",   path: "/skills"   },
  { label: "Work",     path: "/work"     },
  { label: "Projects", path: "/projects" },
  { label: "Ask AI",   path: "/assistant" },
  { label: "Contact",  path: "#contact"  },
];

const SPRING_TRANSITION = {
  type: "spring",
  stiffness: 450,
  damping: 35,
  mass: 0.8,
} as const;

const Navbar: React.FC = () => {
  const { toggleTheme, isDark } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const [active, setActive] = useState(location.pathname);
  const [hovered, setHovered] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);

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

  if (location.pathname === "/assistant" || location.pathname === "/chat") {
    return null;
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[100] flex items-center justify-between transition-all duration-500 select-none
          ${scrolled
            ? "px-4 sm:px-6 lg:px-14 py-2.5 sm:py-3 bg-night/85 backdrop-blur-2xl border-b border-bark/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
            : "px-4 sm:px-6 lg:px-14 py-4 sm:py-6"
          }`}
      >
        {/* Minimal Logo */}
        <Link
          to="/"
          className="font-display text-lg sm:text-xl font-light tracking-[0.18em] text-bark group cursor-none relative z-10 flex items-center gap-1"
          onClick={() => setIsOpen(false)}
        >
          <span>NK</span>
          <span className="w-1.5 h-1.5 rounded-full bg-amber shadow-[0_0_10px_rgba(235,94,0,0.9)] animate-pulse" />
        </Link>

        {/* Floating Centered Glass Island (Ultra-Smooth Framer Motion Dock) */}
        <div
          className="hidden md:flex items-center gap-1 bg-night-light/85 backdrop-blur-2xl border border-bark/20 rounded-full px-2 py-1.5 shadow-[0_4px_24px_rgba(0,0,0,0.08)] relative"
          onMouseLeave={() => setHovered(null)}
        >
          {LINKS.map((link) => {
            const isLinkActive = link.path === "#contact" ? active === "contact" : active === link.path;
            const isHovered = hovered === link.path;

            return (
              <div
                key={link.path}
                className="relative flex items-center justify-center"
                onMouseEnter={() => setHovered(link.path)}
              >
                {/* Active Glowing Background Pill */}
                {isLinkActive && (
                  <motion.div
                    layoutId="nav-active-pill"
                    className="absolute inset-0 bg-gradient-to-r from-amber/20 via-amber/12 to-amber/20 border border-amber/40 rounded-full shadow-[0_0_25px_rgba(235,94,0,0.22)]"
                    transition={SPRING_TRANSITION}
                  />
                )}

                {/* Top Active Shimmer Line */}
                {isLinkActive && (
                  <motion.div
                    layoutId="nav-active-line"
                    className="absolute top-0 left-3 right-3 h-[1.5px] bg-gradient-to-r from-transparent via-amber-glow to-transparent shadow-[0_0_12px_rgba(255,122,26,0.9)]"
                    transition={SPRING_TRANSITION}
                  />
                )}

                {/* Hover Background Pill */}
                {isHovered && !isLinkActive && (
                  <motion.div
                    layoutId="nav-hover-pill"
                    className="absolute inset-0 bg-bark/8 border border-bark/15 rounded-full"
                    transition={SPRING_TRANSITION}
                  />
                )}

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
                    className={`relative z-10 block px-4 py-1.5 font-mono text-[0.62rem] tracking-[0.18em] uppercase transition-colors duration-300 cursor-none font-medium
                      ${isLinkActive ? "text-amber font-semibold" : "text-bark/50 hover:text-bark"}`}
                  >
                    <motion.span whileHover={{ y: -0.5 }} className="block">
                      {link.label}
                    </motion.span>
                  </a>
                ) : (
                  <Link
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`relative z-10 block px-4 py-1.5 font-mono text-[0.62rem] tracking-[0.18em] uppercase transition-colors duration-300 cursor-none font-medium
                      ${isLinkActive ? "text-amber font-semibold" : "text-bark/50 hover:text-bark"}`}
                  >
                    <motion.span whileHover={{ y: -0.5 }} className="block">
                      {link.label}
                    </motion.span>
                  </Link>
                )}

                {/* Bottom Active Indicator Dot */}
                {isLinkActive && (
                  <motion.span
                    layoutId="nav-active-dot"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-amber-glow shadow-[0_0_10px_rgba(255,122,26,1)]"
                    transition={SPRING_TRANSITION}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Action Controls Group */}
        <div className="flex items-center gap-2 sm:gap-3.5 relative z-10">
          {/* Music Player */}
          <MusicPlayer />

          {/* Live Digital Clock */}
          <Clock />

          {/* Theme Toggle Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            className="flex items-center justify-center p-2 sm:p-2.5 rounded-full border border-bark/15 text-bark/70 hover:text-amber hover:border-amber/40 transition-all duration-300 focus:outline-none cursor-none bg-night-light/60 backdrop-blur-xl shadow-sm"
            aria-label="Toggle theme"
          >
            {isDark ? (
              <Sun size={13} className="transition-transform duration-500 hover:rotate-45" />
            ) : (
              <Moon size={13} className="transition-transform duration-500 hover:-rotate-12" />
            )}
          </motion.button>

          {/* Contact Me Magnetic Pill */}
          <motion.a
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            href="https://mail.google.com/mail/?view=cm&fs=1&to=nikhilkaundal1257@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-block font-mono text-[0.62rem] tracking-[0.16em] uppercase text-amber border border-amber/35 px-5 py-2.5 rounded-full cursor-none
              bg-amber/8 hover:bg-amber hover:text-night hover:border-amber hover:shadow-[0_0_35px_rgba(235,94,0,0.4)]
              transition-all duration-300 font-semibold"
          >
            Contact Me
          </motion.a>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden flex flex-col justify-between w-5 h-3.5 bg-transparent border-0 cursor-none relative z-[110] focus:outline-none ml-0.5"
            aria-label="Toggle Menu"
          >
            <span className={`w-5 h-[1.5px] bg-bark transition-all duration-300 ${isOpen ? "rotate-45 translate-y-[6px] bg-amber" : ""}`} />
            <span className={`w-5 h-[1.5px] bg-bark transition-all duration-300 ${isOpen ? "opacity-0 scale-x-0" : ""}`} />
            <span className={`w-5 h-[1.5px] bg-bark transition-all duration-300 ${isOpen ? "-rotate-45 -translate-y-[6px] bg-amber" : ""}`} />
          </button>
        </div>
      </header>

      {/* Mobile Drawer Backdrop Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-[104] bg-black/70 backdrop-blur-md md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 350, damping: 32 }}
            className="fixed top-0 right-0 bottom-0 z-[105] w-[75vw] max-w-[320px] bg-night/98 border-l border-bark/10 md:hidden flex flex-col justify-between p-8 pt-28 shadow-2xl"
          >
            <div className="flex flex-col gap-6">
              <span className="font-mono text-[0.6rem] tracking-[0.2em] text-amber mb-2 uppercase font-semibold">Navigation</span>
              <ul className="flex flex-col gap-5 list-none p-0 m-0">
                {LINKS.map((link, idx) => {
                  const isLinkActive = link.path === "#contact" ? active === "contact" : active === link.path;
                  return (
                    <motion.li
                      key={link.path}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.04 }}
                      className="overflow-hidden"
                    >
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
                        >
                          {link.label}
                        </a>
                      ) : (
                        <Link
                          to={link.path}
                          onClick={() => setIsOpen(false)}
                          className={`font-display text-4xl font-light tracking-wide block transition-all duration-300 cursor-none
                            ${isLinkActive ? "text-amber translate-x-2" : "text-bark/50 hover:text-bark"}`}
                        >
                          {link.label}
                        </Link>
                      )}
                    </motion.li>
                  );
                })}
              </ul>
            </div>

            <div className="flex flex-col gap-6">
              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=nikhilkaundal1257@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-center font-mono text-[0.72rem] tracking-[0.15em] uppercase text-amber border border-amber/30 py-4 cursor-none rounded-full
                  hover:bg-amber hover:text-night hover:border-amber hover:shadow-[0_0_30px_rgba(192,88,0,0.3)]
                  transition-all duration-400 font-semibold bg-amber/5"
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
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
