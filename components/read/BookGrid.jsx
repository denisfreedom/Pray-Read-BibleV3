import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ChevronRightIcon, CloudOffIcon, SearchIcon } from "lucide-react";
import { OLD_TESTAMENT, NEW_TESTAMENT } from "@/lib/bibleBooks";

const SECTIONS = [
  {
    key: "old",
    label: "Old Testament",
    emoji: "📖",
    books: OLD_TESTAMENT,
    accent: "#b98428",
    tint: "#fdf5e7",
    badgeBg: "#f6dca8",
    badgeFg: "#8a6318"
  },
  {
    key: "new",
    label: "New Testament",
    emoji: "📕",
    books: NEW_TESTAMENT,
    accent: "#2f5d8a",
    tint: "#eef4fa",
    badgeBg: "#d7e4f3",
    badgeFg: "#2f5d8a"
  }
];

export default function BookGrid({ search, onSearch, activeTab, onTabChange, downloaded }) {
  const query = search.trim().toLowerCase();

  const filtered = useMemo(
    () =>
      SECTIONS.map((section) => ({
        ...section,
        books: section.books.filter((book) => {
          if (!query) return true;
          return (
            book.name.toLowerCase().includes(query) ||
            book.luganda.toLowerCase().includes(query) ||
            book.abbr.toLowerCase().includes(query) ||
            book.lugandaAbbr.toLowerCase().includes(query)
          );
        })
      })),
    [query]
  );

  const scrollTo = (key) => {
    const node = document.getElementById(`section-${key}`);
    if (node) node.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleTab = (key) => {
    onTabChange(key);
    scrollTo(key);
  };

  return (
    <div>
      <div className="pr-reader-search">
        <SearchIcon className="pr-reader-search-icon h-5 w-5" />
        <input
          id="book-search"
          type="text"
          className="pr-reader-search-input"
          value={search}
          onChange={(event) => onSearch(event.target.value)}
          placeholder="Search books… e.g. Psalms, Obukikkulirwa, Philemon"
          aria-label="Search books"
        />
      </div>

      <div className="pr-reader-segment" role="tablist" aria-label="Testaments">
        {SECTIONS.map((section) => (
          <button
            key={section.key}
            type="button"
            role="tab"
            aria-selected={activeTab === section.key}
            className={`pr-reader-segment-btn ${activeTab === section.key ? "is-active" : ""}`}
            onClick={() => handleTab(section.key)}
          >
            <span aria-hidden="true">{section.emoji}</span>
            <span>{section.label}</span>
            <span className="pr-reader-segment-count">{section.books.length}</span>
          </button>
        ))}
      </div>

      {SECTIONS.map((section) => {
        const books = filtered.find((item) => item.key === section.key).books;
        return (
          <section key={section.key} id={`section-${section.key}`} className="pr-reader-section">
            <div className="pr-reader-section-head">
              <span
                className="pr-reader-section-badge"
                style={{ background: section.badgeBg, color: section.badgeFg }}
                aria-hidden="true"
              >
                {section.emoji}
              </span>
              <h2 className="pr-reader-section-title">{section.label}</h2>
              <span
                className="pr-reader-section-count"
                style={{ background: section.tint, color: section.accent }}
              >
                {books.length} books
              </span>
            </div>

            {books.length === 0 ? (
              <div className="pr-empty">
                <p style={{ margin: 0, fontWeight: 700 }}>No book matches “{search}”.</p>
                <p style={{ margin: "8px 0 0", fontSize: "0.88rem" }}>
                  Try the English name, the Luganda name, or the short abbreviation.
                </p>
              </div>
            ) : (
              <div className="pr-reader-books">
                {books.map((book) => {
                  const isDownloaded = Boolean(downloaded && downloaded.has(book.number));
                  return (
                    <Link
                      key={book.number}
                      to={createPageUrl("BibleReader") + `?book=${book.number}`}
                      className={`pr-reader-book ${isDownloaded ? "has-offline" : ""}`}
                      style={{ borderTopColor: section.accent }}
                      title={`${book.name} · ${book.luganda}`}
                    >
                      <span className="pr-reader-book-abbr">{book.abbr}</span>
                      <span className="pr-reader-book-name">{book.name}</span>
                      <span className="pr-reader-book-luganda">{book.luganda}</span>

                      <span className="pr-reader-book-foot">
                        <span
                          className="pr-reader-book-counts"
                          style={{ background: section.tint, color: section.accent }}
                        >
                          <b>{book.chapters}</b>
                          <span>{book.chapters === 1 ? "chapter" : "chapters"}</span>
                        </span>
                        <span className="pr-reader-book-go">
                          <ChevronRightIcon className="h-4 w-4" />
                        </span>
                      </span>

                      {isDownloaded ? (
                        <span className="pr-reader-offline-tag" title="Available offline">
                          <CloudOffIcon className="h-3 w-3" />
                        </span>
                      ) : null}
                    </Link>
                  );
                })}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}