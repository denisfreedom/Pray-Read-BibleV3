import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fse2 } from "@/api/fse2Client";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useAuth } from "@/lib/AuthContext";
import { BIBLE_BOOKS, getBookByNumber } from "@/lib/bibleBooks";
import { fetchChapter } from "@/lib/bibleApi";
import { normalizeStrongCode } from "@/lib/strongs";
import { getCrossReferences } from "@/lib/crossRefs";
import { crossRefLabel, crossRefText, plainVerseText, verseShareText } from "@/lib/share";
import { offline, markKey } from "@/lib/offlineDb";
import { logReadingActivity } from "@/lib/activity";
import { findPlanDay, recordReading } from "@/lib/readings";
import { fetchPublicCollection } from "@/lib/contentApi";
import { formatDateLabel } from "@/lib/reading";
import { getActiveVersionId, getVersionOrDefault, VERSIONS } from "@/lib/versions";
import { usePlayer } from "@/lib/player";
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
import VerseCrossRefs from "@/components/read/VerseCrossRefs";
import {
  fetchChapterCrossRefs,
  fetchChapterPassages,
  groupCrossRefsByVerse,
  normaliseCrossRef,
  normalisePassage,
  pickChapterPassage,
  pickCrossRefsForVerse,
  pickPassageForVerse,
  pickPassagesForVerse
} from "@/lib/prayerPassages";
import PassageTabs from "@/components/read/PassageTabs";
import PassagePrayer, { matchesPassage } from "@/components/read/PassagePrayer";
import ChapterSidebar from "@/components/read/ChapterSidebar";
import ChapterResourcesPanel from "@/components/read/ChapterResourcesPanel";
import ChapterReaderPane from "@/components/read/ChapterReaderPane";
import ChapterClosingPrayer from "@/components/read/ChapterClosingPrayer";
import VersionPicker from "@/components/read/VersionPicker";
import ShareSheet from "@/components/read/ShareSheet";
import { strongsContent } from "@/components/read/StrongsText";
import StrongsPopup from "@/components/read/StrongsPopup";
import AnnotatedText from "@/components/read/AnnotatedText";
import { selectionInside } from "@/lib/textSelection";
import VersePopup from "@/components/read/VersePopup";
import Spinner from "@/components/common/Spinner";
import EmptyState from "@/components/common/EmptyState";
import { AlertCircleIcon, ArrowLeftIcon, BookOpenIcon, BookmarkIcon, CheckCircleIcon, ChevronLeftIcon, ChevronRightIcon, HeartHandshakeIcon, HighlighterIcon, Link2Icon, ListIcon, Loader2Icon, MoonIcon, NotebookPenIcon, PauseIcon, PlayIcon, Share2Icon, SunIcon, TypeIcon, Volume2Icon } from "lucide-react";

const HIGHLIGHT_COLORS = {
  yellow: "#fde68a",
  green: "#bbf7d0",
  pink: "#fbcfe8",
  blue: "#bfdbfe"
};

const STORAGE = {
  lang: "pr_bible_lang",
  theme: "pr_theme",
  font: "pr_font_size"
};

const readStore = (key, fallback) => {
  try {
    if (typeof window === "undefined" || !window.localStorage) return fallback;
    const value = window.localStorage.getItem(key);
    return value === null || value === "" ? fallback : value;
  } catch {
    return fallback;
  }
};

