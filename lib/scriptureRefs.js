import { getBook } from "@/lib/bibleBooks";
import { createPageUrl } from "@/utils";

// Scripture references used by the reader sidebar: the key passages of a
// book, the outline divisions and the verses quoted inside a book prayer.
//
// References are written the way people write them ("John 3:16",
// "Philippians 4:6-7", "Psalm 46:1") and are resolved to a real book of the
// Bible so the reader can open them without leaving the page.

const ALIASES = {
  obad: "Obadiah", obadiah: "Obadiah", oba: "Obadiah", ob: "Obadiah", jid: "Jude", jhn: "John",
  gen: "Genesis", ge: "Genesis", ex: "Exodus", exod: "Exodus", lev: "Leviticus", num: "Numbers", deut: "Deuteronomy",
  josh: "Joshua", judg: "Judges", ruth: "Ruth", esth: "Esther", job: "Job", prov: "Proverbs", ecc: "Ecclesiastes",
  isa: "Isaiah", jer: "Jeremiah", lam: "Lamentations", ezek: "Ezekiel", dan: "Daniel", hos: "Hosea", obad: "Obadiah",
  jonah: "Jonah", mic: "Micah", nah: "Nahum", hab: "Habakkuk", zeph: "Zephaniah", hag: "Haggai", zech: "Zechariah", mal: "Malachi",
  matt: "Matthew", mt: "Matthew", mark: "Mark", mk: "Mark", luke: "Luke", lk: "Luke", john: "John", acts: "Acts",
  rom: "Romans", gal: "Galatians", eph: "Ephesians", col: "Colossians", heb: "Hebrews", jas: "James", jam: "James",
  jude: "Jude", rev: "Revelation", psalm: "Psalms",
  ps: "Psalms",
  psalms: "Psalms",
  song: "Song of Solomon",
  "song of songs": "Song of Solomon",
  "song of solomon": "Song of Solomon",
  "first kings": "1 Kings",
  "second kings": "2 Kings",
  "first chronicles": "1 Chronicles",
  "second chronicles": "2 Chronicles",
  "first samuel": "1 Samuel",
  "second samuel": "2 Samuel",
  "first peter": "1 Peter",
  "second peter": "2 Peter",
  "first john": "1 John",
  "second john": "2 John",
  "third john": "3 John",
  "first corinthians": "1 Corinthians",
  "second corinthians": "2 Corinthians",
  "first thessalonians": "1 Thessalonians",
  "second thessalonians": "2 Thessalonians",
  "first timothy": "1 Timothy",
  "second timothy": "2 Timothy",
  revelations: "Revelation",
  canticles: "Song of Solomon",
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
  rev: "Revelation",
  eccl: "Ecclesiastes",
  ecclesiastes: "Ecclesiastes"
};

/** Finds the canonical book for a written name, including short forms. */
export const resolveBook = (name) => {
  const raw = String(name || "").trim();
  if (!raw) return null;
  if (/^\d{1,2}$/.test(raw)) {
    const numbered = Number(raw);
    return numbered >= 1 && numbered <= 66 ? getBook(String(numbered)) || null : null;
  }
  const direct = getBook(raw);
  if (direct) return direct;
  const normalized = raw.toLowerCase().replace(/[.\s]/g, "");
  const alias = ALIASES[raw.toLowerCase()] || ALIASES[normalized];
  if (alias) {
    const aliased = getBook(alias);
    if (aliased) return aliased;
  }
  // "the Song of Songs" is the same book as "Song of Songs", and "the First
  // Kings" is the same book as "First Kings".
  const withoutThe = raw.replace(/^the\s+/i, "").trim();
  if (withoutThe && withoutThe !== raw) {
    const stripped = getBook(withoutThe);
    if (stripped) return stripped;
    const strippedAlias = ALIASES[withoutThe.toLowerCase()] || ALIASES[withoutThe.toLowerCase().replace(/[.\s]/g, "")];
    if (strippedAlias) {
      const aliased = getBook(strippedAlias);
      if (aliased) return aliased;
    }
  }
  const plural = getBook(`${raw}s`);
  if (plural) return plural;
  return null;
};

/**
 * The canonical name of a book that was written in a short form.
 *
 * The import files and the scripture references are read with the same
 * aliases, so a book that a cross-reference can open is a book the import
 * can write to.
 */
export const canonicalBookName = (name) => {
  const book = resolveBook(name);
  return book ? book.name : "";
};

const RANGE_SEPARATOR = "[-\u2010-\u2015\u2212\uFE58\uFE63\uFF0D]";
const REFERENCE_PATTERN = new RegExp(`^(.+?)\\s+(\\d+)(?::(\\d+))?(?:\\s*${RANGE_SEPARATOR}\\s*(\\d+)(?::(\\d+))?)?$`);

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
  const pieces = raw.split(/[\u002d\u2010-\u2015\u2212\uFE58\uFE63\uFF0D]/);
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