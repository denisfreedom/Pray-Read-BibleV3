import { fse2 } from "@/api/fse2Client";
import { toISODate } from "@/lib/reading";
import { PLAN_DAYS } from "@/lib/planData";

// Reading progress, matching the legacy "reading progress" service of the
// original Pray-Read app: a completed chapter is stored against the reader
// and, when the chapter belongs to the thirty day plan, that plan day is
// closed as well.

/** The plan day that covers this book and chapter, when there is one. */
export const findPlanDay = (planRows, book, chapter) => {
  const rows = planRows && planRows.length ? planRows : PLAN_DAYS;
  const target = String(book || "").trim().toLowerCase();
  const match = rows.find((row) => {
    const rowBook = String(row.book || "").trim().toLowerCase();
    return rowBook === target && Number(row.chapter) === Number(chapter);
  });
  return match ? Number(match.day) : null;
};

/** Stores one completed chapter for the signed-in reader. */
export const recordReading = async ({ email, book, chapter, translation, planDay }) => {
  if (!email || !book || !chapter) return null;
  try {
    return await fse2.entities.Reading.create({
      owner_email: email,
      book,
      chapter: Number(chapter),
      translation: translation || "en",
      plan_day: planDay || null,
      read_date: toISODate(),
      status: "completed"
    });
  } catch {
    return null;
  }
};