import React from "react";
import CrossRefScripture, { referenceLabel } from "@/components/read/CrossRefScripture";
import { Link2Icon } from "lucide-react";

/**
 * The cross-references of one verse.
 *
 * Every reference written for the verse is listed under it: the verse it
 * points to, the full text of that verse in the language the reader is
 * reading and the note that goes with it. The text is fetched from the
 * same source the reader is reading from, so the scripture is read where
 * the reference stands and the reader never has to leave the chapter.
 */
export default function VerseCrossRefs({
  verse,
  language = "en",
  versionId = "kjv",
  references = [],
  anchorId = "",
  onOpenReference
}) {
  const rows = references || [];

  return (
    <div
      className="pr-card"
      id={anchorId || undefined}
      style={{
        padding: 14,
        marginBottom: 12,
        borderColor: "var(--pr-gold)",
        background: "var(--pr-ivory-soft)"
      }}
    >
      <span className="pr-eyebrow">
        <Link2Icon className="h-4 w-4" style={{ display: "inline", marginInlineEnd: 6 }} />
        Cross-references
      </span>

      {rows.length === 0 ? (
        <p style={{ margin: "12px 0 0", fontSize: "calc(0.88rem * var(--pr-verse-scale, 1))" }}>
          No cross-reference is written for this verse yet.
        </p>
      ) : null}

      <ul style={{ listStyle: "none", margin: "12px 0 0", padding: 0, display: "grid", gap: 14 }}>
        {rows.map((row, index) => {
          const label = referenceLabel(row);
          const note = language === "lu" ? row.note_lu : row.note_en;
          return (
            <li key={row.id || `${label}-${index}`}>
              <button
                type="button"
                className="pr-passage-prayer-ref"
                onClick={() => onOpenReference && onOpenReference(row)}
              >
                {label}
              </button>
              <CrossRefScripture row={row} language={language} versionId={versionId} />
              {note ? (
                <p
                  style={{
                    margin: "6px 0 0",
                    fontSize: "calc(0.85rem * var(--pr-verse-scale, 1))",
                    color: "var(--pr-body)"
                  }}
                >
                  {note}
                </p>
              ) : null}
            </li>
          );
        })}
      </ul>
    </div>
  );
}