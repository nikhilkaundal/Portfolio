import React, { createContext, useContext, useState, useEffect, useId } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, Transition } from "framer-motion";
import { X } from "lucide-react";

interface MorphingDialogContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  uniqueId: string;
  transition?: Transition;
}

const MorphingDialogContext = createContext<MorphingDialogContextType | undefined>(undefined);

function useMorphingDialog() {
  const context = useContext(MorphingDialogContext);
  if (!context) {
    throw new Error("useMorphingDialog must be used within a MorphingDialog");
  }
  return context;
}

export interface MorphingDialogProps {
  children: React.ReactNode;
  transition?: Transition;
}

export function MorphingDialog({ children, transition }: MorphingDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const uniqueId = useId();

  return (
    <MorphingDialogContext.Provider value={{ isOpen, setIsOpen, uniqueId, transition }}>
      {children}
    </MorphingDialogContext.Provider>
  );
}

export function MorphingDialogTrigger({
  children,
  className,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const { setIsOpen, uniqueId } = useMorphingDialog();

  return (
    <motion.div
      layoutId={`dialog-container-${uniqueId}`}
      onClick={() => setIsOpen(true)}
      className={`cursor-pointer ${className || ""}`}
      style={style}
    >
      {children}
    </motion.div>
  );
}

export function MorphingDialogContainer({ children }: { children: React.ReactNode }) {
  const { isOpen } = useMorphingDialog();

  useEffect(() => {
    const lenis = (window as any).__lenis;
    if (isOpen) {
      if (lenis) lenis.stop();
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      if (lenis) lenis.start();
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }
    return () => {
      if (lenis) lenis.start();
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [isOpen]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div
          data-lenis-prevent
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
          className="fixed inset-0 z-[999999] flex items-center justify-center p-4 sm:p-6"
        >
          {children}
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}

export function MorphingDialogContent({
  children,
  className,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const { setIsOpen, uniqueId, transition } = useMorphingDialog();

  return (
    <>
      {/* Backdrop Blur Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setIsOpen(false)}
        className="fixed inset-0 bg-black/80 backdrop-blur-md z-[-1]"
      />

      <motion.div
        layoutId={`dialog-container-${uniqueId}`}
        transition={transition || { type: "spring", stiffness: 200, damping: 24 }}
        data-lenis-prevent
        onWheel={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
        className={`relative z-10 overflow-hidden ${className || ""}`}
        style={style}
      >
        {children}
      </motion.div>
    </>
  );
}

export function MorphingDialogImage({
  src,
  alt,
  className,
  style,
}: {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const { uniqueId } = useMorphingDialog();

  return (
    <motion.img
      layoutId={`dialog-img-${uniqueId}`}
      src={src}
      alt={alt}
      className={className}
      style={style}
    />
  );
}

export function MorphingDialogTitle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { uniqueId } = useMorphingDialog();

  return (
    <motion.h3 layoutId={`dialog-title-${uniqueId}`} className={className}>
      {children}
    </motion.h3>
  );
}

export function MorphingDialogSubtitle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { uniqueId } = useMorphingDialog();

  return (
    <motion.p layoutId={`dialog-subtitle-${uniqueId}`} className={className}>
      {children}
    </motion.p>
  );
}

export function MorphingDialogClose({ className }: { className?: string }) {
  const { setIsOpen } = useMorphingDialog();

  return (
    <button
      onClick={() => setIsOpen(false)}
      className={`absolute top-4 right-4 p-2 rounded-full bg-bark/10 hover:bg-red-500/20 text-bark hover:text-red-500 transition-colors cursor-pointer z-20 flex items-center justify-center ${
        className || ""
      }`}
      aria-label="Close dialog"
    >
      <X className="w-5 h-5" />
    </button>
  );
}
