import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { fse2 } from "@/api/fse2Client";
import { fetchPublicCollection } from "@/lib/contentApi";
import { offline, chapterKey, STORES } from "@/lib/offlineDb";
import { BIBLE_BOOKS } from "@/lib/bibleBooks";
import { bytesToMb } from "@/lib/format";
import { chapterIsReadable, fetchChapter } from "@/lib/bibleApi";
import { VERSIONS, getVersion, getVersionOrDefault } from "@/lib/versions";
import { normaliseCrossRef, normalisePassage } from "@/lib/prayerPassages";
import {
  countOfflineStrong,
  readOfflineStrongCodes,
  writeOfflineStrongs
} from "@/lib/strongsOffline";
import { DownloadIcon, Trash2Icon, HardDriveIcon, CheckCircleIcon, Loader2Icon, BookOpenIcon, ArrowLeftIcon } from "lucide-react";

const PLAN_BOOKS = ["John", "Psalms"];

const SECTIONS = [
  { id: "bible", label: "Bible chapters", entity: "chapters" },
  { id: "verses", label: "Verses", entity: "verses" },
  { id: "strongs", label: "Strong's dictionary", entity: "strongs" },
  { id: "devotionals", label: "Devotionals", entity: "devotionals" },
  { id: "commentary", label: "Commentary", entity: "commentary" },
  { id: "prayers", label: "Prayers", entity: "prayers" },
  { id: "prayerPassages", label: "Prayer passages", entity: "prayerPassages" },
  { id: "crossReferences", label: "Cross-references", entity: "crossReferences" },
  { id: "qa", label: "Q&A", entity: "qaItems" },
  { id: "verseOfDay", label: "Verse of the day", entity: "verseOfDay" }
];

// The translations available in the reader's version registry.
const TRANSLATIONS = VERSIONS.map((version) => ({
  id: version.id,
  label: version.name,
  note: version.note
}));

/**
 * Asks the app for the meaning of a list of Strong's numbers.
 * The concordance of the app answers, so the dictionary on the device is the
 * same one the reader sees online.
 */
const fetchStrongDefinitions = async (codes) => {
  if (!codes || !codes.length) return [];
  try {
    const response = await fse2.functions.invoke("strongsDefinition", {
      action: "list",
      codes,
      limit: 200
    });
    const data = response && response.data ? response.data : response;
    return data && Array.isArray(data.rows) ? data.rows : [];
  } catch {
    return [];
  }
};

/**
 * Asks the app for one page of the whole concordance of a language.
 * It is used when no chapter on the device names the numbers, so the
 * dictionary is whole all the same.
 */
const fetchStrongDictionary = async (language, offset) => {
  try {
    const response = await fse2.functions.invoke("strongsDefinition", {
      action: "list",
      language,
      offset,
      limit: 200
    });
    const data = response && response.data ? response.data : response;
    return data && Array.isArray(data.rows) ? data.rows : [];
  } catch {
    return [];
  }
};

/**
 * Fetches a chapter, and tries again when the connection gives way, so a
 * weak signal does not leave holes in the Bible on the device.
 */
const loadChapter = async (options) => {
  let lastError = null;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const data = await fetchChapter(options);
      if (data.refresh && typeof data.refresh.then === "function") {
        const fresh = await data.refresh.catch(() => null);
        return fresh || data;
      }
      return data;
    } catch (error) {
      lastError = error;
      await new Promise((resolve) => setTimeout(resolve, 500 * attempt));
    }
  }
  throw lastError || new Error("the chapter could not be reached");
};

