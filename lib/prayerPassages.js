import { fse2 } from "@/api/fse2Client";
import { offline } from "@/lib/offlineDb";

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
  return {
    id: (row && row.id) || "",
    book_number: numberOr(row && row.book_number),
    book_name: String((row && row.book_name) || ""),
    chapter: numberOr(row && row.chapter),
    verse: verse > 0 ? verse : null,
    verse_end: verseEnd > 0 ? verseEnd : null,
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
  ref_text_en: String((row && row.ref_text_en) || ""),
  ref_text_lu: String((row && row.ref_text_lu) || ""),
  note_en: String((row && row.note_en) || ""),
  note_lu: String((row && row.note_lu) || ""),
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
    numberOr(passage.verse_end)
  ].join(":");

/** The key that makes a cross-reference unique. */
export const crossRefNaturalKey = (reference) =>
  [
    numberOr(reference.book_number),
    numberOr(reference.chapter),
    numberOr(reference.verse),
    numberOr(reference.ref_book_number),
    numberOr(reference.ref_chapter),
    numberOr(reference.ref_verse)
  ].join(":");

const readOnline = async (entity, filter, localFilter) => {
  try {
    const rows = await fse2.entities[entity].filter(filter);
    return Array.isArray(rows) ? rows : [];
  } catch {
    try {
      const rows = await fse2.entities[entity].list("-updated_date", 1000);
      return (Array.isArray(rows) ? rows : []).filter(localFilter);
    } catch {
      return [];
    }
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
  const rows = await readOnline(
    "PrayerPassage",
    { book_number: wanted, chapter: wantedChapter },
    (row) => numberOr(row.book_number) === wanted && numberOr(row.chapter) === wantedChapter
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
  const rows = await readOnline(
    "CrossReference",
    { book_number: wanted, chapter: wantedChapter },
    (row) => numberOr(row.book_number) === wanted && numberOr(row.chapter) === wantedChapter
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
 * covers it, and the prayer of the whole chapter is the last one.
 */
export const pickPassageForVerse = (passages, verse) => {
  const rows = passages || [];
  if (!rows.length) return null;
  const wanted = Number(verse);
  const exact = rows.find((row) => row.verse === wanted);
  if (exact) return exact;
  const covering = rows.find(
    (row) => row.verse !== null && row.verse <= wanted && row.verse_end !== null && row.verse_end >= wanted
  );
  if (covering) return covering;
  const chapter = rows.find((row) => row.verse === null);
  if (chapter) return chapter;
  return null;
};

/** The prayer that closes a chapter. */
export const pickChapterPassage = (passages) => {
  const rows = passages || [];
  return rows.find((row) => row.verse === null) || null;
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