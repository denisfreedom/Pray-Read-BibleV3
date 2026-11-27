import { fse2 } from "@/api/fse2Client";
import { fetchPublicCollection } from "@/lib/contentApi";
import { BIBLE_BOOKS } from "@/lib/bibleBooks";
import { bilingualText, textValue } from "@/lib/bilingual";
import { resolveBook, parseReference } from "@/lib/scriptureRefs";
import { crossRefNaturalKey, normaliseCrossRef, normalisePassage, passageNaturalKey } from "@/lib/prayerPassages";
import { chapterIntroNaturalKey, normaliseChapterIntro } from "@/lib/chapterIntros";
import { bookIntroNaturalKey, normaliseBookIntro } from "@/lib/bookIntro";
import { bookFileCollections, CHAPTER_CLOSING_SOURCE, isBookFile } from "@/lib/bookImport";

export const PRAYER_FILE_FORMAT = "pray-read-prayer-crossrefs-v1";
export const BACKFILL_FILE_FORMAT = "pray-read-crossrefs-backfill-v1";
export const TEMPLATE_URL = "/assets/media-library/0dbaf742d3ba_Prayer-Crossrefs-Template.json";
export const FILE_FIELDS = { file: ["prayers", "cross_references", "chapter_intros", "book_intro"] };

export const bookNameFor = (bookNumber) => BIBLE_BOOKS.find((item) => Number(item.number) === Number(bookNumber))?.name || "";
const asText = (value) => textValue(value);
const parseJsonText = (text) => {
  const source = String(text || "").replace(/^\uFEFF/, "").trim();
  const clean = source.replace(/(^|\n)\s*\/\/[^\n]*/g, "$1").replace(/,\s*([}\]])/g, "$1");
  try { return JSON.parse(clean); } catch (firstError) {
    const lines = clean.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
    if (lines.length > 1) {
      const records = [];
      lines.forEach((line, index) => {
        try { records.push(JSON.parse(line)); } catch (error) { throw new Error(`Line ${index + 1}: ${error.message}`); }
      });
      return records;
    }
    throw firstError;
  }
};
const asNumber = (value) => value === null || value === undefined || value === "" ? null : (Number.isFinite(Number(value)) ? Number(value) : null);
const localizedText = (value, language, fallback = "") => {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    const primary = bilingualText(value, language, "");
    if (primary) return primary;
    return fallback && typeof fallback === "object" ? bilingualText(fallback, language, "") : (language === "lu" ? "" : asText(fallback));
  }
  if (value !== undefined && value !== null && value !== "") return language === "lu" ? (typeof fallback === "object" ? bilingualText(fallback, "lu", "") : asText(fallback)) : asText(value);
  return fallback && typeof fallback === "object" ? bilingualText(fallback, language, "") : (language === "lu" ? "" : asText(fallback));
};
const DASH = "[-\\u2010-\\u2015\\u2212\\uFE58\\uFE63\\uFF0D]";
const normalizeRangeDashes = (value) => String(value || "").replace(/[\u2010-\u2015\u2212\uFE58\uFE63\uFF0D]/g, "-");
const list = async (entity, book) => {
  const wanted = Number(book);
  const collection = { PrayerPassage: "prayerPassages", CrossReference: "crossReferences", ChapterIntro: "chapterIntros", BookIntro: "bookIntros" }[entity];
  try {
    const rows = await fetchPublicCollection(collection, { authenticated: true });
    const matches = (rows || []).filter((row) => Number(row.book_number) === wanted || resolveBook(row.book_name ?? row.book)?.number === wanted);
    if (matches.length) return matches;
  } catch { /* Use paginated entity queries. */ }
  const gathered = [];
  let offset = 0;
  while (true) {
    const page = await fse2.entities[entity].list("-updated_date", 500, offset).catch(() => []);
    const rows = page || [];
    gathered.push(...rows);
    if (rows.length < 500) break;
    offset += rows.length;
  }
  return gathered.filter((row) => Number(row.book_number) === wanted || resolveBook(row.book_name ?? row.book)?.number === wanted);
};
export const isBackfillFile = (payload) => payload?.format === BACKFILL_FILE_FORMAT && Array.isArray(payload.cross_references);

