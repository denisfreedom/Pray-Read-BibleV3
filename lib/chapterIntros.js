import { fetchPublicCollection } from "@/lib/contentApi";
import { offline } from "@/lib/offlineDb";
import { fse2 } from "@/api/fse2Client";


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
  book_name: typeof row?.book_name === "string" ? row.book_name : "",
  chapter: numberOr(row && row.chapter),
  title_en: typeof row?.title_en === "string" ? row.title_en : "",
  title_lu: typeof row?.title_lu === "string" ? row.title_lu : "",
  intro_en: typeof row?.intro_en === "string" ? row.intro_en : "",
  intro_lu: typeof row?.intro_lu === "string" ? row.intro_lu : "",
  source: String((row && row.source) || "")
});

/** The key that makes a chapter introduction unique: the chapter it belongs to. */
export const chapterIntroNaturalKey = (intro) =>
  [numberOr(intro.book_number), numberOr(intro.chapter)].join(":");

const readOnline = async (entity, filter, localFilter) => {
  const collection = entity === "ChapterIntro" ? "chapterIntros" : "bookIntros";
  try {
    const rows = await fetchPublicCollection(collection);
    const matches = (Array.isArray(rows) ? rows : []).filter(localFilter);
    if (matches.length) return matches;
  } catch {
    // Use the entity query below if the public collection path is unavailable.
  }
  try {
    const rows = await fse2.entities[entity].filter(filter, "-updated_date", 1000);
    const matches = (Array.isArray(rows) ? rows : []).filter(localFilter);
    if (matches.length) return matches;
  } catch {
    // Legacy rows may be available only through the public collection.
  }
  try {
    const rows = await fetchPublicCollection(collection);
    return (Array.isArray(rows) ? rows : []).filter(localFilter);
  } catch {
    return [];
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
  if (!Number.isInteger(wanted) || wanted < 1 || wanted > 66 || !Number.isInteger(wantedChapter) || wantedChapter < 1) return null;
  const rows = await readOnline(
    "ChapterIntro",
    { book_number: wanted, chapter: wantedChapter },
    (row) => numberOr(row.book_number) === wanted && numberOr(row.chapter) === wantedChapter
  );
  const intros = (rows || []).map(normaliseChapterIntro);
  if (intros.length) {
    offline.put("chapterIntros", chapterIntroKey(wanted, wantedChapter), intros).catch(() => null);
    return intros[0];
  }
  const cached = await offline.get("chapterIntros", chapterIntroKey(wanted, wantedChapter)).catch(() => null);
  if (Array.isArray(cached) && cached.length) return normaliseChapterIntro(cached[0]);
  return null;
};