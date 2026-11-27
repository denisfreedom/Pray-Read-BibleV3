import { fse2 } from "@/api/fse2Client";
import { fetchPublicCollection } from "@/lib/contentApi";
import { BIBLE_BOOKS } from "@/lib/bibleBooks";
import { bilingualText, textValue } from "@/lib/bilingual";
import { resolveBook, parseReference } from "@/lib/scriptureRefs";
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
// Only invalid structure, missing essential prayer text, and invalid
// coordinates stop an import. Missing translations and cross-reference
// coverage are warnings, and the rest of the file is imported all the same.

export const PRAYER_FILE_FORMAT = "pray-read-prayer-crossrefs-v1";
export const BACKFILL_FILE_FORMAT = "pray-read-crossrefs-backfill-v1";
export const TEMPLATE_URL = "/assets/media-library/0dbaf742d3ba_Prayer-Crossrefs-Template.json";
export const FILE_FIELDS = { file: ["prayers", "cross_references", "chapter_intros", "book_intro"] };

export const bookNameFor = (bookNumber) => {
  const book = BIBLE_BOOKS.find((item) => Number(item.number) === Number(bookNumber));
  return book ? book.name : "";
};

const safeText = (value) => {
  if (value === null || value === undefined) return "";
  if (typeof value === "object") return textValue(value);
  return textValue(value);
};

const localizedText = (value, language, fallback = "") => {
  if (value && typeof value === "object" && !Array.isArray(value)) return bilingualText(value, language, fallback);
  return language === "lu" ? asText(fallback) : (asText(value) || asText(fallback));
};

