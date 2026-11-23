import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fse2 } from "@/api/fse2Client";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useAuth } from "@/lib/AuthContext";
import Home from "@/pages/Home";
import { offline } from "@/lib/offlineDb";
import { STORAGE_KEYS } from "@/lib/theme";
import { bytesToMb } from "@/lib/format";
import { BIBLE_BOOKS, getBookByNumber } from "@/lib/bibleBooks";
import { BookOpenIcon, FlameIcon, BookmarkIcon, HighlighterIcon, NotebookPenIcon, DownloadIcon, CheckCircleIcon, MusicIcon, HandHeartIcon } from "lucide-react";

const readDone = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.doneDevotionals) || "[]");
  } catch {
    return [];
  }
};

export default function Dashboard() {
  const { user, isAuthenticated, isLoadingAuth } = useAuth();
  const email = user?.email || null;
  const [offlineCounts, setOfflineCounts] = useState({ chapters: 0, verses: 0, storage: 0 });

  const { data: readings } = useQuery({
    queryKey: ["readings"],
    queryFn: () => fse2.entities.Reading.list("-updated_date", 300),
    enabled: !!email
  });

  const { data: marks } = useQuery({
    queryKey: ["studyMarks", email],
    queryFn: () => fse2.entities.StudyMark.list("-updated_date", 300),
    enabled: !!email
  });

  const { data: devotionalProgress } = useQuery({
    queryKey: ["devotionalProgress", email],
    queryFn: () => fse2.entities.DevotionalProgress.list("-completed_date", 300),
    enabled: !!email
  });

  const { data: savedPrayers } = useQuery({
    queryKey: ["prayerSaved", email],
    queryFn: () => fse2.entities.PrayerSaved.list("-created_date", 300),
    enabled: !!email
  });

  React.useEffect(() => {
    let active = true;
    Promise.all([offline.count("chapters").catch(() => 0), offline.count("verses").catch(() => 0), offline.estimate().catch(() => ({ usage: 0 }))])
      .then(([chapters, verses, estimate]) => {
        if (!active) return;
        setOfflineCounts({ chapters, verses, storage: estimate.usage || 0 });
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const myReadings = useMemo(
    () => (readings || []).filter((row) => !email || row.owner_email === email),
    [readings, email]
  );

  const myMarks = useMemo(
    () => (marks || []).filter((row) => !email || row.owner_email === email),
    [marks, email]
  );

  const lastReading = myReadings[0] || null;
  const highlights = myMarks.filter((row) => row.mark_type === "highlight");
  const bookmarks = myMarks.filter((row) => row.mark_type === "bookmark");
  const notes = myMarks.filter((row) => row.mark_type === "note");
  const completedDevotionals = devotionalProgress || [];
  const saved = savedPrayers || [];
  const doneLocal = readDone();

  const lastBook = lastReading ? BIBLE_BOOKS.find((item) => item.name === lastReading.book) : null;

  // The app root opens here, so a visitor who is not signed in gets the
  // landing page and a reader gets their personal dashboard.
  if (!isLoadingAuth && !isAuthenticated) {
    return <Home />;
  }

  return (
    <div>
      <section className="pr-section-tight" style={{ background: "var(--pr-emerald)" }}>
        <div className="pr-container">
          <span className="pr-eyebrow pr-eyebrow-light">Your dashboard</span>
          <h1 className="pr-serif" style={{ margin: "10px 0 0", color: "#fff", fontSize: "2.1rem" }}>
            Welcome{user?.full_name ? `, ${user.full_name}` : ""}
          </h1>
          <p style={{ margin: "8px 0 0", color: "rgba(255,255,255,0.8)" }}>
            {isAuthenticated
              ? "Everything you have read, highlighted and prayed for  -  in one place."
              : "Sign in to keep your reading, highlights and prayers together."}
          </p>
          {!isAuthenticated ? (
            <div className="pr-hero-actions">
              <Link to={createPageUrl("Login")} className="pr-btn pr-btn-gold">
                Sign in
              </Link>
              <Link to={createPageUrl("Signup")} className="pr-btn pr-btn-light-outline">
                Create account
              </Link>
            </div>
          ) : null}
        </div>
      </section>

      <div className="pr-container pr-section">
        <div className="pr-grid pr-grid-4">
          <div className="pr-stat">
            <p className="pr-stat-value">{myReadings.length}</p>
            <p className="pr-stat-label">Chapters read</p>
          </div>
          <div className="pr-stat">
            <p className="pr-stat-value">{highlights.length + bookmarks.length + notes.length}</p>
            <p className="pr-stat-label">Highlights & notes</p>
          </div>
          <div className="pr-stat">
            <p className="pr-stat-value">{doneLocal.length + completedDevotionals.length}</p>
            <p className="pr-stat-label">Devotionals done</p>
          </div>
          <div className="pr-stat">
            <p className="pr-stat-value">{saved.length}</p>
            <p className="pr-stat-label">Prayers saved</p>
          </div>
        </div>

        <div className="pr-grid pr-grid-2" style={{ marginTop: 22 }}>
          <div className="pr-card pr-card-pad">
            <h2 className="pr-heading" style={{ margin: "0 0 10px", fontSize: "1.1rem", fontWeight: 800 }}>
              <BookOpenIcon className="h-4 w-4" style={{ display: "inline", color: "var(--pr-gold-deep)" }} /> Continue reading
            </h2>
            {lastReading ? (
              <div>
                <p className="pr-serif" style={{ margin: 0, fontSize: "1.15rem", color: "var(--pr-heading)" }}>
                  {lastReading.book} {lastReading.chapter}
                </p>
                <p style={{ margin: "6px 0 0", fontSize: "0.85rem" }}>
                  Last read {lastReading.read_date || "recently"}
                </p>
                <Link
                  to={
                    createPageUrl("Chapter") +
                    `?book=${lastBook ? lastBook.number : 19}&chapter=${lastReading.chapter || 1}`
                  }
                  className="pr-btn pr-btn-primary pr-btn-sm"
                  style={{ marginTop: 14 }}
                >
                  Continue this chapter
                </Link>
              </div>
            ) : (
              <div>
                <p style={{ margin: 0, fontSize: "0.9rem" }}>
                  You have not finished a chapter yet. Start with the reading plan or pick a book.
                </p>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 14 }}>
                  <Link to={createPageUrl("Plan")} className="pr-btn pr-btn-primary pr-btn-sm">
                    <FlameIcon className="h-4 w-4" />
                    Open the reading plan
                  </Link>
                  <Link to={createPageUrl("BibleReader")} className="pr-btn pr-btn-outline pr-btn-sm">
                    Choose a book
                  </Link>
                </div>
              </div>
            )}
          </div>

          <div className="pr-card pr-card-pad">
            <h2 className="pr-heading" style={{ margin: "0 0 10px", fontSize: "1.1rem", fontWeight: 800 }}>
              <DownloadIcon className="h-4 w-4" style={{ display: "inline", color: "var(--pr-gold-deep)" }} /> Download &amp; offline
            </h2>
            <p style={{ margin: "0 0 10px", fontSize: "0.9rem" }}>
              {offlineCounts.chapters} chapters and {offlineCounts.verses} verses stored on this device
              {offlineCounts.storage ? ` · ${bytesToMb(offlineCounts.storage)} MB used` : ""}.
            </p>
            <Link to={createPageUrl("Offline")} className="pr-btn pr-btn-gold pr-btn-sm">
              <DownloadIcon className="h-4 w-4" />
              Open the offline centre
            </Link>
          </div>

          <div className="pr-card pr-card-pad">
            <h2 className="pr-heading" style={{ margin: "0 0 10px", fontSize: "1.1rem", fontWeight: 800 }}>
              <HighlighterIcon className="h-4 w-4" style={{ display: "inline", color: "var(--pr-gold-deep)" }} /> My highlights
            </h2>
            {highlights.length === 0 ? (
              <p style={{ margin: 0, fontSize: "0.9rem" }}>No highlights yet. Tap any verse while reading to mark it.</p>
            ) : (
              <ul className="pr-list-reset" style={{ display: "grid", gap: 8 }}>
                {highlights.slice(0, 5).map((row) => (
                  <li key={row.id} style={{ fontSize: "0.85rem" }}>
                    <Link
                      to={createPageUrl("Chapter") + `?book=${row.book_number}&chapter=${row.chapter}&verse=${row.verse}`}
                      className="pr-link"
                    >
                      {row.book} {row.chapter}:{row.verse}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="pr-card pr-card-pad">
            <h2 className="pr-heading" style={{ margin: "0 0 10px", fontSize: "1.1rem", fontWeight: 800 }}>
              <BookmarkIcon className="h-4 w-4" style={{ display: "inline", color: "var(--pr-gold-deep)" }} /> My bookmarks
            </h2>
            {bookmarks.length === 0 ? (
              <p style={{ margin: 0, fontSize: "0.9rem" }}>Bookmark a verse to find it here later.</p>
            ) : (
              <ul className="pr-list-reset" style={{ display: "grid", gap: 8 }}>
                {bookmarks.slice(0, 5).map((row) => (
                  <li key={row.id} style={{ fontSize: "0.85rem" }}>
                    <Link
                      to={createPageUrl("Chapter") + `?book=${row.book_number}&chapter=${row.chapter}&verse=${row.verse}`}
                      className="pr-link"
                    >
                      {row.book} {row.chapter}:{row.verse}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="pr-card pr-card-pad">
            <h2 className="pr-heading" style={{ margin: "0 0 10px", fontSize: "1.1rem", fontWeight: 800 }}>
              <NotebookPenIcon className="h-4 w-4" style={{ display: "inline", color: "var(--pr-gold-deep)" }} /> My notes
            </h2>
            {notes.length === 0 ? (
              <p style={{ margin: 0, fontSize: "0.9rem" }}>Add a note to any verse and it will appear here.</p>
            ) : (
              <ul className="pr-list-reset" style={{ display: "grid", gap: 8 }}>
                {notes.slice(0, 5).map((row) => (
                  <li key={row.id} style={{ fontSize: "0.85rem" }}>
                    <strong>
                      {row.book} {row.chapter}:{row.verse}
                    </strong>
                    <span style={{ display: "block" }}>{row.note_text}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="pr-card pr-card-pad">
            <h2 className="pr-heading" style={{ margin: "0 0 10px", fontSize: "1.1rem", fontWeight: 800 }}>
              <HandHeartIcon className="h-4 w-4" style={{ display: "inline", color: "var(--pr-gold-deep)" }} /> Prayer list
            </h2>
            {saved.length === 0 ? (
              <p style={{ margin: 0, fontSize: "0.9rem" }}>
                Save a prayer from the library and it will wait for you here.
              </p>
            ) : (
              <ul className="pr-list-reset" style={{ display: "grid", gap: 8 }}>
                {saved.slice(0, 6).map((row) => (
                  <li key={row.id} style={{ fontSize: "0.85rem" }}>
                    {row.prayer_title}
                  </li>
                ))}
              </ul>
            )}
            <Link to={createPageUrl("PrayerLibrary")} className="pr-link" style={{ display: "inline-block", marginTop: 10, fontSize: "0.85rem" }}>
              Open the prayer library →
            </Link>
          </div>
        </div>

        <div className="pr-grid pr-grid-3" style={{ marginTop: 22 }}>
          <Link to={createPageUrl("Plan")} className="pr-card pr-card-hover pr-card-pad" style={{ textDecoration: "none" }}>
            <CheckCircleIcon className="h-5 w-5" style={{ color: "var(--pr-gold-deep)" }} />
            <p className="pr-heading" style={{ margin: "10px 0 0", fontWeight: 800 }}>
              Thirty days in John and the Psalms
            </p>
            <p style={{ margin: "6px 0 0", fontSize: "0.88rem" }}>Your reading plan and streak.</p>
          </Link>
          <Link to={createPageUrl("Journal")} className="pr-card pr-card-hover pr-card-pad" style={{ textDecoration: "none" }}>
            <NotebookPenIcon className="h-5 w-5" style={{ color: "var(--pr-gold-deep)" }} />
            <p className="pr-heading" style={{ margin: "10px 0 0", fontWeight: 800 }}>
              Prayer journal
            </p>
            <p style={{ margin: "6px 0 0", fontSize: "0.88rem" }}>Praise, petitions, confessions and thanksgivings.</p>
          </Link>
          <Link to={createPageUrl("VerseSongs")} className="pr-card pr-card-hover pr-card-pad" style={{ textDecoration: "none" }}>
            <MusicIcon className="h-5 w-5" style={{ color: "var(--pr-gold-deep)" }} />
            <p className="pr-heading" style={{ margin: "10px 0 0", fontWeight: 800 }}>
              Verse-songs
            </p>
            <p style={{ margin: "6px 0 0", fontSize: "0.88rem" }}>Keep playing while you read and pray.</p>
          </Link>
        </div>
      </div>
    </div>
  );
}