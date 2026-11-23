import { getBookGuide } from "@/lib/bookGuides";
import { getBookStudyInsights } from "@/lib/bookStudyContent";
import { getBookPrayer } from "@/lib/bookPrayers";
import { getKeyPassages } from "@/lib/keyPassages";
import { parseOutlineRange, parseReference } from "@/lib/scriptureRefs";

// Study material written for one chapter of one book.
//
// The reader keeps three sections open beside a chapter: the introduction to
// that chapter, the commentary on it and the prayer that closes it. Everything
// here is built from the material the app already carries: the outline of the
// book, the published commentary and insight records, the prayer library and
// the key passages of the book.

const MARKER = /\[\[[^\]]+\]\]/g;

const escapeForRegExp = (value) =>
  String(value || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** The division of the book that the given chapter sits in. */
export const getChapterDivision = (book, chapter) => {
  if (!book) return null;
  const guide = getBookGuide(book);
  const outline = (guide && guide.outline) || [];
  const wanted = Number(chapter);
  for (let index = 0; index < outline.length; index += 1) {
    const entry = outline[index];
    const label = entry[0];
    const range = entry[1];
    const parsed = parseOutlineRange(range, book);
    if (!parsed) continue;
    const start = parsed.start.chapter;
    const end = Math.max(parsed.end.chapter, parsed.start.chapter);
    if (wanted >= start && wanted <= end) {
      return {
        index,
        label,
        range,
        start,
        end,
        startLabel: parsed.startLabel,
        endLabel: parsed.endLabel
      };
    }
  }
  return null;
};

/** The key passages of a book that fall inside the given chapter. */
export const getChapterKeyPassages = (book, chapter) => {
  if (!book) return [];
  const wanted = Number(chapter);
  return getKeyPassages(book).filter((label) => {
    const reference = parseReference(label);
    if (!reference) return false;
    if (reference.bookNumber !== Number(book.number)) return false;
    return reference.chapter === wanted;
  });
};

/**
 * The introduction of one chapter: the section of the book it belongs to, the
 * first line of the chapter and the reading it sits in.
 */
export const getChapterIntro = (book, chapter, verses = []) => {
  if (!book) return null;
  const division = getChapterDivision(book, chapter);
  const insights = getBookStudyInsights(book);
  const anchor = verses && verses.length ? verses[0] : null;
  const heading = division ? division.label : `${book.name} ${chapter}`;
  const range = division ? division.range : "";

  const opening = `${book.name} ${chapter} belongs to the section "${heading}"${range ? ` (${range})` : ""}.`;
  const context = (insights.theological && insights.theological.body) || "";
  const body = [opening, context].filter(Boolean).join(" ");

  return {
    heading,
    range,
    body,
    anchor,
    verseCount: verses.length,
    division
  };
};

/**
 * The commentary of one chapter: what the content manager published for it,
 * the insights written about the passage, the place of the chapter in the
 * outline and, when the chapter has nothing of its own, the study notes of
 * the book.
 */
export const getChapterCommentary = (book, chapter, { commentary = [], insights = [] } = {}) => {
  if (!book) return [];
  const notes = [];
  const wantedBook = Number(book.number);
  const wantedChapter = Number(chapter);
  const bookName = String(book.name || "").toLowerCase();

  (commentary || []).forEach((row) => {
    if (!row) return;
    const sameBook = String(row.book || "").trim().toLowerCase() === bookName;
    if (!sameBook) return;
    if (Number(row.chapter) !== wantedChapter) return;
    const body = row.body_en || row.body || "";
    if (!body) return;
    notes.push({
      kind: "commentary",
      badge: `Chapter ${wantedChapter}`,
      title: row.title || `Commentary on ${book.name} ${wantedChapter}`,
      body,
      bodyLu: row.body_lu || ""
    });
  });

  (insights || []).forEach((row) => {
    if (!row) return;
    const reference = parseReference(row.passage);
    if (!reference) return;
    if (reference.bookNumber !== wantedBook) return;
    if (reference.chapter !== wantedChapter) return;
    const body = row.excerpt || row.body || "";
    if (!body) return;
    notes.push({
      kind: row.kind || "insight",
      badge: row.passage,
      title: row.title || `Insight on ${row.passage}`,
      body,
      bodyLu: ""
    });
  });

  const division = getChapterDivision(book, chapter);
  if (division) {
    notes.push({
      kind: "outline",
      badge: division.range,
      title: division.label,
      body: `${book.name} ${chapter} sits inside the part of ${book.name} that runs from ${division.startLabel} to ${division.endLabel}.`,
      bodyLu: ""
    });
  }

  if (notes.length < 2) {
    const insightsForBook = getBookStudyInsights(book);
    notes.push({
      kind: "theological",
      badge: "Theological",
      title: insightsForBook.theological.title,
      body: insightsForBook.theological.body,
      bodyLu: ""
    });
    notes.push({
      kind: "historical",
      badge: "Historical",
      title: insightsForBook.historical.title,
      body: insightsForBook.historical.body,
      bodyLu: ""
    });
  }

  return notes;
};

const adaptPrayer = (text, book, chapter, anchor) => {
  if (!text) return "";
  let out = String(text).replace(MARKER, anchor);
  out = out.replace(
    new RegExp(`as I read ${escapeForRegExp(book.name)}\\b`),
    `as I read ${book.name} ${chapter}`
  );
  out = out.replace(
    new RegExp(`nga nsoma ${escapeForRegExp(book.name)}\\b`),
    `nga nsoma ${book.name} ${chapter}`
  );
  return out;
};

/**
 * The prayer that closes one chapter: the prayers of the library that are
 * written for this passage, or, when there is none, the prayer of the book
 * pointed at the first verse of the chapter.
 */
export const getChapterPrayer = (book, chapter, { prayers = [] } = {}) => {
  if (!book) return [];
  const list = [];
  const wantedBook = Number(book.number);
  const wantedChapter = Number(chapter);

  (prayers || []).forEach((row) => {
    if (!row) return;
    const reference = parseReference(row.scripture_ref);
    if (!reference) return;
    if (reference.bookNumber !== wantedBook) return;
    if (reference.chapter !== wantedChapter) return;
    const body = row.body_en || row.body || "";
    if (!body) return;
    list.push({
      title: row.title || `A prayer for ${book.name} ${wantedChapter}`,
      titleLu: row.title_lu || "",
      body,
      bodyLu: row.body_lu || "",
      ref: row.scripture_ref,
      source: "library"
    });
  });

  if (!list.length) {
    const prayer = getBookPrayer(book);
    const anchor = `${book.name} ${wantedChapter}:1`;
    list.push({
      title: `Closing prayer for ${book.name} ${wantedChapter}`,
      titleLu: prayer.title || "",
      body: adaptPrayer(prayer.body, book, wantedChapter, anchor),
      bodyLu: adaptPrayer(prayer.body_lu, book, wantedChapter, anchor),
      ref: anchor,
      source: "chapter"
    });
  }

  return list;
};