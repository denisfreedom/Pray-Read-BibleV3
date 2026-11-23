import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

const PlayerContext = createContext(null);

const DEFAULT_STATE = {
  queue: [],
  index: -1,
  playing: false,
  currentTime: 0,
  duration: 0,
  volume: 0.9,
  speed: 1,
  shuffle: false,
  repeat: "off",
  expanded: false,
  error: "",
  ready: false
};

/**
 * One global audio element lives here, at the root of the app, so playback
 * continues while the reader moves between pages.
 */
export function PlayerProvider({ children }) {
  const [state, setState] = useState(DEFAULT_STATE);
  const audioRef = useRef(null);
  const queueRef = useRef([]);

  useEffect(() => {
    const audio = new Audio();
    audio.preload = "metadata";
    audioRef.current = audio;

    const onTime = () =>
      setState((prev) => ({ ...prev, currentTime: audio.currentTime, duration: audio.duration || 0 }));
    const onMeta = () => setState((prev) => ({ ...prev, duration: audio.duration || 0, ready: true }));
    const onEnded = () => {
      setState((prev) => {
        if (prev.repeat === "one") {
          audio.currentTime = 0;
          audio.play().catch(() => {});
          return prev;
        }
        const nextIndex = prev.repeat === "all" ? (prev.index + 1) % Math.max(prev.queue.length, 1) : prev.index + 1;
        if (nextIndex >= prev.queue.length) {
          return { ...prev, playing: false, currentTime: 0 };
        }
        return { ...prev, index: nextIndex };
      });
    };
    const onError = () =>
      setState((prev) => ({
        ...prev,
        playing: false,
        error: "Audio could not load  -  try again"
      }));

    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onMeta);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("error", onError);

    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onMeta);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("error", onError);
      audio.pause();
    };
  }, []);

  const loadTrack = useCallback((index, autoplay = true) => {
    const audio = audioRef.current;
    const queue = queueRef.current;
    if (!audio || !queue.length || index < 0 || index >= queue.length) return;
    const track = queue[index];
    audio.src = track.audioUrl;
    audio.playbackRate = state.speed;
    audio.volume = state.volume;
    audio.load();
    setState((prev) => ({ ...prev, index, currentTime: 0, duration: 0, error: "", ready: false }));
    if (autoplay) {
      audio.play().catch(() => {
        setState((prev) => ({ ...prev, error: "Audio could not load  -  try again" }));
      });
    }
  }, [state.speed, state.volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (state.index >= 0 && state.index < queueRef.current.length) {
      const track = queueRef.current[state.index];
      if (track && audio.src && track.audioUrl && !audio.src.endsWith(track.audioUrl)) {
        loadTrack(state.index, state.playing);
      }
    }
  }, [state.index, loadTrack, state.playing]);

  const playQueue = useCallback(
    (tracks, startIndex = 0) => {
      if (!tracks || !tracks.length) return;
      queueRef.current = tracks;
      setState((prev) => ({ ...prev, queue: tracks, index: startIndex, error: "" }));
      loadTrack(startIndex, true);
    },
    [loadTrack]
  );

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || state.index < 0) return;
    if (audio.paused) {
      audio.play().catch(() => setState((prev) => ({ ...prev, error: "Audio could not load  -  try again" })));
      setState((prev) => ({ ...prev, playing: true }));
    } else {
      audio.pause();
      setState((prev) => ({ ...prev, playing: false }));
    }
  }, [state.index]);

  const seek = useCallback((seconds) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.max(0, Number(seconds) || 0);
  }, []);

  const skip = useCallback((delta) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.max(0, (audio.currentTime || 0) + delta);
  }, []);

  const setVolume = useCallback((value) => {
    const audio = audioRef.current;
    const next = Math.min(1, Math.max(0, Number(value) || 0));
    if (audio) audio.volume = next;
    setState((prev) => ({ ...prev, volume: next }));
  }, []);

  const setSpeed = useCallback((value) => {
    const audio = audioRef.current;
    const next = Math.min(2, Math.max(0.5, Number(value) || 1));
    if (audio) audio.playbackRate = next;
    setState((prev) => ({ ...prev, speed: next }));
  }, []);

  const next = useCallback(() => {
    setState((prev) => {
      if (!prev.queue.length) return prev;
      const step = prev.shuffle ? Math.floor(Math.random() * prev.queue.length) : 1;
      const nextIndex = (prev.index + step) % prev.queue.length;
      return { ...prev, index: nextIndex };
    });
  }, []);

  const previous = useCallback(() => {
    setState((prev) => {
      if (!prev.queue.length) return prev;
      const step = prev.shuffle ? Math.floor(Math.random() * prev.queue.length) : 1;
      const nextIndex = (prev.index - step + prev.queue.length * 2) % prev.queue.length;
      return { ...prev, index: nextIndex };
    });
  }, []);

  const playIndex = useCallback((index) => {
    setState((prev) => ({ ...prev, index }));
  }, []);

  const toggleShuffle = useCallback(() => setState((prev) => ({ ...prev, shuffle: !prev.shuffle })), []);
  const cycleRepeat = useCallback(
    () => setState((prev) => ({ ...prev, repeat: prev.repeat === "off" ? "all" : prev.repeat === "all" ? "one" : "off" })),
    []
  );
  const setExpanded = useCallback((expanded) => setState((prev) => ({ ...prev, expanded })), []);
  const clearError = useCallback(() => setState((prev) => ({ ...prev, error: "" })), []);

  const current = state.index >= 0 ? state.queue[state.index] || null : null;

  const value = useMemo(
    () => ({
      ...state,
      current,
      playQueue,
      playIndex,
      toggle,
      seek,
      skip,
      setVolume,
      setSpeed,
      next,
      previous,
      toggleShuffle,
      cycleRepeat,
      setExpanded,
      clearError
    }),
    [
      state,
      current,
      playQueue,
      playIndex,
      toggle,
      seek,
      skip,
      setVolume,
      setSpeed,
      next,
      previous,
      toggleShuffle,
      cycleRepeat,
      setExpanded,
      clearError
    ]
  );

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) throw new Error("usePlayer must be used inside PlayerProvider");
  return context;
};