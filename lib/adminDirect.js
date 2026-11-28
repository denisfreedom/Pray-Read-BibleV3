import { fse2 } from "@/api/fse2Client";
import { passageNaturalKey, crossRefNaturalKey } from "@/lib/prayerPassages";
import { resolveBook } from "@/lib/scriptureRefs";
import { prepareImport, importShapeOf } from "@/lib/prayerImport";
import { getBookByNumber } from "@/lib/bibleBooks";

// The content manager, run straight from the browser.
//
// The server copy of this API lives in functions/adminContent.js. That copy
// needs the function gateway, which is not always open to a browser, so the
// same operations are mirrored here and run on the entity SDK with the
// privileges of the signed-in administrator. The answers have exactly the
// same shape, so the panels never have to know which path answered.

const MANAGED = ["Devotional", "DevotionalTopic", "DevotionalPlan", "DevotionalSaved", "Prayer", "PrayerPassage", "CrossReference", "ChapterIntro", "BookIntro", "VerseSongSeries", "VerseSongEpisode", "QAEntry", "QATopic", "QAItem", "Insight", "VerseOfDay", "Commentary", "LiveSession", "DiscussionGroup", "DiscussionThread", "Revelation", "ContactMessage", "SiteSettings", "BibleVerse", "ReadingPlan"];

