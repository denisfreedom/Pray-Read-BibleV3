import { fetchPublicCollection } from "@/lib/contentApi";
import { offline } from "@/lib/offlineDb";
import { fse2 } from "@/api/fse2Client";
import { bilingualText } from "@/lib/bilingual";


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
  title_en: bilingualText(row?.title_en, "en", ""),
  title_lu: bilingualText(row?.title_lu, "lu", ""),
  intro_en: bilingualText(row?.intro_en, "en", ""),
  intro_lu: bilingualText(row?.intro_lu, "lu", ""),
  source: String((row && row.source) || "")
});

/** The key that makes a chapter introduction unique: the chapter it belongs to. */
export const chapterIntroNaturalKey = (intro) =>
  [numberOr(intro.book_number), numberOr(intro.chapter)].join(":");

const readOnline = async (entity, filter, localFilter) => {
  const collection = entity === "ChapterIntro" ? "chapterIntros" : "bookIntros";
  try {
    const rows = await fetchPublicCollection(collection);
    const matches = (Array.isArray(rows) ? rows : []).filter((row) => localFilter(row) || (row.book_name && Number(row.book_number || filter.book_number) === Number(filter.book_number) && Number(row.chapter) === Number(filter.chapter)));
    if (matches.length) return matches;
  } catch {
    // Use the entity query below if the public collection path is unavailable.
  }
  const output = [];
  let offset = 0;
  while (true) {
    const page = await fse2.entities[entity].list("-updated_date", 500, offset).catch(() => []);
    const records = page || [];
    output.push(...records.filter(localFilter));
    if (records.length < 500) break;
    offset += records.length;
  }
  return output;
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