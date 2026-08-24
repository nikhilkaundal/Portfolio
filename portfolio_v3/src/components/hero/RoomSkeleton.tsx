import React from "react";

const RoomSkeleton: React.FC = () => {
  return (
    <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-transparent">
      {/* Dynamic spinner with amber accent */}
      <div className="relative w-10 h-10 mb-3 z-10">
        <div className="absolute inset-0 rounded-full border-2 border-bark/10" />
        <div className="absolute inset-0 rounded-full border-2 border-t-amber border-r-transparent border-b-transparent border-l-transparent animate-spin" />
      </div>
      <span className="font-mono text-[0.58rem] tracking-[0.2em] uppercase text-bark/40 z-10">
        Loading 3D Workspace...
      </span>
    </div>
  );
};

export default RoomSkeleton;
