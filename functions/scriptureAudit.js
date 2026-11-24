// The cross examination of the Bible library.
//
// The function reads what is really in the app and reports it: how many of
// the 1,189 chapters of the Bible are installed for each translation, which
// chapters cannot be read, where the two translations disagree about the
// number of verses, and how the Strong's numbers stand.
//
// It only reads. It never writes.

const BOOKS = [
  [1, "Genesis", 50], [2, "Exodus", 40], [3, "Leviticus", 27], [4, "Numbers", 36],
  [5, "Deuteronomy", 34], [6, "Joshua", 24], [7, "Judges", 21], [8, "Ruth", 4],
  [9, "1 Samuel", 31], [10, "2 Samuel", 24], [11, "1 Kings", 22], [12, "2 Kings", 25],
  [13, "1 Chronicles", 29], [14, "2 Chronicles", 36], [15, "Ezra", 10], [16, "Nehemiah", 13],
  [17, "Esther", 10], [18, "Job", 42], [19, "Psalms", 150], [20, "Proverbs", 31],
  [21, "Ecclesiastes", 12], [22, "Song of Solomon", 8], [23, "Isaiah", 66], [24, "Jeremiah", 52],
  [25, "Lamentations", 5], [26, "Ezekiel", 48], [27, "Daniel", 12], [28, "Hosea", 14],
  [29, "Joel", 3], [30, "Amos", 9], [31, "Obadiah", 1], [32, "Jonah", 4], [33, "Micah", 7],
  [34, "Nahum", 3], [35, "Habakkuk", 3], [36, "Zephaniah", 3], [37, "Haggai", 2],
  [38, "Zechariah", 14], [39, "Malachi", 4], [40, "Matthew", 28], [41, "Mark", 16],
  [42, "Luke", 24], [43, "John", 21], [44, "Acts", 28], [45, "Romans", 16],
  [46, "1 Corinthians", 16], [47, "2 Corinthians", 13], [48, "Galatians", 6],
  [49, "Ephesians", 6], [50, "Philippians", 4], [51, "Colossians", 4], [52, "1 Thessalonians", 5],
  [53, "2 Thessalonians", 3], [54, "1 Timothy", 6], [55, "2 Timothy", 4], [56, "Titus", 3],
  [57, "Philemon", 1], [58, "Hebrews", 13], [59, "James", 5], [60, "1 Peter", 5],
  [61, "2 Peter", 3], [62, "1 John", 5], [63, "2 John", 1], [64, "3 John", 1],
  [65, "Jude", 1], [66, "Revelation", 22]
];

const CHAPTERS = BOOKS.flatMap(([number, name, chapters]) =>
  Array.from({ length: chapters }, (unused, index) => ({
    book_number: number,
    book: name,
    chapter: index + 1
  }))
);

/** Reads every row of an entity, page by page. */
const readAll = async (entity) => {
  const rows = [];
  const seen = new Set();
  const pageSize = 500;
  let offset = 0;
  for (let page = 0; page < 60; page += 1) {
    let batch = [];
    try {
      batch = await entity.list("created_date", pageSize, offset);
    } catch {
      batch = [];
    }
    if (!batch || !batch.length) break;
    let fresh = 0;
    for (const row of batch) {
      if (!row || seen.has(row.id)) continue;
      seen.add(row.id);
      rows.push(row);
      fresh += 1;
    }
    if (!fresh) break;
    if (batch.length < pageSize) break;
    offset += batch.length;
  }
  return rows;
};

/**
 * Reads the verses out of a stored chapter.
 * A copy can be a list of lines, a list written out with the line breaks
 * in it, or a list kept as text: all three are read here.
 */
