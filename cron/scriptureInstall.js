// @cron-name: Fill the Bible library
// @cron-description: Installs the chapters of the Luganda Bible and of the KJV+ Bible that are still missing, and keeps the Strong's numbers of the whole Bible in the app.
// @cron-schedule-type: every_hours
// @cron-schedule-value: 1

// The worker that keeps the library of the app complete.
//
// It works the same way as the buttons of the content manager: it looks at
// the chapters that are really in the app, downloads the ones that are
// missing, and stops as soon as a run makes no progress, so it never wears
// the source out.
//
// The run is safe to repeat: a chapter that is already in the app is left
// alone, and a chapter that fails to download is simply tried again on the
// next run.

const BOOKS = [
  [1, "Genesis", 50], [2, "Exodus", 40], [3, "Leviticus", 27], [4, "Numbers", 36],
  [5, "Deuteronomy", 34], [6, "Joshua", 24], [7, "Judges", 21], [8, "Ruth", 4],
  [9, "1 Samuel", 31], [10, "2 Samuel", 24], [11, "1 Kings", 22], [12, "2 Kings", 25],
  [13, "1 Chronicles", 29], [14, "2 Chronicles", 36], [15, "Ezra", 10], [16, "Nehemiah", 13],
  [17, "Esther", 10], [18, "Job", 42], [19, "Psalms", 150], [20, "Proverbs", 31],
  [21, "Ecclesiastes", 12], [22, "Song of Solomon", 8], [23, "Isaiah", 66], [24, "Jeremiah", 52],
  [25, "Lamentations", 5], [26, "Ezekiel", 48], [27, "Daniel", 12], [28, "Hosea", 14],
  [29, "Joel", 3], [30, "Amos", 9], [31, "Obadiah", 1], [32, "Jonah", 4],
  [33, "Micah", 7], [34, "Nahum", 3], [35, "Habakkuk", 3], [36, "Zephaniah", 3],
  [37, "Haggai", 2], [38, "Zechariah", 14], [39, "Malachi", 4], [40, "Matthew", 28],
  [41, "Mark", 16], [42, "Luke", 24], [43, "John", 21], [44, "Acts", 28],
  [45, "Romans", 16], [46, "1 Corinthians", 16], [47, "2 Corinthians", 13], [48, "Galatians", 6],
  [49, "Ephesians", 6], [50, "Philippians", 4], [51, "Colossians", 4], [52, "1 Thessalonians", 5],
  [53, "2 Thessalonians", 3], [54, "1 Timothy", 6], [55, "2 Timothy", 4], [56, "Titus", 3],
  [57, "Philemon", 1], [58, "Hebrews", 13], [59, "James", 5], [60, "1 Peter", 5],
  [61, "2 Peter", 3], [62, "1 John", 5], [63, "2 John", 1], [64, "3 John", 1],
  [65, "Jude", 1], [66, "Revelation", 22]
];

const CHAPTERS = BOOKS.flatMap(([number, name, count]) =>
  Array.from({ length: count }, (unused, index) => ({
    book_number: number,
    book: name,
    chapter: index + 1
  }))
);

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

const normalizeCode = (code) => {
  const value = String(code || "").trim();
  const letters = value.match(/[A-Za-z]/);
  const digits = value.match(/\d+/);
  if (!digits) return "";
  const prefix = letters ? letters[0].toUpperCase() : "";
  if (prefix !== "G" && prefix !== "H") return "";
  return `${prefix}${Number(digits[0])}`;
};

/** Runs a few jobs at the same time. */
const runWithConcurrency = async (items, limit, worker) => {
  const results = [];
  let index = 0;
  const runners = Array.from({ length: Math.min(Math.max(limit, 1), items.length) }, async () => {
    while (index < items.length) {
      const current = index;
      index += 1;
      results[current] = await worker(items[current]);
    }
  });
  await Promise.all(runners);
  return results;
};

