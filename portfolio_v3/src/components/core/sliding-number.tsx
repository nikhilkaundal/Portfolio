import React from "react";
import { motion } from "framer-motion";

interface SlidingNumberProps {
  value: number;
  padStart?: boolean;
}

const Digit: React.FC<{ digit: string }> = ({ digit }) => {
  const num = parseInt(digit, 10);
  if (isNaN(num)) return <span>{digit}</span>;

  return (
    <div className="relative inline-block h-[1em] w-[0.62em] overflow-hidden leading-none tabular-nums select-none">
      <motion.div
        animate={{ y: `-${num * 10}%` }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="absolute left-0 top-0 flex flex-col items-center w-full"
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <span key={n} className="h-[1em] leading-none flex items-center justify-center font-mono">
            {n}
          </span>
        ))}
      </motion.div>
    </div>
  );
};

export const SlidingNumber: React.FC<SlidingNumberProps> = ({ value, padStart }) => {
  const str = padStart ? String(value).padStart(2, "0") : String(value);
  return (
    <span className="inline-flex items-center font-mono tracking-wider font-semibold">
      {str.split("").map((char, i) => (
        <Digit key={i} digit={char} />
      ))}
    </span>
  );
};

export default SlidingNumber;
