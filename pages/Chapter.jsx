import React, { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fse2 } from "@/api/fse2Client";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useAuth } from "@/lib/AuthContext";
import { BIBLE_BOOKS, getBookByNumber } from "@/lib/bibleBooks";
import { fetchChapter } from "@/lib/bibleApi";
import { getCrossReferences } from "@/lib/crossRefs";
import { offline } from "@/lib/offlineDb";
import VerseActionBar from "@/components/read/VerseActionBar";
import FloatingVerse from "@/components/read/FloatingVerse";
import Spinner from "@/components/common/Spinner";
import EmptyState from "@/components/common/EmptyState";
import { ArrowLeftIcon, ChevronLeftIcon, ChevronRightIcon, Volume2Icon, TypeIcon, LanguagesIcon, ListIcon, BookmarkIcon, HighlighterIcon, NotebookPenIcon, CloudOffIcon, AlertCircleIcon, HeartHandshakeIcon, BookOpenIcon } from "lucide-react";

const HIGHLIGHT_COLORS = {
  yellow: "#fde68a",
  green: "#bbf7d0",
  pink: "#fbcfe8",
  blue: "#bfdbfe"
};

export default function Chapter() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const email = user?.email || null;
  const queryClient = useQueryClient();

  const params = new URLSearchParams(window.location.search);
  const bookNumber = Number(params.get("book")) || 19;
  const chapter = Math.max(1, Number(params.get("chapter")) || 1);
  const verseParam = Number(params.get("verse")) || 0;
  const book = getBookByNumber(bookNumber) || BIBLE_BOOKS[18];

  const [language, setLanguage] = useState(params.get("lang") === "lu" ? "lu" : "en");
  const [fontScale, setFontScale] = useState(1);
  const [verses, setVerses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [offlineCopy, setOfflineCopy] = useState(false);
  const [selectedVerse, setSelectedVerse] = useState(null);
  const [marks, setMarks] = useState([]);
  const [crossRef, setCrossRef] = useState(null);
  const [showChapterGrid, setShowChapterGrid] = useState(false);
  const [toast, setToast] = useState("");

  const { data: storedMarks } = useQuery({
    queryKey: ["studyMarks", email],
    queryFn: () => fse2.entities.StudyMark.list("-updated_date", 300),
    enabled: !!email
  });

  useEffect(() => {
    if (!email) {
      setMarks([]);
      return;
    }
    setMarks(
      (storedMarks || []).filter(
        (row) => row.owner_email === email && row.book_number === book.number && row.chapter === chapter
      )
    );
  }, [storedMarks, email, book.number, chapter]);

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await fetchChapter({
          bookNumber: book.number,
          bookName: book.name,
          chapter,
          language
        });
        if (!active) return;
        setVerses(data.verses || []);
        setOfflineCopy(Boolean(data.stale));
        if (data.refresh && typeof data.refresh.then === "function") {
          data.refresh
            .then((fresh) => {
              if (active && fresh && fresh.verses) setVerses(fresh.verses);
            })
            .catch(() => {});
        }
      } catch (err) {
        if (!active) return;
        setVerses([]);
        setError(err.message || "Could not load this chapter.");
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [book.number, book.name, chapter, language]);

  useEffect(() => {
    if (verseParam > 0) {
      setSelectedVerse(verseParam);
      window.setTimeout(() => {
        const node = document.getElementById(`verse-${verseParam}`);
        if (node) node.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 400);
    }
  }, [verseParam]);

  const highlightFor = (verse) => {
    const mark = marks.find((row) => row.mark_type === "highlight" && row.verse === verse);
    return mark ? HIGHLIGHT_COLORS[mark.color] || HIGHLIGHT_COLORS.yellow : null;
  };

  const isBookmarked = (verse) => marks.some((row) => row.mark_type === "bookmark" && row.verse === verse);

  const saveMark = async (markType, verse, extra = {}) => {
    const payload = {
      owner_email: email,
      mark_type: markType,
      book_number: book.number,
      book: book.name,
      chapter,
      verse,
      ...extra
    };
    try {
      if (email) {
        await fse2.entities.StudyMark.create(payload);
        await queryClient.invalidateQueries({ queryKey: ["studyMarks", email] });
      }
      await offline.put("highlights", `${book.number}:${chapter}:${verse}:${markType}`, payload);
      setToast(markType === "highlight" ? "Highlight saved" : markType === "bookmark" ? "Bookmarked" : "Note saved");
    } catch (err) {
      setToast(err.message || "Could not save that.");
    }
    window.setTimeout(() => setToast(""), 1800);
  };

  const toggleHighlight = (verse, color) => {
    const existing = marks.find((row) => row.mark_type === "highlight" && row.verse === verse);
    if (existing) {
      fse2.entities.StudyMark.delete(existing.id).catch(() => {});
      queryClient.invalidateQueries({ queryKey: ["studyMarks", email] });
      offline.remove("highlights", `${book.number}:${chapter}:${verse}:highlight`).catch(() => {});
      return;
    }
    saveMark("highlight", verse, { color });
  };

  const toggleBookmark = (verse) => {
    const existing = marks.find((row) => row.mark_type === "bookmark" && row.verse === verse);
    if (existing) {
      fse2.entities.StudyMark.delete(existing.id).catch(() => {});
      queryClient.invalidateQueries({ queryKey: ["studyMarks", email] });
      return;
    }
    saveMark("bookmark", verse);
  };

  const goToChapter = (number) => {
    navigate(createPageUrl("Chapter") + `?book=${book.number}&chapter=${number}`);
  };

  const stepChapter = (delta) => {
    const target = chapter + delta;
    if (target < 1) return;
    if (target <= book.chapters) {
      goToChapter(target);
      return;
    }
    const index = BIBLE_BOOKS.findIndex((item) => item.number === book.number);
    const nextBook = BIBLE_BOOKS.at(index + 1);
    if (nextBook) {
      navigate(createPageUrl("Chapter") + `?book=${nextBook.number}&chapter=1`);
    }
  };

  const crossReferences = useMemo(() => getCrossReferences(book.number, chapter), [book.number, chapter]);
  const reference = `${book.name} ${chapter}`;
  const audioUrl = `https://www.wordproaudio.org/bibles/app/audio/1/${book.number}/${chapter}.mp3`;

  return (
    <div>
      <section className="pr-section-tight" style={{ background: "var(--pr-emerald)" }}>
        <div className="pr-container">
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 14 }}>
            <Link to={createPageUrl("BibleReader")} className="pr-btn pr-btn-light-outline pr-btn-sm">
              <ArrowLeftIcon className="h-4 w-4" /> Back to books
            </Link>
            <Link to={createPageUrl("Home")} className="pr-btn pr-btn-light-outline pr-btn-sm">
              <ArrowLeftIcon className="h-4 w-4" /> Home
            </Link>
            <span
              className="pr-chip"
              style={{ marginLeft: "auto", background: "rgba(255,255,255,0.12)", color: "#fff", borderColor: "rgba(255,255,255,0.25)" }}
            >
              <BookOpenIcon className="h-4 w-4" /> Bible Reader
            </span>
          </div>

          <h1 className="pr-serif" style={{ margin: 0, color: "#fff", fontSize: "2.1rem" }}>
            {book.name} {chapter}
          </h1>
          <p style={{ margin: "6px 0 0", color: "rgba(255,255,255,0.78)" }}>
            {book.luganda} · {verses.length} {verses.length === 1 ? "verse" : "verses"}
          </p>
        </div>
      </section>

      <div className="pr-container pr-section">
        <div className="pr-card pr-card-pad" style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
            <button type="button" className="pr-icon-btn" onClick={() => stepChapter(-1)} aria-label="Previous chapter">
              <ChevronLeftIcon className="h-4 w-4" />
            </button>

            <button
              type="button"
              className="pr-chip"
              style={{ cursor: "pointer" }}
              onClick={() => setShowChapterGrid((value) => !value)}
            >
              <ListIcon className="h-4 w-4" /> Chapter {chapter}
            </button>

            <button type="button" className="pr-icon-btn" onClick={() => stepChapter(1)} aria-label="Next chapter">
              <ChevronRightIcon className="h-4 w-4" />
            </button>

            <div style={{ marginLeft: "auto", display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button
                type="button"
                className="pr-chip"
                style={{ cursor: "pointer" }}
                onClick={() => setLanguage(language === "en" ? "lu" : "en")}
              >
                <LanguagesIcon className="h-4 w-4" /> {language === "en" ? "EN" : "LU"}
              </button>
              <button
                type="button"
                className="pr-chip"
                style={{ cursor: "pointer" }}
                onClick={() => setFontScale((value) => Math.max(0.85, value - 0.1))}
                aria-label="Decrease font size"
              >
                <TypeIcon className="h-4 w-4" /> A-
              </button>
              <button
                type="button"
                className="pr-chip"
                style={{ cursor: "pointer" }}
                onClick={() => setFontScale((value) => Math.min(1.6, value + 0.1))}
                aria-label="Increase font size"
              >
                <TypeIcon className="h-4 w-4" /> A+
              </button>
              <a href={audioUrl} target="_blank" rel="noopener noreferrer" className="pr-chip" style={{ textDecoration: "none" }}>
                <Volume2Icon className="h-4 w-4" /> Listen
              </a>
            </div>
          </div>

          {showChapterGrid ? (
            <div
              className="pr-scroll-x"
              style={{ marginTop: 16, display: "flex", gap: 6, flexWrap: "wrap", maxHeight: 190, overflowY: "auto" }}
            >
              {Array.from({ length: book.chapters }, (_, index) => index + 1).map((number) => (
                <button
                  key={number}
                  type="button"
                  className="pr-chip"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setShowChapterGrid(false);
                    goToChapter(number);
                  }}
                >
                  {number}
                </button>
              ))}
            </div>
          ) : null}

          {offlineCopy ? (
            <div className="pr-success" style={{ marginTop: 14, display: "flex", gap: 8, alignItems: "center" }}>
              <CloudOffIcon className="h-4 w-4" />
              Showing your offline copy. It refreshes automatically when you are back online.
            </div>
          ) : null}

          {!isAuthenticated ? (
            <div className="pr-success" style={{ marginTop: 14 }}>
              <Link to={createPageUrl("Login")} className="pr-link">
                Sign in
              </Link>{" "}
              to keep your highlights, bookmarks and notes on every device.
            </div>
          ) : null}
        </div>

        <div className="pr-grid" style={{ gap: 22 }}>
          <div className="pr-card pr-card-pad">
            {loading ? (
              <Spinner label="Loading the passage" />
            ) : error ? (
              <EmptyState
                icon={AlertCircleIcon}
                title="This chapter could not be loaded"
                description={error}
                action={
                  <button type="button" className="pr-btn pr-btn-primary" onClick={() => goToChapter(chapter)}>
                    Try again
                  </button>
                }
              />
            ) : verses.length === 0 ? (
              <EmptyState icon={BookOpenIcon} title="No verses here" description="Choose another chapter from the list above." />
            ) : (
              <div>
                {verses.map((verse) => {
                  const background = highlightFor(verse.verse);
                  const selected = selectedVerse === verse.verse;
                  return (
                    <div key={verse.verse}>
                      {selected ? (
                        <VerseActionBar
                          verse={verse}
                          onHighlight={toggleHighlight}
                          onBookmark={toggleBookmark}
                          onNote={(number, text) => saveMark("note", number, { note_text: text })}
                          onCrossRef={() => {
                            const first = crossReferences[0];
                            if (!first) {
                              setToast("No cross-references for this chapter yet");
                              window.setTimeout(() => setToast(""), 2000);
                              return;
                            }
                            setCrossRef(first);
                          }}
                          onClose={() => setSelectedVerse(null)}
                        />
                      ) : null}
                      <button
                        type="button"
                        className={selected ? "pr-verse pr-verse-active" : "pr-verse"}
                        onClick={() => setSelectedVerse(selected ? null : verse.verse)}
                        id={`verse-${verse.verse}`}
                      >
                        <span className="pr-verse-number">
                          {isBookmarked(verse.verse) ? <BookmarkIcon className="h-4 w-4" style={{ display: "inline" }} /> : null}
                          {verse.verse}
                        </span>
                        <span
                          className="pr-verse-text"
                          style={{
                            "--pr-verse-scale": fontScale,
                            background: background || undefined,
                            borderRadius: background ? 6 : undefined,
                            padding: background ? "0 4px" : undefined
                          }}
                        >
                          {verse.text}
                        </span>
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="pr-grid pr-grid-3">
            <div className="pr-card pr-card-pad">
              <h3 className="pr-heading" style={{ fontSize: "1rem", fontWeight: 800, margin: "0 0 10px" }}>
                Commentary
              </h3>
              <p style={{ margin: 0, fontSize: "0.88rem" }}>
                Commentary for {reference} is added by the Pray-Read editorial team. Until then, read the passage
                slowly and write down the first line that stirs your heart.
              </p>
              <Link to={createPageUrl("BibleNotes")} className="pr-link" style={{ display: "inline-block", marginTop: 10 }}>
                Read the notes you saved →
              </Link>
            </div>

            <div className="pr-card pr-card-pad">
              <h3 className="pr-heading" style={{ fontSize: "1rem", fontWeight: 800, margin: "0 0 10px" }}>
                Pray this passage
              </h3>
              <p style={{ margin: 0, fontSize: "0.88rem" }}>
                Turn {reference} into a guided prayer and keep it in your prayer journal.
              </p>
              <Link
                to={createPageUrl("Journal") + `?book=${encodeURIComponent(book.name)}&chapter=${chapter}&new=1`}
                className="pr-btn pr-btn-gold pr-btn-sm"
                style={{ marginTop: 12 }}
              >
                <HeartHandshakeIcon className="h-4 w-4" />
                Open prayer journal
              </Link>
            </div>

            <div className="pr-card pr-card-pad">
              <h3 className="pr-heading" style={{ fontSize: "1rem", fontWeight: 800, margin: "0 0 10px" }}>
                Saved for later
              </h3>
              <p style={{ margin: 0, fontSize: "0.88rem" }}>
                <HighlighterIcon className="h-4 w-4" style={{ display: "inline" }} /> Highlights and{" "}
                <NotebookPenIcon className="h-4 w-4" style={{ display: "inline" }} /> notes on {book.name} are stored
                on your account and in the offline centre.
              </p>
              <Link to={createPageUrl("Dashboard")} className="pr-link" style={{ display: "inline-block", marginTop: 10 }}>
                See my library →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {crossRef ? (
        <FloatingVerse
          reference={`${getBookByNumber(crossRef.book)?.name || "Passage"} ${crossRef.chapter}:${crossRef.verse}`}
          verseText={crossRef.text}
          onClose={() => setCrossRef(null)}
          chapterUrl={`?book=${crossRef.book}&chapter=${crossRef.chapter}&verse=${crossRef.verse}`}
        />
      ) : null}

      {toast ? <div className="pr-toast">{toast}</div> : null}
    </div>
  );
}