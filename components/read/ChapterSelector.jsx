import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { CloudOffIcon, FlagIcon, PlayIcon, TargetIcon } from "lucide-react";
import { getBookGuide } from "@/lib/bookGuides";
import BookSidebar from "@/components/read/BookSidebar";
import ChapterGrid from "@/components/read/ChapterGrid";

/**
 * The book chapter selector: a left sidebar with the book intro, the book
 * outline and the chapter list, and a chapter grid on the right.
 */
export default function ChapterSelector({ book, accent, downloaded }) {
  const [section, setSection] = useState("intro");
  const [chapter, setChapter] = useState(1);

  const guide = useMemo(() => getBookGuide(book), [book]);

  const middle = Math.max(1, Math.ceil(book.chapters / 2));
  const testament = book.number <= 39 ? "Old Testament" : "New Testament";

  const jumpTo = (value) => {
    setChapter(value);
    setSection("chapter");
    const node = document.getElementById("chapter-grid");
    if (node) node.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const chapterLink = (value) =>
    `${createPageUrl("Chapter")}?book=${book.number}&chapter=${value}`;

  return (
    <div className="pr-sel-layout">
      <BookSidebar
        book={book}
        guide={guide}
        accent={accent}
        activeSection={section}
        onSectionChange={setSection}
        selectedChapter={chapter}
        onSelectChapter={jumpTo}
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

        <section className="pr-sel-quick">
          <p className="pr-sel-eyebrow">Quick navigation</p>
          <div className="pr-sel-quick-row">
            <Link to={chapterLink(1)} className="pr-sel-quick-btn pr-sel-quick-start">
              <PlayIcon className="h-4 w-4" /> Start reading
            </Link>
            <Link to={chapterLink(middle)} className="pr-sel-quick-btn pr-sel-quick-middle">
              <TargetIcon className="h-4 w-4" /> Middle
            </Link>
            <Link to={chapterLink(book.chapters)} className="pr-sel-quick-btn pr-sel-quick-last">
              <FlagIcon className="h-4 w-4" /> Last chapter
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}