/** Reads every stored row of an entity, a page at a time. */
const readAll = async (entity) => {
  const rows = [];
  const pageSize = 200;
  for (let offset = 0; offset < 20000; offset += pageSize) {
    const batch = await entity.list("created_date", pageSize, offset).catch(() => []);
    if (!batch || !batch.length) break;
    rows.push(...batch);
    if (batch.length < pageSize) break;
  }
  return rows;
};

const saveChapter = async (entity, chapter, verses) => {
  const values = {
    book_number: chapter.book_number,
    book: chapter.book,
    chapter: chapter.chapter,
    verse_count: verses.length,
    verses: verses
      .map((verse) => `${verse.verse}\t${String(verse.text || "").replace(/\t/g, " ")}`)
      .join("\n")
  };
  const rows = await entity.filter({
    book_number: chapter.book_number,
    chapter: chapter.chapter
  });
  if (rows && rows.length) {
    await entity.update(rows[0].id, values);
    return "updated";
  }
  await entity.create(values);
  return "created";
};

/** The block of the chapter, closed by the first div that balances it. */
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

/** The verses of the Luganda source. */
const parseLuganda = (html) => {
  const source = textBodyOf(html) || html;
  const marker = /<span[^>]*class="verse"[^>]*>[\s\S]*?<\/span>/gi;
  const found = [];
  let match = marker.exec(source);
  while (match) {
    const id = /\bid="(\d+)"/.exec(match[0]);
    if (id) {
      found.push({ number: Number(id[1]), from: marker.lastIndex, to: match.index });
    }
    match = marker.exec(source);
  }
  const verses = [];
  found.forEach((entry, index) => {
    const next = found.slice(index + 1);
    const stop = next.length ? next[0].to : source.length;
    const text = stripTags(source.slice(entry.from, stop)).replace(/\s*\n+\s*/g, " ").trim();
    if (!Number.isFinite(entry.number) || !text) return;
    verses.push({ verse: entry.number, text });
  });
  return verses;
};

const fetchLuganda = async (bookNumber, chapter) => {
  const folder = String(Number(bookNumber) || 0).padStart(2, "0");
  const response = await fetch(`https://wordplanet.net/lug/${folder}/${chapter}.htm`, {
    headers: { "User-Agent": USER_AGENT },
    // A source that stops answering must not hold the whole run up.
    signal: AbortSignal.timeout(20000)
  });
  if (!response.ok) throw new Error(`The source answered with ${response.status}.`);
  const verses = parseLuganda(await response.text());
  if (!verses.length) throw new Error("No verses were found on the page.");
  return verses;
};

/** The verses of the KJV source, with the Strong's number of every word. */
const parseStrongs = (raw, bookNumber) => {
  const list = Array.isArray(raw) ? raw : Array.isArray(raw && raw.verses) ? raw.verses : [];
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
    )
      .replace(/\s{2,}/g, " ")
      .trim();
    if (!Number.isFinite(number) || !text) continue;
    verses.push({ verse: number, text });
  }
  return verses;
};

const fetchKjvPlus = async (bookNumber, chapter) => {
  const response = await fetch(
    `https://bolls.life/get-chapter/KJV/${bookNumber}/${chapter}?bolls_format=true`,
    { headers: { "User-Agent": USER_AGENT }, signal: AbortSignal.timeout(20000) }
  );
  if (!response.ok) throw new Error(`The source answered with ${response.status}.`);
  const verses = parseStrongs(await response.json(), bookNumber);
  if (!verses.length) throw new Error("No verses were found on the source.");
  if (!verses.some((verse) => /\([GH]\d{1,5}\)/.test(verse.text))) {
    throw new Error("The chapter came back without any Strong's numbers.");
  }
  return verses;
};

/** Installs the chapters of the Luganda Bible that are missing. */
const fillLuganda = async (limit) => {
  const entity = fse2.entities.LugandaChapter;
  const rows = await readAll(entity);
  const present = new Set(
    rows.filter((row) => row && row.book_number && row.chapter).map((row) => `${row.book_number}:${row.chapter}`)
  );
  const queue = CHAPTERS.filter((entry) => !present.has(`${entry.book_number}:${entry.chapter}`)).slice(0, limit);
  const errors = [];
  const messages = await runWithConcurrency(queue, 8, async (entry) => {
    try {
      const verses = await fetchLuganda(entry.book_number, entry.chapter);
      await saveChapter(entity, entry, verses);
      return null;
    } catch (error) {
      return `${entry.book} ${entry.chapter}: ${error.message}`;
    }
  });
  messages.forEach((message) => {
    if (message) errors.push(message);
  });
  return {
    added: messages.length - errors.length,
    failed: errors.length,
    errors: errors.slice(0, 5),
    missing: queue.length - (messages.length - errors.length)
  };
};

