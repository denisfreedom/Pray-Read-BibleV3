import { getBook } from "@/lib/bibleBooks";
import { createPageUrl } from "@/utils";

// Scripture references used by the reader sidebar: the key passages of a
// book, the outline divisions and the verses quoted inside a book prayer.
//
// References are written the way people write them ("John 3:16",
// "Philippians 4:6-7", "Psalm 46:1") and are resolved to a real book of the
// Bible so the reader can open them without leaving the page.

const ALIASES = {
  psalm: "Psalms",
  ps: "Psalms",
  song: "Song of Solomon",
  "song of songs": "Song of Solomon",
  "1 cor": "1 Corinthians",
  "2 cor": "2 Corinthians",
  "1 thess": "1 Thessalonians",
  "2 thess": "2 Thessalonians",
  "1 tim": "1 Timothy",
  "2 tim": "2 Timothy",
  "1 pet": "1 Peter",
  "2 pet": "2 Peter",
  "1 john": "1 John",
  "2 john": "2 John",
  "3 john": "3 John",
  phil: "Philippians",
  phils: "Philippians",
  rev: "Revelation"
};

/** Finds the canonical book for a written name, including short forms. */
export const resolveBook = (name) => {
  const raw = String(name || "").trim();
  if (!raw) return null;
  const direct = getBook(raw);
  if (direct) return direct;
  const alias = ALIASES[raw.toLowerCase()];
  if (alias) {
    const aliased = getBook(alias);
    if (aliased) return aliased;
  }
  const plural = getBook(`${raw}s`);
  if (plural) return plural;
  return null;
};

const REFERENCE_PATTERN = /^(.+?)\s+(\d+)(?::(\d+))?(?:\s*[- - ]\s*(\d+)(?::(\d+))?)?$/;

/**
 * Turns a written reference into the pieces the reader needs:
 * the book, the chapter, the first verse and the last verse of a range.
 */
export const parseReference = (text) => {
  const raw = String(text || "").trim().replace(/\s+/g, " ");
  if (!raw) return null;
  const match = raw.match(REFERENCE_PATTERN);
  if (!match) return null;
  const book = resolveBook(match[1]);
  if (!book) return null;
  const chapter = Number(match[2]);
  const verse = match[3] ? Number(match[3]) : null;
  const endChapter = match[4] ? Number(match[4]) : null;
  const endVerse = match[5] ? Number(match[5]) : null;
  let lastChapter = chapter;
  let lastVerse = verse;
  if (endChapter !== null) {
    lastChapter = endChapter;
    lastVerse = endVerse !== null ? endVerse : (verse !== null && !endVerse ? endChapter : null);
    if (endVerse === null && verse !== null) {
      lastVerse = endChapter;
      lastChapter = chapter;
    }
  }
  return {
    bookNumber: book.number,
    bookName: book.name,
    luganda: book.luganda,
    chapter,
    verse,
    endChapter: lastChapter,
    endVerse: lastVerse,
    label: raw
  };
};

/** The label used when a reference is shown on its own. */
export const referenceLabel = (reference) => {
  if (!reference) return "";
  const start = reference.verse ? `${reference.bookName} ${reference.chapter}:${reference.verse}` : `${reference.bookName} ${reference.chapter}`;
  if (!reference.endVerse || reference.endVerse === reference.verse) return start;
  if (reference.endChapter && reference.endChapter !== reference.chapter) {
    return `${start}-${reference.endChapter}:${reference.endVerse}`;
  }
  return `${start}-${reference.endVerse}`;
};

/**
 * The reader page of a written reference, so a passage opens where it
 * belongs instead of always opening the same chapter.
 */
export const chapterLink = (text) => {
  const reference = parseReference(text);
  if (!reference) return "";
  return `${createPageUrl("Chapter")}?book=${reference.bookNumber}&chapter=${reference.chapter}`;
};

/**
 * Splits a list of scripture references into single references.
 * The app keeps them on one line ("John 3:16, Psalm 23:1"), but a JSON file
 * may carry them as a real list, so both are accepted.
 */
export const splitRefs = (value) => {
  const source = Array.isArray(value) ? value.join(", ") : String(value || "");
  return source
    .split(/[,;\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
};

/** Joins the references back into the one line the app keeps. */
export const joinRefs = (list) =>
  (Array.isArray(list) ? list : splitRefs(list))
    .map((item) => String(item || "").trim())
    .filter(Boolean)
    .join(", ");

/**
 * Splits a prayer body that carries [[Book 1:1]] markers into plain text and
 * the list of references the markers stand for.
 */
export const buildInlineNodes = (text) => {
  const source = String(text || "");
  const pattern = /\[\[([^\]]+)\]\]/g;
  const nodes = [];
  let plain = "";
  let cursor = 0;
  let match = pattern.exec(source);
  while (match) {
    plain += source.slice(cursor, match.index);
    const ref = match[1].trim();
    const start = plain.length;
    plain += ref;
    nodes.push({ start, end: start + ref.length, ref });
    cursor = match.index + match[0].length;
    match = pattern.exec(source);
  }
  plain += source.slice(cursor);
  return { text: plain, nodes };
};

const rangePoint = (piece) => {
  const match = String(piece || "").match(/^(\d+)(?::(\d+))?$/);
  if (!match) return null;
  return { chapter: Number(match[1]), verse: match[2] ? Number(match[2]) : null };
};

/**
 * Reads an outline division such as "1:1-2:25", "3:1-10" or "1-16" and
 * returns the exact passage it covers.
 */
export const parseOutlineRange = (rangeText, book) => {
  const raw = String(rangeText || "").trim().replace(/\s+/g, " ");
  if (!raw) return null;
  const pieces = raw.split(/\s*[- - ]\s*/);
  const first = rangePoint(pieces[0]);
  if (!first) return null;
  const second = pieces.length > 1 ? rangePoint(pieces[1]) : null;
  const singleChapterBook = book && Number(book.chapters) === 1;
  let start;
  let end;
  if (first.verse === null && second) {
    if (singleChapterBook) {
      start = { chapter: 1, verse: first.chapter };
      end = { chapter: 1, verse: second.chapter };
    } else {
      start = { chapter: first.chapter, verse: 1 };
      end = { chapter: second.chapter, verse: 1 };
    }
  } else if (first.verse === null) {
    start = { chapter: first.chapter, verse: 1 };
    end = { chapter: first.chapter, verse: 1 };
  } else if (second && second.verse === null) {
    start = { chapter: first.chapter, verse: first.verse };
    end = { chapter: first.chapter, verse: second.chapter };
  } else if (second) {
    start = { chapter: first.chapter, verse: first.verse };
    end = { chapter: second.chapter, verse: second.verse };
  } else {
    start = { chapter: first.chapter, verse: first.verse };
    end = { chapter: first.chapter, verse: first.verse };
  }
  return {
    start,
    end,
    text: raw,
    startLabel: `${start.chapter}:${start.verse}`,
    endLabel: `${end.chapter}:${end.verse}`
  };
};