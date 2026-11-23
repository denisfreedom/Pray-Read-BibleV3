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

const wordplanetUrl = (language, bookNumber, chapter) => {
  const path = language === "lu" ? "lug" : "en_10";
  return `https://wordplanet.net/${path}/${bookNumber}/${chapter}.htm`;
};

/** Parses the verse markup used by wordplanet.net. */
const parseWordplanet = (html) => {
  const bodyMatch = html.match(/<div class="textBody"[^>]*>([\s\S]*?)<\/div>/i);
  if (!bodyMatch) return [];
  const chunks = bodyMatch[1].split(/<br\s*\/?>/i);
  const verses = [];
  for (const chunk of chunks) {
    const match = chunk.match(/<span class="verse"[^>]*id="(\d+)"[^>]*>([\s\S]*?)<\/span>([\s\S]*)/i);
    if (!match) continue;
    const number = Number(match[1]);
    const text = decodeEntities(cleanText(match[3]));
    if (!Number.isFinite(number) || !text) continue;
    verses.push({ verse: number, text });
  }
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
const parseStrongs = (raw) => {
  const list = Array.isArray(raw) ? raw : Array.isArray(raw && raw.verses) ? raw.verses : [];
  const verses = [];
  for (const row of list) {
    if (!row) continue;
    const number = Number(row.verse);
    const text = decodeEntities(
      String(row.text || "")
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
        const verses = response.ok ? parseStrongs(raw) : [];
        if (verses.length > 0) {
          const marked = verses.some((verse) => /\([A-Za-z]?\d{1,5}\)/.test(verse.text));
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