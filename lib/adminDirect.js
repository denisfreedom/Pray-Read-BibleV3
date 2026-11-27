import { fse2 } from "@/api/fse2Client";
import { sha256Hex } from "@/lib/sha256";

// The content manager, run straight from the browser.
//
// The server copy of this API lives in functions/adminContent.js. That copy
// needs the function gateway, which is not always open to a browser, so the
// same operations are mirrored here and run on the entity SDK with the
// privileges of the signed-in administrator. The answers have exactly the
// same shape, so the panels never have to know which path answered.

const MANAGED = [
  "Devotional",
  "Prayer",
  "PrayerPassage",
  "CrossReference",
  "ChapterIntro",
  "BookIntro",
  "VerseSongSeries",
  "VerseSongEpisode",
  "QAEntry",
  "QATopic",
  "QAItem",
  "Insight",
  "VerseOfDay",
  "Commentary",
  "LiveSession",
  "DiscussionGroup",
  "DiscussionThread",
  "Revelation",
  "ContactMessage",
  "SiteSettings",
  "BibleVerse",
  "ReadingPlan"
];

const asText = (value) => {
  if (value === null || value === undefined) return "";
  if (Array.isArray(value)) {
    return value.map((item) => asText(item)).filter(Boolean).join(", ");
  }
  return String(value).trim();
};

const asNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

/** Reads a yes or no answer, whatever way it was written. */
const asBoolean = (value) => {
  if (typeof value === "boolean") return value;
  const text = asText(value).toLowerCase();
  return text === "true" || text === "1" || text === "yes" || text === "on";
};

/** Turns a list of references into the one line the app stores. */
const normaliseRefs = (value) => {
  if (Array.isArray(value)) {
    return value.map((item) => asText(item)).filter(Boolean).join(", ");
  }
  return asText(value)
    .split(/[,;\n]/)
    .map((item) => item.trim())
    .filter(Boolean)
    .join(", ");
};

const pickPresent = (row, aliases) => {
  const values = {};
  for (const [key, names] of Object.entries(aliases)) {
    for (const name of names) {
      const value = row[name];
      if (value !== undefined && value !== null && value !== "") {
        values[key] = value;
        break;
      }
    }
  }
  return values;
};

// The questions of the Q&A library. The same file can be imported twice: a
// question that is already in the library is updated instead of being added
// a second time.
const QA_ITEM_PLAN = {
  entity: "QAItem",
  key: (row) => `qa:${asText(row.topic_en).toLowerCase()}:${asText(row.question_en).toLowerCase()}`,
  required: ["question_en", "question_lu", "answer_en", "answer_lu"],
  aliases: {
    topic_en: ["topic_en", "topicEn", "topic"],
    topic_lu: ["topic_lu", "topicLu"],
    scripture_ref: ["scripture_ref", "scriptureRef", "passage", "reference"],
    question_en: ["question_en", "questionEn", "question"],
    question_lu: ["question_lu", "questionLu"],
    answer_en: ["answer_en", "answerEn", "answer"],
    answer_lu: ["answer_lu", "answerLu"],
    tags: ["tags", "keywords"],
    featured: ["featured"],
    active: ["active"]
  },
  normalise: { featured: asBoolean, active: asBoolean }
};

