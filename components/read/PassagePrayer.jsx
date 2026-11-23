import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchPublicCollection } from "@/lib/contentApi";
import { PRAYERS } from "@/lib/seedContent";
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

export default function PassagePrayer({ book, chapter, verse, language = "en", onClose }) {
  const [mode, setMode] = useState(language === "lu" ? "lu" : "en");

  const { data: rows = [] } = useQuery({
    queryKey: ["prayers"],
    queryFn: () => fetchPublicCollection("prayers", { authenticated: false })
  });

  const matches = useMemo(() => {
    const source = (rows || []).length ? rows : PRAYERS;
    return (source || []).filter((row) => matchesPassage(row.scripture_ref, book, chapter, verse));
  }, [rows, book, chapter, verse]);

  return (
    <div
      className="pr-card"
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
          Prayer for this passage
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
          <button type="button" className="pr-icon-btn" style={{ width: 32, height: 32 }} onClick={onClose} aria-label="Close prayer">
            <XIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      {matches.length === 0 ? (
        <p style={{ margin: "10px 0 0", fontSize: "0.88rem" }}>
          No prayer from the library is attached to {book} {chapter}
          {verse ? `:${verse}` : ""} yet. Write your own in the prayer journal.
        </p>
      ) : (
        matches.map((row, index) => (
          <div key={row.id || row.title || index} style={{ marginTop: 12 }}>
            <p className="pr-heading" style={{ margin: 0, fontWeight: 800, fontSize: "0.95rem" }}>
              {mode === "lu" ? row.title_lu || row.title : row.title}
            </p>
            {row.scripture_ref ? (
              <p style={{ margin: "2px 0 0", fontSize: "0.78rem", color: "var(--pr-gold-deep)" }}>{row.scripture_ref}</p>
            ) : null}
            <p style={{ margin: "8px 0 0", fontSize: "0.92rem", lineHeight: 1.65, whiteSpace: "pre-line" }}>
              {mode === "lu" ? row.body_lu || row.body_en : row.body_en || row.body_lu}
            </p>
          </div>
        ))
      )}
    </div>
  );
}