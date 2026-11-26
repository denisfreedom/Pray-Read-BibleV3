import React from "react";
import { PlayIcon, PauseIcon } from "lucide-react";
import { songMetaLine } from "@/lib/verseSongs";

/**
 * One verse song.
 *
 * The card is dark green fading into black, the way the song cards look on
 * the live site. The title and the meta line are cream and gold, so they
 * stay readable on the dark card.
 */
export default function SongCard({ song, isCurrent, isPlaying, onPlay, onDownload, onShare }) {
  const handleCardClick = () => {
    onPlay();
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleCardClick();
    }
  };

  return (
    <article
      className={`pr-vs-card${isCurrent ? " pr-vs-card-current" : ""}`}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`Play ${song.title}`}
    >
      <img className="pr-vs-cover" src={song.cover} alt="" loading="lazy" />
      <div className="pr-vs-card-body">
        <h3 className="pr-vs-card-title">{song.title}</h3>
        <p className="pr-vs-card-meta">{songMetaLine(song)}</p>
        {song.language ? <span className="pr-vs-badge">{song.language}</span> : null}
        <div className="pr-vs-actions">
          <button
            type="button"
            className="pr-vs-btn-play"
            onClick={(event) => {
              event.stopPropagation();
              onPlay();
            }}
          >
            {isCurrent && isPlaying ? (
              <PauseIcon className="h-4 w-4" style={{ display: "inline" }} />
            ) : (
              <PlayIcon className="h-4 w-4" style={{ display: "inline" }} />
            )}
            {isCurrent && isPlaying ? "Pause" : "Play"}
          </button>
          <button
            type="button"
            className="pr-vs-btn-text"
            onClick={(event) => {
              event.stopPropagation();
              onDownload();
            }}
          >
            Download
          </button>
          <button
            type="button"
            className="pr-vs-btn-text"
            onClick={(event) => {
              event.stopPropagation();
              onShare();
            }}
          >
            Share
          </button>
        </div>
      </div>
    </article>
  );
}