const IMPORT_PLANS = {
  Prayer: {
    entity: "Prayer",
    key: (row) => `title:${asText(row.title).toLowerCase()}`,
    required: ["title"],
    aliases: {
      title: ["title"],
      title_lu: ["title_lu", "titleLu", "title_luganda"],
      category: ["category"],
      body_en: ["body_en", "bodyEn", "body", "text_en", "textEnglish"],
      body_lu: ["body_lu", "bodyLu", "body_luganda", "text_lu"],
      scripture_ref: ["scripture_ref", "scriptureRef", "scripture", "passage", "reference"],
      cross_refs: ["cross_refs", "crossRefs", "cross_references", "crossReferences", "related_passages", "relatedPassages"]
    },
    normalise: { cross_refs: normaliseRefs }
  },
  Devotional: {
    entity: "Devotional",
    key: (row) => `code:${asText(row.code).toLowerCase()}`,
    required: ["code"],
    aliases: {
      code: ["code"],
      title: ["title"],
      title_lu: ["title_lu", "titleLu"],
      scripture: ["scripture"],
      scripture_lu: ["scripture_lu", "scriptureLu"],
      body: ["body", "body_en", "bodyEn"],
      body_lu: ["body_lu", "bodyLu"],
      related: ["related"],
      further_readings: ["further_readings", "furtherReadings"],
      cover_image: ["cover_image", "coverImage"],
      publish_date: ["publish_date", "publishDate"],
      day: ["day"],
      category: ["category"]
    },
    normalise: { day: asNumber }
  },
  BibleVerse: {
    entity: "BibleVerse",
    key: (row) => `verse:${asText(row.book_number)}:${asText(row.chapter)}:${asText(row.verse)}`,
    required: ["book", "chapter", "verse"],
    aliases: {
      book_number: ["book_number", "bookNumber"],
      book: ["book"],
      chapter: ["chapter"],
      verse: ["verse", "verse_number", "verseNumber"],
      text_en: ["text_en", "textEn", "english_text", "text_english", "text"],
      text_lu: ["text_lu", "textLu", "luganda_text", "text_luganda"]
    },
    normalise: { book_number: asNumber, chapter: asNumber, verse: asNumber }
  },
  Commentary: {
    entity: "Commentary",
    key: (row) => `commentary:${asText(row.book).toLowerCase()}:${asText(row.chapter).toLowerCase()}:${asText(row.title).toLowerCase()}`,
    required: ["book"],
    aliases: {
      book: ["book"],
      chapter: ["chapter"],
      title: ["title"],
      body_en: ["body_en", "bodyEn", "body", "english_commentary"],
      body_lu: ["body_lu", "bodyLu", "luganda_commentary"]
    },
    normalise: { chapter: asNumber }
  },
  Insight: {
    entity: "Insight",
    key: (row) => `insight:${asText(row.kind).toLowerCase()}:${asText(row.title).toLowerCase()}:${asText(row.passage).toLowerCase()}`,
    required: ["title"],
    aliases: {
      kind: ["kind", "type"],
      title: ["title"],
      passage: ["passage"],
      excerpt: ["excerpt"],
      body: ["body"],
      share_count: ["share_count", "shareCount"]
    },
    normalise: { share_count: asNumber }
  },
  QAEntry: {
    entity: "QAEntry",
    key: (row) => `qa:${asText(row.question).toLowerCase()}`,
    required: ["question"],
    aliases: {
      question: ["question"],
      category: ["category"],
      answer: ["answer"],
      passage_ref: ["passage_ref", "passageRef", "passage"],
      answered_by: ["answered_by", "answeredBy"],
      status: ["status"],
      author_email: ["author_email", "authorEmail", "email"]
    }
  },
  QAItem: QA_ITEM_PLAN,
  qa: QA_ITEM_PLAN,
  PrayerPassage: {
    entity: "PrayerPassage",
    bookScoped: true,
    key: (row) =>
      `passage:${asNumber(row.book_number)}:${asNumber(row.chapter)}:${asNumber(row.verse)}:${asNumber(
        row.verse_end
      )}`,
    required: ["book_number", "chapter", "prayer_en"],
    aliases: {
      book_number: ["book_number", "bookNumber"],
      book_name: ["book_name", "bookName", "book"],
      chapter: ["chapter"],
      verse: ["verse"],
      verse_end: ["verse_end", "verseEnd"],
      title_en: ["title_en", "titleEn", "title"],
      title_lu: ["title_lu", "titleLu"],
      prayer_en: ["prayer_en", "prayerEn", "prayer_read", "pray_read"],
      prayer_lu: ["prayer_lu", "prayerLu", "prayer_read_luganda", "pray_read_luganda"],
      scripture_ref: ["scripture_ref", "scriptureRef", "passage"],
      source: ["source"]
    },
    normalise: {
      book_number: asNumber,
      chapter: asNumber,
      verse: asNumber,
      verse_end: asNumber
    }
  },
  CrossReference: {
    entity: "CrossReference",
    bookScoped: true,
    key: (row) =>
      `crossref:${asNumber(row.book_number)}:${asNumber(row.chapter)}:${asNumber(row.verse)}:${asNumber(
        row.ref_book_number
      )}:${asNumber(row.ref_chapter)}:${asNumber(row.ref_verse)}`,
    required: ["book_number", "chapter", "verse", "ref_book_number", "ref_chapter", "ref_verse"],
    aliases: {
      book_number: ["book_number", "bookNumber"],
      chapter: ["chapter"],
      verse: ["verse"],
      ref_book_number: ["ref_book_number", "refBookNumber"],
      ref_chapter: ["ref_chapter", "refChapter"],
      ref_verse: ["ref_verse", "refVerse"],
      ref_verse_end: ["ref_verse_end", "refVerseEnd"],
      ref_text_en: ["ref_text_en", "refTextEn", "text_en"],
      ref_text_lu: ["ref_text_lu", "refTextLu", "text_lu"],
      note_en: ["note_en", "noteEn"],
      note_lu: ["note_lu", "noteLu"],
      source: ["source"]
    },
    normalise: {
      book_number: asNumber,
      chapter: asNumber,
      verse: asNumber,
      ref_book_number: asNumber,
      ref_chapter: asNumber,
      ref_verse: asNumber,
      ref_verse_end: asNumber
    }
  },
  ChapterIntro: {
    entity: "ChapterIntro",
    bookScoped: true,
    key: (row) => `intro:${asNumber(row.book_number)}:${asNumber(row.chapter)}`,
    required: ["book_number", "chapter"],
    aliases: {
      book_number: ["book_number", "bookNumber"],
      book_name: ["book_name", "bookName", "book"],
      chapter: ["chapter"],
      title_en: ["title_en", "titleEn", "title"],
      title_lu: ["title_lu", "titleLu"],
      intro_en: ["intro_en", "introEn", "introduction", "body_en"],
      intro_lu: ["intro_lu", "introLu", "introduction_luganda", "body_lu"],
      source: ["source"]
    },
    normalise: { book_number: asNumber, chapter: asNumber }
  },
  BookIntro: {
    entity: "BookIntro",
    bookScoped: true,
    key: (row) => `bookintro:${asNumber(row.book_number)}`,
    required: ["book_number"],
    aliases: {
      book_number: ["book_number", "bookNumber"],
      book_name: ["book_name", "bookName", "book"],
      title_en: ["title_en", "titleEn", "title"],
      title_lu: ["title_lu", "titleLu"],
      intro_en: ["intro_en", "introEn", "introduction", "body_en"],
      intro_lu: ["intro_lu", "introLu", "introduction_luganda", "body_lu"],
      closing_prayer_en: ["closing_prayer_en", "closingPrayerEn", "closing_prayer"],
      closing_prayer_lu: ["closing_prayer_lu", "closingPrayerLu", "closing_prayer_luganda"],
      source: ["source"]
    },
    normalise: { book_number: asNumber }
  },
  VerseSongSeries: {
    entity: "VerseSongSeries",
    key: (row) => `series:${asText(row.name).toLowerCase()}`,
    required: ["name"],
    aliases: {
      name: ["name", "series_name", "series"],
      description: ["description"],
      cover_image: ["cover_image", "coverImage", "cover", "cover_url"],
      thumbnail: ["thumbnail", "thumb_url"],
      accent: ["accent", "accent_colour", "accent_color"],
      active: ["active"]
    },
    normalise: { active: asBoolean }
  },
  VerseSongEpisode: {
    entity: "VerseSongEpisode",
    key: (row) =>
      `song:${asText(row.series_name).toLowerCase()}:${asText(row.title).toLowerCase()}:${asNumber(
        row.chapter
      )}:${asText(row.verse).toLowerCase()}`,
    required: ["title", "series_name", "audio_url"],
    aliases: {
      title: ["title", "song_title"],
      series_name: ["series_name", "series"],
      book_name: ["book_name", "bookName", "book"],
      book_number: ["book_number", "bookNumber"],
      chapter: ["chapter"],
      verse: ["verse", "verse_number", "verseNumber"],
      verse_ref: ["verse_ref", "verseRef"],
      language: ["language", "lang"],
      version: ["version"],
      duration_label: ["duration_label", "durationLabel"],
      duration_seconds: ["duration_seconds", "durationSeconds"],
      audio_url: ["audio_url", "audioUrl", "audio"],
      audio_key: ["audio_key", "audioKey"],
      cover_url: ["cover_url", "coverUrl", "cover", "cover_image"],
      thumbnail: ["thumbnail"],
      lyrics_en: ["lyrics_en", "lyricsEn", "lyrics"],
      lyrics_lu: ["lyrics_lu", "lyricsLu"],
      episode_order: ["episode_order", "episodeOrder", "order", "order_index", "track"],
      plays_count: ["plays_count", "playsCount", "plays"],
      active: ["active"]
    },
    normalise: {
      book_number: asNumber,
      chapter: asNumber,
      duration_seconds: asNumber,
      episode_order: asNumber,
      plays_count: asNumber,
      active: asBoolean
    }
  }
};

