// Fetches a full chapter of scripture.
//   English -> bible-api.com (public domain translations)
//   Luganda -> wordplanet.net (the public Luganda Bible)
// The reader falls back to its own cached copy when the network is unavailable.

const cleanText = (text) =>
  String(text || "")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&mdash;/g, " - ")
    .replace(/&ndash;/g, " - ")
    .replace(/&hellip;/g, "…")
    .replace(/\s*\n+\s*/g, " ")
    .replace(/\s{2,}/g, " ")
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

// The number of chapters every book of the Bible holds, so a request for a
// chapter that does not exist is answered with a clear message.
const BOOK_CHAPTERS = [
  50, 40, 27, 36, 34, 24, 21, 4, 31, 24, 22, 25, 29, 36, 10, 13, 10, 42, 150, 31, 12, 8,
  66, 52, 5, 48, 12, 14, 3, 9, 1, 4, 7, 3, 3, 3, 2, 14, 4, 28, 16, 24, 21, 28, 16, 16,
  13, 6, 6, 4, 4, 5, 3, 6, 4, 3, 1, 13, 5, 5, 3, 5, 1, 1, 1, 22
];

const wordplanetUrl = (language, bookNumber, chapter) => {
  const path = language === "lu" ? "lug" : "en_10";
  // The source keeps every book in a two digit folder: lug/01, lug/02 ...
  const folder = String(Number(bookNumber) || 0).padStart(2, "0");
  return `https://wordplanet.net/${path}/${folder}/${chapter}.htm`;
};

/**
 * Takes the block of the chapter out of the page.
 * The block is closed by the first div that balances the one it opens, so an
 * element inside the chapter never cuts the text short.
 */
const textBodyOf = (html) => {
  const open = html.match(/<div[^>]*class="textBody"[^>]*>/i);
  if (!open) return "";
  const start = open.index + open[0].length;
  const tag = /<(\/?)div\b[^>]*>/gi;
  tag.lastIndex = start;
  let depth = 1;
  let match = tag.exec(html);
  while (match) {
    depth += match[1] ? -1 : 1;
    if (depth === 0) return html.slice(start, match.index);
    match = tag.exec(html);
  }
  return html.slice(start);
};

/**
 * Parses the verse markup used by wordplanet.net.
 * Every verse opens with a marker that carries its number, and the words of
 * a verse run from its marker to the next one.
 */
const parseWordplanet = (html) => {
  const body = textBodyOf(html);
  if (!body) return [];
  const marker = /<span[^>]*class="verse"[^>]*>[\s\S]*?<\/span>/gi;
  const found = [];
  let match = marker.exec(body);
  while (match) {
    const id = /\bid="(\d+)"/.exec(match[0]);
    if (id) {
      found.push({ number: Number(id[1]), from: marker.lastIndex, to: match.index });
    }
    match = marker.exec(body);
  }
  const verses = [];
  found.forEach((entry, index) => {
    const next = found.slice(index + 1);
    const stop = next.length ? next[0].to : body.length;
    const text = decodeEntities(cleanText(body.slice(entry.from, stop)));
    if (!Number.isFinite(entry.number) || !text) return;
    verses.push({ verse: entry.number, text });
  });
  return verses;
};

const bibleApiUrl = (book, chapter, translation) => {
  const path = String(book || "").split(/\s+/).map(encodeURIComponent).join("+");
  return `https://bible-api.com/${path}+${chapter}?translation=${encodeURIComponent(translation)}`;
};

const strongsUrl = (bookNumber, chapter) =>
  `https://bolls.life/get-chapter/KJV/${bookNumber}/${chapter}?bolls_format=true`;

/**
 * The plain King James text of a whole chapter.
 *
 * The bible-api.com source answers a book that has one chapter with a
 * single verse, so the chapter of such a book is taken from the source
 * that carries the Strong's text, with the numbers taken away.
 */
