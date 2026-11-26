// Admin content manager API. Every call is authorised with the signed admin
// session token issued by functions/adminAuth.js, and runs with the app's
// own privileges so the CMS can write content entities.

const encoder = new TextEncoder();

// A session that has just run out is still accepted for a while, so a long
// job is never cut off in the middle by the clock.
const RENEW_GRACE_MS = 1000 * 60 * 60 * 24 * 14;

// Base64 without Buffer, so the session token is read the same way wherever
// the function runs.
const decodeBase64 = (value) => {
  const binary = atob(value);
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
  return new TextDecoder().decode(bytes);
};

const toHex = (buffer) =>
  Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");

const sign = async (payload, secret) => {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return toHex(signature);
};

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

// --- JSON import ---------------------------------------------------------
// The JSON importer fills a collection from an uploaded file. Every row is
// matched against the records that are already in the app by a natural key
// (the title of a prayer, the code of a devotional, the book, chapter and
// verse of a verse), so a file can be uploaded again safely: rows that are
// already there are updated, new rows are added.

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
    key: (row) => `commentary:${asText(row.book).toLowerCase()}:${asText(row.chapter)}:${asText(row.title).toLowerCase()}`,
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

const findAccount = async (email) => {
  const rows = await fse2.entities.AdminAccount.list("-updated_date", 200);
  return (rows || []).find((row) => String(row.email || "").toLowerCase() === String(email || "").toLowerCase()) || null;
};

const verifyToken = async (token) => {
  if (!token || typeof token !== "string" || !token.includes(".")) return null;
  const [payload, signature] = token.split(".");
  const rows = await fse2.entities.AdminAccount.list("-updated_date", 200);
  for (const account of rows || []) {
    if (!account.secret) continue;
    const expected = await sign(payload, account.secret);
    if (expected !== signature) continue;
    const data = JSON.parse(decodeBase64(payload));
    // A session that has just run out is still accepted for a while, so a
    // long task is never cut off in the middle by the clock.
    if (data.exp + RENEW_GRACE_MS < Date.now()) continue;
    if (String(data.sv) !== String(account.session_version || "1")) continue;
    return { data, account };
  }
  return null;
};

const logActivity = async (account, action, section, detail) => {
  await fse2.entities.ActivityLog.create({
    actor: account.email,
    action,
    section,
    detail: String(detail || "")
  });
};

