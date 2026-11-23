// Installs the Luganda Bible into the app.
//
// The Luganda text is taken from the public Luganda Bible on wordplanet.net
// and stored one chapter at a time, so every reader can read a chapter in
// Luganda straight from the app, without waiting for a live request and
// without needing a signed-in session.
//
// The function is protected by the signed admin session token issued by
// functions/adminAuth.js.

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

const cleanText = (text) =>
  String(text || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s*\n+\s*/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();

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
 * Takes the block of the chapter out of the page.
 * The block is closed by the first div that balances the one it opens, so an
 * element inside the chapter never cuts the text short.
 */
const textBodyOf = (html) => {
  const open = html.match(/<div[^>]*class="textBody"[^>]*>/i);
  if (!open) return "";
  const start = open.index + open[0].length;
  const tag = /<(\/?)div\b[^>]*>/gi;
  tag.lastIndex = start;
  let depth = 1;
  let match = tag.exec(html);
  while (match) {
    depth += match[1] ? -1 : 1;
    if (depth === 0) return html.slice(start, match.index);
    match = tag.exec(html);
  }
  return html.slice(start);
};

/**
 * Reads the verses out of the wordplanet page.
 * Every verse opens with a marker that carries its number, and the words of a
 * verse run from its marker to the next one.
 */
const parseLuganda = (html) => {
  const body = textBodyOf(html);
  const source = body || html;
  const marker = /<span[^>]*class="verse"[^>]*>[\s\S]*?<\/span>/gi;
  const found = [];
  let match = marker.exec(source);
  while (match) {
    const id = /\bid="(\d+)"/.exec(match[0]);
    if (id) {
      found.push({ number: Number(id[1]), from: marker.lastIndex, to: match.index });
    }
    match = marker.exec(source);
  }
  const verses = [];
  found.forEach((entry, index) => {
    const stop = index + 1 < found.length ? found[index + 1].to : source.length;
    const text = decodeEntities(cleanText(source.slice(entry.from, stop)));
    if (!Number.isFinite(entry.number) || !text) return;
    verses.push({ verse: entry.number, text });
  });
  return verses;
};

const fetchChapterText = async (bookNumber, chapter) => {
  // The source keeps every book in a two digit folder: lug/01, lug/02 ...
  const folder = String(Number(bookNumber) || 0).padStart(2, "0");
  const response = await fetch(`https://wordplanet.net/lug/${folder}/${chapter}.htm`, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
    }
  });
  if (!response.ok) throw new Error(`The source answered with ${response.status}.`);
  const html = await response.text();
  const verses = parseLuganda(html);
  if (!verses.length) throw new Error("No verses were found on the page.");
  return verses;
};

const readInstalled = async () => {
  const rows = await fse2.entities.LugandaChapter.list("-updated_date", 2000).catch(() => []);
  return (rows || []).filter((row) => row && row.book_number && row.chapter);
};

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
  const rows = await fse2.entities.LugandaChapter.filter({
    book_number: chapter.book_number,
    chapter: chapter.chapter
  });
  if (rows && rows.length) {
    await fse2.entities.LugandaChapter.update(rows[0].id, values);
    return "updated";
  }
  await fse2.entities.LugandaChapter.create(values);
  return "created";
};

Deno.serve(async (req) => {
  try {
    const body = await req.json();
    const session = await verifyToken(body.token);
    if (!session) {
      return Response.json({ error: "Your admin session expired. Sign in again." }, { status: 401 });
    }

    const action = String(body.action || "status");

    if (action === "status") {
      const installed = await readInstalled();
      return Response.json({
        installed: installed.length,
        total: CHAPTERS.length,
        books: BOOKS.length
      });
    }

    if (action === "install") {
      const limit = Math.min(Math.max(Number(body.limit) || 20, 1), 40);
      const start = Math.max(Number(body.start) || 0, 0);
      const refresh = Boolean(body.refresh);
      const installedRows = refresh ? [] : await readInstalled();
      const installedKeys = new Set(installedRows.map((row) => `${row.book_number}:${row.chapter}`));

      let queue;
      if (body.book_number) {
        const wanted = Number(body.book_number);
        const chapter = body.chapter ? Number(body.chapter) : null;
        queue = CHAPTERS.filter(
          (entry) => entry.book_number === wanted && (!chapter || entry.chapter === chapter)
        );
      } else if (refresh) {
        queue = CHAPTERS.slice(start, start + limit);
      } else {
        queue = CHAPTERS.filter((entry) => !installedKeys.has(`${entry.book_number}:${entry.chapter}`)).slice(0, limit);
      }

      const errors = [];
      let installed = 0;
      for (const entry of queue) {
        try {
          const verses = await fetchChapterText(entry.book_number, entry.chapter);
          await saveChapter(entry, verses);
          installed += 1;
        } catch (error) {
          errors.push(`${entry.book} ${entry.chapter}: ${error.message}`);
        }
      }

      const after = await readInstalled();
      return Response.json({
        installed,
        errors,
        stored: after.length,
        total: CHAPTERS.length,
        next: start + queue.length,
        done: after.length >= CHAPTERS.length
      });
    }

    return Response.json({ error: "Unknown action." }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});