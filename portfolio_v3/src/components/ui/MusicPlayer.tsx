// src/components/ui/MusicPlayer.tsx
import React, { useState, useRef, useEffect } from "react";
import { useMusicPlayer, TRACKS } from "../../hooks/useMusicPlayer";

// ── SVG Icons (inline — no icon library needed) ──────────────────
const IconPlay    = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>;
const IconPause   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>;
const IconPrev    = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="19 20 9 12 19 4 19 20"/><line x1="5" y1="19" x2="5" y2="5"/></svg>;
const IconNext    = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 4 15 12 5 20 5 4"/><line x1="19" y1="5" x2="19" y2="19"/></svg>;
const IconShuffle = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="4" y1="4" x2="9" y2="9"/></svg>;
const IconRepeat  = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>;
const IconVol     = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>;
const IconMute    = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>;
const IconList    = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>;

// ── Equalizer animation bars ──────────────────────────────────────
const EqBars: React.FC<{ playing: boolean }> = ({ playing }) => (
  <div className="flex items-end gap-[2px] h-[14px]">
    {[0,1,2,3].map(i => (
      <span
        key={i}
        className="w-[2px] rounded-sm bg-[var(--accent)]"
        style={{
          height: playing ? undefined : "3px",
          animation: playing
            ? `eq${i} ${[0.8,0.6,1.0,0.7][i]}s ease infinite alternate`
            : "none",
        }}
      />
    ))}
  </div>
);

