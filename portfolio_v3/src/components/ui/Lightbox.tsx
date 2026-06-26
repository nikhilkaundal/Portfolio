// src/components/ui/Lightbox.tsx
import React from "react";
import { useLightbox }      from "../../hooks/useLightbox";

interface Props {
  lightbox: ReturnType<typeof useLightbox>;
}

const Lightbox: React.FC<Props> = ({ lightbox }) => {
  const { isOpen, current, index, total, close, prev, next } = lightbox;

  if (!isOpen || !current) return null;

  return (
    <div
      className="fixed inset-0 z-[9000] flex items-center justify-center"
      style={{ background: "rgba(5,4,10,0.96)", backdropFilter: "blur(16px)" }}
      onClick={close}
    >
      {/* Image container */}
      <div
        className="relative max-w-5xl w-full mx-6 flex flex-col items-center gap-4"
        onClick={e => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={close}
          aria-label="Close"
          className="absolute -top-10 right-0
            font-mono text-[0.65rem] tracking-[0.2em] uppercase
            text-[var(--text-muted)] hover:text-[var(--accent)]
            transition-colors duration-200 cursor-none
            flex items-center gap-2"
        >
          <span>ESC</span>
          <svg width="14" height="14" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6"  y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        {/* Image */}
        <img
          src={current.src}
          alt={current.alt}
          className="max-h-[78vh] w-auto object-contain
            border border-[var(--border)]"
          style={{ boxShadow: "0 40px 100px rgba(0,0,0,0.6)" }}
        />

        {/* Caption + counter */}
        <div className="flex items-center justify-between w-full px-2">
          {current.caption && (
            <p className="font-mono text-[0.62rem] tracking-[0.1em]
              uppercase text-[var(--text-muted)]/60">
              {current.caption}
            </p>
          )}
          <p className="font-mono text-[0.6rem] tracking-[0.15em]
            text-[var(--text-muted)]/35 ml-auto">
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </p>
        </div>
      </div>

      {/* Prev / Next arrows */}
      {total > 1 && (
        <>
          <button
            onClick={e => { e.stopPropagation(); prev(); }}
            aria-label="Previous"
            className="absolute left-4 top-1/2 -translate-y-1/2
              w-10 h-10 border border-[var(--border)]
              bg-[var(--bg-secondary)]/80
              flex items-center justify-center cursor-none
              text-[var(--text-muted)] hover:text-[var(--accent)]
              hover:border-[var(--accent)]/40
              transition-all duration-200"
          >
            ←
          </button>
          <button
            onClick={e => { e.stopPropagation(); next(); }}
            aria-label="Next"
            className="absolute right-4 top-1/2 -translate-y-1/2
              w-10 h-10 border border-[var(--border)]
              bg-[var(--bg-secondary)]/80
              flex items-center justify-center cursor-none
              text-[var(--text-muted)] hover:text-[var(--accent)]
              hover:border-[var(--accent)]/40
              transition-all duration-200"
          >
            →
          </button>
        </>
      )}
    </div>
  );
};

export default Lightbox;
