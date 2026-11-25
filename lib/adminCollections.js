import { joinRefs, splitRefs } from "@/lib/scriptureRefs";
import { getBookByNumber } from "@/lib/bibleBooks";

// Every collection the content manager can fill, with the fields it holds.
// The admin panel builds its forms from this list, so a field that is added
// to the app shows up in the panel without any extra work.
//
// A field is written as [name, label, type]. The type is one of text,
// textarea, number, boolean or refs (a list of scripture references).

/** The name of the Bible book with that number, for the labels in the lists. */
const bookNameOf = (number) => {
  const book = getBookByNumber(number);
  return book ? book.name : "";
};

export const COLLECTIONS = [
  {
    id: "Prayer",
    label: "Prayer library",
    note: "Prayers with the passage they belong to and the scriptures they point to.",
    fields: [
      ["title", "Title (EN)", "text"],
      ["title_lu", "Title (LU)", "text"],
      ["category", "Category", "text"],
      ["scripture_ref", "Passage", "text"],
      ["cross_refs", "Cross references", "refs"],
      ["body_en", "Prayer (EN)", "textarea"],
      ["body_lu", "Prayer (LU)", "textarea"]
    ]
  },
  {
    id: "PrayerPassage",
    label: "Prayer passages",
    note: "The prayer written for a verse, for a run of verses or for a whole chapter. A file that carries the English only leaves the Luganda section empty, so you can write it here.",
    fields: [
      ["book_number", "Book number", "number"],
      ["book_name", "Book", "text"],
      ["chapter", "Chapter", "number"],
      ["verse", "Verse (0 = the whole chapter)", "number"],
      ["verse_end", "Last verse of the passage", "number"],
      ["title_en", "Title (EN)", "text"],
      ["title_lu", "Title (LU)", "text"],
      ["prayer_en", "Prayer (EN)", "textarea"],
      ["prayer_lu", "Prayer (LU)", "textarea"],
      ["scripture_ref", "Passage", "text"],
      ["source", "Source", "text"]
    ],
    labelOf: (row) => {
      const book = String(row.book_name || bookNameOf(row.book_number) || "");
      const place = `${book} ${row.chapter || ""}${row.verse ? `:${row.verse}` : ""}`.trim();
      const title = String(row.title_en || "").trim();
      return title ? `${place}  -  ${title}` : place;
    }
  },
  {
    id: "CrossReference",
    label: "Cross-references",
    note: "The cross-reference written for a verse and the verse it points to. A file that carries the English only leaves the Luganda section empty, so you can write it here.",
    fields: [
      ["book_number", "Book number", "number"],
      ["chapter", "Chapter", "number"],
      ["verse", "Verse the reader is on", "number"],
      ["ref_book_number", "Book the reference points to", "number"],
      ["ref_chapter", "Chapter it points to", "number"],
      ["ref_verse", "Verse it points to", "number"],
      ["ref_verse_end", "Last verse of the range", "number"],
      ["ref_text_en", "Text of the verse (EN)", "textarea"],
      ["ref_text_lu", "Text of the verse (LU)", "textarea"],
      ["note_en", "Note (EN)", "textarea"],
      ["note_lu", "Note (LU)", "textarea"],
      ["source", "Source", "text"]
    ],
    labelOf: (row) => {
      const book = String(row.book_name || bookNameOf(row.book_number) || "");
      const from = `${book} ${row.chapter || ""}:${row.verse || ""}`.trim();
      const to = `${bookNameOf(row.ref_book_number) || row.ref_book_number || ""} ${
        row.ref_chapter || ""
      }:${row.ref_verse || ""}`.trim();
      return `${from} → ${to}`;
    }
  },
  {
    id: "Devotional",
    label: "Devotionals",
    note: "The daily devotionals shown on the Devotionals page.",
    fields: [
      ["code", "Code", "text"],
      ["title", "Title (EN)", "text"],
      ["title_lu", "Title (LU)", "text"],
      ["scripture", "Scripture (EN)", "text"],
      ["scripture_lu", "Scripture (LU)", "text"],
      ["body", "Devotional (EN)", "textarea"],
      ["body_lu", "Devotional (LU)", "textarea"],
      ["related", "Related scriptures", "text"],
      ["further_readings", "Further readings", "text"],
      ["cover_image", "Cover image URL", "text"],
      ["publish_date", "Publish date", "text"],
      ["day", "Calendar day", "number"],
      ["category", "Category", "text"]
    ]
  },
  {
    id: "BibleVerse",
    label: "Bible verses",
    note: "The verses of the Bible held in the app, in English and Luganda.",
    fields: [
      ["book_number", "Book number", "number"],
      ["book", "Book", "text"],
      ["chapter", "Chapter", "number"],
      ["verse", "Verse", "number"],
      ["text_en", "Verse (EN)", "textarea"],
      ["text_lu", "Verse (LU)", "textarea"]
    ]
  },
  {
    id: "Commentary",
    label: "Commentary",
    note: "The commentary notes shown beside a chapter.",
    fields: [
      ["book", "Book", "text"],
      ["chapter", "Chapter", "number"],
      ["title", "Title", "text"],
      ["body_en", "Commentary (EN)", "textarea"],
      ["body_lu", "Commentary (LU)", "textarea"]
    ]
  },
  {
    id: "Insight",
    label: "Insights",
    note: "The theological and historical insights behind a passage.",
    fields: [
      ["kind", "Kind (theological or historical)", "text"],
      ["title", "Title", "text"],
      ["passage", "Passage", "text"],
      ["excerpt", "Excerpt", "textarea"],
      ["body", "Body", "textarea"],
      ["share_count", "Shares", "number"]
    ]
  },
  {
    id: "QAEntry",
    label: "Questions and answers",
    note: "The questions readers ask and the pastoral answers.",
    fields: [
      ["question", "Question", "textarea"],
      ["category", "Category", "text"],
      ["answer", "Answer", "textarea"],
      ["passage_ref", "Bible passage", "text"],
      ["answered_by", "Answered by", "text"],
      ["status", "Status", "text"],
      ["author_email", "Asked by", "text"]
    ]
  },
  {
    id: "VerseOfDay",
    label: "Verse of the day",
    note: "The verse shown on the home page for each day.",
    fields: [
      ["verse_date", "Date", "text"],
      ["reference", "Reference", "text"],
      ["text_en", "Verse (EN)", "textarea"],
      ["text_lu", "Verse (LU)", "textarea"],
      ["note", "Reflection note", "textarea"]
    ]
  },
  {
    id: "LiveSession",
    label: "Live teaching",
    note: "The upcoming live teaching sessions.",
    fields: [
      ["title", "Title", "text"],
      ["session_date", "Date and time", "text"],
      ["host", "Host", "text"],
      ["join_link", "Join link", "text"],
      ["description", "Description", "textarea"]
    ]
  },
  {
    id: "DiscussionGroup",
    label: "Discussion groups",
    note: "The small groups where readers study the same passage.",
    fields: [
      ["name", "Group name", "text"],
      ["description", "Description", "textarea"],
      ["schedule", "Meeting schedule", "text"],
      ["member_count", "Members", "number"]
    ]
  },
  {
    id: "DiscussionThread",
    label: "Discussion messages",
    note: "The messages posted inside a discussion group.",
    fields: [
      ["group_name", "Group name", "text"],
      ["owner_email", "Author email", "text"],
      ["author_name", "Author name", "text"],
      ["title", "Title", "text"],
      ["body", "Message", "textarea"]
    ]
  },
  {
    id: "Revelation",
    label: "Reader revelations",
    note: "What readers said about a passage.",
    fields: [
      ["owner_email", "Author email", "text"],
      ["author_name", "Author name", "text"],
      ["title", "Title", "text"],
      ["passage", "Passage", "text"],
      ["body", "Revelation", "textarea"],
      ["likes", "Likes", "number"],
      ["parent_id", "Parent revelation", "text"]
    ]
  },
  {
    id: "ContactMessage",
    label: "Contact messages",
    note: "The messages sent through the contact form.",
    fields: [
      ["name", "Name", "text"],
      ["email", "Email", "text"],
      ["subject", "Subject", "text"],
      ["message", "Message", "textarea"],
      ["is_read", "Read", "boolean"],
      ["reply", "Reply", "textarea"]
    ]
  },
  {
    id: "SiteSettings",
    label: "Site settings",
    note: "The values the site reads, such as the name and the theme colours.",
    fields: [
      ["setting_key", "Key", "text"],
      ["setting_value", "Value", "textarea"]
    ]
  },
  {
    id: "VerseSongSeries",
    label: "Verse-song series",
    note: "The series the verse-songs are grouped in.",
    fields: [
      ["name", "Series name", "text"],
      ["description", "Description", "textarea"],
      ["thumbnail", "Thumbnail URL", "text"],
      ["cover_image", "Cover image URL", "text"],
      ["accent", "Accent colour", "text"]
    ]
  },
  {
    id: "VerseSongEpisode",
    label: "Verse-song episodes",
    note: "The songs inside a verse-song series.",
    fields: [
      ["series_name", "Series name", "text"],
      ["title", "Episode title", "text"],
      ["verse_ref", "Verse reference", "text"],
      ["duration_label", "Duration label", "text"],
      ["duration_seconds", "Duration (seconds)", "number"],
      ["audio_url", "Audio URL", "text"],
      ["audio_key", "Audio file key", "text"],
      ["thumbnail", "Thumbnail URL", "text"],
      ["episode_order", "Order", "number"]
    ]
  },
  {
    id: "ReadingPlan",
    label: "Reading plan",
    note: "The days of the reading journey and the passage of each day.",
    fields: [
      ["day", "Day", "number"],
      ["book", "Book", "text"],
      ["chapter", "Chapter", "number"],
      ["title", "Title", "text"],
      ["theme", "Theme", "text"],
      ["focus", "Focus", "text"],
      ["scripture", "Scripture", "text"]
    ]
  }
];

export const COLLECTION_BY_ID = COLLECTIONS.reduce((all, item) => {
  all[item.id] = item;
  return all;
}, {});

/** A blank record for the given collection. */
export const emptyRecord = (collectionId) => {
  const fields = COLLECTION_BY_ID[collectionId] ? COLLECTION_BY_ID[collectionId].fields : [];
  const values = {};
  fields.forEach(([name]) => {
    values[name] = "";
  });
  return values;
};

/** The name a record is known by in the list. */
export const recordTitle = (row, collectionId) => {
  const meta = COLLECTION_BY_ID[collectionId];
  if (meta && typeof meta.labelOf === "function") {
    const custom = String(meta.labelOf(row) || "").trim();
    if (custom) return custom;
  }
  const fields = COLLECTION_BY_ID[collectionId] ? COLLECTION_BY_ID[collectionId].fields : [];
  const named = fields.find(([name]) => ["title", "name", "question", "code", "setting_key"].includes(name));
  const key = named ? named[0] : "id";
  const value = String(row[key] || "").trim();
  if (value) return value;
  const first = fields.find(([name]) => row[name]);
  return first ? String(row[first[0]]).slice(0, 60) : String(row.id || "");
};

export { joinRefs, splitRefs };