/** Installs the chapters of the KJV+ Bible that are missing. */
const fillKjvPlus = async (limit) => {
  const entity = fse2.entities.KjvPlusChapter;
  const rows = await readAll(entity);
  const present = new Set(
    rows.filter((row) => row && row.book_number && row.chapter).map((row) => `${row.book_number}:${row.chapter}`)
  );
  const queue = CHAPTERS.filter((entry) => !present.has(`${entry.book_number}:${entry.chapter}`)).slice(0, limit);
  const errors = [];
  const messages = await runWithConcurrency(queue, 8, async (entry) => {
    try {
      const verses = await fetchKjvPlus(entry.book_number, entry.chapter);
      await saveChapter(entity, entry, verses);
      return null;
    } catch (error) {
      return `${entry.book} ${entry.chapter}: ${error.message}`;
    }
  });
  messages.forEach((message) => {
    if (message) errors.push(message);
  });
  return {
    added: messages.length - errors.length,
    failed: errors.length,
    errors: errors.slice(0, 5),
    missing: queue.length - (messages.length - errors.length)
  };
};

/**
 * Reads the concordance file.
 * The file is the list of the words of the language in the JSON format. If
 * the file is not plain JSON, every entry is taken out of it one by one.
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

/** Reads the whole concordance of one language. */
const fetchDictionary = async (language) => {
  const response = await fetch(DICTIONARIES[language], { headers: { "User-Agent": USER_AGENT } });
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

/** Keeps the Strong's numbers of the whole Bible in the app. */
const fillWords = async (limit) => {
  const entity = fse2.entities.StrongEntry;
  const rows = await readAll(entity);
  const present = new Set(rows.filter((row) => row && row.code).map((row) => row.code));
  const wanted = [];
  let total = 0;
  for (const language of ["Greek", "Hebrew"]) {
    const words = await fetchDictionary(language);
    const codes = Object.keys(words);
    total += codes.length;
    codes.forEach((code) => {
      if (!present.has(code)) wanted.push(words[code]);
    });
  }
  const batch = wanted.slice(0, limit);
  let kept = 0;
  for (let index = 0; index < batch.length; index += 100) {
    const chunk = batch.slice(index, index + 100);
    // Every word of the batch is looked up first, so a word that is already
    // in the app is never written a second time.
    const found = await Promise.all(
      chunk.map((entry) => entity.filter({ code: entry.code }).catch(() => []))
    );
    const fresh = chunk.filter((entry, position) => !(found[position] && found[position].length));
    if (!fresh.length) continue;
    try {
      await entity.bulkCreate(fresh);
      kept += fresh.length;
    } catch {
      for (const entry of fresh) {
        try {
          await entity.create(entry);
          kept += 1;
        } catch {
          // A word that cannot be kept is looked up again on the next run.
        }
      }
    }
  }
  return { prepared: kept, remaining: Math.max(wanted.length - kept, 0), total };
};

Deno.serve(async (req) => {
  try {
    const report = {};
    // A run takes every chapter that is missing, not only the first few.
    report.luganda = await fillLuganda(1200);
    report.kjvplus = await fillKjvPlus(1200);
    report.words = await fillWords(6000);
    const failed = (report.luganda.failed || 0) + (report.kjvplus.failed || 0);
    const complete =
      report.luganda.missing === 0 && report.kjvplus.missing === 0 && report.words.remaining === 0;
    return Response.json({
      status: complete ? "complete" : failed ? "partial" : "running",
      report
    });
  } catch (error) {
    return Response.json({ status: "error", error: error.message }, { status: 500 });
  }
});