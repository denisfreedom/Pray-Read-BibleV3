import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fse2 } from "@/api/fse2Client";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useAuth } from "@/lib/AuthContext";
import { BIBLE_BOOKS, getBookByNumber } from "@/lib/bibleBooks";
import { fetchChapter } from "@/lib/bibleApi";
import { getCrossReferences } from "@/lib/crossRefs";
import { offline, markKey } from "@/lib/offlineDb";
import { logReadingActivity } from "@/lib/activity";
import { findPlanDay, recordReading } from "@/lib/readings";
import { fetchPublicCollection } from "@/lib/contentApi";
import { formatDateLabel } from "@/lib/reading";
import { getActiveVersionId, getVersionOrDefault } from "@/lib/versions";
import {
  annotationKey,
  loadLocalAnnotations,
  mergeAnnotations,
  removeAnnotation,
  saveAnnotation
} from "@/lib/studyAnnotations";
import { PRAYERS } from "@/lib/seedContent";
import { getChapterPrayer } from "@/lib/chapterStudy";
import VerseActionBar from "@/components/read/VerseActionBar";
import FloatingVerse from "@/components/read/FloatingVerse";
import PassageTabs from "@/components/read/PassageTabs";
import PassagePrayer, { matchesPassage } from "@/components/read/PassagePrayer";
import ChapterSidebar from "@/components/read/ChapterSidebar";
import VersionPicker from "@/components/read/VersionPicker";
import ShareSheet from "@/components/read/ShareSheet";
import StrongsText from "@/components/read/StrongsText";
import VersePopup from "@/components/read/VersePopup";
import Spinner from "@/components/common/Spinner";
import EmptyState from "@/components/common/EmptyState";
import { ArrowLeftIcon, ChevronLeftIcon, ChevronRightIcon, Volume2Icon, TypeIcon, ListIcon, BookmarkIcon, HighlighterIcon, NotebookPenIcon, CloudOffIcon, AlertCircleIcon, HeartHandshakeIcon, BookOpenIcon, CheckCircleIcon } from "lucide-react";

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

  const [searchParams] = useSearchParams();
  const params = searchParams;
  const bookNumber = Number(params.get("book")) || 19;
  const chapter = Math.max(1, Number(params.get("chapter")) || 1);
  const verseParam = Number(params.get("verse")) || 0;
  const book = getBookByNumber(bookNumber) || BIBLE_BOOKS[18];

  // The version carries the language, so the reader always knows which text
  // they are looking at and which text the other language sits beside.
  const [versionId, setVersionId] = useState(() => {
    const lang = params.get("lang");
    if (lang === "lu") return "luganda";
    if (lang === "en") return "kjv";
    return getActiveVersionId();
  });
  const version = useMemo(() => getVersionOrDefault(versionId), [versionId]);
  const language = version.language;
  const [fontScale, setFontScale] = useState(1);
  const [verses, setVerses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [offlineCopy, setOfflineCopy] = useState(false);
  const [selectedVerse, setSelectedVerse] = useState(null);
  const [prayerVerse, setPrayerVerse] = useState(null);
  const [readingSaved, setReadingSaved] = useState(false);
  const [readDate, setReadDate] = useState("");
  const [marks, setMarks] = useState([]);
  const [localMarks, setLocalMarks] = useState([]);
  const [crossRef, setCrossRef] = useState(null);
  const [reloadToken, setReloadToken] = useState(0);
  const [showChapterGrid, setShowChapterGrid] = useState(false);
  const [toast, setToast] = useState("");
  const [annotations, setAnnotations] = useState([]);
  const [popup, setPopup] = useState(null);
  const [companionVerses, setCompanionVerses] = useState([]);
  const [shareSections, setShareSections] = useState([]);
  const [shareOpen, setShareOpen] = useState(false);
  const [shareVerse, setShareVerse] = useState(null);
  const [hasStrongs, setHasStrongs] = useState(false);

  const { data: storedMarks } = useQuery({
    queryKey: ["studyMarks", email],
    queryFn: () => fse2.entities.StudyMark.list("-updated_date", 300),
    enabled: !!email
  });

  const { data: planRows = [] } = useQuery({
    queryKey: ["readingPlan"],
    queryFn: () => fetchPublicCollection("plan", { authenticated: !!email })
  });

  const { data: readingRows = [] } = useQuery({
    queryKey: ["readings", email],
    queryFn: () => fse2.entities.Reading.list("-updated_date", 300),
    enabled: !!email
  });

  // The marks the reader makes in the chapter sidebar are kept with the
  // book, so they are still there the next time the chapter is opened.
  const { data: serverAnnotations = [] } = useQuery({
    queryKey: ["studyAnnotations", email, book.number],
    queryFn: async () => {
      if (!email) return [];
      const rows = await fse2.entities.StudyAnnotation.list("-updated_date", 300);
      return (rows || []).filter(
        (row) => row.owner_email === email && Number(row.book_number) === Number(book.number)
      );
    },
    enabled: !!email
  });

  const { data: prayerRows = [] } = useQuery({
    queryKey: ["prayers"],
    queryFn: () => fetchPublicCollection("prayers", { authenticated: false })
  });

  useEffect(() => {
    let active = true;
    loadLocalAnnotations(book.number).then((local) => {
      if (!active) return;
      setAnnotations(mergeAnnotations(serverAnnotations, local));
    });
    return () => {
      active = false;
    };
  }, [serverAnnotations, book.number]);

  const handleAnnotate = useCallback(
    async (payload) => {
      const record = {
        owner_email: email,
        book_number: book.number,
        book: book.name,
        ...payload
      };
      const saved = await saveAnnotation(record);
      setAnnotations((prev) => mergeAnnotations([...prev, saved], []));
    },
    [email, book.number, book.name]
  );

  const handleRemove = useCallback(async (annotation) => {
    await removeAnnotation(annotation);
    const key = annotation.local_id || annotationKey(annotation);
    setAnnotations((prev) =>
      prev.filter((item) => (item.local_id || annotationKey(item)) !== key)
    );
  }, []);

  const handleOpenPassage = useCallback((passage) => {
    if (!passage) return;
    setPopup(passage);
  }, []);

  // The chapter in the other language is fetched the first time the reader
  // shares, so the share button can offer both texts at once.
  const loadCompanion = useCallback(async () => {
    if (companionVerses.length) return companionVerses;
    try {
      const data = await fetchChapter({
        bookNumber: book.number,
        bookName: book.name,
        chapter,
        language: language === "lu" ? "en" : "lu",
        version: language === "lu" ? "kjv" : "luganda"
      });
      const rows = data.verses || [];
      setCompanionVerses(rows);
      return rows;
    } catch {
      return [];
    }
  }, [book.number, book.name, chapter, language, companionVerses]);

  // Marks kept in the offline centre are loaded too, so a reader who is not
  // signed in still sees the highlights, bookmarks and notes they saved.
  useEffect(() => {
    let active = true;
    const loadLocal = async () => {
      const collected = [];
      const stores = [
        { store: "highlights", type: "highlight" },
        { store: "bookmarks", type: "bookmark" },
        { store: "notes", type: "note" }
      ];
      for (const entry of stores) {
        let rows = [];
        try {
          rows = (await offline.getAll(entry.store)) || [];
        } catch {
          rows = [];
        }
        rows
          .filter((row) => row && row.book_number === book.number && row.chapter === chapter)
          .forEach((row) => {
            collected.push({ ...row, mark_type: row.mark_type || entry.type, source: "offline" });
          });
      }
      if (!active) return;
      setLocalMarks(collected);
    };
    loadLocal();
    return () => {
      active = false;
    };
  }, [book.number, chapter]);

  useEffect(() => {
    const server = email
      ? (storedMarks || []).filter(
          (row) => row.owner_email === email && row.book_number === book.number && row.chapter === chapter
        )
      : [];
    const taken = new Set(server.map((row) => `${row.mark_type}:${row.verse}`));
    const merged = [...server];
    localMarks.forEach((row) => {
      const key = `${row.mark_type}:${row.verse}`;
      if (taken.has(key)) return;
      taken.add(key);
      merged.push(row);
    });
    setMarks(merged);
  }, [storedMarks, localMarks, email, book.number, chapter]);

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
          language,
          version: versionId
        });
        if (!active) return;
        setVerses(data.verses || []);
        setOfflineCopy(Boolean(data.stale));
        setHasStrongs(Boolean(data.strongs));
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
  }, [book.number, book.name, chapter, language, versionId, reloadToken]);

  useEffect(() => {
    if (!email) {
      setReadingSaved(false);
      setReadDate("");
      return;
    }
    const match = (readingRows || []).find(
      (row) =>
        row.owner_email === email &&
        String(row.book || "").toLowerCase() === String(book.name || "").toLowerCase() &&
        Number(row.chapter) === Number(chapter) &&
        row.status === "completed"
    );
    setReadingSaved(Boolean(match));
    setReadDate(match ? match.read_date || "" : "");
  }, [readingRows, email, book.name, chapter]);

  useEffect(() => {
    if (!email) return;
    logReadingActivity({
      email,
      type: "chapter_visit",
      book: book.name,
      bookNumber: book.number,
      chapter,
      language
    });
  }, [email, book.number, book.name, chapter, language]);

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

  const markStoreFor = (markType) => {
    if (markType === "highlight") return "highlights";
    if (markType === "bookmark") return "bookmarks";
    return "notes";
  };

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
    const key = markKey(book.number, chapter, verse, markType);
    try {
      if (email) {
        await fse2.entities.StudyMark.create(payload);
        await queryClient.invalidateQueries({ queryKey: ["studyMarks", email] });
      }
      await offline.put(markStoreFor(markType), key, payload);
      setLocalMarks((rows) => [
        ...rows.filter((row) => markKey(row.book_number, row.chapter, row.verse, row.mark_type) !== key),
        { ...payload, source: "offline" }
      ]);
      logReadingActivity({
        email,
        type: markType === "bookmark" ? "bookmark" : markType === "note" ? "note_saved" : "highlight",
        book: book.name,
        bookNumber: book.number,
        chapter,
        verse
      });
      setToast(markType === "highlight" ? "Highlight saved" : markType === "bookmark" ? "Bookmarked" : "Note saved");
    } catch (err) {
      setToast(err.message || "Could not save that.");
    }
    window.setTimeout(() => setToast(""), 1800);
  };

  const removeMark = async (existing, markType) => {
    if (existing.id) {
      fse2.entities.StudyMark.delete(existing.id).catch(() => {});
      queryClient.invalidateQueries({ queryKey: ["studyMarks", email] });
    }
    const key = markKey(book.number, chapter, existing.verse, markType);
    offline.remove(markStoreFor(markType), key).catch(() => {});
    setLocalMarks((rows) => rows.filter((row) => markKey(row.book_number, row.chapter, row.verse, row.mark_type) !== key));
    setMarks((rows) =>
      rows.filter((row) => !(row.mark_type === markType && row.verse === existing.verse))
    );
  };

  const toggleHighlight = (verse, color) => {
    const existing = marks.find((row) => row.mark_type === "highlight" && row.verse === verse);
    if (existing) {
      removeMark(existing, "highlight");
      return;
    }
    saveMark("highlight", verse, { color });
  };

  const toggleBookmark = (verse) => {
    const existing = marks.find((row) => row.mark_type === "bookmark" && row.verse === verse);
    if (existing) {
      removeMark(existing, "bookmark");
      return;
    }
    saveMark("bookmark", verse);
  };

  const noteFor = (verse) => {
    const mark = marks.find((row) => row.mark_type === "note" && row.verse === verse);
    return mark ? mark.note_text || "" : "";
  };

  const markAsRead = async () => {
    if (!email) {
      setToast("Sign in to keep your reading progress.");
      window.setTimeout(() => setToast(""), 2000);
      return;
    }
    const planDay = findPlanDay(planRows, book.name, chapter);
    const record = await recordReading({
      email,
      book: book.name,
      chapter,
      translation: language,
      planDay
    });
    if (record) {
      await queryClient.invalidateQueries({ queryKey: ["readings", email] });
      setToast(planDay ? `Marked as read. Plan day ${planDay} is complete.` : "Marked as read.");
    } else {
      setToast("Could not save that. Try again in a moment.");
    }
    window.setTimeout(() => setToast(""), 2200);
  };

  const goToChapter = (number) => {
    navigate(createPageUrl("Chapter") + `?book=${book.number}&chapter=${number}&lang=${language}`);
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
      navigate(createPageUrl("Chapter") + `?book=${nextBook.number}&chapter=1&lang=${language}`);
    }
  };

  const crossReferences = useMemo(() => getCrossReferences(book.number, chapter), [book.number, chapter]);
  const reference = `${book.name} ${chapter}`;
  const audioUrl = `https://www.wordproaudio.org/bibles/app/audio/1/${book.number}/${chapter}.mp3`;

  // The prayer that closes this chapter, used when the library has no prayer
  // for the verse the reader is on.
  const chapterPrayers = useMemo(
    () => getChapterPrayer(book, chapter, { prayers: prayerRows }),
    [book.number, chapter, prayerRows]
  );

  const prayerTextFor = (verseNumber) => {
    const source = (prayerRows || []).length ? prayerRows : PRAYERS;
    const match = (source || []).find((row) =>
      matchesPassage(row.scripture_ref, book.name, chapter, verseNumber)
    );
    if (!match) return "";
    return [match.title, match.body_en || match.body_lu || "", match.scripture_ref]
      .filter(Boolean)
      .join("\n");
  };

  // The share carries the verse in both languages, the prayer passage and the
  // cross references of the chapter.
  const handleShare = async (verseNumber) => {
    const verse = verses.find((row) => row.verse === verseNumber);
    if (!verse) return;
    setToast("Gathering the verse in both languages...");
    const companionRows = await loadCompanion();
    setToast("");
    const companion = companionRows.find((row) => row.verse === verseNumber);
    const english = language === "en" ? verse.text : companion ? companion.text : "";
    const luganda = language === "lu" ? verse.text : companion ? companion.text : "";
    const sections = [];
    if (english) sections.push({ label: `${reference} ${verseNumber} (English)`, text: english });
    if (luganda && luganda !== english) {
      sections.push({ label: `${reference} ${verseNumber} (Luganda)`, text: luganda });
    }
    const prayer = prayerTextFor(verseNumber);
    if (prayer) sections.push({ label: "Prayer passage", text: prayer });
    if (crossReferences.length) {
      const lines = crossReferences.map((row) => {
        const name = getBookByNumber(row.book)?.name || "Passage";
        return `${name} ${row.chapter}:${row.verse} - ${row.text}`;
      });
      sections.push({ label: "Cross-references", text: lines.join("\n") });
    }
    setShareSections(sections);
    setShareVerse(verseNumber);
    setShareOpen(true);
  };

  const handleCommentary = () => {
    const node = document.getElementById("chapter-commentary-panel");
    if (node) node.scrollIntoView({ behavior: "smooth", block: "center" });
    setToast("The commentary of this chapter is in the sidebar.");
    window.setTimeout(() => setToast(""), 2000);
  };

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
              <VersionPicker
                versionId={versionId}
                busy={loading}
                onChange={(id) => {
                  setVersionId(id);
                  setSelectedVerse(null);
                  setPrayerVerse(null);
                }}
              />
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
              <button
                type="button"
                className="pr-chip"
                style={{
                  cursor: "pointer",
                  background: readingSaved ? "var(--pr-emerald)" : undefined,
                  color: readingSaved ? "#fff" : undefined,
                  borderColor: readingSaved ? "var(--pr-emerald)" : undefined
                }}
                onClick={markAsRead}
              >
                <CheckCircleIcon className="h-4 w-4" />
                {readingSaved ? `Read on ${formatDateLabel(readDate)}` : "Mark as read"}
              </button>
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

          {version.strongs && !hasStrongs && !loading ? (
            <div className="pr-success" style={{ marginTop: 14 }}>
              The Strong's numbers are not available for this chapter right now, so the plain King James text is
              shown.
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

        <div className="pr-grid pr-chapter-grid" style={{ gap: 22 }}>
          <ChapterSidebar
            book={book}
            chapter={chapter}
            verses={verses}
            language={language}
            annotations={annotations}
            onAnnotate={handleAnnotate}
            onRemove={handleRemove}
            onOpenPassage={handleOpenPassage}
          />

          <div className="pr-card pr-card-pad">
            {loading ? (
              <Spinner label="Loading the passage" />
            ) : error ? (
              <EmptyState
                icon={AlertCircleIcon}
                title="This chapter could not be loaded"
                description={error}
                action={
                  <button
                    type="button"
                    className="pr-btn pr-btn-primary"
                    onClick={() => setReloadToken((value) => value + 1)}
                  >
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
                          onPrayer={(number) => setPrayerVerse((current) => (current === number ? null : number))}
                          onCommentary={handleCommentary}
                          onShare={handleShare}
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
                          <StrongsText text={verse.text} />
                        </span>
                      </button>
                      {prayerVerse === verse.verse ? (
                        <PassagePrayer
                          book={book.name}
                          chapter={chapter}
                          verse={verse.verse}
                          language={language}
                          annotations={annotations}
                          fallback={chapterPrayers[0] || null}
                          onAnnotate={handleAnnotate}
                          onRemove={handleRemove}
                          onOpenPassage={handleOpenPassage}
                          onClose={() => setPrayerVerse(null)}
                        />
                      ) : null}
                      {noteFor(verse.verse) ? (
                        <div
                          style={{
                            margin: "2px 0 12px",
                            padding: "10px 12px",
                            borderLeft: "3px solid var(--pr-gold)",
                            background: "var(--pr-ivory-soft)",
                            borderRadius: "0 8px 8px 0",
                            fontSize: "0.9rem",
                            color: "var(--pr-body)",
                            display: "flex",
                            gap: 8,
                            alignItems: "flex-start"
                          }}
                        >
                          <NotebookPenIcon className="h-4 w-4" style={{ flex: "0 0 auto", marginTop: 2 }} />
                          <span>{noteFor(verse.verse)}</span>
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="pr-grid pr-grid-3">
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

        <PassageTabs book={book} chapter={chapter} reference={reference} language={language} />
      </div>

      {crossRef ? (
        <FloatingVerse
          reference={`${getBookByNumber(crossRef.book)?.name || "Passage"} ${crossRef.chapter}:${crossRef.verse}`}
          verseText={crossRef.text}
          onClose={() => setCrossRef(null)}
          chapterUrl={`?book=${crossRef.book}&chapter=${crossRef.chapter}&verse=${crossRef.verse}&lang=${language}`}
        />
      ) : null}

      {popup ? (
        <VersePopup
          passage={popup}
          annotations={annotations}
          onAnnotate={handleAnnotate}
          onRemove={handleRemove}
          onClose={() => setPopup(null)}
        />
      ) : null}

      <ShareSheet
        open={shareOpen}
        title={shareVerse ? `Share ${reference} ${shareVerse}` : `Share ${reference}`}
        subtitle="The verse in both languages, the prayer passage and the cross references."
        sections={shareSections}
        url={`${window.location.origin}${createPageUrl("Chapter")}?book=${book.number}&chapter=${chapter}&verse=${shareVerse || ""}&lang=${language}`}
        onClose={() => setShareOpen(false)}
      />

      {toast ? <div className="pr-toast">{toast}</div> : null}
    </div>
  );
}