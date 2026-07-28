import React from "react";

const RoomSkeleton: React.FC = () => {
  return (
    <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-transparent">
      {/* Blurred room preview — gives a meaningful placeholder instead of blank void */}
      <img
        src="/images/room-static.png"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
        style={{
          filter: "blur(12px) saturate(0.7)",
          opacity: 0.35,
          transform: "scale(1.05)", // hide blur edge artifacts
        }}
      />

      {/* Dynamic spinner with amber accent */}
      <div className="relative w-12 h-12 mb-4 z-10">
        <div className="absolute inset-0 rounded-full border-2 border-bark/10" />
        <div className="absolute inset-0 rounded-full border-2 border-t-amber border-r-transparent border-b-transparent border-l-transparent animate-spin" />
      </div>
      <span className="font-mono text-[0.6rem] tracking-[0.2em] uppercase text-bark/40 z-10">
        Initializing 3D Space
      </span>
    </div>
  );
};

export default RoomSkeleton;
