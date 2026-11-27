import { fse2 } from "@/api/fse2Client";
import { visibleDevotionals } from "@/lib/devotionals";
import { toISODate } from "@/lib/reading";

/**
 * Public content access.
 *
 * Public pages show the bundled Pray-Read library immediately and upgrade to
 * live records whenever a session is available, so the content manager's
 * edits reach signed-in readers straight away.
 */

const READERS = {
  // The front page reads only the devotionals that are active and whose date
  // has come: a devotional scheduled for a later day waits for its day.
  devotionals: async () =>
    visibleDevotionals(await fse2.entities.Devotional.list("-updated_date", 300), toISODate()),
  devotionalTopics: async () =>
    (await fse2.entities.DevotionalTopic.list("-updated_date", 200)).filter(
      (row) => row && row.active !== false
    ),
  devotionalPlans: async () =>
    (await fse2.entities.DevotionalPlan.list("-updated_date", 200)).filter(
      (row) => row && row.active !== false
    ),
  prayers: () => fse2.entities.Prayer.list("-updated_date", 300),
  series: () => fse2.entities.VerseSongSeries.list("-updated_date", 200),
  episodes: () => fse2.entities.VerseSongEpisode.list("-updated_date", 400),
  qa: () => fse2.entities.QAEntry.list("-updated_date", 300),
  qaTopics: () => fse2.entities.QATopic.list("-updated_date", 200),
  qaItems: () => fse2.entities.QAItem.list("-updated_date", 500),
  insights: () => fse2.entities.Insight.list("-updated_date", 300),
  verseOfDay: () => fse2.entities.VerseOfDay.list("-updated_date", 300),
  commentary: () => fse2.entities.Commentary.list("-updated_date", 300),
  prayerPassages: () => fse2.entities.PrayerPassage.list("-updated_date", 50000),
  crossReferences: () => fse2.entities.CrossReference.list("-updated_date", 50000),
  chapterIntros: () => fse2.entities.ChapterIntro.list("-updated_date", 5000),
  bookIntros: () => fse2.entities.BookIntro.list("-updated_date", 500),
  verses: () => fse2.entities.BibleVerse.list("-updated_date", 2000),
  plan: () => fse2.entities.ReadingPlan.list("-updated_date", 200),
  settings: () => fse2.entities.SiteSettings.list("-updated_date", 100),
  liveSessions: () => fse2.entities.LiveSession.list("-updated_date", 200),
  groups: () => fse2.entities.DiscussionGroup.list("-updated_date", 200),
  revelations: () => fse2.entities.Revelation.list("-updated_date", 300),
  threads: () => fse2.entities.DiscussionThread.list("-updated_date", 400)
};

const invokeFunction = async (action, payload) => {
  const response = await fse2.functions.invoke("content", { action, ...payload });
  const data = response && response.data ? response.data : response;
  if (!data || data.error) {
    throw new Error((data && data.error) || "The request could not be completed.");
  }
  return data;
};

export const fetchPublicCollection = async (collection, options = {}) => {
  const reader = READERS[collection];
  if (!reader) return [];
  if (["prayerPassages", "crossReferences", "chapterIntros", "bookIntros"].includes(collection)) {
    const data = await invokeFunction("list", { collection });
    return Array.isArray(data?.rows) ? data.rows : Array.isArray(data) ? data : [];
  }
  try {
    const rows = await reader();
    if (Array.isArray(rows) && (rows.length || options.authenticated)) return rows;
  } catch {
    // fall through to the public reader
  }
  try {
    const data = await invokeFunction("list", { collection });
    const rows = data && Array.isArray(data.rows) ? data.rows : [];
    return rows;
  } catch {
    return [];
  }
};

export const submitContactMessage = async (payload) => {
  try {
    const record = await fse2.entities.ContactMessage.create({
      ...payload,
      is_read: false
    });
    return record;
  } catch {
    const data = await invokeFunction("submitContact", payload);
    return data.record;
  }
};

export const submitQuestion = async (payload) => {
  try {
    const record = await fse2.entities.QAEntry.create({ ...payload, status: "pending" });
    return record;
  } catch {
    const data = await invokeFunction("submitQuestion", payload);
    return data.record;
  }
};

export const submitRevelation = async (payload) => {
  try {
    const record = await fse2.entities.Revelation.create({ ...payload, likes: 0 });
    return record;
  } catch {
    const data = await invokeFunction("submitRevelation", payload);
    return data.record;
  }
};

export const likeRevelation = async (id) => {
  try {
    const rows = await fse2.entities.Revelation.list("-updated_date", 300);
    const current = (rows || []).find((row) => row.id === id);
    if (!current) throw new Error("That post was not found.");
    return await fse2.entities.Revelation.update(id, { likes: Number(current.likes || 0) + 1 });
  } catch {
    const data = await invokeFunction("likeRevelation", { id });
    return data.record;
  }
};

export const submitComment = async (payload) => {
  try {
    const record = await fse2.entities.Revelation.create({ ...payload, likes: 0 });
    return record;
  } catch {
    const data = await invokeFunction("submitComment", payload);
    return data.record;
  }
};

export const submitThreadMessage = async (payload) => {
  try {
    const record = await fse2.entities.DiscussionThread.create({ ...payload });
    return record;
  } catch {
    const data = await invokeFunction("submitThread", payload);
    return data.record;
  }
};