import { PRAYER_FILE_FORMAT } from "@/lib/prayerImport";
import { parseReference } from "@/lib/scriptureRefs";
import { getBook } from "@/lib/bibleBooks";

export const BOOK_FILE_FORMAT = "pray-read-book-v1";
export const BOOK_FILE_KEYS = {
  file: ["book", "introduction", "closing_prayer", "chapters"],
  chapter: ["chapter", "introduction", "closing_prayer", "verses"],
  verse: ["verse", "pray_read", "pray_read_luganda", "cross_references"],
  prayerPassage: ["title_en", "title_lu", "pray_read", "pray_read_luganda"],
  crossReference: ["reference", "ref_text_en", "ref_text_lu", "note_en", "note_lu"]
};

const clean = (value) => (typeof value === "string" ? value.trim() : "");
const asNumber = (value) => {
  if (value === null || value === undefined || value === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};
const bilingual = (value, language, fallback = "") => clean(typeof value === "string" ? value : value && (value[language] || value[language === "en" ? "english" : "lu"]) || fallback);

export const isBookFile = (raw) => Boolean(raw && typeof raw === "object" && !Array.isArray(raw) && Array.isArray(raw.chapters) && raw.chapters.length);
export const bookOfFile = (raw) => {
  const name = clean(raw.book_name) || clean(raw.book);
  const known = name ? getBook(name) : null;
  const number = asNumber(raw.book_number);
  return { book_number: number || (known ? known.number : 0), book_name: known ? known.name : name };
};

export const expandBookFile = (raw) => {
  const { book_number, book_name } = bookOfFile(raw);
  const warnings = [];
  const notes = [];
  const prayers = [];
  const crossReferences = [];
  const chapterIntros = [];
  let withoutLuganda = 0;
  let withoutText = 0;
  let pointingAtItself = 0;
  const unreadable = [];

  if (!book_number) warnings.push({ item: 0, kind: "file", message: `The book "${clean(raw.book) || "(missing)"}" is not one of the 66 books of the Bible.` });
  (Array.isArray(raw.chapters) ? raw.chapters : []).forEach((chapter) => {
    const chapterNumber = asNumber(chapter?.chapter);
    if (!chapterNumber) return;
    (Array.isArray(chapter.verses) ? chapter.verses : []).forEach((verse) => {
      const verseNumber = asNumber(verse?.verse);
      const prayerEn = clean(verse?.pray_read || verse?.prayer_en);
      const prayerLu = clean(verse?.pray_read_luganda || verse?.prayer_lu);
      if (prayerEn) {
        if (!verseNumber) unreadable.push(`the prayer of chapter ${chapterNumber} has no verse number`);
        else {
          if (!prayerLu) withoutLuganda += 1;
          prayers.push({ book_number, book_name, chapter: chapterNumber, verse: verseNumber, verse_end: asNumber(verse.verse_end), title_en: clean(verse.title_en), title_lu: clean(verse.title_lu), prayer_en: prayerEn, prayer_lu: prayerLu, scripture_ref: `${book_name} ${chapterNumber}:${verseNumber}`, source: "book_import" });
        }
      }
      (Array.isArray(verse.cross_references) ? verse.cross_references : []).forEach((item) => {
        const reference = typeof item === "string" ? parseReference(item) : parseReference(item?.reference || item?.ref || "");
        if (!reference || !reference.verse) { unreadable.push(`the reference "${clean(typeof item === "string" ? item : item?.reference)}" could not be read`); return; }
        if (reference.bookNumber === book_number && reference.chapter === chapterNumber && reference.verse === verseNumber) { pointingAtItself += 1; return; }
        const object = typeof item === "object" && item ? item : {};
        const refTextEn = clean(object.ref_text_en || object.text_en);
        const refTextLu = clean(object.ref_text_lu || object.text_lu);
        const noteEn = clean(object.note_en);
        const noteLu = clean(object.note_lu);
        if (!refTextEn || !refTextLu || !noteEn || !noteLu) unreadable.push(`${book_name} ${chapterNumber}:${verseNumber} cross-reference ${reference.bookName || reference.book || ""} ${reference.chapter}:${reference.verse} lacks bilingual text or notes`);
        withoutText += refTextEn && refTextLu ? 0 : 1;
        crossReferences.push({ book_number, chapter: chapterNumber, verse: verseNumber, ref_book_number: reference.bookNumber, ref_chapter: reference.chapter, ref_verse: reference.verse, ref_verse_end: reference.endVerse && reference.endVerse !== reference.verse ? reference.endVerse : null, ref_text_en: refTextEn, ref_text_lu: refTextLu, note_en: noteEn, note_lu: noteLu, source: "book_import" });
      });
    });
    const introEn = clean(chapter.introduction || chapter.intro_en);
    const introLu = clean(chapter.introduction_luganda || chapter.intro_lu);
    if (introEn || introLu) chapterIntros.push({ book_number, book_name, chapter: chapterNumber, title_en: clean(chapter.title_en), title_lu: clean(chapter.title_lu), intro_en: introEn, intro_lu: introLu, source: "book_import" });
    const closingEn = bilingual(chapter.closing_prayer, "en", chapter.closing_prayer_en);
    const closingLu = clean(chapter.closing_prayer_luganda) || bilingual(chapter.closing_prayer, "luganda", chapter.closing_prayer_lu);
    if (closingEn || closingLu) {
      if (!closingLu) withoutLuganda += 1;
      prayers.push({ book_number, book_name, chapter: chapterNumber, verse: null, verse_end: null, title_en: `Closing prayer for ${book_name} ${chapterNumber}`, title_lu: `Essaba ebufundikira ${book_name} ${chapterNumber}`, prayer_en: closingEn, prayer_lu: closingLu, scripture_ref: `${book_name} ${chapterNumber}`, source: "book_import" });
    }
  });

  const bookIntro = {
    book_number, book_name, title_en: clean(raw.title_en), title_lu: clean(raw.title_lu),
    intro_en: bilingual(raw.introduction, "en", raw.intro_en),
    intro_lu: clean(raw.introduction_luganda) || bilingual(raw.introduction, "luganda", raw.intro_lu),
    closing_prayer_en: bilingual(raw.closing_prayer, "en", raw.closing_prayer_en),
    closing_prayer_lu: clean(raw.closing_prayer_luganda) || bilingual(raw.closing_prayer, "luganda", raw.closing_prayer_lu),
    source: "book_import"
  };
  if (withoutLuganda) warnings.push({ item: 0, kind: "file", message: `${withoutLuganda} prayer(s) have no Luganda text yet. Luganda sections were left empty.` });
  if (withoutText) warnings.push({ item: 0, kind: "file", message: `${withoutText} cross-reference(s) have no bilingual verse text.` });
  if (unreadable.length) warnings.push({ item: 0, kind: "file", message: `${unreadable.length} item(s) need correction: ${unreadable.slice(0, 6).join("; ")}${unreadable.length > 6 ? "; …" : ""}.` });
  if (pointingAtItself) warnings.push({ item: 0, kind: "file", message: `${pointingAtItself} cross-reference(s) point at the verse they are written on and were left out.` });
  notes.push("Chapter introductions, chapter closing prayers, the book introduction and book closing prayer are included where supplied.", "Every prayer and cross-reference is checked before the import is allowed.");
  const file = { format: PRAYER_FILE_FORMAT, book_number, book_name, prayers, cross_references: crossReferences, chapter_intros: chapterIntros, book_intro: bookIntro };
  return { file, prayers, crossReferences, chapterIntros, bookIntro, warnings, notes, book: { book_number, book_name } };
};

export const bookFileCollections = (raw) => {
  const expanded = expandBookFile(raw);
  const collections = {};
  if (expanded.prayers.length) collections.PrayerPassage = expanded.prayers;
  if (expanded.crossReferences.length) collections.CrossReference = expanded.crossReferences;
  if (expanded.chapterIntros.length) collections.ChapterIntro = expanded.chapterIntros;
  if (expanded.bookIntro && (expanded.bookIntro.intro_en || expanded.bookIntro.intro_lu || expanded.bookIntro.closing_prayer_en || expanded.bookIntro.closing_prayer_lu)) collections.BookIntro = [expanded.bookIntro];
  return { collections, expanded };
};