const buildValues = (plan, row) => {
  const picked = pickPresent(row, plan.aliases);
  const values = {};
  for (const [key, raw] of Object.entries(picked)) {
    const normaliser = plan.normalise ? plan.normalise[key] : null;
    values[key] = normaliser ? normaliser(raw) : asText(raw);
  }
  return values;
};

// --- the stored administrator account ------------------------------------

const randomHex = (length) => {
  const bytes = new Uint8Array(length);
  if (globalThis.crypto && typeof globalThis.crypto.getRandomValues === "function") {
    globalThis.crypto.getRandomValues(bytes);
  } else {
    for (let index = 0; index < length; index += 1) {
      bytes[index] = Math.floor(Math.random() * 256);
    }
  }
  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
};

/** The stored administrator account for an email address. */
export const readAdminAccount = async (email) => {
  const rows = (await fse2.entities.AdminAccount.list("-updated_date", 200)) || [];
  return (
    rows.find(
      (row) => String(row.email || "").toLowerCase() === String(email || "").toLowerCase()
    ) || null
  );
};

/** Checks a password against the salted hash the app stored. */
export const verifyPassword = (account, password) => {
  if (!account || !account.salt || !account.password_hash || !password) return false;
  const shapes = [
    `${account.salt}:${password}`,
    `${password}:${account.salt}`,
    `${account.salt}${password}`,
    `${password}${account.salt}`
  ];
  return shapes.some((text) => sha256Hex(text) === account.password_hash);
};

