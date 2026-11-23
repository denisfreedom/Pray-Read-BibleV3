import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ChevronRightIcon, DownloadIcon, SearchIcon } from "lucide-react";
import { OLD_TESTAMENT, NEW_TESTAMENT } from "@/lib/bibleBooks";

const SECTIONS = [
  { key: "old", label: "Old Testament", books: OLD_TESTAMENT, count: 39, accent: "#b98428", tint: "#fdf5e7" },
  { key: "new", label: "New Testament", books: NEW_TESTAMENT, count: 27, accent: "#2f5d8a", tint: "#eef4fa" }
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
      <div className="pr-card pr-card-pad" style={{ marginBottom: 22 }}>
        <label htmlFor="book-search" className="pr-label">
          Find a book
        </label>
        <div style={{ position: "relative" }}>
          <SearchIcon
            className="h-4 w-4"
            style={{ position: "absolute", left: 14, top: 15, color: "var(--pr-gold-deep)" }}
          />
          <input
            id="book-search"
            className="pr-input"
            style={{ paddingLeft: 40 }}
            value={search}
            onChange={(event) => onSearch(event.target.value)}
            placeholder="Search books… e.g. Psalms, Okubikkulirwa, Philemon"
          />
        </div>

        <div className="pr-tabs" style={{ marginTop: 16, borderBottom: "none" }}>
          {SECTIONS.map((section) => (
            <button
              key={section.key}
              type="button"
              className={`pr-tab ${activeTab === section.key ? "pr-tab-active" : ""}`}
              onClick={() => handleTab(section.key)}
            >
              📖 {section.label} ({section.count})
            </button>
          ))}
        </div>
      </div>

      {SECTIONS.map((section) => {
        const books = filtered.find((item) => item.key === section.key).books;
        return (
          <section key={section.key} id={`section-${section.key}`} style={{ marginBottom: 34 }}>
            <h2 className="pr-heading" style={{ fontSize: "1.25rem", fontWeight: 800, margin: "0 0 14px" }}>
              {section.label} <span style={{ color: "var(--pr-gold-deep)" }}>({books.length})</span>
            </h2>

            {books.length === 0 ? (
              <div className="pr-empty">
                <p style={{ margin: 0, fontWeight: 700 }}>No book matches “{search}”.</p>
                <p style={{ margin: "8px 0 0", fontSize: "0.88rem" }}>
                  Try the English name, the Luganda name, or the short abbreviation.
                </p>
              </div>
            ) : (
              <div className="pr-grid pr-grid-3">
                {books.map((book) => {
                  const isDownloaded = downloaded && downloaded.has(book.number);
                  return (
                    <Link
                      key={book.number}
                      to={createPageUrl("Chapter") + `?book=${book.number}&chapter=1`}
                      className="pr-card pr-card-hover"
                      style={{
                        display: "block",
                        textDecoration: "none",
                        padding: 18,
                        borderTop: `4px solid ${section.accent}`,
                        background: "#ffffff"
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                        <div style={{ flex: "1 1 auto", minWidth: 0 }}>
                          <p
                            style={{
                              margin: 0,
                              fontSize: "1.3rem",
                              fontWeight: 800,
                              color: "var(--pr-heading)",
                              letterSpacing: "-0.01em"
                            }}
                          >
                            {book.abbr}
                          </p>
                          <p style={{ margin: "4px 0 0", fontWeight: 700, color: "var(--pr-heading)", fontSize: "0.95rem" }}>
                            {book.name}
                          </p>
                          <p style={{ margin: "2px 0 0", fontSize: "0.82rem", color: "var(--pr-body)" }}>
                            {book.luganda}
                          </p>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
                            <span
                              className="pr-badge"
                              style={{ background: section.tint, color: section.accent }}
                            >
                              {book.chapters} {book.chapters === 1 ? "chapter" : "chapters"}
                            </span>
                            {isDownloaded ? (
                              <span className="pr-badge" style={{ background: "rgba(29,64,53,0.12)", color: "#1d4035" }}>
                                <DownloadIcon className="h-3 w-3" /> Offline
                              </span>
                            ) : null}
                          </div>
                        </div>
                        <ChevronRightIcon className="h-5 w-5" style={{ color: section.accent }} />
                      </div>
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