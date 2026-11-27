import { fetchPublicCollection } from "@/lib/contentApi";
import { resolveBook } from "@/lib/scriptureRefs";
import { fse2 } from "@/api/fse2Client";


// The introduction and the closing prayer that were imported for a book.
//
// The content manager imports them from the book file, so the reader sees
// the words the writer wrote for that book instead of the summary the app
// builds on its own. When the app holds nothing for the book, the reader
// falls back to the text the app can build.

export const bookIntroKey = (bookNumber) => `bookintro:${bookNumber}`;
export const bookIntroNaturalKey = (row) => {
  const number = Number(row?.book_number);
  return String(Number.isInteger(number) && number >= 1 && number <= 66 ? number : 0);
};

const plainText = (value) => typeof value === "string" ? value : "";
const languageText = (value, language) => {
  if (typeof value === "string") return language === "lu" ? "" : value;
  if (!value || typeof value !== "object" || Array.isArray(value)) return "";
  const keys = language === "lu" ? ["lu", "luganda", "text_lu", "intro_lu", "prayer_lu", "body_lu"] : ["en", "english", "text_en", "intro_en", "prayer_en", "body_en"];
  for (const key of keys) if (typeof value[key] === "string" && value[key].trim()) return value[key].trim();
  return "";
};

/** A book introduction as the reader needs it. */
export const normaliseBookIntro = (row) => ({
  id: (row && row.id) || "",
  book_number: Number((row && row.book_number) || 0),
  book_name: plainText(row && row.book_name),
  title_en: plainText(row && row.title_en),
  title_lu: plainText(row && row.title_lu),
  intro_en: plainText(row && row.intro_en),
  intro_lu: plainText(row && row.intro_lu),
  closing_prayer_en: plainText(row && row.closing_prayer_en),
  closing_prayer_lu: plainText(row && row.closing_prayer_lu)
});

/**
 * The imported introduction and closing prayer of one book.
 *
 * The book is asked for by its number, so a book that was imported long
 * ago is found as well as the one that was imported yesterday. The row is
 * handed back as it is, even when it is empty, so the reader can tell
 * "imported, but empty" apart from "never imported".
 */
export const fetchBookIntro = async (bookNumber) => {
  const wanted = Number(bookNumber);
  if (!Number.isInteger(wanted) || wanted < 1 || wanted > 66) return null;
  let rows = [];
  try {
    rows = await fse2.entities.BookIntro.filter({ book_number: wanted }, "-updated_date");
    if (!(rows || []).length) rows = await fetchPublicCollection("bookIntros");
  } catch {
    try {
      rows = await fetchPublicCollection("bookIntros");
    } catch {
      rows = [];
    }
  }
  const row = (rows || []).find((item) => Number(item.book_number) === wanted);
  return row ? normaliseBookIntro(row) : null;
};