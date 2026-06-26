// src/components/ui/AchievementCard.tsx
import React, { useState }    from "react";
import MasonryGrid             from "./MasonryGrid";
import { LightboxImage }       from "../../hooks/useLightbox";

interface Props {
  achievement: typeof import("../../data/portfolio").ACHIEVEMENTS[0];
  onOpenLightbox: (imgs: LightboxImage[], idx: number) => void;
}

const AchievementCard: React.FC<Props> = ({ achievement: a, onOpenLightbox }) => {
  const [photosOpen, setPhotosOpen] = useState(false);
  const hasPhotos = a.photos && a.photos.length > 0;

  return (
    <div
      className="achievement-card relative border-t border-[var(--border)] py-8
        group transition-colors duration-300
        hover:bg-[var(--accent)]/[0.02]"
    >
      {/* Hover left border */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[2px] bg-[var(--accent)]
          transition-transform duration-400 origin-bottom scale-y-0 group-hover:scale-y-100"
      />

      <div className="grid grid-cols-12 gap-6 items-start">

        {/* Index */}
        <div className="col-span-1">
          <span className="font-mono text-[0.6rem] tracking-[0.1em]
            text-[var(--accent)]/50">
            {a.index}
          </span>
        </div>

        {/* Main content */}
        <div className="col-span-8">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-display font-light text-[var(--text-primary)]
              text-xl tracking-tight">
              {a.title}
            </h3>
            {a.badge && (
              <span className="font-mono text-[0.55rem] tracking-[0.12em]
                uppercase px-2 py-0.5
                bg-[var(--accent)] text-[var(--text-primary)] font-bold">
                {a.badge}
              </span>
            )}
          </div>

          <p className="font-body text-[0.85rem] text-[var(--text-muted)]
            leading-relaxed mb-4">
            {a.desc}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {a.tags.map(t => (
              <span key={t}
                className="font-mono text-[0.58rem] tracking-[0.08em]
                  uppercase px-2 py-0.5
                  border border-[var(--border)]
                  text-[var(--text-muted)]/55">
                {t}
              </span>
            ))}
          </div>

          {/* Instagram link */}
          {"instagram" in a && (a as any).instagram && (
            <a
              href={(a as any).instagram}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 cursor-none
                font-mono text-[0.62rem] tracking-[0.1em] uppercase
                text-[var(--accent)]/60 hover:text-[var(--accent)]
                transition-colors duration-200"
            >
              <svg width="13" height="13" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <circle cx="12" cy="12" r="4"/>
                <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
              </svg>
              @capturedvisionnn
            </a>
          )}

          {/* Expandable masonry photos */}
          {hasPhotos && (
            <div className="mt-5">
              <button
                onClick={() => setPhotosOpen(o => !o)}
                className="flex items-center gap-2 cursor-none
                  font-mono text-[0.6rem] tracking-[0.15em] uppercase
                  text-[var(--text-muted)]/35
                  hover:text-[var(--accent)]/70
                  transition-colors duration-200 mb-3"
              >
                <span
                  className="transition-transform duration-300"
                  style={{ transform: photosOpen ? "rotate(45deg)" : "rotate(0deg)" }}
                >
                  +
                </span>
                {photosOpen
                  ? "Hide photos"
                  : `View photos (${a.photos.length})`}
              </button>

              {/* Smooth expand */}
              <div
                className="overflow-hidden transition-[max-height] duration-500
                  ease-in-out"
                style={{ maxHeight: photosOpen ? "1200px" : "0px" }}
              >
                <MasonryGrid
                  images={a.photos}
                  onOpen={onOpenLightbox}
                />
              </div>
            </div>
          )}
        </div>

        {/* Right side — photo count pill */}
        <div className="col-span-3 flex justify-end items-start">
          {hasPhotos && (
            <button
              onClick={() => setPhotosOpen(o => !o)}
              className="flex items-center gap-2 cursor-none
                font-mono text-[0.58rem] tracking-[0.1em] uppercase
                text-[var(--text-muted)]/30
                hover:text-[var(--accent)]/60
                border border-[var(--border)]
                hover:border-[var(--accent)]/25
                px-2.5 py-1.5
                transition-all duration-200"
            >
              <svg width="11" height="11" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
              {a.photos.length} photo{a.photos.length > 1 ? "s" : ""}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AchievementCard;