const asText = (value) => {
  if (value === null || value === undefined) return "";
  if (Array.isArray(value)) return value.map((item) => asText(item)).filter(Boolean).join(", ");
  if (value && typeof value === "object") return asLanguageText(value, "en") || asLanguageText(value, "lu");
  return String(value).trim();
};
const asLanguageText = (value, language) => {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    const keys = language === "lu" ? ["lu", "luganda", "text_lu", "intro_lu", "prayer_lu", "body_lu", "introduction_luganda", "introduction_lu", "title_lu", "title_luganda", "body_luganda"] : ["en", "english", "text_en", "intro_en", "prayer_en", "body_en", "introduction_en", "title_en", "title", "body", "text", "introduction"];
    for (const key of keys) {
      const candidate = value[key];
      const text = typeof candidate === "string" || typeof candidate === "number" ? String(candidate).trim() : "";
      if (text) return text;
    }
    return "";
  }
  if (typeof value === "number") return language === "lu" ? "" : String(value);
  return language === "lu" ? "" : (typeof value === "string" ? value.trim() : "");
};
const asNumber = (value) => { const parsed = Number(value); return Number.isFinite(parsed) ? parsed : 0; };
const asNumberOrNull = (value) => { if (value === null || value === undefined || value === "") return null; const parsed = Number(value); return Number.isFinite(parsed) ? parsed : null; };
const asBoolean = (value) => { if (typeof value === "boolean") return value; const text = asText(value).toLowerCase(); return text === "true" || text === "1" || text === "yes" || text === "on"; };
const normaliseRefs = (value) => Array.isArray(value) ? value.map((item) => asText(item)).filter(Boolean).join(", ") : asText(value).split(/[,;\n]/).map((item) => item.trim()).filter(Boolean).join(", ");
const pickPresent = (row, aliases) => {
  const values = {};
  for (const [key, names] of Object.entries(aliases)) for (const name of names) if (row[name] !== undefined) { values[key] = row[name]; break; }
  return values;
};
const QA_ITEM_PLAN = { entity: "QAItem", key: (row) => `qa:${asText(row.topic_en).toLowerCase()}:${asText(row.question_en).toLowerCase()}`, required: ["question_en", "question_lu", "answer_en", "answer_lu"], aliases: { topic_en: ["topic_en", "topicEn", "topic"], topic_lu: ["topic_lu", "topicLu"], scripture_ref: ["scripture_ref", "scriptureRef", "passage", "reference"], question_en: ["question_en", "questionEn", "question"], question_lu: ["question_lu", "questionLu"], answer_en: ["answer_en", "answerEn", "answer"], answer_lu: ["answer_lu", "answerLu"], tags: ["tags", "keywords"], featured: ["featured"], active: ["active"] }, normalise: { featured: asBoolean, active: asBoolean } };
const IMPORT_PLANS = {
  Prayer: { entity: "Prayer", key: (row) => `title:${asText(row.title).toLowerCase()}`, required: ["title"], aliases: { title: ["title"], title_lu: ["title_lu", "titleLu", "title_luganda"], category: ["category"], body_en: ["body_en", "bodyEn", "body", "text_en", "textEnglish"], body_lu: ["body_lu", "bodyLu", "body_luganda", "text_lu"], scripture_ref: ["scripture_ref", "scriptureRef", "scripture", "passage", "reference"], cross_refs: ["cross_refs", "crossRefs", "cross_references", "crossReferences", "related_passages", "relatedPassages"] }, normalise: { cross_refs: normaliseRefs } },
  Devotional: { entity: "Devotional", key: (row) => `code:${asText(row.code).toLowerCase()}`, required: ["code"], aliases: { code: ["code"], title: ["title"], title_lu: ["title_lu", "titleLu"], scripture: ["scripture"], scripture_lu: ["scripture_lu", "scriptureLu"], body: ["body", "body_en", "bodyEn"], body_lu: ["body_lu", "bodyLu"], related: ["related"], further_readings: ["further_readings", "furtherReadings"], cover_image: ["cover_image", "coverImage"], publish_date: ["publish_date", "publishDate"], day: ["day"], category: ["category"] }, normalise: { day: asNumber } },
  BibleVerse: { entity: "BibleVerse", key: (row) => `verse:${asText(row.book_number)}:${asText(row.chapter)}:${asText(row.verse)}`, required: ["book", "chapter", "verse"], aliases: { book_number: ["book_number", "bookNumber"], book: ["book"], chapter: ["chapter"], verse: ["verse", "verse_number", "verseNumber"], text_en: ["text_en", "textEn", "english_text", "text_english", "text"], text_lu: ["text_lu", "textLu", "luganda_text", "text_luganda"] }, normalise: { book_number: asNumber, chapter: asNumber, verse: asNumber } },
  Commentary: { entity: "Commentary", key: (row) => `commentary:${asText(row.book).toLowerCase()}:${asText(row.chapter).toLowerCase()}:${asText(row.title).toLowerCase()}`, required: ["book"], aliases: { book: ["book"], chapter: ["chapter"], title: ["title"], body_en: ["body_en", "bodyEn", "body", "english_commentary"], body_lu: ["body_lu", "bodyLu", "luganda_commentary"] }, normalise: { chapter: asNumber } },
  Insight: { entity: "Insight", key: (row) => `insight:${asText(row.kind).toLowerCase()}:${asText(row.title).toLowerCase()}:${asText(row.passage).toLowerCase()}`, required: ["title"], aliases: { kind: ["kind", "type"], title: ["title"], passage: ["passage"], excerpt: ["excerpt"], body: ["body"], share_count: ["share_count", "shareCount"] }, normalise: { share_count: asNumber } },
  QAEntry: { entity: "QAEntry", key: (row) => `qa:${asText(row.question).toLowerCase()}`, required: ["question"], aliases: { question: ["question"], category: ["category"], answer: ["answer"], passage_ref: ["passage_ref", "passageRef", "passage"], answered_by: ["answered_by", "answeredBy"], status: ["status"], author_email: ["author_email", "authorEmail", "email"] } },
  QAItem: QA_ITEM_PLAN, qa: QA_ITEM_PLAN,
  PrayerPassage: { entity: "PrayerPassage", bookScoped: true, key: passageNaturalKey, required: ["book_number", "chapter"], aliases: { book_number: ["book_number", "bookNumber"], book_name: ["book_name", "bookName", "book"], chapter: ["chapter"], verse: ["verse"], verse_end: ["verse_end", "verseEnd"], title_en: ["title_en", "titleEn", "title"], title_lu: ["title_lu", "titleLu"], prayer_en: ["prayer_en", "prayerEn", "prayer_read", "pray_read"], prayer_lu: ["prayer_lu", "prayerLu", "prayer_read_luganda", "pray_read_luganda"], scripture_ref: ["scripture_ref", "scriptureRef", "passage"], source: ["source"] }, normalise: { book_number: asNumber, chapter: asNumber, verse: asNumberOrNull, verse_end: asNumberOrNull } },
  CrossReference: { entity: "CrossReference", bookScoped: true, key: crossRefNaturalKey, required: ["book_number", "chapter", "verse"], aliases: { book_number: ["book_number", "bookNumber"], chapter: ["chapter"], verse: ["verse"], ref_book_number: ["ref_book_number", "refBookNumber"], ref_chapter: ["ref_chapter", "refChapter"], ref_verse: ["ref_verse", "refVerse"], reference_text: ["reference_text", "referenceText", "label", "reference", "ref"], ref_verse_end: ["ref_verse_end", "refVerseEnd"], unresolved: ["unresolved"], ref_text_en: ["ref_text_en", "refTextEn", "text_en", "ref_text", "refText"], ref_text_lu: ["ref_text_lu", "refTextLu", "text_lu"], note_en: ["note_en", "noteEn", "note"], note_lu: ["note_lu", "noteLu"], source: ["source"] }, normalise: { book_number: asNumber, chapter: asNumber, verse: asNumber, unresolved: asBoolean, ref_book_number: asNumberOrNull, ref_chapter: asNumberOrNull, ref_verse: asNumberOrNull, ref_verse_end: asNumberOrNull } },
  ChapterIntro: { entity: "ChapterIntro", bookScoped: true, key: (row) => `${asNumber(row.book_number)}:${asNumber(row.chapter)}`, required: ["book_number", "chapter"], aliases: { book_number: ["book_number", "bookNumber"], book_name: ["book_name", "bookName", "book"], chapter: ["chapter"], title_en: ["title_en", "titleEn", "title"], title_lu: ["title_lu", "titleLu"], intro_en: ["intro_en", "introEn", "introduction", "body_en"], intro_lu: ["intro_lu", "introLu", "introduction_luganda", "body_lu"], source: ["source"] }, normalise: { book_number: asNumber, chapter: asNumber } },
  BookIntro: { entity: "BookIntro", bookScoped: true, key: (row) => `${asNumber(row.book_number)}`, required: ["book_number"], aliases: { book_number: ["book_number", "bookNumber"], book_name: ["book_name", "bookName", "book"], title_en: ["title_en", "titleEn", "title"], title_lu: ["title_lu", "titleLu", "title_luganda"], intro_en: ["intro_en", "introEn", "introduction", "body_en"], intro_lu: ["intro_lu", "introLu", "introduction_luganda", "body_lu", "introductionLu"], closing_prayer_en: ["closing_prayer_en", "closingPrayerEn", "closing_prayer"], closing_prayer_lu: ["closing_prayer_lu", "closingPrayerLu", "closing_prayer_luganda"], closing_title_en: ["closing_title_en", "closing_prayer_title_en"], closing_title_lu: ["closing_title_lu", "closing_prayer_title_lu"], source: ["source"] }, normalise: { book_number: asNumber } },
  VerseSongSeries: { entity: "VerseSongSeries", key: (row) => `series:${asText(row.name).toLowerCase()}`, required: ["name"], aliases: { name: ["name", "series_name", "series"], description: ["description"], cover_image: ["cover_image", "coverImage", "cover", "cover_url"], thumbnail: ["thumbnail", "thumb_url"], accent: ["accent", "accent_colour", "accent_color"], active: ["active"] }, normalise: { active: asBoolean } },
  VerseSongEpisode: { entity: "VerseSongEpisode", key: (row) => `song:${asText(row.series_name).toLowerCase()}:${asText(row.title).toLowerCase()}:${asNumber(row.chapter)}:${asText(row.verse).toLowerCase()}`, required: ["title", "series_name", "audio_url"], aliases: { title: ["title", "song_title"], series_name: ["series_name", "series"], book_name: ["book_name", "bookName", "book"], book_number: ["book_number", "bookNumber"], chapter: ["chapter"], verse: ["verse", "verse_number", "verseNumber"], verse_ref: ["verse_ref", "verseRef"], language: ["language", "lang"], version: ["version"], duration_label: ["duration_label", "durationLabel"], duration_seconds: ["duration_seconds", "durationSeconds"], audio_url: ["audio_url", "audioUrl", "audio"], audio_key: ["audio_key", "audioKey"], cover_url: ["cover_url", "coverUrl", "cover", "cover_image"], thumbnail: ["thumbnail"], lyrics_en: ["lyrics_en", "lyricsEn", "lyrics"], lyrics_lu: ["lyrics_lu", "lyricsLu"], episode_order: ["episode_order", "episodeOrder", "order", "order_index", "track"], plays_count: ["plays_count", "playsCount", "plays"], active: ["active"] }, normalise: { book_number: asNumber, chapter: asNumber, duration_seconds: asNumber, episode_order: asNumber, plays_count: asNumber, active: asBoolean } }
};
const buildValues = (plan, row) => {
  const picked = pickPresent(row, plan.aliases); const values = {};
  for (const [key, raw] of Object.entries(picked)) { const normaliser = plan.normalise?.[key]; const language = key.endsWith("_lu") ? "lu" : "en"; values[key] = normaliser ? normaliser(raw) : (key.endsWith("_en") || key.endsWith("_lu") ? asLanguageText(raw, language) : asText(raw)); }
  return values;
};

