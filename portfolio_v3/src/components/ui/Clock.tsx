import React, { useEffect, useState } from "react";
import { Clock as ClockIcon } from "lucide-react";
import { SlidingNumber } from "../core/sliding-number";

export function Clock() {
  const [time, setTime] = useState<Date | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTime(new Date());
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted || !time) {
    return (
      <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-bark/15 bg-night-light/60 dark:bg-surface/30 backdrop-blur-xl shadow-sm font-mono text-[0.68rem] text-bark select-none opacity-0">
        <ClockIcon className="w-3 h-3 text-amber" />
        <span>00:00:00</span>
      </div>
    );
  }

  return (
    <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-bark/15 bg-night-light/60 dark:bg-surface/30 backdrop-blur-xl shadow-sm text-bark select-none font-mono text-[0.68rem] tracking-wider transition-colors duration-300">
      <ClockIcon className="w-3 h-3 text-amber flex-shrink-0" />
      <div className="flex items-center gap-0.5 font-mono text-bark font-semibold">
        <SlidingNumber value={time.getHours()} padStart={true} />
        <span className="text-bark/40 dark:text-bark/50 font-bold">:</span>
        <SlidingNumber value={time.getMinutes()} padStart={true} />
        <span className="text-bark/40 dark:text-bark/50 font-bold">:</span>
        <SlidingNumber value={time.getSeconds()} padStart={true} />
      </div>
      <span className="text-[0.58rem] font-bold text-amber/80 tracking-widest ml-0.5 uppercase">IST</span>
    </div>
  );
}

export default Clock;
