import { bilingualPair, bilingualText } from "@/lib/bilingual";
import { getBookByNumber } from "@/lib/bibleBooks";
import { parseReference, resolveBook } from "@/lib/scriptureRefs";

// The book file: one book, its chapters, the prayers of every verse, the
// cross-references of every verse, the introduction of the book and of
// every chapter, and the prayer that closes the book and every chapter.
//
// The file is read in one place only, so every book is imported the same
// way. The words of a field can be one English string or an object with a
// slot per language, and the English words never end up in the Luganda
// column.

export const BOOK_FILE_FORMAT = "pray-read-book-v1";
export const BOOK_FILE_KEYS = {
  file: ["book", "introduction", "closing_prayer", "chapters"],
  chapter: ["chapter", "introduction", "closing_prayer", "verses"],
  verse: ["verse", "pray_read", "pray_read_luganda", "cross_references"],
  prayerPassage: ["title_en", "title_lu", "pray_read", "pray_read_luganda"],
  crossReference: ["reference", "ref_text_en", "ref_text_lu", "note_en", "note_lu"]
};

// The prayer that closes a chapter is marked with this source, so it can be
// told apart from a prayer that was written for the whole chapter.
export const CHAPTER_CLOSING_SOURCE = "book_import:chapter_closing";
export const BOOK_IMPORT_SOURCE = "book_import";

