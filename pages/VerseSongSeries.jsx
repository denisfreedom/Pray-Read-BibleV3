import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import { fetchPublicCollection } from "@/lib/contentApi";
import { usePlayer } from "@/lib/player";
import {
  booksInUse,
  buildQueue,
  buildSongIndex,
  downloadSong,
  filterSongs
} from "@/lib/verseSongs";
import SeriesCard from "@/components/song/SeriesCard";
import SongCard from "@/components/song/SongCard";
import SongFilters from "@/components/song/SongFilters";
import SongShareSheet from "@/components/song/SongShareSheet";
import { PlayIcon, MusicIcon, AlertCircleIcon, ArrowLeftIcon } from "lucide-react";

/**
 * The series pages of the verse songs.
 *
 * Without a series in the address the page shows the series themselves, one
 * card for each series the administrator created. With a series in the
 * address it shows the songs of that series, in the same card design as the
 * main verse songs page.
 */
export default function VerseSongSeries() {
  const { playQueue, current, playing, toggle } = usePlayer();

  const search = new URLSearchParams(window.location.search);
  const seriesParam = search.get("series") || "";

  const [query, setQuery] = useState("");
  const [bookNumber, setBookNumber] = useState("");
  const [notice, setNotice] = useState("");
  const [sharing, setSharing] = useState(null);

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

  const activeSeries = useMemo(() => {
    if (!seriesParam) return null;
    return (
      series.find(
        (row) =>
          row.id === seriesParam ||
          row.name.toLowerCase() === String(seriesParam).toLowerCase()
      ) || null
    );
  }, [series, seriesParam]);

  const seriesSongs = useMemo(
    () => (activeSeries ? songs.filter((song) => song.seriesId === activeSeries.id) : []),
    [songs, activeSeries]
  );

  const visibleSongs = useMemo(
    () => filterSongs(seriesSongs, { query, bookNumber }),
    [seriesSongs, query, bookNumber]
  );

  const bookOptions = useMemo(() => booksInUse(seriesSongs), [seriesSongs]);

  const songsInSeries = (seriesId) => songs.filter((song) => song.seriesId === seriesId).length;

  const handlePlay = (song) => {
    if (typeof navigator !== "undefined" && navigator.onLine === false) {
      setNotice("Verse songs need internet. The Bible, the devotionals and the commentary still work offline.");
      return;
    }
    if (current && current.id === song.id) {
      toggle();
      return;
    }
    const source = visibleSongs.some((row) => row.id === song.id) ? visibleSongs : seriesSongs;
    const queue = buildQueue(source);
    const index = queue.findIndex((track) => track.id === song.id);
    if (index < 0) return;
    setNotice("");
    playQueue(queue, index);
  };

  const handlePlayAll = () => {
    if (!seriesSongs.length) return;
    if (typeof navigator !== "undefined" && navigator.onLine === false) {
      setNotice("Verse songs need internet. The Bible, the devotionals and the commentary still work offline.");
      return;
    }
    setNotice("");
    playQueue(buildQueue(seriesSongs), 0);
  };

  const handleDownload = async (song) => {
    if (!song.audioUrl) {
      setNotice("This song has no audio file yet.");
      return;
    }
    const saved = await downloadSong(song);
    setNotice(saved ? `“${song.title}” was downloaded.` : "The download was opened in a new tab.");
  };

  if (!activeSeries) {
    return (
      <div className="pr-page">
        <div className="pr-container pr-vs-body">
          <header className="pr-vs-page-head">
            <h1 className="pr-vs-page-title">Series</h1>
            <p className="pr-vs-page-sub">
              Every series is named by the administrator and shown exactly as it was written.
            </p>
          </header>

          {series.length === 0 ? (
            <div className="pr-vs-empty">
              <MusicIcon className="h-8 w-8" />
              <h2>No series yet  -  add one in Admin.</h2>
            </div>
          ) : (
            <div className="pr-vs-grid">
              {series.map((row) => (
                <SeriesCard key={row.id} series={row} songCount={songsInSeries(row.id)} />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="pr-page">
      <section className="pr-vs-detail-head">
        <div className="pr-container pr-vs-detail-inner">
          <Link to={createPageUrl("VerseSongSeries")} className="pr-vs-back">
            <ArrowLeftIcon className="h-4 w-4" style={{ display: "inline" }} /> All Series
          </Link>
          <div className="pr-vs-detail-row">
            <img className="pr-vs-detail-cover" src={activeSeries.cover} alt="" />
            <div className="pr-vs-detail-text">
              <h1 className="pr-vs-page-title">{activeSeries.name}</h1>
              {activeSeries.description ? (
                <p className="pr-vs-page-sub">{activeSeries.description}</p>
              ) : null}
              <p className="pr-vs-detail-count">
                {seriesSongs.length} {seriesSongs.length === 1 ? "song" : "songs"}
              </p>
              <button
                type="button"
                className="pr-vs-btn-play pr-vs-btn-play-lg"
                onClick={handlePlayAll}
                disabled={!seriesSongs.length}
              >
                <PlayIcon className="h-4 w-4" style={{ display: "inline" }} /> Play all
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="pr-container pr-vs-body">
        <SongFilters
          query={query}
          onQuery={setQuery}
          seriesOptions={[]}
          seriesId=""
          onSeries={() => {}}
          bookOptions={bookOptions}
          bookNumber={bookNumber}
          onBook={setBookNumber}
          resultCount={visibleSongs.length}
          showSeries={false}
        />

        {notice ? (
          <p className="pr-vs-notice">
            <AlertCircleIcon className="h-4 w-4" style={{ display: "inline" }} /> {notice}
          </p>
        ) : null}

        {visibleSongs.length === 0 ? (
          <div className="pr-vs-empty">
            <MusicIcon className="h-8 w-8" />
            <h2>No songs in this series yet</h2>
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
      </div>

      <SongShareSheet song={sharing} onClose={() => setSharing(null)} />
    </div>
  );
}