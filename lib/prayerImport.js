import { fse2 } from "@/api/fse2Client";
import { BIBLE_BOOKS } from "@/lib/bibleBooks";
import { bilingualPair, bilingualText, lugandaFieldText } from "@/lib/bilingual";
import {
  crossRefNaturalKey,
  normaliseCrossRef,
  normalisePassage,
  passageNaturalKey
} from "@/lib/prayerPassages";
import { chapterIntroNaturalKey, normaliseChapterIntro } from "@/lib/chapterIntros";
import { bookIntroNaturalKey, normaliseBookIntro } from "@/lib/bookIntro";
import { bookFileCollections, CHAPTER_CLOSING_SOURCE, isBookFile } from "@/lib/bookImport";

// The prayer passage files.
//
// Two shapes are read here, and they are read the same way:
//   - the flat file, "pray-read-prayer-crossrefs-v1";
//   - the book file, one book with its chapters and its verses.
//
// Both shapes are expanded into the same four collections, with the same
// field names, so a book that was imported through one admin tab is
// updated, and never duplicated, when it is imported through the other one.
//
// Only three things stop a file: it is not a file of either shape, it does
// not name a book of the Bible, or a row is missing a coordinate. Everything
// else - a missing translation, a cross-reference without words, a prayer
// with too few cross-references - is a warning, and the rest of the file is
// imported all the same.

export const PRAYER_FILE_FORMAT = "pray-read-prayer-crossrefs-v1";
export const BACKFILL_FILE_FORMAT = "pray-read-crossrefs-backfill-v1";
export const TEMPLATE_URL = "/assets/media-library/0dbaf742d3ba_Prayer-Crossrefs-Template.json";
export const FILE_FIELDS = { file: ["prayers", "cross_references", "chapter_intros", "book_intro"] };

export const bookNameFor = (bookNumber) => {
  const book = BIBLE_BOOKS.find((item) => Number(item.number) === Number(bookNumber));
  return book ? book.name : "";
};

