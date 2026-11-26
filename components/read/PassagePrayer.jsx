import React, { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchPublicCollection } from "@/lib/contentApi";
import { PRAYERS } from "@/lib/seedContent";
import { parseReference } from "@/lib/scriptureRefs";
import AnnotatedText from "@/components/read/AnnotatedText";
import { HeartHandshakeIcon, XIcon } from "lucide-react";

const normalize = (value) => String(value || "").toLowerCase().replace(/\s+/g, " ").trim();

/**
 * True when a prayer reference points at the passage the reader is on.
 * "Psalm 23" matches the whole chapter, "Psalm 23:1" only verse one and
 * "Philippians 4:6-7" both verses of the range.
 */
export const matchesPassage = (reference, bookName, chapter, verse) => {
  const text = normalize(reference);
  const book = normalize(bookName);
  if (!text || !book) return false;
  const stem = book.replace(/s$/, "");
  if (!text.includes(book) && !text.includes(stem)) return false;
  const numbers = (text.match(/\d+/g) || []).map(Number);
  if (!numbers.length) return false;
  if (numbers[0] !== Number(chapter)) return false;
  if (numbers.length === 1) return true;
  return numbers.slice(1).includes(Number(verse));
};

export default function PassagePrayer({
  book,
  chapter,
  verse,
  language = "en",
  annotations = [],
  fallback = null,
  passages = [],
  inline = false,
  anchorId = "",
  onAnnotate,
  onRemove,
  onOpenPassage,
  onClose
}) {
  const [mode, setMode] = useState(language === "lu" ? "lu" : "en");

  // The card follows the language the reader is reading in.
  useEffect(() => {
    setMode(language === "lu" ? "lu" : "en");
  }, [language]);

  const { data: rows = [] } = useQuery({
    queryKey: ["prayers"],
    queryFn: () => fetchPublicCollection("prayers", { authenticated: false })
  });

  const matches = useMemo(() => {
    const source = (rows || []).length ? rows : PRAYERS;
    return (source || []).filter((row) => matchesPassage(row.scripture_ref, book, chapter, verse));
  }, [rows, book, chapter, verse]);

  const forBlock = (blockId) =>
    annotations.filter((annotation) => annotation.block_id === blockId);

  const openReference = (label) => {
    const reference = parseReference(label);
    if (reference && onOpenPassage) onOpenPassage(reference);
  };

  // The prayer written for this verse comes first. When there is none, the
  // prayer of the library for this verse is used, and when there is none of
  // those either, the prayer that closes the chapter.
  const shown = useMemo(() => {
    if ((passages || []).length) {
      return passages.map((row) => ({
        key: row.id || `${row.chapter}-${row.verse || 0}-${row.title_en}`,
        title: row.title_en,
        titleLu: row.title_lu,
        bodyEn: row.prayer_en,
        bodyLu: row.prayer_lu,
        ref: row.scripture_ref
      }));
    }
    if (matches.length) {
      return matches.map((row) => ({
        key: row.id || row.title,
        title: row.title,
        titleLu: row.title_lu,
        bodyEn: row.body_en,
        bodyLu: row.body_lu,
        ref: row.scripture_ref
      }));
    }
    if (fallback && (fallback.body || fallback.bodyLu)) {
      return [
        {
          key: "chapter-prayer",
          title: fallback.title,
          titleLu: fallback.titleLu,
          bodyEn: fallback.body,
          bodyLu: fallback.bodyLu,
          ref: fallback.ref
        }
      ];
    }
    return [];
  }, [matches, fallback, passages]);

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
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
        <span className="pr-eyebrow">
          <HeartHandshakeIcon className="h-4 w-4" style={{ display: "inline", marginInlineEnd: 6 }} />
          {inline ? "Prayer passage" : "Prayer for this passage"}
        </span>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button
            type="button"
            className="pr-chip"
            style={{
              cursor: "pointer",
              background: mode === "en" ? "var(--pr-emerald)" : undefined,
              color: mode === "en" ? "#fff" : undefined,
              borderColor: mode === "en" ? "var(--pr-emerald)" : undefined
            }}
            onClick={() => setMode("en")}
          >
            EN
          </button>
          <button
            type="button"
            className="pr-chip"
            style={{
              cursor: "pointer",
              background: mode === "lu" ? "var(--pr-emerald)" : undefined,
              color: mode === "lu" ? "#fff" : undefined,
              borderColor: mode === "lu" ? "var(--pr-emerald)" : undefined
            }}
            onClick={() => setMode("lu")}
          >
            LU
          </button>
          {inline ? null : (
            <button type="button" className="pr-icon-btn" style={{ width: 32, height: 32 }} onClick={onClose} aria-label="Close prayer">
              <XIcon className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {shown.length === 0 ? (
        <p style={{ margin: "10px 0 0", fontSize: "calc(0.88rem * var(--pr-verse-scale, 1))" }}>
          No prayer from the library is attached to {book} {chapter}
          {verse ? `:${verse}` : ""} yet. Write your own in the prayer journal.
        </p>
      ) : (
        shown.map((row, index) => {
          const blockId = `prayer-passage-${book}-${chapter}-${verse || 0}-${index}`;
          const body = mode === "lu" ? row.bodyLu || row.bodyEn : row.bodyEn || row.bodyLu;
          return (
            <div key={row.key || index} style={{ marginTop: 12 }}>
              <p
                className="pr-heading"
                style={{ margin: 0, fontWeight: 800, fontSize: "calc(0.95rem * var(--pr-verse-scale, 1))" }}
              >
                {mode === "lu" ? row.titleLu || row.title : row.title || "The prayer for this passage"}
              </p>
              {row.ref ? (
                <button type="button" className="pr-passage-prayer-ref" onClick={() => openReference(row.ref)}>
                  {row.ref}
                </button>
              ) : null}
              <AnnotatedText
                blockId={blockId}
                section="prayer-passage"
                text={body || ""}
                annotations={forBlock(blockId)}
                onAnnotate={onAnnotate}
                onRemove={onRemove}
                className="pr-passage-prayer-body"
                style={{ margin: "8px 0 0", lineHeight: 1.65 }}
              />
            </div>
          );
        })
      )}
    </div>
  );
}