import React, { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchPublicCollection } from "@/lib/contentApi";
import { safeText } from "@/lib/format";
import { getBookGuide } from "@/lib/bookGuides";
import { fetchBookIntro } from "@/lib/bookIntro";
import { getBookStudyInsights } from "@/lib/bookStudyContent";
import { parseOutlineRange, parseReference, resolveBook } from "@/lib/scriptureRefs";
import { INSIGHTS } from "@/lib/seedContent";
import {
  BookOpenIcon,
  ChevronDownIcon,
  LightbulbIcon,
  LandmarkIcon,
  QuoteIcon
} from "lucide-react";
import Pagination from "@/components/common/Pagination";

/**
 * The book study resources that sit under the chapter grid.
 *
 * Three readers share one panel: the book commentary, the theological
 * insights and the historical insights. Each one shows the notes written
 * for the book that is open, and a pager turns through them when a book
 * carries many notes.
 */

const PAGE_SIZE = 3;

const TABS = [
  { id: "commentary", label: "Book Commentary", icon: BookOpenIcon },
  { id: "theological", label: "Theological Insights", icon: LightbulbIcon },
  { id: "historical", label: "Historical Insights", icon: LandmarkIcon }
];

const TOPICS = {
  commentary: [
    "Chapter notes",
    "Textual notes",
    "Cultural background",
    "Cross-references",
    "Application notes"
  ],
  theological: [
    "Biblical theology",
    "Christ and the gospel",
    "Covenant and promise",
    "Sin and grace",
    "Kingdom and hope"
  ],
  historical: [
    "Historical background",
    "Cultural context",
    "Maps and geography",
    "Timeline",
    "Archaeological notes"
  ]
};

const SECTION_NAMES = {
  commentary: "commentary",
  theological: "theological insights",
  historical: "historical insights"
};

const bookNumberOf = (value) => {
  const raw = String(value === null || value === undefined ? "" : value).trim();
  if (!raw) return null;
  if (/^\d+$/.test(raw)) return Number(raw);
  const resolved = resolveBook(raw);
  return resolved ? resolved.number : null;
};

