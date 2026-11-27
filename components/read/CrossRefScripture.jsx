import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getBookByNumber } from "@/lib/bibleBooks";
import { fetchPlainChapter } from "@/lib/bibleApi";
import { Loader2Icon } from "lucide-react";

/**
 * The text of the verse a cross-reference points at.
 *
 * The text that came with the file is used when it is there. When it is
 * not, the chapter the reference points at is fetched from the same source
 * the reader is reading from, so the scripture is read in full where the
 * reference stands and the reader never has to leave the chapter.
 */

/** The label of a reference: "Isaiah 34:1" or "Isaiah 14:13-14". */
export const referenceLabel = (row) => {
  if (row?.unresolved && row?.reference_text) return String(row.reference_text);
  const book = getBookByNumber(Number(row && row.ref_book_number));
  const name = book ? book.name : "";
  const chapter = Number(row && row.ref_chapter) || 0;
  const verse = Number(row && row.ref_verse) || 0;
  const end = Number(row && row.ref_verse_end) || 0;
  if (!name || !chapter) return "";
  if (!verse) return `${name} ${chapter}`;
  return end > verse ? `${name} ${chapter}:${verse}-${end}` : `${name} ${chapter}:${verse}`;
};

export default function CrossRefScripture({ row, language = "en", versionId = "kjv" }) {
  const bookNumber = Number(row && row.ref_book_number) || 0;
  const chapter = Number(row && row.ref_chapter) || 0;
  const isUnresolved = Boolean(row?.unresolved || !getBookByNumber(bookNumber) || !chapter || !Number(row?.ref_verse));
  const book = getBookByNumber(bookNumber);
  const stored = language === "lu" ? row.ref_text_lu : row.ref_text_en;

  const { data, isLoading } = useQuery({
    queryKey: ["cross-ref-scripture", bookNumber, chapter, language, versionId],
    queryFn: () => fetchPlainChapter(bookNumber, book ? book.name : "", chapter, language),
    staleTime: 1000 * 60 * 60,
    retry: 2,
    retryDelay: (attempt) => attempt * 1200,
    enabled: !stored && !!book && chapter > 0
  });

  const text = useMemo(() => {
    if (isUnresolved) return "";
    if (stored) return stored;
    const verses = Array.isArray(data) ? data : (data && data.verses) || [];
    const from = Number(row.ref_verse) || 0;
    const to = Number(row.ref_verse_end) || from;
    return verses
      .filter((verse) => {
        const number = Number(verse.verse);
        return number >= from && number <= to;
      })
      .map((verse) => `${verse.verse} ${verse.text}`)
      .join(" ");
  }, [stored, data, row.ref_verse, row.ref_verse_end]);

  if (isUnresolved) {
    return (
      <p style={{ margin: "4px 0 0", fontSize: "calc(0.85rem * var(--pr-verse-scale, 1))" }}>
        This reference could not be matched to a Bible passage.
      </p>
    );
  }

  if (stored) {
    return (
      <p
        className="pr-serif"
        style={{
          margin: "4px 0 0",
          fontSize: "calc(0.9rem * var(--pr-verse-scale, 1))",
          lineHeight: 1.7
        }}
      >
        {stored}
      </p>
    );
  }

  if (isLoading) {
    return (
      <p
        style={{
          margin: "4px 0 0",
          fontSize: "calc(0.85rem * var(--pr-verse-scale, 1))",
          display: "flex",
          alignItems: "center",
          gap: 6
        }}
      >
        <Loader2Icon className="h-3 w-3 animate-spin" />
        Loading the text of this verse...
      </p>
    );
  }

  if (!text) {
    return (
      <p style={{ margin: "4px 0 0", fontSize: "calc(0.85rem * var(--pr-verse-scale, 1))" }}>
        The text of this verse is not available here yet.
      </p>
    );
  }

  return (
    <p
      className="pr-serif"
      style={{
        margin: "4px 0 0",
        fontSize: "calc(0.9rem * var(--pr-verse-scale, 1))",
        lineHeight: 1.7
      }}
    >
      {text}
    </p>
  );
}