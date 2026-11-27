import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchPublicCollection } from "@/lib/contentApi";
import { PRAYERS } from "@/lib/seedContent";
import { getBookPrayer } from "@/lib/bookPrayers";
import { buildInlineNodes, parseReference } from "@/lib/scriptureRefs";
import { selectionInside } from "@/lib/textSelection";
import { fetchBookIntro } from "@/lib/bookIntro";
import AnnotatedText from "@/components/read/AnnotatedText";

/**
 * The prayer for the book. It can be marked like any other passage, and every
 * verse it leans on opens in the scripture popup without leaving the section.
 *
 * The closing prayer that was imported for the book stands in place of the
 * prayer the app can build on its own.
 */
export default function BookPrayerPanel({
  book,
  annotations,
  onAnnotate,
  onRemove,
  onOpenPassage,
  language: readerLanguage = "en"
}) {
  const [language, setLanguage] = useState(readerLanguage);
  const { data: imported } = useQuery({
    queryKey: ["bookIntro", book.number],
    queryFn: () => fetchBookIntro(book.number)
  });
  const hasImportedPrayer = Boolean(imported && (imported.closing_prayer_en || imported.closing_prayer_lu));
  const importedPrayer = hasImportedPrayer
    ? {
        title: imported.title_en || imported.title_lu || `Closing prayer for ${book.name}`,
        body: imported.closing_prayer_en || "",
        body_lu: imported.closing_prayer_lu || ""
      }
    : null;
  const prayer = hasImportedPrayer ? importedPrayer : getBookPrayer(book);
  const prayerTitle = language === "lu" ? prayer.title_lu || "" : prayer.title || prayer.title_en || "";
  const source = language === "lu" ? prayer.body_lu : prayer.body;
  const inline = useMemo(() => buildInlineNodes(source), [source]);
  const blockId = `prayer-${language}`;

  const forBlock = (id) => annotations.filter((annotation) => annotation.block_id === id);

  const { data: library = [] } = useQuery({
    queryKey: ["prayers"],
    queryFn: () => fetchPublicCollection("prayers")
  });

  const rows = library && library.length ? library : (hasImportedPrayer ? [] : PRAYERS);
  const bookPrayers = rows.filter((row) => {
    const reference = parseReference(row.scripture_ref);
    return reference && reference.bookNumber === book.number;
  });

  const nodes = inline.nodes.map((node) => {
    const reference = parseReference(node.ref);
    return {
      start: node.start,
      end: node.end,
      render: (
        <button
          type="button"
          className="pr-sel-inline-ref"
          onClick={(event) => {
            if (selectionInside(event.currentTarget)) return;
            if (reference) onOpenPassage(reference);
          }}
        >
          {node.ref}
        </button>
      )
    };
  });

  const openReference = (label, event) => {
    if (selectionInside(event.currentTarget)) return;
    const reference = parseReference(label);
    if (reference) onOpenPassage(reference);
  };

  return (
    <div className="pr-sel-prayer">
      <div className="pr-sel-prayer-head">
        <p className="pr-sel-panel-title">{prayerTitle}</p>
        <div className="pr-sel-lang-toggle" role="group" aria-label="Prayer language">
          <button
            type="button"
            className={`pr-sel-lang-btn ${language === "en" ? "is-active" : ""}`}
            onClick={() => setLanguage("en")}
          >
            English
          </button>
          <button
            type="button"
            className={`pr-sel-lang-btn ${language === "lu" ? "is-active" : ""}`}
            onClick={() => setLanguage("lu")}
          >
            Luganda
          </button>
        </div>
      </div>

      {language === "lu" && !source ? (
        <p className="pr-sel-prayer-body">Luganda translation is not available.</p>
      ) : null}
      <AnnotatedText
        as="p"
        blockId={blockId}
        section="prayer"
        text={inline.text}
        nodes={nodes}
        annotations={forBlock(blockId)}
        onAnnotate={onAnnotate}
        onRemove={onRemove}
        className="pr-sel-prayer-body"
      />

      {inline.nodes.length ? (
        <div className="pr-sel-refs">
          {inline.nodes.map((node) => (
            <button
              key={node.ref}
              type="button"
              className="pr-sel-ref-chip"
              onClick={(event) => openReference(node.ref, event)}
            >
              {node.ref}
            </button>
          ))}
        </div>
      ) : null}

      {bookPrayers.length ? (
        <div className="pr-sel-prayer-library">
          <p className="pr-sel-panel-title pr-sel-subtitle">From the prayer library</p>
          {bookPrayers.map((row) => {
            const reference = parseReference(row.scripture_ref);
            const body = language === "lu" ? row.body_lu || "" : row.body_en;
            return (
              <div key={row.title} className="pr-sel-library-card">
                <p className="pr-sel-library-title">{row.title}</p>
                {reference ? (
                  <button
                    type="button"
                    className="pr-sel-ref-chip"
                    onClick={(event) => {
                      if (selectionInside(event.currentTarget)) return;
                      onOpenPassage(reference);
                    }}
                  >
                    {reference.label}
                  </button>
                ) : null}
                <p className="pr-sel-library-body">
                  {body || (language === "lu" ? "Luganda translation is not available." : "")}
                </p>
              </div>
            );
          })}
        </div>
      ) : null}

      <p className="pr-sel-hint">
        Select any text to highlight or underline it. Tap a verse to read it here.
      </p>
    </div>
  );
}