const asNumber = (value) => {
  if (value === null || value === undefined || value === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};
const asText = (value) => (value === null || value === undefined ? "" : String(value).trim());
const list = (entity, book) => fse2.entities[entity].filter({ book_number: Number(book) });

export const isBackfillFile = (payload) =>
  payload && payload.format === BACKFILL_FILE_FORMAT && Array.isArray(payload.cross_references);

const prayerRef = (prayer, index, bookName) => {
  const range = prayer.verse_end ? `${prayer.verse}-${prayer.verse_end}` : prayer.verse || "chapter";
  return `${bookName || `Book ${prayer.book_number}`} ${prayer.chapter}:${range}`;
};

const covers = (prayer, ref) => {
  if (Number(prayer.book_number) !== Number(ref.book_number) || Number(prayer.chapter) !== Number(ref.chapter)) return false;
  if (prayer.verse == null || prayer.verse === "") return true;
  const verse = Number(ref.verse);
  return verse >= Number(prayer.verse) && verse <= Number(prayer.verse_end || prayer.verse);
};

/** How many cross-references every prayer needs. */
export const coverageMinimum = (prayer) =>
  prayer.verse == null ? 3 : prayer.verse_end != null && prayer.verse_end !== prayer.verse ? 3 : 2;

/** The cross-references that cover every prayer of the file. */
export const coverageOf = (prayers, crossReferences) =>
  (prayers || []).map((prayer, index) => {
    const matched = (crossReferences || []).filter((ref) => covers(prayer, ref));
    const minimum = coverageMinimum(prayer);
    return { index, prayer, count: matched.length, minimum, ok: matched.length >= minimum };
  });

/**
 * Checks a flat prayer file.
 *
 * The words of every field are read through the shared bilingual resolver,
 * so an English-only file leaves the Luganda column empty instead of
 * copying the English words into it.
 */
export const validatePrayerFile = (payload) => {
  const errors = [];
  const warnings = [];
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return { ok: false, errors: ["The file must contain a JSON object."], warnings: [], rows: null, coverage: [] };
  }
  if (isBackfillFile(payload)) {
    const book = asNumber(payload.book_number);
    const refs = payload.cross_references;
    if (!book || book < 1 || book > 66) errors.push("A backfill file needs a valid book_number from 1 to 66.");
    if (!refs.length) errors.push("A backfill file needs at least one cross-reference.");
    const crossReferences = refs
      .map((row, index) => normalizeCrossRefRow(row, book, payload.book_name, index, errors, warnings))
      .filter(Boolean);
    return {
      ok: errors.length === 0,
      errors,
      warnings,
      rows: {
        backfillOnly: true,
        bookNumber: book,
        bookName: bookNameFor(book),
        prayers: [],
        crossReferences,
        chapterIntros: [],
        bookIntro: null
      },
      coverage: []
    };
  }
  const format = payload.format || payload.metadata?.format;
  if (format !== PRAYER_FILE_FORMAT) errors.push(`The file format must be "${PRAYER_FILE_FORMAT}".`);
  const bookNumber = asNumber(payload.book_number ?? payload.bookNumber ?? payload.metadata?.book_number);
  const bookName = asText(payload.book_name ?? payload.bookName ?? payload.metadata?.book_name) || bookNameFor(bookNumber);
  if (!bookNumber || bookNumber < 1 || bookNumber > 66) errors.push("The file needs a valid book_number from 1 to 66.");
  const rawPrayers = payload.prayers ?? payload.prayer_passages;
  const rawRefs = payload.cross_references ?? payload.crossReferences;
  if (!Array.isArray(rawPrayers) || (!rawPrayers.length && !(Array.isArray(rawRefs) && rawRefs.length))) {
    errors.push("The file needs prayer rows or a cross-reference backfill.");
  }
  if (!Array.isArray(rawRefs) || !rawRefs.length) {
    warnings.push("This file has no cross-references. The reader fetches them live when they are missing.");
  }
  const prayers = (Array.isArray(rawPrayers) ? rawPrayers : [])
    .map((row, index) => normalizePrayerRow(row, bookNumber, bookName, index, errors, warnings))
    .filter(Boolean);
  const crossReferences = (Array.isArray(rawRefs) ? rawRefs : [])
    .map((row, index) =>
      normalizeCrossRefRow(
        row,
        row?.book_number ?? row?.bookNumber ?? bookNumber,
        bookNameFor(row?.book_number ?? row?.bookNumber ?? bookNumber) || bookName,
        index,
        errors,
        warnings
      )
    )
    .filter(Boolean);
  const chapterRows = (Array.isArray(payload.chapter_intros ?? payload.chapterIntros)
    ? payload.chapter_intros ?? payload.chapterIntros
    : []
  ).map((row, index) => normalizeChapterIntroRow(row, bookNumber, bookName, index, errors, warnings));
  const chapterIntros = chapterRows.filter((row) => row && (row.intro_en || row.intro_lu));
  // The prayer that closes a chapter can also travel inside the chapter
  // row. It becomes a passage of its own, with no verse, like the book
  // shape does.
  chapterRows.forEach((row) => {
    if (!row || !row.closing) return;
    if (!row.closing.prayer_en && !row.closing.prayer_lu) return;
    if (row.closing.prayer_en && !row.closing.prayer_lu) {
      warnings.push(
        `The closing prayer of ${bookName} ${row.chapter} has no Luganda text yet. The Luganda column was left empty.`
      );
    }
    prayers.push({
      book_number: Number(bookNumber),
      book_name: bookName,
      chapter: row.chapter,
      verse: null,
      verse_end: null,
      title_en: row.closing.title_en,
      title_lu: row.closing.title_lu,
      prayer_en: row.closing.prayer_en,
      prayer_lu: row.closing.prayer_lu,
      scripture_ref: `${bookName} ${row.chapter}`,
      source: CHAPTER_CLOSING_SOURCE
    });
  });
  const coverage = coverageOf(prayers, crossReferences);
  coverage.forEach((entry) => {
    if (entry.ok) return;
    warnings.push(
      `Prayer ${entry.index + 1}: ${prayerRef(entry.prayer, entry.index, bookName)} ${
        entry.prayer.title_en ? `"${entry.prayer.title_en}"` : ""
      }  -  ${entry.count} cross-refs found, need at least ${entry.minimum}.`
    );
  });
  const rawBookIntro = payload.book_intro ?? payload.bookIntro;
  const bookIntro = normalizeBookIntroRow(rawBookIntro, bookNumber, bookName);
  return {
    ok: errors.length === 0,
    errors,
    warnings,
    rows: { bookNumber, bookName, prayers, crossReferences, chapterIntros, bookIntro, backfillOnly: false },
    coverage
  };
};

