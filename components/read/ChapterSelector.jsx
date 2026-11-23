import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import { fse2 } from "@/api/fse2Client";
import { useAuth } from "@/lib/AuthContext";
import { CloudOffIcon } from "lucide-react";
import { getBookGuide } from "@/lib/bookGuides";
import {
  annotationKey,
  loadLocalAnnotations,
  mergeAnnotations,
  removeAnnotation,
  saveAnnotation
} from "@/lib/studyAnnotations";
import BookSidebar from "@/components/read/BookSidebar";
import ChapterGrid from "@/components/read/ChapterGrid";
import BookStudyResources from "@/components/read/BookStudyResources";
import VersePopup from "@/components/read/VersePopup";

const EMPTY = [];

const selectionKey = (bookNumber) => `prayread-outline-selection-${bookNumber}`;

/**
 * The book reader: a left sidebar with the book intro, the outline and the
 * book prayer, and a chapter grid on the right. The reader can mark the
 * sidebar, open any verse in place and jump straight to a part of the book.
 */
export default function ChapterSelector({
  book,
  accent,
  downloaded,
  studySignal = 0,
  sidebarSignal = 0
}) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const email = user && user.email ? user.email : "";

  const [section, setSection] = useState("intro");
  const [chapter, setChapter] = useState(1);
  const [selection, setSelection] = useState(null);
  const [popup, setPopup] = useState(null);
  const [annotations, setAnnotations] = useState([]);
  const sidebarRef = useRef(null);

  const guide = useMemo(() => getBookGuide(book), [book]);

  // the division of the book the reader was last working on
  useEffect(() => {
    let stored = null;
    try {
      const raw = window.localStorage.getItem(selectionKey(book.number));
      stored = raw ? JSON.parse(raw) : null;
    } catch {
      stored = null;
    }
    setSelection(stored);
    setChapter(stored && stored.chapter ? stored.chapter : 1);
  }, [book.number]);

  const { data: serverAnnotations = EMPTY } = useQuery({
    queryKey: ["studyAnnotations", email, book.number],
    queryFn: async () => {
      if (!email) return [];
      const rows = await fse2.entities.StudyAnnotation.list("-updated_date", 300);
      return (rows || []).filter(
        (row) => row.owner_email === email && Number(row.book_number) === Number(book.number)
      );
    },
    enabled: Boolean(email)
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

  const handleOpenPassage = useCallback((reference) => {
    if (!reference) return;
    setPopup(reference);
  }, []);

  const handleSelectPassage = useCallback(
    (payload) => {
      const record = {
        index: payload.index,
        label: payload.label,
        range: payload.range,
        chapter: payload.chapter,
        verse: payload.verse
      };
      setSelection(record);
      setChapter(record.chapter);
      try {
        window.localStorage.setItem(selectionKey(book.number), JSON.stringify(record));
      } catch {
        // the selection is still kept for this visit
      }
      navigate(
        `${createPageUrl("Chapter")}?book=${book.number}&chapter=${record.chapter}&verse=${record.verse}`
      );
    },
    [book.number, navigate]
  );

  const testament = book.number <= 39 ? "Old Testament" : "New Testament";

  // The top bar can also ask for the book intro, outline and prayer sidebar.
  useEffect(() => {
    if (!sidebarSignal) return;
    setSection("intro");
    const node = sidebarRef.current;
    if (!node) return;
    window.setTimeout(() => {
      const box = node.getBoundingClientRect();
      const alreadyOnScreen = box.top >= 0 && box.top < window.innerHeight;
      if (alreadyOnScreen) return;
      node.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  }, [sidebarSignal]);

  return (
    <div className="pr-sel-layout">
      <BookSidebar
        book={book}
        guide={guide}
        accent={accent}
        activeSection={section}
        onSectionChange={setSection}
        annotations={annotations}
        onAnnotate={handleAnnotate}
        onRemove={handleRemove}
        onOpenPassage={handleOpenPassage}
        selection={selection}
        onSelectPassage={handleSelectPassage}
        panelRef={sidebarRef}
      />

      <div className="pr-sel-main">
        <header className="pr-sel-head">
          <span className="pr-sel-tagline" style={{ background: `${accent}1a`, color: accent }}>
            {testament}
          </span>
          <h1 className="pr-sel-title">{book.name}</h1>
          <p className="pr-sel-luganda">{book.luganda}</p>
          <p className="pr-sel-lead">
            Select a chapter to begin reading ({book.chapters} chapters)
          </p>
          {downloaded ? (
            <span className="pr-sel-offline">
              <CloudOffIcon className="h-4 w-4" /> Available offline on this device
            </span>
          ) : null}
        </header>

        <div id="chapter-grid">
          <ChapterGrid
            book={book}
            accent={accent}
            selectedChapter={chapter}
            onSelect={setChapter}
          />
        </div>

        <BookStudyResources
          book={book}
          onOpenPassage={handleOpenPassage}
          openSignal={studySignal}
        />
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
    </div>
  );
}