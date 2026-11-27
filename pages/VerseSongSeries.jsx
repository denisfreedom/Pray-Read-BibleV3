import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import { fetchPublicCollection } from "@/lib/contentApi";
import { usePlayer } from "@/lib/player";
import { booksInUse, buildQueue, buildSongIndex, downloadSong, filterSongs } from "@/lib/verseSongs";
import SeriesCard from "@/components/song/SeriesCard";
import SongCard from "@/components/song/SongCard";
import SongFilters from "@/components/song/SongFilters";
import SongShareSheet from "@/components/song/SongShareSheet";
import { PlayIcon, MusicIcon, AlertCircleIcon, ArrowLeftIcon } from "lucide-react";

const PURCHASES_KEY = "purchased_verse_songs";
const PENDING_KEY = "pending_verse_song_purchase";
const readStored = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); } catch { return fallback; } };

export default function VerseSongSeries() {
  const { playQueue, current, playing, toggle } = usePlayer();
  const search = new URLSearchParams(window.location.search); const seriesParam = search.get("series") || "";
  const [query, setQuery] = useState(""); const [bookNumber, setBookNumber] = useState(""); const [notice, setNotice] = useState(""); const [sharing, setSharing] = useState(null);
  const [purchases, setPurchases] = useState(() => readStored(PURCHASES_KEY, [])); const [purchaseSong, setPurchaseSong] = useState(() => readStored(PENDING_KEY, null)?.song || null); const [paymentOpened, setPaymentOpened] = useState(() => Boolean(readStored(PENDING_KEY, null)?.paymentOpened));
  const { data: seriesRows } = useQuery({ queryKey: ["verseSongSeries"], queryFn: () => fetchPublicCollection("series") });
  const { data: episodeRows } = useQuery({ queryKey: ["verseSongEpisodes"], queryFn: () => fetchPublicCollection("episodes") });
  const { series, songs } = useMemo(() => buildSongIndex(seriesRows || [], episodeRows || []), [seriesRows, episodeRows]);
  const activeSeries = useMemo(() => series.find((row) => row.id === seriesParam || row.name.toLowerCase() === seriesParam.toLowerCase()) || null, [series, seriesParam]);
  const seriesSongs = useMemo(() => activeSeries ? songs.filter((song) => song.seriesId === activeSeries.id) : [], [songs, activeSeries]);
  const visibleSongs = useMemo(() => filterSongs(seriesSongs, { query, bookNumber }), [seriesSongs, query, bookNumber]);
  const bookOptions = useMemo(() => booksInUse(seriesSongs), [seriesSongs]);
  const songsInSeries = (id) => songs.filter((song) => song.seriesId === id).length;
  const handlePlay = (song) => { if (navigator.onLine === false) { setNotice("Verse songs need internet. The Bible, the devotionals and the commentary still work offline."); return; } if (current?.id === song.id) { toggle(); return; } const queue = buildQueue(visibleSongs.some((row) => row.id === song.id) ? visibleSongs : seriesSongs); const index = queue.findIndex((row) => row.id === song.id); if (index >= 0) { setNotice(""); playQueue(queue, index); } };
  const handlePlayAll = () => { if (!seriesSongs.length) return; if (navigator.onLine === false) { setNotice("Verse songs need internet. The Bible, the devotionals and the commentary still work offline."); return; } setNotice(""); playQueue(buildQueue(seriesSongs), 0); };
  const handleDownload = async (song) => { if (purchases.includes(song.id)) { const result = await downloadSong(song); setNotice(result ? "Your download has started." : "The MP3 opened in a new tab."); return; } if (!song.audioUrl) { setNotice("This song has no audio file yet."); return; } setPurchaseSong(song); setPaymentOpened(false); localStorage.setItem(PENDING_KEY, JSON.stringify({ song, paymentOpened: false })); };
  const confirmPayment = async () => { if (!purchaseSong) return; const updated = Array.from(new Set([...purchases, purchaseSong.id])); localStorage.setItem(PURCHASES_KEY, JSON.stringify(updated)); setPurchases(updated); await downloadSong(purchaseSong); setNotice("Payment received  -  your download has started. Thank you!"); setPurchaseSong(null); setPaymentOpened(false); localStorage.removeItem(PENDING_KEY); };
  if (!activeSeries) return <div className="pr-page"><div className="pr-container pr-vs-body"><header className="pr-vs-page-head"><h1 className="pr-vs-page-title">Series</h1><p className="pr-vs-page-sub">Every series is named by the administrator and shown exactly as it was written.</p></header>{series.length === 0 ? <div className="pr-vs-empty"><MusicIcon className="h-8 w-8" /><h2>No series yet  -  add one in Admin.</h2></div> : <div className="pr-vs-grid">{series.map((row) => <SeriesCard key={row.id} series={row} songCount={songsInSeries(row.id)} />)}</div>}</div></div>;
  return <div className="pr-page">
    <section className="pr-vs-detail-head"><div className="pr-container pr-vs-detail-inner"><Link to={createPageUrl("VerseSongSeries")} className="pr-vs-back"><ArrowLeftIcon className="h-4 w-4" style={{ display: "inline" }} /> All Series</Link><div className="pr-vs-detail-row"><img className="pr-vs-detail-cover" src={activeSeries.cover} alt="" /><div className="pr-vs-detail-text"><h1 className="pr-vs-page-title">{activeSeries.name}</h1>{activeSeries.description ? <p className="pr-vs-page-sub">{activeSeries.description}</p> : null}<p className="pr-vs-detail-count">{seriesSongs.length} {seriesSongs.length === 1 ? "song" : "songs"}</p><button type="button" className="pr-vs-btn-play pr-vs-btn-play-lg" onClick={handlePlayAll} disabled={!seriesSongs.length}><PlayIcon className="h-4 w-4" style={{ display: "inline" }} /> Play all</button></div></div></div></section>
    <div className="pr-container pr-vs-body"><SongFilters query={query} onQuery={setQuery} seriesOptions={[]} seriesId="" onSeries={() => {}} bookOptions={bookOptions} bookNumber={bookNumber} onBook={setBookNumber} resultCount={visibleSongs.length} showSeries={false} />
      {notice ? <p className="pr-vs-notice"><AlertCircleIcon className="h-4 w-4" style={{ display: "inline" }} /> {notice}</p> : null}
      {visibleSongs.length === 0 ? <div className="pr-vs-empty"><MusicIcon className="h-8 w-8" /><h2>No songs in this series yet</h2></div> : <div className="pr-vs-grid">{visibleSongs.map((song) => <SongCard key={song.id} song={song} isCurrent={!!current && current.id === song.id} isPlaying={playing} onPlay={() => handlePlay(song)} onDownload={() => handleDownload(song)} onShare={() => setSharing(song)} purchased={purchases.includes(song.id)} />)}</div>}
    </div>
    <SongShareSheet song={sharing} onClose={() => setSharing(null)} />
    {purchaseSong ? <div role="dialog" aria-modal="true" style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,.55)", display: "grid", placeItems: "center", padding: 16 }}><div className="pr-card pr-card-pad" style={{ width: "min(100%, 440px)" }}><h2 className="pr-heading" style={{ marginTop: 0 }}>Buy to Download  -  $2</h2><p><strong>{purchaseSong.title}</strong><br />{purchaseSong.seriesName}<br /><strong>$2</strong></p>{!paymentOpened ? <><p className="pr-muted">You will pay on Pesapal, then return here to download.</p><button type="button" className="pr-btn pr-btn-primary" onClick={() => { window.open("https://store.pesapal.com/paidaccessonprayreadbible", "_blank", "noopener"); setPaymentOpened(true); localStorage.setItem(PENDING_KEY, JSON.stringify({ song: purchaseSong, paymentOpened: true })); }}>Pay $2 with Pesapal →</button><button type="button" className="pr-btn pr-btn-outline" style={{ marginInlineStart: 8 }} onClick={() => { setPurchaseSong(null); localStorage.removeItem(PENDING_KEY); }}>Cancel</button></> : <><p className="pr-muted">Payment page opened in a new tab. After you pay, click below.</p><button type="button" className="pr-btn pr-btn-primary" onClick={confirmPayment}>I Have Paid  -  Download My Song</button><button type="button" className="pr-btn pr-btn-outline" style={{ marginInlineStart: 8 }} onClick={() => { setPurchaseSong(null); setPaymentOpened(false); localStorage.removeItem(PENDING_KEY); }}>I Have Not Paid Yet</button></>}</div></div> : null}
  </div>;
}