const normalizePrayerRow = (row, bookNumber, bookName, index, errors, warnings) => {
  if (!row || typeof row !== "object" || Array.isArray(row)) { errors.push(`Prayer ${index + 1}: expected an object.`); return null; }
  const book = resolveBook(row.book_name ?? row.book ?? row.bookName ?? row.book_number ?? row.bookNumber);
  const number = book?.number || Number(bookNumber);
  const name = book?.name || bookName;
  const chapter = asNumber(row.chapter ?? row.chapter_number ?? row.chapterNumber);
  const verseSource = row.verse ?? row.verse_number ?? row.verseNumber;
  const range = typeof verseSource === "string" ? verseSource.trim().match(new RegExp(`^(\\d+)\\s*${DASH}\\s*(\\d+)$`)) : null;
  const verse = asNumber(range ? range[1] : verseSource);
  const verseEnd = asNumber(row.verse_end ?? row.verseEnd ?? row.verse_end_number ?? (range ? range[2] : null));
  const source = row.pray_read ?? row.pay_read ?? row.prayRead ?? row.payRead ?? row.prayer_read ?? row.prayer ?? row.prayer_en ?? row.prayerEn ?? row.text_en ?? row.text ?? row.body_en;
  const obj = source && typeof source === "object" && !Array.isArray(source) ? source : {};
  const fallbackEn = row.prayer_en ?? row.pray_read_en ?? row.pay_read_en ?? row.text_en ?? row.body_en ?? obj.prayer_en ?? obj.text_en ?? obj.body_en ?? obj.en;
  const fallbackLu = row.prayer_lu ?? row.prayerLu ?? row.pray_read_luganda ?? row.pay_read_luganda ?? row.prayer_read_luganda ?? row.prayer_luganda ?? row.text_lu ?? row.body_lu ?? obj.prayer_lu ?? obj.text_lu ?? obj.body_lu ?? obj.lu;
  const title = row.title && typeof row.title === "object" ? row.title : {};
  const en = localizedText(source, "en", fallbackEn);
  const lu = localizedText(source, "lu", fallbackLu);
  if (!chapter) errors.push(`Prayer ${index + 1}: the chapter is required.`);
  if (verseEnd !== null && (verse === null || verseEnd < verse)) errors.push(`Prayer ${index + 1}: verse_end must be at or after verse.`);
  if (!en && !lu) { errors.push(`Prayer ${index + 1}: prayer_en (or text_en) is required; add prayer text to import this row.`); return null; }
  if (!lu) warnings.push(`Prayer ${index + 1}: there is no Luganda prayer text yet. The Luganda column was left empty.`);
  return {
    book_number: number, book_name: name, chapter, verse, verse_end: verseEnd,
    title_en: localizedText(row.title_en ?? row.titleEn ?? row.title, "en", title.title_en ?? title.title ?? title.en),
    title_lu: localizedText(row.title_lu ?? row.titleLu ?? row.title_luganda ?? row.title, "lu", title.title_lu ?? title.title_luganda ?? title.lu),
    prayer_en: en, prayer_lu: lu, scripture_ref: asText(row.scripture_ref ?? row.scriptureRef ?? row.passage), source: asText(row.source)
  };
};

