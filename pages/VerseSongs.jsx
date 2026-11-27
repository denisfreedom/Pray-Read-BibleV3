import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import { fetchPublicCollection } from "@/lib/contentApi";
import { WORSHIP_PHOTO, PRAYREAD_LOGO_URL } from "@/lib/theme";
import { usePlayer } from "@/lib/player";
import { booksInUse, buildQueue, buildSongIndex, downloadSong, filterSongs } from "@/lib/verseSongs";
import SongCard from "@/components/song/SongCard";
import SongFilters from "@/components/song/SongFilters";
import SongShareSheet from "@/components/song/SongShareSheet";
import { MusicIcon, AlertCircleIcon } from "lucide-react";

const PESAPAL_URL = "https://store.pesapal.com/paidaccessonprayreadbible";
const PENDING_KEY = "pending_verse_song_purchase";
const PURCHASE_KEY = "purchased_verse_songs";
const readPurchases = () => { try { return JSON.parse(localStorage.getItem(PURCHASE_KEY) || "[]"); } catch { return []; } };

export default function VerseSongs() {
  const { playQueue, loadQueue, current, playing, toggle } = usePlayer();
  const params = new URLSearchParams(window.location.search);
  const seriesParam = params.get("series") || ""; const songParam = params.get("song") || "";
  const [query, setQuery] = useState(""); const [seriesFilter, setSeriesFilter] = useState(seriesParam); const [bookNumber, setBookNumber] = useState("");
  const [notice, setNotice] = useState(""); const [sharing, setSharing] = useState(null); const [purchases, setPurchases] = useState(readPurchases);
  const [purchaseSong, setPurchaseSong] = useState(() => { try { const saved = JSON.parse(localStorage.getItem(PENDING_KEY) || "null"); return saved?.song || null; } catch { return null; } });
  const [paymentOpened, setPaymentOpened] = useState(() => { try { return Boolean(JSON.parse(localStorage.getItem(PENDING_KEY) || "null")?.paymentOpened); } catch { return false; } }); const preparedRef = useRef("");
  const { data: seriesRows } = useQuery({ queryKey: ["verseSongSeries"], queryFn: () => fetchPublicCollection("series") });
  const { data: episodeRows } = useQuery({ queryKey: ["verseSongEpisodes"], queryFn: () => fetchPublicCollection("episodes") });
  const { series, songs } = useMemo(() => buildSongIndex(seriesRows || [], episodeRows || []), [seriesRows, episodeRows]);
  const seriesId = useMemo(() => { const found = series.find((item) => item.id === seriesFilter || item.name.toLowerCase() === seriesFilter.toLowerCase()); return found?.id || seriesFilter; }, [series, seriesFilter]);
  const activeSeries = series.find((item) => item.id === seriesId) || null;
  const visibleSongs = useMemo(() => filterSongs(songs, { query, seriesId, bookNumber }), [songs, query, seriesId, bookNumber]);
  const bookOptions = useMemo(() => booksInUse(songs), [songs]);
  useEffect(() => { if (!songParam || !songs.length || preparedRef.current === songParam) return; const index = songs.findIndex((item) => item.id === songParam); if (index >= 0) { preparedRef.current = songParam; loadQueue(buildQueue(songs), index); } }, [songParam, songs, loadQueue]);
  const handlePlay = (song) => { if (navigator.onLine === false) { setNotice("Verse songs need internet. The Bible and study library still work offline."); return; } if (current?.id === song.id) { toggle(); return; } const list = visibleSongs.some((item) => item.id === song.id) ? visibleSongs : songs; const queue = buildQueue(list); const index = queue.findIndex((item) => item.id === song.id); if (index >= 0) { setNotice(""); playQueue(queue, index); } };
  const handleDownload = async (song) => { if (purchases.includes(song.id)) { const saved = await downloadSong(song); setNotice(saved ? "Your download has started." : "The MP3 opened in a new tab."); return; } setPurchaseSong(song); setPaymentOpened(false); localStorage.setItem(PENDING_KEY, JSON.stringify({ song, paymentOpened: false })); };
  const confirmPayment = async () => { if (!purchaseSong) return; const updated = Array.from(new Set([...purchases, purchaseSong.id])); localStorage.setItem(PURCHASE_KEY, JSON.stringify(updated)); setPurchases(updated); await downloadSong(purchaseSong); setNotice("Payment received  -  your download has started. Thank you!"); setPurchaseSong(null); setPaymentOpened(false); localStorage.removeItem(PENDING_KEY); };
  return <div className="pr-page">
    <section className="pr-vs-hero"><img className="pr-vs-hero-photo" src={WORSHIP_PHOTO} alt="" /><div className="pr-vs-hero-overlay" /><div className="pr-container pr-vs-hero-inner"><img className="pr-vs-logo" src={PRAYREAD_LOGO_URL} alt="Pray-Read Bible" /><h1 className="pr-vs-title">Verse Songs</h1><p className="pr-vs-subtitle">Sing the Word  -  verse by verse</p><Link to={createPageUrl("VerseSongSeries")} className="pr-vs-hero-link">Browse the series →</Link></div></section>
    <div className="pr-container pr-vs-body"><SongFilters query={query} onQuery={setQuery} seriesOptions={series} seriesId={seriesId} onSeries={(value) => { setSeriesFilter(value); setBookNumber(""); }} bookOptions={bookOptions} bookNumber={bookNumber} onBook={setBookNumber} resultCount={visibleSongs.length} />
      {activeSeries ? <div className="pr-vs-series-bar"><Link to={createPageUrl("VerseSongs")} className="pr-vs-back">← All Series</Link><span className="pr-vs-series-name">{activeSeries.name}</span></div> : null}
      {notice ? <p className="pr-vs-notice"><AlertCircleIcon className="h-4 w-4" style={{ display: "inline" }} /> {notice}</p> : null}
      {visibleSongs.length === 0 ? <div className="pr-vs-empty"><MusicIcon className="h-8 w-8" /><h2>No songs here yet</h2><p>Songs appear here once they are added in the admin panel.</p></div> : <div className="pr-vs-grid">{visibleSongs.map((song) => <SongCard key={song.id} song={song} isCurrent={!!current && current.id === song.id} isPlaying={playing} onPlay={() => handlePlay(song)} onDownload={() => handleDownload(song)} onShare={() => setSharing(song)} purchased={purchases.includes(song.id)} />)}</div>}
      <p className="pr-vs-footnote">Streaming is free. Download is $2 per song.</p>
    </div>
    <SongShareSheet song={sharing} onClose={() => setSharing(null)} />
    {purchaseSong ? <div role="dialog" aria-modal="true" style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,.55)", display: "grid", placeItems: "center", padding: 16 }}><div className="pr-card pr-card-pad" style={{ width: "min(100%, 440px)" }}><h2 className="pr-heading" style={{ marginTop: 0 }}>Buy to Download  -  $2</h2><p><strong>{purchaseSong.title}</strong><br />{purchaseSong.seriesName}<br /><strong>$2</strong></p>{!paymentOpened ? <><p className="pr-muted">You will pay on Pesapal, then return here to download.</p><button type="button" className="pr-btn pr-btn-primary" onClick={() => { window.open(PESAPAL_URL, "_blank", "noopener"); setPaymentOpened(true); localStorage.setItem(PENDING_KEY, JSON.stringify({ song: purchaseSong, paymentOpened: true })); }}>Pay $2 with Pesapal →</button><button type="button" className="pr-btn pr-btn-outline" style={{ marginInlineStart: 8 }} onClick={() => { setPurchaseSong(null); localStorage.removeItem(PENDING_KEY); }}>Cancel</button></> : <><p className="pr-muted">Payment page opened in a new tab. After you pay, click below.</p><button type="button" className="pr-btn pr-btn-primary" onClick={confirmPayment}>I Have Paid  -  Download My Song</button><button type="button" className="pr-btn pr-btn-outline" style={{ marginInlineStart: 8 }} onClick={() => { setPurchaseSong(null); setPaymentOpened(false); localStorage.removeItem(PENDING_KEY); }}>I Have Not Paid Yet</button><p className="pr-muted" style={{ fontSize: 12 }}>If the payment tab closed, tap “Pay $2” again.</p></>}</div></div> : null}
  </div>;
}