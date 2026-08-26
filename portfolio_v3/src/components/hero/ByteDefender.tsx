import React, { useRef, useEffect, useState, useCallback } from "react";
import { playClickSound, playGameStartSound } from "../../utils/sound";

/* ═══════════════════════════════════════════════════════════
   BYTE DEFENDER v7.5 — Industrial High-Performance Space Shooter
   Pure HTML5 Canvas + requestAnimationFrame (Locked 60/120 FPS)
   React used ONLY for discrete state changes & theme synchronization
   ─────────────────────────────────────────────────────────
   Industrial Performance Guardrails & Optimizations:
   1. Zero DOM Queries in Loop: Cached theme state in plain ref (isLightRef)
   2. Zero Per-Frame Allocations: Cached gradient objects & pre-allocated entity pools
   3. Removed Expensive Per-Entity Shadow Blurs: Eliminates offscreen rasterization bottlenecks
   4. High-DPI Optimization: DPR capped at 1.5 for ultra-crisp display at maximum FPS
   5. Clamped Delta Time (max 33ms): Eliminates lag spikes and teleportation jitter
   6. Full 2D Movement, Interactive HTML Pause Button, Vertical Stacking Banners, Light Mode Sky Blue Theme
   ═══════════════════════════════════════════════════════════ */

// ── Types ──────────────────────────────────────────────────
type GamePhase = "idle" | "playing" | "wave-clear" | "boss-defeat" | "gameover" | "paused";
type EnemyType = "bug" | "glitch" | "virus";
type MovePattern = "straight" | "zigzag" | "dive";
type PowerUpType = "weapon" | "shield";

interface PoolBullet { x: number; y: number; vx: number; vy: number; active: boolean; }
interface PoolParticle { x: number; y: number; vx: number; vy: number; life: number; maxLife: number; color: string; size: number; active: boolean; }
interface PoolFlash { x: number; y: number; size: number; life: number; maxLife: number; active: boolean; }
interface PoolRing { x: number; y: number; radius: number; maxRadius: number; color: string; life: number; maxLife: number; active: boolean; }
interface Star { x: number; y: number; speed: number; size: number; opacity: number; color: string; }

interface Enemy {
  x: number; y: number; vx: number; vy: number;
  startX: number;
  type: EnemyType; hp: number; maxHp: number;
  width: number; height: number;
  phase: number;
  fireTimer: number;
  movePattern: MovePattern;
  diveState: "descending" | "diving";
  diveTimer: number;
  active: boolean;
}

interface Boss {
  x: number; y: number; vx: number; vy: number;
  hp: number; maxHp: number;
  width: number; height: number;
  phase: number;
  fireTimer: number;
  firePattern: number;
  entered: boolean;
}

interface Player {
  x: number; y: number;
  width: number; height: number;
  invulnTimer: number;
  visible: boolean;
}

interface Banner {
  text: string; emoji: string; subtext: string;
  timer: number; maxTimer: number;
}

interface PowerUp {
  x: number; y: number;
  vy: number;
  type: PowerUpType;
  active: boolean;
  phase: number;
}

// ── Constants ──────────────────────────────────────────────
const FIRE_COOLDOWN = 180;        // ms — auto-fire rate
const INVULN_DURATION = 1500;     // ms
const SHIELD_DURATION = 5000;     // ms
const PLAYER_SPEED = 320;         // px/sec
const BULLET_SPEED = 480;         // px/sec
const ENEMY_BULLET_SPEED = 240;   // px/sec
const STAR_COUNT = 65;
const WAVE_CLEAR_PAUSE = 650;     // ms
const BOSS_CLEAR_PAUSE = 1800;    // ms

// Pool sizes — strict guardrails
const POOL_PLAYER_BULLETS = 80;
const POOL_ENEMY_BULLETS = 60;
const POOL_PARTICLES = 140;
const POOL_FLASHES = 20;
const POOL_RINGS = 15;
const POOL_POWERUPS = 8;

const POWERUP_DROP_CHANCE = 8;
const MAX_TIER_BONUS = 50;

// Colors
const COL_AMBER = "#C05800";
const COL_AMBER_GLOW = "#FF7A1A";
const COL_BARK = "#E8E4DD";
const COL_ENEMY_RED = "#ff3344";
const COL_ENEMY_PURPLE = "#aa44ff";
const COL_BOSS_PURPLE = "#7722cc";
const COL_ENEMY_MAGENTA = "#ff44aa";
const COL_WEAPON_PU = "#00e5ff";
const COL_SHIELD_PU = "#ffea00";

// Weapon tier config
const WEAPON_TIERS: [number, number][] = [
  [1, 0],
  [2, 0.12],
  [3, 0.14],
  [4, 0.11],
  [5, 0.10],
];

// Cached Theme Configuration Object (prevents per-frame garbage)
const THEME_DARK = {
  isLight: false,
  bgStart: "#12091f",
  bgMid: "#08060e",
  bgEnd: "#030206",
  starColor: "#ffffff",
  starOpacityMult: 1.0,
  hudText: "#E8E4DD",
  scoreColor: COL_AMBER,
  modalBg: "rgba(8, 9, 16, 0.88)",
  modalBorder: "rgba(255, 122, 26, 0.4)",
  modalShadow: "rgba(0, 0, 0, 0.7)",
  modalTitle: COL_AMBER,
  modalTitleText: "#FFFFFF",
  modalSubtext: COL_BARK,
};

const THEME_LIGHT = {
  isLight: true,
  bgStart: "#E0F2FE",
  bgMid: "#F0F9FF",
  bgEnd: "#DBEAFE",
  starColor: "#000000",
  starOpacityMult: 0.75,
  hudText: "#0F172A",
  scoreColor: "#EA580C",
  modalBg: "rgba(255, 255, 255, 0.95)",
  modalBorder: "rgba(234, 88, 12, 0.3)",
  modalShadow: "rgba(15, 23, 42, 0.12)",
  modalTitle: "#EA580C",
  modalTitleText: "#0F172A",
  modalSubtext: "#475569",
};

// ── Helpers ────────────────────────────────────────────────
function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }
function rand(min: number, max: number) { return Math.random() * (max - min) + min; }
function clamp(v: number, lo: number, hi: number) { return Math.max(lo, Math.min(hi, v)); }

function aabb(
  ax: number, ay: number, aw: number, ah: number,
  bx: number, by: number, bw: number, bh: number
): boolean {
  return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
}

function getEnemyColor(type: EnemyType, isLight: boolean = false): string {
  if (type === "bug") return isLight ? "#DC2626" : COL_ENEMY_RED;
  if (type === "glitch") return isLight ? "#7E22CE" : COL_ENEMY_PURPLE;
  return isLight ? "#C026D3" : COL_ENEMY_MAGENTA;
}

function getEnemyHp(type: EnemyType): number {
  return type === "glitch" ? 2 : 1;
}

function makePool<T>(count: number, factory: () => T): T[] {
  const arr: T[] = [];
  for (let i = 0; i < count; i++) arr.push(factory());
  return arr;
}