const normalizeCrossRefRow = (row, bookNumber, bookName, index, errors, warnings) => {
  const bare = typeof row === "string" ? row : "";
  if (typeof row === "string") row = { reference: row, book_number: bookNumber, book_name: bookName };
  if (!row || typeof row !== "object" || Array.isArray(row)) { errors.push(`Cross-reference ${index + 1}: expected an object.`); return null; }
  const refSource = row.ref_text_en ?? row.refTextEn ?? row.text_en ?? row.ref_text ?? row.text;
  const refObject = refSource && typeof refSource === "object" ? refSource : {};
  const noteSource = row.note_en ?? row.noteEn ?? row.note ?? row.notes;
  const noteObject = noteSource && typeof noteSource === "object" ? noteSource : {};
  const targetBook = resolveBook(row.ref_book_name ?? row.ref_book ?? row.target_book);
  const sourceBook = resolveBook(row.book_name ?? row.book);
  const numberedSource = asNumber(row.book_number ?? row.bookNumber) || Number(bookNumber);
  const sourceName = sourceBook?.name || bookNameFor(numberedSource) || bookName;
  const reference = asText(row.reference_text ?? row.reference ?? row.label ?? row.ref ?? row.scripture_ref ?? (row.ref_book_name || row.ref_book || row.ref_book_number ? [row.ref_book_name ?? row.ref_book ?? bookNameFor(row.ref_book_number), row.ref_chapter, row.ref_verse ? `${row.ref_verse}${row.ref_verse_end && row.ref_verse_end !== row.ref_verse ? `-${row.ref_verse_end}` : ""}` : null].filter(Boolean).join(" ") : ""));
  const parsedReference = normalizeRangeDashes(reference);
  const parsed = parsedReference ? parseReference(parsedReference) : null;
  const sourceRef = parseReference(normalizeRangeDashes(asText(row.source_reference ?? row.source_ref ?? row.passage_reference)));
  const shorthand = !parsed && bare.match(/^(\d{1,3})(?::(\d{1,3}))?(?:\s*[-: ]\s*(\d{1,3}))?$/);
  const values = {
    book_number: sourceBook?.number || sourceRef?.bookNumber || numberedSource, book_name: sourceName,
    chapter: asNumber(row.chapter ?? row.chapter_number ?? row.chapterNumber ?? row.source_chapter ?? row.sourceChapter) || sourceRef?.chapter || (shorthand?.[2] ? Number(shorthand[1]) : null),
    verse: asNumber(row.verse ?? row.verse_number ?? row.verseNumber ?? row.source_verse ?? row.sourceVerse) || sourceRef?.verse || (shorthand?.[2] ? Number(shorthand[2]) : null),
    ref_book_number: targetBook?.number || asNumber(row.ref_book_number ?? row.refBookNumber) || parsed?.bookNumber || (shorthand ? Number(shorthand[2] || shorthand[1]) : null),
    ref_chapter: asNumber(row.ref_chapter ?? row.refChapter) || parsed?.chapter || (shorthand?.[2] ? Number(shorthand[1]) : null),
    ref_verse: asNumber(row.ref_verse ?? row.refVerse) || parsed?.verse || (shorthand ? Number(shorthand[2] || shorthand[1]) : null),
    ref_verse_end: asNumber(row.ref_verse_end ?? row.refVerseEnd) || parsed?.endVerse || (shorthand?.[3] ? Number(shorthand[3]) : null),
    reference_text: reference, unresolved: !(targetBook || parsed || shorthand),
    ref_text_en: localizedText(refSource, "en"), ref_text_lu: localizedText(row.ref_text_lu ?? row.refTextLu ?? row.text_lu ?? row.ref_text_luganda ?? refSource, "lu", refObject.lu ?? refObject.luganda ?? ""),
    note_en: localizedText(noteSource, "en"), note_lu: localizedText(row.note_lu ?? row.noteLu ?? row.note_luganda ?? row.notes_luganda ?? noteSource, "lu", noteObject.lu ?? noteObject.luganda ?? ""),
    source: asText(row.source)
  };
  if (!values.chapter || !values.verse || !values.book_number) { errors.push(`Cross-reference ${index + 1}: source book/chapter/verse coordinates are required.`); return null; }
  if (!reference) warnings.push(`Cross-reference ${index + 1}: no reference label was supplied.`);
  values.book_name = bookNameFor(values.book_number) || values.book_name;
  if (!values.ref_book_number || !values.ref_chapter || !values.ref_verse) {
    values.unresolved = true;
    warnings.push(`Cross-reference ${index + 1}: target coordinates could not be resolved (${reference || "no target reference text"}). Supplied reference text and notes were preserved.`);
  }
  if (!values.ref_text_en || !values.ref_text_lu || !values.note_en || !values.note_lu) warnings.push(`Cross-reference ${index + 1}: optional text or notes are missing; imported values were preserved.`);
  return values;
};