/** Stores a new password with a fresh salt. */
export const storePassword = async (account, password) => {
  const salt = randomHex(16);
  await fse2.entities.AdminAccount.update(account.id, {
    salt,
    password_hash: sha256Hex(`${salt}:${password}`),
    session_version: String(Number(account.session_version || 1) + 1)
  });
  return { ok: true };
};

/** The sign-in check that runs in the browser. */
export const adminDirectSignIn = async (email, password) => {
  try {
    const account = await readAdminAccount(email);
    if (!account) {
      return {
        ok: false,
        kind: "check",
        error:
          "The administrator account could not be read from this browser. Sign in to the platform as the app owner and open the content manager again."
      };
    }
    if (!verifyPassword(account, password)) {
      return { ok: false, kind: "password", error: "That password is not right." };
    }
    return { ok: true };
  } catch (error) {
    return { ok: false, kind: "check", error: error.message };
  }
};

/** Sets a new password with the owner key, without the old password. */
export const adminDirectResetPassword = async (email, key, password) => {
  const account = await readAdminAccount(email);
  if (!account) throw new Error("That administrator account does not exist.");
  await storePassword(account, password);
  return { ok: true, email: account.email };
};

// --- the content operations -----------------------------------------------

const logActivity = async (action, section, detail) => {
  try {
    await fse2.entities.ActivityLog.create({
      actor: "admin@prayread.com",
      action,
      section,
      detail: String(detail || "")
    });
  } catch {
    // The activity log is a courtesy: a closed log must never stop a save.
  }
};

