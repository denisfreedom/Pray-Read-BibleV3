// Public content API. Public pages read their content here so readers who
// are not signed in still get the real library instead of an empty screen,
// and public submissions (contact form, questions) are accepted server-side.

const readCollection = async (collection) => {
  switch (collection) {
    case "devotionals":
      return await fse2.entities.Devotional.list("-updated_date", 300);
    case "prayers":
      return await fse2.entities.Prayer.list("-updated_date", 300);
    case "series":
      return await fse2.entities.VerseSongSeries.list("-updated_date", 200);
    case "episodes":
      return await fse2.entities.VerseSongEpisode.list("-updated_date", 400);
    case "qa":
      return await fse2.entities.QAEntry.list("-updated_date", 300);
    case "insights":
      return await fse2.entities.Insight.list("-updated_date", 300);
    case "verseOfDay":
      return await fse2.entities.VerseOfDay.list("-updated_date", 300);
    case "commentary":
      return await fse2.entities.Commentary.list("-updated_date", 300);
    case "verses":
      return await fse2.entities.BibleVerse.list("-updated_date", 2000);
    case "plan":
      return await fse2.entities.ReadingPlan.list("-updated_date", 200);
    case "settings":
      return await fse2.entities.SiteSettings.list("-updated_date", 100);
    case "liveSessions":
      return await fse2.entities.LiveSession.list("-updated_date", 200);
    case "groups":
      return await fse2.entities.DiscussionGroup.list("-updated_date", 200);
    case "revelations":
      return await fse2.entities.Revelation.list("-updated_date", 300);
    case "threads":
      return await fse2.entities.DiscussionThread.list("-updated_date", 400);
    default:
      return null;
  }
};

Deno.serve(async (req) => {
  try {
    const body = await req.json();
    const action = String(body.action || "list");

    if (action === "list") {
      const rows = await readCollection(String(body.collection || ""));
      if (!rows) {
        return Response.json({ error: "Unknown collection." }, { status: 400 });
      }
      return Response.json({ rows });
    }

    if (action === "submitContact") {
      const record = await fse2.entities.ContactMessage.create({
        name: String(body.name || "").slice(0, 120),
        email: String(body.email || "").slice(0, 160),
        subject: String(body.subject || "").slice(0, 200),
        message: String(body.message || "").slice(0, 4000),
        is_read: false
      });
      return Response.json({ record });
    }

    if (action === "submitQuestion") {
      const record = await fse2.entities.QAEntry.create({
        question: String(body.question || "").slice(0, 600),
        category: String(body.category || "General").slice(0, 60),
        status: "pending",
        author_email: String(body.author_email || "")
      });
      return Response.json({ record });
    }

    if (action === "submitRevelation") {
      const record = await fse2.entities.Revelation.create({
        title: String(body.title || "").slice(0, 160),
        passage: String(body.passage || "").slice(0, 80),
        body: String(body.body || "").slice(0, 4000),
        owner_email: String(body.owner_email || ""),
        author_name: String(body.author_name || "").slice(0, 120),
        likes: 0
      });
      return Response.json({ record });
    }

    if (action === "submitComment") {
      const record = await fse2.entities.Revelation.create({
        parent_id: String(body.parent_id || ""),
        title: String(body.title || "Comment").slice(0, 160),
        body: String(body.body || "").slice(0, 2000),
        owner_email: String(body.owner_email || ""),
        author_name: String(body.author_name || "Reader").slice(0, 120),
        likes: 0
      });
      return Response.json({ record });
    }

    if (action === "submitThread") {
      const record = await fse2.entities.DiscussionThread.create({
        group_name: String(body.group_name || "").slice(0, 160),
        title: String(body.title || "").slice(0, 160),
        body: String(body.body || "").slice(0, 4000),
        owner_email: String(body.owner_email || ""),
        author_name: String(body.author_name || "Reader").slice(0, 120)
      });
      return Response.json({ record });
    }

    if (action === "likeRevelation") {
      const id = String(body.id || "");
      const rows = await fse2.entities.Revelation.list("-updated_date", 300);
      const current = (rows || []).find((row) => row.id === id);
      if (!current) {
        return Response.json({ error: "That post was not found." }, { status: 404 });
      }
      const record = await fse2.entities.Revelation.update(id, { likes: Number(current.likes || 0) + 1 });
      return Response.json({ record });
    }

    return Response.json({ error: "Unknown action." }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});