const normalizeChapterIntroRow = (row, bookNumber, bookName, index, errors, warnings) => {
  const source = typeof row === "string" ? { introduction: row } : row;
  if (!source || typeof source !== "object" || Array.isArray(source)) { errors.push(`Chapter introduction ${index + 1}: expected an object.`); return null; }
  const chapter = asNumber(source.chapter ?? source.chapter_number ?? source.chapterNumber);
  if (!chapter) { errors.push(`Chapter introduction ${index + 1}: the chapter is required.`); return null; }
  const introSource = source.introduction ?? source.intro_en ?? source.intro ?? source.intro_lu ?? source.introduction_lu ?? source.introduction_luganda;
  const introEn = localizedText(introSource, "en", source.intro_en ?? source.introduction_en);
  const introLu = localizedText(introSource, "lu", source.intro_lu ?? source.introduction_lu ?? source.introduction_luganda);
  if (introEn && !introLu) warnings.push(`The introduction of ${bookName} ${chapter} has no Luganda text yet.`);
  const closingSource = source.closing_prayer ?? source.chapter_closing_prayer ?? source.closing_prayer_en ?? source.closing_prayer_lu ?? source.closing_prayer_luganda;
  const closingObj = closingSource && typeof closingSource === "object" ? closingSource : {};
  const closeEn = localizedText(closingSource, "en", source.closing_prayer_en ?? source.chapter_closing_prayer_en ?? closingObj.en ?? closingObj.english);
  const closeLu = localizedText(closingSource, "lu", source.closing_prayer_lu ?? source.closing_prayer_luganda ?? source.chapter_closing_prayer_lu ?? closingObj.lu ?? closingObj.luganda);
  return {
    book_number: Number(bookNumber), book_name: bookName, chapter,
    title_en: localizedText(source.title_en ?? source.title, "en"), title_lu: localizedText(source.title_lu ?? source.title_luganda ?? source.title, "lu"),
    intro_en: introEn, intro_lu: introLu, source: asText(source.source),
    closing: closeEn || closeLu ? {
      title_en: localizedText(source.closing_prayer_title_en ?? closingObj.title_en ?? closingObj.title, "en"),
      title_lu: localizedText(source.closing_prayer_title_lu ?? source.closing_prayer_title_luganda ?? closingObj.title_lu ?? closingObj.title, "lu"),
      prayer_en: closeEn, prayer_lu: closeLu
    } : null
  };
};

const normalizeBookIntroRow = (raw, bookNumber, bookName) => {
  if (raw === null || raw === undefined) return null;
  const source = typeof raw === "string" ? { introduction: raw } : raw;
  if (!source || typeof source !== "object" || Array.isArray(source)) return null;
  const introSource = source.introduction ?? source.intro_en ?? source.intro ?? source.intro_lu ?? source.introduction_lu ?? source.introduction_luganda;
  const closeSource = source.closing_prayer ?? source.book_closing_prayer ?? source.closing_prayer_en ?? source.closing_prayer_lu ?? source.closing_prayer_luganda;
  const closeObj = closeSource && typeof closeSource === "object" ? closeSource : {};
  const title = source.closing_prayer && typeof source.closing_prayer === "object" ? source.closing_prayer : {};
  return {
    book_number: Number(bookNumber), book_name: bookName,
    title_en: localizedText(source.title_en ?? source.title, "en"), title_lu: localizedText(source.title_lu ?? source.title_luganda ?? source.title, "lu"),
    intro_en: localizedText(introSource, "en", source.intro_en ?? source.introduction_en), intro_lu: localizedText(introSource, "lu", source.intro_lu ?? source.introduction_lu ?? source.introduction_luganda),
    closing_title_en: localizedText(title.title_en ?? title.title, "en", source.closing_prayer_title_en),
    closing_title_lu: localizedText(title.title_lu ?? title.title_luganda ?? title.title, "lu", source.closing_prayer_title_lu),
    closing_prayer_en: localizedText(closeSource, "en", source.closing_prayer_en ?? source.book_closing_prayer_en ?? closeObj.en),
    closing_prayer_lu: localizedText(closeSource, "lu", source.closing_prayer_lu ?? source.closing_prayer_luganda ?? source.book_closing_prayer_lu ?? closeObj.lu),
    source: asText(source.source)
  };
};

