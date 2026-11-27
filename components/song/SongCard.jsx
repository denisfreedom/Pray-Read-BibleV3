import React from "react";
import { PlayIcon, PauseIcon } from "lucide-react";
import { songMetaLine } from "@/lib/verseSongs";

export default function SongCard({ song, isCurrent, isPlaying, onPlay, onDownload, onShare, purchased = false }) {
  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") { event.preventDefault(); onPlay(); }
  };
  return <article className={`pr-vs-card${isCurrent ? " pr-vs-card-current" : ""}`} onClick={onPlay} onKeyDown={handleKeyDown} role="button" tabIndex={0} aria-label={`Play ${song.title}`}>
    <img className="pr-vs-cover" src={song.cover} alt="" loading="lazy" />
    <div className="pr-vs-card-body">
      <h3 className="pr-vs-card-title">{song.title}</h3>
      <p className="pr-vs-card-meta">{song.description || songMetaLine(song)}</p>
      {song.language ? <span className="pr-vs-badge">{song.language}</span> : null}
      <div className="pr-vs-actions">
        <button type="button" className="pr-vs-btn-play" onClick={(event) => { event.stopPropagation(); onPlay(); }}>
          {isCurrent && isPlaying ? <PauseIcon className="h-4 w-4" style={{ display: "inline" }} /> : <PlayIcon className="h-4 w-4" style={{ display: "inline" }} />}
          {isCurrent && isPlaying ? "Pause" : "Play"}
        </button>
        <button type="button" className="pr-vs-btn-text" style={{ whiteSpace: "nowrap" }} onClick={(event) => { event.stopPropagation(); onDownload(); }}>{purchased ? "Download Again" : "Buy to Download  -  $2"}</button>
        <small className="pr-vs-buy-note">Streaming is free. Download is $2 per song.</small>
        <button type="button" className="pr-vs-btn-text" onClick={(event) => { event.stopPropagation(); onShare(); }}>Share</button>
      </div>
    </div>
  </article>;
}