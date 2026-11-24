// Keeps the definitions of the Strong's numbers in the app.
//
// The whole concordance is taken from the public Strong's dictionaries, so
// every Greek and Hebrew word of the Bible can be opened, from Genesis to
// Revelation. The words are kept in the app, so the next reader of the same
// word gets the answer straight away.
//
// The live lexicon of Blue Letter Bible stays the second source: it is used
// for a word that the concordance does not carry, and for the extra details
// such as the pronunciation and the part of speech.
//
// The function is open to every reader: it only reads and writes the
// definition cache. The administrator is the one who fills it.

const LEXICON_BASE = "https://www.blueletterbible.org/lexicon";
const DICTIONARIES = {
  Greek: "https://raw.githubusercontent.com/openscriptures/strongs/master/greek/strongs-greek-dictionary.js",
  Hebrew: "https://raw.githubusercontent.com/openscriptures/strongs/master/hebrew/strongs-hebrew-dictionary.js"
};
const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36";

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

/** Asks the live lexicon for one word. */
const fetchEntry = async (code) => {
  let response = null;
  try {
    response = await fetch(lexiconUrl(code), {
      headers: { "User-Agent": USER_AGENT },
      signal: AbortSignal.timeout(8000)
    });
  } catch {
    return null;
  }
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

/**
 * Reads the concordance file.
 * The file is the list of the words of the language in the JSON format. If
 * the file is not plain JSON, every entry is taken out of it one by one, so
 * a small change in the file never stops the whole concordance.
 */
const parseDictionaryFile = (text) => {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start >= 0 && end > start) {
    try {
      return JSON.parse(text.slice(start, end + 1));
    } catch {
      // The file is not plain JSON: the entries are taken one by one.
    }
  }
  const words = {};
  const entry = /"([GH]\d+)"\s*:\s*\{([^{}]*)\}/gi;
  let match = entry.exec(text);
  while (match) {
    const body = match[2];
    const field = (name) => {
      const found = new RegExp(`"${name}"\\s*:\\s*"((?:[^"\\\\]|\\\\.)*)"`).exec(body);
      return found ? found[1] : "";
    };
    const code = normalizeCode(match[1]);
    if (code) {
      words[code] = {
        strongs_def: field("strongs_def"),
        kjv_def: field("kjv_def"),
        derivation: field("derivation"),
        translit: field("translit"),
        lemma: field("lemma")
      };
    }
    match = entry.exec(text);
  }
  return words;
};

/**
 * Reads the whole concordance of one language.
 * The file is a list of every word of the language, with its number, its
 * meaning and where the word comes from.
 */
const fetchDictionary = async (language) => {
  const url = DICTIONARIES[language];
  if (!url) return {};
  const response = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
  if (!response.ok) throw new Error(`The ${language} concordance answered with ${response.status}.`);
  const raw = parseDictionaryFile(await response.text());
  const words = {};
  for (const key of Object.keys(raw || {})) {
    const code = normalizeCode(key);
    if (!code) continue;
    const entry = raw[key] || {};
    const short = String(entry.kjv_def || "").trim();
    const full = String(entry.strongs_def || "").trim();
    const definition = short && full ? `${short}: ${full}` : full || short;
    if (!definition) continue;
    words[code] = {
      code,
      language,
      original_word: String(entry.lemma || "").trim(),
      transliteration: String(entry.translit || "").trim(),
      pronunciation: "",
      part_of_speech: "",
      root_word: String(entry.derivation || "").trim(),
      definition,
      source: "Strong's Exhaustive Concordance"
    };
  }
  return words;
};

const readCached = async (code) => {
  try {
    const rows = await fse2.entities.StrongEntry.filter({ code });
    return rows && rows.length ? rows[0] : null;
  } catch {
    return null;
  }
};