export const coverageMinimum = (prayer) => prayer.verse == null ? 3 : prayer.verse_end != null && prayer.verse_end !== prayer.verse ? 3 : 2;
const covers = (prayer, ref) => Number(prayer.book_number) === Number(ref.book_number) && Number(prayer.chapter) === Number(ref.chapter) && (prayer.verse == null || (Number(ref.verse) >= Number(prayer.verse) && Number(ref.verse) <= Number(prayer.verse_end || prayer.verse)));
export const coverageOf = (prayers, references) => (prayers || []).map((prayer, index) => {
  const count = (references || []).filter((ref) => covers(prayer, ref)).length;
  const minimum = coverageMinimum(prayer);
  return { index, prayer, count, minimum, ok: count >= minimum };
});

export const validatePrayerFile = (input) => {
  const errors = [];
  const warnings = [];
  let payload = input;
  if (Array.isArray(payload)) payload = { format: PRAYER_FILE_FORMAT, prayers: payload };
  if (payload && typeof payload === "object" && !Array.isArray(payload) && (Array.isArray(payload.data) || Array.isArray(payload.items) || Array.isArray(payload.prayers) && payload.format !== PRAYER_FILE_FORMAT)) payload = { ...payload, prayers: payload.prayers ?? payload.data ?? payload.items };
  if (payload && typeof payload === "object" && !Array.isArray(payload) && !Array.isArray(payload.prayers) && !Array.isArray(payload.prayer_passages) && !Array.isArray(payload.passages) && (payload.book !== undefined && payload.chapter !== undefined && payload.verse !== undefined)) payload = { format: PRAYER_FILE_FORMAT, book_number: payload.book, prayers: [payload] };
  if (!payload || typeof payload !== "object") return { ok: false, errors: ["The file must contain a JSON object or prayer rows."], warnings, rows: null, coverage: [] };
  const backfill = isBackfillFile(payload);
  const hasBook = isBookFile(payload);
  const payloadBook = payload.book_name ?? payload.bookName ?? payload.book ?? payload.name;
  const named = resolveBook(payloadBook);
  const numbered = asNumber(payload.book_number ?? payload.bookNumber ?? payload.metadata?.book_number);
  const expanded = hasBook ? bookFileCollections(payload).expanded : null;
  const firstPrayerRow = (payload.prayers ?? payload.prayer_passages ?? payload.passages ?? payload.items ?? payload.data)?.[0];
  const rowBook = resolveBook(firstPrayerRow?.book_name ?? firstPrayerRow?.book ?? firstPrayerRow?.book_number);
  const firstRowNumber = asNumber(firstPrayerRow?.book_number ?? firstPrayerRow?.bookNumber ?? (typeof firstPrayerRow?.book === "number" ? firstPrayerRow.book : null));
  const bookNumber = named?.number || rowBook?.number || (numbered >= 1 && numbered <= 66 ? numbered : expanded?.book_number) || (firstRowNumber >= 1 && firstRowNumber <= 66 ? firstRowNumber : null);
  const bookName = named?.name || rowBook?.name || bookNameFor(bookNumber) || expanded?.book_name || (typeof firstPrayerRow?.book === "string" ? firstPrayerRow.book : "");
  if (!bookNumber || bookNumber < 1 || bookNumber > 66) errors.push("The file needs a valid Bible book number or alias.");
  const rawPrayers = payload.prayers ?? payload.prayer_passages ?? payload.passages ?? payload.items ?? payload.data ?? (hasBook ? expanded.prayers : []);
  const rawRefs = payload.cross_references ?? payload.crossReferences ?? (hasBook ? expanded.crossReferences : []);
  if (payload.prayers !== undefined && !Array.isArray(payload.prayers)) errors.push("The prayers field must be an array.");
  if (payload.prayer_passages !== undefined && !Array.isArray(payload.prayer_passages)) errors.push("The prayer_passages field must be an array.");
  if (payload.passages !== undefined && !Array.isArray(payload.passages)) errors.push("The passages field must be an array.");
  if (payload.cross_references !== undefined && !Array.isArray(payload.cross_references)) errors.push("The cross_references field must be an array.");
  if (payload.crossReferences !== undefined && !Array.isArray(payload.crossReferences)) errors.push("The crossReferences field must be an array.");
  if (payload.chapter_intros !== undefined && !Array.isArray(payload.chapter_intros)) errors.push("The chapter_intros field must be an array.");
  if (payload.chapterIntros !== undefined && !Array.isArray(payload.chapterIntros)) errors.push("The chapterIntros field must be an array.");
  if (!backfill && !hasBook && !rawPrayers.length && !rawRefs.length && !payload.chapter_intros && !payload.book_intro && !payload.bookIntro) errors.push("The file needs prayer rows, cross-references, or introduction content.");
  if (!rawRefs?.length) warnings.push("This file has no cross-references; that does not prevent importing other content.");
  if (!rawPrayers?.length && !hasBook) errors.push("No prayer rows were found; provide at least one row with book, chapter, verse, and prayer text.");
  if (hasBook && !expanded.crossReferences.length) warnings.push("This book file has no cross-references; other usable content can still be imported.");
  const prayers = hasBook && !payload.prayers && !payload.prayer_passages && !payload.passages && !payload.items && !payload.data
    ? [...expanded.prayers]
    : (Array.isArray(rawPrayers) ? rawPrayers : []).map((row, i) => normalizePrayerRow(row, bookNumber, bookName, i, errors, warnings)).filter(Boolean);
  const refs = hasBook && !payload.cross_references && !payload.crossReferences
    ? [...expanded.crossReferences]
    : (Array.isArray(rawRefs) ? rawRefs : []).map((row, i) => normalizeCrossRefRow(row, row?.book_number ?? row?.bookNumber ?? bookNumber, bookNameFor(row?.book_number ?? row?.bookNumber ?? bookNumber) || bookName, i, errors, warnings)).filter(Boolean);
  const introInput = payload.chapter_intros ?? payload.chapterIntros ?? [];
  const intros = hasBook && !payload.chapter_intros && !payload.chapterIntros
    ? [...expanded.chapterIntros]
    : (Array.isArray(introInput) ? introInput : []).map((row, i) => normalizeChapterIntroRow(row, bookNumber, bookName, i, errors, warnings)).filter(Boolean);

  const bookIntroSource = payload.book_intro ?? payload.bookIntro ?? ((payload.introduction !== undefined || payload.book_introduction !== undefined || payload.intro_en !== undefined || payload.intro_lu !== undefined || payload.closing_prayer !== undefined || payload.book_closing_prayer !== undefined) ? payload : null);
  const bookIntro = hasBook && !bookIntroSource ? expanded.bookIntro : normalizeBookIntroRow(bookIntroSource, bookNumber, bookName);
  const replacementCollections = backfill ? [] : hasBook
    ? ["PrayerPassage", "CrossReference", "ChapterIntro", "BookIntro"]
    : [
        ...(payload.prayers !== undefined || payload.prayer_passages !== undefined || payload.passages !== undefined || payload.items !== undefined || payload.data !== undefined ? ["PrayerPassage"] : []),
        ...(payload.cross_references !== undefined || payload.crossReferences !== undefined ? ["CrossReference"] : []),
        ...(payload.chapter_intros !== undefined || payload.chapterIntros !== undefined ? ["ChapterIntro"] : []),
        ...(payload.book_intro !== undefined || payload.bookIntro !== undefined || payload.introduction !== undefined || payload.book_introduction !== undefined ? ["BookIntro"] : [])
      ];
  if (payload.book_intro !== undefined && payload.book_intro !== null && !bookIntro) errors.push("The book_intro field must be an object or text.");
  if (payload.bookIntro !== undefined && payload.bookIntro !== null && !bookIntro) errors.push("The bookIntro field must be an object or text.");
  if (hasBook && expanded.warnings.length) warnings.push(...expanded.warnings.map((item) => item.message));
  if (bookIntro?.closing_prayer_en || bookIntro?.closing_prayer_lu) prayers.push({ book_number: bookNumber, book_name: bookName, chapter: null, verse: null, verse_end: null, title_en: bookIntro.closing_title_en, title_lu: bookIntro.closing_title_lu, prayer_en: bookIntro.closing_prayer_en, prayer_lu: bookIntro.closing_prayer_lu, scripture_ref: bookName, source: "book_import:book_closing" });
  if (!backfill) {
    for (const collection of replacementCollections) {
      const values = collection === "PrayerPassage" ? prayers : collection === "CrossReference" ? refs : collection === "ChapterIntro" ? intros : collection === "BookIntro" ? (bookIntro ? [bookIntro] : []) : [];
      values.forEach((value) => { value.source = "pray_read_json_import"; });
    }
  }
  const coverage = coverageOf(prayers, refs);
  coverage.forEach((entry) => { if (!entry.ok) warnings.push(`Prayer ${entry.index + 1}: cross-reference coverage is incomplete (${entry.count}/${entry.minimum}); this is a warning only.`); });
  return { ok: errors.length === 0, errors, warnings, rows: { bookNumber, bookName, prayers, crossReferences: refs, chapterIntros: intros, bookIntro, replacementCollections, wholeBookFile: hasBook, backfillOnly: backfill }, coverage };
};