export default function Offline() {
  const [counts, setCounts] = useState({});
  const [usage, setUsage] = useState({ usage: 0, quota: 0 });
  const [selected, setSelected] = useState(SECTIONS.map((item) => item.id));
  const [progress, setProgress] = useState({ label: "", done: 0, total: 0 });
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [failures, setFailures] = useState([]);
  const [bookScope, setBookScope] = useState("all");
  const [translationIds, setTranslationIds] = useState(() => ["kjv", "kjvp", "luganda"]);

  const refresh = async () => {
    const next = {};
    for (const store of STORES) {
      next[store] = await offline.count(store).catch(() => 0);
    }
    next.strongs = await countOfflineStrong();
    setCounts(next);
    const estimate = await offline.estimate().catch(() => ({ usage: 0, quota: 0 }));
    setUsage(estimate);
  };

  useEffect(() => {
    refresh();
  }, []);

  const toggle = (id) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const toggleTranslation = (id) => {
    setTranslationIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  /**
   * Stores every chapter of the chosen books and translations.
   * A chapter that is already on the device and whole is left alone, so the
   * download can be stopped and started again. Every chapter that could not
   * be stored is written down, so the reader knows exactly what is missing.
   */
  const downloadChapters = async (books, translations, failures, tick) => {
    const total = books.reduce((sum, book) => sum + (book.chapters || 0), 0) * translations.length;
    let done = 0;
    let stored = 0;
    let verseRows = [];

    // The verses are written in batches, so a long download does not open
    // one transaction for every chapter.
    const keepVerses = async () => {
      if (!selected.includes("verses") || !verseRows.length) return;
      const rows = verseRows;
      verseRows = [];
      await offline.putMany("verses", rows).catch(() => null);
    };

    for (const translation of translations) {
      const record = getVersionOrDefault(translation);
      if (!record) continue;
      if (["amp", "msg", "tpt"].includes(record.id)) {
        failures.push(`${record.short}: this translation is not available from the configured Bible text source, so it cannot yet be downloaded for offline use.`);
        done += books.reduce((sum, book) => sum + (book.chapters || 0), 0);
        await tick();
        continue;
      }
      for (const book of books) {
        await offline
          .put("books", String(book.number), {
            number: book.number,
            name: book.name,
            abbr: book.abbr,
            luganda: book.luganda,
            chapters: book.chapters
          })
          .catch(() => null);
        for (let chapter = 1; chapter <= (book.chapters || 0); chapter += 1) {
          setProgress({ label: `${record.short} ${book.name} ${chapter}`, done, total });
          const key = chapterKey(book.number, chapter, record.language, record.id);
          try {
            const cached = await offline.get("chapters", key).catch(() => null);
            if (cached && cached.verses && chapterIsReadable(cached.verses)) {
              done += 1;
              continue;
            }
            // The freshest text is the one that is kept, and it is asked for
            // again when the connection gives way.
            const payload = await loadChapter({
              bookNumber: book.number,
              bookName: book.name,
              chapter,
              language: record.language,
              version: record.id
            });
            const verses = payload.verses || [];
            if (!chapterIsReadable(verses)) throw new Error("the chapter came back incomplete");
            if (record.strongs && !payload.strongs) {
              throw new Error("the chapter came back without the Strong's numbers");
            }
            await offline.put("chapters", key, {
              reference: payload.reference,
              book: payload.book,
              book_number: payload.book_number,
              chapter: payload.chapter,
              language: payload.language,
              version: payload.version,
              strongs: payload.strongs,
              verse_count: verses.length,
              verses
            });
            if (selected.includes("verses")) {
              verseRows.push({
                key: `${book.number}:${chapter}:${record.id}`,
                value: verses.map((verse) => ({
                  ...verse,
                  book: book.name,
                  book_number: book.number,
                  chapter
                }))
              });
              if (verseRows.length >= 50) await keepVerses();
            }
            stored += 1;
          } catch (error) {
            failures.push(`${record.short} ${book.name} ${chapter}: ${error.message || "could not be reached"}`);
          }
          done += 1;
          await tick();
        }
      }
    }
    await keepVerses();

    return { stored, done, total };
  };

  /**
   * Keeps the Strong's numbers on the device.
   * The definitions that are in the app are copied into the offline store,
   * and the numbers the KJV+ chapters on this device carry are asked for by
   * name, so the meaning of a word opens without a connection.
   */
  const downloadStrongs = async (failures, tick) => {
    const pageSize = 500;
    let offset = 0;
    let stored = 0;
    for (let page = 0; page < 40; page += 1) {
      setProgress({ label: "Strong's dictionary", done: offset, total: offset });
      const rows = await fse2.entities.StrongEntry.list("-updated_date", pageSize, offset).catch(() => []);
      if (!rows || !rows.length) break;
      const wanted = rows.filter((row) => row && row.code && row.definition);
      const saved = await writeOfflineStrongs(wanted);
      stored += saved;
      if (saved < wanted.length) {
        failures.push(`${wanted.length - saved} Strong's numbers could not be kept on this device`);
      }
      offset += rows.length;
      if (rows.length < pageSize) break;
      await tick();
    }

    // The numbers the KJV+ chapters on this device really use are asked for
    // by name, so the whole dictionary is on the phone and not only the few
    // words the app happens to keep.
    const codes = await readOfflineStrongCodes();
    for (let index = 0; index < codes.length; index += 150) {
      const batch = codes.slice(index, index + 150);
      setProgress({ label: "Strong's dictionary", done: offset + index, total: offset + codes.length });
      const rows = await fetchStrongDefinitions(batch);
      if (!rows.length) {
        failures.push(`${batch.length} Strong's numbers could not be fetched`);
        break;
      }
      const saved = await writeOfflineStrongs(rows);
      stored += saved;
      if (saved < rows.length) {
        failures.push(`${rows.length - saved} Strong's numbers could not be kept on this device`);
      }
      await tick();
    }

    // When no chapter on the device names the numbers, the whole concordance
    // is asked for, a page at a time.
    if (!codes.length) {
      for (const language of ["Greek", "Hebrew"]) {
        for (let page = 0; page < 120; page += 1) {
          setProgress({ label: `Strong's dictionary (${language})`, done: offset, total: offset + 1200 });
          const rows = await fetchStrongDictionary(language, page * 200);
          if (!rows.length) break;
          const saved = await writeOfflineStrongs(rows);
          stored += saved;
          if (rows.length < 200) break;
          await tick();
        }
      }
    }
    return { stored, total: offset + codes.length };
  };

  const download = async () => {
    setBusy(true);
    setStatus("");
    setFailures([]);
    const failures = [];
    const tick = () => new Promise((resolve) => setTimeout(resolve, 0));
    try {
      let chapters = { stored: 0, done: 0, total: 0 };
      if (selected.includes("bible")) {
        const books =
          bookScope === "all" ? BIBLE_BOOKS : BIBLE_BOOKS.filter((book) => PLAN_BOOKS.includes(book.name));
        // The translations are kept as their ids, so every one of them is
        // fetched in its own language and with its own Strong's numbers.
        const translations = translationIds.map((id) => getVersion(id)).filter(Boolean);
        chapters = await downloadChapters(books, translations, failures, tick);
      }

      let strongs = { stored: 0, total: 0 };
      if (selected.includes("strongs")) {
        strongs = await downloadStrongs(failures, tick);
      }

      if (selected.includes("devotionals")) {
        setProgress({ label: "Devotionals", done: 0, total: 1 });
        const rows = await fetchPublicCollection("devotionals", { authenticated: true }).catch(() => []);
        for (const row of rows || []) {
          await offline.put("devotionals", row.code, row);
        }
        if (!(rows || []).length) {
          const { DEVOTIONALS } = await import("@/lib/seedContent");
          for (const item of DEVOTIONALS) {
            await offline.put("devotionals", item.code, item);
          }
        }
      }

      if (selected.includes("commentary")) {
        setProgress({ label: "Commentary", done: 0, total: 1 });
        const rows = await fetchPublicCollection("commentary", { authenticated: true }).catch(() => []);
        for (const row of rows || []) {
          await offline.put("commentary", `${row.book}:${row.chapter}`, row);
        }
      }

      if (selected.includes("prayers")) {
        setProgress({ label: "Prayers", done: 0, total: 1 });
        const rows = await fetchPublicCollection("prayers", { authenticated: true }).catch(() => []);
        for (const row of rows || []) {
          await offline.put("prayers", row.title, row);
        }
      }

      // The prayer passages and the cross-references are kept chapter by
      // chapter, the same way the reader asks for them.
      if (selected.includes("prayerPassages")) {
        setProgress({ label: "Prayer passages", done: 0, total: 1 });
        const rows = await fse2.entities.PrayerPassage.list("-updated_date", 1000).catch(() => []);
        const grouped = new Map();
        (rows || []).forEach((row) => {
          const key = `${row.book_number}:${row.chapter}`;
          if (!grouped.has(key)) grouped.set(key, []);
          grouped.get(key).push(normalisePassage(row));
        });
        for (const [key, list] of grouped.entries()) {
          await offline.put("prayerPassages", key, list);
        }
      }

      if (selected.includes("crossReferences")) {
        setProgress({ label: "Cross-references", done: 0, total: 1 });
        const rows = await fse2.entities.CrossReference.list("-updated_date", 1000).catch(() => []);
        const grouped = new Map();
        (rows || []).forEach((row) => {
          const key = `${row.book_number}:${row.chapter}`;
          if (!grouped.has(key)) grouped.set(key, []);
          grouped.get(key).push(normaliseCrossRef(row));
        });
        for (const [key, list] of grouped.entries()) {
          await offline.put("crossReferences", key, list);
        }
      }

      if (selected.includes("qa")) {
        setProgress({ label: "Q&A", done: 0, total: 1 });
        const [rows, topicRows] = await Promise.all([
          fetchPublicCollection("qaItems", { authenticated: true }).catch(() => []),
          fetchPublicCollection("qaTopics", { authenticated: true }).catch(() => [])
        ]);
        for (const row of rows || []) {
          await offline.put("qaItems", row.id || row.question_en, row);
        }
        for (const topic of topicRows || []) {
          await offline.put("qaTopics", topic.id || topic.name_en, topic);
        }
      }

      if (selected.includes("verseOfDay")) {
        setProgress({ label: "Verse of the day", done: 0, total: 1 });
        const rows = await fetchPublicCollection("verseOfDay", { authenticated: true }).catch(() => []);
        for (const row of rows || []) {
          await offline.put("verseOfDay", row.verse_date, row);
        }
      }

      setFailures(failures);
      const parts = [];
      if (selected.includes("bible")) {
        parts.push(`${chapters.stored} chapters stored (${chapters.done} of ${chapters.total} walked through)`);
      }
      if (selected.includes("strongs")) {
        parts.push(`${strongs.stored} Strong's numbers kept on this device`);
      }
      const failed = failures.length;
      setStatus(
        failed
          ? `The download finished with ${failed} item${failed === 1 ? "" : "s"} that could not be stored. The rest is ready: ${parts.join(", ")}. Run it again to finish the rest.`
          : `The download finished. ${parts.join(", ")}. These sections now work without a connection.`
      );
      await refresh();
    } catch (err) {
      setStatus(err.message || "The download stopped early. Try again when you have a steadier connection.");
    } finally {
      setBusy(false);
      setProgress({ label: "", done: 0, total: 0 });
    }
  };

  const clear = async () => {
    setBusy(true);
    try {
      await offline.clearAll();
      await refresh();
      setFailures([]);
      setStatus("Offline data cleared from this device.");
    } finally {
      setBusy(false);
    }
  };

  const percent = progress.total ? Math.round((progress.done / progress.total) * 100) : 0;

  return (
    <div>
      <section className="pr-section-tight" style={{ background: "var(--pr-emerald)" }}>
        <div className="pr-container">
          <Link to={createPageUrl("Home")} className="pr-btn pr-btn-light-outline pr-btn-sm">
            <ArrowLeftIcon className="h-4 w-4" /> Home
          </Link>
          <h1 className="pr-serif" style={{ margin: "16px 0 0", color: "#fff", fontSize: "2.1rem" }}>
            Offline centre
          </h1>
          <p style={{ margin: "8px 0 0", color: "rgba(255,255,255,0.8)", maxWidth: "60ch" }}>
            Download what you need before you travel. The Bible in English, with the Strong&apos;s numbers, and in
            Luganda, the whole Strong&apos;s dictionary, devotionals, prayers, commentary, cross-references and the
            verse of the day all work in flight mode.
          </p>
        </div>
      </section>

      <div className="pr-container pr-section">
        <div className="pr-grid pr-grid-2">
          <div className="pr-card pr-card-pad">
            <h2 className="pr-heading" style={{ margin: "0 0 6px", fontSize: "1.1rem", fontWeight: 800 }}>
              <DownloadIcon className="h-4 w-4" style={{ display: "inline", color: "var(--pr-gold-deep)" }} /> Download manager
            </h2>
            <p style={{ margin: "0 0 16px", fontSize: "0.88rem" }}>
              Choose what to store on this device, then run the download. A chapter that is already stored is left
              alone, so the download can be stopped and started again.
            </p>

            <div className="pr-field" style={{ marginBottom: 12 }}>
              <label className="pr-label" htmlFor="offline-scope">
                Which books to store
              </label>
              <select
                id="offline-scope"
                className="pr-input"
                value={bookScope}
                onChange={(event) => setBookScope(event.target.value)}
              >
                <option value="all">Every book in the Bible (1,189 chapters)</option>
                <option value="plan">The reading plan books (John and Psalms)</option>
              </select>
            </div>

            <div className="pr-field" style={{ marginBottom: 16 }}>
              <span className="pr-label">Which translations to store</span>
              <div style={{ display: "grid", gap: 8, marginTop: 6 }}>
                {TRANSLATIONS.map((translation) => (
                  <label
                    key={translation.id}
                    style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: "0.9rem" }}
                  >
                    <input
                      type="checkbox"
                      checked={translationIds.includes(translation.id)}
                      onChange={() => toggleTranslation(translation.id)}
                      style={{ marginTop: 3 }}
                    />
                    <span>
                      <strong>{translation.label}</strong>
                      <br />
                      <span style={{ fontSize: "0.78rem", color: "var(--pr-body)" }}>{translation.note}</span>
                    </span>
                  </label>
                ))}
              </div>
              <p style={{ margin: "8px 0 0", fontSize: "0.78rem", color: "var(--pr-body)" }}>
                Downloading every selected translation across the whole Bible can take a while on a slow
                connection. You can leave the page open: every chapter that is already stored is skipped, a
                chapter that could not be reached is asked for again, and the download carries on where it
                stopped.
              </p>
            </div>

            <div style={{ display: "grid", gap: 10, marginBottom: 18 }}>
              {SECTIONS.map((section) => (
                <label key={section.id} style={{ display: "flex", gap: 10, alignItems: "center", fontSize: "0.9rem" }}>
                  <input
                    type="checkbox"
                    checked={selected.includes(section.id)}
                    onChange={() => toggle(section.id)}
                  />
                  {section.label}
                </label>
              ))}
            </div>

            <button type="button" className="pr-btn pr-btn-primary pr-btn-block" onClick={download} disabled={busy}>
              {busy ? <Loader2Icon className="h-4 w-4 animate-spin" /> : <DownloadIcon className="h-4 w-4" />}
              {busy ? "Downloading…" : "Download selected sections"}
            </button>

            {busy && progress.total ? (
              <div style={{ marginTop: 16 }}>
                <p style={{ margin: "0 0 8px", fontSize: "0.85rem" }}>
                  {progress.label}  -  {progress.done} of {progress.total}
                </p>
                <div className="pr-progress" style={{ background: "var(--pr-ivory-soft)" }}>
                  <span className="pr-progress-fill" style={{ width: `${percent}%`, background: "var(--pr-emerald)" }} />
                </div>
              </div>
            ) : null}

            {status ? <div className="pr-success" style={{ marginTop: 16 }}>{status}</div> : null}

            {failures.length ? (
              <div style={{ marginTop: 16 }}>
                <p style={{ margin: "0 0 8px", fontSize: "0.85rem", fontWeight: 700 }}>
                  {failures.length} item{failures.length === 1 ? "" : "s"} could not be stored
                </p>
                <ul className="pr-list-reset" style={{ display: "grid", gap: 4, fontSize: "0.78rem" }}>
                  {failures.slice(0, 25).map((failure) => (
                    <li key={failure}>{failure}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>

          <div className="pr-card pr-card-pad">
            <h2 className="pr-heading" style={{ margin: "0 0 6px", fontSize: "1.1rem", fontWeight: 800 }}>
              <HardDriveIcon className="h-4 w-4" style={{ display: "inline", color: "var(--pr-gold-deep)" }} /> Storage used
            </h2>
            <p style={{ margin: "0 0 16px", fontSize: "0.88rem" }}>
              {bytesToMb(usage.usage)} MB used
              {usage.quota ? ` of roughly ${bytesToMb(usage.quota)} MB available to this browser` : ""}.
            </p>

            <ul className="pr-list-reset" style={{ display: "grid", gap: 8 }}>
              {SECTIONS.map((section) => (
                <li
                  key={section.id}
                  style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", borderBottom: "1px solid var(--pr-border)", paddingBottom: 6 }}
                >
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                    <CheckCircleIcon className="h-4 w-4" style={{ color: "var(--pr-emerald)" }} />
                    {section.label}
                  </span>
                  <strong>{counts[section.entity] || 0}</strong>
                </li>
              ))}
            </ul>

            <button type="button" className="pr-btn pr-btn-danger pr-btn-sm" style={{ marginTop: 18 }} onClick={clear} disabled={busy}>
              <Trash2Icon className="h-4 w-4" />
              Clear offline data
            </button>

            <div className="pr-success" style={{ marginTop: 18 }}>
              <BookOpenIcon className="h-4 w-4" style={{ display: "inline" }} /> Verse-songs and sign-in need a
              connection. Everything else keeps working offline.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}