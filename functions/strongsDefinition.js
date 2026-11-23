// Looks up the definition of a Strong's number.
//
// The definition is taken from the public Blue Letter Bible lexicon and is
// kept in the app, so the next reader of the same word does not have to
// wait for the request, and so a word that was opened once opens again
// straight away.
//
// The function is open to every reader: it only reads and writes the
// definition cache.

const LEXICON_BASE = "https://www.blueletterbible.org/lexicon";
const KJV_SOURCE = "https://bolls.life/get-chapter/KJV";
const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36";

// A few chapters of the KJV, used to find the words that are read most.
const SAMPLE_CHAPTERS = [
  [43, 1], [43, 2], [43, 3], [43, 4], [1, 1], [1, 2], [1, 3], [19, 1],
  [19, 23], [40, 1], [40, 5], [40, 6], [56, 1], [58, 1], [59, 1]
];

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

const stripTags = (html) =>
  decodeEntities(String(html || "").replace(/<[^>]+>/g, " "))
    .replace(/\s{2,}/g, " ")
    .trim();

/** A Strong's number always has a letter and a number: G2424 or H436. */
const normalizeCode = (code) => {
  const value = String(code || "").trim();
  const letters = value.match(/[A-Za-z]/);
  const digits = value.match(/\d+/);
  if (!digits) return "";
  const prefix = letters ? letters[0].toUpperCase() : "";
  if (prefix !== "G" && prefix !== "H") return "";
  return `${prefix}${Number(digits[0])}`;
};

const lexiconUrl = (code) => {
  const greek = code.startsWith("G");
  const number = code.slice(1).padStart(4, "0");
  return `${LEXICON_BASE}/${greek ? "g" : "h"}${number}/kjv/${greek ? "tr" : "wlc"}/0-1/`;
};

/**
 * Takes the block that follows a label out of the lexicon page.
 * The block is closed by the first div that balances the one it opens, so
 * the text inside it is never cut short.
 */
const blockAfterLabel = (html, label) => {
  const marker = html.indexOf(`>${label}</div>`);
  if (marker < 0) return "";
  const rest = html.slice(marker);
  const open = rest.match(/<div[^>]*>/i);
  if (!open) return "";
  const start = rest.indexOf(open[0]) + open[0].length;
  const tag = /<(\/?)div\b[^>]*>/gi;
  tag.lastIndex = start;
  let depth = 1;
  let match = tag.exec(rest);
  while (match) {
    depth += match[1] ? -1 : 1;
    if (depth === 0) return rest.slice(start, match.index);
    match = tag.exec(rest);
  }
  return rest.slice(start);
};

