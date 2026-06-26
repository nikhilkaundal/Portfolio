import { useState, useEffect, useRef, useCallback } from "react";

export interface Track {
  id:     number;
  name:   string;
  artist: string;
  file:   string;   // e.g. "/music/track01.mp3"
  dur:    string;   // e.g. "3:24"
}

export const TRACKS: Track[] = [
  { id: 1, name: "Lofi Chill", artist: "Mondamusic", file: "/music/mondamusic-lofi-lofi-chill-lofi-girl-491690.mp3", dur: "1:57" },
  { id: 2, name: "Lofi Garden", artist: "Mondamusic", file: "/music/mondamusic-lofi-lofi-music-lofi-chill-529558.mp3", dur: "2:27" },
  { id: 3, name: "Juntinhos", artist: "Pedrosa Ro", file: "/music/pedrosa_ro-juntinhos-452415.mp3", dur: "4:21" },
  { id: 4, name: "Trajetória", artist: "Pedrosa Ro", file: "/music/pedrosa_ro-trajetoria-452411.mp3", dur: "2:41" },
  { id: 5, name: "Lofi Beats", artist: "Prettyjohn1", file: "/music/prettyjohn1-lofi-beats-524251.mp3", dur: "2:24" },
  { id: 6, name: "Night Lights", artist: "Prettyjohn1", file: "/music/prettyjohn1-lofi-lofi-music-525021.mp3", dur: "1:23" },
];

export function useMusicPlayer() {
  const audioRef               = useRef<HTMLAudioElement | null>(null);
  const [curIdx, setCurIdx]    = useState(0);
  const [playing, setPlaying]  = useState(false);
  const [progress, setProgress]= useState(0);   // 0–100
  const [duration, setDuration]= useState(0);
  const [volume, setVolume]    = useState(0.7);
  const [muted, setMuted]      = useState(false);
  const [shuffled, setShuffled]= useState(false);
  const [repeat, setRepeat]    = useState(false);

  // Init audio
  useEffect(() => {
    const audio = new Audio(TRACKS[curIdx].file);
    audio.volume = muted ? 0 : volume;
    audioRef.current = audio;

    const onTimeUpdate = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    const onLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const onEnded = () => {
      if (repeat) {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      } else {
        goNext();
      }
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.pause();
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("ended", onEnded);
      audio.src = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [curIdx]);

  // Sync play state (run when playing state OR track changes)
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.play().catch(() => setPlaying(false));
    } else {
      audio.pause();
    }
  }, [playing, curIdx]);

  // Sync volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = muted ? 0 : volume;
    }
  }, [volume, muted]);

  const togglePlay  = useCallback(() => setPlaying(p => !p), []);
  const toggleMute  = useCallback(() => setMuted(m => !m), []);
  const toggleShuf  = useCallback(() => setShuffled(s => !s), []);
  const toggleRep   = useCallback(() => setRepeat(r => !r), []);

  const goNext = useCallback(() => {
    let next = curIdx;
    if (shuffled && TRACKS.length > 1) {
      while (next === curIdx) {
        next = Math.floor(Math.random() * TRACKS.length);
      }
    } else {
      next = (curIdx + 1) % TRACKS.length;
    }
    setCurIdx(next);
    setProgress(0);
  }, [curIdx, shuffled]);

  const goPrev = useCallback(() => {
    const audio = audioRef.current;
    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0;
      setProgress(0);
      return;
    }
    setCurIdx(i => (i - 1 + TRACKS.length) % TRACKS.length);
    setProgress(0);
  }, []);

  const seekTo = useCallback((pct: number) => {
    const audio = audioRef.current;
    if (audio && audio.duration) {
      audio.currentTime = (pct / 100) * audio.duration;
      setProgress(pct);
    }
  }, []);

  const selectTrack = useCallback((idx: number) => {
    setCurIdx(idx);
    setProgress(0);
    setPlaying(true);
  }, []);

  const fmtTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const currentTime = audioRef.current
    ? fmtTime(audioRef.current.currentTime)
    : "0:00";

  return {
    track: TRACKS[curIdx], curIdx, playing, progress,
    duration, volume, muted, shuffled, repeat,
    currentTime,
    togglePlay, toggleMute, toggleShuf, toggleRep,
    goNext, goPrev, seekTo, selectTrack,
    setVolume,
  };
}
