import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import { fetchPublicCollection } from "@/lib/contentApi";
import { useAuth } from "@/lib/AuthContext";
import { VERSE_SONGS } from "@/lib/seedContent";
import { WORSHIP_IMAGE } from "@/lib/theme";
import { usePlayer } from "@/lib/player";
import { PlayIcon, PauseIcon, MusicIcon, AlertCircleIcon } from "lucide-react";
import { fse2 } from "@/api/fse2Client";


export default function VerseSongs() {
  const { isAuthenticated } = useAuth();
  const { playQueue, current, playing, toggle, error } = usePlayer();

  const { data: seriesRows } = useQuery({
    queryKey: ["verseSongSeries"],
    queryFn: () => fetchPublicCollection("series", { authenticated: isAuthenticated })
  });

  const { data: episodeRows } = useQuery({
    queryKey: ["verseSongEpisodes"],
    queryFn: () => fetchPublicCollection("episodes", { authenticated: isAuthenticated })
  });

  const series = useMemo(() => {
    if (seriesRows && seriesRows.length) {
      return seriesRows.map((row) => {
        const episodes = (episodeRows || [])
          .filter((episode) => episode.series_name === row.name)
          .sort((a, b) => (a.episode_order || 0) - (b.episode_order || 0));
        return { ...row, episodes };
      });
    }
    return VERSE_SONGS;
  }, [seriesRows, episodeRows]);

  const playSeries = (entry, index) => {
    const tracks = entry.episodes.map((episode) => ({
      title: episode.title,
      series: entry.name,
      verseRef: episode.verse_ref,
      audioUrl: episode.audio_url,
      duration: episode.duration_seconds || 0,
      playlist: entry.episodes.map((item) => ({
        title: item.title,
        verseRef: item.verse_ref,
        series: entry.name
      }))
    }));
    if (current && current.series === entry.name && current.title === entry.episodes[index].title) {
      toggle();
      return;
    }
    playQueue(tracks, index);
  };

  return (
    <div>
      <section className="pr-hero">
        <div className="pr-hero-bg" style={{ backgroundImage: `url(${WORSHIP_IMAGE})` }} />
        <div className="pr-hero-overlay" />
        <div className="pr-container pr-hero-inner">
          <span className="pr-eyebrow pr-eyebrow-light">Verse-Songs</span>
          <h1 className="pr-hero-title">Sing the scripture</h1>
          <p className="pr-hero-text">
            Songs built from the passages, with a player that keeps going while you read, pray or browse the
            rest of the app.
          </p>
        </div>
      </section>

      <div className="pr-container pr-section">
        {error ? (
          <div className="pr-error" style={{ marginBottom: 20, display: "flex", gap: 8, alignItems: "center" }}>
            <AlertCircleIcon className="h-4 w-4" />
            {error}
          </div>
        ) : null}

        {series.length === 0 ? (
          <div className="pr-empty">
            <MusicIcon className="h-7 w-7" style={{ color: "var(--pr-gold-deep)" }} />
            <p style={{ margin: "12px 0 0", fontWeight: 700 }}>No verse-song series yet.</p>
            <p style={{ margin: "8px 0 0", fontSize: "0.88rem" }}>
              The team is preparing the first recordings. Check back soon.
            </p>
          </div>
        ) : (
          <div className="pr-grid pr-grid-2">
            {series.map((entry) => (
              <div key={entry.name} className="pr-card" style={{ overflow: "hidden" }}>
                <div
                  style={{
                    background: entry.accent || "var(--pr-emerald)",
                    padding: "18px 22px",
                    color: "#fff"
                  }}
                >
                  <h2 className="pr-serif" style={{ margin: 0, fontSize: "1.35rem" }}>
                    {entry.name}
                  </h2>
                  {entry.description ? (
                    <p style={{ margin: "6px 0 0", fontSize: "0.85rem", color: "rgba(255,255,255,0.8)" }}>
                      {entry.description}
                    </p>
                  ) : null}
                  <p style={{ margin: "8px 0 0", fontSize: "0.75rem", color: "rgba(255,255,255,0.7)" }}>
                    {entry.episodes.length} {entry.episodes.length === 1 ? "episode" : "episodes"}
                  </p>
                </div>

                <ul className="pr-list-reset" style={{ padding: 8 }}>
                  {entry.episodes.map((episode, index) => {
                    const isCurrent = current && current.title === episode.title;
                    return (
                      <li
                        key={`${entry.name}-${episode.title}`}
                        style={{ display: "flex", gap: 12, alignItems: "center", padding: "10px 14px" }}
                      >
                        <button
                          type="button"
                          className="pr-icon-btn"
                          style={{ background: isCurrent ? "var(--pr-gold-btn)" : "#fff", color: "var(--pr-emerald)" }}
                          onClick={() => playSeries(entry, index)}
                          aria-label={isCurrent && playing ? `Pause ${episode.title}` : `Play ${episode.title}`}
                        >
                          {isCurrent && playing ? (
                            <PauseIcon className="h-4 w-4" />
                          ) : (
                            <PlayIcon className="h-4 w-4" />
                          )}
                        </button>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p className="pr-heading" style={{ margin: 0, fontWeight: 700, fontSize: "0.94rem" }}>
                            {episode.title}
                          </p>
                          <p style={{ margin: "2px 0 0", fontSize: "0.78rem" }}>{episode.verse_ref}</p>
                        </div>
                        <span style={{ fontSize: "0.78rem", color: "var(--pr-body)" }}>
                          {episode.duration_label}
                        </span>
                      </li>
                    );
                  })}
                </ul>

                <div style={{ padding: "0 22px 20px" }}>
                  <Link
                    to={createPageUrl("VerseSongSeries") + `?series=${encodeURIComponent(entry.name)}`}
                    className="pr-link"
                    style={{ fontSize: "0.86rem" }}
                  >
                    Open series →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="pr-success" style={{ marginTop: 22 }}>
          Verse-songs stream from the internet. The Bible, devotionals, prayers and commentary work offline once
          downloaded in the{" "}
          <Link to={createPageUrl("Offline")} className="pr-link">
            offline centre
          </Link>
          .
        </div>
      </div>
    </div>
  );
}