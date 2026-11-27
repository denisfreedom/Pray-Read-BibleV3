import { WORSHIP_PHOTO } from "@/lib/theme";
import { parseReference } from "@/lib/scriptureRefs";
import { createPageUrl } from "@/utils";

export const DEFAULT_SONG_COVER = WORSHIP_PHOTO;
const text = (value) => (value === null || value === undefined ? "" : String(value));
export const isVisible = (row) => !row || row.active === undefined || row.active === null || row.active === "" ? Boolean(row) : Boolean(row.active);

export const normalizeSeries = (rows) => (rows || []).filter(isVisible).map((row) => ({
  id: row.id,
  name: text(row.name) || text(row.series_title) || "Untitled series",
  description: text(row.description),
  cover: text(row.thumbnail_url) || text(row.cover_image) || text(row.thumbnail) || DEFAULT_SONG_COVER,
  accent: text(row.accent) || "#1d4035",
  featured: Boolean(row.featured), displayOrder: Number(row.display_order) || 0, active: isVisible(row), raw: row
})).sort((a, b) => a.displayOrder - b.displayOrder || a.name.localeCompare(b.name));

export const normalizeSong = (row, seriesByName) => {
  const raw = row || {}; const reference = parseReference(text(raw.verse_ref));
  const seriesName = text(raw.series_name) || text(raw.series_title) || text(raw.series) || "No Series";
  const series = seriesByName ? seriesByName[seriesName.toLowerCase()] : null;
  const bookName = text(raw.book_name) || (reference ? reference.bookName : "");
  const bookNumber = Number(raw.book_number) || (reference ? reference.bookNumber : 0);
  const chapter = Number(raw.chapter) || (reference ? reference.chapter : 0);
  const verse = text(raw.verse) || (reference?.verse ? String(reference.verse) : "");
  return {
    id: raw.id, title: text(raw.title) || text(raw.song_title) || "Untitled song", seriesName, seriesId: series ? series.id : "",
    bookName, bookNumber, chapter, verse, verseRef: text(raw.verse_ref) || (bookName && chapter ? `${bookName} ${chapter}${verse ? `:${verse}` : ""}` : ""),
    language: text(raw.language).toUpperCase(), version: text(raw.version), audioUrl: text(raw.audio_url) || text(raw.mp3_url), description: text(raw.description),
    cover: text(raw.cover_url) || text(raw.thumbnail_url) || text(raw.thumbnail) || (series ? series.cover : "") || DEFAULT_SONG_COVER,
    durationSeconds: Number(raw.duration_seconds) || 0, durationLabel: text(raw.duration_label), order: Number(raw.episode_order) || 0,
    lyricsEn: text(raw.lyrics_en), lyricsLu: text(raw.lyrics_lu), playsCount: Number(raw.plays_count) || 0, active: isVisible(raw), raw
  };
};

export const buildSongIndex = (seriesRows, episodeRows) => {
  const series = normalizeSeries(seriesRows); const byName = {};
  series.forEach((row) => { byName[row.name.toLowerCase()] = row; });
  const songs = (episodeRows || []).filter(isVisible).map((row) => normalizeSong(row, byName)).sort((a, b) => a.seriesName.localeCompare(b.seriesName) || a.order - b.order || a.title.localeCompare(b.title));
  return { series, songs };
};
export const songMetaLine = (song) => [`Series: ${song.seriesName}`, song.bookName && `Book: ${song.bookName}`, song.chapter && `Chapter ${song.chapter}`, song.verse && `Verse ${song.verse}`].filter(Boolean).join(" • ");
export const downloadFileName = (song) => `${(song.seriesName ? `${song.seriesName} - ${song.title}` : song.title).replace(/[\\/:*?"<>|]/g, "-").trim() || "song"}.mp3`;
export const songShareUrl = (song) => { const base = `${window.location.origin}${createPageUrl("VerseSongs")}`; const params = new URLSearchParams(); if (song.seriesId) params.set("series", song.seriesId); if (song.id) params.set("song", song.id); return params.toString() ? `${base}?${params.toString()}` : base; };
export const songShareText = (song) => `Listen free, Download $2  -  ${song.title}  -  ${songShareUrl(song)}`;
export const buildQueue = (songs) => { const plain = songs.map((song) => ({ id: song.id, title: song.title, description: song.description, series: song.seriesName, verseRef: song.verseRef, audioUrl: song.audioUrl, cover: song.cover, duration: song.durationSeconds })); return plain.map((track) => ({ ...track, playlist: plain })); };
export const filterSongs = (songs, options) => {
  const { query, seriesId, bookNumber } = options || {}; const needle = text(query).trim().toLowerCase();
  return (songs || []).filter((song) => { if (seriesId && song.seriesId !== seriesId) return false; if (bookNumber && song.bookNumber !== Number(bookNumber)) return false; if (!needle) return true; return [song.title, song.description, song.seriesName, song.bookName, song.verseRef, song.verse, song.language, song.version, song.lyricsEn, song.lyricsLu].filter(Boolean).join(" ").toLowerCase().includes(needle); });
};
export const booksInUse = (songs) => { const seen = new Map(); (songs || []).forEach((song) => { if (song.bookNumber && !seen.has(song.bookNumber)) seen.set(song.bookNumber, { number: song.bookNumber, name: song.bookName }); }); return Array.from(seen.values()).sort((a, b) => a.number - b.number); };
export const downloadSong = async (song) => {
  if (!song?.audioUrl) return false; const name = downloadFileName(song);
  try { const response = await fetch(song.audioUrl); if (!response.ok) throw new Error("The audio file could not be reached."); const blob = await response.blob(); const url = URL.createObjectURL(blob); const link = document.createElement("a"); link.href = url; link.download = name; document.body.appendChild(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 3000); return true; }
  catch { window.open(song.audioUrl, "_blank", "noopener"); return false; }
};