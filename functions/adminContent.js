// Admin content manager API. Every call is authorised with the signed admin
// session token issued by functions/adminAuth.js, and runs with the app's
// own privileges so the CMS can write content entities.

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

const MANAGED = [
  "Devotional",
  "Prayer",
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

const findAccount = async (email) => {
  const rows = await fse2.entities.AdminAccount.list("-updated_date", 50);
  return (rows || []).find((row) => String(row.email || "").toLowerCase() === String(email || "").toLowerCase()) || null;
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
      const rows = await fse2.entities[entity].list("-updated_date", 300);
      return Response.json({ rows: rows || [] });
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

    return Response.json({ error: "Unknown action." }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});