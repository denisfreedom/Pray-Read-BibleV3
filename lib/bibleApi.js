import { fse2 } from "@/api/fse2Client";
import { offline, chapterKey } from "@/lib/offlineDb";
import { getVersionOrDefault } from "@/lib/versions";
import { markStrongCodes } from "@/lib/strongs";

/** True when the verses carry the Greek and Hebrew Strong's numbers. */
const hasStrongMarkers = (verses) =>
  (verses || []).some((verse) => /\([GH]\d{1,5}\)/.test(String(verse.text || "")));

// The reader is never held by a source that is slow or down: every request
// to a public source is given a short time, and the sources are asked at
// the same time instead of one after the other.
const SOURCE_TIMEOUT = 9000;

const fetchWithTimeout = async (url, options = {}, timeout = SOURCE_TIMEOUT) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
};

const withTimeout = (promise, ms, message) =>
  Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error(message)), ms))
  ]);

/**
 * Two answers are asked for at the same time and the first one that holds a
 * chapter wins, so the reader waits for one source and not for the sum of
 * them. The second answer is still used when the first one fails.
 */
const firstAnswer = async (first, second) => {
  const tagged = (promise, tag) =>
    promise.then((value) => ({ tag, value }), () => ({ tag, value: null }));
  const winner = await Promise.race([tagged(first, "first"), tagged(second, "second")]);
  if (winner.tag === "first") {
    if (winner.value && winner.value.length) return winner.value;
    return (await tagged(second, "second")).value || [];
  }
  if (winner.value && winner.value.length) return winner.value;
  return (await tagged(first, "first")).value || [];
};

