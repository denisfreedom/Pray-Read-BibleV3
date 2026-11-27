// The Q&A library.
//
// Every question in the library is bilingual: an English question and answer
// and a Luganda question and answer. The letter a question sits under is
// worked out from the question itself and never stored, so an edit in the
// content manager can never leave a stale letter behind.

import { fetchPublicCollection } from "@/lib/contentApi";
import { offline } from "@/lib/offlineDb";
import { QA_TOPICS, QA_ITEMS } from "@/lib/seedContent";
import { BIBLE_BOOKS } from "@/lib/bibleBooks";

export const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const ITEMS_STORE = "qaItems";
const TOPICS_STORE = "qaTopics";

/** The letter a question sits under, worked out from its first letter. */
export const letterOf = (text) => {
  const first = String(text || "").trim().charAt(0).toUpperCase();
  return first >= "A" && first <= "Z" ? first : "#";
};

/** The question of one record, in the language the reader is reading in. */
export const questionOf = (item, lang) =>
  (lang === "lu" ? item?.question_lu : item?.question_en) || "";

/** The answer of one record, in the language the reader is reading in. */
export const answerOf = (item, lang) =>
  (lang === "lu" ? item?.answer_lu : item?.answer_en) || "";

/** The topic of one record, in the language the reader is reading in. */
export const topicOf = (item, lang) =>
  (lang === "lu" ? item?.topic_lu : item?.topic_en) || "";

/** A record is live unless it was switched off in the content manager. */
export const isActive = (record) =>
  !!record && record.active !== false && record.active !== "false";

/** The name a question is known by: its record id, or a name of its own. */
export const itemKey = (item) => {
  if (item && item.id) return String(item.id);
  return String(item?.question_en || "question")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

/** The questions are always read from A to Z. */
export const sortQuestions = (items, lang) =>
  [...items].sort((a, b) =>
    questionOf(a, lang).toLowerCase().localeCompare(questionOf(b, lang).toLowerCase())
  );

/** The topics are always read from A to Z. */
export const sortTopics = (topics) =>
  [...topics].sort((a, b) =>
    String(a?.name_en || "").toLowerCase().localeCompare(String(b?.name_en || "").toLowerCase())
  );

/**
 * The three filters of the page work together: the topic, the letter and
 * the search word. A question has to pass all of them to be shown.
 */
const isEvery = (value) => !value || value === "All" || value === "all";

export const filterQuestions = (items, options = {}) => {
  const { lang = "en", topic = "All", letter = "All", search = "" } = options;
  const needle = String(search || "").trim().toLowerCase();
  return items.filter((item) => {
    if (!isEvery(topic) && item?.topic_en !== topic) return false;
    if (!isEvery(letter) && letterOf(questionOf(item, lang)) !== letter) return false;
    if (!needle) return true;
    const haystack = [
      item?.question_en,
      item?.question_lu,
      item?.answer_en,
      item?.answer_lu,
      item?.topic_en,
      item?.topic_lu,
      item?.tags,
      item?.scripture_ref
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return haystack.includes(needle);
  });
};

/** How many questions sit under every letter. */
export const letterCounts = (items, lang) => {
  const counts = { All: items.length };
  LETTERS.forEach((letter) => {
    counts[letter] = 0;
  });
  items.forEach((item) => {
    const letter = letterOf(questionOf(item, lang));
    if (counts[letter] === undefined) counts[letter] = 0;
    counts[letter] += 1;
  });
  return counts;
};

// A scripture reference inside an answer is shown in gold. The book names
// come from the list of the sixty-six books, so nothing else is caught.
const BOOK_PATTERN = BIBLE_BOOKS.map((book) => book.name)
  .sort((a, b) => b.length - a.length)
  .join("|");
const REFERENCE_PATTERN = new RegExp(
  `\\b(${BOOK_PATTERN})\\s+\\d+(:\\d+)?(\\s*-\\s*\\d+)?`,
  "gi"
);

/** Splits an answer into plain words and scripture references. */
export const splitAnswerParts = (text) => {
  const source = String(text || "");
  const parts = [];
  let lastIndex = 0;
  source.replace(REFERENCE_PATTERN, (match, _book, _verse, _range, offset) => {
    if (offset > lastIndex) parts.push({ text: source.slice(lastIndex, offset), reference: false });
    parts.push({ text: match, reference: true });
    lastIndex = offset + match.length;
    return match;
  });
  if (lastIndex < source.length) parts.push({ text: source.slice(lastIndex), reference: false });
  return parts.length ? parts : [{ text: source, reference: false }];
};

const readCache = async () => {
  const [items, topics] = await Promise.all([
    offline.getAll(ITEMS_STORE).catch(() => []),
    offline.getAll(TOPICS_STORE).catch(() => [])
  ]);
  return { items: items || [], topics: topics || [] };
};

const writeCache = async (library) => {
  try {
    await offline.putMany(
      ITEMS_STORE,
      (library.items || []).map((item) => ({ key: item.id || item.question_en, value: item }))
    );
    await offline.putMany(
      TOPICS_STORE,
      (library.topics || []).map((topic) => ({ key: topic.id || topic.name_en, value: topic }))
    );
  } catch {
    // The copy on the device is a comfort, never a requirement.
  }
};

/**
 * Reads the whole library: the live records when there is a connection and
 * the copy that is kept on the device when there is not.
 */
export const loadQaLibrary = async () => {
  const cached = await readCache();
  const offlineOnly = typeof navigator !== "undefined" && navigator.onLine === false;

  if (!offlineOnly) {
    const [topics, items] = await Promise.all([
      fetchPublicCollection("qaTopics"),
      fetchPublicCollection("qaItems")
    ]);
    if (items && items.length) {
      const library = {
        topics: topics && topics.length ? topics : cached.topics.length ? cached.topics : QA_TOPICS,
        items,
        offline: false
      };
      writeCache(library);
      return library;
    }
  }

  return {
    topics: cached.topics.length ? cached.topics : QA_TOPICS,
    items: cached.items.length ? cached.items : QA_ITEMS,
    offline: true
  };
};