import { fetchPublicCollection } from "@/lib/contentApi";
import { offline } from "@/lib/offlineDb";
import { fse2 } from "@/api/fse2Client";
import { resolveBook } from "@/lib/scriptureRefs";


// The prayer passages and the cross-references of a chapter.
//
// The content manager imports them book by book from the prayer passage
// JSON files. The reader asks for the chapter it has open and gets the
// passages written for that chapter and the cross-references of every
// verse in it.
//
// A passage belongs to a chapter. When it is written for one verse it
// belongs to that verse, and when it is written for a run of verses it
// belongs to the whole run. A passage with no verse is the prayer that
// closes the chapter.

export const passageKey = (bookNumber, chapter) => `${bookNumber}:${chapter}`;
export const crossRefKey = (bookNumber, chapter) => `${bookNumber}:${chapter}`;

const numberOr = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

/** A prayer passage as the reader needs it. Zero means "the whole chapter". */
export const normalisePassage = (row) => {
  const verse = numberOr(row && row.verse);
  const verseEnd = numberOr(row && row.verse_end);
  const closingSource = String((row && row.source) || "").toLowerCase();
  const isClosing = closingSource.includes("closing");
  return {
    id: (row && row.id) || "",
    book_number: numberOr(row && row.book_number),
    book_name: String((row && row.book_name) || ""),
    chapter: numberOr(row && row.chapter),
    verse: isClosing || verse <= 0 ? null : verse,
    verse_end: isClosing || verseEnd <= 0 ? null : verseEnd,
    title_en: String((row && row.title_en) || ""),
    title_lu: String((row && row.title_lu) || ""),
    prayer_en: String((row && row.prayer_en) || ""),
    prayer_lu: String((row && row.prayer_lu) || ""),
    scripture_ref: String((row && row.scripture_ref) || ""),
    source: String((row && row.source) || "")
  };
};

/** A cross-reference as the reader needs it. */
export const normaliseCrossRef = (row) => ({
  id: (row && row.id) || "",
  book_number: numberOr(row && row.book_number),
  chapter: numberOr(row && row.chapter),
  verse: numberOr(row && row.verse),
  ref_book_number: numberOr(row && row.ref_book_number),
  ref_chapter: numberOr(row && row.ref_chapter),
  ref_verse: numberOr(row && row.ref_verse),
  ref_verse_end: numberOr(row && row.ref_verse_end),
  unresolved: Boolean(row && row.unresolved),
  reference_text: typeof row?.reference_text === "string" ? row.reference_text : "",
  ref_text_en: typeof row?.ref_text_en === "string" ? row.ref_text_en : "",
  ref_text_lu: typeof row?.ref_text_lu === "string" ? row.ref_text_lu : "",
  note_en: typeof row?.note_en === "string" ? row.note_en : "",
  note_lu: typeof row?.note_lu === "string" ? row.note_lu : "",
  source: String((row && row.source) || "")
});

/**
 * The key that makes a prayer passage unique: the place the prayer sits.
 *
 * The prayer of a verse is the prayer of that verse, so the file is
 * matched on the place and not on the words. A file that is imported again
 * with a prayer that was reworded changes the prayer that is already in
 * the app instead of leaving a second copy of it behind.
 */
export const passageNaturalKey = (passage) =>
  [
    numberOr(passage.book_number),
    numberOr(passage.chapter),
    numberOr(passage.verse),
    numberOr(passage.verse_end),
    String(passage.source || "").startsWith("book_import:chapter_closing") ? "chapter_closing" : String(passage.source || "").startsWith("book_import:book_closing") ? "book_closing" : "passage"
  ].join(":");

/** The key that makes a cross-reference unique. */
export const crossRefNaturalKey = (reference) =>
  [
    numberOr(reference.book_number),
    numberOr(reference.chapter),
    numberOr(reference.verse),
    numberOr(reference.ref_book_number),
    numberOr(reference.ref_chapter),
    numberOr(reference.ref_verse),
    numberOr(reference.ref_verse_end),
    String(reference.reference_text || "").trim().toLowerCase()
  ].join(":");

const readOnline = async (entity, filter, localFilter) => {
  const collection = entity === "PrayerPassage" ? "prayerPassages" : "crossReferences";
  try {
    const rows = await fetchPublicCollection(collection);
    const matches = (Array.isArray(rows) ? rows : []).filter(localFilter);
    if (matches.length) return matches;
  } catch {
    // Use the entity query below when the public collection path is unavailable.
  }
  try {
    const rows = await fse2.entities[entity].filter(filter, "-updated_date");
    const matches = (Array.isArray(rows) ? rows : []).filter(localFilter);
    if (matches.length) return matches;
  } catch {
    // Try the public collection for legacy rows with aliases or missing numeric keys.
  }
  try {
    const rows = await fetchPublicCollection(collection);
    return (Array.isArray(rows) ? rows : []).filter(localFilter);
  } catch {
    return [];
  }
};