function normalizePrayerRow(row, bookNumber, bookName, index, errors, warnings) {
  if (!row || typeof row !== "object" || Array.isArray(row)) {
    errors.push(`Prayer ${index + 1}: expected an object.`);
    return null;
  }
  const chapter = asNumber(row.chapter);
  const verse = asNumber(row.verse);
  const verseEnd = asNumber(row.verse_end ?? row.verseEnd);
  const prayer_en = bilingualText(
    row.prayer_en ?? row.prayerEn ?? row.prayer_read ?? row.pay_read,
    "en"
  );
  const prayer_lu = lugandaFieldText(
    row.prayer_lu ?? row.prayerLu ?? row.prayer_read_luganda ?? row.pay_read_luganda
  );
  if (!chapter) errors.push(`Prayer ${index + 1}: the chapter is required.`);
  if (verseEnd !== null && (verse === null || verseEnd < verse)) {
    errors.push(`Prayer ${index + 1}: verse_end must be at or after verse.`);
  }
  if (!prayer_en && !prayer_lu) {
    warnings.push(`Prayer ${index + 1}: there is no prayer text, so the row was left out.`);
    return null;
  }
  if (!prayer_en) {
    warnings.push(`Prayer ${index + 1}: there is no English prayer text yet. The English column was left empty.`);
  } else if (!prayer_lu) {
    warnings.push(`Prayer ${index + 1}: there is no Luganda prayer text yet. The Luganda column was left empty.`);
  }
  return {
    book_number: Number(bookNumber),
    book_name: bookName,
    chapter,
    verse,
    verse_end: verseEnd,
    title_en: asText(row.title_en ?? row.titleEn ?? row.title),
    title_lu: asText(row.title_lu ?? row.titleLu),
    prayer_en,
    prayer_lu,
    scripture_ref: asText(row.scripture_ref ?? row.scriptureRef ?? row.passage),
    source: asText(row.source)
  };
}

function normalizeCrossRefRow(row, bookNumber, bookName, index, errors, warnings) {
  if (!row || typeof row !== "object" || Array.isArray(row)) {
    errors.push(`Cross-reference ${index + 1}: expected an object.`);
    return null;
  }
  const refText = bilingualPair(
    row.ref_text_en ?? row.refTextEn ?? row.text_en,
    row.ref_text_lu ?? row.refTextLu ?? row.text_lu
  );
  const note = bilingualPair(row.note_en ?? row.noteEn, row.note_lu ?? row.noteLu);
  const values = {
    book_number: asNumber(row.book_number ?? row.bookNumber) ?? Number(bookNumber),
    chapter: asNumber(row.chapter),
    verse: asNumber(row.verse),
    ref_book_number: asNumber(row.ref_book_number ?? row.refBookNumber),
    ref_chapter: asNumber(row.ref_chapter ?? row.refChapter),
    ref_verse: asNumber(row.ref_verse ?? row.refVerse),
    ref_verse_end: asNumber(row.ref_verse_end ?? row.refVerseEnd),
    ref_text_en: refText.en,
    ref_text_lu: refText.lu,
    note_en: note.en,
    note_lu: note.lu,
    source: asText(row.source)
  };
  const required = ["book_number", "chapter", "verse", "ref_book_number", "ref_chapter", "ref_verse"];
  if (required.some((key) => values[key] === null || values[key] <= 0)) {
    errors.push(`Cross-reference ${index + 1}: source and target book/chapter/verse coordinates are required.`);
    return null;
  }
  // The words of a cross-reference are read live by the reader when they
  // are missing, so this is a warning and never a block.
  if (!values.ref_text_en || !values.ref_text_lu || !values.note_en || !values.note_lu) {
    warnings.push(
      `Cross-reference ${index + 1}: ref_text_en, ref_text_lu, note_en, and note_lu are not all filled in. The verse text is fetched live when it is missing.`
    );
  }
  return values;
}

