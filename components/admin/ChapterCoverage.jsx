import React, { useMemo, useState } from "react";
import { AlertTriangleIcon, CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";

/**
 * Turns a list of chapter numbers into a short list of ranges, so a book
 * that is missing eleven chapters reads "2-5, 9, 12" and not a long row of
 * single numbers.
 */
export const compressChapters = (list) => {
  const numbers = [...(list || [])]
    .map((value) => Number(value))
    .filter((value) => Number.isFinite(value))
    .sort((a, b) => a - b);
  const parts = [];
  let start = null;
  let previous = null;
  numbers.forEach((number) => {
    if (start === null) {
      start = number;
      previous = number;
      return;
    }
    if (number === previous + 1) {
      previous = number;
      return;
    }
    parts.push(start === previous ? `${start}` : `${start}-${previous}`);
    start = number;
    previous = number;
  });
  if (start !== null) {
    parts.push(start === previous ? `${start}` : `${start}-${previous}`);
  }
  return parts;
};

/**
 * The coverage of the Bible in the app.
 *
 * Every book of the Bible is shown with the chapters that are ready and the
 * chapters that are still missing, so the administrator can see exactly
 * where the install stands, from Genesis to Revelation.
 */
export default function ChapterCoverage({ books = [], missing = 0, broken = 0 }) {
  const [open, setOpen] = useState(false);

  const rows = useMemo(() => {
    return (books || []).map((book) => {
      const absent = compressChapters(book.missing);
      const damaged = compressChapters(book.broken);
      return {
        ...book,
        absent,
        damaged,
        sound: absent.length === 0 && damaged.length === 0
      };
    });
  }, [books]);

  const complete = rows.filter((row) => row.sound).length;

  return (
    <div className="pr-card pr-card-pad" style={{ marginTop: 18 }}>
      <button
        type="button"
        className="pr-btn pr-btn-outline pr-btn-sm"
        onClick={() => setOpen((value) => !value)}
        style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
      >
        {open ? <ChevronUpIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />}
        {open ? "Hide the books" : `Show the books (${complete} of ${rows.length} complete)`}
      </button>

      <p style={{ margin: "10px 0 0", fontSize: "0.84rem", color: "var(--pr-body)" }}>
        {missing} chapters are not in the app yet
        {broken > 0 ? ` and ${broken} cannot be read` : ""}. The list below shows where they are.
      </p>

      {open ? (
        <div
          style={{
            marginTop: 14,
            maxHeight: 320,
            overflowY: "auto",
            border: "1px solid var(--pr-border)",
            borderRadius: 12
          }}
        >
          {rows.map((row) => (
            <div
              key={row.number}
              style={{
                display: "flex",
                gap: 10,
                alignItems: "flex-start",
                padding: "9px 12px",
                borderBottom: "1px solid var(--pr-border)",
                fontSize: "0.83rem"
              }}
            >
              <span style={{ flex: "0 0 auto", marginTop: 2 }}>
                {row.sound ? (
                  <CheckIcon className="h-4 w-4" style={{ color: "var(--pr-emerald)" }} />
                ) : (
                  <AlertTriangleIcon className="h-4 w-4" style={{ color: "#b45309" }} />
                )}
              </span>
              <span style={{ flex: "1 1 auto", minWidth: 0 }}>
                <strong>{row.name}</strong>
                <span style={{ color: "var(--pr-body)" }}>
                  {" "}
                  · {row.ready} of {row.chapters} chapters ready
                </span>
                {!row.sound ? (
                  <span style={{ display: "block", color: "var(--pr-body)", marginTop: 2 }}>
                    {row.absent.length ? `Missing: ${row.absent.join(", ")}` : ""}
                    {row.absent.length && row.damaged.length ? " · " : ""}
                    {row.damaged.length ? `To repair: ${row.damaged.join(", ")}` : ""}
                  </span>
                ) : null}
              </span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}