/** The short definition of the word, the block the lexicon page opens with. */
const definitionBlock = (html) => {
  const open = html.match(/<div[^>]*class="[^"]*lexStrongsDef[^"]*"[^>]*>/i);
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

const parseLexicon = (html) => {
  const title = html.match(/<h6[^>]*class="lexTitle(Gk|Hb)"[^>]*>([\s\S]*?)<\/h6>/i);
  const pronunciation = html.match(/class="[^"]*lexicon-pronunc"[^>]*>([^<]*)</i);
  const pageTitle = html.match(/<title>([^<]*)<\/title>/i);
  const transliteration = stripTags(blockAfterLabel(html, "Transliteration")).replace(/\s*\(Key\)\s*$/i, "");
  const fallback = pageTitle
    ? pageTitle[1].replace(/^\s*[GH]\d+\s*-\s*/, "").split(" - ")[0]
    : "";

  return {
    original_word: title ? stripTags(title[2]) : "",
    transliteration: transliteration || fallback.trim(),
    pronunciation: pronunciation ? pronunciation[1].trim() : "",
    part_of_speech: stripTags(blockAfterLabel(html, "Part of Speech")),
    root_word: stripTags(blockAfterLabel(html, "Root Word (Etymology)")),
    definition: stripTags(definitionBlock(html))
  };
};

/** Asks the lexicon for one word. */
const fetchEntry = async (code) => {
  const response = await fetch(lexiconUrl(code), {
    headers: { "User-Agent": USER_AGENT }
  });
  if (!response.ok) return null;
  const html = await response.text();
  const parsed = parseLexicon(html);
  if (!parsed.definition && !parsed.original_word) return null;
  return {
    code,
    language: code.startsWith("G") ? "Greek" : "Hebrew",
    original_word: parsed.original_word,
    transliteration: parsed.transliteration,
    pronunciation: parsed.pronunciation,
    part_of_speech: parsed.part_of_speech,
    root_word: parsed.root_word,
    definition: parsed.definition,
    source: "Blue Letter Bible"
  };
};

const readCached = async (code) => {
  try {
    const rows = await fse2.entities.StrongEntry.filter({ code });
    return rows && rows.length ? rows[0] : null;
  } catch {
    return null;
  }
};

const readCachedCodes = async () => {
  try {
    const rows = await fse2.entities.StrongEntry.list("-updated_date", 1000);
    return new Set((rows || []).map((row) => row.code).filter(Boolean));
  } catch {
    return new Set();
  }
};

const keepEntry = async (values) => {
  try {
    const rows = await fse2.entities.StrongEntry.filter({ code: values.code });
    if (rows && rows.length) {
      await fse2.entities.StrongEntry.update(rows[0].id, values);
      return;
    }
    await fse2.entities.StrongEntry.create(values);
  } catch {
    // The cache is a comfort, not a requirement: the definition is still
    // returned when it cannot be kept.
  }
};

/** The words that are read most often, taken from a few chapters of the KJV. */
const commonCodes = async () => {
  const tally = new Map();
  for (const [book, chapter] of SAMPLE_CHAPTERS) {
    try {
      const response = await fetch(`${KJV_SOURCE}/${book}/${chapter}?bolls_format=true`, {
        headers: { "User-Agent": USER_AGENT }
      });
      if (!response.ok) continue;
      const raw = await response.json();
      const list = Array.isArray(raw) ? raw : (raw && raw.verses) || [];
      const prefix = Number(book) >= 40 ? "G" : "H";
      for (const row of list) {
        const text = String((row && row.text) || "");
        const found = text.match(/<S>\s*([A-Za-z]?\d{1,5})\s*<\/S>/gi) || [];
        for (const token of found) {
          const digits = token.match(/\d+/);
          if (!digits) continue;
          const code = `${prefix}${Number(digits[0])}`;
          tally.set(code, (tally.get(code) || 0) + 1);
        }
      }
    } catch {
      // A chapter that cannot be read is simply left out.
    }
  }
  return Array.from(tally.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([code]) => code);
};

Deno.serve(async (req) => {
  try {
    const body = await req.json();
    const action = String(body.action || "one");

    // The words that are read most often, so the app can keep them ready.
    if (action === "codes") {
      const codes = await commonCodes();
      return Response.json({ codes, total: codes.length });
    }

    // A batch of definitions, for the administrator who keeps them ready.
    if (action === "prepare") {
      const limit = Math.min(Math.max(Number(body.limit) || 20, 1), 30);
      const known = await readCachedCodes();
      const codes = await commonCodes();
      const wanted = codes.filter((code) => !known.has(code)).slice(0, limit);
      const entries = [];
      for (const code of wanted) {
        const entry = await fetchEntry(code);
        if (entry) entries.push(entry);
      }
      return Response.json({
        entries,
        prepared: entries.length,
        remaining: codes.filter((code) => !known.has(code)).length - wanted.length,
        total: codes.length
      });
    }

    const code = normalizeCode(body.code);
    if (!code) {
      return Response.json({ error: "A Strong's number such as G2424 is needed." }, { status: 400 });
    }

    const cached = await readCached(code);
    if (cached && cached.definition) {
      return Response.json({
        code,
        language: cached.language || "",
        original_word: cached.original_word || "",
        transliteration: cached.transliteration || "",
        pronunciation: cached.pronunciation || "",
        part_of_speech: cached.part_of_speech || "",
        root_word: cached.root_word || "",
        definition: cached.definition,
        source: cached.source || "Blue Letter Bible",
        cached: true
      });
    }

    const entry = await fetchEntry(code);
    if (!entry) {
      return Response.json({ error: `No definition was found for ${code}.` }, { status: 404 });
    }
    await keepEntry(entry);
    return Response.json({ ...entry, cached: false });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});