/**
 * The prayer passages of one chapter.
 * What the app holds is asked for first. When the connection gives way the
 * copy that was kept on the device is used, so the prayer of a chapter is
 * still there in flight mode.
 */
export const fetchChapterPassages = async (bookNumber, chapter) => {
  const wanted = Number(bookNumber);
  const wantedChapter = Number(chapter);
  if (!Number.isInteger(wanted) || wanted < 1 || wanted > 66 || !Number.isInteger(wantedChapter) || wantedChapter < 1) return [];
  const rows = await readOnline(
    "PrayerPassage",
    { book_number: wanted, chapter: wantedChapter },
    (row) => (numberOr(row.book_number) === wanted || resolveBook(row.book_name ?? row.book)?.number === wanted) && numberOr(row.chapter) === wantedChapter
  );
  const passages = (rows || []).map(normalisePassage);
  if (passages.length) {
    offline.put("prayerPassages", passageKey(wanted, wantedChapter), passages).catch(() => null);
    return passages;
  }
  const cached = await offline.get("prayerPassages", passageKey(wanted, wantedChapter)).catch(() => null);
  return Array.isArray(cached) ? cached : [];
};

/**
 * The cross-references of one chapter.
 * The copy on the device is used when the app cannot be reached.
 */
export const fetchChapterCrossRefs = async (bookNumber, chapter) => {
  const wanted = Number(bookNumber);
  const wantedChapter = Number(chapter);
  if (!Number.isInteger(wanted) || wanted < 1 || wanted > 66 || !Number.isInteger(wantedChapter) || wantedChapter < 1) return [];
  const rows = await readOnline(
    "CrossReference",
    { book_number: wanted, chapter: wantedChapter },
    (row) => (numberOr(row.book_number) === wanted || resolveBook(row.book_name ?? row.book)?.number === wanted) && numberOr(row.chapter) === wantedChapter
  );
  const references = (rows || []).map(normaliseCrossRef);
  if (references.length) {
    offline.put("crossReferences", crossRefKey(wanted, wantedChapter), references).catch(() => null);
    return references;
  }
  const cached = await offline.get("crossReferences", crossRefKey(wanted, wantedChapter)).catch(() => null);
  return Array.isArray(cached) ? cached : [];
};

/**
 * The prayer that belongs to a verse.
 * The passage written for that verse comes first, then the passage that
 * covers it. Chapter-closing prayers are not returned here.
 */
export const pickPassageForVerse = (passages, verse) => {
  const rows = passages || [];
  if (!rows.length) return null;
  const wanted = Number(verse);
  const eligible = rows.filter((row) => row.verse !== null && row.verse !== undefined);
  const exact = eligible.find((row) => row.verse === wanted);
  if (exact) return exact;
  const covering = eligible.find(
    (row) => row.verse <= wanted && row.verse_end !== null && row.verse_end >= wanted
  );
  if (covering) return covering;
  return null;
};

/**
 * Every prayer passage written for a verse.
 * The passage written for that verse comes first, then the passages that
 * cover it. The prayer of the whole chapter is left out: it closes the
 * chapter and is shown at the end of it.
 */
export const pickPassagesForVerse = (passages, verse) => {
  const rows = passages || [];
  if (!rows.length) return [];
  const wanted = Number(verse);
  const eligible = rows.filter((row) => row.verse !== null && row.verse !== undefined);
  const exact = eligible.filter((row) => row.verse === wanted);
  const covering = eligible.filter(
    (row) => row.verse <= wanted && row.verse_end !== null && row.verse_end >= wanted
  );
  return [...exact, ...covering];
};

/**
 * The prayer that closes a chapter.
 *
 * The prayer that was imported as the closing prayer of the chapter is
 * marked with the source "book_import:chapter_closing", so it can be told
 * apart from a prayer that was written for the whole chapter. The marked
 * prayer is the one that closes the chapter.
 */
export const pickChapterPassage = (passages) => {
  const rows = passages || [];
  const marked = rows.find(
    (row) => row.verse === null && String(row.source || "").startsWith("book_import:chapter_closing")
  );
  if (marked) return marked;
  return rows.find((row) => row.verse === null && !String(row.source || "").startsWith("book_import:book_closing")) || null;
};

/** The cross-references of one verse, in the order they were written. */
export const pickCrossRefsForVerse = (references, verse) => {
  const wanted = Number(verse);
  return (references || []).filter((row) => Number(row.verse) === wanted);
};

/** The cross-references of a chapter, grouped by the verse they belong to. */
export const groupCrossRefsByVerse = (references) => {
  const groups = new Map();
  (references || []).forEach((row) => {
    const verse = Number(row.verse);
    if (!groups.has(verse)) groups.set(verse, []);
    groups.get(verse).push(row);
  });
  return Array.from(groups.entries())
    .sort((first, second) => first[0] - second[0])
    .map(([verse, rows]) => ({ verse, rows }));
};