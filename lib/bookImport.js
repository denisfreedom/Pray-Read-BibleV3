import { bilingualText } from "@/lib/bilingual";
import { getBookByNumber } from "@/lib/bibleBooks";
import { parseReference, resolveBook } from "@/lib/scriptureRefs";

const normalizeRangeDashes = (value) => String(value || "").replace(/[\u2010-\u2015\u2212\uFE58\uFE63\uFF0D]/g, "-");
const parseCrossRef = (value, sourceBook, sourceChapter, sourceVerse) => {
  const normalized = normalizeRangeDashes(value);
  const explicit = parseReference(normalized);
  if (explicit?.verse) return explicit;
  if (typeof value === "string") {
    const shorthand = normalized.match(/^(\d{1,3})(?::(\d{1,3}))?(?:\s*-\s*(\d{1,3}))?$/);
    const source = getBookByNumber(sourceBook);
    if (shorthand && source) {
      const chapter = shorthand[2] ? Number(shorthand[1]) : Number(sourceChapter || 1);
      const verse = Number(shorthand[2] || shorthand[1]);
      return { bookNumber: sourceBook, chapter, verse, endVerse: Number(shorthand[3] || verse), text: normalized };
    }
  }
  return null;
};

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

const clean = (value) => (typeof value === "string" || typeof value === "number" ? String(value).trim() : "");
const fieldText = (value) => typeof value === "string" || typeof value === "number" ? String(value).trim() : "";
const bilingualFieldText = (value, language, fallback = "") => {
  if (value && typeof value === "object" && !Array.isArray(value)) return bilingualText(value, language, "");
  if (language === "lu") return fallback && typeof fallback === "object" ? bilingualText(fallback, "lu", "") : fieldText(fallback);
  return fieldText(value) || (fallback && typeof fallback === "object" ? bilingualText(fallback, "en", "") : fieldText(fallback));
};
const rangeNumber = (value) => {
  if (typeof value === "string") return asNumber(normalizeRangeDashes(value).trim().replace(/^-\s*/, ""));
  return asNumber(value);
};
const prayerSourceOf = (row) => row?.prayer_en ?? row?.pray_read ?? row?.pay_read ?? row?.prayRead ?? row?.payRead ?? row?.prayer_read ?? row?.prayerEn ?? row?.prayer;
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
      (raw.format === BOOK_FILE_FORMAT || (Array.isArray(raw.chapters) && raw.chapters.length))
  );

/**
 * The book a file is about.
 *
 * The name is read with the same aliases the scripture references use, so
 * "First Kings", "Psalm" and "Rev" all find their book. The canonical
 * name is kept, and the number of a real book is never left at zero.
 */