function normalizeChapterIntroRow(row, bookNumber, bookName, index, errors, warnings) {
  const source = typeof row === "string" ? { introduction: row } : row;
  if (!source || typeof source !== "object" || Array.isArray(source)) {
    errors.push(`Chapter introduction ${index + 1}: expected an object.`);
    return null;
  }
  const chapter = asNumber(source.chapter);
  if (!chapter) {
    errors.push(`Chapter introduction ${index + 1}: the chapter is required.`);
    return null;
  }
  const intro = bilingualPair(
    source.intro_en ?? source.introduction_en ?? source.introduction,
    source.intro_lu ?? source.introduction_lu ?? source.introduction_luganda
  );
  if (intro.en && !intro.lu) {
    warnings.push(
      `The introduction of ${bookName} ${chapter} has no Luganda text yet. The Luganda column was left empty.`
    );
  }
  const closingObject =
    source.closing_prayer && typeof source.closing_prayer === "object" ? source.closing_prayer : null;
  const closingSource = source.closing_prayer ?? source.closing_prayer_en;
  const closing = bilingualPair(closingSource, source.closing_prayer_lu ?? source.closing_prayer_luganda);
  return {
    book_number: Number(bookNumber),
    book_name: bookName,
    chapter,
    title_en: asText(source.title_en ?? source.title),
    title_lu: asText(source.title_lu),
    intro_en: intro.en,
    intro_lu: intro.lu,
    source: asText(source.source),
    closing:
      closing.en || closing.lu
        ? {
            title_en: asText(closingObject?.title_en ?? closingObject?.title),
            title_lu: asText(closingObject?.title_lu),
            prayer_en: closing.en,
            prayer_lu: closing.lu
          }
        : null
  };
}

function normalizeBookIntroRow(raw, bookNumber, bookName) {
  if (raw === null || raw === undefined) return null;
  const source = typeof raw === "string" ? { intro_en: raw } : raw;
  if (typeof source !== "object" || Array.isArray(source)) return null;
  const intro = bilingualPair(
    source.intro_en ?? source.introduction_en ?? source.introduction,
    source.intro_lu ?? source.introduction_lu ?? source.introduction_luganda
  );
  const closing = bilingualPair(
    source.closing_prayer_en ?? source.closing_prayer,
    source.closing_prayer_lu ?? source.closing_prayer_luganda
  );
  return {
    book_number: Number(bookNumber),
    book_name: bookName,
    title_en: asText(source.title_en ?? source.title),
    title_lu: asText(source.title_lu),
    intro_en: intro.en,
    intro_lu: intro.lu,
    closing_prayer_en: closing.en,
    closing_prayer_lu: closing.lu,
    source: asText(source.source)
  };
}

/** The four collections a prepared file fills. */
const collectionsOfRows = (rows) => {
  const collections = {};
  if (!rows) return collections;
  if (rows.prayers && rows.prayers.length) collections.PrayerPassage = rows.prayers;
  if (rows.crossReferences && rows.crossReferences.length) collections.CrossReference = rows.crossReferences;
  if (rows.chapterIntros && rows.chapterIntros.length) collections.ChapterIntro = rows.chapterIntros;
  if (rows.bookIntro) collections.BookIntro = [rows.bookIntro];
  return collections;
};

/**
 * The shape of a file: "prayer", "book" or nothing at all.
 *
 * The shape is found once, and in one order: the format of the file first,
 * the chapters of a book second.
 */
export const importShapeOf = (parsed) => {
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;
  const format = parsed.format || parsed.metadata?.format;
  if (format === PRAYER_FILE_FORMAT || format === BACKFILL_FILE_FORMAT) return "prayer";
  if (isBookFile(parsed)) return "book";
  return null;
};

/**
 * The one entry point of the import.
 *
 * Both shapes are read here, and both are expanded into the same four
 * collections, so one book is imported the same way through either admin
 * tab, and a book that is imported twice is updated instead of duplicated.
 */
export const prepareImport = (parsed) => {
  const blank = {
    ok: false,
    errors: [],
    warnings: [],
    collections: {},
    bookNumber: 0,
    bookName: "",
    rows: null,
    coverage: [],
    notes: []
  };
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    return { ...blank, errors: ["The file must contain a JSON object."] };
  }
  const shape = importShapeOf(parsed);
  if (shape === "prayer") {
    const validation = validatePrayerFile(parsed);
    const rows = validation.rows;
    if (!validation.ok) {
      return {
        ...blank,
        errors: validation.errors,
        warnings: validation.warnings,
        bookNumber: rows?.bookNumber || 0,
        bookName: rows?.bookName || ""
      };
    }
    return {
      ok: true,
      errors: [],
      warnings: validation.warnings,
      collections: collectionsOfRows(rows),
      bookNumber: rows.bookNumber,
      bookName: rows.bookName,
      rows,
      coverage: validation.coverage,
      notes: [
        `${rows.prayers.length} prayer${rows.prayers.length === 1 ? "" : "s"} and ${
          rows.crossReferences.length
        } cross-reference${rows.crossReferences.length === 1 ? "" : "s"} for ${rows.bookName}.`
      ]
    };
  }
  if (shape === "book") {
    const { collections, expanded } = bookFileCollections(parsed);
    const warnings = expanded.warnings.map((warning) => warning.message);
    if (!expanded.book_number) {
      return {
        ...blank,
        errors: [
          `The book "${asText(parsed.book ?? parsed.book_name) || "(missing)"}" is not one of the 66 books of the Bible.`
        ],
        warnings
      };
    }
    const rows = {
      bookNumber: expanded.book_number,
      bookName: expanded.book_name,
      prayers: expanded.prayers,
      crossReferences: expanded.crossReferences,
      chapterIntros: expanded.chapterIntros,
      bookIntro: expanded.bookIntro,
      backfillOnly: false
    };
    return {
      ok: true,
      errors: [],
      warnings,
      collections,
      bookNumber: expanded.book_number,
      bookName: expanded.book_name,
      rows,
      coverage: coverageOf(rows.prayers, rows.crossReferences),
      notes: expanded.notes
    };
  }
  return {
    ...blank,
    errors: ["The file is not a prayer file and not a book file. Use the template to see the shape."]
  };
};

