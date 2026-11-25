import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { getBookByNumber } from "@/lib/bibleBooks";
import { Link2Icon, XIcon } from "lucide-react";

/**
 * The cross-references of one verse.
 *
 * Every reference written for the verse is listed: the verse it points to,
 * the text of that verse in the language the reader is reading and the note
 * that goes with it. A tap opens that verse in the reader.
 *
 * When no reference has been written for the verse itself, the references
 * of the chapter are listed below it, so the reader is never left with an
 * empty window.
 */
export default function CrossRefList({
  verse,
  language = "en",
  references = [],
  chapterGroups = [],
  onClose
}) {
  const navigate = useNavigate();

  const languageText = (row) => {
    if (language === "lu") return row.ref_text_lu || row.ref_text_en || "";
    return row.ref_text_en || row.ref_text_lu || "";
  };

  const languageNote = (row) => {
    if (language === "lu") return row.note_lu || row.note_en || "";
    return row.note_en || row.note_lu || "";
  };

  const open = (row) => {
    const book = getBookByNumber(row.ref_book_number);
    const name = book ? book.name : `Book ${row.ref_book_number}`;
    const url =
      createPageUrl("Chapter") +
      `?book=${row.ref_book_number}&chapter=${row.ref_chapter}&verse=${row.ref_verse}`;
    if (onClose) onClose();
    navigate(url, { state: { reference: `${name} ${row.ref_chapter}:${row.ref_verse}` } });
  };

  const others = useMemo(() => {
    const list = [];
    (chapterGroups || []).forEach((group) => {
      if (Number(group.verse) === Number(verse)) return;
      group.rows.forEach((row) => list.push(row));
    });
    return list;
  }, [chapterGroups, verse]);

  const label = (row) => {
    const book = getBookByNumber(row.ref_book_number);
    const name = book ? book.name : `Book ${row.ref_book_number}`;
    const range =
      row.ref_verse_end && Number(row.ref_verse_end) !== Number(row.ref_verse)
        ? `-${row.ref_verse_end}`
        : "";
    return `${name} ${row.ref_chapter}:${row.ref_verse}${range}`;
  };

  return (
    <div className="pr-floating" role="dialog" aria-label={`Cross-references for verse ${verse}`}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
        <span className="pr-eyebrow">
          <Link2Icon className="h-4 w-4" style={{ display: "inline", marginInlineEnd: 6 }} />
          Cross-references for verse {verse}
        </span>
        <button type="button" className="pr-icon-btn" style={{ width: 30, height: 30 }} onClick={onClose} aria-label="Close">
          <XIcon className="h-4 w-4" />
        </button>
      </div>

      {references.length === 0 ? (
        <p style={{ margin: "12px 0 0", fontSize: "0.88rem" }}>
          No cross-reference has been written for this verse yet. The references of the chapter are listed below.
        </p>
      ) : null}

      {references.length ? (
        <ul className="pr-list-reset" style={{ display: "grid", gap: 10, marginTop: 12 }}>
          {references.map((row, index) => (
            <li key={row.id || index}>
              <button
                type="button"
                className="pr-chapter-ref"
                style={{ display: "block", width: "100%", textAlign: "start", cursor: "pointer" }}
                onClick={() => open(row)}
              >
                {label(row)}
              </button>
              {languageText(row) ? (
                <p className="pr-serif" style={{ margin: "4px 0 0", fontSize: "0.95rem", lineHeight: 1.7 }}>
                  {languageText(row)}
                </p>
              ) : null}
              {languageNote(row) ? (
                <p style={{ margin: "4px 0 0", fontSize: "0.8rem", color: "var(--pr-body)" }}>
                  {languageNote(row)}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}

      {others.length ? (
        <div style={{ marginTop: 14 }}>
          <p className="pr-eyebrow" style={{ margin: "0 0 8px" }}>
            In this chapter
          </p>
          <ul className="pr-list-reset" style={{ display: "grid", gap: 10 }}>
            {others.map((row, index) => (
              <li key={`other-${row.id || index}`}>
                <button
                  type="button"
                  className="pr-chapter-ref"
                  style={{ display: "block", width: "100%", textAlign: "start", cursor: "pointer" }}
                  onClick={() => open(row)}
                >
                  {label(row)}
                </button>
                {languageText(row) ? (
                  <p className="pr-serif" style={{ margin: "4px 0 0", fontSize: "0.9rem", lineHeight: 1.7 }}>
                    {languageText(row)}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}