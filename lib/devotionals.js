import { format } from "date-fns";
import { createPageUrl } from "@/utils";
import { DEVOTIONALS } from "@/lib/seedContent";

// The devotional library on the reader's side.
//
// The backend specification of a devotional:
//   title_en, title_lu, scripture_ref, verse_en, verse_lu, body_en, body_lu,
//   prayer_en, prayer_lu, topic, series, date, cover_url, featured, active
// Every helper below reads those names, so the front page, the home page and
// the content manager all speak one language. The names the very first
// records were written with are still understood, so nothing that is already
// stored disappears from the screen.

// The cover used when a devotional has no cover of its own: an open Bible
// with a cup of coffee in the morning light.
export const DEVOTIONAL_DEFAULT_IMAGE =
  "/api/appfiles/public/app_73e21b4aa5684452/assets/generated_4e567607.png";

export const DEVOTIONAL_DEFAULT_IMAGE_SQUARE =
  "/api/appfiles/public/app_73e21b4aa5684452/assets/generated_12b9fad2.png";

export const DEVOTIONAL_LANGUAGES = ["EN", "LU", "BOTH"];

// The storage keys of the reader's own devotional library.
export const DEVOTIONAL_STORAGE = {
  daily: "pr_daily_devotional",
  saved: "pr_saved_devotionals",
  read: "pr_read_devotionals"
};

// The fields of the specification, in the order the content manager shows
// them.
export const DEVOTIONAL_FIELDS = [
  "title_en",
  "title_lu",
  "scripture_ref",
  "verse_en",
  "verse_lu",
  "body_en",
  "body_lu",
  "prayer_en",
  "prayer_lu",
  "topic",
  "series",
  "date",
  "cover_url",
  "featured",
  "active"
];

// The names the first records were written with. They are still read, so a
// record that was never migrated keeps its place in the library.
const OLD_NAMES = {
  title_en: "title",
  body_en: "body",
  scripture_ref: "scripture",
  date: "publish_date",
  cover_url: "cover_image",
  topic: "category"
};

const clean = (value) => String(value || "").trim();

/** One field of a devotional, in the name of the specification. */
export const fieldOf = (row, key) => {
  if (!row) return "";
  const own = clean(row[key]);
  if (own) return own;
  const old = OLD_NAMES[key];
  return old ? clean(row[old]) : "";
};

/** The stable name of a devotional: its code, or its id when it has no code. */
export const devotionalKey = (row) => clean(row && (row.code || row.id));

/** The date of a devotional, as YYYY-MM-DD. */
export const devotionalDate = (row) => fieldOf(row, "date").slice(0, 10);

/** A devotional is shown when it is active; the old records count as active. */
export const isActiveDevotional = (row) => !!row && row.active !== false;

/** A devotional is shown from its own date onwards; future ones wait. */
export const isPublishedDevotional = (row, today) => {
  const date = devotionalDate(row);
  if (!date) return true;
  return date <= today;
};

/** The devotionals the reader may see today. */
export const visibleDevotionals = (rows, today) =>
  (rows || []).filter((row) => isActiveDevotional(row) && isPublishedDevotional(row, today));

/** Newest first, then the title from A to Z. */
export const sortDevotionals = (rows) =>
  [...(rows || [])].sort((a, b) => {
    const left = devotionalDate(a);
    const right = devotionalDate(b);
    if (left !== right) return right < left ? -1 : 1;
    return fieldOf(a, "title_en").localeCompare(fieldOf(b, "title_en"));
  });

/** A stable number for any string, so the same day always gives the same pick. */
export const hashString = (value) => {
  let hash = 2166136261;
  const text = String(value || "");
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
};

/** The index the given day lands on inside a list. */
export const seededIndex = (seed, length) => {
  if (!length) return 0;
  return hashString(seed) % length;
};

/**
 * The devotional of the day.
 *
 * The pick is seeded by the date, so everybody sees the same devotional on
 * the same day and the same reader sees it again on the next refresh. When
 * yesterday's pick would be today's pick as well, the pick is moved on one
 * step, so the reader never reads the same devotional two days running.
 */
