// Installs the King James Version with the Strong's numbers.
//
// The text is taken from the public KJV source that marks every Greek and
// Hebrew word with its Strong's number, and it is stored one chapter at a
// time, so every reader can read a chapter with the Strong's numbers
// straight from the app, without waiting for a live request and without
// needing a signed-in session.
//
// The function is protected by the signed admin session token issued by
// functions/adminAuth.js. The background automation of the app may also
// call it with the install key that is kept in the environment.
//
// Every call works from the list of chapters that are really in the app, so
// a chapter that failed to download is simply tried again on the next call.

const encoder = new TextEncoder();

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

const verifyToken = async (token) => {
  if (!token || typeof token !== "string" || !token.includes(".")) return null;
  const [payload, signature] = token.split(".");
  const rows = await fse2.entities.AdminAccount.list("-updated_date", 50);
  for (const account of rows || []) {
    if (!account.secret) continue;
    const expected = await sign(payload, account.secret);
    if (expected !== signature) continue;
    const data = JSON.parse(Buffer.from(payload, "base64").toString("utf8"));
    if (data.exp < Date.now()) continue;
    if (String(data.sv) !== String(account.session_version || "1")) continue;
    return data;
  }
  return null;
};

// The background worker carries this key, so the automation of the app can
// install without a signed-in administrator.
const installKey = () => {
  try {
    if (typeof process !== "undefined" && process.env) {
      const value = process.env.SCRIPTURE_INSTALL_KEY;
      if (value) return String(value);
    }
  } catch {
    // The environment is not always there.
  }
  try {
    return String(Deno.env.get("SCRIPTURE_INSTALL_KEY") || "");
  } catch {
    return "";
  }
};

const authorised = async (body) => {
  if (await verifyToken(body.token)) return true;
  const key = installKey();
  return Boolean(key) && key === String(body.install_key || "");
};

// The 66 books of the Bible with the number of chapters each one holds.
const BOOKS = [
  [1, "Genesis", 50], [2, "Exodus", 40], [3, "Leviticus", 27], [4, "Numbers", 36],
  [5, "Deuteronomy", 34], [6, "Joshua", 24], [7, "Judges", 21], [8, "Ruth", 4],
  [9, "1 Samuel", 31], [10, "2 Samuel", 24], [11, "1 Kings", 22], [12, "2 Kings", 25],
  [13, "1 Chronicles", 29], [14, "2 Chronicles", 36], [15, "Ezra", 10], [16, "Nehemiah", 13],
  [17, "Esther", 10], [18, "Job", 42], [19, "Psalms", 150], [20, "Proverbs", 31],
  [21, "Ecclesiastes", 12], [22, "Song of Solomon", 8], [23, "Isaiah", 66], [24, "Jeremiah", 52],
  [25, "Lamentations", 5], [26, "Ezekiel", 48], [27, "Daniel", 12], [28, "Hosea", 14],
  [29, "Joel", 3], [30, "Amos", 9], [31, "Obadiah", 1], [32, "Jonah", 4],
  [33, "Micah", 7], [34, "Nahum", 3], [35, "Habakkuk", 3], [36, "Zephaniah", 3],
  [37, "Haggai", 2], [38, "Zechariah", 14], [39, "Malachi", 4], [40, "Matthew", 28],
  [41, "Mark", 16], [42, "Luke", 24], [43, "John", 21], [44, "Acts", 28],
  [45, "Romans", 16], [46, "1 Corinthians", 16], [47, "2 Corinthians", 13], [48, "Galatians", 6],
  [49, "Ephesians", 6], [50, "Philippians", 4], [51, "Colossians", 4], [52, "1 Thessalonians", 5],
  [53, "2 Thessalonians", 3], [54, "1 Timothy", 6], [55, "2 Timothy", 4], [56, "Titus", 3],
  [57, "Philemon", 1], [58, "Hebrews", 13], [59, "James", 5], [60, "1 Peter", 5],
  [61, "2 Peter", 3], [62, "1 John", 5], [63, "2 John", 1], [64, "3 John", 1],
  [65, "Jude", 1], [66, "Revelation", 22]
];

const CHAPTERS = BOOKS.flatMap(([number, name, count]) =>
  Array.from({ length: count }, (unused, index) => ({
    book_number: number,
    book: name,
    chapter: index + 1
  }))
);

const decodeEntities = (text) =>
  String(text || "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#0?39;|&apos;/gi, "'")
    .replace(/&mdash;/gi, " - ")
    .replace(/&ndash;/gi, " - ")
    .replace(/&hellip;/gi, "…")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">");

