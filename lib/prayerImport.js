import { fse2 } from "@/api/fse2Client";
import { BIBLE_BOOKS } from "@/lib/bibleBooks";
import {
  crossRefNaturalKey,
  normaliseCrossRef,
  normalisePassage,
  passageNaturalKey
} from "@/lib/prayerPassages";
import { chapterIntroNaturalKey, normaliseChapterIntro } from "@/lib/chapterIntros";
import { bookIntroNaturalKey, normaliseBookIntro } from "@/lib/bookIntro";

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

export const isBackfillFile = (payload) => payload && payload.format === BACKFILL_FILE_FORMAT && Array.isArray(payload.cross_references);

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

export const validatePrayerFile = (payload) => {
  const errors = [];
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return { ok: false, errors: ["The file must contain a JSON object."], warnings: [], rows: null, coverage: [] };
  }
  if (isBackfillFile(payload)) {
    const book = asNumber(payload.book_number);
    const refs = payload.cross_references;
    if (!book || book < 1 || book > 66 || !refs.length) errors.push("A backfill file needs a valid book_number and at least one cross-reference.");
    const crossReferences = refs.map((row, index) => normalizeCrossRefRow(row, book, payload.book_name, index, errors));
    return { ok: errors.length === 0, errors, warnings: [], rows: { backfillOnly: true, bookNumber: book, prayers: [], crossReferences, chapterIntros: [] }, coverage: [] };
  }
  const format = payload.format || payload.metadata?.format;
  if (format !== PRAYER_FILE_FORMAT) errors.push(`The file format must be "${PRAYER_FILE_FORMAT}".`);
  const bookNumber = asNumber(payload.book_number ?? payload.bookNumber ?? payload.metadata?.book_number);
  const bookName = asText(payload.book_name ?? payload.bookName ?? payload.metadata?.book_name) || bookNameFor(bookNumber);
  if (!bookNumber || bookNumber < 1 || bookNumber > 66) errors.push("The file needs a valid book_number from 1 to 66.");
  const rawPrayers = payload.prayers ?? payload.prayer_passages;
  const rawRefs = payload.cross_references ?? payload.crossReferences;
  if (!Array.isArray(rawPrayers) || (!rawPrayers.length && !(Array.isArray(rawRefs) && rawRefs.length))) errors.push("The file needs prayer rows or a cross-reference backfill.");
  if (!Array.isArray(rawRefs) || !rawRefs.length) errors.push("This file has no cross-references. Every prayer must come with its cross-references in the same file.");
  const prayers = (Array.isArray(rawPrayers) ? rawPrayers : []).map((row, index) => normalizePrayerRow(row, bookNumber, bookName, index, errors));
  const crossReferences = (Array.isArray(rawRefs) ? rawRefs : []).map((row, index) => normalizeCrossRefRow(row, row?.book_number ?? row?.bookNumber ?? bookNumber, bookNameFor(row?.book_number ?? row?.bookNumber ?? bookNumber) || bookName, index, errors));
  const chapterIntros = (Array.isArray(payload.chapter_intros ?? payload.chapterIntros) ? payload.chapter_intros ?? payload.chapterIntros : []).map((row, index) => normalizeChapterIntroRow(row, bookNumber, bookName, index, errors));
  const coverage = prayers.map((prayer, index) => {
    const matched = crossReferences.filter((ref) => covers(prayer, ref));
    const minimum = prayer.verse == null ? 3 : prayer.verse_end != null && prayer.verse_end !== prayer.verse ? 3 : 2;
    const ok = matched.length >= minimum;
    if (!ok) errors.push(`Prayer ${index + 1}: ${prayerRef(prayer, index, bookName)} ${prayer.title_en ? `"${prayer.title_en}"` : ""}  -  ${matched.length} cross-refs found, need at least ${minimum}.`);
    return { index, prayer, count: matched.length, minimum, ok };
  });
  const rawBookIntro = payload.book_intro ?? payload.bookIntro;
  const bookIntro = rawBookIntro && typeof rawBookIntro === "object" ? {
    book_number: Number(bookNumber), book_name: bookName,
    title_en: asText(rawBookIntro.title_en ?? rawBookIntro.title), title_lu: asText(rawBookIntro.title_lu),
    intro_en: asText(rawBookIntro.intro_en ?? rawBookIntro.introduction_en ?? rawBookIntro.introduction),
    intro_lu: asText(rawBookIntro.intro_lu ?? rawBookIntro.introduction_lu ?? rawBookIntro.introduction_luganda),
    closing_prayer_en: asText(rawBookIntro.closing_prayer_en ?? rawBookIntro.closing_prayer),
    closing_prayer_lu: asText(rawBookIntro.closing_prayer_lu ?? rawBookIntro.closing_prayer_luganda),
    source: asText(rawBookIntro.source)
  } : null;
  return { ok: errors.length === 0, errors, warnings: [], rows: { bookNumber, bookName, prayers, crossReferences, chapterIntros, bookIntro, backfillOnly: false }, coverage };
};