// ── Main component ────────────────────────────────────────────────
const MusicPlayer: React.FC = () => {
  const [open, setOpen]     = useState(false);
  const [plOpen, setPlOpen] = useState(false);
  const wrapRef             = useRef<HTMLDivElement>(null);

  const mp = useMusicPlayer();

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const shortName = mp.track.name.split("—")[0].trim().split(" ").slice(0, 3).join(" ");

  return (
    <>
      {/* ── Keyframes for EQ bars ── */}
      <style>{`
        @keyframes eq0{from{height:3px}to{height:13px}}
        @keyframes eq1{from{height:8px}to{height:4px}}
        @keyframes eq2{from{height:5px}to{height:11px}}
        @keyframes eq3{from{height:3px}to{height:9px}}
      `}</style>

      <div ref={wrapRef} className="relative">

        {/* ── COLLAPSED PILL ── */}
        <div
          onClick={() => setOpen(o => !o)}
          className="flex items-center gap-2 px-2.5 py-1.5 cursor-none
            border border-transparent hover:border-[var(--border)] hover:bg-[var(--accent)]/5
            transition-all duration-300 group rounded-sm select-none"
        >
          {/* Small Play/Pause Button in collapsed pill */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              mp.togglePlay();
            }}
            aria-label={mp.playing ? "Pause" : "Play"}
            className="p-1 cursor-none text-[var(--text-muted)]/60 hover:text-[var(--accent)] transition-colors relative group/pill-btn"
          >
            {mp.playing ? (
              <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
            ) : (
              <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            )}

            {/* Custom Tooltip */}
            <span className="hidden md:block absolute bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2 px-1.5 py-0.5 bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] text-[7px] font-mono tracking-wider uppercase opacity-0 pointer-events-none group-hover/pill-btn:opacity-100 transition-opacity whitespace-nowrap z-[100] shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
              {mp.playing ? "Pause" : "Play"}
            </span>
          </button>

          <EqBars playing={mp.playing} />

          <span className="font-mono text-[0.58rem] tracking-[0.1em] uppercase
            text-[var(--text-muted)] group-hover:text-[var(--text-primary)]
            transition-colors duration-200 max-w-[100px] truncate hidden sm:block">
            {shortName}
          </span>

          <span
            className="text-[var(--accent)]/50 text-[10px] transition-transform duration-300"
            style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
          >
            ▾
          </span>
        </div>

        {/* ── EXPANDED PANEL ── */}
        <div
          className="absolute top-[calc(100%+12px)] right-[-48px] sm:right-0 w-[270px] sm:w-[280px] z-50
            bg-[var(--bg-secondary)] border border-[var(--border)]
            transition-all duration-300 origin-top-right"
          style={{
            opacity:    open ? 1 : 0,
            transform:  open ? "translateY(0) scale(1)" : "translateY(-8px) scale(0.97)",
            pointerEvents: open ? "all" : "none",
          }}
        >
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br
            from-[var(--accent)]/[0.04] to-transparent pointer-events-none" />

          {/* Track info */}
          <div className="flex items-center gap-3 px-4 py-3.5
            border-b border-[var(--border)]">
            {/* Vinyl disc */}
            <div
              className="w-10 h-10 rounded-full flex-shrink-0
                border border-[var(--accent)]/30"
              style={{
                background:`radial-gradient(circle at 50% 50%,
                  #1a1a2e 0%,#1a1a2e 20%,
                  var(--accent) 20%,var(--accent) 25%,
                  var(--bg-secondary) 25%,var(--bg-secondary) 42%,
                  #1a1516 42%,#1a1516 58%,
                  var(--bg-secondary) 58%)`,
                animation: mp.playing ? "spin 3s linear infinite" : "none",
              }}
            />
            <div className="flex-1 min-w-0">
              <p className="font-mono text-[0.68rem] font-bold tracking-[0.08em]
                uppercase text-[var(--text-primary)] truncate">
                {mp.track.name}
              </p>
              <p className="font-mono text-[0.58rem] tracking-[0.08em]
                uppercase text-[var(--accent)]/60 mt-0.5">
                {mp.track.artist}
              </p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="flex items-center gap-2 px-4 pt-3 select-none">
            <span className="font-mono text-[0.58rem] text-[var(--text-muted)]/50 w-6">
              {mp.currentTime}
            </span>
            <div
              className="flex-1 py-2 cursor-pointer group"
              onClick={e => {
                const r = e.currentTarget.getBoundingClientRect();
                mp.seekTo(((e.clientX - r.left) / r.width) * 100);
              }}
            >
              {/* Visual track wrapper */}
              <div className="h-[3px] w-full bg-[var(--accent)]/20 hover:bg-[var(--accent)]/35 rounded-full relative overflow-visible transition-colors duration-200">
                {/* Progress fill */}
                <div
                  className="h-full bg-[var(--accent)] rounded-full relative"
                  style={{ width: `${mp.progress}%` }}
                >
                  {/* Hover handle dot */}
                  <span className="absolute -right-1 -top-[3.5px] w-2.5 h-2.5
                    rounded-full bg-[var(--accent)] shadow-[0_0_8px_var(--accent)]
                    opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
                </div>
              </div>
            </div>
            <span className="font-mono text-[0.58rem] text-[var(--text-muted)]/50 w-6 text-right">
              {mp.track.dur}
            </span>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-1 px-4 py-2.5">
            {/* Shuffle */}
            <button
              onClick={mp.toggleShuf}
              aria-label={mp.shuffled ? "Disable Shuffle" : "Enable Shuffle"}
              className={`p-2 cursor-none transition-colors duration-200 relative group
                ${mp.shuffled
                  ? "text-[var(--accent)]"
                  : "text-[var(--text-muted)]/40 hover:text-[var(--text-primary)]"
                }`}
            >
              <IconShuffle />
              <span className="hidden md:block absolute bottom-[calc(100%+6px)] left-1/2 -translate-x-1/2 px-1.5 py-0.5 bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] text-[7px] font-mono tracking-wider uppercase opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-[100] shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
                {mp.shuffled ? "Disable Shuffle" : "Enable Shuffle"}
              </span>
            </button>

            {/* Prev */}
            <button
              onClick={mp.goPrev}
              aria-label="Previous Track"
              className="p-2 cursor-none text-[var(--text-muted)]/40 hover:text-[var(--text-primary)] transition-colors duration-200 relative group"
            >
              <IconPrev />
              <span className="hidden md:block absolute bottom-[calc(100%+6px)] left-1/2 -translate-x-1/2 px-1.5 py-0.5 bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] text-[7px] font-mono tracking-wider uppercase opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-[100] shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
                Previous Track
              </span>
            </button>

            {/* Play/Pause */}
            <button
              onClick={mp.togglePlay}
              aria-label={mp.playing ? "Pause" : "Play"}
              className="w-9 h-9 rounded-full border border-[var(--accent)]/40
                text-[var(--accent)] flex items-center justify-center
                cursor-none mx-1
                hover:bg-[var(--accent)]/10 hover:border-[var(--accent)]
                transition-all duration-200 active:scale-90 relative group"
            >
              {mp.playing ? <IconPause /> : <IconPlay />}
              <span className="hidden md:block absolute bottom-[calc(100%+6px)] left-1/2 -translate-x-1/2 px-1.5 py-0.5 bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] text-[7px] font-mono tracking-wider uppercase opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-[100] shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
                {mp.playing ? "Pause" : "Play"}
              </span>
            </button>

            {/* Next */}
            <button
              onClick={mp.goNext}
              aria-label="Next Track"
              className="p-2 cursor-none text-[var(--text-muted)]/40 hover:text-[var(--text-primary)] transition-colors duration-200 relative group"
            >
              <IconNext />
              <span className="hidden md:block absolute bottom-[calc(100%+6px)] left-1/2 -translate-x-1/2 px-1.5 py-0.5 bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] text-[7px] font-mono tracking-wider uppercase opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-[100] shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
                Next Track
              </span>
            </button>

            {/* Repeat */}
            <button
              onClick={mp.toggleRep}
              aria-label={mp.repeat ? "Disable Repeat" : "Enable Repeat"}
              className={`p-2 cursor-none transition-colors duration-200 relative group
                ${mp.repeat
                  ? "text-[var(--accent)]"
                  : "text-[var(--text-muted)]/40 hover:text-[var(--text-primary)]"
                }`}
            >
              <IconRepeat />
              <span className="hidden md:block absolute bottom-[calc(100%+6px)] left-1/2 -translate-x-1/2 px-1.5 py-0.5 bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] text-[7px] font-mono tracking-wider uppercase opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-[100] shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
                {mp.repeat ? "Disable Repeat" : "Enable Repeat"}
              </span>
            </button>
          </div>

          {/* Volume + Playlist toggle */}
          <div className="flex items-center justify-between px-4 pb-3">
            <div className="flex items-center gap-2">
              <button
                onClick={mp.toggleMute}
                aria-label={mp.muted ? "Unmute" : "Mute"}
                className="cursor-none text-[var(--text-muted)]/30 hover:text-[var(--text-muted)] transition-colors duration-200 relative group"
              >
                {mp.muted ? <IconMute /> : <IconVol />}
                <span className="hidden md:block absolute bottom-[calc(100%+6px)] left-1/2 -translate-x-1/2 px-1.5 py-0.5 bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] text-[7px] font-mono tracking-wider uppercase opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-[100] shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
                  {mp.muted ? "Unmute" : "Mute"}
                </span>
              </button>
              <input
                type="range" min="0" max="100"
                value={mp.muted ? 0 : mp.volume * 100}
                onChange={e => mp.setVolume(Number(e.target.value) / 100)}
                title="Adjust Volume"
                aria-label="Adjust Volume"
                className="w-14 h-[1.5px] accent-[var(--accent)] cursor-pointer"
              />
            </div>

            <button
              onClick={() => setPlOpen(p => !p)}
              aria-label="Toggle Playlist"
              className="flex items-center gap-1.5 cursor-none
                font-mono text-[0.58rem] tracking-[0.12em] uppercase
                text-[var(--text-muted)]/25 hover:text-[var(--accent)]/70
                transition-colors duration-200 relative group"
            >
              <IconList />
              Playlist
              <span className="hidden md:block absolute bottom-[calc(100%+6px)] left-1/2 -translate-x-1/2 px-1.5 py-0.5 bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] text-[7px] font-mono tracking-wider uppercase opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-[100] shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
                Toggle Playlist
              </span>
            </button>
          </div>

          {/* Playlist dropdown */}
          <div
            className="border-t border-[var(--border)] overflow-hidden
              transition-[max-height] duration-300 ease-in-out"
            style={{ maxHeight: plOpen ? "180px" : "0px" }}
          >
            <div className="overflow-y-auto max-h-[178px]
              [&::-webkit-scrollbar]:w-[2px]
              [&::-webkit-scrollbar-thumb]:bg-[var(--accent)]/25
              [&::-webkit-scrollbar-thumb]:rounded-full">
              {TRACKS.map((t, i) => (
                <button
                  key={t.id}
                  onClick={() => mp.selectTrack(i)}
                  className={`w-full flex items-center gap-2.5 px-4 py-2.5 sm:py-[6px]
                    cursor-none text-left transition-colors duration-150
                    hover:bg-[var(--accent)]/5
                    ${i === mp.curIdx ? "bg-[var(--accent)]/[0.04]" : ""}`}
                >
                  <span className={`font-mono text-[0.6rem] w-4 text-center
                    ${i === mp.curIdx
                      ? "text-[var(--accent)]/60"
                      : "text-[var(--text-muted)]/20"}`}>
                    {i === mp.curIdx ? "▶" : String(i+1).padStart(2,"0")}
                  </span>
                  <span className={`font-mono text-[0.6rem] tracking-[0.07em]
                    uppercase flex-1 truncate
                    ${i === mp.curIdx
                      ? "text-[var(--accent)]"
                      : "text-[var(--text-muted)]/45"}`}>
                    {t.name}
                  </span>
                  <span className="font-mono text-[0.58rem] text-[var(--text-muted)]/20">
                    {t.dur}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Vinyl spin keyframe */}
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </>
  );
};

export default MusicPlayer;
