import { fse2 } from "@/api/fse2Client";

// Reader activity, kept close to the legacy "ActivityFeed" of the original
// Pray-Read app: every chapter the reader opens, every highlight, bookmark
// and note is written against their own account and shown on the dashboard.

export const ACTIVITY_TYPES = {
  chapter_visit: "Read a chapter",
  highlight: "Highlighted a verse",
  bookmark: "Bookmarked a verse",
  note_saved: "Wrote a note",
  prayer_opened: "Opened a prayer",
  devotional_access: "Opened a devotional"
};

export const ACTIVITY_ICONS = {
  chapter_visit: "book",
  highlight: "highlighter",
  bookmark: "bookmark",
  note_saved: "note",
  prayer_opened: "prayer",
  devotional_access: "devotional"
};

/**
 * Writes one activity row for the signed-in reader.
 * Logging must never interrupt reading, so every failure is swallowed.
 */
export const logReadingActivity = async ({ email, type, book, bookNumber, chapter, verse }) => {
  if (!email || !type) return null;
  try {
    return await fse2.entities.ReadingActivity.create({
      owner_email: email,
      activity_type: type,
      book: book || "",
      book_number: bookNumber || null,
      chapter: chapter || null,
      verse: verse || null
    });
  } catch {
    return null;
  }
};

/** Human label for one activity row. */
export const activityLabel = (row) => {
  const base = ACTIVITY_TYPES[row?.activity_type] || "Reading";
  if (!row?.book) return base;
  if (!row.chapter) return `${base} · ${row.book}`;
  if (!row.verse) return `${base} · ${row.book} ${row.chapter}`;
  return `${base} · ${row.book} ${row.chapter}:${row.verse}`;
};