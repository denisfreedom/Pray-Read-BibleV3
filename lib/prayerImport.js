import { fse2 } from "@/api/fse2Client";
import { BIBLE_BOOKS } from "@/lib/bibleBooks";
import {
  crossRefNaturalKey,
  normaliseCrossRef,
  normalisePassage,
  passageNaturalKey
} from "@/lib/prayerPassages";
import { chapterIntroNaturalKey, normaliseChapterIntro } from "@/lib/chapterIntros";

// The bulk import of the prayer passages and the cross-references.
//
// One file holds one book. Every prayer and every cross-reference needs
// both languages. The file is checked before anything is written, and the
// same file can be imported again: a record that is already there is
// changed, never copied a second time.
//
// The fields are exactly the ones of the template file. Nothing is renamed
// and nothing is invented.

export const PRAYER_FILE_FORMAT = "pray-read-prayer-crossrefs-v1";

/** The filled sample of the template, kept in the media library. */
export const TEMPLATE_URL =
  "/api/appfiles/public/app_73e21b4aa5684452/assets/media-library/0dbaf742d3ba_Prayer-Crossrefs-Template.json";

/**
 * The empty file the admin fills in, in the exact format the app reads.
 *
 * The template is written here and not only stored as a file, so the file
 * the admin downloads always carries the keys the import understands.
 */
export const PRAYER_FILE_TEMPLATE = {
  format: PRAYER_FILE_FORMAT,
  book_number: 1,
  book_name: "Genesis",
  prayers: [
    {
      chapter: 1,
      verse: 1,
      verse_end: null,
      title_en: "In the beginning, God",
      title_lu: "Mu lubereberye, Katonda",
      prayer_en: "...",
      prayer_lu: "...",
      scripture_ref: "Genesis 1:1"
    }
  ],
  cross_references: [
    {
      chapter: 1,
      verse: 1,
      ref_book_number: 43,
      ref_chapter: 1,
      ref_verse: 1,
      ref_text_en: "In the beginning was the Word...",
      ref_text_lu: "Mu lubereberye Kigambo yaliwo...",
      note_en: "...",
      note_lu: "..."
    }
  ]
};

/** The template as text, ready to be saved as a .json file. */
export const prayerTemplateText = () => `${JSON.stringify(PRAYER_FILE_TEMPLATE, null, 2)}\n`;

/** The keys the file holds, shown in the panel so the format is never a guess. */
export const FILE_FIELDS = {
  file: ["format", "book_number", "book_name", "prayers", "cross_references"],
  prayer: [
    "chapter",
    "verse",
    "verse_end",
    "title_en",
    "title_lu",
    "prayer_en",
    "prayer_lu",
    "scripture_ref"
  ],
  crossReference: [
    "chapter",
    "verse",
    "ref_book_number",
    "ref_chapter",
    "ref_verse",
    "ref_text_en",
    "ref_text_lu",
    "note_en",
    "note_lu"
  ]
};

/** How many records are written in one go. */
export const BATCH_SIZE = 100;

const BOOK_NAMES = BIBLE_BOOKS.reduce((acc, book) => {
  acc[book.number] = book.name;
  return acc;
}, {});

export const bookNameFor = (number) => BOOK_NAMES[Number(number)] || "";

const clean = (value) => (typeof value === "string" ? value.trim() : "");