Deno.serve(async (req) => {
  try {
    const body = await req.json();
    const action = String(body.action || "");
    const session = await verifyToken(body.token);
    if (!session) {
      return Response.json({ error: "Your admin session expired. Sign in again." }, { status: 401 });
    }
    const { account } = session;

    if (action === "stats") {
      const [users, devotionals, prayers, series, qa, insights, verses, messages] = await Promise.all([
        fse2.entities.User.list("-created_date", 500).catch(() => []),
        fse2.entities.Devotional.list("-created_date", 500).catch(() => []),
        fse2.entities.Prayer.list("-created_date", 500).catch(() => []),
        fse2.entities.VerseSongSeries.list("-created_date", 200).catch(() => []),
        fse2.entities.QAEntry.list("-created_date", 500).catch(() => []),
        fse2.entities.Insight.list("-created_date", 500).catch(() => []),
        fse2.entities.BibleVerse.list("-created_date", 500).catch(() => []),
        fse2.entities.ContactMessage.list("-created_date", 500).catch(() => [])
      ]);
      const activity = await fse2.entities.ActivityLog.list("-created_date", 40).catch(() => []);
      return Response.json({
        users: (users || []).length,
        devotionals: (devotionals || []).length,
        prayers: (prayers || []).length,
        verseSongs: (series || []).length,
        qa: (qa || []).length,
        insights: (insights || []).length,
        verses: (verses || []).length,
        messages: (messages || []).length,
        activity: activity || []
      });
    }

    if (action === "list") {
      const entity = String(body.entity || "");
      if (!MANAGED.includes(entity)) {
        return Response.json({ error: "That collection cannot be managed here." }, { status: 400 });
      }
      const limit = Math.min(1000, Math.max(1, Number(body.limit || 300)));
      const rows = (await fse2.entities[entity].list("-updated_date", limit)) || [];
      const search = String(body.search || "").trim().toLowerCase();
      const filtered = search
        ? rows.filter((row) =>
            Object.values(row || {}).some(
              (value) => typeof value === "string" && value.toLowerCase().includes(search)
            )
          )
        : rows;
      return Response.json({ rows: filtered, total: rows.length });
    }

    if (action === "users") {
      const rows = await fse2.entities.User.list("-created_date", 300).catch(() => []);
      return Response.json({
        rows: (rows || []).map((row) => ({
          id: row.id,
          email: row.email,
          full_name: row.full_name,
          role: row.role,
          created_date: row.created_date
        }))
      });
    }

    if (action === "create") {
      const entity = String(body.entity || "");
      if (!MANAGED.includes(entity)) {
        return Response.json({ error: "That collection cannot be managed here." }, { status: 400 });
      }
      const record = await fse2.entities[entity].create(body.values || {});
      await logActivity(account, "created a record", entity, body.values?.title || body.values?.name || "");
      return Response.json({ record });
    }

    if (action === "update") {
      const entity = String(body.entity || "");
      if (!MANAGED.includes(entity)) {
        return Response.json({ error: "That collection cannot be managed here." }, { status: 400 });
      }
      const record = await fse2.entities[entity].update(String(body.id || ""), body.values || {});
      await logActivity(account, "updated a record", entity, body.values?.title || body.values?.name || "");
      return Response.json({ record });
    }

    if (action === "delete") {
      const entity = String(body.entity || "");
      if (!MANAGED.includes(entity)) {
        return Response.json({ error: "That collection cannot be managed here." }, { status: 400 });
      }
      await fse2.entities[entity].delete(String(body.id || ""));
      await logActivity(account, "deleted a record", entity, String(body.id || ""));
      return Response.json({ ok: true });
    }

    if (action === "bulkImport") {
      const kind = String(body.kind || "verses");
      const text = String(body.text || "");
      const inserted = [];
      const errors = [];

      if (kind === "verses") {
        const blocks = text
          .split(/\n\s*\n/)
          .map((block) => block.trim())
          .filter(Boolean);
        for (const block of blocks) {
          const lines = block.split("\n").map((line) => line.trim()).filter(Boolean);
          const header = lines.shift() || "";
          const match = header.match(/(\d{1,2}):(\d{1,3}):(\d{1,3})/);
          if (!match) {
            errors.push(`Skipped a block without a book:chapter:verse header: "${header.slice(0, 40)}"`);
            continue;
          }
          const [bookNumber, chapter, verse] = [Number(match[1]), Number(match[2]), Number(match[3])];
          const textEn = lines[0] || "";
          const textLu = lines[1] || "";
          try {
            const record = await fse2.entities.BibleVerse.create({
              book_number: bookNumber,
              book: body.bookName || "",
              chapter,
              verse,
              text_en: textEn,
              text_lu: textLu
            });
            inserted.push(record);
          } catch (error) {
            errors.push(`${bookNumber}:${chapter}:${verse}  -  ${error.message}`);
          }
        }
      } else {
        const blocks = text
          .split(/\n\s*\n/)
          .map((block) => block.trim())
          .filter(Boolean);
        for (const block of blocks) {
          const lines = block.split("\n").map((line) => line.trim()).filter(Boolean);
          const code = (lines.shift() || "").replace(/^#\s*/, "");
          if (!code) {
            errors.push("Skipped a block without a devotional code.");
            continue;
          }
          // Seven lines carry the full bilingual set, the older five line
          // format is still accepted so past imports keep working.
          const values = lines.length >= 7
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
      }

      await logActivity(account, "ran a bulk import", kind, `${inserted.length} inserted, ${errors.length} errors`);
      return Response.json({ inserted: inserted.length, errors });
    }

    if (action === "bulkImportJson") {
      const payload = body.payload || {};
      const entries = Object.entries(payload).filter(
        ([key]) => key !== "mode" && key !== "metadata"
      );
      if (!entries.length) {
        return Response.json(
          { error: "The file has no collection to import. Use the template to see the shape." },
          { status: 400 }
        );
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
      await logActivity(
        account,
        "ran a JSON import",
        Object.keys(summary).join(", ") || "none",
        Object.entries(summary)
          .map(([key, value]) => `${key}: ${value.inserted} new, ${value.updated} updated, ${value.skipped} skipped`)
          .join(" · ")
      );
      return Response.json({ summary, errors });
    }

    return Response.json({ error: "Unknown action." }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});