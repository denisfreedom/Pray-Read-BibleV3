import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

/**
 * The chapter grid of the book reader: one tappable tile per chapter,
 * exactly like the old Pray-Read book page.
 */
export default function ChapterGrid({ book, accent, selectedChapter, onSelect, lang = "en" }) {
  const chapters = [];
  for (let chapter = 1; chapter <= book.chapters; chapter += 1) {
    chapters.push(chapter);
  }

  return (
    <section className="pr-sel-card">
      <p className="pr-sel-eyebrow">Select a chapter</p>
      <div className="pr-chap-grid" style={{ "--pr-sel-accent": accent }}>
        {chapters.map((chapter) => (
          <Link
            key={chapter}
            to={`${createPageUrl("Chapter")}?book=${book.number}&chapter=${chapter}${lang === "lu" ? "&lang=lu" : ""}`}
            className={`pr-chap-chip${selectedChapter === chapter ? " is-selected" : ""}`}
            onClick={() => onSelect && onSelect(chapter)}
            aria-label={`${book.name} chapter ${chapter}`}
          >
            {chapter}
          </Link>
        ))}
      </div>
    </section>
  );
}