/**
 * Reads the verses of the KJV source.
 * The Strong's number of a word arrives as <S>2424</S> behind the word. The
 * Old Testament carries the Hebrew numbers and the New Testament the Greek
 * ones, so the book tells which of the two is used.
 */
const parseStrongs = (raw, bookNumber) => {
  const list = Array.isArray(raw) ? raw : Array.isArray(raw && raw.verses) ? raw.verses : [];
  const prefix = Number(bookNumber) >= 40 ? "G" : "H";
  const verses = [];
  for (const row of list) {
    if (!row) continue;
    const number = Number(row.verse);
    const text = decodeEntities(
      String(row.text || "")
        .replace(/<S>\s*([A-Za-z]?\d{1,5})\s*<\/S>/gi, (whole, code) => {
          const digits = code.match(/\d+/);
          if (!digits) return " ";
          return ` (${prefix}${Number(digits[0])})`;
        })
        .replace(/<sup[^>]*>([\s\S]*?)<\/sup>/gi, " ($1)")
        .replace(/<[^>]+>/g, "")
    )
      .replace(/\s{2,}/g, " ")
      .trim();
    if (!Number.isFinite(number) || !text) continue;
    verses.push({ verse: number, text });
  }
  return verses;
};

const chapterUrl = (bookNumber, chapter) =>
  `https://bolls.life/get-chapter/KJV/${bookNumber}/${chapter}?bolls_format=true`;

const fetchChapterText = async (bookNumber, chapter) => {
  const response = await fetch(chapterUrl(bookNumber, chapter), {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
    }
  });
  if (!response.ok) throw new Error(`The source answered with ${response.status}.`);
  const raw = await response.json();
  const verses = parseStrongs(raw, bookNumber);
  if (!verses.length) throw new Error("No verses were found on the source.");
  // A chapter without a single Strong's number is not the marked text.
  if (!verses.some((verse) => /\([GH]\d{1,5}\)/.test(verse.text))) {
    throw new Error("The chapter came back without any Strong's numbers.");
  }
  return verses;
};

/**
 * Reads every installed chapter.
 * The chapters are read in the order they were created, so a chapter that is
 * added while the installer works never pushes another one out of sight.
 */
const readInstalled = async () => {
  const rows = [];
  const pageSize = 500;
  let offset = 0;
  for (let page = 0; page < 30; page += 1) {
    let batch = [];
    try {
      batch = await fse2.entities.KjvPlusChapter.list("created_date", pageSize, offset);
    } catch {
      batch = await fse2.entities.KjvPlusChapter.list("-updated_date", pageSize, offset).catch(() => []);
    }
    if (!batch || !batch.length) break;
    rows.push(...batch);
    if (batch.length < pageSize) break;
    offset += batch.length;
  }
  return rows.filter((row) => row && row.book_number && row.chapter);
};

const countLines = (raw) =>
  String(raw || "")
    .split("\n")
    .filter((line) => line.indexOf("\t") > 0).length;

const hasMarkers = (raw) => /[GH]\d{1,5}/.test(String(raw || ""));

const saveChapter = async (chapter, verses) => {
  const values = {
    book_number: chapter.book_number,
    book: chapter.book,
    chapter: chapter.chapter,
    verse_count: verses.length,
    verses: verses
      .map((verse) => `${verse.verse}\t${String(verse.text || "").replace(/\t/g, " ")}`)
      .join("\n")
  };
  const rows = await fse2.entities.KjvPlusChapter.filter({
    book_number: chapter.book_number,
    chapter: chapter.chapter
  });
  if (rows && rows.length) {
    await fse2.entities.KjvPlusChapter.update(rows[0].id, values);
    return "updated";
  }
  await fse2.entities.KjvPlusChapter.create(values);
  return "created";
};

/**
 * Compares the chapters in the app with the 1,189 chapters of the Bible.
 * A chapter that is there but carries no Strong's number is reported as
 * broken, so it can be downloaded again.
 */