const writeStore = (key, value) => {
  try {
    if (typeof window === "undefined" || !window.localStorage) return;
    window.localStorage.setItem(key, value);
  } catch {
    /* the reader still works when the browser keeps the storage away */
  }
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
  const [versionId, setVersionId] = useState(() => {
    // A link can name the version it wants to open: ?version=kjvp
    const wanted = params.get("version");
    const known = wanted ? VERSIONS.find((record) => record.id === wanted) : null;
    if (known) return known.id;
    const lang = params.get("lang");
    if (lang === "lu") return "luganda";
    if (lang === "en") return "kjv";
    return getActiveVersionId();
  });
  const version = useMemo(() => getVersionOrDefault(versionId), [versionId]);
  const language = version.language;
  const [langMode, setLangMode] = useState(() => {
    // The address of the chapter wins: a chapter opened in Luganda always
    // opens in Luganda, whatever the reader used the last time.
    const lang = params.get("lang");
    if (lang === "lu") return "lu";
    if (lang === "en") return "en";
    const stored = readStore(STORAGE.lang, "");
    if (stored === "en" || stored === "lu" || stored === "both") return stored;
    return versionId === "luganda" ? "lu" : "en";
  });
  const [theme, setTheme] = useState(() => {
    const stored = readStore(STORAGE.theme, "");
    if (stored === "light" || stored === "dark") return stored;
    if (typeof window !== "undefined" && window.matchMedia) {
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return "light";
  });
  const [fontScale, setFontScale] = useState(() => {
    const stored = Number(readStore(STORAGE.font, ""));
    return stored >= 0.85 && stored <= 1.6 ? stored : 1;
  });
  const [verses, setVerses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedVerse, setSelectedVerse] = useState(null);
  // The prayer passage and the cross-references of a verse stay closed
  // until the reader asks for them, and only one of them is open at a time.
  const [openPanel, setOpenPanel] = useState(null);
  const [readingSaved, setReadingSaved] = useState(false);
  const [readDate, setReadDate] = useState("");
  const [marks, setMarks] = useState([]);
  const [localMarks, setLocalMarks] = useState([]);
  const [reloadToken, setReloadToken] = useState(0);
  const [showChapterGrid, setShowChapterGrid] = useState(false);
  const [toast, setToast] = useState("");
  const [annotations, setAnnotations] = useState([]);
  const [popup, setPopup] = useState(null);
  const [companionVerses, setCompanionVerses] = useState([]);
  // The other language is kept with the chapter it belongs to, so the text
  // of the last chapter is never shown beside the verses of a new one.
  const [companionKey, setCompanionKey] = useState("");
  const [shareSections, setShareSections] = useState([]);
  const [shareText, setShareText] = useState("");
  const [shareOpen, setShareOpen] = useState(false);
  const [shareVerse, setShareVerse] = useState(null);
  const [shareTitle, setShareTitle] = useState("");
  const [shareSubtitle, setShareSubtitle] = useState("");
  const [hasStrongs, setHasStrongs] = useState(false);
  // A link can open the definition of a word straight away: ?strong=G2424
  const [strongCode, setStrongCode] = useState(() => normalizeStrongCode(params.get("strong")));
  const [strongWord, setStrongWord] = useState("");

  // A blue Strong's number opens the definition of the word it belongs to.
  const handleStrongClick = useCallback((code, word) => {
    setStrongCode(code);
    setStrongWord(word || "");
  }, []);
  const [panelTab, setPanelTab] = useState("study");
  const [panelOpen, setPanelOpen] = useState(false);
  const [studySection, setStudySection] = useState("intro");
  const [wideScreen, setWideScreen] = useState(
    () => typeof window === "undefined" || !window.matchMedia || window.matchMedia("(min-width: 1024px)").matches
  );

  const { current, playing, playQueue, toggle } = usePlayer();

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
  const { data: serverAnnotations = [] } = useQuery({
    queryKey: ["studyAnnotations", email, book.number],
    queryFn: async () => {
      if (!email) return [];
      const rows = await fse2.entities.StudyAnnotation.list("-updated_date", 300);
      return (rows || []).filter((row) => row.owner_email === email && Number(row.book_number) === Number(book.number));
    },
    enabled: !!email
  });
  const { data: prayerRows = [] } = useQuery({
    queryKey: ["prayers"],
    queryFn: () => fetchPublicCollection("prayers", { authenticated: false })
  });
  // The prayer passages and the cross-references that were imported for
  // this chapter. They are read from the app and kept on the device, so the
  // reader finds them in flight mode as well.
  const { data: passageRows = [] } = useQuery({
    queryKey: ["chapterPassages", book.number, chapter],
    queryFn: () => fetchChapterPassages(book.number, chapter)
  });
  const { data: crossRefRows = [] } = useQuery({
    queryKey: ["chapterCrossRefs", book.number, chapter],
    queryFn: () => fetchChapterCrossRefs(book.number, chapter)
  });

  useEffect(() => {
    writeStore(STORAGE.lang, langMode);
  }, [langMode]);

  // A link can name the version it wants to open, so the reader lands on
  // that version even when the chapter is already open in another one.
  const urlVersion = params.get("version");
  useEffect(() => {
    if (!urlVersion) return;
    const known = VERSIONS.find((record) => record.id === urlVersion);
    if (known) setVersionId((current) => (current === known.id ? current : known.id));
  }, [urlVersion]);

  useEffect(() => {
    writeStore(STORAGE.theme, theme);
  }, [theme]);

  useEffect(() => {
    writeStore(STORAGE.font, String(fontScale));
  }, [fontScale]);

  useEffect(() => {
    let active = true;
    loadLocalAnnotations(book.number).then((local) => {
      if (active) setAnnotations(mergeAnnotations(serverAnnotations, local));
    });
    return () => { active = false; };
  }, [serverAnnotations, book.number]);

  const handleAnnotate = useCallback(async (payload) => {
    const record = { owner_email: email, book_number: book.number, book: book.name, ...payload };
    const saved = await saveAnnotation(record);
    setAnnotations((prev) => mergeAnnotations([...prev, saved], []));
  }, [email, book.number, book.name]);

  const handleRemove = useCallback(async (annotation) => {
    await removeAnnotation(annotation);
    const key = annotation.local_id || annotationKey(annotation);
    setAnnotations((prev) => prev.filter((item) => (item.local_id || annotationKey(item)) !== key));
  }, []);

  const handleOpenPassage = useCallback((passage) => {
    if (passage) setPopup(passage);
  }, []);

  const loadCompanion = useCallback(async () => {
    const wanted = language === "lu" ? "en" : "lu";
    const wantedKey = `${book.number}:${chapter}:${wanted}`;
    if (companionVerses.length && companionKey === wantedKey) return companionVerses;
    try {
      const data = await fetchChapter({
        bookNumber: book.number,
        bookName: book.name,
        chapter,
        language: wanted,
        version: language === "lu" ? "kjv" : "luganda"
      });
      const rows = data.verses || [];
      setCompanionVerses(rows);
      setCompanionKey(wantedKey);
      return rows;
    } catch {
      return [];
    }
  }, [book.number, book.name, chapter, language, companionVerses, companionKey]);

  // The other language of this chapter. It is only fetched when the reader
  // asks for it, and it is cached on the device with the chapter.
  useEffect(() => {
    let active = true;
    const wantsLuganda = language === "en" && langMode !== "en";
    const wantsEnglish = language === "lu" && langMode !== "lu";
    if (!wantsLuganda && !wantsEnglish) {
      setCompanionVerses([]);
      setCompanionKey("");
      return undefined;
    }
    const wanted = wantsLuganda ? "lu" : "en";
    const wantedKey = `${book.number}:${chapter}:${wanted}`;
    fetchChapter({
      bookNumber: book.number,
      bookName: book.name,
      chapter,
      language: wanted,
      version: wanted === "lu" ? "luganda" : "kjv"
    })
      .then((data) => {
        if (!active) return;
        setCompanionVerses(data.verses || []);
        setCompanionKey(wantedKey);
      })
      .catch(() => {
        if (!active) return;
        setCompanionVerses([]);
        setCompanionKey(wantedKey);
      });
    return () => { active = false; };
  }, [book.number, book.name, chapter, language, langMode]);

  useEffect(() => {
    let active = true;
    const loadLocal = async () => {
      const collected = [];
      const stores = [{ store: "highlights", type: "highlight" }, { store: "bookmarks", type: "bookmark" }, { store: "notes", type: "note" }];
      for (const entry of stores) {
        let rows = [];
        try { rows = (await offline.getAll(entry.store)) || []; } catch { rows = []; }
        rows.filter((row) => row && row.book_number === book.number && row.chapter === chapter)
          .forEach((row) => collected.push({ ...row, mark_type: row.mark_type || entry.type, source: "offline" }));
      }
      if (active) setLocalMarks(collected);
    };
    loadLocal();
    return () => { active = false; };
  }, [book.number, chapter]);

  useEffect(() => {
    const server = email ? (storedMarks || []).filter((row) => row.owner_email === email && row.book_number === book.number && row.chapter === chapter) : [];
    const taken = new Set(server.map((row) => `${row.mark_type}:${row.verse}`));
    const merged = [...server];
    localMarks.forEach((row) => {
      const key = `${row.mark_type}:${row.verse}`;
      if (!taken.has(key)) { taken.add(key); merged.push(row); }
    });
    setMarks(merged);
  }, [storedMarks, localMarks, email, book.number, chapter]);

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await fetchChapter({ bookNumber: book.number, bookName: book.name, chapter, language, version: versionId });
        if (!active) return;
        setVerses(data.verses || []);
        setHasStrongs(Boolean(data.strongs));
        if (data.refresh && typeof data.refresh.then === "function") {
          // The fresher text keeps the Strong's state in step with the verses,
          // so the marked words never lose their numbers between two readings.
          data.refresh
            .then((fresh) => {
              if (!active || !fresh || !fresh.verses) return;
              setVerses(fresh.verses);
              setHasStrongs(Boolean(fresh.strongs));
            })
            .catch(() => {});
        }
      } catch (err) {
        if (!active) return;
        // The verses that are already on the screen stay there: a chapter
        // that cannot be reached must never empty the page.
        setError(err.message || "Could not load this chapter.");
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => { active = false; };
  }, [book.number, book.name, chapter, language, versionId, reloadToken]);

  useEffect(() => {
    if (!email) { setReadingSaved(false); setReadDate(""); return; }
    const match = (readingRows || []).find((row) => row.owner_email === email && String(row.book || "").toLowerCase() === String(book.name || "").toLowerCase() && Number(row.chapter) === Number(chapter) && row.status === "completed");
    setReadingSaved(Boolean(match));
    setReadDate(match ? match.read_date || "" : "");
  }, [readingRows, email, book.name, chapter]);

  useEffect(() => {
    if (email) logReadingActivity({ email, type: "chapter_visit", book: book.name, bookNumber: book.number, chapter, language });
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

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return undefined;
    const query = window.matchMedia("(min-width: 1024px)");
    const handle = (event) => setWideScreen(event.matches);
    setWideScreen(query.matches);
    if (query.addEventListener) { query.addEventListener("change", handle); return () => query.removeEventListener("change", handle); }
    query.addListener(handle);
    return () => query.removeListener(handle);
  }, []);

  const selectPanelTab = (tab) => { setPanelTab(tab); if (!wideScreen) setPanelOpen(true); };
  // Opening a study section from the menu always brings the study panel back
  // and shows the section the reader picked.
  const selectStudySection = (key) => {
    setPanelTab("study");
    setStudySection(key);
    if (!wideScreen) setPanelOpen(true);
  };
  const highlightFor = (verse) => {
    const mark = marks.find((row) => row.mark_type === "highlight" && row.verse === verse);
    return mark ? HIGHLIGHT_COLORS[mark.color] || HIGHLIGHT_COLORS.yellow : null;
  };
  const isBookmarked = (verse) => marks.some((row) => row.mark_type === "bookmark" && row.verse === verse);
  const markStoreFor = (markType) => markType === "highlight" ? "highlights" : markType === "bookmark" ? "bookmarks" : "notes";

  const saveMark = async (markType, verse, extra = {}) => {
    const payload = { owner_email: email, mark_type: markType, book_number: book.number, book: book.name, chapter, verse, ...extra };
    const key = markKey(book.number, chapter, verse, markType);
    try {
      if (email) { await fse2.entities.StudyMark.create(payload); await queryClient.invalidateQueries({ queryKey: ["studyMarks", email] }); }
      await offline.put(markStoreFor(markType), key, payload);
      setLocalMarks((rows) => [...rows.filter((row) => markKey(row.book_number, row.chapter, row.verse, row.mark_type) !== key), { ...payload, source: "offline" }]);
      logReadingActivity({ email, type: markType === "bookmark" ? "bookmark" : markType === "note" ? "note_saved" : "highlight", book: book.name, bookNumber: book.number, chapter, verse });
      setToast(markType === "highlight" ? "Highlight saved" : markType === "bookmark" ? "Bookmarked" : "Note saved");
    } catch (err) { setToast(err.message || "Could not save that."); }
    window.setTimeout(() => setToast(""), 1800);
  };

  const removeMark = async (existing, markType) => {
    if (existing.id) { fse2.entities.StudyMark.delete(existing.id).catch(() => {}); queryClient.invalidateQueries({ queryKey: ["studyMarks", email] }); }
    const key = markKey(book.number, chapter, existing.verse, markType);
    offline.remove(markStoreFor(markType), key).catch(() => {});
    setLocalMarks((rows) => rows.filter((row) => markKey(row.book_number, row.chapter, row.verse, row.mark_type) !== key));
    setMarks((rows) => rows.filter((row) => !(row.mark_type === markType && row.verse === existing.verse)));
  };
  const toggleHighlight = (verse, color) => {
    const existing = marks.find((row) => row.mark_type === "highlight" && row.verse === verse);
    if (existing) { removeMark(existing, "highlight"); return; }
    saveMark("highlight", verse, { color });
  };
  const toggleBookmark = (verse) => {
    const existing = marks.find((row) => row.mark_type === "bookmark" && row.verse === verse);
    if (existing) { removeMark(existing, "bookmark"); return; }
    saveMark("bookmark", verse);
  };
  const noteFor = (verse) => {
    const mark = marks.find((row) => row.mark_type === "note" && row.verse === verse);
    return mark ? mark.note_text || "" : "";
  };

  const markAsRead = async () => {
    if (!email) { setToast("Sign in to keep your reading progress."); window.setTimeout(() => setToast(""), 2000); return; }
    if (readingSaved) {
      const match = (readingRows || []).find((row) => row.owner_email === email && String(row.book || "").toLowerCase() === String(book.name || "").toLowerCase() && Number(row.chapter) === Number(chapter) && row.status === "completed");
      if (match && match.id) {
        try {
          await fse2.entities.Reading.delete(match.id);
          await queryClient.invalidateQueries({ queryKey: ["readings", email] });
          setToast("Marked as not read.");
        } catch {
          setToast("Could not update that. Try again in a moment.");
        }
        window.setTimeout(() => setToast(""), 2200);
        return;
      }
    }
    const planDay = findPlanDay(planRows, book.name, chapter);
    const record = await recordReading({ email, book: book.name, chapter, translation: language, planDay });
    if (record) { await queryClient.invalidateQueries({ queryKey: ["readings", email] }); setToast(planDay ? `Marked as read. Plan day ${planDay} is complete.` : "Marked as read."); }
    else setToast("Could not save that. Try again in a moment.");
    window.setTimeout(() => setToast(""), 2200);
  };

  // The version travels with the reader, so moving to the next chapter
  // never drops the Strong's numbers of the KJV+.
  const goToChapter = (number) =>
    navigate(
      createPageUrl("Chapter") + `?book=${book.number}&chapter=${number}&lang=${language}&version=${versionId}`
    );
  // Opens the verse a cross-reference points at.
  const handleOpenCrossRef = useCallback((row) => {
    if (!row) return;
    navigate(
      createPageUrl("Chapter") +
        `?book=${row.ref_book_number}&chapter=${row.ref_chapter}&verse=${row.ref_verse}&lang=${language}&version=${versionId}`
    );
  }, [language, versionId, navigate]);

  // The prayer passage and the cross-references of a verse stand under the
  // verse itself, so the reader is taken to them instead of to a panel that
  // covers the text of the chapter.
  const scrollToVerseBlock = useCallback((verseNumber, kind) => {
    window.setTimeout(() => {
      const node = document.getElementById(`${kind}-block-${book.number}-${chapter}-${verseNumber}`);
      if (!node) return;
      node.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 90);
  }, [book.number, chapter]);

  // Opens the prayer passage or the cross-references of a verse. Opening
  // one closes the other, so the reader never has two panels open at once.
  const togglePanel = useCallback((verseNumber, kind) => {
    setOpenPanel((current) =>
      current && current.verse === verseNumber && current.kind === kind
        ? null
        : { verse: verseNumber, kind }
    );
  }, []);

  const openPanelFor = useCallback(
    (verseNumber, kind) => {
      togglePanel(verseNumber, kind);
      scrollToVerseBlock(verseNumber, kind);
    },
    [togglePanel, scrollToVerseBlock]
  );

  const stepChapter = useCallback((delta) => {
    const target = chapter + delta;
    if (target < 1) return;
    if (target <= book.chapters) { goToChapter(target); return; }
    const index = BIBLE_BOOKS.findIndex((item) => item.number === book.number);
    const nextBook = BIBLE_BOOKS.find((item, position) => position === index + 1);
    if (nextBook) navigate(createPageUrl("Chapter") + `?book=${nextBook.number}&chapter=1&lang=${language}&version=${versionId}`);
  }, [chapter, book.chapters, book.number, language, navigate]);

  // The left and right arrows move through the chapters when the reader is
  // not typing and the chapter grid is closed.
  useEffect(() => {
    const onKey = (event) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const tag = (event.target && event.target.tagName) || "";
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (showChapterGrid) return;
      event.preventDefault();
      stepChapter(event.key === "ArrowRight" ? 1 : -1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showChapterGrid, stepChapter]);

  const crossReferences = useMemo(() => getCrossReferences(book.number, chapter), [book.number, chapter]);
  const reference = `${book.name} ${chapter}`;

  // The prayer passages that were imported for this chapter.
  const chapterPassages = useMemo(
    () => (passageRows || []).map((row) => normalisePassage(row)),
    [passageRows]
  );

  // The cross-references of this chapter: the ones that were imported for
  // it, and the ones the app already carried.
  const allCrossRefs = useMemo(() => {
    const list = [];
    const seen = new Set();
    (crossRefRows || []).forEach((row) => {
      const item = normaliseCrossRef(row);
      const key = `${item.verse}:${item.ref_book_number}:${item.ref_chapter}:${item.ref_verse}`;
      if (seen.has(key)) return;
      seen.add(key);
      list.push(item);
    });
    (crossReferences || []).forEach((row) => {
      list.push({
        id: `curated-${row.book}-${row.chapter}-${row.verse}`,
        verse: 0,
        ref_book_number: Number(row.book),
        ref_chapter: Number(row.chapter),
        ref_verse: Number(row.verse),
        ref_text_en: String(row.text || ""),
        ref_text_lu: "",
        note_en: "",
        note_lu: ""
      });
    });
    return list;
  }, [crossRefRows, crossReferences]);

  const crossRefGroups = useMemo(() => groupCrossRefsByVerse(allCrossRefs), [allCrossRefs]);
  const crossRefsForVerse = (verseNumber) => pickCrossRefsForVerse(allCrossRefs, verseNumber);
  const passageForVerse = (verseNumber) => pickPassageForVerse(chapterPassages, verseNumber);
  // The marks the reader has made on one block of text.
  const annotationsFor = (blockId) =>
    annotations.filter((annotation) => annotation.block_id === blockId);
  // Every prayer passage written for a verse, so the reader sees the prayer
  // of the verse they are on without opening anything.
  const passagesForVerse = (verseNumber) => pickPassagesForVerse(chapterPassages, verseNumber);
  const chapterPassage = useMemo(() => pickChapterPassage(chapterPassages), [chapterPassages]);
  const audioUrl = `https://www.wordproaudio.org/bibles/app/audio/1/${book.number}/${chapter}.mp3`;
  const chapterTrack = useMemo(() => {
    const track = {
      audioUrl,
      title: `${book.name} ${chapter}`,
      series: version.short,
      verseRef: `${book.name} ${chapter}:1`,
      kind: "chapter"
    };
    return { ...track, playlist: [track] };
  }, [audioUrl, book.name, chapter, version.short]);
  const chapterIsLoaded = Boolean(current && current.audioUrl === audioUrl);
  const chapterIsPlaying = chapterIsLoaded && playing;

  const handleListen = () => {
    if (chapterIsLoaded) { toggle(); return; }
    playQueue([chapterTrack], 0);
  };

  // The audio of a chapter never carries over into the next chapter.
  useEffect(() => {
    if (current && current.kind === "chapter" && current.audioUrl !== audioUrl && playing) toggle();
  }, [book.number, chapter]);

  const chapterPrayers = useMemo(
    () => getChapterPrayer(book, chapter, { prayers: [...prayerRows, ...PRAYERS] }),
    [book.number, chapter, prayerRows]
  );
  const closingPrayer = useMemo(() => {
    // The prayer that was imported for the whole chapter comes first, so
    // the chapter is never closed with the general prayer.
    if (chapterPassage) {
      return {
        title: chapterPassage.title_en || `Closing prayer for ${book.name} ${chapter}`,
        titleLu: chapterPassage.title_lu || "",
        body: chapterPassage.prayer_en || "",
        bodyLu: chapterPassage.prayer_lu || "",
        ref: chapterPassage.scripture_ref || `${book.name} ${chapter}`
      };
    }
    const prayer = chapterPrayers[0];
    if (prayer) return prayer;
    return {
      title: `Closing prayer for ${book.name} ${chapter}`,
      titleLu: "",
      body: `Father, thank You for Your Word. Let ${book.name} ${chapter} take root in my heart and show me how to live it today, in Jesus' name, Amen.`,
      bodyLu: "",
      ref: `${book.name} ${chapter}:1`
    };
  }, [chapterPassage, chapterPrayers, book.name, chapter]);

  const prayerTextFor = (verseNumber) => {
    // The prayer that was imported for the verse, in both languages.
    const passage = passageForVerse(verseNumber);
    if (passage) {
      return {
        en: [passage.title_en || "", passage.prayer_en || ""].filter(Boolean).join("\n"),
        lu: [passage.title_lu || "", passage.prayer_lu || ""].filter(Boolean).join("\n")
      };
    }
    const source = (prayerRows || []).length ? prayerRows : PRAYERS;
    const match = source.find((row) => matchesPassage(row.scripture_ref, book.name, chapter, verseNumber));
    if (!match) return { en: "", lu: "" };
    return {
      en: [match.title, match.body_en || ""].filter(Boolean).join("\n"),
      lu: [match.title_lu || match.title || "", match.body_lu || ""].filter(Boolean).join("\n")
    };
  };

  const readChapters = useMemo(() => {
    const set = new Set();
    if (!email) return set;
    (readingRows || []).forEach((row) => {
      if (!row || row.status !== "completed") return;
      if (String(row.book || "").trim().toLowerCase() !== String(book.name || "").trim().toLowerCase()) return;
      set.add(Number(row.chapter));
    });
    return set;
  }, [readingRows, email, book.name]);

  const shareUrlFor = (verseNumber) =>
    `${window.location.origin}${createPageUrl("Chapter")}?book=${book.number}&chapter=${chapter}&verse=${verseNumber}&lang=${language}&version=${versionId}`;

  const shareUrl = `${window.location.origin}${createPageUrl("Chapter")}?book=${book.number}&chapter=${chapter}${shareVerse ? `&verse=${shareVerse}` : ""}&lang=${language}&version=${versionId}`;

  const handleShare = async (verseNumber) => {
    const verse = verses.find((row) => row.verse === verseNumber);
    if (!verse) return;
    setToast("Gathering the verse in both languages...");
    const companionRows = await loadCompanion();
    const companion = companionRows.find((row) => row.verse === verseNumber);
    const english = plainVerseText(language === "en" ? verse.text : companion ? companion.text : "");
    const luganda = plainVerseText(language === "lu" ? verse.text : companion ? companion.text : "");
    // The prayer that belongs to the verse, in both languages.
    const passage = passageForVerse(verseNumber);
    const prayer = prayerTextFor(verseNumber);
    const prayerEn = passage ? passage.prayer_en || "" : prayer.en || "";
    const prayerLu = passage ? passage.prayer_lu || "" : prayer.lu || "";
    // The cross-references of the verse, with the text of the verse they
    // point at, so the scripture is shared in full.
    setToast("Gathering the cross references...");
    const verseRefs = crossRefsForVerse(verseNumber);
    const crossRefs = [];
    for (const row of verseRefs) {
      crossRefs.push({ label: crossRefLabel(row), text: await crossRefText(row) });
    }
    if (!verseRefs.length && crossReferences.length) {
      crossReferences.forEach((row) => {
        crossRefs.push({
          label: `${getBookByNumber(row.book)?.name || "Passage"} ${row.chapter}:${row.verse}`,
          text: row.text || ""
        });
      });
    }
    setToast("");
    const text = verseShareText({
      reference: `${reference}:${verseNumber}`,
      english,
      luganda,
      prayerEn,
      prayerLu,
      crossRefs: crossRefs.filter((row) => row.label || row.text),
      url: shareUrlFor(verseNumber)
    });
    setShareText(text);
    setShareSections([]);
    setShareVerse(verseNumber);
    setShareTitle(`Share ${reference}:${verseNumber}`);
    setShareSubtitle("The verse in both languages, the prayer passage and the cross references in full.");
    setShareOpen(true);
  };

  const handleShareChapter = () => {
    const opening = verses.slice(0, 2).map((row) => `${row.verse}. ${row.text}`).join(" ");
    const excerpt = opening.length > 300 ? `${opening.slice(0, 297).trim()}…` : opening;
    setShareSections([{ label: `${reference} (${version.short})`, text: excerpt }]);
    setShareText("");
    setShareVerse(null);
    setShareTitle(`Share ${reference}`);
    setShareSubtitle("The opening of the chapter and the link to read it all.");
    setShareOpen(true);
  };

  const handleSharePrayer = (prayer) => {
    const clip = (value) => (value.length > 500 ? `${value.slice(0, 497).trim()}…` : value);
    const english = String(prayer.body || "");
    const luganda = String(prayer.bodyLu || "");
    const sections = [];
    if (english) {
      sections.push({ label: `${prayer.title}${prayer.ref ? `  -  ${prayer.ref}` : ""}`, text: clip(english) });
    }
    if (luganda && luganda !== english) {
      const title = prayer.titleLu || prayer.title;
      sections.push({ label: `${title}${prayer.ref ? `  -  ${prayer.ref}` : ""}`, text: clip(luganda) });
    }
    setShareSections(sections);
    setShareText("");
    setShareVerse(1);
    setShareTitle("Share the closing prayer");
    setShareSubtitle("The prayer of this chapter, so someone else can pray it with you.");
    setShareOpen(true);
  };

  const handleCommentary = () => {
    selectStudySection("commentary");
    setToast("The commentary of this chapter is in the panel beside the verses.");
    window.setTimeout(() => setToast(""), 2200);
  };

  const handleVersionChange = (id) => {
    setVersionId(id);
    setSelectedVerse(null);
    setOpenPanel(null);
    setHasStrongs(false);
    if (id === "luganda") {
      if (langMode === "en") setLangMode("lu");
      return;
    }
    if (langMode === "lu") setLangMode("en");
  };

  const showEnglish = langMode === "en" || langMode === "both";
  const showLuganda = langMode === "lu" || langMode === "both";
  const displayLanguage = langMode === "lu" ? "lu" : "en";

  // The other language is only used when it belongs to the chapter that is
  // on the screen, so the text of the last chapter is never shown beside
  // the verses of a new one.
  const wantedCompanion = language === "en" ? "lu" : "en";
  const companionMap = useMemo(() => {
    const map = new Map();
    if (companionKey !== `${book.number}:${chapter}:${wantedCompanion}`) return map;
    (companionVerses || []).forEach((row) => map.set(Number(row.verse), row.text || ""));
    return map;
  }, [companionVerses, companionKey, book.number, chapter, wantedCompanion]);

  const textFor = (verse) => {
    if (language === "en") {
      return { english: verse.text || "", luganda: companionMap.get(Number(verse.verse)) || "" };
    }
    return { english: companionMap.get(Number(verse.verse)) || "", luganda: verse.text || "" };
  };

  const prayAgain = () => {
    selectStudySection("prayer");
    setPanelOpen(true);
    window.setTimeout(() => {
      const node = document.getElementById("chapter-prayer-panel");
      if (node) node.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 120);
  };

  return (
    <div className="pr-chapter-page" data-pr-theme={theme} style={{ "--pr-verse-scale": fontScale }}>
      <section className="pr-chapter-hero">
        <div className="pr-container">
          <div className="pr-chapter-hero-top">
            <div className="pr-chapter-hero-pills">
              <Link to={createPageUrl("BibleReader")} className="pr-chapter-hero-pill">
                <ArrowLeftIcon className="h-4 w-4" aria-hidden="true" />
                Back to books
              </Link>
              <Link to={createPageUrl("Home")} className="pr-chapter-hero-pill">
                <ArrowLeftIcon className="h-4 w-4" aria-hidden="true" />
                Home
              </Link>
            </div>
            <span className="pr-chapter-hero-pill is-soft">
              <BookOpenIcon className="h-4 w-4" aria-hidden="true" />
              Bible Reader
            </span>
          </div>
          <h1 className="pr-chapter-hero-title">
            {book.name} {chapter}
          </h1>
          <p className="pr-chapter-hero-sub">
            {book.luganda ? `${book.luganda} · ` : ""}
            {verses.length} {verses.length === 1 ? "verse" : "verses"}
          </p>
        </div>
      </section>

      <div className="pr-container pr-chapter-shell">
        <div className="pr-card pr-chapter-controls">
          <div className="pr-chapter-controls-row">
            <div className="pr-chapter-controls-left">
              <button type="button" className="pr-icon-btn" onClick={() => stepChapter(-1)} aria-label="Previous chapter">
                <ChevronLeftIcon className="h-4 w-4" />
              </button>
              <button
                type="button"
                className="pr-chip"
                style={{ cursor: "pointer" }}
                aria-expanded={showChapterGrid}
                onClick={() => setShowChapterGrid((value) => !value)}
              >
                <ListIcon className="h-4 w-4" />
                Chapter {chapter}
              </button>
              <button type="button" className="pr-icon-btn" onClick={() => stepChapter(1)} aria-label="Next chapter">
                <ChevronRightIcon className="h-4 w-4" />
              </button>
            </div>

            <div className="pr-chapter-controls-right">
              <VersionPicker versionId={versionId} busy={loading} onChange={handleVersionChange} />

              <div className="pr-lang-toggle" role="group" aria-label="Language of the verses">
                {[{ id: "en", label: "EN" }, { id: "lu", label: "LU" }, { id: "both", label: "BOTH" }].map((entry) => (
                  <button
                    key={entry.id}
                    type="button"
                    className={`pr-lang-btn${langMode === entry.id ? " is-active" : ""}`}
                    aria-pressed={langMode === entry.id}
                    onClick={() => setLangMode(entry.id)}
                  >
                    {entry.label}
                  </button>
                ))}
              </div>

              <button type="button" className="pr-chip" style={{ cursor: "pointer" }} onClick={() => setFontScale((value) => Math.max(0.85, value - 0.1))} aria-label="Decrease font size">
                <TypeIcon className="h-4 w-4" /> A-
              </button>
              <button type="button" className="pr-chip" style={{ cursor: "pointer" }} onClick={() => setFontScale((value) => Math.min(1.6, value + 0.1))} aria-label="Increase font size">
                <TypeIcon className="h-4 w-4" /> A+
              </button>

              <button
                type="button"
                className="pr-chip"
                style={{ cursor: "pointer", background: chapterIsPlaying ? "var(--pr-emerald)" : undefined, color: chapterIsPlaying ? "#fff" : undefined, borderColor: chapterIsPlaying ? "var(--pr-emerald)" : undefined }}
                onClick={handleListen}
                aria-label={chapterIsPlaying ? "Pause the chapter audio" : "Listen to this chapter"}
              >
                {chapterIsPlaying ? <PauseIcon className="h-4 w-4" /> : <PlayIcon className="h-4 w-4" />}
                {chapterIsPlaying ? "Pause" : "Listen"}
              </button>

              <button
                type="button"
                className="pr-chip"
                style={{ cursor: "pointer", background: readingSaved ? "var(--pr-emerald)" : undefined, color: readingSaved ? "#fff" : undefined, borderColor: readingSaved ? "var(--pr-emerald)" : undefined }}
                onClick={markAsRead}
                title={readingSaved ? `Read on ${formatDateLabel(readDate)}` : "Mark this chapter as read"}
              >
                <CheckCircleIcon className="h-4 w-4" />
                {readingSaved ? "Read" : "Mark as read"}
              </button>

              <button type="button" className="pr-chip" style={{ cursor: "pointer" }} onClick={handleShareChapter}>
                <Share2Icon className="h-4 w-4" />
                Share
              </button>

              <button
                type="button"
                className="pr-icon-btn"
                onClick={() => setTheme((value) => (value === "dark" ? "light" : "dark"))}
                aria-label={theme === "dark" ? "Switch to the light theme" : "Switch to the dark theme"}
                title={theme === "dark" ? "Light theme" : "Dark theme"}
              >
                {theme === "dark" ? <SunIcon className="h-4 w-4" /> : <MoonIcon className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {showChapterGrid ? (
            <div className="pr-chapter-gridpanel">
              <div className="pr-chap-grid">
                {Array.from({ length: book.chapters }, (_, index) => index + 1).map((number) => (
                  <button
                    key={number}
                    type="button"
                    className={`pr-chap-chip${number === chapter ? " is-selected" : ""}${readChapters.has(number) ? " is-read" : ""}`}
                    onClick={() => { setShowChapterGrid(false); goToChapter(number); }}
                  >
                    {number}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {version.strongs && !hasStrongs && !loading ? (
            <div className="pr-success" style={{ marginTop: 14 }}>
              The Strong&apos;s numbers are not available for this chapter right now, so the plain King James text is shown.
            </div>
          ) : null}
        </div>

        {!isAuthenticated ? (
          <div className="pr-success" style={{ marginBottom: 16 }}>
            <Link to={createPageUrl("Login")} className="pr-link">Sign in</Link> to keep your highlights, bookmarks and notes on every device.
          </div>
        ) : null}

        <div className="pr-grid pr-chapter-grid" style={{ gap: 20 }}>
          <ChapterReaderPane
            panelTab={panelTab}
            onSelectTab={selectPanelTab}
            panelOpen={panelOpen}
            onTogglePanel={() => setPanelOpen((current) => !current)}
            wideScreen={wideScreen}
            section={studySection}
            onSelectSection={selectStudySection}
          >
            <div className="pr-chapter-content">
              <div className="pr-card pr-card-pad">
                {loading && verses.length === 0 ? (
                  <Spinner label="Loading the passage" />
                ) : error && verses.length === 0 ? (
                  <EmptyState
                    icon={AlertCircleIcon}
                    title="This chapter could not be loaded"
                    description={error}
                    action={<button type="button" className="pr-btn pr-btn-primary" onClick={() => setReloadToken((value) => value + 1)}>Try again</button>}
                  />
                ) : verses.length === 0 ? (
                  <EmptyState icon={BookOpenIcon} title="No verses here" description="Choose another chapter from the list above." />
                ) : (
                  <div style={{ opacity: loading ? 0.6 : 1, transition: "opacity 140ms ease" }}>
                    {loading ? (
                      <div
                        role="status"
                        aria-live="polite"
                        style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, fontSize: "0.88rem", fontWeight: 600, opacity: 0.85 }}
                      >
                        <Loader2Icon className="h-4 w-4 animate-spin" aria-hidden="true" />
                        Loading {book.name} {chapter}…
                      </div>
                    ) : null}
                    {error ? (
                      <div className="pr-error" style={{ marginBottom: 14 }}>
                        {error}{" "}
                        <button type="button" className="pr-link" onClick={() => setReloadToken((value) => value + 1)}>
                          Try again
                        </button>
                      </div>
                    ) : null}
                    {verses.map((verse) => {
                      const background = highlightFor(verse.verse);
                      const selected = selectedVerse === verse.verse;
                      const texts = textFor(verse);
                      const importedPassages = passagesForVerse(verse.verse);
                      const verseCrossRefs = crossRefsForVerse(verse.verse);
                      const englishBlock = `verse-en-${book.number}-${chapter}-${verse.verse}`;
                      const lugandaBlock = `verse-lu-${book.number}-${chapter}-${verse.verse}`;
                      const englishContent = strongsContent(texts.english, handleStrongClick);
                      const prayerOpen = Boolean(openPanel && openPanel.verse === verse.verse && openPanel.kind === "prayer");
                      const crossRefsOpen = Boolean(openPanel && openPanel.verse === verse.verse && openPanel.kind === "crossrefs");
                      return (
                        <div key={verse.verse}>
                          {selected ? (
                            <VerseActionBar
                              verse={verse}
                              onHighlight={toggleHighlight}
                              onBookmark={toggleBookmark}
                              onNote={(number, text) => saveMark("note", number, { note_text: text })}
                              onCrossRef={() => openPanelFor(verse.verse, "crossrefs")}
                              onPrayer={(number) => openPanelFor(number, "prayer")}
                              onCommentary={handleCommentary}
                              onShare={handleShare}
                              onClose={() => setSelectedVerse(null)}
                            />
                          ) : null}

                          <div
                            className={selected ? "pr-verse pr-verse-active" : "pr-verse"}
                            role="button"
                            tabIndex={0}
                            onClick={(event) => {
                              // A drag over the words is a selection, not a tap.
                              if (selectionInside(event.currentTarget)) return;
                              setSelectedVerse(selected ? null : verse.verse);
                            }}
                            onKeyDown={(event) => {
                              if (event.key !== "Enter" && event.key !== " ") return;
                              event.preventDefault();
                              setSelectedVerse(selected ? null : verse.verse);
                            }}
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
                              {showEnglish ? (
                                <AnnotatedText
                                  blockId={englishBlock}
                                  section="verse"
                                  text={englishContent.plain}
                                  nodes={englishContent.nodes}
                                  annotations={annotationsFor(englishBlock)}
                                  onAnnotate={handleAnnotate}
                                  onRemove={handleRemove}
                                  as="span"
                                  className="pr-verse-en"
                                />
                              ) : null}
                              {showEnglish && !texts.english && showLuganda ? (
                                <span className="pr-verse-missing">The English text is not yet available for this verse.</span>
                              ) : null}
                              {showLuganda ? (
                                <>
                                  {showEnglish ? <span className="pr-verse-divider" /> : null}
                                  {texts.luganda ? (
                                    <span className="pr-verse-lu">
                                      <span className="pr-verse-lu-badge">LU</span>
                                      <AnnotatedText
                                        blockId={lugandaBlock}
                                        section="verse"
                                        text={texts.luganda}
                                        annotations={annotationsFor(lugandaBlock)}
                                        onAnnotate={handleAnnotate}
                                        onRemove={handleRemove}
                                        as="span"
                                        className="pr-verse-lu-text"
                                      />
                                    </span>
                                  ) : (
                                    <span className="pr-verse-missing">The Luganda text is not yet available for this verse.</span>
                                  )}
                                </>
                              ) : null}
                            </span>
                          </div>

                          <div className="pr-verse-tools">
                            <button
                              type="button"
                              className={`pr-verse-tool${prayerOpen ? " is-active" : ""}`}
                              aria-expanded={prayerOpen}
                              onClick={() => togglePanel(verse.verse, "prayer")}
                            >
                              <HeartHandshakeIcon className="h-4 w-4" aria-hidden="true" />
                              Prayer passage
                            </button>
                            {verseCrossRefs.length ? (
                              <button
                                type="button"
                                className={`pr-verse-tool${crossRefsOpen ? " is-active" : ""}`}
                                aria-expanded={crossRefsOpen}
                                onClick={() => togglePanel(verse.verse, "crossrefs")}
                              >
                                <Link2Icon className="h-4 w-4" aria-hidden="true" />
                                Cross-references ({verseCrossRefs.length})
                              </button>
                            ) : null}
                          </div>

                          {prayerOpen ? (
                            importedPassages.length ? (
                              <PassagePrayer
                                inline
                                anchorId={`prayer-block-${book.number}-${chapter}-${verse.verse}`}
                                book={book.name}
                                chapter={chapter}
                                verse={verse.verse}
                                language={displayLanguage}
                                annotations={annotations}
                                passages={importedPassages}
                                onAnnotate={handleAnnotate}
                                onRemove={handleRemove}
                                onOpenPassage={handleOpenPassage}
                              />
                            ) : (
                              <PassagePrayer
                                anchorId={`prayer-block-${book.number}-${chapter}-${verse.verse}`}
                                book={book.name}
                                chapter={chapter}
                                verse={verse.verse}
                                language={displayLanguage}
                                annotations={annotations}
                                passages={[]}
                                fallback={closingPrayer}
                                onAnnotate={handleAnnotate}
                                onRemove={handleRemove}
                                onOpenPassage={handleOpenPassage}
                                onClose={() => togglePanel(verse.verse, "prayer")}
                              />
                            )
                          ) : null}

                          {crossRefsOpen ? (
                            <div id={`crossrefs-block-${book.number}-${chapter}-${verse.verse}`}>
                              <VerseCrossRefs
                                verse={verse.verse}
                                language={displayLanguage}
                                versionId={versionId}
                                references={verseCrossRefs}
                                anchorId={`crossrefs-block-${book.number}-${chapter}-${verse.verse}`}
                                onOpenReference={handleOpenCrossRef}
                              />
                            </div>
                          ) : null}

                          {noteFor(verse.verse) ? (
                            <div style={{ margin: "2px 0 12px", padding: "10px 12px", borderLeft: "3px solid var(--pr-gold)", background: "var(--pr-ivory-soft)", borderRadius: "0 8px 8px 0", fontSize: "0.9rem", color: "var(--pr-body)", display: "flex", gap: 8, alignItems: "flex-start" }}>
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

              <div className="pr-chapter-nav">
                <button type="button" className="pr-chip" style={{ cursor: "pointer" }} onClick={() => stepChapter(-1)}>
                  <ChevronLeftIcon className="h-4 w-4" />
                  Previous chapter
                </button>
                <button type="button" className="pr-chip" style={{ cursor: "pointer" }} onClick={() => stepChapter(1)}>
                  Next chapter
                  <ChevronRightIcon className="h-4 w-4" />
                </button>
              </div>

              <ChapterClosingPrayer
                book={book}
                chapter={chapter}
                prayer={closingPrayer}
                mode={langMode}
                annotations={annotations}
                onAnnotate={handleAnnotate}
                onRemove={handleRemove}
                onShare={handleSharePrayer}
                onPrayAgain={prayAgain}
                onOpenPassage={handleOpenPassage}
              />
            </div>
          </ChapterReaderPane>

          {panelTab === "study" ? (
            <ChapterSidebar
              book={book}
              chapter={chapter}
              verses={verses}
              language={langMode}
              annotations={annotations}
              passages={chapterPassages}
              crossRefGroups={crossRefGroups}
              onAnnotate={handleAnnotate}
              onRemove={handleRemove}
              onOpenPassage={handleOpenPassage}
              onOpenCrossRef={handleOpenCrossRef}
              panelOpen={panelOpen}
              activeSection={studySection}
              onSectionChange={setStudySection}
            />
          ) : (
            <ChapterResourcesPanel
              book={book}
              chapter={chapter}
              annotations={annotations}
              onAnnotate={handleAnnotate}
              onRemove={handleRemove}
              onOpenPassage={handleOpenPassage}
              panelOpen={panelOpen}
            />
          )}
        </div>

        <div className="pr-grid pr-grid-3" style={{ marginTop: 20 }}>
          <div className="pr-card pr-card-pad">
            <h3 className="pr-heading" style={{ fontSize: "1rem", fontWeight: 800, margin: "0 0 10px" }}>Pray this passage</h3>
            <p style={{ margin: 0, fontSize: "0.88rem" }}>Turn {reference} into a guided prayer and keep it in your prayer journal.</p>
            <Link to={createPageUrl("Journal") + `?book=${encodeURIComponent(book.name)}&chapter=${chapter}&new=1`} className="pr-btn pr-btn-gold pr-btn-sm" style={{ marginTop: 12 }}>
              <HeartHandshakeIcon className="h-4 w-4" /> Open prayer journal
            </Link>
          </div>
          <div className="pr-card pr-card-pad">
            <h3 className="pr-heading" style={{ fontSize: "1rem", fontWeight: 800, margin: "0 0 10px" }}>Saved for later</h3>
            <p style={{ margin: 0, fontSize: "0.88rem" }}>
              <HighlighterIcon className="h-4 w-4" style={{ display: "inline" }} /> Highlights and <NotebookPenIcon className="h-4 w-4" style={{ display: "inline" }} /> notes on {book.name} are stored on your account and in the offline centre.
            </p>
            <Link to={createPageUrl("Dashboard")} className="pr-link" style={{ display: "inline-block", marginTop: 10 }}>See my library →</Link>
          </div>
        </div>

        <PassageTabs book={book} chapter={chapter} reference={reference} language={displayLanguage} />
      </div>

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
        title={shareTitle || `Share ${reference}`}
        subtitle={shareSubtitle}
        sections={shareSections}
        text={shareText}
        url={shareUrl}
        onClose={() => setShareOpen(false)}
      />

      {strongCode ? (
        <StrongsPopup code={strongCode} word={strongWord} onClose={() => setStrongCode(null)} />
      ) : null}

      {toast ? <div className="pr-toast">{toast}</div> : null}
    </div>
  );
}