const readVerses = (raw) => {
  const value = String(raw || "").trim();
  if (!value) return [];

  if (value.startsWith("[")) {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        const list = parsed
          .map((row) => ({
            verse: Number(row && (row.verse !== undefined ? row.verse : row.number)),
            text: String((row && (row.text !== undefined ? row.text : row.content)) || "")
          }))
          .filter((verse) => Number.isFinite(verse.verse) && verse.text);
        if (list.length) return list;
      }
    } catch {
      // The copy is not a list after all.
    }
  }

  const verses = [];
  for (const line of value.split(/\r\n|\r|\n|\\n/)) {
    const match = line.match(/^\s*(\d+)\s*(\\t|\t)(.*)$/s);
    if (!match) continue;
    verses.push({ verse: Number(match[1]), text: match[3] });
  }
  return verses;
};

/** Says how a stored chapter stands. */
const chapterState = (row, expectMarkers) => {
  const verses = readVerses(row.verses);
  if (!verses.length) return { state: "unreadable", verses: 0, numbers: [], stored: Number(row.verse_count || 0) };
  const numbers = verses.map((verse) => verse.verse);
  let inOrder = true;
  for (let index = 0; index < numbers.length; index += 1) {
    if (numbers[index] !== index + 1) inOrder = false;
  }
  const marked = /\([GH]\d{1,5}\)/.test(String(row.verses || ""));
  if (expectMarkers && !marked) return { state: "broken", verses: verses.length, numbers, stored: Number(row.verse_count || 0) };
  if (!inOrder) return { state: "broken", verses: verses.length, numbers, stored: Number(row.verse_count || 0) };
  if (row.verse_count && Number(row.verse_count) !== verses.length) {
    return { state: "broken", verses: verses.length, numbers, stored: Number(row.verse_count || 0) };
  }
  return { state: "ready", verses: verses.length, numbers, stored: Number(row.verse_count || 0) };
};

/**
 * The plain Bible text, kept one verse at a time.
 * It is counted apart from the chapter copies, because it is stored verse
 * by verse: the report says how many chapters carry English text, how many
 * carry Luganda text, and how many chapters have nothing yet.
 */
const auditPlainText = (rows) => {
  const chapters = new Map();
  let verses = 0;
  let withoutEnglish = 0;
  let withoutLuganda = 0;
  for (const row of rows || []) {
    const key = `${row.book_number}:${row.chapter}`;
    const entry = chapters.get(key) || { english: 0, luganda: 0 };
    const english = String(row.text_en || "").trim();
    const luganda = String(row.text_lu || "").trim();
    if (english) {
      entry.english += 1;
      verses += 1;
    } else withoutEnglish += 1;
    if (luganda) entry.luganda += 1;
    else withoutLuganda += 1;
    chapters.set(key, entry);
  }
  let missing = 0;
  let emptyEnglish = 0;
  let emptyLuganda = 0;
  for (const [number, name, count] of BOOKS) {
    for (let chapter = 1; chapter <= count; chapter += 1) {
      const entry = chapters.get(`${number}:${chapter}`);
      if (!entry || (!entry.english && !entry.luganda)) {
        missing += 1;
        continue;
      }
      if (!entry.english) emptyEnglish += 1;
      if (!entry.luganda) emptyLuganda += 1;
    }
  }
  return {
    total: CHAPTERS.length,
    chapters: chapters.size,
    missing,
    verses,
    without_english: withoutEnglish,
    without_luganda: withoutLuganda,
    chapters_without_english: emptyEnglish,
    chapters_without_luganda: emptyLuganda
  };
};