// ── Component ──────────────────────────────────────────────
const ByteDefender: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // React state — ONLY updated at discrete moments & theme sync
  const [gamePhase, setGamePhase] = useState<GamePhase>("idle");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [wave, setWave] = useState(0);
  const [weaponTier, setWeaponTier] = useState(1);
  const [highScore, setHighScore] = useState(() => {
    try { return parseInt(localStorage.getItem("byte-defender-highscore") || "0", 10); } catch { return 0; }
  });
  const [bestWave, setBestWave] = useState(() => {
    try { return parseInt(localStorage.getItem("byte-defender-best-wave") || "0", 10); } catch { return 0; }
  });
  const [newBestScore, setNewBestScore] = useState(false);
  const [newBestWave, setNewBestWave] = useState(false);

  // Dynamic Theme state & Ref (prevents DOM queries inside animation frame loop!)
  const isLightRef = useRef(false);
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    const checkTheme = () => {
      const light = document.documentElement.getAttribute("data-theme") === "light";
      isLightRef.current = light;
      setIsLight(light);
    };
    checkTheme();
    window.addEventListener("themechange", checkTheme);

    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === "attributes" && m.attributeName === "data-theme") {
          checkTheme();
        }
      }
    });
    observer.observe(document.documentElement, { attributes: true });

    return () => {
      window.removeEventListener("themechange", checkTheme);
      observer.disconnect();
    };
  }, []);

  // ── Imperative game state in refs ──
  const gameRef = useRef({
    phase: "idle" as GamePhase,
    score: 0,
    displayScore: 0,
    lives: 3,
    wave: 0,
    weaponTier: 1,
    shieldTimer: 0,
    killStreak: 0,
    nextStreakMilestone: 5,
    fireTimer: 0,
    thrusterTimer: 0,
    pauseTimer: 0,
    bossVignetteTimer: 0,
    animId: 0,
    lastTime: 0,
    shake: { timer: 0, amplitude: 0 },
    dims: { w: 0, h: 0 },
    destroyCount: 0,
  });

  // Cached Background Gradient Ref (prevents creating gradient objects every frame)
  const cachedBgGradRef = useRef<CanvasGradient | null>(null);
  const cachedBgThemeRef = useRef<boolean | null>(null);
  const cachedBgDimsRef = useRef({ w: 0, h: 0 });

  // Input refs — 2D Touch & Key tracking
  const keysRef = useRef<Set<string>>(new Set());
  const touchActiveRef = useRef(false);
  const touchXRef = useRef(0);
  const touchYRef = useRef(0);

  // Entity pools
  const starsRef = useRef<Star[]>([]);
  const playerRef = useRef<Player>({ x: 0, y: 0, width: 22, height: 26, invulnTimer: 0, visible: true });
  const playerBulletsRef = useRef<PoolBullet[]>(
    makePool(POOL_PLAYER_BULLETS, () => ({ x: 0, y: 0, vx: 0, vy: 0, active: false }))
  );
  const enemyBulletsRef = useRef<PoolBullet[]>(
    makePool(POOL_ENEMY_BULLETS, () => ({ x: 0, y: 0, vx: 0, vy: 0, active: false }))
  );
  const enemiesRef = useRef<Enemy[]>([]);
  const idleEnemiesRef = useRef<Enemy[]>([]);
  const bossRef = useRef<Boss | null>(null);
  const particlesRef = useRef<PoolParticle[]>(
    makePool(POOL_PARTICLES, () => ({ x: 0, y: 0, vx: 0, vy: 0, life: 0, maxLife: 1, color: "", size: 0, active: false }))
  );
  const flashesRef = useRef<PoolFlash[]>(
    makePool(POOL_FLASHES, () => ({ x: 0, y: 0, size: 0, life: 0, maxLife: 0.08, active: false }))
  );
  const ringsRef = useRef<PoolRing[]>(
    makePool(POOL_RINGS, () => ({ x: 0, y: 0, radius: 2, maxRadius: 18, color: "", life: 0, maxLife: 0.25, active: false }))
  );
  const powerUpsRef = useRef<PowerUp[]>(
    makePool(POOL_POWERUPS, () => ({ x: 0, y: 0, vy: 0, type: "weapon", active: false, phase: 0 }))
  );
  const bannersRef = useRef<Banner[]>([]);

  // ── Pool Helpers ────────────────────────────────────────
  const acquireBullet = (pool: PoolBullet[], x: number, y: number, vx: number, vy: number) => {
    for (let i = 0; i < pool.length; i++) {
      const b = pool[i];
      if (!b.active) {
        b.x = x; b.y = y; b.vx = vx; b.vy = vy; b.active = true;
        return;
      }
    }
    const b = pool[0];
    b.x = x; b.y = y; b.vx = vx; b.vy = vy; b.active = true;
  };

  const acquireParticle = (x: number, y: number, vx: number, vy: number, color: string, size: number, life: number) => {
    for (let i = 0; i < particlesRef.current.length; i++) {
      const p = particlesRef.current[i];
      if (!p.active) {
        p.x = x; p.y = y; p.vx = vx; p.vy = vy;
        p.color = color; p.size = size; p.life = life; p.maxLife = life; p.active = true;
        return;
      }
    }
  };

  const acquireFlash = (x: number, y: number, size: number = 8) => {
    for (let i = 0; i < flashesRef.current.length; i++) {
      const f = flashesRef.current[i];
      if (!f.active) {
        f.x = x; f.y = y; f.size = size; f.life = 0.08; f.maxLife = 0.08; f.active = true;
        return;
      }
    }
  };

  const acquireRing = (x: number, y: number, color: string, maxRadius: number = 18) => {
    for (let i = 0; i < ringsRef.current.length; i++) {
      const r = ringsRef.current[i];
      if (!r.active) {
        r.x = x; r.y = y; r.radius = 2; r.maxRadius = maxRadius;
        r.color = color; r.life = 0.25; r.maxLife = 0.25; r.active = true;
        return;
      }
    }
  };

  const acquirePowerUp = (x: number, y: number, type: PowerUpType) => {
    for (let i = 0; i < powerUpsRef.current.length; i++) {
      const p = powerUpsRef.current[i];
      if (!p.active) {
        p.x = x; p.y = y; p.vy = 45; p.type = type; p.active = true; p.phase = Math.random() * Math.PI * 2;
        return;
      }
    }
  };

  // ── Sync React State ─────────────────────────────────────
  const syncState = useCallback(() => {
    const g = gameRef.current;
    setScore(g.score);
    setLives(g.lives);
    setWave(g.wave);
    setWeaponTier(g.weaponTier);
    setGamePhase(g.phase);
  }, []);

  // ── Pause / Resume Toggle ───────────────────────────────
  const togglePause = useCallback((e?: React.SyntheticEvent | Event) => {
    if (e && e.stopPropagation) e.stopPropagation();
    if (e && e.preventDefault) e.preventDefault();

    const g = gameRef.current;
    if (g.phase === "playing") {
      g.phase = "paused";
      syncState();
    } else if (g.phase === "paused") {
      g.phase = "playing";
      syncState();
    }
  }, [syncState]);

  // ── Spawn Particles & Explosion Ring ────────────────────
  const spawnExplosion = useCallback((x: number, y: number, color: string, count: number = 8) => {
    acquireRing(x, y, color, 22);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 60 + Math.random() * 180;
      acquireParticle(x, y, Math.cos(angle) * speed, Math.sin(angle) * speed, color, 1.5 + Math.random() * 2.5, 0.3 + Math.random() * 0.3);
    }
  }, []);

  // ── Show Banner ─────────────────────────────────────────
  const showBanner = useCallback((text: string, emoji: string, subtext: string, duration: number = 1500) => {
    bannersRef.current.push({ text, emoji, subtext, timer: duration, maxTimer: duration });
  }, []);

  // ── Initialize Starfield ────────────────────────────────
  const initStars = useCallback((w: number, h: number) => {
    const stars: Star[] = [];
    const colors = ["#ffffff", "#ffe2b8", "#a6e3ff", "#e0b8ff"];
    for (let i = 0; i < STAR_COUNT; i++) {
      const layer = Math.floor(Math.random() * 3);
      stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        speed: 12 + layer * 20,
        size: 0.5 + layer * 0.7,
        opacity: 0.2 + layer * 0.25,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
    starsRef.current = stars;
  }, []);

  // ── Spawn Ambient Background Parallax Enemies for Title Screen ──────────
  const initIdleEnemies = useCallback((w: number) => {
    const enemies: Enemy[] = [];
    const types: EnemyType[] = ["bug", "glitch", "virus"];
    const count = 6;
    const spacing = (w + 60) / count;

    for (let i = 0; i < count; i++) {
      const type = types[i % types.length];
      enemies.push({
        x: -30 + i * spacing,
        startX: -30 + i * spacing,
        y: 40 + (i % 2) * 16,
        vx: 14 + (i % 3) * 6,
        vy: 0,
        type, hp: 1, maxHp: 1,
        width: 18, height: 18,
        phase: i * 1.2,
        fireTimer: 9999,
        movePattern: "straight",
        diveState: "descending",
        diveTimer: 9999,
        active: true,
      });
    }
    idleEnemiesRef.current = enemies;
  }, []);

  // ── Spawn Wave ──────────────────────────────────────────
  const spawnWave = useCallback((waveNum: number, w: number, _h: number) => {
    const g = gameRef.current;
    const isBoss = waveNum % 5 === 0;
    for (const b of enemyBulletsRef.current) b.active = false;

    if (isBoss) {
      g.bossVignetteTimer = 1500;
      const bossHp = 25 + Math.floor(waveNum / 5) * 15;
      bossRef.current = {
        x: w / 2 - 30, y: -80,
        vx: (100 + waveNum * 4),
        vy: 0,
        hp: bossHp, maxHp: bossHp,
        width: 60, height: 50,
        phase: 0, fireTimer: 0, firePattern: 0, entered: false,
      };
      enemiesRef.current = [];
    } else {
      bossRef.current = null;
      const count = Math.min(8 + waveNum * 2, 40);
      const maxCols = w < 380 ? 6 : 8;
      const cols = Math.min(count, maxCols);
      const rows = Math.ceil(count / cols);
      const types: EnemyType[] = ["bug", "glitch", "virus"];
      const speedMult = 1 + waveNum * 0.06;

      const enemies: Enemy[] = [];
      const gapX = Math.min(50, (w - 40) / cols);

      for (let r = 0; r < rows; r++) {
        const rowCols = r === rows - 1 ? count - r * cols : cols;
        const rowStartX = (w - gapX * (rowCols - 1)) / 2;
        for (let c = 0; c < rowCols; c++) {
          const type = types[(r + c) % types.length];
          const hp = getEnemyHp(type);
          const startX = rowStartX + c * gapX - 11;

          let movePattern: MovePattern = "straight";
          if (waveNum >= 3) {
            const roll = Math.random();
            if (roll < 0.35) movePattern = "zigzag";
            else if (roll < 0.6) movePattern = "dive";
          }

          enemies.push({
            x: startX, startX,
            y: -30 - r * 40,
            vx: (20 + Math.random() * 12) * speedMult * (Math.random() > 0.5 ? 1 : -1),
            vy: (18 + r * 1.5) * speedMult,
            type, hp, maxHp: hp,
            width: 22, height: 22,
            phase: Math.random() * Math.PI * 2,
            fireTimer: rand(2000, 5000),
            movePattern,
            diveState: "descending",
            diveTimer: rand(1.5, 3.5),
            active: true,
          });
        }
      }
      enemiesRef.current = enemies;
    }
  }, []);

  // ── Fire Weapon ─────────────────────────────────────────
  const fireWeapon = useCallback(() => {
    const g = gameRef.current;
    const p = playerRef.current;
    const tier = g.weaponTier;
    const [bulletCount, spreadAngle] = WEAPON_TIERS[tier - 1];
    const pool = playerBulletsRef.current;
    const cx = p.x + p.width / 2;
    const by = p.y - 4;

    if (bulletCount === 1) {
      acquireBullet(pool, cx, by, 0, -BULLET_SPEED);
      acquireFlash(cx, by, 7);
    } else {
      const totalSpread = spreadAngle * (bulletCount - 1);
      const startAngle = -totalSpread / 2;
      for (let i = 0; i < bulletCount; i++) {
        const angle = startAngle + spreadAngle * i;
        const vx = Math.sin(angle) * BULLET_SPEED * 0.6;
        const vy = -Math.cos(angle) * BULLET_SPEED;
        const bx = cx + Math.sin(angle) * 8;
        acquireBullet(pool, bx, by, vx, vy);
        acquireFlash(bx, by, 5);
      }
    }
  }, []);

  // ── Game Over ───────────────────────────────────────────
  const gameOver = useCallback(() => {
    const g = gameRef.current;
    g.phase = "gameover";
    const finalScore = g.score;
    const finalWave = g.wave;

    let newHS = false, newBW = false;
    try {
      const storedHS = parseInt(localStorage.getItem("byte-defender-highscore") || "0", 10);
      if (finalScore > storedHS) {
        localStorage.setItem("byte-defender-highscore", String(finalScore));
        setHighScore(finalScore);
        newHS = true;
      }
      const storedBW = parseInt(localStorage.getItem("byte-defender-best-wave") || "0", 10);
      if (finalWave > storedBW) {
        localStorage.setItem("byte-defender-best-wave", String(finalWave));
        setBestWave(finalWave);
        newBW = true;
      }
    } catch { /* localStorage unavailable */ }

    setNewBestScore(newHS);
    setNewBestWave(newBW);
    syncState();
  }, [syncState]);

  // ── Player Takes Damage ─────────────────────────────────
  const playerHit = useCallback(() => {
    const p = playerRef.current;
    const g = gameRef.current;
    if (p.invulnTimer > 0 || g.shieldTimer > 0) return;

    g.lives -= 1;
    p.invulnTimer = INVULN_DURATION;
    g.shake = { timer: 150, amplitude: 4 };

    g.killStreak = 0;
    g.nextStreakMilestone = 5;
    if (g.weaponTier > 1) g.weaponTier -= 1;

    spawnExplosion(p.x + p.width / 2, p.y + p.height / 2, COL_AMBER_GLOW, 8);
    syncState();

    if (g.lives <= 0) {
      gameOver();
    }
  }, [spawnExplosion, syncState, gameOver]);

  // ── Guaranteed Start Game trigger ────────────────────────
  const startGame = useCallback(() => {
    playGameStartSound();
    const g = gameRef.current;
    const { w, h } = g.dims;
    if (w === 0) return;

    g.score = 0; g.displayScore = 0; g.lives = 3; g.wave = 1;
    g.weaponTier = 1; g.shieldTimer = 0;
    g.killStreak = 0; g.nextStreakMilestone = 5;
    g.fireTimer = 0; g.thrusterTimer = 0; g.pauseTimer = 0;
    g.bossVignetteTimer = 0;
    g.phase = "playing"; g.destroyCount = 0;
    g.shake = { timer: 0, amplitude: 0 };

    playerRef.current = { x: w / 2 - 11, y: h - 50, width: 22, height: 26, invulnTimer: 0, visible: true };
    for (let i = 0; i < playerBulletsRef.current.length; i++) playerBulletsRef.current[i].active = false;
    for (let i = 0; i < enemyBulletsRef.current.length; i++) enemyBulletsRef.current[i].active = false;
    for (let i = 0; i < particlesRef.current.length; i++) particlesRef.current[i].active = false;
    for (let i = 0; i < flashesRef.current.length; i++) flashesRef.current[i].active = false;
    for (let i = 0; i < ringsRef.current.length; i++) ringsRef.current[i].active = false;
    for (let i = 0; i < powerUpsRef.current.length; i++) powerUpsRef.current[i].active = false;
    enemiesRef.current = [];
    bossRef.current = null;
    bannersRef.current = [];

    setNewBestScore(false);
    setNewBestWave(false);
    spawnWave(1, w, h);
    syncState();
  }, [spawnWave, syncState]);

  // Handle interaction across pointer/touch/click for start only
  const handleStartInteraction = useCallback((e?: React.SyntheticEvent | Event) => {
    const g = gameRef.current;
    if (g.phase === "idle" || g.phase === "gameover") {
      if (e && e.preventDefault && e.cancelable) e.preventDefault();
      startGame();
    }
  }, [startGame]);

  // ── Main Game Loop ──────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const g = gameRef.current;
    let running = true;

    // Fast DPR Resize Optimization with ResizeObserver (Zero edge gaps)
    const resize = () => {
      const wrapper = wrapperRef.current;
      if (!wrapper) return;
      const rect = wrapper.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = Math.floor(rect.width);
      const h = Math.floor(rect.height);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.dims = { w, h };
      if (starsRef.current.length === 0) initStars(w, h);
      if (idleEnemiesRef.current.length === 0) initIdleEnemies(w);
    };
    resize();
    window.addEventListener("resize", resize);

    const resizeObserver = new ResizeObserver(() => {
      resize();
    });
    if (wrapperRef.current) {
      resizeObserver.observe(wrapperRef.current);
    }

    const GAME_KEYS = new Set([
      "arrowup", "arrowdown", "arrowleft", "arrowright",
      "w", "a", "s", "d", " ", "space"
    ]);

    const onKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      keysRef.current.add(key);

      if (GAME_KEYS.has(key) && (g.phase === "playing" || g.phase === "paused")) {
        if (e.cancelable) e.preventDefault();
      }

      if (key === " " || key === "space") {
        if (e.cancelable) e.preventDefault();
        if (g.phase === "idle" || g.phase === "gameover") startGame();
        else if (g.phase === "paused") togglePause();
      } else if (key === "p" || key === "escape") {
        if (e.cancelable) e.preventDefault();
        togglePause();
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      keysRef.current.delete(e.key.toLowerCase());
    };

    const onPointerDown = (e: PointerEvent) => {
      if (g.phase === "idle" || g.phase === "gameover") {
        if (e.cancelable) e.preventDefault();
        startGame();
      } else if (g.phase === "paused") {
        if (e.cancelable) e.preventDefault();
        togglePause();
      }
    };

    const onTouchStart = (e: TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const touchX = e.touches[0].clientX - rect.left;
      const touchY = e.touches[0].clientY - rect.top;

      touchXRef.current = touchX;
      touchYRef.current = touchY;
      touchActiveRef.current = true;
      if (g.phase === "idle" || g.phase === "gameover") {
        if (e.cancelable) e.preventDefault();
        startGame();
      } else if (g.phase === "paused") {
        if (e.cancelable) e.preventDefault();
        togglePause();
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.cancelable) e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      touchXRef.current = e.touches[0].clientX - rect.left;
      touchYRef.current = e.touches[0].clientY - rect.top;
    };
    const onTouchEnd = () => {
      touchActiveRef.current = false;
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("touchstart", onTouchStart, { passive: false });
    canvas.addEventListener("touchmove", onTouchMove, { passive: false });
    canvas.addEventListener("touchend", onTouchEnd);

    // ── Render Helpers (High-Performance Vector Paths, Minimal State Switches) ──
    const drawPlayer = (p: Player, time: number) => {
      if (!p.visible && p.invulnTimer > 0) return;
      const cx = p.x + p.width / 2;
      const cy = p.y;

      if (g.shieldTimer > 0) {
        ctx.strokeStyle = COL_SHIELD_PU;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(cx, p.y + p.height / 2, p.width + 4, 0, Math.PI * 2);
        ctx.stroke();

        const shieldRatio = g.shieldTimer / SHIELD_DURATION;
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(cx, p.y + p.height / 2, p.width + 6, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * shieldRatio);
        ctx.stroke();
      }

      ctx.fillStyle = COL_AMBER;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx - 5, cy + 8);
      ctx.lineTo(p.x, cy + p.height - 4);
      ctx.lineTo(cx - 4, cy + p.height);
      ctx.lineTo(cx - 3, cy + p.height + 4);
      ctx.lineTo(cx + 3, cy + p.height + 4);
      ctx.lineTo(cx + 4, cy + p.height);
      ctx.lineTo(p.x + p.width, cy + p.height - 4);
      ctx.lineTo(cx + 5, cy + 8);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = "#fff2cb";
      ctx.beginPath();
      ctx.moveTo(cx, cy + 4);
      ctx.lineTo(cx - 3, cy + 14);
      ctx.lineTo(cx + 3, cy + 14);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = COL_AMBER_GLOW;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx - 2, cy + 10); ctx.lineTo(p.x + 2, cy + p.height - 5);
      ctx.moveTo(cx + 2, cy + 10); ctx.lineTo(p.x + p.width - 2, cy + p.height - 5);
      ctx.stroke();
    };

    // Ultra-Fast Enemy Vector Renderer (High-Contrast Theme Aware)
    const drawEnemy = (e: Enemy, time: number, tc: typeof THEME_DARK) => {
      const cx = e.x + e.width / 2;
      const cy = e.y + e.height / 2;
      const color = getEnemyColor(e.type, tc.isLight);
      const pulse = 0.82 + Math.sin(time * 0.003 + e.phase) * 0.18;

      ctx.globalAlpha = pulse;
      ctx.fillStyle = color;
      ctx.strokeStyle = color;
      ctx.lineWidth = tc.isLight ? 1.6 : 1.2;

      if (e.type === "bug") {
        ctx.beginPath();
        ctx.moveTo(cx, cy + e.height / 2);
        ctx.lineTo(e.x + 2, cy + 4);
        ctx.lineTo(e.x, e.y);
        ctx.lineTo(e.x + 6, e.y + 3);
        ctx.lineTo(cx, e.y);
        ctx.lineTo(e.x + e.width - 6, e.y + 3);
        ctx.lineTo(e.x + e.width, e.y);
        ctx.lineTo(e.x + e.width - 2, cy + 4);
        ctx.closePath();
        ctx.stroke();

        // Bug Eyes: Dark slate in light mode, crisp white in dark mode
        ctx.fillStyle = tc.isLight ? "#0F172A" : "#ffffff";
        ctx.fillRect(cx - 5, cy - 3, 3, 3);
        ctx.fillRect(cx + 2, cy - 3, 3, 3);
      } else if (e.type === "glitch") {
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const angle = (Math.PI / 3) * i - Math.PI / 6;
          const r = e.width / 2 - 1;
          const px = cx + r * Math.cos(angle);
          const py = cy + r * Math.sin(angle);
          if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(cx - 4, e.y + 3); ctx.lineTo(cx - 7, e.y - 3);
        ctx.moveTo(cx + 4, e.y + 3); ctx.lineTo(cx + 7, e.y - 3);
        ctx.stroke();

        // Glitch Core Dot: Deep purple in light mode
        ctx.fillStyle = tc.isLight ? "#581C87" : "#e8b8ff";
        ctx.beginPath();
        ctx.arc(cx, cy, 3, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.moveTo(cx, e.y);
        ctx.lineTo(e.x + e.width, cy);
        ctx.lineTo(cx, e.y + e.height);
        ctx.lineTo(e.x, cy);
        ctx.closePath();
        ctx.stroke();

        // Virus Cross / Plus: Deep magenta in light mode, white in dark mode
        ctx.fillStyle = tc.isLight ? "#831843" : "#ffffff";
        ctx.fillRect(cx - 1, cy - 4, 2, 8);
        ctx.fillRect(cx - 4, cy - 1, 8, 2);
      }
      ctx.globalAlpha = 1.0;
    };

    const drawBoss = (boss: Boss, time: number) => {
      const cx = boss.x + boss.width / 2;
      const cy = boss.y + boss.height / 2;
      const pulse = 0.85 + Math.sin(time * 0.002) * 0.15;

      if (!boss.entered) {
        ctx.globalAlpha = 0.35;
        ctx.fillStyle = "#ff0055";
        ctx.fillRect(boss.x - 2, boss.y, boss.width, boss.height);
        ctx.fillStyle = "#00e5ff";
        ctx.fillRect(boss.x + 2, boss.y, boss.width, boss.height);
      }

      ctx.globalAlpha = pulse;
      ctx.fillStyle = COL_BOSS_PURPLE;

      ctx.beginPath();
      for (let i = 0; i < 8; i++) {
        const angle = (Math.PI / 4) * i - Math.PI / 8;
        const r = boss.width / 2;
        const px = cx + r * Math.cos(angle);
        const py = cy + r * Math.sin(angle);
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = "#bb55ff";
      ctx.lineWidth = 1.5;
      ctx.globalAlpha = 0.6;
      ctx.beginPath();
      for (let i = 0; i < 8; i++) {
        const angle = (Math.PI / 4) * i - Math.PI / 8;
        const r = boss.width / 3;
        const px = cx + r * Math.cos(angle);
        const py = cy + r * Math.sin(angle);
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.stroke();

      ctx.globalAlpha = 1.0;
      const barW = boss.width + 20;
      const barH = 4;
      const barX = cx - barW / 2;
      const barY = boss.y - 12;
      const fill = boss.hp / boss.maxHp;
      ctx.fillStyle = "rgba(255,255,255,0.1)";
      ctx.fillRect(barX, barY, barW, barH);
      ctx.fillStyle = fill > 0.3 ? COL_BOSS_PURPLE : COL_ENEMY_RED;
      ctx.fillRect(barX, barY, barW * fill, barH);
    };

    const drawPowerUp = (pu: PowerUp, time: number) => {
      const cx = pu.x;
      const cy = pu.y;
      const bob = Math.sin(time * 0.004 + pu.phase) * 2;
      const rot = time * 0.002 + pu.phase;

      ctx.save();
      ctx.translate(cx, cy + bob);
      ctx.rotate(rot);

      if (pu.type === "weapon") {
        ctx.fillStyle = COL_WEAPON_PU;
        ctx.beginPath();
        ctx.moveTo(0, -7); ctx.lineTo(5, 0); ctx.lineTo(2, 0);
        ctx.lineTo(2, 7); ctx.lineTo(-2, 7); ctx.lineTo(-2, 0); ctx.lineTo(-5, 0);
        ctx.closePath();
        ctx.fill();
      } else {
        ctx.fillStyle = COL_SHIELD_PU;
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const a = (Math.PI / 3) * i;
          const px = 6 * Math.cos(a);
          const py = 6 * Math.sin(a);
          if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();
    };

    // ── FIXED Theme-Aware HUD Layout ──────────────────────
    const drawHud = (w: number, _h: number, tc: typeof THEME_DARK) => {
      ctx.font = "bold 10px 'Space Mono', monospace";
      ctx.textBaseline = "top";

      // 1. SCORE — Top Left
      ctx.fillStyle = tc.scoreColor;
      ctx.textAlign = "left";
      ctx.fillText(`SCORE: ${Math.floor(g.displayScore)}`, 10, 10);

      // 2. LIVES — Center
      const livesCount = g.lives;
      const lifeSize = 8;
      const lifeGap = 4;
      const totalW = 3 * lifeSize + 2 * lifeGap;
      const startX = w / 2 - totalW / 2;
      for (let i = 0; i < 3; i++) {
        const lx = startX + i * (lifeSize + lifeGap) + lifeSize / 2;
        const ly = 12;
        ctx.fillStyle = i < livesCount ? COL_AMBER_GLOW : (tc.isLight ? "rgba(15,23,42,0.18)" : "rgba(255,255,255,0.2)");
        ctx.beginPath();
        ctx.moveTo(lx, ly - lifeSize / 2);
        ctx.lineTo(lx - lifeSize / 2, ly + lifeSize / 2);
        ctx.lineTo(lx + lifeSize / 2, ly + lifeSize / 2);
        ctx.closePath();
        ctx.fill();
      }

      // 3. WAVE count
      const isMobile = w < 380;
      ctx.font = isMobile ? "bold 9px 'Space Mono', monospace" : "bold 10px 'Space Mono', monospace";
      ctx.fillStyle = tc.hudText;
      ctx.textAlign = "right";
      ctx.fillText(`WAVE ${g.wave}`, w - (isMobile ? 80 : 95), 10);

      // Weapon Tier Mk Indicator
      if (g.weaponTier > 1) {
        ctx.font = "bold 8px 'Space Mono', monospace";
        ctx.fillStyle = COL_WEAPON_PU;
        ctx.textAlign = "center";
        ctx.fillText(`MK.${["I", "II", "III", "IV", "V"][g.weaponTier - 1]}`, w / 2, 24);
      }
    };

    // ── Industry-Grade Title Screen (Redesigned Idle Experience) ──────────
    const drawIdleScreen = (w: number, h: number, time: number, dt_s: number, tc: typeof THEME_DARK) => {
      const cx = w / 2;
      const isMobile = w < 380;
      const reducedMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      // 1. Ambient Background Vignette & Center Radial Glow
      const vignette = ctx.createRadialGradient(cx, h * 0.4, 20, cx, h * 0.4, Math.max(w, h) * 0.8);
      if (tc.isLight) {
        vignette.addColorStop(0, "rgba(224, 242, 254, 0.45)");
        vignette.addColorStop(0.7, "rgba(219, 234, 254, 0.15)");
        vignette.addColorStop(1, "rgba(186, 230, 253, 0.3)");
      } else {
        vignette.addColorStop(0, "rgba(235, 94, 0, 0.07)");
        vignette.addColorStop(0.65, "rgba(15, 23, 42, 0.2)");
        vignette.addColorStop(1, "rgba(5, 5, 10, 0.65)");
      }
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, w, h);

      // 2. Parallax Drifting Ambient Enemy Scenery (Low opacity background layer)
      ctx.save();
      ctx.globalAlpha = tc.isLight ? 0.35 : 0.28;
      for (let i = 0; i < idleEnemiesRef.current.length; i++) {
        const e = idleEnemiesRef.current[i];
        if (!reducedMotion) {
          e.x += e.vx * dt_s;
          if (e.x > w + 30) e.x = -30;
        }
        drawEnemy(e, time, tc);
      }
      ctx.restore();

      // 3. Hero Title Lockup (Upper-Middle Third: h * 0.24)
      ctx.save();
      const titleY = Math.max(55, h * 0.24);
      const titleGlow = reducedMotion ? 0.75 : 0.55 + Math.sin(time * 0.0025) * 0.45;

      // HUD Framing Corner Flourishes & Accent Lines
      const titleText = "BYTE DEFENDER";
      ctx.font = isMobile ? "900 17px 'Space Mono', monospace" : "900 23px 'Space Mono', monospace";
      const titleMetrics = ctx.measureText(titleText);
      const titleW = titleMetrics.width;
      const boxW = titleW + (isMobile ? 32 : 44);
      const boxH = isMobile ? 36 : 44;
      const boxX = cx - boxW / 2;
      const boxY = titleY - boxH / 2;

      // Outer HUD corner tick marks [ ]
      ctx.strokeStyle = tc.isLight ? "rgba(234, 88, 12, 0.45)" : "rgba(245, 158, 11, 0.5)";
      ctx.lineWidth = 1.4;
      const bracketLen = isMobile ? 8 : 12;

      // Top-Left corner
      ctx.beginPath();
      ctx.moveTo(boxX, boxY + bracketLen); ctx.lineTo(boxX, boxY); ctx.lineTo(boxX + bracketLen, boxY);
      ctx.stroke();
      // Top-Right corner
      ctx.beginPath();
      ctx.moveTo(boxX + boxW - bracketLen, boxY); ctx.lineTo(boxX + boxW, boxY); ctx.lineTo(boxX + boxW, boxY + bracketLen);
      ctx.stroke();
      // Bottom-Left corner
      ctx.beginPath();
      ctx.moveTo(boxX, boxY + boxH - bracketLen); ctx.lineTo(boxX, boxY + boxH); ctx.lineTo(boxX + bracketLen, boxY + boxH);
      ctx.stroke();
      // Bottom-Right corner
      ctx.beginPath();
      ctx.moveTo(boxX + boxW - bracketLen, boxY + boxH); ctx.lineTo(boxX + boxW, boxY + boxH); ctx.lineTo(boxX + boxW, boxY + boxH - bracketLen);
      ctx.stroke();

      // Horizontal side accent extension lines
      const lineLen = Math.min(30, (w - boxW - 20) / 2);
      if (lineLen > 10) {
        ctx.strokeStyle = tc.isLight ? "rgba(234, 88, 12, 0.25)" : "rgba(245, 158, 11, 0.25)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(boxX - lineLen, titleY); ctx.lineTo(boxX - 6, titleY);
        ctx.moveTo(boxX + boxW + 6, titleY); ctx.lineTo(boxX + boxW + lineLen, titleY);
        ctx.stroke();
      }

      // Title Text with Breathing Glow
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.shadowColor = tc.isLight ? "rgba(234, 88, 12, 0.4)" : "rgba(245, 158, 11, 0.6)";
      ctx.shadowBlur = 12 * titleGlow;
      ctx.fillStyle = tc.modalTitleText;
      ctx.globalAlpha = 0.95;
      ctx.fillText(titleText, cx, titleY - 1);
      ctx.shadowBlur = 0;

      // Subtitle: WAVE-BASED ARCADE SHOOTER
      ctx.font = isMobile ? "bold 8px 'Space Mono', monospace" : "bold 9px 'Space Mono', monospace";
      ctx.fillStyle = tc.modalTitle;
      ctx.globalAlpha = 0.7;
      ctx.fillText("// WAVE-BASED ARCADE SHOOTER", cx, titleY + (isMobile ? 24 : 28));
      ctx.restore();

      // 4. CTA Panel (Centered Area: h * 0.56)
      ctx.save();
      const ctaY = Math.min(h - 95, Math.max(titleY + 65, h * 0.55));
      const cardW = Math.min(w - 28, isMobile ? 240 : 300);
      const cardH = isMobile ? 56 : 68;
      const bx = cx - cardW / 2;
      const by = ctaY - cardH / 2;

      ctx.fillStyle = tc.modalBg;
      ctx.shadowColor = tc.modalShadow;
      ctx.shadowBlur = 16;
      ctx.beginPath();
      ctx.roundRect(bx, by, cardW, cardH, 12);
      ctx.fill();

      ctx.strokeStyle = tc.modalBorder;
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // CTA Primary Pulsing Text
      const pulseAlpha = reducedMotion ? 0.85 : 0.55 + Math.sin(time * 0.0035) * 0.45;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = isMobile ? "bold 11px 'Space Mono', monospace" : "bold 12px 'Space Mono', monospace";
      ctx.fillStyle = tc.modalTitleText;
      ctx.globalAlpha = pulseAlpha;
      ctx.fillText(isMobile ? "TAP TO START 🎮" : "Press SPACE or TAP to start", cx, by + (isMobile ? 19 : 23));
      ctx.globalAlpha = 1.0;

      // CTA Controls Subtext
      ctx.font = isMobile ? "8.5px 'Space Mono', monospace" : "9.5px 'Space Mono', monospace";
      ctx.fillStyle = tc.modalTitle;
      ctx.globalAlpha = 0.75;
      ctx.fillText(isMobile ? "Drag or WASD to move 2D" : "Arrows / WASD or drag to move 2D", cx, by + (isMobile ? 38 : 46));
      ctx.restore();

      // 5. Player Ship Anchor (Bottom Third Preview)
      g.thrusterTimer -= dt_s * 1000;
      if (g.thrusterTimer <= 0) {
        g.thrusterTimer = 35;
        acquireParticle(
          cx + (Math.random() - 0.5) * 6,
          h - 45 + 26,
          (Math.random() - 0.5) * 16,
          100 + Math.random() * 30,
          COL_AMBER_GLOW, 2, 0.22
        );
      }

      drawPlayer({ x: cx - 11, y: h - 50, width: 22, height: 26, invulnTimer: 0, visible: true }, time);
    };

    // ── Sleek Game Paused Screen ───────────────────────────
    const drawPausedScreen = (w: number, h: number, time: number, tc: typeof THEME_DARK) => {
      const cx = w / 2;
      const cy = h / 2;

      ctx.save();
      const cardW = Math.min(w - 40, 260);
      const cardH = 75;
      const bx = cx - cardW / 2;
      const by = cy - cardH / 2;

      ctx.fillStyle = tc.modalBg;
      ctx.shadowColor = tc.modalShadow;
      ctx.shadowBlur = 20;
      ctx.beginPath();
      ctx.roundRect(bx, by, cardW, cardH, 12);
      ctx.fill();

      ctx.strokeStyle = tc.modalBorder;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = "bold 14px 'Space Mono', monospace";
      ctx.fillStyle = tc.modalTitle;
      ctx.fillText("⏸️ GAME PAUSED", cx, by + 26);

      const pulseAlpha = 0.5 + (Math.sin(time * 0.005) * 0.5 + 0.5) * 0.5;
      ctx.font = "10px 'Space Mono', monospace";
      ctx.fillStyle = tc.modalSubtext;
      ctx.globalAlpha = pulseAlpha;
      ctx.fillText("Press P, ESC, or TAP to resume", cx, by + 50);

      ctx.restore();
    };

    // ── Vertical Stacking Banners ────────────────────────────
    const drawBanners = (w: number, h: number) => {
      const total = bannersRef.current.length;
      for (let i = 0; i < total; i++) {
        const b = bannersRef.current[i];
        const progress = 1 - b.timer / b.maxTimer;
        let alpha = 1;
        let scale = 1;
        if (progress < 0.15) { const t = progress / 0.15; alpha = t; scale = 0.7 + t * 0.3; }
        else if (progress > 0.75) { const t = (progress - 0.75) / 0.25; alpha = 1 - t; scale = 1 + t * 0.1; }

        const yOffset = (i - (total - 1) / 2) * 44;

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.translate(w / 2, h / 2 + yOffset);
        ctx.scale(scale, scale);
        ctx.font = "bold 15px 'Space Mono', monospace";
        ctx.fillStyle = COL_AMBER_GLOW;
        ctx.fillText(`${b.emoji} ${b.text}`, 0, -8);
        ctx.font = "10px 'Space Mono', monospace";
        ctx.fillStyle = COL_BARK;
        ctx.globalAlpha = alpha * 0.8;
        ctx.fillText(b.subtext, 0, 12);
        ctx.restore();
      }
    };

    // ── Main Loop (INDUSTRIAL 60 FPS PERFORMANCE) ───────────
    const gameLoop = (timestamp: number) => {
      if (!running) return;
      g.animId = requestAnimationFrame(gameLoop);

      // Industrial Delta-Time Spike Clamping (max 33ms / 30fps lower bound)
      const dt = g.lastTime ? Math.min(timestamp - g.lastTime, 33) : 16;
      g.lastTime = timestamp;
      const dt_s = dt / 1000;

      const { w, h } = g.dims;
      if (w === 0 || h === 0) return;

      const phase = g.phase;

      // Fast Plain-Ref Theme Check (NO DOM QUERIES PER FRAME!)
      const isLightTheme = isLightRef.current;
      const tc = isLightTheme ? THEME_LIGHT : THEME_DARK;

      // Cached Background Gradient Fill (Zero Object Allocations per frame!)
      if (
        !cachedBgGradRef.current ||
        cachedBgThemeRef.current !== isLightTheme ||
        cachedBgDimsRef.current.w !== w ||
        cachedBgDimsRef.current.h !== h
      ) {
        const grad = ctx.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0, tc.bgStart);
        grad.addColorStop(0.5, tc.bgMid);
        grad.addColorStop(1, tc.bgEnd);
        cachedBgGradRef.current = grad;
        cachedBgThemeRef.current = isLightTheme;
        cachedBgDimsRef.current = { w, h };
      }

      ctx.fillStyle = cachedBgGradRef.current;
      ctx.fillRect(0, 0, w, h);

      // Screen Shake
      let shakeX = 0, shakeY = 0;
      if (g.shake.timer > 0) {
        g.shake.timer -= dt;
        const decay = Math.max(0, g.shake.timer) / 200;
        const amp = g.shake.amplitude * decay;
        shakeX = (Math.random() - 0.5) * amp * 2;
        shakeY = (Math.random() - 0.5) * amp * 2;
      }
      ctx.save();
      ctx.translate(shakeX, shakeY);

      // Fast Batched Starfield Rendering
      ctx.fillStyle = tc.starColor;
      const stars = starsRef.current;
      const starMult = tc.starOpacityMult;
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        if (phase !== "paused") {
          s.y += s.speed * dt_s;
          if (s.y > h) { s.y = 0; s.x = Math.random() * w; }
        }
        ctx.globalAlpha = s.opacity * starMult;
        ctx.fillRect(s.x, s.y, s.size, s.size);
      }
      ctx.globalAlpha = 1.0;

      // Idle Phase Check
      if (phase === "idle") {
        drawIdleScreen(w, h, timestamp, dt_s, tc);
        ctx.restore();
        return;
      }

      // Paused Phase Check
      if (phase === "paused") {
        drawPlayer(playerRef.current, timestamp);
        for (let i = 0; i < enemiesRef.current.length; i++) {
          if (enemiesRef.current[i].active) drawEnemy(enemiesRef.current[i], timestamp, tc);
        }
        if (bossRef.current) drawBoss(bossRef.current, timestamp);

        ctx.fillStyle = COL_AMBER_GLOW;
        for (let i = 0; i < playerBulletsRef.current.length; i++) {
          const b = playerBulletsRef.current[i];
          if (b.active) ctx.fillRect(b.x - 1.5, b.y - 5, 3, 10);
        }
        ctx.fillStyle = tc.isLight ? "#B91C1C" : COL_ENEMY_RED;
        for (let i = 0; i < enemyBulletsRef.current.length; i++) {
          const b = enemyBulletsRef.current[i];
          if (b.active) ctx.fillRect(b.x - 1.5, b.y - 4, 3, 8);
        }

        drawHud(w, h, tc);
        drawPausedScreen(w, h, timestamp, tc);
        ctx.restore();
        return;
      }

      // Decrement active game timers only when playing
      if (g.shieldTimer > 0) g.shieldTimer = Math.max(0, g.shieldTimer - dt);

      // Boss Wave Edge Vignette Pulse
      if (g.bossVignetteTimer > 0) {
        g.bossVignetteTimer -= dt;
        const alpha = Math.min(1, g.bossVignetteTimer / 1000) * 0.4;
        const grad = ctx.createRadialGradient(w / 2, h / 2, w / 4, w / 2, h / 2, w / 1.1);
        grad.addColorStop(0, "rgba(0,0,0,0)");
        grad.addColorStop(1, `rgba(119,34,204,${alpha})`);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
      }

      // Smooth score counter
      if (g.displayScore < g.score) {
        g.displayScore = Math.min(g.score, g.displayScore + Math.max(1, (g.score - g.displayScore) * 0.1));
      }

      // Fast Particle Rendering Loop
      const particles = particlesRef.current;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (!p.active) continue;
        p.x += p.vx * dt_s;
        p.y += p.vy * dt_s;
        p.vx *= (1 - 2.0 * dt_s);
        p.vy *= (1 - 2.0 * dt_s);
        p.life -= dt_s;
        if (p.life <= 0) { p.active = false; continue; }
        ctx.globalAlpha = p.life / p.maxLife;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
      }
      ctx.globalAlpha = 1.0;

      // Muzzle Flashes
      const flashes = flashesRef.current;
      for (let i = 0; i < flashes.length; i++) {
        const f = flashes[i];
        if (!f.active) continue;
        f.life -= dt_s;
        if (f.life <= 0) { f.active = false; continue; }
        ctx.globalAlpha = f.life / f.maxLife;
        ctx.fillStyle = COL_AMBER_GLOW;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.size * (f.life / f.maxLife), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1.0;

      // Explosion Rings
      const rings = ringsRef.current;
      for (let i = 0; i < rings.length; i++) {
        const r = rings[i];
        if (!r.active) continue;
        r.life -= dt_s;
        if (r.life <= 0) { r.active = false; continue; }
        const progress = 1 - r.life / r.maxLife;
        const curRadius = r.radius + (r.maxRadius - r.radius) * progress;
        ctx.globalAlpha = r.life / r.maxLife;
        ctx.strokeStyle = r.color;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(r.x, r.y, curRadius, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.globalAlpha = 1.0;

      // Banners
      const banners = bannersRef.current;
      for (let i = banners.length - 1; i >= 0; i--) {
        banners[i].timer -= dt;
        if (banners[i].timer <= 0) banners.splice(i, 1);
      }
      drawBanners(w, h);

      if (phase === "gameover") {
        drawPlayer(playerRef.current, timestamp);
        drawHud(w, h, tc);
        ctx.restore();
        return;
      }

      // Pause between waves
      if (g.pauseTimer > 0) {
        g.pauseTimer -= dt;
        if (g.pauseTimer <= 0) {
          g.wave += 1;
          g.phase = "playing";
          spawnWave(g.wave, w, h);
          syncState();
        }
        drawPlayer(playerRef.current, timestamp);
        drawHud(w, h, tc);
        ctx.restore();
        return;
      }

      if (phase !== "playing") {
        drawHud(w, h, tc);
        ctx.restore();
        return;
      }

      // ── Full 2D Player Movement (Left/Right & Up/Down) ──
      const player = playerRef.current;
      const keys = keysRef.current;

      if (touchActiveRef.current) {
        const targetX = touchXRef.current - player.width / 2;
        const targetY = touchYRef.current - player.height / 2;
        player.x = lerp(player.x, targetX, Math.min(1, 12 * dt_s));
        player.y = lerp(player.y, targetY, Math.min(1, 12 * dt_s));
      } else {
        // Horizontal Movement
        if (keys.has("arrowleft") || keys.has("a")) player.x -= PLAYER_SPEED * dt_s;
        if (keys.has("arrowright") || keys.has("d")) player.x += PLAYER_SPEED * dt_s;

        // Vertical Movement (Up / Down)
        if (keys.has("arrowup") || keys.has("w")) player.y -= PLAYER_SPEED * dt_s;
        if (keys.has("arrowdown") || keys.has("s")) player.y += PLAYER_SPEED * dt_s;
      }

      // Clamp Player Position Boundaries (2D)
      player.x = clamp(player.x, 2, w - player.width - 2);
      player.y = clamp(player.y, h * 0.35, h - player.height - 4);

      if (player.invulnTimer > 0) {
        player.invulnTimer -= dt;
        player.visible = Math.floor(player.invulnTimer / 80) % 2 === 0;
      } else {
        player.visible = true;
      }

      // Thruster Trail Particles
      g.thrusterTimer -= dt;
      if (g.thrusterTimer <= 0) {
        g.thrusterTimer = 35;
        acquireParticle(
          player.x + player.width / 2 + (Math.random() - 0.5) * 6,
          player.y + player.height,
          (Math.random() - 0.5) * 20,
          120 + Math.random() * 40,
          COL_AMBER_GLOW, 2, 0.18
        );
      }

      drawPlayer(player, timestamp);

      // ── Auto-fire ──────────────────────────────────
      g.fireTimer -= dt;
      if (g.fireTimer <= 0) {
        g.fireTimer = FIRE_COOLDOWN;
        fireWeapon();
      }

      // ── Fiery Player Bullets (Batched Rendering) ────
      const pBullets = playerBulletsRef.current;
      for (let i = 0; i < pBullets.length; i++) {
        const b = pBullets[i];
        if (!b.active) continue;
        b.x += b.vx * dt_s;
        b.y += b.vy * dt_s;
        if (b.y < -10 || b.y > h + 10) { b.active = false; continue; }

        ctx.fillStyle = COL_AMBER_GLOW;
        ctx.fillRect(b.x - 1.5, b.y - 5, 3, 10);
        ctx.fillStyle = "#fff8d6";
        ctx.fillRect(b.x - 0.7, b.y - 4, 1.4, 8);
      }

      // ── Power-ups ──────────────────────────────────
      const powerUps = powerUpsRef.current;
      for (let i = 0; i < powerUps.length; i++) {
        const pu = powerUps[i];
        if (!pu.active) continue;
        pu.y += pu.vy * dt_s;
        if (pu.y > h + 15) { pu.active = false; continue; }

        drawPowerUp(pu, timestamp);

        if (aabb(player.x, player.y, player.width, player.height, pu.x - 6, pu.y - 7, 12, 14)) {
          pu.active = false;
          if (pu.type === "weapon") {
            if (g.weaponTier < 5) {
              g.weaponTier += 1;
              showBanner(`MK.${["I", "II", "III", "IV", "V"][g.weaponTier - 1]}`, "⚡", "Weapon upgraded!");
            } else {
              g.score += MAX_TIER_BONUS;
              showBanner("MAX POWER", "⚡", `+${MAX_TIER_BONUS} bonus`, 1000);
            }
            spawnExplosion(pu.x, pu.y, COL_WEAPON_PU, 8);
          } else {
            g.shieldTimer = SHIELD_DURATION;
            showBanner("SHIELD ACTIVE", "🛡️", "Invincible for 5s!", 1200);
            spawnExplosion(pu.x, pu.y, COL_SHIELD_PU, 10);
          }
          syncState();
        }
      }

      // ── Enemies (Fast Vector Loop) ─────────────────
      const enemies = enemiesRef.current;
      let needsSync = false;

      for (let i = enemies.length - 1; i >= 0; i--) {
        const e = enemies[i];
        if (!e.active) continue;

        if (e.movePattern === "zigzag") {
          e.x = e.startX + Math.sin(timestamp * 0.003 + e.phase) * 35;
          e.y += e.vy * dt_s;
        } else if (e.movePattern === "dive") {
          e.diveTimer -= dt_s;
          if (e.diveTimer <= 0 || e.y > 50) e.diveState = "diving";

          if (e.diveState === "diving") {
            const targetDir = Math.sign((player.x + player.width / 2) - (e.x + e.width / 2));
            e.x += targetDir * 45 * dt_s;
            e.y += 110 * dt_s;
          } else {
            e.y += 15 * dt_s;
          }
        } else {
          e.x += (e.vx + Math.sin(timestamp * 0.001 + e.phase) * 18) * dt_s;
          e.y += e.vy * dt_s;
        }

        if (e.x < 2 || e.x + e.width > w - 2) {
          e.vx = -e.vx;
          e.x = clamp(e.x, 2, w - e.width - 2);
        }

        if (e.type === "glitch") {
          e.fireTimer -= dt;
          if (e.fireTimer <= 0 && e.y > 0) {
            e.fireTimer = rand(1500, 4000);
            acquireBullet(enemyBulletsRef.current, e.x + e.width / 2, e.y + e.height, 0, ENEMY_BULLET_SPEED);
          }
        }

        if (e.y > h + 20) { e.active = false; continue; }

        drawEnemy(e, timestamp, tc);

        const handleEnemyKilled = (enemy: Enemy) => {
          enemy.active = false;
          g.score += 10 * enemy.maxHp;
          spawnExplosion(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, getEnemyColor(enemy.type, tc.isLight), 8);
          needsSync = true;

          g.killStreak += 1;
          if (g.killStreak >= g.nextStreakMilestone) {
            const bonus = g.killStreak * 15;
            g.score += bonus;
            showBanner(`${g.killStreak}x STREAK!`, "🔥", `+${bonus} bonus pts!`, 1200);
            g.nextStreakMilestone += 5;
          }

          g.destroyCount += 1;
          if (g.destroyCount % POWERUP_DROP_CHANCE === 0) {
            const puType: PowerUpType = Math.random() < 0.6 ? "weapon" : "shield";
            acquirePowerUp(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, puType);
          }
        };

        if (g.shieldTimer > 0 && aabb(player.x - 4, player.y - 4, player.width + 8, player.height + 8, e.x, e.y, e.width, e.height)) {
          handleEnemyKilled(e);
          continue;
        }

        for (let j = 0; j < pBullets.length; j++) {
          const b = pBullets[j];
          if (!b.active) continue;
          if (aabb(b.x - 2, b.y - 4, 4, 8, e.x, e.y, e.width, e.height)) {
            e.hp -= 1;
            b.active = false;
            acquireFlash(b.x, b.y, 4);

            if (e.hp <= 0) {
              handleEnemyKilled(e);
            }
            break;
          }
        }
      }

      for (let i = enemies.length - 1; i >= 0; i--) {
        if (!enemies[i].active) enemies.splice(i, 1);
      }

      // ── Boss (LEVEL-BASED PROGRESSION & RAGE AI) ────────
      const boss = bossRef.current;
      if (boss) {
        if (!boss.entered) {
          boss.y += 80 * dt_s;
          if (boss.y >= 30) { boss.entered = true; boss.y = 30; }
        } else {
          const waveLevel = Math.floor(g.wave / 5);
          const hpRatio = boss.hp / boss.maxHp;
          const isRage = hpRatio < 0.5;

          // Boss moves dynamically, speeding up in Rage mode!
          const moveSpeed = (boss.vx > 0 ? 1 : -1) * (100 + waveLevel * 15 + (isRage ? 40 : 0));
          boss.x += moveSpeed * dt_s;
          if (boss.x < 10 || boss.x + boss.width > w - 10) boss.vx = -boss.vx;

          boss.fireTimer -= dt;
          if (boss.fireTimer <= 0) {
            // Cooldown accelerates with wave level & rage state
            const baseCooldown = Math.max(380, 800 - waveLevel * 60 - (isRage ? 160 : 0));
            boss.fireTimer = baseCooldown;

            boss.firePattern = (boss.firePattern + 1) % (waveLevel >= 2 ? 4 : 3);
            const bx = boss.x + boss.width / 2;
            const by = boss.y + boss.height;
            const bulletSpeed = ENEMY_BULLET_SPEED + 30 + waveLevel * 12;

            if (boss.firePattern === 0) {
              // Pattern 0: Direct Targeted Heavy Plasma Stream at player X
              const dx = (player.x + player.width / 2) - bx;
              const dy = (player.y + player.height / 2) - by;
              const dist = Math.hypot(dx, dy) || 1;
              acquireBullet(enemyBulletsRef.current, bx, by, (dx / dist) * (bulletSpeed + 40), (dy / dist) * (bulletSpeed + 40));
            } else if (boss.firePattern === 1) {
              // Pattern 1: 3-Way Radial Volley
              acquireBullet(enemyBulletsRef.current, bx - 15, by, -35, bulletSpeed);
              acquireBullet(enemyBulletsRef.current, bx, by, 0, bulletSpeed + 25);
              acquireBullet(enemyBulletsRef.current, bx + 15, by, 35, bulletSpeed);
            } else if (boss.firePattern === 2) {
              // Pattern 2: 5-Way Fan Spray
              const angles = [-0.35, -0.18, 0, 0.18, 0.35];
              for (let k = 0; k < angles.length; k++) {
                const a = angles[k];
                acquireBullet(enemyBulletsRef.current, bx, by, Math.sin(a) * bulletSpeed, Math.cos(a) * bulletSpeed);
              }
            } else {
              // Pattern 3: Dual Outer Cannon Burst
              acquireBullet(enemyBulletsRef.current, bx - 22, by, -25, bulletSpeed + 20);
              acquireBullet(enemyBulletsRef.current, bx + 22, by, 25, bulletSpeed + 20);
            }
          }
        }

        drawBoss(boss, timestamp);

        if (g.shieldTimer > 0 && aabb(player.x - 4, player.y - 4, player.width + 8, player.height + 8, boss.x, boss.y, boss.width, boss.height)) {
          boss.hp -= 0.1;
        }

        for (let j = 0; j < pBullets.length; j++) {
          const b = pBullets[j];
          if (!b.active) continue;
          if (aabb(b.x - 2, b.y - 4, 4, 8, boss.x, boss.y, boss.width, boss.height)) {
            boss.hp -= 1;
            b.active = false;
            acquireFlash(b.x, b.y, 5);

            if (boss.hp <= 0) {
              const bossBonus = 500 * Math.floor(g.wave / 5);
              g.score += bossBonus;
              spawnExplosion(boss.x + boss.width / 2, boss.y + boss.height / 2, COL_BOSS_PURPLE, 20);
              g.shake = { timer: 200, amplitude: 6 };
              showBanner("BOSS DEFEATED", "🏆", `+${bossBonus} points`);
              bossRef.current = null;
              g.pauseTimer = BOSS_CLEAR_PAUSE;
              g.phase = "boss-defeat";
              g.score += 100 * g.wave;
              needsSync = true;

              acquirePowerUp(boss.x + boss.width / 2, boss.y + boss.height / 2, "weapon");
            }
            break;
          }
        }
      }

      // ── Enemy Bullets ──────────────────────────────
      ctx.fillStyle = COL_ENEMY_RED;
      const eBullets = enemyBulletsRef.current;
      for (let i = 0; i < eBullets.length; i++) {
        const b = eBullets[i];
        if (!b.active) continue;
        b.x += b.vx * dt_s;
        b.y += b.vy * dt_s;
        if (b.y < -10 || b.y > h + 10) { b.active = false; continue; }
        ctx.fillRect(b.x - 1.5, b.y - 4, 3, 8);

        if (g.shieldTimer > 0 && aabb(b.x - 2, b.y - 4, 4, 8, player.x - 4, player.y - 4, player.width + 8, player.height + 8)) {
          b.active = false;
          acquireFlash(b.x, b.y, 6);
          continue;
        }

        if (player.invulnTimer <= 0 && aabb(b.x - 2, b.y - 4, 4, 8, player.x, player.y, player.width, player.height)) {
          b.active = false;
          playerHit();
          break;
        }
      }

      // ── Body Collision (Enemy/Boss vs Player) ──────
      if (player.invulnTimer <= 0 && g.shieldTimer <= 0) {
        for (let i = 0; i < enemies.length; i++) {
          const e = enemies[i];
          if (!e.active) continue;
          if (aabb(player.x, player.y, player.width, player.height, e.x, e.y, e.width, e.height)) {
            playerHit();
            break;
          }
        }
        if (boss && aabb(player.x, player.y, player.width, player.height, boss.x, boss.y, boss.width, boss.height)) {
          playerHit();
        }
      }

      // ── Wave Clear Check ───────────────────────────
      const activeEnemies = enemies.some(e => e.active);
      if (!activeEnemies && !boss && phase === "playing") {
        const waveBonus = 100 * g.wave;
        g.score += waveBonus;
        showBanner(`Wave ${g.wave} Cleared`, "✅", `Checkpoint! +${waveBonus} pts`);
        g.pauseTimer = WAVE_CLEAR_PAUSE;
        g.phase = "wave-clear";
        needsSync = true;
      }

      if (needsSync) syncState();

      // ── HUD ────────────────────────────────────────
      drawHud(w, h, tc);

      ctx.restore();
    };

    g.animId = requestAnimationFrame(gameLoop);

    return () => {
      running = false;
      cancelAnimationFrame(g.animId);
      resizeObserver.disconnect();
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("touchstart", onTouchStart);
      canvas.removeEventListener("touchmove", onTouchMove);
      canvas.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("resize", resize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Render Component ───────────────────────────────────
  return (
    <div
      ref={wrapperRef}
      onClick={handleStartInteraction}
      onPointerDown={handleStartInteraction}
      className="relative w-full h-full flex flex-col select-none cursor-pointer overscroll-none touch-none"
      style={{ touchAction: "none", overscrollBehavior: "contain" }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ touchAction: "none" }}
      />

      {/* Interactive HTML Pause Button in Top-Right Corner */}
      {(gamePhase === "playing" || gamePhase === "paused") && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            togglePause(e);
          }}
          onPointerDown={(e) => {
            e.stopPropagation();
          }}
          onTouchStart={(e) => {
            e.stopPropagation();
          }}
          className={`absolute top-2 right-2 z-30 font-mono text-[0.6rem] font-bold tracking-wider px-3 py-1 rounded-full border transition-all cursor-pointer flex items-center gap-1 select-none shadow-md ${gamePhase === "paused"
              ? isLight
                ? "bg-amber-600 border-amber-500 text-white shadow-amber-500/20"
                : "bg-amber/45 border-amber-glow text-amber-glow shadow-amber/20"
              : isLight
                ? "bg-white/95 border-slate-900/20 text-slate-900 hover:bg-white shadow-slate-900/10 backdrop-blur-md"
                : "bg-white/12 border-white/28 text-bark hover:bg-white/20 backdrop-blur-md"
            }`}
        >
          {gamePhase === "paused" ? "▶ RESUME" : "⏸ PAUSE"}
        </button>
      )}

      {/* Game Over Overlay */}
      {gamePhase === "gameover" && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-surface/95 dark:bg-night/85 backdrop-blur-md transition-colors duration-300"
        >
          <p className="font-mono text-[0.6rem] tracking-[0.2em] uppercase mb-3 text-red-500 dark:text-red-400 font-bold">
            GAME OVER
          </p>
          <p className="font-mono text-2xl font-bold mb-1 text-amber">
            {score.toLocaleString()}
            {newBestScore && (
              <span className="ml-2 text-xs font-normal text-amber-glow">🏆 New Best!</span>
            )}
          </p>
          <p className="font-mono text-[0.65rem] mb-1 text-bark-muted">
            High Score: {highScore.toLocaleString()}
          </p>
          <p className="font-mono text-xs mb-1 text-bark">
            Reached Wave {wave}
            {newBestWave && (
              <span className="ml-2 text-amber-glow">🏆 New Best!</span>
            )}
          </p>
          <p className="font-mono text-[0.6rem] mb-1 text-bark-dim">
            Best Wave: {bestWave}
          </p>
          {weaponTier > 1 && (
            <p className="font-mono text-[0.6rem] mb-3 text-cyan-500 dark:text-cyan-400">
              Final Weapon: MK.{["I", "II", "III", "IV", "V"][weaponTier - 1]}
            </p>
          )}
          <button
            onClick={startGame}
            className="font-mono text-[0.65rem] tracking-[0.15em] uppercase px-5 py-2 rounded-full border transition-all duration-300 cursor-pointer text-amber border-amber/40 bg-amber/10 hover:bg-amber/25 hover:border-amber/60"
          >
            Try Again
          </button>
          <p className="font-mono text-[0.5rem] mt-2 text-bark-dim">
            or press SPACE / TAP
          </p>
        </div>
      )}
    </div>
  );
};

export default ByteDefender;
