import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { fse2 } from "@/api/fse2Client";
import { fetchPublicCollection } from "@/lib/contentApi";
import { offline, chapterKey, STORES } from "@/lib/offlineDb";
import { BIBLE_BOOKS } from "@/lib/bibleBooks";
import { bytesToMb } from "@/lib/format";
import { fetchChapter } from "@/lib/bibleApi";
import { DownloadIcon, Trash2Icon, HardDriveIcon, CheckCircleIcon, Loader2Icon, BookOpenIcon, ArrowLeftIcon } from "lucide-react";

const PLAN_BOOKS = ["John", "Psalms"];

const SECTIONS = [
  { id: "bible", label: "Bible chapters", entity: "chapters" },
  { id: "verses", label: "Verses", entity: "verses" },
  { id: "devotionals", label: "Devotionals", entity: "devotionals" },
  { id: "commentary", label: "Commentary", entity: "commentary" },
  { id: "prayers", label: "Prayers", entity: "prayers" },
  { id: "qa", label: "Q&A", entity: "qa" },
  { id: "verseOfDay", label: "Verse of the day", entity: "verseOfDay" }
];

export default function Offline() {
  const [counts, setCounts] = useState({});
  const [usage, setUsage] = useState({ usage: 0, quota: 0 });
  const [selected, setSelected] = useState(SECTIONS.map((item) => item.id));
  const [progress, setProgress] = useState({ label: "", done: 0, total: 0 });
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [bookScope, setBookScope] = useState("plan");
  const [language, setLanguage] = useState("en");

  const refresh = async () => {
    const next = {};
    for (const store of STORES) {
      next[store] = await offline.count(store).catch(() => 0);
    }
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

  const download = async () => {
    setBusy(true);
    setStatus("");
    try {
      if (selected.includes("bible")) {
        const books =
          bookScope === "all" ? BIBLE_BOOKS : BIBLE_BOOKS.filter((book) => PLAN_BOOKS.includes(book.name));
        const total = books.reduce((sum, book) => sum + (book.chapters || 0), 0);
        let done = 0;
        for (const book of books) {
          for (let chapter = 1; chapter <= (book.chapters || 0); chapter += 1) {
            setProgress({ label: `${book.name} ${chapter}`, done, total });
            try {
              const data = await fetchChapter({
                bookNumber: book.number,
                bookName: book.name,
                chapter,
                language
              });
              await offline.put("chapters", chapterKey(book.number, chapter, language), data);
              if (selected.includes("verses")) {
                await offline.put(
                  "verses",
                  `${book.number}:${chapter}`,
                  (data.verses || []).map((verse) => ({
                    ...verse,
                    book: book.name,
                    book_number: book.number,
                    chapter
                  }))
                );
              }
            } catch {
              // A missing chapter must not stop the rest of the download.
            }
            done += 1;
            await new Promise((resolve) => setTimeout(resolve, 0));
          }
        }
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

      if (selected.includes("prayers")) {
        setProgress({ label: "Prayers", done: 0, total: 1 });
        const rows = await fetchPublicCollection("prayers", { authenticated: true }).catch(() => []);
        for (const row of rows || []) {
          await offline.put("prayers", row.title, row);
        }
      }

      if (selected.includes("qa")) {
        setProgress({ label: "Q&A", done: 0, total: 1 });
        const rows = await fetchPublicCollection("qa", { authenticated: true }).catch(() => []);
        for (const row of rows || []) {
          await offline.put("qa", row.id, row);
        }
      }

      if (selected.includes("verseOfDay")) {
        setProgress({ label: "Verse of the day", done: 0, total: 1 });
        const rows = await fetchPublicCollection("verseOfDay", { authenticated: true }).catch(() => []);
        for (const row of rows || []) {
          await offline.put("verseOfDay", row.verse_date, row);
        }
      }

      setStatus("Download finished. These sections now work without a connection.");
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
            Download what you need before you travel. The Bible, devotionals, prayers, commentary, cross-references
            and the verse of the day all work in flight mode.
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
              Choose what to store on this device, then run the download.
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
                <option value="plan">The reading plan books (John and Psalms)</option>
                <option value="all">Every book in the Bible</option>
              </select>
            </div>

            <div className="pr-field" style={{ marginBottom: 16 }}>
              <label className="pr-label" htmlFor="offline-language">
                Language
              </label>
              <select
                id="offline-language"
                className="pr-input"
                value={language}
                onChange={(event) => setLanguage(event.target.value)}
              >
                <option value="en">English</option>
                <option value="lu">Luganda</option>
              </select>
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