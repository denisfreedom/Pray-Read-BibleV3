import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import { fetchPublicCollection } from "@/lib/contentApi";
import { WORSHIP_PHOTO, PRAYREAD_LOGO_URL } from "@/lib/theme";
import { usePlayer } from "@/lib/player";
import {
  booksInUse,
  buildQueue,
  buildSongIndex,
  downloadSong,
  filterSongs
} from "@/lib/verseSongs";
import SongCard from "@/components/song/SongCard";
import SongFilters from "@/components/song/SongFilters";
import SongShareSheet from "@/components/song/SongShareSheet";
import { MusicIcon, AlertCircleIcon } from "lucide-react";

/**
 * The verse songs page.
 *
 * The songs are the point of the page, so they are shown as dark cards in a
 * grid. The search and the filters work without reloading the page, and the
 * series names are exactly the names the administrator typed.
 */
export default function VerseSongs() {
  const { playQueue, loadQueue, current, playing, toggle } = usePlayer();

  const search = new URLSearchParams(window.location.search);
  const seriesParam = search.get("series") || "";
  const songParam = search.get("song") || "";

  const [query, setQuery] = useState("");
  const [seriesFilter, setSeriesFilter] = useState(seriesParam);
  const [bookNumber, setBookNumber] = useState("");
  const [notice, setNotice] = useState("");
  const [sharing, setSharing] = useState(null);
  const preparedRef = useRef("");

  const { data: seriesRows } = useQuery({
    queryKey: ["verseSongSeries"],
    queryFn: () => fetchPublicCollection("series")
  });

  const { data: episodeRows } = useQuery({
    queryKey: ["verseSongEpisodes"],
    queryFn: () => fetchPublicCollection("episodes")
  });

  const { series, songs } = useMemo(
    () => buildSongIndex(seriesRows || [], episodeRows || []),
    [seriesRows, episodeRows]
  );

  // A link may carry the name of the series instead of its id, so both are
  // accepted.
  const seriesId = useMemo(() => {
    if (!seriesFilter) return "";
    const match = series.find(
      (row) =>
        row.id === seriesFilter ||
        row.name.toLowerCase() === String(seriesFilter).toLowerCase()
    );
    return match ? match.id : seriesFilter;
  }, [series, seriesFilter]);

  const activeSeries = seriesId ? series.find((row) => row.id === seriesId) || null : null;

  const visibleSongs = useMemo(
    () => filterSongs(songs, { query, seriesId, bookNumber }),
    [songs, query, seriesId, bookNumber]
  );

  const bookOptions = useMemo(() => booksInUse(songs), [songs]);

  // A shared link opens the song without starting the music.
  useEffect(() => {
    if (!songParam || !songs.length) return;
    if (preparedRef.current === songParam) return;
    const index = songs.findIndex((row) => row.id === songParam);
    if (index < 0) return;
    preparedRef.current = songParam;
    loadQueue(buildQueue(songs), index);
  }, [songParam, songs, loadQueue]);

  const handlePlay = (song) => {
    if (typeof navigator !== "undefined" && navigator.onLine === false) {
      setNotice("Verse songs need internet. The Bible, the devotionals and the commentary still work offline.");
      return;
    }
    if (current && current.id === song.id) {
      toggle();
      return;
    }
    const source = visibleSongs.some((row) => row.id === song.id) ? visibleSongs : songs;
    const queue = buildQueue(source);
    const index = queue.findIndex((track) => track.id === song.id);
    if (index < 0) return;
    setNotice("");
    playQueue(queue, index);
  };

  const handleDownload = async (song) => {
    if (!song.audioUrl) {
      setNotice("This song has no audio file yet.");
      return;
    }
    const saved = await downloadSong(song);
    setNotice(saved ? `“${song.title}” was downloaded.` : "The download was opened in a new tab.");
  };

  return (
    <div className="pr-page">
      <section className="pr-vs-hero">
        <img className="pr-vs-hero-photo" src={WORSHIP_PHOTO} alt="" />
        <div className="pr-vs-hero-overlay" />
        <div className="pr-container pr-vs-hero-inner">
          <img className="pr-vs-logo" src={PRAYREAD_LOGO_URL} alt="Pray-Read Bible" />
          <h1 className="pr-vs-title">Verse Songs</h1>
          <p className="pr-vs-subtitle">Sing the Word  -  verse by verse</p>
          <Link to={createPageUrl("VerseSongSeries")} className="pr-vs-hero-link">
            Browse the series →
          </Link>
        </div>
      </section>

      <div className="pr-container pr-vs-body">
        <SongFilters
          query={query}
          onQuery={setQuery}
          seriesOptions={series}
          seriesId={seriesId}
          onSeries={(value) => {
            setSeriesFilter(value);
            setBookNumber("");
          }}
          bookOptions={bookOptions}
          bookNumber={bookNumber}
          onBook={setBookNumber}
          resultCount={visibleSongs.length}
        />

        {activeSeries ? (
          <div className="pr-vs-series-bar">
            <Link to={createPageUrl("VerseSongs")} className="pr-vs-back">
              ← All Series
            </Link>
            <span className="pr-vs-series-name">{activeSeries.name}</span>
          </div>
        ) : null}

        {notice ? (
          <p className="pr-vs-notice">
            <AlertCircleIcon className="h-4 w-4" style={{ display: "inline" }} /> {notice}
          </p>
        ) : null}

        {visibleSongs.length === 0 ? (
          <div className="pr-vs-empty">
            <MusicIcon className="h-8 w-8" />
            <h2>No songs here yet</h2>
            <p>
              The songs of a series appear here as soon as they are added in the admin panel.
            </p>
          </div>
        ) : (
          <div className="pr-vs-grid">
            {visibleSongs.map((song) => (
              <SongCard
                key={song.id}
                song={song}
                isCurrent={!!current && current.id === song.id}
                isPlaying={playing}
                onPlay={() => handlePlay(song)}
                onDownload={() => handleDownload(song)}
                onShare={() => setSharing(song)}
              />
            ))}
          </div>
        )}

        <p className="pr-vs-footnote">
          Verse songs stream from the internet. The Bible, the devotionals, the prayers and the commentary
          work offline once they are downloaded in the{" "}
          <Link to={createPageUrl("Offline")} className="pr-link">
            offline centre
          </Link>
          .
        </p>
      </div>

      <SongShareSheet song={sharing} onClose={() => setSharing(null)} />
    </div>
  );
}