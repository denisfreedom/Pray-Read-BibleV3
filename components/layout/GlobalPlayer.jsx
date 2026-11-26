import React, { useEffect } from "react";
import {
  PlayIcon,
  PauseIcon,
  SkipBackIcon,
  SkipForwardIcon,
  RepeatIcon,
  ShuffleIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  Volume2Icon,
  GaugeIcon,
  ListMusicIcon,
  XIcon
} from "lucide-react";
import { usePlayer } from "@/lib/player";
import { formatDuration } from "@/lib/format";

/**
 * The verse-song player.
 *
 * It lives at the foot of every page, so a song keeps playing while the
 * reader moves to the Bible, the home page or the dashboard. The bar is
 * black, like the song cards, with cream and gold lettering.
 */
export default function GlobalPlayer() {
  const {
    current,
    playing,
    currentTime,
    duration,
    volume,
    speed,
    shuffle,
    repeat,
    expanded,
    minimized,
    error,
    toggle,
    seek,
    setVolume,
    setSpeed,
    next,
    previous,
    toggleShuffle,
    cycleRepeat,
    setExpanded,
    setMinimized,
    close,
    clearError,
    playIndex
  } = usePlayer();

  // The page keeps clear of the player while a song is on.
  useEffect(() => {
    if (!current) return undefined;
    document.body.classList.add("pr-has-player");
    return () => document.body.classList.remove("pr-has-player");
  }, [current]);

  if (!current) return null;

  const progress = duration > 0 ? Math.min(100, Math.max(0, (currentTime / duration) * 100)) : 0;
  const playlist = Array.isArray(current.playlist) ? current.playlist : [];
  const currentIndex = playlist.findIndex((track) => track && track.id === current.id);

  const handleSeek = (event) => {
    const bar = event.currentTarget;
    const box = bar.getBoundingClientRect();
    if (!box.width || !duration) return;
    const ratio = Math.min(1, Math.max(0, (event.clientX - box.left) / box.width));
    seek(ratio * duration);
  };

  return (
    <div className={`pr-player${minimized ? " pr-player-min" : ""}`}>
      {expanded && !minimized ? (
        <div className="pr-player-sheet">
          <p className="pr-player-sheet-title">Playlist</p>
          {playlist.length === 0 ? (
            <p className="pr-player-sheet-empty">This list has no songs yet.</p>
          ) : (
            <ul className="pr-player-list">
              {playlist.map((track, index) => (
                <li key={track.id || `${track.title}-${index}`}>
                  <button
                    type="button"
                    className={`pr-player-list-row${index === currentIndex ? " pr-player-list-row-active" : ""}`}
                    onClick={() => playIndex(index)}
                  >
                    {track.cover ? (
                      <img className="pr-player-list-cover" src={track.cover} alt="" />
                    ) : null}
                    <span className="pr-player-list-text">
                      <span className="pr-player-list-title">{track.title}</span>
                      <span className="pr-player-list-sub">
                        {[track.series, track.verseRef].filter(Boolean).join(" · ")}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}

      <div className="pr-player-inner">
        {current.cover ? <img className="pr-player-cover" src={current.cover} alt="" /> : null}

        <div className="pr-player-track">
          <p className="pr-player-title">{current.title}</p>
          <p className="pr-player-sub">
            {[current.series, current.verseRef].filter(Boolean).join(" · ")}
          </p>

          {minimized ? null : (
            <>
              <div className="pr-progress" onClick={handleSeek} role="presentation">
                <div className="pr-progress-fill" style={{ width: `${progress}%` }} />
              </div>
              <div className="pr-player-time">
                <span>{formatDuration(currentTime) || "0:00"}</span>
                <span>{formatDuration(duration) || "0:00"}</span>
              </div>
            </>
          )}
        </div>

        <div className="pr-player-controls">
          <button type="button" className="pr-player-btn" onClick={previous} aria-label="Previous song">
            <SkipBackIcon className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="pr-player-btn pr-player-btn-main"
            onClick={toggle}
            aria-label={playing ? "Pause" : "Play"}
          >
            {playing ? <PauseIcon className="h-5 w-5" /> : <PlayIcon className="h-5 w-5" />}
          </button>
          <button type="button" className="pr-player-btn" onClick={next} aria-label="Next song">
            <SkipForwardIcon className="h-4 w-4" />
          </button>

          {minimized ? null : (
            <>
              <button
                type="button"
                className="pr-player-btn"
                onClick={toggleShuffle}
                aria-label="Shuffle"
                style={shuffle ? { background: "var(--pr-gold-btn)", color: "#1a352c" } : undefined}
              >
                <ShuffleIcon className="h-4 w-4" />
              </button>
              <button
                type="button"
                className="pr-player-btn"
                onClick={cycleRepeat}
                aria-label="Repeat"
                style={repeat !== "off" ? { background: "var(--pr-gold-btn)", color: "#1a352c" } : undefined}
              >
                <RepeatIcon className="h-4 w-4" />
              </button>
              <button
                type="button"
                className="pr-player-btn"
                onClick={() => setSpeed(speed === 1 ? 1.25 : speed === 1.25 ? 1.5 : 1)}
                aria-label="Playback speed"
              >
                <GaugeIcon className="h-4 w-4" />
                <span className="pr-player-speed">{speed}x</span>
              </button>
              <span className="pr-player-volume">
                <Volume2Icon className="h-4 w-4" />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={(event) => setVolume(event.target.value)}
                  aria-label="Volume"
                />
              </span>
            </>
          )}

          <button
            type="button"
            className="pr-player-btn"
            onClick={() => setMinimized(!minimized)}
            aria-label={minimized ? "Open the player" : "Minimise the player"}
          >
            {minimized ? <ChevronUpIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />}
          </button>
          <button
            type="button"
            className="pr-player-btn"
            onClick={() => setExpanded(!expanded)}
            aria-label="Show the playlist"
            style={expanded ? { background: "var(--pr-gold-btn)", color: "#1a352c" } : undefined}
          >
            <ListMusicIcon className="h-4 w-4" />
          </button>
          <button type="button" className="pr-player-btn" onClick={close} aria-label="Stop the song">
            <XIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      {error ? (
        <div className="pr-player-error">
          <span>{error}</span>
          <button type="button" onClick={clearError}>
            Try again
          </button>
        </div>
      ) : null}
    </div>
  );
}