/** The numbers that are already kept in the app, of one language or of all. */
const readCachedCodes = async (language = "") => {
  const codes = new Set();
  const pageSize = 500;
  let firstCodeOfLastPage = "";
  for (let offset = 0; offset < 40000; offset += pageSize) {
    let batch = [];
    try {
      batch = language
        ? await fse2.entities.StrongEntry.filter({ language }, "-updated_date", pageSize, offset)
        : await fse2.entities.StrongEntry.list("-updated_date", pageSize, offset);
    } catch {
      break;
    }
    if (!batch || !batch.length) break;
    for (const row of batch) {
      if (row && row.code) codes.add(row.code);
    }
    // The same page twice means the list did not move on: the reading stops.
    const first = batch[0] && batch[0].code ? batch[0].code : "";
    if (first && first === firstCodeOfLastPage) break;
    firstCodeOfLastPage = first;
    if (batch.length < pageSize) break;
  }
  return codes;
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

/**
 * Keeps a list of words in the app, a hundred at a time.
 * Every word of the batch is looked up first, so a word that is already in
 * the app is never written a second time.
 */
const keepEntries = async (entries) => {
  let kept = 0;
  for (let index = 0; index < entries.length; index += 100) {
    const chunk = entries.slice(index, index + 100);
    const found = await Promise.all(
      chunk.map((entry) => fse2.entities.StrongEntry.filter({ code: entry.code }).catch(() => []))
    );
    const fresh = chunk.filter((entry, position) => !(found[position] && found[position].length));
    if (!fresh.length) continue;
    try {
      await fse2.entities.StrongEntry.bulkCreate(fresh);
      kept += fresh.length;
    } catch {
      for (const entry of fresh) {
        try {
          await keepEntry(entry);
          kept += 1;
        } catch {
          // A word that cannot be kept is simply looked up again later.
        }
      }
    }
  }
  return kept;
};

Deno.serve(async (req) => {
  try {
    const body = await req.json();
    const action = String(body.action || "one");

    // How much of the concordance is kept in the app.
    if (action === "status") {
      const languages = body.language ? [String(body.language)] : ["Greek", "Hebrew"];
      const report = {};
      let total = 0;
      let cached = 0;
      for (const language of languages) {
        let words = {};
        try {
          words = await fetchDictionary(language);
        } catch {
          words = {};
        }
        const codes = await readCachedCodes(language);
        const keys = Object.keys(words);
        report[language] = { total: keys.length, cached: keys.filter((code) => codes.has(code)).length };
        total += keys.length;
        cached += report[language].cached;
      }
      return Response.json({ total, cached, missing: Math.max(total - cached, 0), languages: report });
    }

    // Fills the concordance into the app, a batch at a time.
    if (action === "prepare") {
      const limit = Math.min(Math.max(Number(body.limit) || 800, 1), 4000);
      const languages = body.language ? [String(body.language)] : ["Greek", "Hebrew"];
      const report = {};
      let prepared = 0;
      let missing = 0;
      let total = 0;
      let cached = 0;
      for (const language of languages) {
        const words = await fetchDictionary(language);
        const keys = Object.keys(words);
        const codes = await readCachedCodes(language);
        const wanted = keys.filter((code) => !codes.has(code));
        const batch = wanted.slice(0, limit);
        const kept = await keepEntries(batch.map((code) => words[code]));
        prepared += kept;
        missing += Math.max(wanted.length - kept, 0);
        total += keys.length;
        cached += keys.length - wanted.length;
        report[language] = {
          total: keys.length,
          cached: keys.length - wanted.length,
          prepared: kept,
          remaining: Math.max(wanted.length - kept, 0)
        };
      }
      return Response.json({
        prepared,
        remaining: missing,
        total,
        cached,
        done: missing === 0,
        languages: report
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
        source: cached.source || "Strong's Exhaustive Concordance",
        cached: true
      });
    }

    // The live lexicon first: it carries the pronunciation and the kind of
    // word as well.
    let entry = await fetchEntry(code);
    if (!entry) {
      // Then the concordance, which carries every word of the Bible.
      const language = code.startsWith("G") ? "Greek" : "Hebrew";
      try {
        const words = await fetchDictionary(language);
        entry = words[code] || null;
      } catch {
        entry = null;
      }
    }

    if (!entry) {
      return Response.json({ error: `No definition was found for ${code}.` }, { status: 404 });
    }
    await keepEntry(entry);
    return Response.json({ ...entry, cached: false });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});