import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchPublicCollection } from "@/lib/contentApi";
import { INSIGHTS } from "@/lib/seedContent";
import { getBookStudyInsights } from "@/lib/bookStudyContent";
import { parseReference } from "@/lib/scriptureRefs";
import { selectionInside } from "@/lib/textSelection";
import AnnotatedText from "@/components/read/AnnotatedText";
import { LandmarkIcon, LightbulbIcon } from "lucide-react";

const EMPTY = [];

// The two kinds of insight the resources tab carries. They mirror the two
// kinds the content manager writes: a theological and a historical insight.
const SECTIONS = [
  { kind: "theological", label: "Theological insight", icon: LightbulbIcon },
  { kind: "historical", label: "Historical insight", icon: LandmarkIcon }
];

/**
 * The resources panel of the chapter reader.
 *
 * It carries the theological and the historical insight of the chapter that
 * is open. When the content manager has not written one for the chapter, the
 * insight written for the book is shown instead, so the panel is never empty.
 * The text can be marked and every passage opens in the reader popup.
 */
export default function ChapterResourcesPanel({
  book,
  chapter,
  annotations = EMPTY,
  onAnnotate,
  onRemove,
  onOpenPassage,
  panelOpen = false
}) {
  const bookNumber = book ? book.number : 0;

  const { data: insightRows = EMPTY } = useQuery({
    queryKey: ["chapterInsights"],
    queryFn: () => fetchPublicCollection("insights")
  });

  const bookInsights = useMemo(() => (book ? getBookStudyInsights(book) : null), [bookNumber, book]);

  const sections = useMemo(() => {
    const all = [...(insightRows || []), ...INSIGHTS];
    const wanted = Number(chapter);
    return SECTIONS.map((section) => {
      const matching = all.filter((row) => {
        if (!row || row.kind !== section.kind) return false;
        const reference = parseReference(row.passage);
        if (!reference) return false;
        if (Number(reference.bookNumber) !== Number(bookNumber)) return false;
        return Number(reference.chapter) === wanted;
      });
      const fallback = bookInsights ? bookInsights[section.kind] : null;
      const items = matching.length
        ? matching.map((row) => ({
            title: row.title || `${section.label} on ${row.passage}`,
            badge: row.passage,
            body: row.excerpt || row.body || ""
          }))
        : fallback && fallback.body
          ? [{ title: fallback.title || section.label, badge: `For ${book.name}`, body: fallback.body }]
          : [];
      return { ...section, items };
    });
  }, [bookNumber, chapter, insightRows, bookInsights, book]);

  const forBlock = (blockId) => annotations.filter((annotation) => annotation.block_id === blockId);

  const openReference = (label, event) => {
    if (event && selectionInside(event.currentTarget)) return;
    const reference = parseReference(label);
    if (reference && onOpenPassage) onOpenPassage(reference);
  };

  if (!book) return null;

  return (
    <aside className={`pr-chapter-side${panelOpen ? " is-open" : ""}`} id="chapter-panel">
      {sections.map((section) => (
        <section className="pr-chapter-card" key={section.kind} id={`chapter-${section.kind}-panel`}>
          <header className="pr-chapter-card-head">
            <section.icon className="h-4 w-4" aria-hidden="true" />
            <div>
              <p className="pr-chapter-card-title">{section.label}</p>
              <p className="pr-chapter-card-sub">
                {book.name} {chapter} · {section.items.length} note{section.items.length === 1 ? "" : "s"}
              </p>
            </div>
          </header>
          <div className="pr-chapter-scroll">
            {section.items.length === 0 ? (
              <p className="pr-chapter-hint" style={{ marginTop: 0 }}>
                Nothing has been written about {book.name} {chapter} yet.
              </p>
            ) : null}
            {section.items.map((item, index) => {
              const blockId = `chapter-${section.kind}-${bookNumber}-${chapter}-${index}`;
              return (
                <article key={`${section.kind}-${index}`} className="pr-chapter-note">
                  {item.badge ? <span className="pr-chapter-badge">{item.badge}</span> : null}
                  <p className="pr-chapter-note-title">{item.title}</p>
                  <AnnotatedText
                    blockId={blockId}
                    section={`chapter-${section.kind}`}
                    text={item.body}
                    annotations={forBlock(blockId)}
                    onAnnotate={onAnnotate}
                    onRemove={onRemove}
                    className="pr-chapter-note-body"
                  />
                  {section.kind === "theological" && item.badge && parseReference(item.badge) ? (
                    <button
                      type="button"
                      className="pr-chapter-ref"
                      style={{ marginTop: 10 }}
                      onClick={(event) => openReference(item.badge, event)}
                    >
                      {item.badge}
                    </button>
                  ) : null}
                </article>
              );
            })}
            <p className="pr-chapter-hint">
              Select any text to highlight or underline it. Tap the passage to read it here.
            </p>
          </div>
        </section>
      ))}
    </aside>
  );
}