// src/hooks/useLightbox.ts
import { useState, useEffect, useCallback } from "react";

export interface LightboxImage {
  src:     string;
  alt:     string;
  caption?: string;
}

export function useLightbox() {
  const [images,  setImages]  = useState<LightboxImage[]>([]);
  const [index,   setIndex]   = useState<number>(-1);
  const isOpen = index >= 0;

  const open  = useCallback((imgs: LightboxImage[], i: number) => {
    setImages(imgs);
    setIndex(i);
    document.body.style.overflow = "hidden";
  }, []);

  const close = useCallback(() => {
    setIndex(-1);
    document.body.style.overflow = "";
  }, []);

  const prev = useCallback(() =>
    setIndex(i => (i - 1 + images.length) % images.length), [images.length]);

  const next = useCallback(() =>
    setIndex(i => (i + 1) % images.length), [images.length]);

  // Keyboard nav
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape")     close();
      if (e.key === "ArrowLeft")  prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, close, prev, next]);

  return {
    isOpen,
    current: images[index] ?? null,
    index,
    total: images.length,
    open, close, prev, next,
  };
}