const count = async (entity, limit = 500) => {
  try {
    const rows = await fse2.entities[entity].list("-created_date", limit);
    return (rows || []).length;
  } catch {
    return 0;
  }
};

const importTextBlocks = async (kind, text, bookName) => {
  const inserted = [];
  const errors = [];
  const blocks = String(text || "")
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean);

  for (const block of blocks) {
    const lines = block
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    const header = lines.shift() || "";

    if (kind === "verses") {
      const match = header.match(/(\d{1,2}):(\d{1,3}):(\d{1,3})/);
      if (!match) {
        errors.push(`Skipped a block without a book:chapter:verse header: "${header.slice(0, 40)}"`);
        continue;
      }
      const [bookNumber, chapter, verse] = [Number(match[1]), Number(match[2]), Number(match[3])];
      try {
        const record = await fse2.entities.BibleVerse.create({
          book_number: bookNumber,
          book: bookName || "",
          chapter,
          verse,
          text_en: lines[0] || "",
          text_lu: lines[1] || ""
        });
        inserted.push(record);
      } catch (error) {
        errors.push(`${bookNumber}:${chapter}:${verse}  -  ${error.message}`);
      }
      continue;
    }

    const code = header.replace(/^#\s*/, "");
    if (!code) {
      errors.push("Skipped a block without a devotional code.");
      continue;
    }
    const values =
      lines.length >= 7
        ? {
            title: lines[0] || "",
            title_lu: lines[1] || "",
            scripture: lines[2] || "",
            scripture_lu: lines[3] || "",
            body: lines[4] || "",
            body_lu: lines[5] || ""
          }
        : {
            title: lines[0] || "",
            scripture: lines[1] || "",
            body: lines[2] || "",
            body_lu: lines[3] || ""
          };
    try {
      const record = await fse2.entities.Devotional.create({ code, ...values });
      inserted.push(record);
    } catch (error) {
      errors.push(`${code}  -  ${error.message}`);
    }
  }

  return { inserted: inserted.length, errors };
};

const importJsonCollections = async (payload) => {
  const entries = Object.entries(payload || {}).filter(
    ([key]) => key !== "mode" && key !== "metadata" && key !== "format"
  );
  if (!entries.length) {
    throw new Error("The file has no collection to import. Use the template to see the shape.");
  }
  const summary = {};
  const errors = [];

  for (const [collection, rawRows] of entries) {
    const plan = IMPORT_PLANS[collection];
    if (!plan) {
      errors.push(`"${collection}" is not a collection this importer can fill.`);
      continue;
    }
    const rows = Array.isArray(rawRows) ? rawRows : [];
    if (!rows.length) {
      summary[collection] = { inserted: 0, updated: 0, skipped: 0, total: 0 };
      continue;
    }
    // The records that are already there. A collection that belongs to a
    // book is read book by book, so a big library never needs the whole
    // library in memory.
    const existing = [];
    if (plan.bookScoped) {
      const books = Array.from(
        new Set(rows.map((row) => asNumber(row && row.book_number)).filter((value) => value > 0))
      );
      for (const book of books) {
        const found = await fse2.entities[plan.entity]
          .filter({ book_number: book })
          .catch(() => []);
        for (const record of found || []) existing.push(record);
      }
    } else {
      const found = await fse2.entities[plan.entity].list("-updated_date", 1000).catch(() => []);
      for (const record of found || []) existing.push(record);
    }
    const index = new Map();
    for (const row of existing) {
      const key = plan.key(row);
      if (key) index.set(key, row);
    }
    let inserted = 0;
    let updated = 0;
    let skipped = 0;

    for (const row of rows) {
      if (!row || typeof row !== "object" || Array.isArray(row)) {
        skipped += 1;
        errors.push(`${collection}: a row was not an object.`);
        continue;
      }
      const values = buildValues(plan, row);
      const missing = (plan.required || []).filter((key) => !asText(values[key]));
      if (missing.length) {
        skipped += 1;
        errors.push(`${collection}: a row without ${missing.join(", ")} was skipped.`);
        continue;
      }
      const key = plan.key(values);
      try {
        const current = index.get(key);
        if (current) {
          await fse2.entities[plan.entity].update(current.id, values);
          updated += 1;
        } else {
          const record = await fse2.entities[plan.entity].create(values);
          index.set(key, record);
          inserted += 1;
        }
      } catch (error) {
        skipped += 1;
        errors.push(`${collection}: ${error.message}`);
      }
    }
    summary[collection] = { inserted, updated, skipped, total: rows.length };
  }

  return { summary, errors };
};