/** The collections of a flat prayer file, the way the panels used to get them. */
export const prayerCrossRefCollections = (payload) => {
  const prepared = prepareImport(payload);
  return {
    ok: prepared.ok,
    errors: prepared.errors.map((message) => ({ message })),
    warnings: prepared.warnings.map((message) => ({ message })),
    collections: prepared.collections
  };
};

export const prayerTemplateText = () =>
  JSON.stringify(
    {
      format: PRAYER_FILE_FORMAT,
      book_number: 19,
      book_name: "Psalms",
      prayers: [],
      cross_references: [],
      chapter_intros: []
    },
    null,
    2
  );

export const missingCrossRefsTemplateText = (validation) =>
  JSON.stringify(
    {
      format: BACKFILL_FILE_FORMAT,
      book_number: validation?.rows?.bookNumber || 19,
      book_name: validation?.rows?.bookName || "Psalms",
      cross_references: []
    },
    null,
    2
  );

/**
 * Writes a prepared file straight into the app.
 *
 * The rows are matched with the natural key of their collection, so the
 * same file can be written again safely: the rows that are already there
 * are changed, the new ones are added.
 */
export const importPrayerFile = async (payload) => {
  const prepared = prepareImport(payload);
  if (!prepared.ok) throw new Error(prepared.errors.join("\n"));
  const rows = prepared.rows;
  const summary = {
    PrayerPassage: { inserted: 0, updated: 0 },
    CrossReference: { inserted: 0, updated: 0 },
    ChapterIntro: { inserted: 0, updated: 0 },
    BookIntro: { inserted: 0, updated: 0 }
  };
  const wantedBook = rows.bookNumber;
  const importRows = async (entity, records, keyFn) => {
    if (!records.length) return;
    const existing = await list(entity, wantedBook).catch(() => []);
    const index = new Map((existing || []).map((record) => [keyFn(record), record]));
    for (const values of records) {
      const key = keyFn(values);
      const current = index.get(key);
      if (current) {
        if (entity === "CrossReference" && rows.backfillOnly) continue;
        await fse2.entities[entity].update(current.id, values);
        summary[entity].updated += 1;
      } else {
        const created = await fse2.entities[entity].create(values);
        index.set(key, created);
        summary[entity].inserted += 1;
      }
    }
  };
  await importRows("PrayerPassage", rows.prayers, passageNaturalKey);
  await importRows("ChapterIntro", rows.chapterIntros, chapterIntroNaturalKey);
  if (rows.bookIntro) await importRows("BookIntro", [rows.bookIntro], bookIntroNaturalKey);
  await importRows("CrossReference", rows.crossReferences, crossRefNaturalKey);
  return { summary, backfillOnly: rows.backfillOnly, bookNumber: rows.bookNumber };
};

/** What is already in the app for one book. */
export const readImportedContent = async (bookNumber) => {
  const wanted = Number(bookNumber);
  const [passageRows, crossRows, introRows, bookIntroRows] = await Promise.all([
    list("PrayerPassage", wanted).catch(() => []),
    list("CrossReference", wanted).catch(() => []),
    list("ChapterIntro", wanted).catch(() => []),
    list("BookIntro", wanted).catch(() => [])
  ]);
  return {
    passages: (passageRows || []).map(normalisePassage),
    crossReferences: (crossRows || []).map(normaliseCrossRef),
    chapterIntros: (introRows || []).map(normaliseChapterIntro),
    bookIntros: (bookIntroRows || []).map(normaliseBookIntro)
  };
};