function normalizePrayerRow(row, bookNumber, bookName, index, errors) {
  if (!row || typeof row !== "object" || Array.isArray(row)) {
    errors.push(`Prayer ${index + 1}: expected an object.`);
    return {};
  }
  const chapter = asNumber(row.chapter);
  const verse = asNumber(row.verse);
  const verseEnd = asNumber(row.verse_end ?? row.verseEnd);
  const prayer_en = asText(row.prayer_en ?? row.prayerEn ?? row.prayer_read ?? row.pray_read);
  if (!chapter || !prayer_en) errors.push(`Prayer ${index + 1}: chapter and English prayer text are required.`);
  if (verseEnd !== null && (verse === null || verseEnd < verse)) errors.push(`Prayer ${index + 1}: verse_end must be at or after verse.`);
  return {
    book_number: Number(bookNumber), book_name: bookName, chapter, verse, verse_end: verseEnd,
    title_en: asText(row.title_en ?? row.titleEn ?? row.title), title_lu: asText(row.title_lu ?? row.titleLu),
    prayer_en, prayer_lu: asText(row.prayer_lu ?? row.prayerLu ?? row.prayer_read_luganda),
    scripture_ref: asText(row.scripture_ref ?? row.scriptureRef ?? row.passage), source: asText(row.source)
  };
}

function normalizeCrossRefRow(row, bookNumber, bookName, index, errors) {
  if (!row || typeof row !== "object" || Array.isArray(row)) {
    errors.push(`Cross-reference ${index + 1}: expected an object.`);
    return {};
  }
  const values = {
    book_number: asNumber(row.book_number ?? row.bookNumber) ?? Number(bookNumber),
    chapter: asNumber(row.chapter), verse: asNumber(row.verse),
    ref_book_number: asNumber(row.ref_book_number ?? row.refBookNumber),
    ref_chapter: asNumber(row.ref_chapter ?? row.refChapter), ref_verse: asNumber(row.ref_verse ?? row.refVerse),
    ref_verse_end: asNumber(row.ref_verse_end ?? row.refVerseEnd),
    ref_text_en: asText(row.ref_text_en ?? row.refTextEn ?? row.text_en),
    ref_text_lu: asText(row.ref_text_lu ?? row.refTextLu ?? row.text_lu),
    note_en: asText(row.note_en ?? row.noteEn), note_lu: asText(row.note_lu ?? row.noteLu), source: asText(row.source)
  };
  const required = ["book_number", "chapter", "verse", "ref_book_number", "ref_chapter", "ref_verse"];
  if (required.some((key) => values[key] === null || values[key] <= 0)) errors.push(`Cross-reference ${index + 1}: source and target book/chapter/verse coordinates are required.`);
  if (!values.ref_text_en || !values.ref_text_lu || !values.note_en || !values.note_lu) errors.push(`Cross-reference ${index + 1}: ref_text_en, ref_text_lu, note_en, and note_lu are all required.`);
  return values;
}

function normalizeChapterIntroRow(row, bookNumber, bookName, index, errors) {
  if (!row || typeof row !== "object" || Array.isArray(row)) {
    errors.push(`Chapter introduction ${index + 1}: expected an object.`);
    return {};
  }
  const chapter = asNumber(row.chapter);
  if (!chapter) errors.push(`Chapter introduction ${index + 1}: chapter is required.`);
  return { book_number: Number(bookNumber), book_name: bookName, chapter, title_en: asText(row.title_en ?? row.title), title_lu: asText(row.title_lu), intro_en: asText(row.intro_en ?? row.introduction), intro_lu: asText(row.intro_lu ?? row.introduction_luganda), source: asText(row.source) };
}