const parsePlainChapter = (raw) => {
  const list = Array.isArray(raw) ? raw : Array.isArray(raw && raw.verses) ? raw.verses : [];
  const verses = [];
  for (const row of list) {
    if (!row) continue;
    const number = Number(row.verse);
    const text = decodeEntities(
      String(row.text || "")
        .replace(/<S>[\s\S]*?<\/S>/gi, " ")
        .replace(/<sup[^>]*>[\s\S]*?<\/sup>/gi, " ")
        .replace(/<[^>]+>/g, " ")
    )
      .replace(/\s{2,}/g, " ")
      .replace(/\s+([.,;:!?])/g, "$1")
      .trim();
    if (!Number.isFinite(number) || !text) continue;
    verses.push({ verse: number, text });
  }
  return verses;
};

const loadPlainChapter = async (bookNumber, chapter) => {
  const response = await fetchWithTimeout(strongsUrl(bookNumber, chapter), {
    headers: { "User-Agent": "PrayReadBible/1.0" }
  });
  const raw = await response.json();
  const verses = response.ok ? parsePlainChapter(raw) : [];
  if (!verses.length) throw new Error("The Bible source did not answer.");
  return verses;
};

/**
 * Parses the Strong's marked text. The Greek and Hebrew numbers arrive as
 * superscript codes and are kept in the verse text so the reader sees them
 * beside the word they belong to.
 */
const parseStrongs = (raw, bookNumber) => {
  const list = Array.isArray(raw) ? raw : Array.isArray(raw && raw.verses) ? raw.verses : [];
  // The Old Testament carries the Hebrew Strong's numbers and the New
  // Testament the Greek ones, so the book tells which of the two is used.
  const prefix = Number(bookNumber) >= 40 ? "G" : "H";
  const verses = [];
  for (const row of list) {
    if (!row) continue;
    const number = Number(row.verse);
    const text = decodeEntities(
      String(row.text || "")
        .replace(/<S>\s*([A-Za-z]?\d{1,5})\s*<\/S>/gi, (whole, code) => {
          const digits = code.match(/\d+/);
          if (!digits) return " ";
          return ` (${prefix}${Number(digits[0])})`;
        })
        .replace(/<sup[^>]*>([\s\S]*?)<\/sup>/gi, " ($1)")
        .replace(/<[^>]+>/g, "")
    ).replace(/\s{2,}/g, " ").trim();
    if (!Number.isFinite(number) || !text) continue;
    verses.push({ verse: number, text });
  }
  return verses;
};

// The reader must never be held by a source that is slow or down, so every
// request to a public source is given a short time and the sources are
// asked at the same time instead of one after the other.
const SOURCE_TIMEOUT = 8000;

const fetchWithTimeout = async (url, options = {}, timeout = SOURCE_TIMEOUT) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
};

/**
 * Waits for the right answer and accepts the spare one only when the right
 * one is late. The reader waits for one source, not for the sum of them.
 */
const firstUsable = async (primary, fallback, graceMs = 1500) => {
  const tagged = (promise, tag) =>
    promise.then((value) => ({ tag, value }), () => ({ tag, value: null }));
  const first = await Promise.race([tagged(primary, "primary"), tagged(fallback, "fallback")]);
  if (first.tag === "primary") {
    if (first.value) return first.value;
    return (await tagged(fallback, "fallback")).value || null;
  }
  // The spare answer came first: the right one is given a short grace to win.
  const grace = await Promise.race([
    tagged(primary, "primary"),
    new Promise((resolve) => setTimeout(() => resolve({ tag: "timeout", value: null }), graceMs))
  ]);
  return grace.value || first.value || null;
};

const loadBibleApi = async (book, chapter, translation) => {
  const response = await fetchWithTimeout(bibleApiUrl(book, chapter, translation));
  const raw = await response.json();
  if (!response.ok || !raw || !Array.isArray(raw.verses) || !raw.verses.length) {
    throw new Error((raw && raw.error) || "The Bible source did not answer.");
  }
  const verses = raw.verses
    .map((verse) => ({ verse: Number(verse.verse), text: cleanText(verse.text) }))
    .filter((verse) => Number.isFinite(verse.verse) && verse.text);
  if (!verses.length) throw new Error("The Bible source came back empty.");
  return verses;
};

