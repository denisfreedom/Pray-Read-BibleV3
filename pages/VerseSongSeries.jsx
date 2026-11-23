import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import { fetchPublicCollection } from "@/lib/contentApi";
import { useAuth } from "@/lib/AuthContext";
import { usePlayer } from "@/lib/player";
import { VERSE_SONGS } from "@/lib/seedContent";
import { PlayIcon, PauseIcon, MusicIcon, ArrowLeftIcon } from "lucide-react";
import { fse2 } from "@/api/fse2Client";


export default function VerseSongSeries() {
  const params = new URLSearchParams(window.location.search);
  const name = params.get("series") || (VERSE_SONGS[0] && VERSE_SONGS[0].name);
  const { isAuthenticated } = useAuth();
  const { playQueue, current, playing, toggle } = usePlayer();

  const { data: seriesRows } = useQuery({
    queryKey: ["verseSongSeries"],
    queryFn: () => fetchPublicCollection("series", { authenticated: isAuthenticated })
  });

  const { data: episodeRows } = useQuery({
    queryKey: ["verseSongEpisodes"],
    queryFn: () => fetchPublicCollection("episodes", { authenticated: isAuthenticated })
  });

  const entry = useMemo(() => {
    if (seriesRows && seriesRows.length) {
      const row = seriesRows.find((item) => item.name === name);
      if (row) {
        const episodes = (episodeRows || [])
          .filter((episode) => episode.series_name === row.name)
          .sort((a, b) => (a.episode_order || 0) - (b.episode_order || 0));
        return { ...row, episodes };
      }
    }
    return VERSE_SONGS.find((item) => item.name === name) || null;
  }, [seriesRows, episodeRows, name]);

  const playSeries = (index) => {
    const tracks = entry.episodes.map((episode) => ({
      title: episode.title,
      series: entry.name,
      verseRef: episode.verse_ref,
      audioUrl: episode.audio_url,
      duration: episode.duration_seconds || 0,
      playlist: entry.episodes.map((item) => ({ title: item.title, verseRef: item.verse_ref, series: entry.name }))
    }));
    if (current && current.title === entry.episodes[index].title) {
      toggle();
      return;
    }
    playQueue(tracks, index);
  };

  if (!entry) {
    return (
      <div className="pr-container pr-section">
        <div className="pr-empty">
          <MusicIcon className="h-7 w-7" style={{ color: "var(--pr-gold-deep)" }} />
          <p style={{ margin: "12px 0 0", fontWeight: 700 }}>That series was not found.</p>
          <Link to={createPageUrl("VerseSongs")} className="pr-btn pr-btn-primary pr-btn-sm" style={{ marginTop: 14 }}>
            Back to Verse-Songs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <section className="pr-section-tight" style={{ background: entry.accent || "var(--pr-emerald)" }}>
        <div className="pr-container">
          <Link to={createPageUrl("VerseSongs")} className="pr-btn pr-btn-light-outline pr-btn-sm">
            <ArrowLeftIcon className="h-4 w-4" /> All series
          </Link>
          <h1 className="pr-serif" style={{ margin: "16px 0 0", color: "#fff", fontSize: "2.1rem" }}>
            {entry.name}
          </h1>
          {entry.description ? (
            <p style={{ margin: "8px 0 0", color: "rgba(255,255,255,0.82)" }}>{entry.description}</p>
          ) : null}
        </div>
      </section>

      <div className="pr-container pr-section">
        <div className="pr-card" style={{ overflow: "hidden" }}>
          <ul className="pr-list-reset">
            {entry.episodes.map((episode, index) => {
              const isCurrent = current && current.title === episode.title;
              return (
                <li
                  key={`${entry.name}-${episode.title}`}
                  style={{
                    display: "flex",
                    gap: 14,
                    alignItems: "center",
                    padding: "16px 22px",
                    borderBottom: "1px solid var(--pr-border)",
                    background: isCurrent ? "rgba(233,201,129,0.14)" : undefined
                  }}
                >
                  <button
                    type="button"
                    className="pr-icon-btn"
                    style={{ background: isCurrent ? "var(--pr-gold-btn)" : "#fff", color: "var(--pr-emerald)" }}
                    onClick={() => playSeries(index)}
                    aria-label={isCurrent && playing ? `Pause ${episode.title}` : `Play ${episode.title}`}
                  >
                    {isCurrent && playing ? <PauseIcon className="h-4 w-4" /> : <PlayIcon className="h-4 w-4" />}
                  </button>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p className="pr-heading" style={{ margin: 0, fontWeight: 700 }}>
                      {episode.title}
                    </p>
                    <p style={{ margin: "2px 0 0", fontSize: "0.8rem" }}>{episode.verse_ref}</p>
                  </div>
                  <span style={{ fontSize: "0.8rem", color: "var(--pr-body)" }}>{episode.duration_label}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}