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