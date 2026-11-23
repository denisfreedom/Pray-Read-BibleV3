import React from "react";
import { BookOpenIcon, HeartHandshakeIcon, ListIcon, Icon } from "lucide-react";
import BookIntro from "@/components/read/BookIntro";
import BookOutline from "@/components/read/BookOutline";
import BookPrayerPanel from "@/components/read/BookPrayerPanel";

const SECTIONS = [
  { key: "intro", label: "Book Intro", Icon: BookOpenIcon },
  { key: "outline", label: "Book Outline", Icon: ListIcon },
  { key: "prayer", label: "Book Prayer", Icon: HeartHandshakeIcon }
];

/**
 * The left hand panel of the book reader. It carries the three sections of
 * the old project: the book introduction, the outline of the book and the
 * prayer for the book. Each section scrolls on its own.
 */
export default function BookSidebar({
  book,
  guide,
  accent,
  activeSection,
  onSectionChange,
  annotations,
  onAnnotate,
  onRemove,
  onOpenPassage,
  selection,
  onSelectPassage,
  panelRef
}) {
  return (
    <aside className="pr-sel-side" ref={panelRef}>
      <div className="pr-sel-side-head">
        <span className="pr-sel-side-icon" style={{ background: accent }}>
          <BookOpenIcon className="h-4 w-4" />
        </span>
        <div className="pr-sel-side-head-text">
          <p className="pr-sel-side-title">{book.name}</p>
          <p className="pr-sel-side-luganda">{book.luganda}</p>
        </div>
      </div>

      <div className="pr-sel-tabs" role="tablist" aria-label="Book sections">
        {SECTIONS.map(({ key, label, Icon }) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={activeSection === key}
            className={`pr-sel-tab ${activeSection === key ? "is-active" : ""}`}
            onClick={() => onSectionChange(key)}
          >
            <Icon className="h-4 w-4" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      <div className="pr-sel-panel">
        {activeSection === "intro" ? (
          <div className="pr-sel-scroll">
            <BookIntro
              book={book}
              guide={guide}
              accent={accent}
              annotations={annotations}
              onAnnotate={onAnnotate}
              onRemove={onRemove}
              onOpenPassage={onOpenPassage}
            />
          </div>
        ) : null}

        {activeSection === "outline" ? (
          <div className="pr-sel-scroll">
            <BookOutline
              book={book}
              guide={guide}
              annotations={annotations}
              onAnnotate={onAnnotate}
              onRemove={onRemove}
              onOpenPassage={onOpenPassage}
              selection={selection}
              onSelectPassage={onSelectPassage}
            />
          </div>
        ) : null}

        {activeSection === "prayer" ? (
          <div className="pr-sel-scroll">
            <BookPrayerPanel
              book={book}
              annotations={annotations}
              onAnnotate={onAnnotate}
              onRemove={onRemove}
              onOpenPassage={onOpenPassage}
            />
          </div>
        ) : null}
      </div>
    </aside>
  );
}