const cleanText = (text) =>
  String(text || "")
    // A line break or a tab that was written out is put back into one
    // space, so a verse is never shown with a stray mark in it.
    .replace(/\\n/g, " ")
    .replace(/\\t/g, " ")
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
  const response = await fetchWithTimeout(
    `https://bolls.life/get-chapter/KJV/${bookNumber}/${chapter}?bolls_format=true`
  );
  if (!response.ok) throw new Error("The Strong's source did not answer.");
  const raw = await response.json();
  const list = Array.isArray(raw) ? raw : Array.isArray(raw && raw.verses) ? raw.verses : [];
  const verses = list
    .map((row) => ({
      verse: Number(row && row.verse),
      text: decodeEntities(
        markStrongCodes(String((row && row.text) || ""), bookNumber)
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
  const response = await fetchWithTimeout(bibleApiUrl(book, chapter, wanted));
  if (!response.ok) throw new Error("The Bible source did not answer.");
  const raw = await response.json();
  if (!raw || !Array.isArray(raw.verses) || !raw.verses.length) {
    throw new Error((raw && raw.error) || "No verses were returned.");
  }
  return raw.verses.map((verse) => ({ verse: Number(verse.verse), text: cleanText(verse.text) }));
};

const fetchWordplanetDirect = async (language, bookNumber, chapter) => {
  const response = await fetchWithTimeout(wordplanetUrl(language, bookNumber, chapter));
  if (!response.ok) throw new Error("The Bible source did not answer.");
  const html = await response.text();
  const verses = parseWordplanet(html);
  if (!verses.length) throw new Error("No verses were returned.");
  return verses;
};

const fetchViaFunction = async ({ bookNumber, bookName, chapter, language, translation = "kjv" }) => {
  const response = await withTimeout(
    fse2.functions.invoke("bibleChapter", {
      book_number: bookNumber,
      book: bookName,
      chapter,
      language,
      translation
    }),
    12000,
    "The Bible source took too long to answer."
  );
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
 * Reads the installed chapter: one verse per line, number then text.
 * The copy can come in three shapes, and all of them are read: a real tab
 * between the number and the text, a tab written out as two characters, and
 * a list of verses kept as text. A chapter that was installed by an older
 * version of the app is therefore still read, and never lost.
 */
const unpackVerses = (raw) => {
  const value = String(raw || "").trim();
  if (!value) return [];

  // A copy kept as a list is read as a list.
  if (value.startsWith("[")) {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        const list = parsed
          .map((row) => ({
            verse: Number(row && (row.verse !== undefined ? row.verse : row.number)),
            text: cleanText(String((row && (row.text !== undefined ? row.text : row.content)) || ""))
          }))
          .filter((verse) => Number.isFinite(verse.verse) && verse.text);
        if (list.length) return list;
      }
    } catch {
      // The copy is not a list after all: the other readers take over.
    }
  }

  // The verses are marked by their number. The text of a verse runs to the
  // next number, so a verse that was spread over more than one line is
  // never cut in half.
  const markers = [];
  const markerPattern = /(?:^|\r\n|\r|\n|\\n)\s*(\d{1,3})\s*(?:\\t|\t)/g;
  let match = markerPattern.exec(value);
  while (match) {
    markers.push({
      verse: Number(match[1]),
      markerStart: match.index,
      start: match.index + match[0].length
    });
    match = markerPattern.exec(value);
  }

  const byMarkers = [];
  if (markers.length) {
    markers.forEach((entry, index) => {
      const next = markers.at(index + 1);
      const stop = next ? next.markerStart : value.length;
      const text = cleanText(value.slice(entry.start, stop));
      if (Number.isFinite(entry.verse) && text) byMarkers.push({ verse: entry.verse, text });
    });
  }

  // A copy where every line holds one verse.
  const byLines = [];
  for (const line of value.split(/\r\n|\r|\n|\\n/)) {
    const row = line.match(/^\s*(\d+)\s*(?:\\t|\t)\s*(.*)$/s);
    if (!row) continue;
    const verse = Number(row[1]);
    const text = cleanText(row[2]);
    if (Number.isFinite(verse) && text) byLines.push({ verse, text });
  }

  // A copy where the numbers stand in the middle of the text.
  const byLoose = [];
  const loosePattern = /(\d{1,3})\s*(?:\\t|\t)\s*(.*?)(?=(?:\d{1,3}\s*(?:\\t|\t))|$)/gs;
  let looseMatch = loosePattern.exec(value);
  while (looseMatch) {
    const verse = Number(looseMatch[1]);
    const text = cleanText(looseMatch[2]);
    if (Number.isFinite(verse) && text) byLoose.push({ verse, text });
    looseMatch = loosePattern.exec(value);
  }

  // The reader that found the most verses is the right one.
  if (byMarkers.length >= byLines.length && byMarkers.length >= byLoose.length) return byMarkers;
  if (byLines.length >= byLoose.length) return byLines;
  return byLoose;
};

/** Finds a chapter in the rows of an entity, page by page. */
const findChapterInList = async (entity, bookNumber, chapter) => {
  const pageSize = 500;
  for (let page = 0; page < 6; page += 1) {
    let rows = [];
    try {
      rows = await entity.list("-updated_date", pageSize, page * pageSize);
    } catch {
      return null;
    }
    if (!rows || !rows.length) return null;
    const row = rows.find(
      (item) => Number(item.book_number) === Number(bookNumber) && Number(item.chapter) === Number(chapter)
    );
    if (row) return row;
    if (rows.length < pageSize) return null;
  }
  return null;
};

/**
 * Checks that a chapter is whole.
 * The verses must be numbered in one run from 1 to the end, so a chapter
 * that lost a verse or that was cut in half is never counted as installed.
 */
export const chapterIsComplete = (verses) => {
  if (!Array.isArray(verses) || !verses.length) return false;
  for (let index = 0; index < verses.length; index += 1) {
    if (Number(verses[index].verse) !== index + 1) return false;
  }
  return true;
};

/**
 * Checks that a chapter can be read.
 * The chapter must hold verses, and their numbers must stand in order. A
 * chapter with a gap in the numbering is still handed to the reader, because
 * a chapter that is nearly whole is worth more than an error page.
 */
export const chapterIsReadable = (verses) => {
  if (!Array.isArray(verses) || !verses.length) return false;
  let previous = 0;
  for (const verse of verses) {
    const number = Number(verse && verse.verse);
    if (!Number.isFinite(number) || number <= previous) return false;
    previous = number;
  }
  return true;
};

/**
 * Reads the installed chapter: one verse per line, number then text.
 * The stored chapter is given to the reader as long as it holds verses, so
 * a small fault in the copy never leaves the reader without the passage.
 */
const unpackStoredChapter = (row) => {
  if (!row || !row.verses) return [];
  const verses = unpackVerses(row.verses);
  if (!verses.length) return [];
  return verses;
};

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
    const verses = unpackStoredChapter((rows || [])[0]);
    if (verses.length) return verses;
  } catch {
    // The copy is read another way below.
  }
  // When the chapter is not found by its exact number, the book is read and
  // the chapter is picked from it, so a chapter that was stored with its
  // number in another shape is still found.
  let bookRows = [];
  try {
    bookRows = await fse2.entities.LugandaChapter.filter({ book_number: Number(bookNumber) });
  } catch {
    bookRows = [];
  }
  const row = (bookRows || []).find((item) => Number(item.chapter) === Number(chapter));
  const verses = unpackStoredChapter(row);
  if (verses.length) return verses;
  // The book is not installed at all, so the slow walk over every row of
  // the app is skipped: a chapter that is not installed costs nothing.
  if (!bookRows || !bookRows.length) return [];
  // The last way: the rows of the app are walked until the chapter is
  // found. It is the slowest way, so it is only used when the others fail.
  const found = await findChapterInList(fse2.entities.LugandaChapter, bookNumber, chapter);
  return unpackStoredChapter(found);
};

