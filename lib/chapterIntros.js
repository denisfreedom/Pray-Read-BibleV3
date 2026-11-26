import { fse2 } from "@/api/fse2Client";
import { offline } from "@/lib/offlineDb";

// The introduction written for one chapter of one book.
//
// The content manager imports it from the book file, so the reader sees
// the words the writer wrote for that chapter instead of the summary the
// app can build on its own. When the app holds no introduction for the
// chapter, the reader falls back to the summary it can build.

export const chapterIntroKey = (bookNumber, chapter) => `${bookNumber}:${chapter}`;

const numberOr = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

/** A chapter introduction as the reader needs it. */
export const normaliseChapterIntro = (row) => ({
  id: (row && row.id) || "",
  book_number: numberOr(row && row.book_number),
  book_name: String((row && row.book_name) || ""),
  chapter: numberOr(row && row.chapter),
  title_en: String((row && row.title_en) || ""),
  title_lu: String((row && row.title_lu) || ""),
  intro_en: String((row && row.intro_en) || ""),
  intro_lu: String((row && row.intro_lu) || ""),
  source: String((row && row.source) || "")
});

/** The key that makes a chapter introduction unique: the chapter it belongs to. */
export const chapterIntroNaturalKey = (intro) =>
  [numberOr(intro.book_number), numberOr(intro.chapter)].join(":");

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
 * The introduction of one chapter.
 * What the app holds is asked for first, the copy kept on the device is
 * used when the connection gives way.
 */
export const fetchChapterIntro = async (bookNumber, chapter) => {
  const wanted = Number(bookNumber);
  const wantedChapter = Number(chapter);
  if (!wanted || !wantedChapter) return null;
  const rows = await readOnline(
    "ChapterIntro",
    { book_number: wanted, chapter: wantedChapter },
    (row) => numberOr(row.book_number) === wanted && numberOr(row.chapter) === wantedChapter
  );
  const intros = (rows || []).map(normaliseChapterIntro).filter((row) => row.intro_en || row.intro_lu);
  if (intros.length) {
    offline.put("chapterIntros", chapterIntroKey(wanted, wantedChapter), intros).catch(() => null);
    return intros[0];
  }
  const cached = await offline.get("chapterIntros", chapterIntroKey(wanted, wantedChapter)).catch(() => null);
  if (Array.isArray(cached) && cached.length) return normaliseChapterIntro(cached[0]);
  return null;
};