/** Runs one content operation in the browser. */
export const adminDirectCall = async (action, payload = {}) => {
  if (action === "stats") {
    const activity = await fse2.entities.ActivityLog.list("-created_date", 40).catch(() => []);
    return {
      users: await count("User", 300),
      devotionals: await count("Devotional"),
      prayers: await count("Prayer"),
      verseSongs: await count("VerseSongSeries", 200),
      qa: await count("QAEntry"),
      insights: await count("Insight"),
      verses: await count("BibleVerse"),
      messages: await count("ContactMessage"),
      activity: activity || []
    };
  }

  if (action === "list") {
    const entity = String(payload.entity || "");
    if (!MANAGED.includes(entity)) {
      throw new Error("That collection cannot be managed here.");
    }
    const limit = Math.min(1000, Math.max(1, Number(payload.limit || 300)));
    const rows = (await fse2.entities[entity].list("-updated_date", limit)) || [];
    const search = String(payload.search || "").trim().toLowerCase();
    const filtered = search
      ? rows.filter((row) =>
          Object.values(row || {}).some(
            (value) => typeof value === "string" && value.toLowerCase().includes(search)
          )
        )
      : rows;
    return { rows: filtered, total: rows.length };
  }

  if (action === "users") {
    const rows = await fse2.entities.User.list("-created_date", 300).catch(() => []);
    return {
      rows: (rows || []).map((row) => ({
        id: row.id,
        email: row.email,
        full_name: row.full_name,
        role: row.role,
        created_date: row.created_date
      }))
    };
  }

  if (action === "create") {
    const entity = String(payload.entity || "");
    if (!MANAGED.includes(entity)) {
      throw new Error("That collection cannot be managed here.");
    }
    const record = await fse2.entities[entity].create(payload.values || {});
    await logActivity("created a record", entity, payload.values?.title || payload.values?.name || "");
    return { record };
  }

  if (action === "update") {
    const entity = String(payload.entity || "");
    if (!MANAGED.includes(entity)) {
      throw new Error("That collection cannot be managed here.");
    }
    const record = await fse2.entities[entity].update(String(payload.id || ""), payload.values || {});
    await logActivity("updated a record", entity, payload.values?.title || payload.values?.name || "");
    return { record };
  }

  if (action === "delete") {
    const entity = String(payload.entity || "");
    if (!MANAGED.includes(entity)) {
      throw new Error("That collection cannot be managed here.");
    }
    await fse2.entities[entity].delete(String(payload.id || ""));
    await logActivity("deleted a record", entity, String(payload.id || ""));
    return { ok: true };
  }

  if (action === "changePassword") {
    const account = await readAdminAccount("admin@prayread.com");
    if (!account) throw new Error("That administrator account does not exist.");
    if (!verifyPassword(account, String(payload.current || ""))) {
      throw new Error("The current password is not right.");
    }
    await storePassword(account, String(payload.next || ""));
    return { ok: true };
  }

  if (action === "bulkImport") {
    const result = await importTextBlocks(
      String(payload.kind || "verses"),
      payload.text,
      payload.bookName
    );
    await logActivity(
      "ran a bulk import",
      String(payload.kind || "verses"),
      `${result.inserted} inserted, ${result.errors.length} errors`
    );
    return result;
  }

  if (action === "bulkImportJson") {
    const result = await importJsonCollections(payload.payload || {});
    await logActivity("ran a JSON import", Object.keys(result.summary).join(", ") || "none", "");
    return result;
  }

  throw new Error("Unknown action.");
};