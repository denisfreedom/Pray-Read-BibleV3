import { fse2 } from "@/api/fse2Client";
import { offline, chapterKey } from "@/lib/offlineDb";

const cleanText = (text) =>
  String(text || "")
    .replace(/\s*\n+\s*/g, " ")
    .trim();

const decodeEntities = (text) =>
  String(text || "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#0?39;|&apos;/gi, "'")
    .replace(/&mdash;/gi, " - ")
    .replace(/&ndash;/gi, " - ")
    .replace(/&hellip;/gi, "…")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">");

/** Parses the verse markup used by wordplanet.net in the browser. */
const parseWordplanet = (html) => {
  const parsed = new DOMParser().parseFromString(html, "text/html");
  const body = parsed.querySelector(".textBody");
  if (!body) return [];
  const verses = [];
  body.querySelectorAll("p").forEach((paragraph) => {
    const marker = paragraph.querySelector("span.verse");
    if (!marker) return;
    const number = Number(marker.getAttribute("id"));
    const text = decodeEntities(cleanText(paragraph.textContent.replace(marker.textContent, "")));
    if (!Number.isFinite(number) || !text) return;
    verses.push({ verse: number, text });
  });
  return verses;
};

const bibleApiUrl = (book, chapter, translation) => {
  const path = String(book || "").split(/\s+/).map(encodeURIComponent).join("+");
  return `https://bible-api.com/${path}+${chapter}?translation=${encodeURIComponent(translation)}`;
};

const wordplanetUrl = (language, bookNumber, chapter) => {
  const path = language === "lu" ? "lug" : "en_10";
  return `https://wordplanet.net/${path}/${bookNumber}/${chapter}.htm`;
};

const fetchEnglishDirect = async (book, chapter) => {
  const response = await fetch(bibleApiUrl(book, chapter, "kjv"));
  if (!response.ok) throw new Error("The Bible source did not answer.");
  const raw = await response.json();
  if (!raw || !Array.isArray(raw.verses) || !raw.verses.length) {
    throw new Error((raw && raw.error) || "No verses were returned.");
  }
  return raw.verses.map((verse) => ({ verse: Number(verse.verse), text: cleanText(verse.text) }));
};

const fetchWordplanetDirect = async (language, bookNumber, chapter) => {
  const response = await fetch(wordplanetUrl(language, bookNumber, chapter));
  if (!response.ok) throw new Error("The Bible source did not answer.");
  const html = await response.text();
  const verses = parseWordplanet(html);
  if (!verses.length) throw new Error("No verses were returned.");
  return verses;
};

const fetchViaFunction = async ({ bookNumber, bookName, chapter, language }) => {
  const response = await fse2.functions.invoke("bibleChapter", {
    book_number: bookNumber,
    book: bookName,
    chapter,
    language
  });
  const data = response && response.data ? response.data : response;
  if (!data || !Array.isArray(data.verses) || data.verses.length === 0) {
    throw new Error((data && data.error) || `Could not load ${bookName} ${chapter}.`);
  }
  return data.verses.map((verse) => ({ verse: Number(verse.verse), text: cleanText(verse.text) }));
};

// One refresh per chapter key at a time, so quick navigation never fires
// duplicate requests for the same passage.
const inflight = new Map();

/**
 * Reads a chapter from the verses the content manager imported.
 * A chapter is only served from the database when every stored verse has
 * the requested language, so a half translated chapter never reaches the
 * reader.
 */
const fetchFromDatabase = async (bookNumber, chapter, language) => {
  let rows = [];
  try {
    rows = await fse2.entities.BibleVerse.filter(
      { book_number: Number(bookNumber), chapter: Number(chapter) },
      "verse",
      400
    );
  } catch {
    return [];
  }
  if (!rows || rows.length === 0) return [];
  const field = language === "lu" ? "text_lu" : "text_en";
  const usable = rows.filter((row) => cleanText(row[field]));
  if (usable.length !== rows.length) return [];
  return usable.map((row) => ({
    verse: Number(row.verse),
    text: cleanText(row[field])
  }));
};

/**
 * Offline-first chapter loader.
 * 1. Read the IndexedDB cache and paint immediately.
 * 2. Refresh from the backend function, or straight from the public source
 *    when the function needs a signed-in session, and cache the result.
 */
export async function fetchChapter({ bookNumber, bookName, chapter, language = "en" }) {
  if (!bookNumber || !chapter) {
    throw new Error("Choose a book and a chapter first.");
  }

  const key = chapterKey(bookNumber, chapter, language);
  let cached = null;
  try {
    cached = await offline.get("chapters", key);
  } catch {
    cached = null;
  }
  // A chapter cached in the other language is not a usable cache entry.
  if (cached && cached.language && cached.language !== language) cached = null;

  const refresh = async () => {
    if (inflight.has(key)) return inflight.get(key);
    const request = (async () => {
      let verses = await fetchFromDatabase(bookNumber, chapter, language);
      if (!verses.length) {
        try {
          verses = await fetchViaFunction({ bookNumber, bookName, chapter, language });
        } catch {
          verses = language === "lu"
            ? await fetchWordplanetDirect("lu", bookNumber, chapter)
            : await fetchEnglishDirect(bookName, chapter);
        }
      }
      const payload = {
        reference: `${bookName} ${chapter}`,
        book: bookName,
        book_number: bookNumber,
        chapter,
        language,
        verses
      };
      try {
        await offline.put("chapters", key, payload);
      } catch {
        // Cache failures must never break reading.
      }
      return payload;
    })();
    inflight.set(key, request);
    try {
      return await request;
    } finally {
      inflight.delete(key);
    }
  };

  const online = typeof navigator === "undefined" ? true : navigator.onLine !== false;

  if (cached && cached.verses && cached.verses.length > 0) {
    const promise = online ? refresh().catch(() => null) : Promise.resolve(null);
    return { ...cached, stale: true, refresh: promise };
  }

  const fresh = await refresh();
  return { ...fresh, stale: false, refresh: Promise.resolve(fresh) };
}

export const chapterAudioUrl = (bookNumber, chapter) =>
  `https://www.wordproaudio.org/bibles/app/audio/1/${bookNumber}/${chapter}.mp3`;