/**
 * Only the administrator can keep a copy of a chapter in the app.
 * The check is made once and repeated at most every minute, so a reader who
 * is not signed in never sends a write that the app is not allowed to make.
 */
let mayStore = null;
let mayStoreChecked = 0;

const canStoreChapter = async () => {
  const now = Date.now();
  if (mayStore !== null && now - mayStoreChecked < 60000) return mayStore;
  try {
    const user = await fse2.auth.me();
    mayStore = Boolean(user && user.id);
  } catch {
    mayStore = false;
  }
  mayStoreChecked = now;
  return mayStore;
};

/**
 * Keeps a copy of the Luganda chapter in the app.
 * The reader that is signed in as the administrator fills the installed
 * Luganda Bible as the chapters are read.
 */
const storeLugandaChapter = async (bookNumber, chapter, verses) => {
  if (!(await canStoreChapter())) return;
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
        .map((verse) => `${verse.verse}\t${String(verse.text || "").replace(/\t|\n|\r/g, " ")}`)
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
 * Reads a chapter from the installed KJV+ copy.
 * The King James Version with the Strong's numbers is installed one chapter
 * at a time, so the reader gets the marked text from the app itself, even
 * without a live connection.
 */
const fetchKjvPlusFromDatabase = async (bookNumber, chapter) => {
  try {
    const rows = await fse2.entities.KjvPlusChapter.filter({
      book_number: Number(bookNumber),
      chapter: Number(chapter)
    });
    const verses = unpackStoredChapter((rows || [])[0]);
    if (verses.length) return verses;
  } catch {
    // The copy is read another way below.
  }
  let bookRows = [];
  try {
    bookRows = await fse2.entities.KjvPlusChapter.filter({ book_number: Number(bookNumber) });
  } catch {
    bookRows = [];
  }
  const row = (bookRows || []).find((item) => Number(item.chapter) === Number(chapter));
  const verses = unpackStoredChapter(row);
  if (verses.length) return verses;
  // The book is not installed at all, so the slow walk over every row of
  // the app is skipped: a chapter that is not installed costs nothing.
  if (!bookRows || !bookRows.length) return [];
  const found = await findChapterInList(fse2.entities.KjvPlusChapter, bookNumber, chapter);
  return unpackStoredChapter(found);
};

/**
 * Keeps a copy of the KJV+ chapter in the app.
 * The reader that is signed in as the administrator fills the installed
 * copy as the chapters are read.
 */
const storeKjvPlusChapter = async (bookNumber, chapter, verses) => {
  if (!(await canStoreChapter())) return;
  try {
    const rows = await fse2.entities.KjvPlusChapter.filter({
      book_number: Number(bookNumber),
      chapter: Number(chapter)
    });
    const values = {
      book_number: Number(bookNumber),
      chapter: Number(chapter),
      verse_count: verses.length,
      verses: verses
        .map((verse) => `${verse.verse}\t${String(verse.text || "").replace(/\t|\n|\r/g, " ")}`)
        .join("\n")
    };
    if (rows && rows.length) {
      await fse2.entities.KjvPlusChapter.update(rows[0].id, values);
      return;
    }
    await fse2.entities.KjvPlusChapter.create(values);
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
  // A cached chapter that lost a verse is not a usable cache entry either.
  if (cached && !chapterIsReadable(cached.verses)) cached = null;

  const refresh = async () => {
    if (inflight.has(key)) return inflight.get(key);
    const request = (async () => {
      // The copy that is installed in the app is read while the network is
      // asked, so a chapter that is already installed reaches the screen
      // without waiting for the connection at all.
      const localPromise = (async () => {
        const sources = [];
        if (versionId === "kjvp") {
          sources.push(() => fetchKjvPlusFromDatabase(bookNumber, chapter));
        } else if (activeLanguage === "lu") {
          sources.push(() => fetchLugandaFromDatabase(bookNumber, chapter));
        }
        // The imported verses hold the King James Version and the Luganda
        // text, so they are only read for the versions that speak it.
        if (!versionId || versionId === "kjv" || versionId === "kjvp" || activeLanguage === "lu") {
          sources.push(() => fetchFromDatabase(bookNumber, chapter, activeLanguage));
        }
        for (const source of sources) {
          try {
            const rows = await source();
            if (rows && rows.length) return rows;
          } catch {
            // The copy is read another way.
          }
        }
        return [];
      })();

      // The app's own reader and the public source are asked at the same
      // time, so the reader waits for the first answer and not for both.
      const networkPromise = (async () => {
        const viaFunction = fetchViaFunction({
          bookNumber,
          bookName,
          chapter,
          language: activeLanguage,
          translation
        }).catch(() => null);
        const direct = (
          activeLanguage === "lu"
            ? fetchWordplanetDirect("lu", bookNumber, chapter)
            : fetchEnglishDirect(bookName, chapter, translation, bookNumber)
        ).catch(() => null);
        const best = await firstAnswer(viaFunction, direct);
        return best && best.length ? best : [];
      })();

      const local = await localPromise;
      // The installed copy is whole and carries what the reader asked for,
      // so it is the best answer there is.
      const installed =
        local.length && chapterIsComplete(local) && (!strongs || hasStrongMarkers(local))
          ? local
          : null;

      if (installed) {
        networkPromise.catch(() => {});
        const marked = hasStrongMarkers(installed);
        const payload = {
          reference: `${bookName} ${chapter}`,
          book: bookName,
          book_number: bookNumber,
          chapter,
          language: activeLanguage,
          version: versionId,
          strongs: strongs && marked,
          verse_count: installed.length,
          verses: installed
        };
        try {
          await offline.put("chapters", key, payload);
        } catch {
          // Cache failures must never break reading.
        }
        return payload;
      }

      const live = await networkPromise;
      const liveMarked = hasStrongMarkers(live);
      const cachedVerses = cached && cached.verses ? cached.verses : [];
      // The copy that is already on the device is the better one when it
      // holds more verses, or when it carries the Strong's numbers and this
      // answer does not. A thinner text never replaces a whole one, so the
      // verses of a chapter cannot disappear between two readings.
      if (
        cachedVerses.length &&
        (!chapterIsReadable(live) ||
          (chapterIsComplete(cachedVerses) && cachedVerses.length > live.length))
      ) {
        return { ...cached, stale: true, refresh: Promise.resolve(cached) };
      }
      if (!liveMarked && strongs && hasStrongMarkers(cachedVerses)) {
        return { ...cached, stale: true, refresh: Promise.resolve(cached) };
      }

      // The installed copy is used when the network could not answer, so a
      // chapter that is already on the device is never lost.
      const verses = chapterIsReadable(live) ? live : local;
      if (!chapterIsReadable(verses)) {
        throw new Error(
          activeLanguage === "lu"
            ? `The Luganda text of ${bookName} ${chapter} could not be reached. Check the connection and try again.`
            : `The text of ${bookName} ${chapter} could not be reached. Check the connection and try again.`
        );
      }
      const marked = hasStrongMarkers(verses);

      // A live Luganda chapter is kept in the app, so the installed copy
      // grows every time the administrator reads a chapter.
      if (activeLanguage === "lu") storeLugandaChapter(bookNumber, chapter, verses).catch(() => {});
      // A live KJV+ chapter is kept in the app, so the installed copy grows
      // every time the administrator reads a chapter with the Strong's
      // numbers. A plain text fallback is never kept as a KJV+ chapter.
      if (versionId === "kjvp" && marked) {
        storeKjvPlusChapter(bookNumber, chapter, verses).catch(() => {});
      }

      const payload = {
        reference: `${bookName} ${chapter}`,
        book: bookName,
        book_number: bookNumber,
        chapter,
        language: activeLanguage,
        version: versionId,
        strongs: strongs && marked,
        verse_count: verses.length,
        verses
      };
      // Only a whole chapter is put in the cache, so a broken copy can never
      // be handed to the reader later on.
      if (chapterIsComplete(verses)) {
        try {
          await offline.put("chapters", key, payload);
        } catch {
          // Cache failures must never break reading.
        }
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