import { PRAYER_FILE_FORMAT } from "@/lib/prayerImport";
import { parseReference } from "@/lib/scriptureRefs";
import { getBook } from "@/lib/bibleBooks";

// The Pray-Read book file.
//
// One file holds one whole book: the introduction of the book, its chapters,
// the verses of every chapter, the prayer written for every verse and the
// cross-references that go with it.
//
// The chapters and the verses are only there to show where the prayers and
// the cross-references belong, so this file reads them and prepares the rows
// the app stores: a prayer passage for every prayer and a cross-reference
// for every reference that is written.

export const BOOK_FILE_FORMAT = "pray-read-book-v1";

/** The keys a book file holds, shown in the panel so the format is never a guess. */
export const BOOK_FILE_KEYS = {
  file: ["book", "introduction", "closing_prayer", "chapters"],
  chapter: ["chapter", "introduction", "verses"],
  verse: ["verse", "pray_read", "pray_read_luganda", "cross_references"]
};

const clean = (value) => (typeof value === "string" ? value.trim() : "");

const asNumber = (value) => {
  if (value === null || value === undefined || value === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

/** True when the file is a book file and not one of the other formats. */
export const isBookFile = (raw) =>
  Boolean(raw) &&
  typeof raw === "object" &&
  !Array.isArray(raw) &&
  Array.isArray(raw.chapters) &&
  raw.chapters.length > 0;

/** The book the file is about: its number and its name. */
export const bookOfFile = (raw) => {
  const name = clean(raw.book_name) || clean(raw.book);
  const known = name ? getBook(name) : null;
  const number = asNumber(raw.book_number);
  return {
    book_number: number || (known ? known.number : 0),
    book_name: known ? known.name : name
  };
};

/**
 * Reads a book file and prepares the rows the app stores.
 *
 * The prayers become prayer passages: one for every verse and one for the
 * prayer that closes the chapter. The cross-references become the rows of
 * the cross-reference collection, with the book, the chapter and the verse
 * they point to.
 */
export const expandBookFile = (raw) => {
  const { book_number, book_name } = bookOfFile(raw);
  const warnings = [];
  const notes = [];
  const prayers = [];
  const crossReferences = [];
  const chapterIntros = [];

  let withoutLuganda = 0;
  let withoutText = 0;
  const unreadable = [];
  let pointingAtItself = 0;

  if (!book_number) {
    warnings.push({
      item: 0,
      kind: "file",
      message: `The book "${clean(raw.book) || "(missing)"}" is not one of the 66 books of the Bible.`
    });
  }

  const chapters = Array.isArray(raw.chapters) ? raw.chapters : [];

  chapters.forEach((chapter) => {
    const chapterNumber = asNumber(chapter && chapter.chapter);
    if (!chapterNumber) return;
    const verses = Array.isArray(chapter.verses) ? chapter.verses : [];

    verses.forEach((verse) => {
      const verseNumber = asNumber(verse && verse.verse);
      const prayerEn = clean(verse && (verse.pray_read || verse.prayer_en));
      const prayerLu = clean(verse && (verse.pray_read_luganda || verse.prayer_lu));

      if (prayerEn) {
        if (!verseNumber) {
          unreadable.push(`the prayer of chapter ${chapterNumber} has no verse number`);
        } else {
          if (!prayerLu) withoutLuganda += 1;
          prayers.push({
            book_number,
            book_name,
            chapter: chapterNumber,
            verse: verseNumber,
            verse_end: null,
            title_en: clean(verse.title_en),
            title_lu: clean(verse.title_lu),
            prayer_en: prayerEn,
            prayer_lu: prayerLu,
            scripture_ref: `${book_name} ${chapterNumber}:${verseNumber}`,
            source: "book_import"
          });
        }
      }

      const references = Array.isArray(verse.cross_references) ? verse.cross_references : [];
      references.forEach((text) => {
        const reference = parseReference(text);
        if (!reference || !reference.verse) {
          unreadable.push(`the reference "${clean(text)}" could not be read`);
          return;
        }
        if (
          reference.bookNumber === book_number &&
          reference.chapter === chapterNumber &&
          reference.verse === verseNumber
        ) {
          pointingAtItself += 1;
          return;
        }
        withoutText += 1;
        crossReferences.push({
          book_number,
          chapter: chapterNumber,
          verse: verseNumber,
          ref_book_number: reference.bookNumber,
          ref_chapter: reference.chapter,
          ref_verse: reference.verse,
          ref_verse_end:
            reference.endVerse && reference.endVerse !== reference.verse ? reference.endVerse : null,
          ref_text_en: "",
          ref_text_lu: "",
          note_en: "",
          note_lu: "",
          source: "book_import"
        });
      });
    });

    const introduction = clean(chapter.introduction);
    if (introduction) {
      chapterIntros.push({
        book_number,
        book_name,
        chapter: chapterNumber,
        title_en: clean(chapter.title_en),
        title_lu: clean(chapter.title_lu),
        intro_en: introduction,
        intro_lu: clean(chapter.introduction_luganda),
        source: "book_import"
      });
    }

    const closing = clean(chapter.closing_prayer);
    if (closing) {
      const closingLu = clean(chapter.closing_prayer_luganda);
      if (!closingLu) withoutLuganda += 1;
      prayers.push({
        book_number,
        book_name,
        chapter: chapterNumber,
        verse: null,
        verse_end: null,
        title_en: `Closing prayer for ${book_name} ${chapterNumber}`,
        title_lu: "",
        prayer_en: closing,
        prayer_lu: closingLu,
        scripture_ref: `${book_name} ${chapterNumber}`,
        source: "book_import"
      });
    }
  });

  // The introduction of the book and the prayer that closes the book. They
  // are written for the whole book, so they are stored apart from the
  // passages of the chapters.
  const bookIntro = {
    book_number,
    book_name,
    title_en: "",
    title_lu: "",
    intro_en: clean(raw.introduction),
    intro_lu: clean(raw.introduction_luganda),
    closing_prayer_en: clean(raw.closing_prayer),
    closing_prayer_lu: clean(raw.closing_prayer_luganda),
    source: "book_import"
  };

  if (withoutLuganda) {
    warnings.push({
      item: 0,
      kind: "file",
      message: `${withoutLuganda} prayer(s) have no Luganda text yet. The Luganda section was left empty, so you can write it later in the content manager.`
    });
  }
  if (withoutText) {
    warnings.push({
      item: 0,
      kind: "file",
      message: `The file does not carry the text of the ${withoutText} verse(s) the cross-references point to. The reader shows the reference itself.`
    });
  }
  if (unreadable.length) {
    warnings.push({
      item: 0,
      kind: "file",
      message: `${unreadable.length} item(s) were left out: ${unreadable.slice(0, 4).join("; ")}${
        unreadable.length > 4 ? "; …" : ""
      }.`
    });
  }
  if (pointingAtItself) {
    warnings.push({
      item: 0,
      kind: "file",
      message: `${pointingAtItself} cross-reference(s) point at the verse they are written on and were left out.`
    });
  }

  notes.push(
    "The chapters and the verses of the file were not imported: they only show where the prayers and the cross-references belong.",
    "The introduction of every chapter is imported and stands in the chapter intro of the reader.",
    "The introduction of the book and the closing prayer of the book are imported and stand in the book intro of the reader.",
    "The prayer that closes every chapter is imported as the prayer of the whole chapter.",
    "A prayer that has no Luganda text yet is imported with its Luganda section empty. The English is never copied into it, and you can write the Luganda later in the content manager."
  );

  const file = {
    format: PRAYER_FILE_FORMAT,
    book_number,
    book_name,
    prayers,
    cross_references: crossReferences,
    chapter_intros: chapterIntros,
    book_intro: bookIntro
  };

  return {
    file,
    prayers,
    crossReferences,
    chapterIntros,
    bookIntro,
    warnings,
    notes,
    book: { book_number, book_name }
  };
};

/**
 * The rows the content importer writes, one collection per key, the same
 * way every other file is read.
 */
export const bookFileCollections = (raw) => {
  const expanded = expandBookFile(raw);
  const collections = {};
  if (expanded.prayers.length) collections.PrayerPassage = expanded.prayers;
  if (expanded.crossReferences.length) collections.CrossReference = expanded.crossReferences;
  if (expanded.chapterIntros.length) collections.ChapterIntro = expanded.chapterIntros;
  if (expanded.bookIntro && (expanded.bookIntro.intro_en || expanded.bookIntro.closing_prayer_en)) {
    collections.BookIntro = [expanded.bookIntro];
  }
  return { collections, expanded };
};