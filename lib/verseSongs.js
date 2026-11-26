import { WORSHIP_PHOTO } from "@/lib/theme";
import { parseReference } from "@/lib/scriptureRefs";
import { createPageUrl } from "@/utils";

// Everything the verse-song pages and the admin panel need to read one
// series or one song, whatever shape the record was stored in.
//
// The administrator writes the series name exactly as typed, so the name is
// never replaced by a Bible book name. The book, chapter and verse are
// taken from the fields the administrator filled in, and fall back to the
// verse reference that is already on the song.

export const DEFAULT_SONG_COVER = WORSHIP_PHOTO;

const text = (value) => (value === null || value === undefined ? "" : String(value));

/** A record stays visible until the administrator turns it off. */
export const isVisible = (row) => {
  if (!row) return false;
  if (row.active === undefined || row.active === null || row.active === "") return true;
  return Boolean(row.active);
};

export const normalizeSeries = (rows) =>
  (rows || []).filter(isVisible).map((row) => ({
    id: row.id,
    name: text(row.name) || "Untitled series",
    description: text(row.description),
    cover: text(row.cover_image) || text(row.thumbnail) || DEFAULT_SONG_COVER,
    accent: text(row.accent) || "#1d4035",
    active: isVisible(row),
    raw: row
  }));

export const normalizeSong = (row, seriesByName) => {
  const raw = row || {};
  const reference = parseReference(text(raw.verse_ref));
  const seriesName =
    text(raw.series_name) || text(raw.series) || "No Series";
  const series = seriesByName ? seriesByName[seriesName.toLowerCase()] : null;
  const bookName = text(raw.book_name) || (reference ? reference.bookName : "");
  const bookNumber = Number(raw.book_number) || (reference ? reference.bookNumber : 0);
  const chapter = Number(raw.chapter) || (reference ? reference.chapter : 0);
  const verse = text(raw.verse) || (reference && reference.verse ? String(reference.verse) : "");
  const verseRef =
    text(raw.verse_ref) ||
    (bookName && chapter ? `${bookName} ${chapter}${verse ? `:${verse}` : ""}` : "");
  return {
    id: raw.id,
    title: text(raw.title) || "Untitled song",
    seriesName,
    seriesId: series ? series.id : "",
    bookName,
    bookNumber,
    chapter,
    verse,
    verseRef,
    language: text(raw.language).toUpperCase(),
    version: text(raw.version),
    audioUrl: text(raw.audio_url),
    cover:
      text(raw.cover_url) ||
      text(raw.thumbnail) ||
      (series ? series.cover : "") ||
      DEFAULT_SONG_COVER,
    durationSeconds: Number(raw.duration_seconds) || 0,
    durationLabel: text(raw.duration_label),
    order: Number(raw.episode_order) || 0,
    lyricsEn: text(raw.lyrics_en),
    lyricsLu: text(raw.lyrics_lu),
    playsCount: Number(raw.plays_count) || 0,
    active: isVisible(raw),
    raw
  };
};

/** Builds the two lists the pages draw from, already in display order. */
export const buildSongIndex = (seriesRows, episodeRows) => {
  const series = normalizeSeries(seriesRows);
  const byName = {};
  series.forEach((row) => {
    byName[row.name.toLowerCase()] = row;
  });
  const songs = (episodeRows || [])
    .filter(isVisible)
    .map((row) => normalizeSong(row, byName))
    .sort((a, b) => {
      if (a.seriesName !== b.seriesName) return a.seriesName.localeCompare(b.seriesName);
      if (a.order !== b.order) return a.order - b.order;
      return a.title.localeCompare(b.title);
    });
  return { series, songs };
};

/** The gold line under the song title. */
export const songMetaLine = (song) => {
  const parts = [`Series: ${song.seriesName}`];
  if (song.bookName) parts.push(`Book: ${song.bookName}`);
  if (song.chapter) parts.push(`Chapter ${song.chapter}`);
  if (song.verse) parts.push(`Verse ${song.verse}`);
  return parts.join(" • ");
};

/** The name the downloaded file carries. */
export const downloadFileName = (song) => {
  const parts = [];
  if (song.bookName) parts.push(song.bookName);
  if (song.chapter) parts.push(String(song.chapter));
  if (song.verse) parts.push(String(song.verse));
  const base = parts.length ? parts.join("-") : song.title;
  const slug = base
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
  return `${slug || "song"}.mp3`;
};

export const songShareUrl = (song) => {
  const base = `${window.location.origin}${createPageUrl("VerseSongs")}`;
  const params = new URLSearchParams();
  if (song.seriesId) params.set("series", song.seriesId);
  if (song.id) params.set("song", song.id);
  const query = params.toString();
  return query ? `${base}?${query}` : base;
};

export const songShareText = (song) =>
  `${song.title}${song.verseRef ? `  -  ${song.verseRef}` : ""}\n${songShareUrl(song)}`;

/** The queue the global player plays through, in the order shown. */
export const buildQueue = (songs) => {
  const plain = songs.map((song) => ({
    id: song.id,
    title: song.title,
    series: song.seriesName,
    verseRef: song.verseRef,
    audioUrl: song.audioUrl,
    cover: song.cover,
    duration: song.durationSeconds
  }));
  return plain.map((track) => ({ ...track, playlist: plain }));
};

export const filterSongs = (songs, options) => {
  const { query, seriesId, bookNumber } = options || {};
  const needle = text(query).trim().toLowerCase();
  return (songs || []).filter((song) => {
    if (seriesId && song.seriesId !== seriesId) return false;
    if (bookNumber && song.bookNumber !== Number(bookNumber)) return false;
    if (!needle) return true;
    const haystack = [
      song.title,
      song.seriesName,
      song.bookName,
      song.verseRef,
      song.verse,
      song.language,
      song.version,
      song.lyricsEn,
      song.lyricsLu
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return haystack.includes(needle);
  });
};

/** The books that the songs on the page actually use, for the book filter. */
export const booksInUse = (songs) => {
  const seen = new Map();
  (songs || []).forEach((song) => {
    if (!song.bookNumber) return;
    if (!seen.has(song.bookNumber)) {
      seen.set(song.bookNumber, { number: song.bookNumber, name: song.bookName });
    }
  });
  return Array.from(seen.values()).sort((a, b) => a.number - b.number);
};

/**
 * Saves the audio file on the reader's device. The file name follows the
 * passage, the way the song was named.
 */
export const downloadSong = async (song) => {
  if (!song || !song.audioUrl) return false;
  const name = downloadFileName(song);
  try {
    const response = await fetch(song.audioUrl);
    if (!response.ok) throw new Error("The audio file could not be reached.");
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 3000);
    return true;
  } catch {
    window.open(song.audioUrl, "_blank", "noopener");
    return false;
  }
};