const randomHex = (length) => { const bytes = new Uint8Array(length); if (globalThis.crypto?.getRandomValues) globalThis.crypto.getRandomValues(bytes); else for (let index = 0; index < length; index += 1) bytes[index] = Math.floor(Math.random() * 256); return Array.from(bytes).map((byte) => byte.toString(16).padStart(2, "0")).join(""); };
export const readAdminAccount = async (email) => { const rows = (await fse2.entities.AdminAccount.list("-updated_date", 200)) || []; return rows.find((row) => String(row.email || "").toLowerCase() === String(email || "").toLowerCase()) || null; };
export const verifyPassword = () => false;
export const adminDirectSignIn = async () => ({ ok: false, kind: "check", error: "The administrator account could not be checked from this browser. Sign in again." });
const logActivity = async (action, section, detail) => { try { await fse2.entities.ActivityLog.create({ actor: "admin@prayreadbible.com", action, section, detail: String(detail || "") }); } catch { /* Activity logging must never stop a save. */ } };
const count = async (entity, limit = 500) => { try { return ((await fse2.entities[entity].list("-created_date", limit)) || []).length; } catch { return 0; } };
const importTextBlocks = async (kind, text, bookName) => {
  const inserted = []; const errors = []; const blocks = String(text || "").split(/\n\s*\n/).map((block) => block.trim()).filter(Boolean);
  for (const block of blocks) {
    const lines = block.split("\n").map((line) => line.trim()).filter(Boolean); const header = lines.shift() || "";
    if (kind === "verses") { const match = header.match(/(\d{1,2}):(\d{1,3}):(\d{1,3})/); if (!match) { errors.push(`Skipped a block without a book:chapter:verse header: "${header.slice(0, 40)}"`); continue; } const [book_number, chapter, verse] = [Number(match[1]), Number(match[2]), Number(match[3])]; try { inserted.push(await fse2.entities.BibleVerse.create({ book_number, book: bookName || "", chapter, verse, text_en: lines[0] || "", text_lu: lines[1] || "" })); } catch (error) { errors.push(`${book_number}:${chapter}:${verse}  -  ${error.message}`); } continue; }
    const code = header.replace(/^#\s*/, ""); if (!code) { errors.push("Skipped a block without a devotional code."); continue; }
    const values = lines.length >= 7 ? { title: lines[0] || "", title_lu: lines[1] || "", scripture: lines[2] || "", scripture_lu: lines[3] || "", body: lines[4] || "", body_lu: lines[5] || "" } : { title: lines[0] || "", scripture: lines[1] || "", body: lines[2] || "", body_lu: lines[3] || "" };
    try { inserted.push(await fse2.entities.Devotional.create({ code, ...values })); } catch (error) { errors.push(`${code}  -  ${error.message}`); }
  }
  return { inserted: inserted.length, errors };
};

const scanAll = async (entity, filter) => {
  const rows = []; let offset = 0;
  while (true) { const page = filter ? await fse2.entities[entity].filter(filter, "-updated_date", 500, offset) : await fse2.entities[entity].list("-updated_date", 500, offset); if (!Array.isArray(page)) throw new Error("Scan returned an incomplete page."); rows.push(...page); if (page.length < 500) return rows; offset += page.length; }
};
const isImportedRow = (record) => record.source === "book_import" || String(record.source || "").startsWith("book_import:") || record.source === "pray_read_json_import";
const isLegacyBookImportForCollection = (collection, record, bookNumber) => {
  if (record.source !== "book_import" || !IMPORT_PLANS[collection]?.bookScoped) return false;
  if (Number(record.book_number) !== Number(bookNumber) && resolveBook(record.book_name ?? record.book)?.number !== Number(bookNumber)) return false;
  if (!record.book_name && !record.book && Number(record.book_number) !== Number(bookNumber)) return false;
  if (collection === "PrayerPassage") return Number(record.chapter) > 0 && String(record.prayer_en || record.prayer_lu || record.title_en || record.title_lu || "").trim().length > 0 && (record.verse == null || Number(record.verse) >= 0);
  if (collection === "CrossReference") return Number(record.chapter) > 0 && Number(record.verse) > 0 && (Number(record.ref_book_number) > 0 || String(record.reference_text || "").trim().length > 0);
  if (collection === "ChapterIntro") return Number(record.chapter) > 0 && String(record.intro_en || record.intro_lu || record.title_en || record.title_lu || "").trim().length > 0;
  if (collection === "BookIntro") return String(record.intro_en || record.intro_lu || record.closing_prayer_en || record.closing_prayer_lu || record.title_en || record.title_lu || "").trim().length > 0;
  return false;
};
const importPreparedCollections = async (prepared) => {
  const summary = {}; const errors = []; const importedSource = "pray_read_json_import";
  const validationErrors = [];
  const replacementCollections = prepared.rows.replacementCollections || [];
  const replacement = new Set(replacementCollections);
  const entries = Object.entries(prepared.collections || {}).filter(([collection]) => IMPORT_PLANS[collection]);
  let missingReplacementScope = false;
  if (!replacementCollections.length && entries.some(([collection]) => ["PrayerPassage", "CrossReference", "ChapterIntro", "BookIntro"].includes(collection))) { errors.push("Prepared Bible collections have no explicit replacement scope; replacement file is blocked."); missingReplacementScope = true; replacementCollections.push(...entries.map(([collection]) => collection).filter((collection) => ["PrayerPassage", "CrossReference", "ChapterIntro", "BookIntro"].includes(collection))); for (const collection of replacementCollections) replacement.add(collection); }
  for (const collection of replacementCollections) {
    if (!IMPORT_PLANS[collection]) { errors.push(`${collection}: unsupported represented replacement collection; replacement file is blocked.`); validationErrors.push(collection); }
    if (!summary[collection]) summary[collection] = { inserted: 0, updated: 0, skipped: 0, total: Array.isArray(prepared.collections[collection]) ? prepared.collections[collection].length : 0, deleted: 0, skippedDelete: 0, cleanupSkipped: false };
  }
  if (missingReplacementScope) validationErrors.push("replacement scope");
  if (missingReplacementScope) for (const collection of replacementCollections) if (!summary[collection]) summary[collection] = { inserted: 0, updated: 0, skipped: Array.isArray(prepared.collections[collection]) ? prepared.collections[collection].length : 0, total: Array.isArray(prepared.collections[collection]) ? prepared.collections[collection].length : 0, deleted: 0, skippedDelete: null, cleanupSkipped: true, cleanupReason: "Replacement validation failed before any writes." };
  for (const [collection, rows] of Object.entries(prepared.collections || {})) { if (!IMPORT_PLANS[collection]) { errors.push(`${collection}: unsupported prepared collection; replacement file is blocked.`); validationErrors.push(collection); } if (!Array.isArray(rows)) { errors.push(`${collection}: prepared collection must be an array.`); validationErrors.push(collection); } }
  for (const collection of replacementCollections) { const rows = prepared.collections[collection]; const plan = IMPORT_PLANS[collection]; if (!plan || !Array.isArray(rows)) { validationErrors.push(collection); continue; } for (const [index, row] of rows.entries()) { if (!row || typeof row !== "object" || Array.isArray(row)) { errors.push(`${collection} row ${index + 1}: expected an object.`); validationErrors.push(collection); continue; } const normalizedValues = buildValues(plan, row); if (plan.bookScoped) { const resolved = resolveBook(normalizedValues.book_number || row.book_number || row.bookNumber || normalizedValues.book_name || row.book_name || row.bookName || row.book); if (resolved) { normalizedValues.book_number = Number(resolved.number); normalizedValues.book_name = resolved.name; } } const missing = (plan.required || []).filter((key) => !asText(normalizedValues[key])); const key = plan.key(normalizedValues); if (missing.length || !key || key.includes(":0:") || key.endsWith(":")) { errors.push(`${collection} row ${index + 1}: ${missing.length ? `missing required fields: ${missing.join(", ")}` : "invalid natural key"}.`); validationErrors.push(collection); } if (plan.bookScoped && (!Number(prepared.bookNumber) || !prepared.bookName || Number(normalizedValues.book_number) !== Number(prepared.bookNumber) || resolveBook(normalizedValues.book_name ?? normalizedValues.book)?.number !== Number(prepared.bookNumber))) { errors.push(`${collection} row ${index + 1}: book scope does not match ${prepared.bookName}; replacement file is blocked.`); validationErrors.push(collection); } } }
  for (const [collection, rows] of Object.entries(prepared.collections || {})) if (!replacement.has(collection) && Array.isArray(rows)) { const plan = IMPORT_PLANS[collection]; if (!plan) continue; for (const [index, row] of rows.entries()) { if (!row || typeof row !== "object" || Array.isArray(row)) { errors.push(`${collection} row ${index + 1}: expected an object; replacement file was blocked before writes.`); validationErrors.push(collection); continue; } const normalizedValues = buildValues(plan, row); const missing = (plan.required || []).filter((key) => !asText(normalizedValues[key])); const key = plan.key(normalizedValues); if (missing.length || !key || key.includes(":0:") || key.endsWith(":")) { errors.push(`${collection} row ${index + 1}: malformed row or invalid required field/natural key; replacement file was blocked before writes.`); validationErrors.push(collection); } } }
  if (validationErrors.length) { for (const collection of replacementCollections) if (!summary[collection]) summary[collection] = { inserted: 0, updated: 0, skipped: Array.isArray(prepared.collections[collection]) ? prepared.collections[collection].length : 0, total: Array.isArray(prepared.collections[collection]) ? prepared.collections[collection].length : 0, deleted: 0, skippedDelete: null, cleanupSkipped: true, cleanupReason: "Replacement validation failed before any writes." }; for (const collection of Object.keys(summary)) { const stats = summary[collection]; if (replacement.has(collection)) { stats.cleanupSkipped = true; stats.skippedDelete = null; stats.cleanupReason = "Replacement validation failed before any writes."; } if (Array.isArray(prepared.collections[collection])) stats.skipped = prepared.collections[collection].length; } return { summary, errors }; }
  const preflight = new Map(); const preflightFailed = new Set();
  for (const collection of replacementCollections) { const plan = IMPORT_PLANS[collection]; if (!plan || !Number(prepared.bookNumber) || !prepared.bookName) { preflightFailed.add(collection); summary[collection].skipped = Array.isArray(prepared.collections[collection]) ? prepared.collections[collection].length : 0; summary[collection].cleanupSkipped = true; summary[collection].skippedDelete = null; summary[collection].cleanupReason = "Exact replacement book scope is unavailable; scan result is unknown."; errors.push(`${collection}: exact resolved book scope is unavailable; replacement writes and cleanup were blocked.`); continue; } const seen = new Map(); try { for (const filter of [{ book_number: prepared.bookNumber }, { book_name: prepared.bookName }]) for (const record of await scanAll(plan.entity, filter)) if (Number(record.book_number) === Number(prepared.bookNumber) || resolveBook(record.book_name ?? record.book)?.number === Number(prepared.bookNumber)) seen.set(record.id, record); preflight.set(collection, Array.from(seen.values())); } catch (error) { preflightFailed.add(collection); summary[collection].skipped = (prepared.collections[collection] || []).length; summary[collection].cleanupSkipped = true; summary[collection].skippedDelete = null; summary[collection].cleanupReason = "Existing-row preflight scan failed; deletion count is unknown."; errors.push(`${collection}: existing-row preflight scan failed; no replacement writes were started and skipped-delete count is unknown: ${error.message}`); } }
  if (preflightFailed.size) { for (const collection of replacementCollections) { summary[collection].cleanupSkipped = true; summary[collection].skippedDelete = null; summary[collection].cleanupReason = "Replacement preflight failed; no replacement writes were started."; } return { summary, errors }; }
  const writeFailed = new Set();
  for (const [collection, rows] of entries) {
    const plan = IMPORT_PLANS[collection]; const stats = summary[collection] || { inserted: 0, updated: 0, skipped: 0, total: rows.length };
    const book = prepared.bookNumber; let existing = [];
    if (replacement.has(collection)) existing = preflight.get(collection) || [];
    else try {
      const seen = new Map();
      for (const filter of [{ book_number: book }, { book_name: prepared.bookName }]) for (const row of await scanAll(plan.entity, filter)) seen.set(row.id, row);
      existing = Array.from(seen.values());
    } catch (error) { errors.push(`${collection}: could not complete existing-row scan; no rows were written: ${error.message}`); stats.skipped = rows.length; writeFailed.add(collection); summary[collection] = stats; continue; }
    const index = new Map(existing.map((record) => [plan.key(record), record]));
    const pendingCreates = [];
    const pendingUpdates = [];
    for (const values of rows) {
      const storedValues = replacement.has(collection) ? { ...values, source: importedSource } : values; const key = plan.key(storedValues); const current = index.get(key);
      if (prepared.rows.backfillOnly && collection === "CrossReference" && current) { stats.skipped += 1; continue; }
      if (current) pendingUpdates.push({ id: current.id, values: storedValues });
      else { pendingCreates.push(storedValues); index.set(key, storedValues); }
    }
    const runPool = async (items, worker, concurrency = 20) => {
      let cursor = 0;
      const runners = Array.from({ length: Math.min(concurrency, items.length) }, async () => {
        while (cursor < items.length) {
          const item = items[cursor++];
          try { await worker(item); }
          catch (error) { stats.skipped += 1; writeFailed.add(collection); errors.push(`${collection}: ${error.message}`); }
        }
      });
      await Promise.all(runners);
    };
    await runPool(pendingUpdates, async ({ id, values }) => { await fse2.entities[plan.entity].update(id, values); stats.updated += 1; });
    await runPool(pendingCreates, async (values) => { await fse2.entities[plan.entity].create(values); stats.inserted += 1; });
    summary[collection] = stats;
  }
  for (const collection of replacementCollections) if (summary[collection] && !Object.prototype.hasOwnProperty.call(summary[collection], "total")) summary[collection].total = Array.isArray(prepared.collections[collection]) ? prepared.collections[collection].length : 0;
  const replacementWriteFailed = replacementCollections.some((collection) => writeFailed.has(collection));
  for (const collection of replacementCollections) if (replacementWriteFailed && summary[collection]) { summary[collection].cleanupSkipped = true; summary[collection].skippedDelete = null; summary[collection].cleanupReason = "At least one incoming replacement write failed; all replacement cleanup was stopped."; }
  for (const collection of replacementCollections) {
    const stats = summary[collection]; const plan = IMPORT_PLANS[collection];
    if (!plan) { stats.cleanupSkipped = true; stats.skippedDelete = null; stats.cleanupReason = "Unsupported replacement collection."; errors.push(`${collection}: cleanup skipped because the replacement collection is unsupported; skipped-delete count is unknown.`); continue; }
    if (replacementWriteFailed || writeFailed.has(collection)) { stats.cleanupSkipped = true; stats.skippedDelete = null; stats.cleanupReason = "At least one incoming replacement write failed; all replacement cleanup was stopped."; errors.push(`${collection}: cleanup skipped because ${stats.cleanupReason.toLowerCase()} Skipped-delete count is unknown.`); continue; }
    const book = prepared.bookNumber;
    const records = preflight.get(collection) || [];
    const incomingKeys = new Set((prepared.collections[collection] || []).map((row) => plan.key({ ...row, source: importedSource })));
    const staleRows = records.filter((record) => (Number(record.book_number) === Number(book) || resolveBook(record.book_name ?? record.book)?.number === Number(book)) && (record.source === importedSource || isLegacyBookImportForCollection(collection, record, book)) && !incomingKeys.has(plan.key(record)));
    for (const record of staleRows) {
      try { await fse2.entities[plan.entity].delete(record.id); stats.deleted += 1; }
      catch (error) { stats.skippedDelete += 1; errors.push(`${collection}: could not remove prior imported row: ${error.message}`); }
    }
  }
  return { summary, errors };
};

const importJsonCollections = async (payload) => {
  const entries = Object.entries(payload || {}).filter(([key]) => key !== "mode" && key !== "metadata" && key !== "format");
  if (!entries.length) throw new Error("The file has no collection to import. Use the template to see the shape.");
  const backfillOnly = String((payload || {}).mode || "") === "backfill"; const summary = {}; const errors = [];
  for (const [collection, rawRows] of entries) {
    const plan = IMPORT_PLANS[collection]; if (!plan) { errors.push(`"${collection}" is not a collection this importer can fill.`); continue; }
    const rows = Array.isArray(rawRows) ? rawRows : []; if (!rows.length) { summary[collection] = { inserted: 0, updated: 0, skipped: 0, total: 0 }; continue; }
    let existing = [];
    if (plan.bookScoped) {
      const books = Array.from(new Set(rows.map((row) => asNumber(row && row.book_number) || Number(resolveBook(row && (row.book_name ?? row.bookName ?? row.book))?.number)).filter((value) => value > 0)));
      try { for (const book of books) for (const filter of [{ book_number: book }, { book_name: getBookByNumber(book)?.name }]) existing.push(...await scanAll(plan.entity, filter)); }
      catch (error) { errors.push(`${collection}: could not complete existing-row scan: ${error.message}`); summary[collection] = { inserted: 0, updated: 0, skipped: rows.length, total: rows.length }; continue; }
    } else { try { existing = await scanAll(plan.entity); } catch (error) { errors.push(`${collection}: could not complete existing-row scan: ${error.message}`); summary[collection] = { inserted: 0, updated: 0, skipped: rows.length, total: rows.length }; continue; } }
    const index = new Map(); for (const row of existing) { const key = plan.key(row); if (key) index.set(key, row); }
    let inserted = 0; let updated = 0; let skipped = 0;
    for (const row of rows) {
      if (!row || typeof row !== "object" || Array.isArray(row)) { skipped += 1; errors.push(`${collection}: a row was not an object.`); continue; }
      const values = buildValues(plan, row);
      if (plan.bookScoped) { const book = resolveBook(values.book_name ?? row.book_name ?? row.bookName ?? row.book) || resolveBook(String(values.book_number || row.book_number || row.bookNumber || "")); if (!values.book_number && book) values.book_number = Number(book.number); if (book) values.book_name = book.name; }
      const missing = (plan.required || []).filter((key) => !asText(values[key])); if (missing.length) { skipped += 1; errors.push(`${collection}: a row without ${missing.join(", ")} was skipped.`); continue; }
      const key = plan.key(values); if (!key) { skipped += 1; errors.push(`${collection}: a row without a valid natural key was skipped.`); continue; }
      try { const current = index.get(key); if (current) { if (backfillOnly && collection === "CrossReference") { skipped += 1; continue; } await fse2.entities[plan.entity].update(current.id, values); updated += 1; } else { const record = await fse2.entities[plan.entity].create(values); index.set(key, record); inserted += 1; } }
      catch (error) { skipped += 1; errors.push(`${collection}: ${error.message}`); }
    }
    summary[collection] = { inserted, updated, skipped, total: rows.length };
  }
  return { summary, errors };
};

export const adminDirectCall = async (action, payload = {}) => {
  if (action === "stats") { const activity = await fse2.entities.ActivityLog.list("-created_date", 40).catch(() => []); return { users: await count("User", 300), devotionals: await count("Devotional"), prayers: await count("Prayer"), verseSongs: await count("VerseSongSeries", 200), qa: await count("QAEntry"), insights: await count("Insight"), verses: await count("BibleVerse"), messages: await count("ContactMessage"), activity: activity || [] }; }
  if (action === "list") { const entity = String(payload.entity || ""); if (!MANAGED.includes(entity)) throw new Error("That collection cannot be managed here."); const limit = Math.min(1000, Math.max(1, Number(payload.limit || 300))); const rows = (await fse2.entities[entity].list("-updated_date", limit)) || []; const search = String(payload.search || "").trim().toLowerCase(); return { rows: search ? rows.filter((row) => Object.values(row || {}).some((value) => typeof value === "string" && value.toLowerCase().includes(search))) : rows, total: rows.length }; }
  if (action === "users") { const rows = await fse2.entities.User.list("-created_date", 300).catch(() => []); return { rows: (rows || []).map((row) => ({ id: row.id, email: row.email, full_name: row.full_name, role: row.role, created_date: row.created_date })) }; }
  if (action === "create") { const entity = String(payload.entity || ""); if (!MANAGED.includes(entity)) throw new Error("That collection cannot be managed here."); const record = await fse2.entities[entity].create(payload.values || {}); await logActivity("created a record", entity, payload.values?.title || payload.values?.name || ""); return { record }; }
  if (action === "update") { const entity = String(payload.entity || ""); if (!MANAGED.includes(entity)) throw new Error("That collection cannot be managed here."); const record = await fse2.entities[entity].update(String(payload.id || ""), payload.values || {}); await logActivity("updated a record", entity, payload.values?.title || payload.values?.name || ""); return { record }; }
  if (action === "delete") { const entity = String(payload.entity || ""); if (!MANAGED.includes(entity)) throw new Error("That collection cannot be managed here."); await fse2.entities[entity].delete(String(payload.id || "")); await logActivity("deleted a record", entity, String(payload.id || "")); return { ok: true }; }
  if (action === "changePassword") throw new Error("Password changes run on the server. Sign in again and retry.");
  if (action === "bulkImport") { const result = await importTextBlocks(String(payload.kind || "verses"), payload.text, payload.bookName); await logActivity("ran a bulk import", String(payload.kind || "verses"), `${result.inserted} inserted, ${result.errors.length} errors`); return result; }
  if (action === "bulkImportJson") { const importBody = payload.payload || {}; const preparedPayload = importBody.__prepared_prayer_file ? { ...importBody, format: "pray-read-prayer-crossrefs-v1" } : importBody; const prepared = importShapeOf(preparedPayload) ? prepareImport(preparedPayload) : null; if (prepared && !prepared.ok) throw new Error(prepared.errors.join("\n")); const result = prepared ? await importPreparedCollections(prepared) : await importJsonCollections(importBody); await logActivity("ran a JSON import", Object.keys(result.summary).join(", ") || "none", ""); return result; }
  throw new Error("Unknown action.");
};