const asNumber = (value) => {
  if (value === null || value === undefined || value === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

/**
 * Checks one file against the contract.
 *
 * Every problem is collected and shown, and nothing is written while there
 * is a single error: a file that is half right never reaches the reader.
 *
 * The book file does not carry the text of the verses its cross-references
 * point to, so it is read with "lenient": the missing text is then a note
 * and not an error, and a prayer without a title is left without one.
 */
export const validatePrayerFile = (raw, options = {}) => {
  const lenient = Boolean(options.lenient);
  const allowNoTitle = Boolean(options.allowNoTitle);
  const errors = [];
  const warnings = [];
  const file = { book_number: 0, book_name: "" };
  const prayers = [];
  const crossReferences = [];
  const chapterIntros = [];

  // The kind of item a problem belongs to, so the admin is told whether it
  // is a prayer or a cross-reference that has to be fixed.
  let kind = "file";
  const fail = (item, message) => errors.push({ item, message, kind });

  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    fail(0, "The file must hold one JSON object.");
    return { ok: false, errors, warnings, file, prayers, crossReferences, chapterIntros };
  }

  const format = clean(raw.format);
  if (format !== PRAYER_FILE_FORMAT) {
    fail(0, `format "${format || "(missing)"}" is not known, use "${PRAYER_FILE_FORMAT}".`);
  }

  const bookNumber = asNumber(raw.book_number);
  if (bookNumber === null || bookNumber < 1 || bookNumber > 66) {
    fail(0, `book_number ${raw.book_number === undefined ? "(missing)" : raw.book_number} invalid (must be 1..66)`);
  } else {
    file.book_number = bookNumber;
  }

  const bookName = clean(raw.book_name);
  if (!bookName) {
    fail(0, "book_name is missing.");
  } else {
    file.book_name = bookName;
    const expected = bookNameFor(bookNumber);
    if (expected && expected.toLowerCase() !== bookName.toLowerCase()) {
      warnings.push({
        item: 0,
        message: `book_name "${bookName}" does not match book_number ${bookNumber}, which is ${expected}.`
      });
    }
  }

  if (!Array.isArray(raw.prayers)) fail(0, "prayers must be a list.");
  if (!Array.isArray(raw.cross_references)) fail(0, "cross_references must be a list.");

  const prayerRows = Array.isArray(raw.prayers) ? raw.prayers : [];
  const crossRows = Array.isArray(raw.cross_references) ? raw.cross_references : [];
  const seenPassages = new Set();

  kind = "prayer";
  prayerRows.forEach((row, index) => {
    const item = index + 1;
    if (!row || typeof row !== "object") {
      fail(item, "the prayer is not an object.");
      return;
    }
    const chapter = asNumber(row.chapter);
    if (chapter === null || chapter < 1) {
      fail(item, `chapter ${row.chapter === undefined ? "(missing)" : row.chapter} invalid (must be 1 or more).`);
    }
    const verse = asNumber(row.verse);
    if (verse !== null && verse < 1) {
      fail(item, `verse ${row.verse} invalid (use null for the prayer of the whole chapter).`);
    }
    const verseEnd = asNumber(row.verse_end);
    if (verseEnd !== null) {
      if (verseEnd < 1) fail(item, `verse_end ${row.verse_end} invalid (must be 1 or more).`);
      else if (verse !== null && verseEnd < verse) {
        fail(item, `verse_end ${verseEnd} is before verse ${verse}.`);
      }
    }
    if (!clean(row.prayer_en)) fail(item, "prayer_en missing - the English prayer is required");
    // A file may carry the English only. The Luganda section is then left
    // empty, so it can be written later in the content manager.
    if (!clean(row.prayer_lu)) {
      warnings.push({
        item,
        message: "the prayer has no Luganda text yet, it is left empty so you can write it later.",
        kind
      });
    }
    if (!allowNoTitle && !clean(row.title_en) && !clean(row.title_lu)) {
      warnings.push({ item, message: "the prayer has no title in either language.", kind });
    }

    const passage = normalisePassage({
      book_number: bookNumber || 0,
      book_name: bookName,
      chapter: chapter || 0,
      verse: verse || 0,
      verse_end: verseEnd || 0,
      title_en: clean(row.title_en),
      title_lu: clean(row.title_lu),
      prayer_en: clean(row.prayer_en),
      prayer_lu: clean(row.prayer_lu),
      scripture_ref: clean(row.scripture_ref)
    });
    const key = passageNaturalKey(passage);
    if (seenPassages.has(key)) {
      warnings.push({ item, message: "this prayer is already in the file, only the last one is kept.", kind });
    }
    seenPassages.add(key);
    prayers.push({
      book_number: passage.book_number,
      book_name: passage.book_name,
      chapter: passage.chapter,
      verse: passage.verse === null ? 0 : passage.verse,
      verse_end: passage.verse_end === null ? 0 : passage.verse_end,
      title_en: passage.title_en,
      title_lu: passage.title_lu,
      prayer_en: passage.prayer_en,
      prayer_lu: passage.prayer_lu,
      scripture_ref: passage.scripture_ref,
      source: "bulk_import"
    });
  });

  const seenCrossRefs = new Set();

  kind = "cross-reference";
  crossRows.forEach((row, index) => {
    const item = index + 1;
    if (!row || typeof row !== "object") {
      fail(item, "the cross-reference is not an object.");
      return;
    }
    const chapter = asNumber(row.chapter);
    if (chapter === null || chapter < 1) {
      fail(item, `chapter ${row.chapter === undefined ? "(missing)" : row.chapter} invalid (must be 1 or more).`);
    }
    const verse = asNumber(row.verse);
    if (verse === null || verse < 1) {
      fail(item, `cross_ref verse ${row.verse === undefined ? "(missing)" : row.verse} invalid (must be 1 or more).`);
    }
    const refBook = asNumber(row.ref_book_number);
    if (refBook === null || refBook < 1 || refBook > 66) {
      fail(item, `cross_ref ref_book_number ${row.ref_book_number === undefined ? "(missing)" : row.ref_book_number} invalid (must be 1..66)`);
    }
    const refChapter = asNumber(row.ref_chapter);
    if (refChapter === null || refChapter < 1) {
      fail(item, `cross_ref ref_chapter ${row.ref_chapter === undefined ? "(missing)" : row.ref_chapter} invalid (must be 1 or more).`);
    }
    const refVerse = asNumber(row.ref_verse);
    if (refVerse === null || refVerse < 1) {
      fail(item, `cross_ref ref_verse ${row.ref_verse === undefined ? "(missing)" : row.ref_verse} invalid`);
    }
    if (
      refBook !== null &&
      refChapter !== null &&
      refVerse !== null &&
      refBook === bookNumber &&
      refChapter === chapter &&
      refVerse === verse
    ) {
      fail(
        item,
        `cross_ref ref_book_number ${refBook}, ref_chapter ${refChapter}, ref_verse ${refVerse} points to itself - skipped`
      );
    }
    // The text of the verse a cross-reference points to is a courtesy:
    // the reader shows the reference itself when it is not there. A file
    // that carries the English only is therefore accepted, and the Luganda
    // section is left empty.
    if (!lenient) {
      if (!clean(row.ref_text_en)) {
        warnings.push({
          item,
          message: "the cross-reference has no English text, the reader will show the reference itself.",
          kind
        });
      }
      if (!clean(row.ref_text_lu)) {
        warnings.push({
          item,
          message: "the cross-reference has no Luganda text yet, it is left empty so you can write it later.",
          kind
        });
      }
    }

    const reference = normaliseCrossRef({
      book_number: bookNumber || 0,
      chapter: chapter || 0,
      verse: verse || 0,
      ref_book_number: refBook || 0,
      ref_chapter: refChapter || 0,
      ref_verse: refVerse || 0,
      ref_verse_end: asNumber(row.ref_verse_end) || 0,
      ref_text_en: clean(row.ref_text_en),
      ref_text_lu: clean(row.ref_text_lu),
      note_en: clean(row.note_en),
      note_lu: clean(row.note_lu)
    });
    const key = crossRefNaturalKey(reference);
    if (seenCrossRefs.has(key)) {
      warnings.push({ item, message: "this cross-reference is already in the file, only the last one is kept.", kind });
    }
    seenCrossRefs.add(key);
    crossReferences.push({
      book_number: reference.book_number,
      chapter: reference.chapter,
      verse: reference.verse,
      ref_book_number: reference.ref_book_number,
      ref_chapter: reference.ref_chapter,
      ref_verse: reference.ref_verse,
      ref_verse_end: reference.ref_verse_end || 0,
      ref_text_en: reference.ref_text_en,
      ref_text_lu: reference.ref_text_lu,
      note_en: reference.note_en,
      note_lu: reference.note_lu,
      source: "bulk_import"
    });
  });

  const introRows = Array.isArray(raw.chapter_intros) ? raw.chapter_intros : [];

  kind = "chapter intro";
  introRows.forEach((row, index) => {
    const item = index + 1;
    if (!row || typeof row !== "object") {
      fail(item, "the chapter introduction is not an object.");
      return;
    }
    const chapter = asNumber(row.chapter);
    if (chapter === null || chapter < 1) {
      fail(item, `chapter ${row.chapter === undefined ? "(missing)" : row.chapter} invalid (must be 1 or more).`);
      return;
    }
    const introEn = clean(row.intro_en);
    const introLu = clean(row.intro_lu);
    if (!introEn && !introLu) {
      fail(item, "the chapter introduction is empty.");
      return;
    }
    if (!introLu) {
      warnings.push({
        item,
        message: "the chapter introduction has no Luganda text yet, it is left empty so you can write it later.",
        kind
      });
    }
    chapterIntros.push({
      book_number: bookNumber || 0,
      book_name: bookName,
      chapter,
      title_en: clean(row.title_en),
      title_lu: clean(row.title_lu),
      intro_en: introEn,
      intro_lu: introLu,
      source: "bulk_import"
    });
  });

  if (!prayers.length && !crossReferences.length && !chapterIntros.length && !errors.length) {
    warnings.push({ item: 0, message: "the file holds no prayer and no cross-reference." });
  }

  return { ok: errors.length === 0, errors, warnings, file, prayers, crossReferences, chapterIntros };
};

/**
 * The rows of a file in the prayer-crossrefs format, ready for the content
 * importer: one collection of prayer passages and one of cross-references.
 *
 * A file that carries the English only is accepted: the Luganda section of
 * every row is then left empty.
 */
export const prayerCrossRefCollections = (raw) => {
  const checked = validatePrayerFile(raw, { allowNoTitle: true });
  const collections = {};
  if (checked.prayers.length) collections.PrayerPassage = checked.prayers;
  if (checked.crossReferences.length) collections.CrossReference = checked.crossReferences;
  if (checked.chapterIntros.length) collections.ChapterIntro = checked.chapterIntros;
  return { collections, errors: checked.errors, warnings: checked.warnings, ok: checked.ok };
};

const listForBook = async (entity, bookNumber) => {
  const wanted = Number(bookNumber);
  try {
    const rows = await fse2.entities[entity].filter({ book_number: wanted });
    return Array.isArray(rows) ? rows : [];
  } catch {
    try {
      const rows = await fse2.entities[entity].list("-updated_date", 1000);
      return (Array.isArray(rows) ? rows : []).filter((row) => Number(row.book_number) === wanted);
    } catch {
      return [];
    }
  }
};

/**
 * Writes the file into the app.
 *
 * The records are matched by their natural key, so importing the same file
 * again changes the records that are already there and adds the ones that
 * are missing. The work is done in batches, so a big book does not hold
 * the browser in one long breath.
 */
export const importPrayerFile = async ({
  file,
  prayers = [],
  crossReferences = [],
  chapterIntros = [],
  onProgress
}) => {
  const summary = {
    prayers: { inserted: 0, updated: 0, skipped: 0, failed: 0, total: prayers.length },
    crossReferences: { inserted: 0, updated: 0, skipped: 0, failed: 0, total: crossReferences.length },
    chapterIntros: { inserted: 0, updated: 0, skipped: 0, failed: 0, total: chapterIntros.length }
  };
  const errors = [];
  const warnings = [];

  const existingPassages = await listForBook("PrayerPassage", file.book_number);
  const passageIndex = new Map();
  existingPassages.forEach((row) => {
    const passage = normalisePassage(row);
    passageIndex.set(passageNaturalKey(passage), row);
  });

  const existingCrossRefs = await listForBook("CrossReference", file.book_number);
  const crossIndex = new Map();
  existingCrossRefs.forEach((row) => {
    const reference = normaliseCrossRef(row);
    crossIndex.set(crossRefNaturalKey(reference), row);
  });

  const existingIntros = await listForBook("ChapterIntro", file.book_number);
  const introIndex = new Map();
  existingIntros.forEach((row) => {
    const intro = normaliseChapterIntro(row);
    introIndex.set(chapterIntroNaturalKey(intro), row);
  });

  const total = prayers.length + crossReferences.length + chapterIntros.length;
  let done = 0;

  const writeRows = async (rows, entity, keyOf, bucket, label) => {
    for (let start = 0; start < rows.length; start += BATCH_SIZE) {
      const batch = rows.slice(start, start + BATCH_SIZE);
      for (const row of batch) {
        const key = keyOf(row);
        const current = key === null ? null : (bucket.index.get(key) || null);
        try {
          if (current && current.id) {
            // An empty section is never written over: a prayer that already
            // has its Luganda written keeps it when an English-only file is
            // imported again.
            const changes = { ...row };
            Object.keys(changes).forEach((name) => {
              if (changes[name] === "") delete changes[name];
            });
            await fse2.entities[entity].update(current.id, changes);
            bucket.counters.updated += 1;
          } else {
            const created = await fse2.entities[entity].create(row);
            bucket.counters.inserted += 1;
            bucket.index.set(key, { ...row, id: (created && created.id) || "" });
          }
        } catch (error) {
          bucket.counters.failed += 1;
          errors.push(`${label} - ${error.message || "the record could not be saved"}`);
        }
        done += 1;
      }
      if (onProgress) onProgress({ done, total });
    }
  };

  await writeRows(
    prayers,
    "PrayerPassage",
    (row) => passageNaturalKey(normalisePassage(row)),
    { counters: summary.prayers, index: passageIndex },
    "A prayer could not be saved"
  );

  await writeRows(
    crossReferences,
    "CrossReference",
    (row) => crossRefNaturalKey(normaliseCrossRef(row)),
    { counters: summary.crossReferences, index: crossIndex },
    "A cross-reference could not be saved"
  );

  await writeRows(
    chapterIntros,
    "ChapterIntro",
    (row) => chapterIntroNaturalKey(normaliseChapterIntro(row)),
    { counters: summary.chapterIntros, index: introIndex },
    "A chapter introduction could not be saved"
  );

  if (summary.prayers.failed || summary.crossReferences.failed || summary.chapterIntros.failed) {
    warnings.push("Some records could not be written. Run the import again to finish them.");
  }

  return { summary, errors, warnings };
};

/** What the app already holds for one book and chapter. */
export const readImportedContent = async (bookNumber, chapter) => {
  const wantedBook = Number(bookNumber);
  const wantedChapter = Number(chapter);
  const match = (row) => Number(row.book_number) === wantedBook && Number(row.chapter) === wantedChapter;
  const [passageRows, crossRows, introRows] = await Promise.all([
    listForBook("PrayerPassage", wantedBook).catch(() => []),
    listForBook("CrossReference", wantedBook).catch(() => []),
    listForBook("ChapterIntro", wantedBook).catch(() => [])
  ]);
  return {
    passages: (passageRows || []).filter(match).map(normalisePassage),
    crossReferences: (crossRows || []).filter(match).map(normaliseCrossRef),
    chapterIntros: (introRows || []).filter(match).map(normaliseChapterIntro)
  };
};