/**
 * The plain text of a Word Planet chapter, when it is read through a relay
 * that hands the page over as plain text. Every verse begins with its
 * number, so the verses are picked out one after the other.
 */
const parseWordplanetText = (text) => {
  const body = String(text || "").split("Markdown Content:").pop() || "";
  const verses = [];
  body.split("\n").forEach((rawLine) => {
    const line = rawLine.trim();
    if (!line) return;
    const match = line.match(/^\*?\s*(\d{1,3})[.:]?\s+(.*)$/);
    // Only the verse that comes next in the chapter is taken, so the
    // navigation of the page can never be read as a verse.
    if (match && Number(match[1]) === verses.length + 1) {
      const body2 = cleanText(match[2]);
      if (body2) verses.push({ verse: verses.length + 1, text: body2 });
      return;
    }
    if (verses.length) {
      const last = verses[verses.length - 1];
      last.text = cleanText(`${last.text} ${line}`);
    }
  });
  return verses;
};

/** The first answer that holds a whole chapter wins. */
const firstChapter = async (primary, fallback) => {
  const tagged = (promise, tag) =>
    promise.then((value) => ({ tag, value }), () => ({ tag, value: null }));
  const winner = await Promise.race([tagged(primary, "primary"), tagged(fallback, "fallback")]);
  if (winner.tag === "primary") {
    if (winner.value && winner.value.length) return winner.value;
    const other = await tagged(fallback, "fallback");
    return other.value && other.value.length ? other.value : null;
  }
  if (winner.value && winner.value.length) return winner.value;
  const other = await tagged(primary, "primary");
  return other.value && other.value.length ? other.value : null;
};