export const pickDailyDevotional = (rows, today, yesterday) => {
  const list = sortDevotionals(visibleDevotionals(rows, today));
  if (!list.length) return null;
  if (list.length === 1) return list[0];
  const index = seededIndex(today, list.length);
  const yesterdayIndex = seededIndex(yesterday, list.length);
  if (index === yesterdayIndex) return list[(index + 1) % list.length];
  return list[index];
};

/** The topic of a devotional. */
export const topicOf = (row) => fieldOf(row, "topic");

/** The cover of a devotional: its own cover, or the default one. */
export const coverOf = (row) => fieldOf(row, "cover_url") || DEVOTIONAL_DEFAULT_IMAGE;

/** The title in the language asked for, with the other language as a fall-back. */
export const titleOf = (row, language = "BOTH") =>
  language === "LU"
    ? clean(row && row.title_lu) || fieldOf(row, "title_en")
    : fieldOf(row, "title_en") || clean(row && row.title_lu);

/** The scripture reference in the language asked for. */
export const scriptureOf = (row, language = "BOTH") =>
  language === "LU"
    ? clean(row && row.scripture_lu) || fieldOf(row, "scripture_ref")
    : fieldOf(row, "scripture_ref") || clean(row && row.scripture_lu);

/** The verse text in the language asked for. */
export const verseOf = (row, language = "BOTH") => {
  if (language === "LU") {
    return (
      clean(row && row.verse_lu) ||
      clean(row && row.verse_en) ||
      excerptOf(fieldOf(row, "body_lu"), 1)
    );
  }
  return (
    clean(row && row.verse_en) ||
    clean(row && row.verse_lu) ||
    excerptOf(fieldOf(row, "body_en"), 1)
  );
};

/** The long date of a day: "Friday, 27 November 2026". */
export const longDateLabel = (iso) => {
  const date = clean(iso).slice(0, 10);
  if (!date) return "";
  const parsed = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return date;
  return format(parsed, "EEEE, d MMMM yyyy");
};

/** The body in the language asked for. */
export const bodyOf = (row, language = "BOTH") =>
  language === "LU"
    ? clean(row && row.body_lu) || fieldOf(row, "body_en")
    : fieldOf(row, "body_en") || clean(row && row.body_lu);

/** The prayer in the language asked for. */
export const prayerOf = (row, language = "BOTH") =>
  language === "LU"
    ? clean(row && row.prayer_lu) || clean(row && row.prayer_en)
    : clean(row && row.prayer_en) || clean(row && row.prayer_lu);

/** The badge a devotional carries: both languages, or the one it has. */
export const languageBadge = (row) => {
  const en = fieldOf(row, "title_en") || fieldOf(row, "body_en");
  const lu = clean(row && row.title_lu) || clean(row && row.body_lu);
  if (en && lu) return "BOTH";
  return lu ? "LU" : "EN";
};

/** The first lines of a text, for the card excerpts. */
export const excerptOf = (text, lines = 2, maxChars = 240) => {
  const joined = String(text || "")
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, lines)
    .join(" ");
  if (joined.length <= maxChars) return joined;
  const cut = joined.slice(0, maxChars);
  const stop = cut.lastIndexOf(" ");
  return `${(stop > 60 ? cut.slice(0, stop) : cut).trim()}...`;
};

/** The public link of a devotional. */
export const devotionalUrl = (row) => {
  const base = typeof window !== "undefined" ? window.location.origin : "";
  return `${base}${createPageUrl("Devotionals")}?devotional=${encodeURIComponent(devotionalKey(row))}`;
};

/**
 * The text that is shared: the title, the scripture, the verse and the
 * link. In the both-languages mode the English comes first, the Luganda
 * below it, and the link at the end.
 */