const audit = (rows) => {
  const stored = new Map();
  const duplicates = [];
  for (const row of rows) {
    const key = `${row.book_number}:${row.chapter}`;
    if (stored.has(key)) duplicates.push(key);
    else stored.set(key, row);
  }
  const books = [];
  let missing = 0;
  let broken = 0;
  let installed = 0;
  for (const [number, name, count] of BOOKS) {
    const missingChapters = [];
    const brokenChapters = [];
    let ready = 0;
    for (let chapter = 1; chapter <= count; chapter += 1) {
      const row = stored.get(`${number}:${chapter}`);
      if (!row) {
        missingChapters.push(chapter);
        continue;
      }
      installed += 1;
      const lines = countLines(row.verses);
      const sound = lines > 0 && (!row.verse_count || Number(row.verse_count) === lines);
      if (sound && hasMarkers(row.verses)) ready += 1;
      else brokenChapters.push(chapter);
    }
    missing += missingChapters.length;
    broken += brokenChapters.length;
    books.push({
      number,
      name,
      chapters: count,
      ready,
      missing: missingChapters,
      broken: brokenChapters
    });
  }
  return {
    total: CHAPTERS.length,
    installed,
    ready: installed - broken,
    missing,
    broken,
    duplicates,
    books
  };
};

/** Runs a few jobs at the same time, so a whole Bible does not take hours. */
const runWithConcurrency = async (items, limit, worker) => {
  const results = [];
  let index = 0;
  const runners = Array.from({ length: Math.min(Math.max(limit, 1), items.length) }, async () => {
    while (index < items.length) {
      const current = index;
      index += 1;
      results[current] = await worker(items[current]);
    }
  });
  await Promise.all(runners);
  return results;
};

/** Downloads one chapter and keeps it in the app, trying it twice. */
const installChapter = async (entry) => {
  let lastError = "";
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const verses = await fetchChapterText(entry.book_number, entry.chapter);
      await saveChapter(entry, verses);
      return null;
    } catch (error) {
      lastError = error.message || String(error);
      await new Promise((resolve) => setTimeout(resolve, 350 * (attempt + 1)));
    }
  }
  return `${entry.book} ${entry.chapter}: ${lastError}`;
};

Deno.serve(async (req) => {
  try {
    const body = await req.json();
    if (!(await authorised(body))) {
      return Response.json({ error: "Your admin session expired. Sign in again." }, { status: 401 });
    }

    const action = String(body.action || "status");

    // The audit: what is in the app and what is still missing.
    if (action === "status" || action === "verify") {
      const report = audit(await readInstalled());
      return Response.json({
        installed: report.installed,
        ready: report.ready,
        missing: report.missing,
        broken: report.broken,
        stored: report.installed,
        total: report.total,
        books: report.books,
        duplicates: report.duplicates.length
      });
    }

    if (action === "install") {
      const limit = Math.min(Math.max(Number(body.limit) || 20, 1), 80);
      const rows = await readInstalled();
      const present = new Set(rows.map((row) => `${row.book_number}:${row.chapter}`));
      let queue = CHAPTERS.filter((entry) => !present.has(`${entry.book_number}:${entry.chapter}`));
      if (body.book_number) {
        queue = queue.filter((entry) => entry.book_number === Number(body.book_number));
      }
      if (body.chapter) {
        queue = queue.filter((entry) => entry.chapter === Number(body.chapter));
      }
      queue = queue.slice(0, limit);

      const messages = await runWithConcurrency(queue, 4, installChapter);
      const errors = messages.filter((message) => message);
      const added = messages.length - errors.length;

      const report = audit(await readInstalled());
      return Response.json({
        added,
        errors,
        installed: report.installed,
        ready: report.ready,
        missing: report.missing,
        broken: report.broken,
        stored: report.installed,
        total: report.total,
        books: report.books,
        done: report.missing === 0 && report.broken === 0
      });
    }

    // Downloads again the chapters that are in the app but cannot be read.
    if (action === "repair") {
      const limit = Math.min(Math.max(Number(body.limit) || 20, 1), 80);
      const report = audit(await readInstalled());
      const queue = report.books.flatMap((book) =>
        book.broken.map((chapter) => ({
          book_number: book.number,
          book: book.name,
          chapter
        }))
      );
      const targets = queue.slice(0, limit);
      const messages = await runWithConcurrency(targets, 4, installChapter);
      const errors = messages.filter((message) => message);
      const repaired = messages.length - errors.length;
      const after = audit(await readInstalled());
      return Response.json({
        repaired,
        errors,
        installed: after.installed,
        ready: after.ready,
        missing: after.missing,
        broken: after.broken,
        stored: after.installed,
        total: after.total,
        books: after.books,
        done: after.missing === 0 && after.broken === 0
      });
    }

    return Response.json({ error: "Unknown action." }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});