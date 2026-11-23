import { fse2 } from "@/api/fse2Client";
import { offline, chapterKey } from "@/lib/offlineDb";
import { getVersionOrDefault } from "@/lib/versions";

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

/**
 * Parses the verse markup used by wordplanet.net in the browser.
 * The chapter sits in one block, every verse starts with a numbered marker
 * and the verses are separated by a line break.
 */
const parseWordplanet = (html) => {
  const parsed = new DOMParser().parseFromString(html, "text/html");
  const body = parsed.querySelector(".textBody");
  if (!body) return [];
  const verses = [];
  body.innerHTML.split(/<br\s*\/?>|<\/p>/i).forEach((chunk) => {
    const holder = parsed.createElement("div");
    holder.innerHTML = chunk;
    const marker = Array.from(holder.querySelectorAll("span")).find((span) =>
      /^\d+$/.test(String(span.getAttribute("id") || ""))
    );
    if (!marker) return;
    const number = Number(marker.getAttribute("id"));
    const text = decodeEntities(cleanText(holder.textContent.replace(marker.textContent, "")));
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
  // The source keeps every book in a two digit folder: lug/01, lug/02 ...
  const folder = String(Number(bookNumber) || 0).padStart(2, "0");
  return `https://wordplanet.net/${path}/${folder}/${chapter}.htm`;
};

/**
 * The KJV text with the Greek and Hebrew Strong's numbers marked on it.
 * The numbers arrive as superscript codes and are kept in the verse text so
 * the reader can see them beside the word they belong to.
 */
const fetchStrongsDirect = async (bookNumber, chapter) => {
  const response = await fetch(
    `https://bolls.life/get-chapter/KJV/${bookNumber}/${chapter}?bolls_format=true`
  );
  if (!response.ok) throw new Error("The Strong's source did not answer.");
  const raw = await response.json();
  const list = Array.isArray(raw) ? raw : Array.isArray(raw && raw.verses) ? raw.verses : [];
  const verses = list
    .map((row) => ({
      verse: Number(row && row.verse),
      text: decodeEntities(
        String((row && row.text) || "")
          .replace(/<sup[^>]*>([\s\S]*?)<\/sup>/gi, " ($1)")
          .replace(/<[^>]+>/g, "")
      ).replace(/\s+/g, " ").trim()
    }))
    .filter((verse) => Number.isFinite(verse.verse) && verse.text);
  if (!verses.length) throw new Error("No verses were returned.");
  return verses;
};

const fetchEnglishDirect = async (book, chapter, translation = "kjv", bookNumber = null) => {
  if (translation === "kjvp" && bookNumber) {
    try {
      return await fetchStrongsDirect(bookNumber, chapter);
    } catch {
      // the Strong's source is optional: the plain KJV text is used instead
    }
  }
  const wanted = translation === "kjvp" ? "kjv" : translation;
  const response = await fetch(bibleApiUrl(book, chapter, wanted));
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

const fetchViaFunction = async ({ bookNumber, bookName, chapter, language, translation = "kjv" }) => {
  const response = await fse2.functions.invoke("bibleChapter", {
    book_number: bookNumber,
    book: bookName,
    chapter,
    language,
    translation
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

/** Reads the installed chapter: one verse per line, number then text. */
const unpackVerses = (raw) =>
  String(raw || "")
    .split("\n")
    .map((line) => {
      const cut = line.indexOf("\t");
      if (cut < 0) return null;
      return { verse: Number(line.slice(0, cut)), text: cleanText(line.slice(cut + 1)) };
    })
    .filter((verse) => verse && Number.isFinite(verse.verse) && verse.text);

/**
 * Reads a chapter from the installed Luganda copy.
 * The Luganda Bible is installed one chapter at a time, so the reader gets
 * the text from the app itself, even without a live connection.
 */
const fetchLugandaFromDatabase = async (bookNumber, chapter) => {
  try {
    const rows = await fse2.entities.LugandaChapter.filter({
      book_number: Number(bookNumber),
      chapter: Number(chapter)
    });
    const row = (rows || [])[0];
    if (!row || !row.verses) return [];
    return unpackVerses(row.verses);
  } catch {
    return [];
  }
};

/**
 * Keeps a copy of the Luganda chapter in the app.
 * The reader that is signed in as the administrator fills the installed
 * Luganda Bible as the chapters are read.
 */
const storeLugandaChapter = async (bookNumber, chapter, verses) => {
  try {
    const rows = await fse2.entities.LugandaChapter.filter({
      book_number: Number(bookNumber),
      chapter: Number(chapter)
    });
    const values = {
      book_number: Number(bookNumber),
      chapter: Number(chapter),
      verse_count: verses.length,
      verses: verses
        .map((verse) => `${verse.verse}\t${String(verse.text || "").replace(/\t/g, " ")}`)
        .join("\n")
    };
    if (rows && rows.length) {
      await fse2.entities.LugandaChapter.update(rows[0].id, values);
      return;
    }
    await fse2.entities.LugandaChapter.create(values);
  } catch {
    // Only the administrator can store the copy: a reader simply carries on.
  }
};

/**
 * Offline-first chapter loader.
 * 1. Read the IndexedDB cache and paint immediately.
 * 2. Refresh from the backend function, or straight from the public source
 *    when the function needs a signed-in session, and cache the result.
 */
export async function fetchChapter({ bookNumber, bookName, chapter, language = "en", version = null }) {
  if (!bookNumber || !chapter) {
    throw new Error("Choose a book and a chapter first.");
  }

  // A version carries its own language, so the reader always knows which
  // text they are looking at, whatever the language switch says.
  const record = version ? getVersionOrDefault(version) : null;
  const versionId = record ? record.id : "kjv";
  const activeLanguage = record ? record.language : (language === "lu" ? "lu" : "en");
  const translation = record ? record.translation : "kjv";
  const strongs = record ? Boolean(record.strongs) : false;
  const useDatabase = !record || versionId === "kjv" || versionId === "luganda";

  const key = chapterKey(bookNumber, chapter, activeLanguage, versionId);
  let cached = null;
  try {
    cached = await offline.get("chapters", key);
  } catch {
    cached = null;
  }
  // A chapter cached in the other language is not a usable cache entry.
  if (cached && cached.language && cached.language !== activeLanguage) cached = null;
  if (cached && cached.version && cached.version !== versionId) cached = null;

  const refresh = async () => {
    if (inflight.has(key)) return inflight.get(key);
    const request = (async () => {
      let verses = useDatabase ? await fetchFromDatabase(bookNumber, chapter, activeLanguage) : [];
      if (!verses.length && activeLanguage === "lu") {
        verses = await fetchLugandaFromDatabase(bookNumber, chapter);
      }
      if (!verses.length) {
        try {
          verses = await fetchViaFunction({
            bookNumber,
            bookName,
            chapter,
            language: activeLanguage,
            translation
          });
        } catch {
          try {
            verses = activeLanguage === "lu"
              ? await fetchWordplanetDirect("lu", bookNumber, chapter)
              : await fetchEnglishDirect(bookName, chapter, translation, bookNumber);
          } catch {
            throw new Error(
              activeLanguage === "lu"
                ? `The Luganda text of ${bookName} ${chapter} could not be reached. Check the connection and try again.`
                : `The text of ${bookName} ${chapter} could not be reached. Check the connection and try again.`
            );
          }
        }
        // A live Luganda chapter is kept in the app, so the installed copy
        // grows every time the administrator reads a chapter.
        if (activeLanguage === "lu") storeLugandaChapter(bookNumber, chapter, verses).catch(() => {});
      }
      const marked = verses.some((verse) => /\([A-Za-z]?\d{1,5}\)/.test(String(verse.text || "")));
      const payload = {
        reference: `${bookName} ${chapter}`,
        book: bookName,
        book_number: bookNumber,
        chapter,
        language: activeLanguage,
        version: versionId,
        strongs: strongs && marked,
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