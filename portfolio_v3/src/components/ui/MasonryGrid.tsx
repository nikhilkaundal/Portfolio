// src/components/ui/MasonryGrid.tsx
import React, { useState } from "react";
import { LightboxImage }            from "../../hooks/useLightbox";

interface MasonryImage extends LightboxImage {
  aspect: "portrait" | "landscape" | "square";
  // portrait  = tall  (2:3)
  // landscape = wide  (3:2)
  // square    = 1:1
}

interface Props {
  images:  MasonryImage[];
  onOpen:  (imgs: LightboxImage[], index: number) => void;
}

const MasonryGrid: React.FC<Props> = ({ images, onOpen }) => {
  const [hovered, setHovered] = useState<number | null>(null);

  // Split into 2 columns alternately for masonry effect
  const col1 = images.filter((_, i) => i % 2 === 0);
  const col2 = images.filter((_, i) => i % 2 !== 0);

  const renderImg = (img: MasonryImage, globalIdx: number) => (
    <div
      key={globalIdx}
      className="relative overflow-hidden cursor-none group
        border border-[var(--border)]
        transition-all duration-400"
      style={{
        aspectRatio:
          img.aspect === "portrait"  ? "2/3" :
          img.aspect === "landscape" ? "3/2" : "1/1",
        transform: hovered === globalIdx ? "scale(1.01)" : "scale(1)",
        boxShadow: hovered === globalIdx
          ? "0 20px 60px rgba(192,88,0,0.12)"
          : "none",
        borderColor: hovered === globalIdx
          ? "rgba(192,88,0,0.35)"
          : undefined,
        transition: "transform 0.4s cubic-bezier(.19,1,.22,1), box-shadow 0.4s, border-color 0.3s",
      }}
      onMouseEnter={() => setHovered(globalIdx)}
      onMouseLeave={() => setHovered(null)}
      onClick={() => onOpen(images, globalIdx)}
    >
      {/* Image */}
      <img
        src={img.src}
        alt={img.alt}
        loading="lazy"
        decoding="async"
        className="w-full h-full object-cover
          transition-transform duration-500 ease-out
          group-hover:scale-105"
      />

      {/* Hover overlay */}
      <div
        className="absolute inset-0 flex flex-col justify-end p-3
          transition-opacity duration-300"
        style={{
          background: "linear-gradient(to top, rgba(5,4,10,0.75) 0%, transparent 60%)",
          opacity: hovered === globalIdx ? 1 : 0,
        }}
      >
        {img.caption && (
          <p className="font-mono text-[0.58rem] tracking-[0.1em]
            uppercase text-[var(--text-primary)]/80 leading-relaxed">
            {img.caption}
          </p>
        )}
        <span className="font-mono text-[0.55rem] tracking-[0.15em]
          uppercase text-[var(--accent)]/70 mt-1">
          Click to expand →
        </span>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-2 gap-2">
      {/* Column 1 */}
      <div className="flex flex-col gap-2">
        {col1.map((img, i) => renderImg(img, i * 2))}
      </div>
      {/* Column 2 */}
      <div className="flex flex-col gap-2 mt-6">
        {/* mt-6 offset — Pinterest style shift */}
        {col2.map((img, i) => renderImg(img, i * 2 + 1))}
      </div>
    </div>
  );
};

export default MasonryGrid;
export type { MasonryImage };
