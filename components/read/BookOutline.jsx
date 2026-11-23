import React from "react";
import AnnotatedText from "@/components/read/AnnotatedText";
import { parseOutlineRange } from "@/lib/scriptureRefs";
import { selectionInside } from "@/lib/textSelection";

/**
 * The outline of the book. Every heading and every verse range opens the
 * exact part of the book, and the division the reader is working on stays
 * highlighted.
 */
export default function BookOutline({
  book,
  guide,
  annotations,
  onAnnotate,
  onRemove,
  onSelectPassage,
  selection
}) {
  const forBlock = (blockId) =>
    annotations.filter((annotation) => annotation.block_id === blockId);

  const goTo = (payload, point, event) => {
    if (selectionInside(event.currentTarget)) return;
    onSelectPassage({
      index: payload.index,
      label: payload.label,
      range: payload.range,
      chapter: point.chapter,
      verse: point.verse
    });
  };

  return (
    <div className="pr-sel-outline">
      <p className="pr-sel-panel-title">{book.name} Outline</p>
      <p className="pr-sel-hint">Tap a heading to jump to that part of the book.</p>

      <div className="pr-sel-outline-list">
        {guide.outline.map(([label, range], index) => {
          const parsed = parseOutlineRange(range, book);
          const blockId = `outline-${index}`;
          const isSelected = Boolean(selection && selection.index === index);
          const payload = { index, label, range };
          const start = parsed ? parsed.start : { chapter: 1, verse: 1 };
          return (
            <div
              key={`${label}-${range}`}
              className={`pr-sel-outline-row${isSelected ? " is-selected" : ""}`}
            >
              <span
                className="pr-sel-outline-label"
                role="button"
                tabIndex={0}
                onClick={(event) => goTo(payload, start, event)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    goTo(payload, start, event);
                  }
                }}
              >
                <AnnotatedText
                  as="span"
                  blockId={blockId}
                  section="outline"
                  text={label}
                  annotations={forBlock(blockId)}
                  onAnnotate={onAnnotate}
                  onRemove={onRemove}
                />
              </span>

              <span className="pr-sel-outline-range">
                {parsed ? (
                  <>
                    <button
                      type="button"
                      className="pr-sel-range-link"
                      onClick={(event) => goTo(payload, parsed.start, event)}
                    >
                      {parsed.startLabel}
                    </button>
                    {parsed.endLabel !== parsed.startLabel ? (
                      <>
                        <span className="pr-sel-range-dash"> - </span>
                        <button
                          type="button"
                          className="pr-sel-range-link"
                          onClick={(event) => goTo(payload, parsed.end, event)}
                        >
                          {parsed.endLabel}
                        </button>
                      </>
                    ) : null}
                  </>
                ) : (
                  <span>{range}</span>
                )}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}