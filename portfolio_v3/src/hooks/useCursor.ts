import { useEffect, useRef } from "react";

export function useCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mx = 0, my = 0; // Current mouse coords
    let rx = 0, ry = 0; // Current ring coords
    let rw = 20, rh = 20; // Current ring size
    let dotScale = 1; // Current dot scale
    
    // Interpolation helpers for rotation/stretching
    let currentSin = 0;
    let currentCos = 1;
    let currentStretch = 1;
    let currentSqueeze = 1;

    let hoveredEl: HTMLElement | null = null;
    let isHovering = false;
    
    let targetX = 0, targetY = 0;
    let targetW = 20, targetH = 20;
    let targetBr = "50%";
    
    let animId: number;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
    };
    document.addEventListener("mousemove", onMove);

    const handleMouseOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest(
        "a, button, .tilt-card, .skill-pill, .magnetic-btn, .project-card, [role='button'], input, textarea, .hover-magnetic"
      );
      if (target) {
        hoveredEl = target as HTMLElement;
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest(
        "a, button, .tilt-card, .skill-pill, .magnetic-btn, .project-card, [role='button'], input, textarea, .hover-magnetic"
      );
      const relatedTarget = e.relatedTarget as HTMLElement | null;
      const isStillInSameTarget = relatedTarget && target && target.contains(relatedTarget);
      
      if (target && !isStillInSameTarget && hoveredEl === target) {
        hoveredEl = null;
      }
    };

    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseout", handleMouseOut);

    const loop = () => {
      // 1. Determine target dimensions and positions
      if (hoveredEl) {
        const rect = hoveredEl.getBoundingClientRect();
        const style = window.getComputedStyle(hoveredEl);
        
        // Center of hovered element
        const bx = rect.left + rect.width / 2;
        const by = rect.top + rect.height / 2;
        
        // Magnetic pull: Snaps cursor close to center, but allows slight movement with mouse
        targetX = bx + (mx - bx) * 0.18;
        targetY = by + (my - by) * 0.18;
        
        targetW = rect.width + 12; // Snapping bubble outline pad
        targetH = rect.height + 12;
        targetBr = style.borderRadius || "8px";
        isHovering = true;

        if (ringRef.current && !ringRef.current.classList.contains("snapped")) {
          ringRef.current.classList.add("snapped");
        }
      } else {
        targetX = mx;
        targetY = my;
        targetW = 20; // Default ring size
        targetH = 20;
        targetBr = "50%";
        isHovering = false;

        if (ringRef.current && ringRef.current.classList.contains("snapped")) {
          ringRef.current.classList.remove("snapped");
        }
      }

      // 2. Interpolate dot scale (shrinks to 0 on hover)
      const targetDotScale = isHovering ? 0 : 1;
      dotScale += (targetDotScale - dotScale) * 0.2;
      
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%) scale(${dotScale})`;
      }

      // 3. Interpolate ring position and dimensions
      const easePos = isHovering ? 0.24 : 0.08;
      rx += (targetX - rx) * easePos;
      ry += (targetY - ry) * easePos;
      
      const easeSize = isHovering ? 0.24 : 0.12;
      rw += (targetW - rw) * easeSize;
      rh += (targetH - rh) * easeSize;

      // 4. Calculate fluid stretch and rotation
      let targetAngle = 0;
      let targetStretch = 1;
      let targetSqueeze = 1;

      if (!isHovering) {
        const dx = mx - rx;
        const dy = my - ry;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 2) {
          targetAngle = Math.atan2(dy, dx);
          // Scale stretch with distance (capped at 45% stretch)
          const stretchFactor = Math.min(distance * 0.012, 0.45);
          targetStretch = 1 + stretchFactor;
          targetSqueeze = 1 - stretchFactor * 0.4;
        }
      }

      // Interpolate rotation angle smoothly using trigonometric averages to prevent 360-deg wrap jumps
      const targetSin = Math.sin(targetAngle);
      const targetCos = Math.cos(targetAngle);
      currentSin += (targetSin - currentSin) * 0.15;
      currentCos += (targetCos - currentCos) * 0.15;
      const renderAngle = Math.atan2(currentSin, currentCos);

      // Interpolate scaling/stretch
      currentStretch += (targetStretch - currentStretch) * 0.18;
      currentSqueeze += (targetSqueeze - currentSqueeze) * 0.18;

      // 5. Apply style properties directly to the DOM for 60/120fps performance
      if (ringRef.current) {
        ringRef.current.style.width = `${rw}px`;
        ringRef.current.style.height = `${rh}px`;
        ringRef.current.style.borderRadius = targetBr;
        ringRef.current.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%) rotate(${renderAngle}rad) scale(${currentStretch}, ${currentSqueeze})`;
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
      cancelAnimationFrame(animId);
    };
  }, []);

  return { dotRef, ringRef };
}