const collectionsOfRows = (rows) => {
  const collections = {};
  const represented = rows?.replacementCollections || [];
  if (represented.includes("PrayerPassage") || rows?.prayers?.length) collections.PrayerPassage = rows?.prayers || [];
  if (represented.includes("CrossReference") || rows?.crossReferences?.length) collections.CrossReference = rows?.crossReferences || [];
  if (represented.includes("ChapterIntro") || rows?.chapterIntros?.length) collections.ChapterIntro = rows?.chapterIntros || [];
  if (represented.includes("BookIntro") || rows?.bookIntro) collections.BookIntro = rows?.bookIntro ? [rows.bookIntro] : [];
  return collections;
};
export const parsePrayerImportText = parseJsonText;
export const importShapeOf = (parsed) => {
  if (Array.isArray(parsed)) return "prayer";
  if (!parsed || typeof parsed !== "object") return null;
  if (Array.isArray(parsed.data) || Array.isArray(parsed.items) || Array.isArray(parsed.prayers) || Array.isArray(parsed.prayer_passages) || Array.isArray(parsed.passages) || parsed.book !== undefined && parsed.chapter !== undefined && parsed.verse !== undefined) return "prayer";
  if (parsed.format === "pray-read-book-v1" || isBookFile(parsed) || parsed.format === PRAYER_FILE_FORMAT || parsed.format === BACKFILL_FILE_FORMAT || Array.isArray(parsed.prayers) || Array.isArray(parsed.prayer_passages) || Array.isArray(parsed.cross_references) || Array.isArray(parsed.crossReferences) || Array.isArray(parsed.chapter_intros) || parsed.book_intro || parsed.bookIntro) return "prayer";
  return null;
};
export const prepareImport = (parsedInput) => {
  const blank = { ok: false, errors: [], warnings: [], collections: {}, bookNumber: 0, bookName: "", rows: null, coverage: [], notes: [] };
  let parsed = parsedInput;
  if (Array.isArray(parsed)) parsed = { format: PRAYER_FILE_FORMAT, prayers: parsed };
  if (!parsed || typeof parsed !== "object") return { ...blank, errors: ["The file must contain a JSON object or prayer rows."] };
  if (!Array.isArray(parsed) && (Array.isArray(parsed.data) || Array.isArray(parsed.items))) parsed = { ...parsed, prayers: parsed.prayers ?? parsed.data ?? parsed.items };
  if (!Array.isArray(parsed) && !Array.isArray(parsed.prayers) && !Array.isArray(parsed.prayer_passages) && !Array.isArray(parsed.passages) && parsed.book !== undefined && parsed.chapter !== undefined && parsed.verse !== undefined) parsed = { format: PRAYER_FILE_FORMAT, book_number: parsed.book, prayers: [parsed] };
  if (importShapeOf(parsed) !== "prayer") return { ...blank, errors: ["The file is not a prayer file and not a book file. Use the template to see the shape."] };
  const validation = validatePrayerFile(parsed);
  if (!validation.ok) return { ...blank, errors: validation.errors, warnings: validation.warnings, bookNumber: validation.rows?.bookNumber || 0, bookName: validation.rows?.bookName || "" };
  const rows = validation.rows;
  return { ok: true, errors: [], warnings: validation.warnings, collections: collectionsOfRows(rows), bookNumber: rows.bookNumber, bookName: rows.bookName, rows, coverage: validation.coverage, notes: [`${rows.prayers.length} prayers and ${rows.crossReferences.length} cross-references for ${rows.bookName}.`] };
};
export const prayerCrossRefCollections = (payload) => {
  const prepared = prepareImport(payload);
  return { ok: prepared.ok, errors: prepared.errors.map((message) => ({ message })), warnings: prepared.warnings.map((message) => ({ message })), collections: prepared.collections };
};
export const prayerTemplateText = () => JSON.stringify({ format: PRAYER_FILE_FORMAT, book_number: 19, book_name: "Psalms", prayers: [], cross_references: [], chapter_intros: [] }, null, 2);
export const missingCrossRefsTemplateText = (validation) => JSON.stringify({ format: BACKFILL_FILE_FORMAT, book_number: validation?.rows?.bookNumber || 19, book_name: validation?.rows?.bookName || "Psalms", cross_references: [] }, null, 2);

export const importPrayerFile = async (payload) => {
  const prepared = prepareImport(payload);
  if (!prepared.ok) throw new Error(prepared.errors.join("\n"));
  const summary = { PrayerPassage: { inserted: 0, updated: 0 }, CrossReference: { inserted: 0, updated: 0 }, ChapterIntro: { inserted: 0, updated: 0 }, BookIntro: { inserted: 0, updated: 0 } };
  const rows = prepared.rows;
  const importRows = async (entity, records, keyFn) => {
    if (!records.length) return;
    const existing = entity === "BookIntro" ? await list(entity, rows.bookNumber) : await list(entity, rows.bookNumber);
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
export const readImportedContent = async (bookNumber) => {
  const [passages, crossReferences, chapterIntros, bookIntros] = await Promise.all([
    list("PrayerPassage", bookNumber).catch(() => []), list("CrossReference", bookNumber).catch(() => []),
    list("ChapterIntro", bookNumber).catch(() => []), list("BookIntro", bookNumber).catch(() => [])
  ]);
  return { passages: passages.map(normalisePassage), crossReferences: crossReferences.map(normaliseCrossRef), chapterIntros: chapterIntros.map(normaliseChapterIntro), bookIntros: bookIntros.map(normaliseBookIntro) };
};