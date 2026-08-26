/* ═══════════════════════════════════════════════════════════
   Portfolio Audio Engine — Preloaded Custom WAV/MP3 & Web Audio Synthesizer
   ═══════════════════════════════════════════════════════════ */

let sharedAudioCtx: AudioContext | null = null;
let lastGlobalClickTime = 0;

// Preloaded Audio Objects for 0ms Instant Playback
const globalClickAudio = typeof window !== "undefined" ? new Audio("/click sounds/computer-mouse-click-1.mp3") : null;
const gameStartAudio = typeof window !== "undefined" ? new Audio("/click sounds/game.wav") : null;

if (globalClickAudio) globalClickAudio.preload = "auto";
if (gameStartAudio) gameStartAudio.preload = "auto";

/**
 * Plays the official portfolio mouse click sound: /click sounds/computer-mouse-click-1.mp3
 */
export function playGlobalMouseClick() {
  try {
    const nowTime = performance.now();
    if (nowTime - lastGlobalClickTime < 30) return;
    lastGlobalClickTime = nowTime;

    if (globalClickAudio) {
      const soundInstance = globalClickAudio.cloneNode() as HTMLAudioElement;
      soundInstance.volume = 0.65;
      soundInstance.play().catch(() => {});
    }
  } catch {
    /* Browser gesture policy guard */
  }
}

/**
 * Plays the official game start sound: /click sounds/game.wav
 */
export function playGameStartSound() {
  try {
    if (gameStartAudio) {
      const soundInstance = gameStartAudio.cloneNode() as HTMLAudioElement;
      soundInstance.volume = 0.85;
      soundInstance.play().catch(() => {});
    }
  } catch {
    /* Browser gesture policy guard */
  }
}

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!sharedAudioCtx) {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioCtx) {
      sharedAudioCtx = new AudioCtx();
    }
  }
  if (sharedAudioCtx && sharedAudioCtx.state === "suspended") {
    sharedAudioCtx.resume().catch(() => {});
  }
  return sharedAudioCtx;
}

export type SoundVariant = "click" | "pop" | "arcade" | "laser" | "powerup" | "explosion" | "mechanical";

/* ── Authentic Classic Mechanical Mouse Click Synthesizer ── */
export function playMechanicalMouseClick() {
  playGlobalMouseClick();
}

export function playClickSound(variant: SoundVariant = "click") {
  if (variant === "click" || variant === "mechanical") {
    playGlobalMouseClick();
    return;
  }
  if (variant === "arcade") {
    playGameStartSound();
    return;
  }
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    if (variant === "pop") {
      // Satisfying soft bubble pop (450Hz -> 950Hz short pitch pop)
      osc.type = "triangle";
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.exponentialRampToValueAtTime(950, now + 0.04);

      gain.gain.setValueAtTime(0.14, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.start(now);
      osc.stop(now + 0.04);
    } else if (variant === "laser") {
      // Fast retro laser zap (1000Hz to 180Hz square drop)
      osc.type = "square";
      osc.frequency.setValueAtTime(1000, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.05);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.start(now);
      osc.stop(now + 0.05);
    } else if (variant === "powerup") {
      // Bright power-up chime (E5 -> B5 rise)
      osc.type = "sine";
      osc.frequency.setValueAtTime(659.25, now);
      osc.frequency.exponentialRampToValueAtTime(987.77, now + 0.08);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.start(now);
      osc.stop(now + 0.12);
    } else if (variant === "explosion") {
      // Low impact thud (180Hz to 40Hz drop)
      osc.type = "triangle";
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.08);

      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.start(now);
      osc.stop(now + 0.08);
    }
  } catch {
    /* AudioContext not allowed before user gesture */
  }
}