export const bookOfFile = (raw) => {
  const bookValue = raw?.book_name ?? raw?.book ?? raw?.name;
  const name = typeof bookValue === "string" ? bookValue.trim() : "";
  const known = name ? resolveBook(name) : null;
  const given = asNumber(raw?.book_number ?? raw?.bookNumber);
  const numberedBook = given ? getBookByNumber(given) : null;
  const number = known?.number || (given >= 1 && given <= 66 ? given : 0);
  const canonical = known ? known.name : numberedBook?.name || "";
  return {
    book_number: number,
    book_name: canonical || name || (number ? (getBookByNumber(number)?.name ?? "") : "")
  };
};

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
  const unresolvedCrossRefs = [];
  const chapterIntros = [];
  const warnings = [];
  const notes = [];

  let withoutLuganda = 0;
  let withoutText = 0;
  let pointingAtItself = 0;
  const unresolved = [];
  const unreadable = [];

  const chapters = Array.isArray(raw?.chapters) ? raw.chapters : [];
  chapters.forEach((chapter) => {
    const chapterNumber = asNumber(chapter?.chapter ?? chapter?.chapter_number ?? chapter?.chapterNumber);
    if (!chapterNumber) {
      unreadable.push("a chapter has no chapter number");
      return;
    }

    const introSource = chapter?.introduction ?? chapter?.intro_en ?? chapter?.intro ?? chapter?.intro_lu ?? chapter?.introduction_lu ?? chapter?.introduction_luganda;
    const introEn = bilingualFieldText(introSource, "en", bilingualFieldText(chapter?.intro_en, "en"));
    const introLu = bilingualFieldText(
      introSource,
      "lu",
      bilingualFieldText(chapter?.introduction_luganda ?? chapter?.introduction_lu ?? chapter?.intro_lu, "lu")
    );
    const chapterTitleEn = bilingualFieldText(chapter?.title_en ?? chapter?.title, "en");
    const chapterTitleLu = bilingualFieldText(chapter?.title_lu ?? chapter?.title_luganda ?? chapter?.title, "lu");
    if (introEn || introLu) {
      if (!introLu) withoutLuganda += 1;
      chapterIntros.push({
        book_number,
        book_name,
        chapter: chapterNumber,
        title_en: chapterTitleEn,
        title_lu: chapterTitleLu,
        intro_en: introEn,
        intro_lu: introLu,
        source: BOOK_IMPORT_SOURCE
      });
    }

          const closingSource = chapter?.closing_prayer ?? chapter?.chapter_closing_prayer ?? chapter?.closing_prayer_en ?? chapter?.closing_prayer_luganda ?? chapter?.closing_prayer_lu;
    const closingObject = closingSource && typeof closingSource === "object" ? closingSource : {};
    const closingEn = bilingualFieldText(closingSource, "en", chapter?.closing_prayer_en ?? closingObject.en ?? closingObject.english);
    const closingLu = bilingualFieldText(
      closingSource,
      "lu",
      chapter?.closing_prayer_luganda ?? chapter?.closing_prayer_lu ?? closingObject.lu ?? closingObject.luganda
    );
    if (closingEn || closingLu) {
      if (!closingLu) withoutLuganda += 1;
      prayers.push({
        book_number,
        book_name,
        chapter: chapterNumber,
        verse: null,
        verse_end: null,
        title_en: bilingualFieldText(chapter?.closing_prayer_title_en ?? chapter?.closing_prayer_title ?? chapter?.title_en, "en"),
        title_lu: bilingualFieldText(chapter?.closing_prayer_title_lu ?? chapter?.closing_prayer_title_luganda ?? chapter?.title_lu ?? chapter?.closing_prayer_title, "lu"),
        prayer_en: closingEn,
        prayer_lu: closingLu,
        scripture_ref: `${book_name} ${chapterNumber}`,
        source: CHAPTER_CLOSING_SOURCE
      });
    }

    const verses = Array.isArray(chapter?.verses) ? chapter.verses : [];
    verses.forEach((verse) => {
      const verseNumber = asNumber(verse?.verse ?? verse?.verse_number ?? verse?.verseNumber);
      const prayerSource = prayerSourceOf(verse);
      const prayerObject = prayerSource && typeof prayerSource === "object" ? prayerSource : {};
      const prayerEn = bilingualFieldText(prayerSource, "en", verse?.prayer_en ?? verse?.pray_read_en ?? verse?.pay_read_en ?? prayerObject.en ?? prayerObject.english);
      const prayerLu = bilingualFieldText(
        verse?.pray_read_luganda ?? verse?.pay_read_luganda ?? verse?.prayer_lu ?? verse?.prayer_luganda ?? prayerSource,
        "lu",
        prayerObject.lu ?? prayerObject.luganda ?? ""
      );
      if (prayerEn || prayerLu) {
        if (!prayerLu && prayerEn) withoutLuganda += 1;
        if (!verseNumber) {
          unreadable.push(`the prayer of ${book_name} ${chapterNumber} has no verse number`);
        } else {
          prayers.push({
            book_number,
            book_name,
            chapter: chapterNumber,
            verse: verseNumber,
            verse_end: rangeNumber(verse?.verse_end ?? verse?.verseEnd),
            title_en: bilingualFieldText(verse?.title_en ?? verse?.title, "en"),
            title_lu: bilingualFieldText(verse?.title_lu ?? verse?.title_luganda ?? verse?.title, "lu"),
            prayer_en: prayerEn,
            prayer_lu: prayerLu,
            scripture_ref: `${book_name} ${chapterNumber}:${verseNumber}`,
            source: BOOK_IMPORT_SOURCE
          });
        }
      } else if (prayerLu) {
        unreadable.push(
          `the prayer of ${book_name} ${chapterNumber}${
            verseNumber ? `:${verseNumber}` : ""
          } has no English text yet`
        );
      }

      const references = Array.isArray(verse?.cross_references) ? verse.cross_references : [];
      references.forEach((item) => {
        const source = typeof item === "object" && item ? item : {};
        const coordinateText = source.ref_book_name || source.ref_book || source.ref_book_number
          ? [source.ref_book_name ?? source.ref_book ?? getBookByNumber(source.ref_book_number)?.name, source.ref_chapter, source.ref_verse ? `${source.ref_verse}${source.ref_verse_end && source.ref_verse_end !== source.ref_verse ? `-${source.ref_verse_end}` : ""}` : null].filter(Boolean).join(" ")
          : "";
        const written = typeof item === "string" ? item : fieldText(item?.reference_text ?? item?.label ?? item?.reference ?? item?.ref ?? item?.target ?? coordinateText);
        const reference = parseCrossRef(written, book_number, chapterNumber, verseNumber);
        const storedReference = written;
        const rawRefText = source?.ref_text_en ?? source?.text_en ?? source?.ref_text ?? source?.text;
        const rawNote = source?.note_en ?? source?.note ?? source?.notes;
        const refText = {
          en: bilingualFieldText(rawRefText, "en", ""),
          lu: bilingualFieldText(source?.ref_text_lu ?? source?.text_lu ?? source?.ref_text_luganda ?? rawRefText, "lu", "")
        };
        const note = {
          en: bilingualFieldText(rawNote, "en", ""),
          lu: bilingualFieldText(source?.note_lu ?? source?.note_luganda ?? source?.notes_luganda ?? rawNote, "lu", "")
        };
        if (!refText.en || !refText.lu || !note.en || !note.lu) withoutText += 1;
        if (!reference || !reference.verse || !verseNumber) {
          unresolved.push(written || JSON.stringify(source));
          crossReferences.push({
            book_number, book_name, chapter: chapterNumber, verse: verseNumber || null,
            ref_book_number: null, ref_chapter: null, ref_verse: null, ref_verse_end: null,
            ref_text_en: refText.en, ref_text_lu: refText.lu, note_en: note.en, note_lu: note.lu,
            reference_text: storedReference || "", unresolved: true, source: BOOK_IMPORT_SOURCE
          });
          unresolvedCrossRefs.push(written || JSON.stringify(source));
          return;
        }
        const selfReference = Number(reference.bookNumber) === Number(book_number) && Number(reference.chapter) === Number(chapterNumber) && Number(reference.verse) === Number(verseNumber);
        if (selfReference) pointingAtItself += 1;
        crossReferences.push({
          book_number, book_name, chapter: chapterNumber, verse: verseNumber,
          ref_book_number: Number(reference.bookNumber), ref_chapter: Number(reference.chapter),
          ref_verse: Number(reference.verse),
          ref_verse_end: reference.endVerse && reference.endVerse !== reference.verse ? Number(reference.endVerse) : null,
          ref_text_en: refText.en, ref_text_lu: refText.lu, note_en: note.en, note_lu: note.lu,
          reference_text: storedReference, unresolved: false, source: BOOK_IMPORT_SOURCE
        });
      });
    });
  });

  const introSource = raw?.introduction ?? raw?.book_introduction ?? raw?.intro_en ?? raw?.intro ?? raw?.intro_lu ?? raw?.introduction_lu ?? raw?.introduction_luganda;
  const introEn = bilingualFieldText(introSource, "en", bilingualFieldText(raw?.intro_en, "en"));
  const introLu = bilingualFieldText(
    introSource,
    "lu",
    bilingualFieldText(raw?.introduction_luganda ?? raw?.introduction_lu ?? raw?.intro_lu, "lu")
  );
  const closingSource = raw?.closing_prayer ?? raw?.book_closing_prayer ?? raw?.closing_prayer_en ?? raw?.closing_prayer_luganda ?? raw?.closing_prayer_lu;
  const closingObject = closingSource && typeof closingSource === "object" ? closingSource : {};
  const closingEn = bilingualFieldText(closingSource, "en", raw?.closing_prayer_en ?? closingObject.en ?? closingObject.english);
  const closingLu = bilingualFieldText(
    closingSource,
    "lu",
    raw?.closing_prayer_luganda ?? raw?.closing_prayer_lu ?? closingObject.lu ?? closingObject.luganda
  );
  if (introEn && !introLu) withoutLuganda += 1;
  if (closingEn && !closingLu) withoutLuganda += 1;

  const closingTitle = raw?.closing_prayer && typeof raw.closing_prayer === "object" ? raw.closing_prayer : {};
  const bookIntro = {
    book_number,
    book_name,
    title_en: bilingualFieldText(raw?.title_en ?? raw?.title, "en"),
    title_lu: bilingualFieldText(raw?.title_lu ?? raw?.title_luganda ?? raw?.title, "lu"),
    intro_en: introEn,
    intro_lu: introLu,
    closing_title_en: bilingualFieldText(closingTitle.title_en ?? closingTitle.title ?? raw?.closing_prayer_title_en, "en"),
    closing_title_lu: bilingualFieldText(closingTitle.title_lu ?? closingTitle.title_luganda ?? closingTitle.title ?? raw?.closing_prayer_title_lu, "lu"),
    closing_prayer_en: closingEn,
    closing_prayer_lu: closingLu,
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
      message: `${pointingAtItself} cross-reference${pointingAtItself === 1 ? "" : "s"} point to their own verse; they were preserved in the import.`
    });
  }
  if (unresolved.length) {
    warnings.push({ kind: "crossref", item: 0, message: `${unresolved.length} reference coordinate${unresolved.length === 1 ? "" : "s"} could not be resolved. Original reference text was preserved, but add valid book/chapter/verse coordinates to make them navigable.` });
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