// Word Planet does not always let a browser read its pages straight away,
// so the text is also asked for through a public relay. The relay only
// ever carries the public domain text of the Bible.
const loadWordplanet = async (language, bookNumber, chapter) => {
  const url = wordplanetUrl(language, bookNumber, chapter);
  const headers = { "User-Agent": "PrayReadBible/1.0" };
  try {
    const response = await fetchWithTimeout(url, { headers });
    const html = await response.text();
    const verses = parseWordplanet(html);
    if (response.ok && verses.length) return verses;
  } catch {
    // The relay is asked below.
  }
  const asText = fetchWithTimeout(`https://r.jina.ai/${url}`, { headers }, 12000)
    .then((response) => (response.ok ? response.text() : ""))
    .then((text) => parseWordplanetText(text))
    .catch(() => []);
  const asHtml = fetchWithTimeout(
    `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
    { headers },
    12000
  )
    .then((response) => (response.ok ? response.text() : ""))
    .then((html) => parseWordplanet(html))
    .catch(() => []);
  const verses = await firstChapter(asText, asHtml);
  if (!verses || !verses.length) throw new Error("The Bible source did not answer.");
  return verses;
};

const loadStrongs = async (bookNumber, chapter) => {
  const response = await fetchWithTimeout(strongsUrl(bookNumber, chapter), {
    headers: { "User-Agent": "PrayReadBible/1.0" }
  });
  const raw = await response.json();
  const verses = response.ok ? parseStrongs(raw, bookNumber) : [];
  if (!verses.length) throw new Error("The Strong's source did not answer.");
  return verses;
};

Deno.serve(async (req) => {
  try {
    const body = await req.json();
    const bookNumber = Number(body.book_number);
    const book = String(body.book || "").trim();
    const chapter = Number(body.chapter);
    const language = String(body.language || "en").trim().toLowerCase();
    const translation = String(body.translation || "kjv").trim().toLowerCase();

    if (!Number.isInteger(chapter) || chapter < 1) {
      return Response.json({ error: "Chapter must be a positive whole number." }, { status: 400 });
    }
    if (!Number.isInteger(bookNumber) || bookNumber < 1 || bookNumber > 66) {
      return Response.json({ error: "Book must be a number between 1 and 66." }, { status: 400 });
    }

    // Every book holds a known number of chapters, so a request for a
    // chapter that does not exist is answered with a clear message.
    const chaptersOfBook = BOOK_CHAPTERS[bookNumber - 1];
    if (chaptersOfBook && chapter > chaptersOfBook) {
      return Response.json(
        { error: `Chapter ${chapter} is not part of ${book || `book ${bookNumber}`}.` },
        { status: 404 }
      );
    }

    if (language === "lu") {
      const response = await fetch(wordplanetUrl("lu", bookNumber, chapter), {
        headers: { "User-Agent": "PrayReadBible/1.0" }
      });
      const html = await response.text();
      const verses = parseWordplanet(html);
      if (!response.ok || verses.length === 0) {
        return Response.json({ error: `Could not load the Luganda text for chapter ${chapter}.` }, { status: 404 });
      }
      return Response.json({
        reference: book ? `${book} ${chapter}` : `Book ${bookNumber} ${chapter}`,
        book,
        book_number: bookNumber,
        chapter,
        language,
        verse_count: verses.length,
        verses
      });
    }

    if (translation === "kjvp") {
      try {
        const response = await fetch(strongsUrl(bookNumber, chapter), {
          headers: { "User-Agent": "PrayReadBible/1.0" }
        });
        const raw = await response.json();
        const verses = response.ok ? parseStrongs(raw, bookNumber) : [];
        if (verses.length > 0) {
          const marked = verses.some((verse) => /\([GH]\d{1,5}\)/.test(verse.text));
          return Response.json({
            reference: `${book} ${chapter}`,
            book,
            book_number: bookNumber,
            chapter,
            language: "en",
            translation,
            strongs: marked,
            verse_count: verses.length,
            verses
          });
        }
      } catch {
        // Fall through to the plain KJV text below.
      }
    }

    // A book that has one chapter is answered with a single verse by the
    // bible-api.com source, so the whole chapter is taken from the source
    // that carries the Strong's text, with the numbers taken away.
    if (chaptersOfBook === 1) {
      try {
        const verses = await loadPlainChapter(bookNumber, chapter);
        if (verses.length > 0) {
          return Response.json({
            reference: `${book} ${chapter}`,
            book,
            book_number: bookNumber,
            chapter,
            language: "en",
            translation: translation === "kjvp" ? "kjv" : translation,
            strongs: false,
            verse_count: verses.length,
            verses
          });
        }
      } catch {
        // Fall through to the other sources below.
      }
    }

    try {
      const wanted = translation === "kjvp" ? "kjv" : translation;
      const response = await fetch(bibleApiUrl(book, chapter, wanted));
      const raw = await response.json();
      if (response.ok && raw && Array.isArray(raw.verses) && raw.verses.length > 0) {
        const verses = raw.verses.map((verse) => ({
          verse: Number(verse.verse),
          text: cleanText(verse.text)
        }));
        return Response.json({
          reference: raw.reference || `${book} ${chapter}`,
          book,
          book_number: bookNumber,
          chapter,
          language: "en",
          translation: wanted,
          strongs: false,
          verse_count: verses.length,
          verses
        });
      }
    } catch {
      // Fall through to wordplanet below.
    }

    const response = await fetch(wordplanetUrl("en", bookNumber, chapter), {
      headers: { "User-Agent": "PrayReadBible/1.0" }
    });
    const html = await response.text();
    const verses = parseWordplanet(html);
    if (!response.ok || verses.length === 0) {
      return Response.json({ error: `Could not load chapter ${chapter}.` }, { status: 404 });
    }
    return Response.json({
      reference: `${book} ${chapter}`,
      book,
      book_number: bookNumber,
      chapter,
      language: "en",
      translation,
      verse_count: verses.length,
      verses
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});