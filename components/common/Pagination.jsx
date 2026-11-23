import React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

/**
 * A small pager used by the readers that show long collections of notes.
 * It only appears when there is more than one page.
 */
export default function Pagination({ page, pageCount, onChange, label = "Page" }) {
  if (!pageCount || pageCount < 2) return null;

  const numbers = [];
  const add = (value) => {
    if (value >= 1 && value <= pageCount && !numbers.includes(value)) numbers.push(value);
  };
  add(1);
  add(page - 1);
  add(page);
  add(page + 1);
  add(pageCount);
  const ordered = numbers.sort((a, b) => a - b);

  return (
    <nav className="pr-pager" aria-label={label}>
      <button
        type="button"
        className="pr-pager-btn"
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
      >
        <ChevronLeftIcon className="h-4 w-4" />
      </button>

      <div className="pr-pager-pages">
        {ordered.map((value, index) => (
          <React.Fragment key={value}>
            {index > 0 && value - ordered[index - 1] > 1 ? (
              <span className="pr-pager-gap" aria-hidden="true">
                …
              </span>
            ) : null}
            <button
              type="button"
              className={`pr-pager-page${value === page ? " is-active" : ""}`}
              onClick={() => onChange(value)}
              aria-current={value === page ? "page" : undefined}
            >
              {value}
            </button>
          </React.Fragment>
        ))}
      </div>

      <button
        type="button"
        className="pr-pager-btn"
        onClick={() => onChange(page + 1)}
        disabled={page >= pageCount}
        aria-label="Next page"
      >
        <ChevronRightIcon className="h-4 w-4" />
      </button>

      <span className="pr-pager-label" translate="no">
        {label} {page} of {pageCount}
      </span>
    </nav>
  );
}