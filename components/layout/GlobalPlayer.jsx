import React from "react";
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
  RotateCcwIcon,
  RotateCwIcon,
  XCircleIcon
} from "lucide-react";
import { usePlayer } from "@/lib/player";
import { formatDuration } from "@/lib/format";

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
    error,
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
    clearError,
    playIndex
  } = usePlayer();

  if (!current) return null;

  const percent = duration ? Math.min(100, (currentTime / duration) * 100) : 0;

  const onSeek = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = (event.clientX - rect.left) / rect.width;
    seek(ratio * duration);
  };

  return (
    <div className="pr-player">
      {expanded ? (
        <div className="pr-player-sheet">
          <div className="pr-container">
            <div className="pr-grid pr-grid-2" style={{ alignItems: "start" }}>
              <div>
                <p className="pr-eyebrow pr-eyebrow-light">Now playing</p>
                <h3 className="pr-serif" style={{ color: "#fff", margin: "10px 0 6px", fontSize: "1.5rem" }}>
                  {current.title}
                </h3>
                <p style={{ margin: 0, color: "rgba(255,255,255,0.65)", fontSize: "0.85rem" }}>
                  {current.series} {current.verseRef ? `· ${current.verseRef}` : ""}
                </p>

                <div
                  className="pr-progress"
                  onClick={onSeek}
                  role="slider"
                  aria-label="Seek"
                  aria-valuenow={Math.round(percent)}
                  tabIndex={0}
                >
                  <span className="pr-progress-fill" style={{ width: `${percent}%` }} />
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "0.72rem",
                    color: "rgba(255,255,255,0.6)",
                    marginTop: 6
                  }}
                >
                  <span>{formatDuration(currentTime)}</span>
                  <span>{formatDuration(duration)}</span>
                </div>

                <div className="pr-player-controls" style={{ marginTop: 18, flexWrap: "wrap" }}>
                  <button type="button" className="pr-player-btn" onClick={previous} aria-label="Previous">
                    <SkipBackIcon className="h-4 w-4" />
                  </button>
                  <button type="button" className="pr-player-btn" onClick={() => skip(-15)} aria-label="Back 15 seconds">
                    <RotateCcwIcon className="h-4 w-4" />
                  </button>
                  <button type="button" className="pr-player-btn pr-player-btn-main" onClick={toggle} aria-label={playing ? "Pause" : "Play"}>
                    {playing ? <PauseIcon className="h-5 w-5" /> : <PlayIcon className="h-5 w-5" />}
                  </button>
                  <button type="button" className="pr-player-btn" onClick={() => skip(15)} aria-label="Forward 15 seconds">
                    <RotateCwIcon className="h-4 w-4" />
                  </button>
                  <button type="button" className="pr-player-btn" onClick={next} aria-label="Next">
                    <SkipForwardIcon className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    className="pr-player-btn"
                    onClick={toggleShuffle}
                    aria-label="Shuffle"
                    style={shuffle ? { background: "#e7c873", color: "#1a352c" } : undefined}
                  >
                    <ShuffleIcon className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    className="pr-player-btn"
                    onClick={cycleRepeat}
                    aria-label={`Repeat ${repeat}`}
                    style={repeat !== "off" ? { background: "#e7c873", color: "#1a352c" } : undefined}
                  >
                    <RepeatIcon className="h-4 w-4" />
                  </button>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 18, flexWrap: "wrap" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.78rem" }}>
                    <Volume2Icon className="h-4 w-4" />
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={volume}
                      onChange={(event) => setVolume(event.target.value)}
                      aria-label="Volume"
                      style={{ width: 110 }}
                    />
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.78rem" }}>
                    <GaugeIcon className="h-4 w-4" />
                    <select
                      value={speed}
                      onChange={(event) => setSpeed(event.target.value)}
                      aria-label="Playback speed"
                      style={{
                        background: "rgba(255,255,255,0.1)",
                        color: "#fff",
                        border: "1px solid rgba(255,255,255,0.25)",
                        borderRadius: 8,
                        padding: "6px 10px"
                      }}
                    >
                      {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                        <option key={rate} value={rate} style={{ color: "#1a352c" }}>
                          {rate}x
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                {error ? (
                  <div className="pr-player-error" style={{ marginTop: 16 }}>
                    {error}
                  </div>
                ) : null}
              </div>

              <div>
                <p className="pr-eyebrow pr-eyebrow-light">Playlist</p>
                <ul className="pr-list-reset" style={{ marginTop: 12, display: "grid", gap: 8 }}>
                  {(current.playlist || []).map((track, index) => (
                    <li key={`${track.title}-${index}`}>
                      <button
                        type="button"
                        onClick={() => playIndex(index)}
                        style={{
                          width: "100%",
                          textAlign: "left",
                          background: "transparent",
                          border: "1px solid rgba(255,255,255,0.14)",
                          borderRadius: 12,
                          color: "#fff",
                          padding: "10px 14px",
                          cursor: "pointer",
                          fontSize: "0.84rem"
                        }}
                      >
                        <span style={{ fontWeight: 700 }}>{track.title}</span>
                        <span style={{ display: "block", color: "rgba(255,255,255,0.55)", fontSize: "0.72rem" }}>
                          {track.verseRef || track.series}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <div className="pr-player-inner">
        <button
          type="button"
          className="pr-player-btn pr-player-btn-main"
          onClick={toggle}
          aria-label={playing ? "Pause" : "Play"}
        >
          {playing ? <PauseIcon className="h-5 w-5" /> : <PlayIcon className="h-5 w-5" />}
        </button>

        <div className="pr-player-track">
          <p className="pr-player-title">{current.title}</p>
          <p className="pr-player-sub">
            {current.series}
            {current.verseRef ? ` · ${current.verseRef}` : ""} · {formatDuration(currentTime)} /{" "}
            {formatDuration(duration)}
          </p>
          <div className="pr-progress" onClick={onSeek} role="slider" aria-label="Seek" tabIndex={0}>
            <span className="pr-progress-fill" style={{ width: `${percent}%` }} />
          </div>
        </div>

        <div className="pr-player-controls">
          <button type="button" className="pr-player-btn" onClick={next} aria-label="Next track">
            <SkipForwardIcon className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="pr-player-btn"
            onClick={() => setExpanded(!expanded)}
            aria-label={expanded ? "Minimise player" : "Expand player"}
          >
            {expanded ? <ChevronDownIcon className="h-4 w-4" /> : <ChevronUpIcon className="h-4 w-4" />}
          </button>
          <button type="button" className="pr-player-btn" onClick={() => setExpanded(true)} aria-label="Open playlist">
            <ListMusicIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      {error ? (
        <div className="pr-container" style={{ paddingBottom: 12 }}>
          <div className="pr-player-error" style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <XCircleIcon className="h-4 w-4" />
            <span style={{ flex: 1 }}>{error}</span>
            <button
              type="button"
              onClick={() => {
                clearError();
                toggle();
              }}
              style={{
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.5)",
                color: "#fff",
                borderRadius: 999,
                padding: "4px 12px",
                fontSize: "0.75rem",
                cursor: "pointer"
              }}
            >
              Try again
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}