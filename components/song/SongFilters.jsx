import React from "react";
import { SearchIcon } from "lucide-react";

/**
 * The search bar and the filter chips of the verse-song pages.
 *
 * The series list holds only the series the administrator created. The book
 * list holds only the books the songs actually use.
 */
export default function SongFilters({
  query,
  onQuery,
  seriesOptions,
  seriesId,
  onSeries,
  bookOptions,
  bookNumber,
  onBook,
  resultCount,
  showSeries = true
}) {
  return (
    <div className="pr-vs-filters-wrap">
      <div className="pr-vs-search">
        <SearchIcon className="h-5 w-5" style={{ position: "absolute", left: 16, top: 15, color: "rgba(255,255,255,0.75)" }} />
        <input
          type="search"
          value={query}
          onChange={(event) => onQuery(event.target.value)}
          placeholder="Search by title, book, chapter, verse or series"
          aria-label="Search the verse songs"
        />
      </div>

      <div className="pr-vs-filters">
        <button
          type="button"
          className={`pr-vs-chip${!seriesId && !bookNumber ? " pr-vs-chip-active" : ""}`}
          onClick={() => {
            onSeries("");
            onBook("");
          }}
        >
          All
        </button>

        {showSeries ? (
          <select
            className="pr-vs-select"
            value={seriesId || ""}
            onChange={(event) => onSeries(event.target.value)}
            aria-label="Filter by series"
          >
            <option value="">All series</option>
            {seriesOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </select>
        ) : null}

        <select
          className="pr-vs-select"
          value={bookNumber ? String(bookNumber) : ""}
          onChange={(event) => onBook(event.target.value)}
          aria-label="Filter by book"
        >
          <option value="">All books</option>
          {bookOptions.map((option) => (
            <option key={option.number} value={option.number}>
              {option.name}
            </option>
          ))}
        </select>

        {resultCount !== undefined ? (
          <span className="pr-vs-count">
            {resultCount} {resultCount === 1 ? "song" : "songs"}
          </span>
        ) : null}
      </div>
    </div>
  );
}