export const buildDevotionalShareText = (row, url, language = "BOTH") => {
  const blocks = [];
  const push = (title, scripture, verse, body) => {
    const lines = [];
    if (title) lines.push(title);
    if (scripture) lines.push(scripture);
    const line = verse || excerptOf(body, 1);
    if (line) lines.push(line);
    if (lines.length) blocks.push(lines.join("\n"));
  };

  if (language !== "LU") {
    push(titleOf(row, "EN"), scriptureOf(row, "EN"), verseOf(row, "EN"), bodyOf(row, "EN"));
  }
  if (language !== "EN") {
    push(titleOf(row, "LU"), scriptureOf(row, "LU"), verseOf(row, "LU"), bodyOf(row, "LU"));
  }
  if (url) {
    blocks.push(`Read it here: ${url}`);
  }
  return blocks.join("\n\n");
};

/** Remembers the devotional of the day, so the page never flickers. */
export const rememberDaily = (date, code) => {
  try {
    localStorage.setItem(DEVOTIONAL_STORAGE.daily, JSON.stringify({ date, code }));
  } catch {
    // Storage may be unavailable; the seeded pick still works.
  }
};

/** The devotional the reader saved, kept in this browser. */
export const readSavedDevotionals = () => {
  try {
    const raw = localStorage.getItem(DEVOTIONAL_STORAGE.saved);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

/** Saves or unsaves a devotional in this browser. */
export const writeSavedDevotionals = (list) => {
  try {
    localStorage.setItem(DEVOTIONAL_STORAGE.saved, JSON.stringify(list || []));
  } catch {
    // Storage may be unavailable; the button still works for this visit.
  }
};

/** The devotionals the reader marked as read, kept in this browser. */
export const readReadDevotionals = () => {
  try {
    const raw = localStorage.getItem(DEVOTIONAL_STORAGE.read);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

/** Marks a devotional as read, or not, in this browser. */
export const writeReadDevotionals = (list) => {
  try {
    localStorage.setItem(DEVOTIONAL_STORAGE.read, JSON.stringify(list || []));
  } catch {
    // Storage may be unavailable; the mark still shows for this visit.
  }
};

/**
 * The devotionals of the database with the bundled text put back where it
 * is missing.
 *
 * Every record comes back in the names of the specification, so the rest of
 * the app only ever reads one set of fields. The records that were
 * imported first carry their title, their date and their topic, but their
 * body was never written: the bundled library holds the same devotionals
 * with the same codes, so the text is taken from there until the content
 * manager writes the body of their own.
 */
export const mergeWithBundledText = (rows) => {
  const bundled = DEVOTIONALS || [];
  return (rows || []).map((row) => {
    const source = bundled.find((item) => item.code && item.code === row.code);
    const pick = (key) => {
      const own = fieldOf(row, key);
      if (own) return own;
      return source ? clean(source[key]) : "";
    };
    return {
      ...row,
      code: clean(row && row.code) || (source ? source.code : ""),
      title_en: pick("title_en"),
      title_lu: pick("title_lu"),
      scripture_ref: pick("scripture_ref"),
      scripture_lu: pick("scripture_lu"),
      verse_en: pick("verse_en"),
      verse_lu: pick("verse_lu"),
      body_en: pick("body_en"),
      body_lu: pick("body_lu"),
      prayer_en: pick("prayer_en"),
      prayer_lu: pick("prayer_lu"),
      topic: pick("topic"),
      series: clean(row && row.series),
      date: fieldOf(row, "date"),
      cover_url: fieldOf(row, "cover_url"),
      featured: row && row.featured === true,
      active: !row || row.active !== false
    };
  });
};

/** The code of a devotional, made from its title and its date. */
export const makeDevotionalCode = (row, taken = []) => {
  const base =
    fieldOf(row, "title_en")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "devotional";
  const date = devotionalDate(row);
  const seed = date ? `${base}-${date}` : base;
  if (!taken.includes(seed)) return seed;
  let counter = 2;
  while (taken.includes(`${seed}-${counter}`)) counter += 1;
  return `${seed}-${counter}`;
};