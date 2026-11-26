import { fse2 } from "@/api/fse2Client";

// The introduction and the closing prayer that were imported for a book.
//
// The content manager imports them from the book file, so the reader sees
// the words the writer wrote for that book instead of the summary the app
// builds on its own. When the app holds nothing for the book, the reader
// falls back to the text the app can build.

export const bookIntroKey = (bookNumber) => `bookintro:${bookNumber}`;

/** A book introduction as the reader needs it. */
export const normaliseBookIntro = (row) => ({
  id: (row && row.id) || "",
  book_number: Number((row && row.book_number) || 0),
  book_name: String((row && row.book_name) || ""),
  title_en: String((row && row.title_en) || ""),
  title_lu: String((row && row.title_lu) || ""),
  intro_en: String((row && row.intro_en) || ""),
  intro_lu: String((row && row.intro_lu) || ""),
  closing_prayer_en: String((row && row.closing_prayer_en) || ""),
  closing_prayer_lu: String((row && row.closing_prayer_lu) || "")
});

/** The imported introduction and closing prayer of one book. */
export const fetchBookIntro = async (bookNumber) => {
  const wanted = Number(bookNumber);
  if (!wanted) return null;
  const rows = await fse2.entities.BookIntro.list("-updated_date", 200).catch(() => []);
  const row = (rows || []).find((item) => Number(item.book_number) === wanted);
  return row ? normaliseBookIntro(row) : null;
};