const asNumber = (value) => {
  if (value === null || value === undefined || value === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};
const asText = (value) => safeText(value);
const list = async (entity, book) => {
  const wanted = Number(book);
  const collection = {
    PrayerPassage: "prayerPassages",
    CrossReference: "crossReferences",
    ChapterIntro: "chapterIntros",
    BookIntro: "bookIntros"
  }[entity];
  try {
    const rows = await fetchPublicCollection(collection, { authenticated: true });
    const exact = (rows || []).filter((row) => Number(row.book_number) === wanted);
    if (exact.length) return exact;
    const named = (rows || []).filter((row) => resolveBook(row.book_name ?? row.book)?.number === wanted);
    if (named.length) return named;
  } catch {
    // Fall through to a bounded direct entity query.
  }
  try {
    const rows = await fse2.entities[entity].filter({ book_number: wanted }, "-updated_date", 1000);
    return (rows || []).filter((row) => Number(row.book_number) === wanted || resolveBook(row.book_name ?? row.book)?.number === wanted);
  } catch {
    return [];
  }
};

export const isBackfillFile = (payload) =>
  payload && payload.format === BACKFILL_FILE_FORMAT && Array.isArray(payload.cross_references);

const normalizeRangeDashes = (value) => String(value || "").replace(/[\u2010-\u2015\u2212\uFE58\uFE63\uFF0D]/g, "-");

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

/** Checks a flat prayer file and returns blocking errors separately from warnings. */
export const validatePrayerFile = (payload) => {
  const errors = [];
  const warnings = [];
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return { ok: false, errors: ["The file must contain a JSON object."], warnings: [], rows: null, coverage: [] };
  }
  if (isBackfillFile(payload)) {
    const namedBook = resolveBook(payload.book_name ?? payload.bookName);
    const book = namedBook?.number || asNumber(payload.book_number ?? payload.bookNumber);
    const refs = payload.cross_references;
    if (!book || book < 1 || book > 66) errors.push("A backfill file needs a valid book_number from 1 to 66.");
    if (!refs.length) warnings.push("This file has no cross-references. The reader fetches them live when they are missing.");
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
  if (format && format !== PRAYER_FILE_FORMAT && format !== BACKFILL_FILE_FORMAT && format !== "pray-read-book-v1") errors.push(`The file format must be "${PRAYER_FILE_FORMAT}".`);
  const hasBookShape = isBookFile(payload);
  const suppliedBookName = asText(payload.book_name ?? payload.bookName ?? payload.metadata?.book_name ?? payload.book_name ?? payload.book);
  const suppliedNumberBook = asNumber(payload.book_number ?? payload.bookNumber ?? payload.metadata?.book_number);
  const numberedBookName = suppliedNumberBook ? bookNameFor(suppliedNumberBook) : "";
  const resolvedBook = suppliedBookName ? resolveBook(suppliedBookName) : null;
  const resolvedNumberName = numberedBookName ? resolveBook(numberedBookName) : null;
  const expandedBook = hasBookShape ? bookFileCollections(payload).expanded : null;
  const bookNumber = resolvedBook?.number || resolvedNumberName?.number || suppliedNumberBook || expandedBook?.book_number;
  const bookName = resolvedBook?.name || resolvedNumberName?.name || bookNameFor(bookNumber);
  if (!bookNumber || bookNumber < 1 || bookNumber > 66) errors.push("The file needs a valid book_number from 1 to 66.");
  if (!bookNumber && hasBookShape) errors.push("The file needs a valid Bible book.");
  if (hasBookShape && bookNumber) {
    const expanded = bookFileCollections(payload).expanded;
    if (expanded.book_number !== Number(bookNumber)) errors.push("The file's book could not be resolved consistently.");
  }
  const rawPrayers = payload.prayers ?? payload.prayer_passages ?? payload.passages ?? (hasBookShape ? expandedBook?.prayers : undefined);
  const rawRefs = payload.cross_references ?? payload.crossReferences ?? (hasBookShape ? expandedBook?.crossReferences : undefined);
  if ((!Array.isArray(rawPrayers) || !rawPrayers.length) && (!Array.isArray(rawRefs) || !rawRefs.length) && !hasBookShape) {
    errors.push("The file needs prayer rows or a cross-reference backfill.");
  }
  if (!Array.isArray(rawRefs) || !rawRefs.length) {
    warnings.push("This file has no cross-references. The reader fetches them live when they are missing.");
  }
  const prayers = (Array.isArray(rawPrayers) ? rawPrayers : [])
    .map((row, index) => normalizePrayerRow(row, bookNumber, bookName, index, errors, warnings))
    .filter(Boolean);
  if (hasBookShape) prayers.splice(0, prayers.length, ...(expandedBook?.prayers || []));
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
  if (hasBookShape) crossReferences.splice(0, crossReferences.length, ...(expandedBook?.crossReferences || []));
  const rawChapterRows = Array.isArray(payload.chapter_intros ?? payload.chapterIntros)
    ? payload.chapter_intros ?? payload.chapterIntros
    : [];
  const chapterRows = rawChapterRows.map((row, index) => normalizeChapterIntroRow(row, bookNumber, bookName, index, errors, warnings));
  if (hasBookShape) chapterRows.splice(0, chapterRows.length, ...(expandedBook?.chapterIntros || []));
  if (hasBookShape) {
    const rawChapters = Array.isArray(payload.chapters) ? payload.chapters : [];
    rawChapters.forEach((chapter, index) => {
      const closing = chapter?.closing_prayer ?? chapter?.chapter_closing_prayer ?? chapter?.closing_prayer_en;
      if (!closing) return;
      const explicitChapter = asNumber(chapter.chapter ?? chapter.chapter_number);
      const normalized = normalizeChapterIntroRow({ chapter: explicitChapter, closing_prayer: closing }, bookNumber, bookName, index, errors, warnings);
      if (normalized?.closing) chapterRows.push(normalized);
    });
  }
  const chapterIntros = chapterRows.filter((row) => row && (row.intro_en || row.intro_lu || row.title_en || row.title_lu));
  // Chapter closing prayers are stored as passages without verse coordinates.
  chapterRows.forEach((row) => {
    if (!row || !row.closing || (!row.closing.prayer_en && !row.closing.prayer_lu)) return;
    if (row.closing.prayer_en && !row.closing.prayer_lu) {
      warnings.push(`The closing prayer of ${bookName} ${row.chapter} has no Luganda text yet. The Luganda column was left empty.`);
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
  const rawBookIntro = payload.book_intro ?? payload.bookIntro ?? (payload.introduction || payload.book_introduction || payload.intro_en || payload.intro_lu || payload.introduction_lu || payload.introduction_luganda || payload.closing_prayer || payload.book_closing_prayer ? payload : null);
  const bookIntro = hasBookShape ? expandedBook?.bookIntro : normalizeBookIntroRow(rawBookIntro, bookNumber, bookName);
  if (hasBookShape) {
    const expanded = expandedBook;
    if (expanded.bookIntro && (expanded.bookIntro.closing_prayer_en || expanded.bookIntro.closing_prayer_lu)) {
      prayers.push({
        book_number: expanded.book_number,
        book_name: expanded.book_name,
        chapter: null,
        verse: null,
        verse_end: null,
        title_en: expanded.bookIntro.closing_title_en || "",
        title_lu: expanded.bookIntro.closing_title_lu || "",
        prayer_en: expanded.bookIntro.closing_prayer_en,
        prayer_lu: expanded.bookIntro.closing_prayer_lu,
        scripture_ref: expanded.book_name,
        source: "book_import:book_closing"
      });
    }
    warnings.push(...expanded.warnings.map((warning) => warning.message));
  }
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
  const chapter = asNumber(row.chapter ?? row.chapter_number ?? row.chapterNumber);
  const verse = asNumber(row.verse ?? row.verse_number ?? row.verseNumber);
  const rawVerseEnd = row.verse_end ?? row.verseEnd ?? row.verse_end_number;
  const verseEnd = typeof rawVerseEnd === "string" ? asNumber(rawVerseEnd.trim().replace(/^[\-\u2010-\u2015\u2212\uFE58\uFE63\uFF0D]\s*/, "")) : asNumber(rawVerseEnd);
  const prayerSource = row.pray_read ?? row.pay_read ?? row.prayRead ?? row.payRead ?? row.prayer_read ?? row.prayer ?? row.prayer_en ?? row.prayerEn;
  const prayer_en = localizedText(prayerSource, "en", row.prayer_en ?? row.pray_read_en ?? row.pay_read_en);
  const prayer_lu = localizedText(
    prayerSource,
    "lu",
    row.pray_read_luganda ?? row.pay_read_luganda ?? row.prayer_lu ?? row.prayerLu ?? row.prayer_read_luganda ?? row.prayer_luganda
  );
  if (!chapter) errors.push(`Prayer ${index + 1}: the chapter is required.`);
  if (verseEnd !== null && (verse === null || verseEnd < verse)) {
    errors.push(`Prayer ${index + 1}: verse_end must be at or after verse.`);
  }
  if (!prayer_en && !prayer_lu) {
    warnings.push(`Prayer ${index + 1}: no prayer text was supplied, so this row was skipped.`);
    return null;
  }
  if (!prayer_lu) {
    warnings.push(`Prayer ${index + 1}: there is no Luganda prayer text yet. The Luganda column was left empty.`);
  }
  return {
    book_number: Number(bookNumber),
    book_name: bookName,
    chapter,
    verse,
    verse_end: verseEnd,
    title_en: localizedText(row.title_en ?? row.titleEn ?? row.title, "en"),
    title_lu: localizedText(row.title_lu ?? row.titleLu ?? row.title_luganda, "lu"),
    prayer_en,
    prayer_lu,
    scripture_ref: asText(row.scripture_ref ?? row.scriptureRef ?? row.passage),
    source: asText(row.source)
  };
}

function normalizeCrossRefRow(row, bookNumber, bookName, index, errors, warnings) {
  const bareReference = typeof row === "string" ? row : "";
  if (typeof row === "string") row = { reference: row, book_number: bookNumber, book_name: bookName };
  if (!row || typeof row !== "object" || Array.isArray(row)) {
    errors.push(`Cross-reference ${index + 1}: expected an object.`);
    return null;
  }
  const refTextSource = row.ref_text_en ?? row.refTextEn ?? row.text_en;
  const refText = {
    en: localizedText(refTextSource, "en", ""),
    lu: localizedText(row.ref_text_lu ?? row.refTextLu ?? row.text_lu, "lu", "")
  };
  const note = {
    en: localizedText(row.note_en ?? row.noteEn ?? row.note ?? row.notes, "en", ""),
    lu: localizedText(row.note_lu ?? row.noteLu ?? row.note_luganda ?? row.notes_luganda, "lu", "")
  };
  const targetBookName = asText(row.ref_book_name ?? row.ref_book ?? row.target_book);
  const resolvedTarget = targetBookName ? resolveBook(targetBookName) : null;
  const numberedTarget = asNumber(row.ref_book_number ?? row.refBookNumber);
  const sourceBookName = asText(row.book_name ?? row.book);
  const resolvedSource = sourceBookName ? resolveBook(sourceBookName) : null;
  const writtenReference = normalizeRangeDashes(asText(row.reference_text ?? row.reference ?? row.label ?? row.ref ?? row.scripture_ref ?? (row.ref_book_name || row.ref_book || row.ref_book_number ? [row.ref_book_name ?? row.ref_book ?? bookNameFor(row.ref_book_number), row.ref_chapter, row.ref_verse ? `${row.ref_verse}${row.ref_verse_end && row.ref_verse_end !== row.ref_verse ? `-${row.ref_verse_end}` : ""}` : null].filter(Boolean).join(" ") : "")));
  const normalizedReference = writtenReference;
  const parsedReference = normalizedReference ? parseReference(normalizeRangeDashes(normalizedReference)) : null;
  const sourceLocation = parseReference(normalizeRangeDashes(asText(row.source_reference ?? row.source_ref ?? row.passage_reference)));
  const sourceBookNumber = resolvedSource?.number || sourceLocation?.bookNumber || asNumber(row.book_number ?? row.bookNumber) || Number(bookNumber);
  const shorthandTarget = !parsedReference && bareReference.match(/^(\d{1,3})(?::(\d{1,3}))?(?:\s*[-:]\s*(\d{1,3}))?$/);
  const sourceChapter = asNumber(row.chapter ?? row.chapter_number ?? row.chapterNumber ?? row.source_chapter ?? row.sourceChapter) || sourceLocation?.chapter || (shorthandTarget && shorthandTarget[2] ? Number(shorthandTarget[1]) : null);
  const sourceVerse = asNumber(row.verse ?? row.verse_number ?? row.verseNumber ?? row.source_verse ?? row.sourceVerse) || sourceLocation?.verse || (shorthandTarget && shorthandTarget[2] ? Number(shorthandTarget[2]) : null);
  const shorthandChapter = shorthandTarget ? (shorthandTarget[2] ? Number(shorthandTarget[1]) : sourceChapter) : null;
  const shorthandVerse = shorthandTarget ? Number(shorthandTarget[2] || shorthandTarget[1]) : null;
  const values = {
    book_number: sourceBookNumber,
    book_name: resolvedSource?.name || (sourceLocation ? bookNameFor(sourceLocation.bookNumber) : bookName),
    chapter: sourceChapter,
    verse: sourceVerse,
    ref_book_number: resolvedTarget?.number || numberedTarget || parsedReference?.bookNumber || null,
    ref_chapter: asNumber(row.ref_chapter ?? row.refChapter) || parsedReference?.chapter || shorthandChapter || null,
    ref_verse: asNumber(row.ref_verse ?? row.refVerse) || parsedReference?.verse || shorthandVerse || null,
    ref_verse_end: asNumber(row.ref_verse_end ?? row.refVerseEnd) || parsedReference?.endVerse || (shorthandTarget?.[3] ? Number(shorthandTarget[3]) : null),
    reference_text: writtenReference,
    unresolved: !(resolvedTarget || (numberedTarget && bookNameFor(numberedTarget))) && !parsedReference && !shorthandTarget,
    ref_text_en: refText.en,
    ref_text_lu: refText.lu,
    note_en: note.en,
    note_lu: note.lu,
    source: asText(row.source)
  };
  if (values.book_number === null || values.book_number <= 0 || values.chapter === null || values.chapter <= 0 || values.verse === null || values.verse <= 0) {
    errors.push(`Cross-reference ${index + 1}: source book/chapter/verse coordinates are required.`);
    return null;
  }
  if (!values.ref_book_number || !values.ref_chapter || !values.ref_verse) {
    values.unresolved = true;
    const detail = writtenReference || "no target reference text";
    warnings.push(`Cross-reference ${index + 1}: target coordinates could not be resolved (${detail}). Supplied reference text and notes were preserved; add valid coordinates to make it navigable.`);
  }
  if (!values.ref_text_en || !values.ref_text_lu || !values.note_en || !values.note_lu) {
    warnings.push(`Cross-reference ${index + 1}: ref_text_en, ref_text_lu, note_en, and note_lu are not all filled in. The verse text is fetched live when it is missing.`);
  }
  return values;
}

function normalizeChapterIntroRow(row, bookNumber, bookName, index, errors, warnings) {
  const source = typeof row === "string" ? { introduction: row } : row;
  if (!source || typeof source !== "object" || Array.isArray(source)) {
    errors.push(`Chapter introduction ${index + 1}: expected an object.`);
    return null;
  }
  const chapter = asNumber(source.chapter ?? source.chapter_number ?? source.chapterNumber);
  if (!chapter) {
    errors.push(`Chapter introduction ${index + 1}: the chapter is required.`);
    return null;
  }
  const introSource = source.introduction ?? source.intro_en ?? source.intro;
  const intro = {
    en: localizedText(introSource, "en", source.intro_en ?? source.introduction_en),
    lu: localizedText(introSource, "lu", source.intro_lu ?? source.introduction_lu ?? source.introduction_luganda)
  };
  if (intro.en && !intro.lu) {
    warnings.push(`The introduction of ${bookName} ${chapter} has no Luganda text yet. The Luganda column was left empty.`);
  }
  const closingObject = source.closing_prayer && typeof source.closing_prayer === "object" ? source.closing_prayer : null;
  const closingSource = source.closing_prayer ?? source.chapter_closing_prayer ?? source.closing_prayer_en ?? source.chapter_closing_prayer_en;
  const closing = {
    en: localizedText(closingSource, "en", source.closing_prayer_en ?? source.chapter_closing_prayer_en),
    lu: localizedText(closingSource, "lu", source.closing_prayer_lu ?? source.closing_prayer_luganda ?? source.chapter_closing_prayer_lu)
  };
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
            title_en: asText(closingObject?.title_en ?? closingObject?.title ?? source.closing_prayer_title_en),
            title_lu: asText(closingObject?.title_lu ?? closingObject?.title_luganda ?? source.closing_prayer_title_lu),
            prayer_en: closing.en,
            prayer_lu: closing.lu
          }
        : null
  };
}

function normalizeBookIntroRow(raw, bookNumber, bookName) {
  if (raw === null || raw === undefined) return null;
  const source = typeof raw === "string" ? { introduction: raw } : raw;
  if (typeof source !== "object" || Array.isArray(source)) return null;
  const introSource = source.introduction ?? source.intro_en ?? source.intro;
  const intro = {
    en: localizedText(introSource, "en", source.intro_en ?? source.introduction_en),
    lu: localizedText(introSource, "lu", source.intro_lu ?? source.introduction_lu ?? source.introduction_luganda)
  };
  const closingSource = source.closing_prayer ?? source.book_closing_prayer ?? source.closing_prayer_en ?? source.book_closing_prayer_en;
  const closing = {
    en: localizedText(closingSource, "en", source.closing_prayer_en ?? source.book_closing_prayer_en),
    lu: localizedText(closingSource, "lu", source.closing_prayer_lu ?? source.closing_prayer_luganda ?? source.book_closing_prayer_lu)
  };
  return {
    book_number: Number(bookNumber),
    book_name: bookName,
    title_en: asText(source.title_en ?? source.title),
    title_lu: asText(source.title_lu ?? source.title_luganda),
    intro_en: intro.en,
    intro_lu: intro.lu,
    closing_title_en: asText((source.closing_prayer && typeof source.closing_prayer === "object" ? source.closing_prayer.title_en ?? source.closing_prayer.title : null) ?? source.closing_prayer_title_en),
    closing_title_lu: asText((source.closing_prayer && typeof source.closing_prayer === "object" ? source.closing_prayer.title_lu ?? source.closing_prayer.title_luganda : null) ?? source.closing_prayer_title_lu),
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

/** The shape of a file: "prayer", "book" or nothing at all. */
export const importShapeOf = (parsed) => {
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;
  const format = parsed.format || parsed.metadata?.format;
  if (format === PRAYER_FILE_FORMAT || format === BACKFILL_FILE_FORMAT || Array.isArray(parsed.prayers) || Array.isArray(parsed.prayer_passages) || Array.isArray(parsed.cross_references) || Array.isArray(parsed.crossReferences)) return "prayer";
  if (isBookFile(parsed)) return "prayer";
  return null;
};

/** Prepares either file shape into the collections it fills. */
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

/** Writes a prepared file, updating rows with matching natural keys. */
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