export default function BookStudyResources({ book, onOpenPassage, openSignal = 0 }) {
  const [tab, setTab] = useState("commentary");
  const [page, setPage] = useState(1);
  const [collapsed, setCollapsed] = useState(false);
  const panelRef = useRef(null);

  // The reader top bar can ask for this panel: open it and bring it into view.
  useEffect(() => {
    if (!openSignal) return;
    setCollapsed(false);
    const node = panelRef.current;
    if (!node) return;
    window.setTimeout(() => {
      node.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  }, [openSignal]);

  // The introduction that was imported for this book. When the content
  // manager has written one, it stands in place of the overview the app
  // builds on its own.
  const { data: importedBookIntro } = useQuery({
    queryKey: ["bookIntro", book.number],
    queryFn: () => fetchBookIntro(book.number),
    enabled: Boolean(book && book.number)
  });

  const { data: commentaryRows } = useQuery({
    queryKey: ["studyCommentary"],
    queryFn: async () => {
      try {
        return await fetchPublicCollection("commentary");
      } catch {
        return [];
      }
    }
  });

  const { data: insightRows } = useQuery({
    queryKey: ["studyInsights"],
    queryFn: async () => {
      try {
        return await fetchPublicCollection("insights");
      } catch {
        return [];
      }
    }
  });

  const commentary = useMemo(() => {
    const notes = [];

    (commentaryRows || []).forEach((row) => {
      if (bookNumberOf(row.book) !== book.number) return;
      const body = safeText(row.body_en);
      const bodyLu = safeText(row.body_lu);
      const title = safeText(row.title);
      if (!body && !bodyLu && !title) return;
      const chapter = Number(row.chapter) || 0;
      notes.push({
        key: row.id || `${row.book}-${row.chapter}-${title}`,
        badge: chapter ? `Chapter ${chapter}` : "Book note",
        badgePassage: false,
        title: title || `${book.name}${chapter ? ` ${chapter}` : ""}`,
        body,
        bodyLu,
        passage: chapter
          ? {
              bookNumber: book.number,
              bookName: book.name,
              luganda: book.luganda,
              chapter,
              verse: 1,
              endVerse: null,
              label: `${book.name} ${chapter}`
            }
          : null,
        linkLabel: "Open the chapter"
      });
    });

    if (notes.length) return notes;

    // No published commentary for this book yet: fall back to the study
    // notes written for it, so the reader always finds something here.
    const guide = getBookGuide(book);
    // The overview of the book is the introduction that was imported for
    // it. The text the app builds on its own is only used when nothing was
    // imported.
    const bundled = [
      {
        key: `overview-${book.number}`,
        badge: "Book overview",
        badgePassage: false,
        title: (importedBookIntro && importedBookIntro.title_en) || `About ${book.name}`,
        body: (importedBookIntro && (importedBookIntro.intro_en || importedBookIntro.intro_lu)) || guide.intro || "",
        bodyLu: (importedBookIntro && importedBookIntro.intro_lu) || "",
        passage: null,
        linkLabel: "Read the passage"
      }
    ];

    (guide.outline || []).forEach(([label, range], index) => {
      const parsed = parseOutlineRange(range, book);
      bundled.push({
        key: `division-${index}`,
        badge: "Study note",
        badgePassage: false,
        title: label,
        body: "",
        bodyLu: "",
        range: parsed ? parsed.text : range,
        passage: parsed
          ? {
              bookNumber: book.number,
              bookName: book.name,
              luganda: book.luganda,
              chapter: parsed.start.chapter,
              verse: parsed.start.verse,
              endVerse: parsed.end.verse,
              label: `${book.name} ${range}`
            }
          : null,
        linkLabel: "Read the passage"
      });
    });

    return bundled;
  }, [commentaryRows, book, importedBookIntro]);

  const insights = useMemo(() => {
    const build = (kind) => {
      const list = [];

      const add = (row, key) => {
        const reference = parseReference(row.passage);
        if (!reference || reference.bookNumber !== book.number) return;
        list.push({
          key,
          badge: reference.label,
          badgePassage: true,
          title: safeText(row.title),
          body: safeText(row.excerpt) || safeText(row.body),
          bodyLu: "",
          passage: {
            bookNumber: reference.bookNumber,
            bookName: reference.bookName,
            luganda: reference.luganda,
            chapter: reference.chapter,
            verse: reference.verse || 1,
            endVerse: reference.endVerse || null,
            label: reference.label
          },
          linkLabel: "Read the passage"
        });
      };

      (insightRows || []).forEach((row) => {
        if (row.kind !== kind) return;
        add(row, row.id || `db-${row.title}`);
      });

      INSIGHTS.forEach((row) => {
        if (row.kind !== kind) return;
        if (list.some((item) => item.title === row.title)) return;
        add(row, `library-${row.title}`);
      });

      if (!list.length) {
        const fallback = getBookStudyInsights(book)[kind];
        list.push({
          key: `fallback-${kind}-${book.number}`,
          badge: book.name,
          badgePassage: false,
          title: fallback.title,
          body: fallback.body,
          bodyLu: "",
          passage: null,
          linkLabel: "Read the passage"
        });
      }

      return list;
    };

    return {
      theological: build("theological"),
      historical: build("historical")
    };
  }, [insightRows, book]);

  const notes = tab === "commentary" ? commentary : insights[tab];
  const counts = {
    commentary: commentary.length,
    theological: insights.theological.length,
    historical: insights.historical.length
  };

  const pageCount = Math.max(1, Math.ceil(notes.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const visible = notes.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  const openPassage = (passage) => {
    if (passage && onOpenPassage) onOpenPassage(passage);
  };

  return (
    <section className="pr-study" id="book-study-resources" ref={panelRef} aria-label="Book study resources">
      <header className="pr-study-head">
        <span className="pr-study-head-icon">
          <BookOpenIcon className="h-5 w-5" />
        </span>
        <div className="pr-study-head-text">
          <p className="pr-eyebrow">Book Study Resources</p>
          <h2 className="pr-study-title">
            {book.name} <span className="pr-study-luganda">{book.luganda}</span>
          </h2>
        </div>
        <button
          type="button"
          className="pr-study-toggle"
          onClick={() => setCollapsed((value) => !value)}
          aria-expanded={!collapsed}
          aria-label={collapsed ? "Show the study resources" : "Hide the study resources"}
        >
          <ChevronDownIcon className={`h-5 w-5${collapsed ? " is-collapsed" : ""}`} />
        </button>
      </header>

      {collapsed ? null : (
        <>
          <div className="pr-study-tabs" role="tablist" aria-label="Study resource sections">
            {TABS.map((entry) => (
              <button
                key={entry.id}
                type="button"
                role="tab"
                id={`pr-study-tab-${entry.id}`}
                aria-selected={tab === entry.id}
                aria-controls={`pr-study-panel-${entry.id}`}
                className={`pr-study-tab${tab === entry.id ? " is-active" : ""}`}
                onClick={() => {
                  setTab(entry.id);
                  setPage(1);
                }}
              >
                <entry.icon className="h-4 w-4" />
                <span className="pr-study-tab-label">{entry.label}</span>
                <span className="pr-study-count">{counts[entry.id]}</span>
              </button>
            ))}
          </div>

          <div
            className="pr-study-body"
            role="tabpanel"
            id={`pr-study-panel-${tab}`}
            aria-labelledby={`pr-study-tab-${tab}`}
          >
            {visible.length === 0 ? (
              <div className="pr-study-empty">
                <span className="pr-study-empty-icon">
                  <QuoteIcon className="h-5 w-5" />
                </span>
                <p className="pr-study-empty-title">
                  No {SECTION_NAMES[tab]} added yet for {book.name}.
                </p>
                <p className="pr-study-empty-hint">
                  {SECTION_NAMES[tab].charAt(0).toUpperCase() + SECTION_NAMES[tab].slice(1)} can
                  be added from the Admin Panel.
                </p>
                <div className="pr-study-chips">
                  {TOPICS[tab].map((topic) => (
                    <span key={topic} className="pr-study-chip">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="pr-study-notes">
                {visible.map((note) => (
                  <article key={note.key} className="pr-study-note">
                    <div className="pr-study-note-head">
                      {note.badgePassage ? (
                        <button
                          type="button"
                          className="pr-study-badge is-link"
                          onClick={() => openPassage(note.passage)}
                        >
                          {note.badge}
                        </button>
                      ) : (
                        <span className="pr-study-badge">{note.badge}</span>
                      )}

                      {note.passage && !note.badgePassage && !note.range ? (
                        <button
                          type="button"
                          className="pr-study-link"
                          onClick={() => openPassage(note.passage)}
                        >
                          {note.linkLabel}
                        </button>
                      ) : null}

                      {note.range && note.passage ? (
                        <button
                          type="button"
                          className="pr-study-link is-range"
                          onClick={() => openPassage(note.passage)}
                        >
                          {note.range}
                        </button>
                      ) : null}
                    </div>

                    <h3 className="pr-study-note-title">{note.title}</h3>
                    {note.body ? <p className="pr-study-note-body">{note.body}</p> : null}
                    {note.bodyLu ? (
                      <p className="pr-study-note-body is-lu">{note.bodyLu}</p>
                    ) : null}
                  </article>
                ))}
              </div>
            )}
          </div>

          <Pagination
            page={current}
            pageCount={pageCount}
            onChange={setPage}
            label="Page"
          />
        </>
      )}
    </section>
  );
}