export const prayerCrossRefCollections = (payload) => {
  const validation = validatePrayerFile(payload);
  if (!validation.ok) return { ok: false, errors: validation.errors.map((message) => ({ message })), warnings: [], collections: {} };
  const rows = validation.rows;
  const collections = {};
  if (rows.prayers.length) collections.PrayerPassage = rows.prayers;
  if (rows.crossReferences.length) collections.CrossReference = rows.crossReferences;
  if (rows.chapterIntros.length) collections.ChapterIntro = rows.chapterIntros;
  if (rows.bookIntro && (rows.bookIntro.intro_en || rows.bookIntro.intro_lu || rows.bookIntro.closing_prayer_en || rows.bookIntro.closing_prayer_lu)) collections.BookIntro = [rows.bookIntro];
  return { ok: true, errors: [], warnings: [], collections };
};

export const prayerTemplateText = () => JSON.stringify({ format: PRAYER_FILE_FORMAT, book_number: 19, book_name: "Psalms", prayers: [], cross_references: [], chapter_intros: [] }, null, 2);

export const missingCrossRefsTemplateText = (validation) => JSON.stringify({
  format: PRAYER_FILE_FORMAT,
  book_number: validation.rows?.bookNumber,
  book_name: validation.rows?.bookName,
  prayers: (validation.coverage || []).filter((item) => !item.ok).map((item) => item.prayer),
  cross_references: [],
  chapter_intros: []
}, null, 2);

export const importPrayerFile = async (payload) => {
  const validation = validatePrayerFile(payload);
  if (!validation.ok) throw new Error(validation.errors.join("\n"));
  const rows = validation.rows;
  const summary = { PrayerPassage: { inserted: 0, updated: 0 }, CrossReference: { inserted: 0, updated: 0 }, ChapterIntro: { inserted: 0, updated: 0 }, BookIntro: { inserted: 0, updated: 0 } };
  const importRows = async (entity, records, keyFn) => {
    if (!records.length) return;
    const wantedBook = entity === "CrossReference" ? records[0]?.book_number ?? rows.bookNumber : rows.bookNumber;
    const existing = await list(entity, wantedBook).catch(() => []);
    const index = new Map((existing || []).map((record) => [keyFn(record), record]));
    for (const values of records) {
      const key = keyFn(values);
      const current = index.get(key);
      if (current) {
        if (entity === "CrossReference" && rows.backfillOnly) { summary[entity].updated += 0; continue; }
        await fse2.entities[entity].update(current.id, values);
        summary[entity].updated += 1;
      } else {
        const created = await fse2.entities[entity].create(values);
        index.set(key, created);
        summary[entity].inserted += 1;
      }
    }
  };
  if (!rows.backfillOnly) {
    await importRows("PrayerPassage", rows.prayers, passageNaturalKey);
    await importRows("ChapterIntro", rows.chapterIntros, chapterIntroNaturalKey);
    if (rows.bookIntro && (rows.bookIntro.intro_en || rows.bookIntro.intro_lu || rows.bookIntro.closing_prayer_en || rows.bookIntro.closing_prayer_lu)) await importRows("BookIntro", [rows.bookIntro], bookIntroNaturalKey);
  }
  await importRows("CrossReference", rows.crossReferences, crossRefNaturalKey);
  return { summary, backfillOnly: rows.backfillOnly, bookNumber: rows.bookNumber };
};

export const readImportedContent = async (bookNumber) => {
  const wanted = Number(bookNumber);
  const [passageRows, crossRows, introRows, bookIntroRows] = await Promise.all([
    list("PrayerPassage", wanted).catch(() => []), list("CrossReference", wanted).catch(() => []),
    list("ChapterIntro", wanted).catch(() => []), list("BookIntro", wanted).catch(() => [])
  ]);
  return {
    passages: (passageRows || []).map(normalisePassage), crossReferences: (crossRows || []).map(normaliseCrossRef),
    chapterIntros: (introRows || []).map(normaliseChapterIntro), bookIntros: (bookIntroRows || []).map(normaliseBookIntro)
  };
};