/** The audit of one translation. */
const auditTranslation = (rows, expectMarkers) => {
  const byChapter = new Map();
  const duplicates = [];
  for (const row of rows) {
    const key = `${row.book_number}:${row.chapter}`;
    if (byChapter.has(key)) {
      duplicates.push(key);
      const kept = byChapter.get(key);
      const keptTime = new Date(kept.updated_date || kept.created_date || 0).getTime();
      const rowTime = new Date(row.updated_date || row.created_date || 0).getTime();
      if (rowTime >= keptTime) byChapter.set(key, row);
    } else {
      byChapter.set(key, row);
    }
  }

  const books = [];
  let ready = 0;
  let broken = 0;
  let missing = 0;
  const brokenChapters = [];

  for (const book of BOOKS) {
    const [number, name, chapters] = book;
    let bookReady = 0;
    let bookBroken = 0;
    let bookMissing = 0;
    for (let chapter = 1; chapter <= chapters; chapter += 1) {
      const row = byChapter.get(`${number}:${chapter}`);
      if (!row) {
        missing += 1;
        bookMissing += 1;
        continue;
      }
      const state = chapterState(row, expectMarkers);
      if (state.state === "ready") {
        ready += 1;
        bookReady += 1;
      } else {
        broken += 1;
        bookBroken += 1;
        brokenChapters.push({
          book_number: number,
          book: name,
          chapter,
          state: state.state,
          verses: state.verses,
          stored: state.stored
        });
      }
    }
    books.push({
      number,
      name,
      chapters,
      ready: bookReady,
      broken: bookBroken,
      missing: bookMissing
    });
  }

  return {
    total: CHAPTERS.length,
    installed: byChapter.size,
    ready,
    broken,
    missing,
    duplicates: duplicates.length,
    duplicate_chapters: duplicates.slice(0, 50),
    broken_chapters: brokenChapters.slice(0, 200),
    books
  };
};

Deno.serve(async (req) => {
  try {
    const body = await req.json().catch(() => ({}));
    const action = String(body.action || "status");

    // The exact shape of one stored chapter, so a fault in the copy can be
    // seen instead of guessed.
    if (action === "sample") {
      const entity =
        String(body.translation || "luganda") === "kjvp"
          ? fse2.entities.KjvPlusChapter
          : fse2.entities.LugandaChapter;
      const rows = await entity.filter({
        book_number: Number(body.book_number || 43),
        chapter: Number(body.chapter || 3)
      });
      const row = (rows || [])[0];
      if (!row) return Response.json({ found: false });
      const raw = String(row.verses || "");
      return Response.json({
        found: true,
        id: row.id,
        book_number: row.book_number,
        chapter: row.chapter,
        verse_count: row.verse_count,
        length: raw.length,
        head: raw.slice(0, 140),
        codes: Array.from(raw.slice(0, 40)).map((character) => character.charCodeAt(0)),
        verses: readVerses(raw).length,
        fields: Object.keys(row)
      });
    }

    const kjvRows = await readAll(fse2.entities.KjvPlusChapter);
    const lugandaRows = await readAll(fse2.entities.LugandaChapter);
    const plainRows = await readAll(fse2.entities.BibleVerse);

    const kjv = auditTranslation(kjvRows, true);
    const luganda = auditTranslation(lugandaRows, false);

    // The two translations must agree about the number of verses of a
    // chapter: where they do not, one of the two copies is not whole.
    const kjvCounts = new Map();
    for (const row of kjvRows) {
      kjvCounts.set(`${row.book_number}:${row.chapter}`, readVerses(row.verses).length);
    }
    const disagreements = [];
    for (const row of lugandaRows) {
      const key = `${row.book_number}:${row.chapter}`;
      const other = kjvCounts.get(key);
      const here = readVerses(row.verses).length;
      if (other !== undefined && other !== here) {
        disagreements.push({ chapter: key, kjv: other, luganda: here });
      }
    }

    // The Strong's numbers that the installed text really uses.
    const used = new Set();
    for (const row of kjvRows) {
      const found = String(row.verses || "").match(/\((G|H)\d{1,5}\)/g) || [];
      for (const item of found) used.add(item.replace(/[()]/g, ""));
    }
    const cachedRows = await readAll(fse2.entities.StrongEntry);
    const cached = new Set(cachedRows.map((row) => String(row.code || "").toUpperCase()));
    const missingCodes = [...used].filter((code) => !cached.has(code)).sort();

    return Response.json({
      status: "ok",
      kjv,
      luganda,
      plain: auditPlainText(plainRows),
      disagreements: disagreements.slice(0, 100),
      disagreement_count: disagreements.length,
      strongs: {
        used: used.size,
        cached: used.size - missingCodes.length,
        missing: missingCodes.length,
        missing_codes: missingCodes.slice(0, 100),
        entries: cachedRows.length
      }
    });
  } catch (error) {
    return Response.json({ status: "error", error: error.message }, { status: 500 });
  }
});