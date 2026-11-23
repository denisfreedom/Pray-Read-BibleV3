import React from "react";
import { BookOpenIcon, HashIcon, ListIcon, Icon } from "lucide-react";

const SECTIONS = [
  { key: "intro", label: "Book Intro", Icon: BookOpenIcon },
  { key: "outline", label: "Book Outline", Icon: ListIcon },
  { key: "chapter", label: "Chapter", Icon: HashIcon }
];

/**
 * The left hand panel of the book reader. It carries the three sections of
 * the old project: the book introduction, the outline of the book and the
 * list of chapters.
 */
export default function BookSidebar({
  book,
  guide,
  accent,
  activeSection,
  onSectionChange,
  selectedChapter,
  onSelectChapter
}) {
  const chapters = [];
  for (let chapter = 1; chapter <= book.chapters; chapter += 1) {
    chapters.push(chapter);
  }

  const testament = book.number <= 39 ? "Old Testament" : "New Testament";

  return (
    <aside className="pr-sel-side">
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
          <div className="pr-sel-intro">
            <div className="pr-sel-facts">
              <span className="pr-sel-fact" style={{ background: `${accent}1a`, color: accent }}>
                {testament}
              </span>
              <span className="pr-sel-fact" style={{ background: "#f1efe6", color: "#5d6d5d" }}>
                {book.chapters} {book.chapters === 1 ? "chapter" : "chapters"}
              </span>
              <span className="pr-sel-fact" style={{ background: "#f1efe6", color: "#5d6d5d" }}>
                {book.abbr}
              </span>
            </div>
            <p className="pr-sel-paragraph">{guide.intro}</p>
            <p className="pr-sel-paragraph pr-sel-paragraph-soft">
              Read it slowly, one chapter at a time, and let each chapter become a
              conversation with God rather than a line to get through.
            </p>
          </div>
        ) : null}

        {activeSection === "outline" ? (
          <div className="pr-sel-outline">
            <p className="pr-sel-panel-title">{book.name} Outline</p>
            {guide.outline.map(([label, range]) => (
              <div key={`${label}-${range}`} className="pr-sel-outline-row">
                <span className="pr-sel-outline-label">{label}</span>
                <span className="pr-sel-outline-range">{range}</span>
              </div>
            ))}
          </div>
        ) : null}

        {activeSection === "chapter" ? (
          <div className="pr-sel-chapters">
            <p className="pr-sel-panel-title">Chapters in {book.name}</p>
            <div className="pr-sel-chapter-list">
              {chapters.map((chapter) => (
                <button
                  key={chapter}
                  type="button"
                  className={`pr-sel-chapter-chip ${selectedChapter === chapter ? "is-selected" : ""}`}
                  style={{ "--pr-sel-accent": accent }}
                  onClick={() => onSelectChapter(chapter)}
                >
                  {chapter}
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </aside>
  );
}