const clean = (value) => (typeof value === "string" ? value.trim() : "");
const asNumber = (value) => {
  if (value === null || value === undefined || value === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

/** True when the file carries the chapters of one book. */
export const isBookFile = (raw) =>
  Boolean(
    raw &&
      typeof raw === "object" &&
      !Array.isArray(raw) &&
      Array.isArray(raw.chapters) &&
      raw.chapters.length
  );

/**
 * The book a file is about.
 *
 * The name is read with the same aliases the scripture references use, so
 * "First Kings", "Psalm" and "Rev" all find their book. The canonical
 * name is kept, and the number of a real book is never left at zero.
 */
export const bookOfFile = (raw) => {
  const name = clean(raw?.book_name ?? raw?.book);
  const known = name ? resolveBook(name) : null;
  const given = asNumber(raw?.book_number ?? raw?.bookNumber);
  const number = given || (known ? known.number : 0);
  const canonical = known ? known.name : "";
  return {
    book_number: number,
    book_name: canonical || name || (number ? (getBookByNumber(number)?.name ?? "") : "")
  };
};

/** The words of a field that the file keeps in one object. */
const objectWords = (value) =>
  value && typeof value === "object" && !Array.isArray(value) ? value : null;

/**
 * Expands a book file into the rows of the four collections it fills.
 *
 * Nothing here is ever blocked: a row that cannot be read is left out and
 * reported, and the rest of the book is imported all the same.
 */
export const expandBookFile = (raw) => {
  const book = bookOfFile(raw);
  const book_number = book.book_number;
  const book_name = book.book_name;

  const prayers = [];
  const crossReferences = [];
  const chapterIntros = [];
  const warnings = [];
  const notes = [];

  let withoutLuganda = 0;
  let withoutText = 0;
  let pointingAtItself = 0;
  const unreadable = [];

  const chapters = Array.isArray(raw?.chapters) ? raw.chapters : [];
  chapters.forEach((chapter) => {
    const chapterNumber = asNumber(chapter?.chapter);
    if (!chapterNumber) {
      unreadable.push("a chapter has no chapter number");
      return;
    }

    // The introduction of the chapter. It can be one English string or one
    // object with a slot per language; both are read.
    const intro = bilingualPair(
      chapter?.introduction ?? chapter?.intro_en,
      chapter?.introduction_luganda ?? chapter?.intro_lu
    );
    const chapterTitleEn = clean(chapter?.title_en ?? chapter?.title);
    const chapterTitleLu = clean(chapter?.title_lu);
    if (intro.en || intro.lu) {
      if (!intro.lu) withoutLuganda += 1;
      chapterIntros.push({
        book_number,
        book_name,
        chapter: chapterNumber,
        title_en: chapterTitleEn,
        title_lu: chapterTitleLu,
        intro_en: intro.en,
        intro_lu: intro.lu,
        source: BOOK_IMPORT_SOURCE
      });
    }

    // The prayer that closes the chapter. It has no verse of its own, and
    // the title of the file is kept as it is: the reader labels it.
    const closingObject = objectWords(chapter?.closing_prayer);
    const closing = bilingualPair(
      chapter?.closing_prayer ?? chapter?.closing_prayer_en,
      chapter?.closing_prayer_luganda ?? chapter?.closing_prayer_lu
    );
    if (closing.en || closing.lu) {
      if (!closing.lu) withoutLuganda += 1;
      const closingTitle = clean(
        closingObject?.title_en ??
          closingObject?.title ??
          chapter?.closing_prayer_title_en ??
          chapter?.closing_prayer_title
      );
      const closingTitleLu = clean(
        closingObject?.title_lu ?? chapter?.closing_prayer_title_lu
      );
      prayers.push({
        book_number,
        book_name,
        chapter: chapterNumber,
        verse: null,
        verse_end: null,
        title_en: closingTitle,
        title_lu: closingTitleLu,
        prayer_en: closing.en,
        prayer_lu: closing.lu,
        scripture_ref: `${book_name} ${chapterNumber}`,
        source: CHAPTER_CLOSING_SOURCE
      });
    }

    const verses = Array.isArray(chapter?.verses) ? chapter.verses : [];
    verses.forEach((verse) => {
      const verseNumber = asNumber(verse?.verse);
      const prayer = bilingualPair(
        verse?.pray_read ?? verse?.prayer_en,
        verse?.pray_read_luganda ?? verse?.prayer_lu
      );
      if (prayer.en) {
        if (!prayer.lu) withoutLuganda += 1;
        if (!verseNumber) {
          unreadable.push(`the prayer of ${book_name} ${chapterNumber} has no verse number`);
        } else {
          prayers.push({
            book_number,
            book_name,
            chapter: chapterNumber,
            verse: verseNumber,
            verse_end: asNumber(verse?.verse_end ?? verse?.verseEnd),
            title_en: clean(verse?.title_en ?? verse?.title),
            title_lu: clean(verse?.title_lu),
            prayer_en: prayer.en,
            prayer_lu: prayer.lu,
            scripture_ref: `${book_name} ${chapterNumber}:${verseNumber}`,
            source: BOOK_IMPORT_SOURCE
          });
        }
      } else if (prayer.lu) {
        unreadable.push(
          `the prayer of ${book_name} ${chapterNumber}${
            verseNumber ? `:${verseNumber}` : ""
          } has no English text yet`
        );
      }

      const references = Array.isArray(verse?.cross_references) ? verse.cross_references : [];
      references.forEach((item) => {
        const written = typeof item === "string" ? item : clean(item?.reference ?? item?.ref);
        const reference = parseReference(written);
        if (!reference || !reference.verse) {
          unreadable.push(`the reference "${written}" could not be read`);
          return;
        }
        if (
          Number(reference.bookNumber) === Number(book_number) &&
          Number(reference.chapter) === Number(chapterNumber) &&
          Number(reference.verse) === Number(verseNumber)
        ) {
          pointingAtItself += 1;
          return;
        }
        const source = typeof item === "object" && item ? item : {};
        const refText = bilingualPair(
          source?.ref_text_en ?? source?.text_en,
          source?.ref_text_lu ?? source?.text_lu
        );
        const note = bilingualPair(source?.note_en, source?.note_lu);
        // The verse text is fetched live by the reader when it is missing,
        // so a cross-reference without words is a warning, never a block.
        if (!refText.en || !refText.lu || !note.en || !note.lu) withoutText += 1;
        crossReferences.push({
          book_number,
          book_name,
          chapter: chapterNumber,
          verse: verseNumber,
          ref_book_number: Number(reference.bookNumber),
          ref_chapter: Number(reference.chapter),
          ref_verse: Number(reference.verse),
          ref_verse_end:
            reference.endVerse && reference.endVerse !== reference.verse
              ? Number(reference.endVerse)
              : null,
          ref_text_en: refText.en,
          ref_text_lu: refText.lu,
          note_en: note.en,
          note_lu: note.lu,
          source: BOOK_IMPORT_SOURCE
        });
      });
    });
  });

  const bookIntroObject = objectWords(raw?.book_intro) || objectWords(raw?.introduction);
  const intro = bilingualPair(
    raw?.introduction ?? raw?.intro_en ?? raw?.book_intro,
    raw?.introduction_luganda ?? raw?.intro_lu
  );
  const closing = bilingualPair(
    raw?.closing_prayer ?? raw?.closing_prayer_en,
    raw?.closing_prayer_luganda ?? raw?.closing_prayer_lu
  );
  if (intro.en && !intro.lu) withoutLuganda += 1;
  if (closing.en && !closing.lu) withoutLuganda += 1;

  const bookIntro = {
    book_number,
    book_name,
    title_en: clean(raw?.title_en ?? raw?.title ?? bookIntroObject?.title_en),
    title_lu: clean(raw?.title_lu ?? bookIntroObject?.title_lu),
    intro_en: intro.en,
    intro_lu: intro.lu,
    closing_prayer_en: closing.en,
    closing_prayer_lu: closing.lu,
    source: BOOK_IMPORT_SOURCE
  };

  if (withoutLuganda) {
    warnings.push({
      kind: "translation",
      item: 0,
      message: `${withoutLuganda} text${
        withoutLuganda === 1 ? "" : "s"
      } have no Luganda words yet. The Luganda columns were left empty, so the English words are never copied into them.`
    });
  }
  if (withoutText) {
    warnings.push({
      kind: "crossref",
      item: 0,
      message: `${withoutText} cross-reference${
        withoutText === 1 ? "" : "s"
      } carry no ref_text or note. They were imported all the same: the reader fetches the verse text when it is missing.`
    });
  }
  if (pointingAtItself) {
    warnings.push({
      kind: "crossref",
      item: 0,
      message: `${pointingAtItself} cross-reference${
        pointingAtItself === 1 ? "" : "s"
      } point at the verse they belong to and were left out.`
    });
  }
  unreadable.forEach((message) => {
    warnings.push({ kind: "row", item: 0, message });
  });

  notes.push(
    `${prayers.length} prayer${
      prayers.length === 1 ? "" : "s"
    }, ${crossReferences.length} cross-reference${
      crossReferences.length === 1 ? "" : "s"
    }, ${chapterIntros.length} chapter introduction${
      chapterIntros.length === 1 ? "" : "s"
    } for ${book_name || "the book"}.`
  );

  return {
    book: { book_number, book_name },
    book_number,
    book_name,
    prayers,
    crossReferences,
    chapterIntros,
    bookIntro,
    warnings,
    notes
  };
};

/**
 * The collections a book file fills.
 *
 * The book introduction is written whenever the file names a real book, so
 * the reader can tell "imported, but empty" apart from "never imported".
 */
export const bookFileCollections = (raw) => {
  const expanded = expandBookFile(raw);
  const collections = {};
  if (expanded.prayers.length) collections.PrayerPassage = expanded.prayers;
  if (expanded.crossReferences.length) collections.CrossReference = expanded.crossReferences;
  if (expanded.chapterIntros.length) collections.ChapterIntro = expanded.chapterIntros;
  if (expanded.book_number) collections.BookIntro = [expanded.bookIntro];
  return { collections, expanded };
};

export { bilingualText };