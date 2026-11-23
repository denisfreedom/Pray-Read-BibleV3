import React from "react";
import AnnotatedText from "@/components/read/AnnotatedText";
import { getKeyPassages } from "@/lib/keyPassages";
import { parseReference } from "@/lib/scriptureRefs";
import { selectionInside } from "@/lib/textSelection";

const ENCOURAGEMENT =
  "Read it slowly, one chapter at a time, and let each chapter become a conversation with God rather than a line to get through.";

/**
 * The book introduction. The text can be marked by the reader, and the key
 * passages open in the scripture popup so nothing has to be left behind.
 */
export default function BookIntro({
  book,
  guide,
  accent,
  annotations,
  onAnnotate,
  onRemove,
  onOpenPassage
}) {
  const testament = book.number <= 39 ? "Old Testament" : "New Testament";
  const passages = getKeyPassages(book);
  const forBlock = (blockId) =>
    annotations.filter((annotation) => annotation.block_id === blockId);

  const openReference = (label, event) => {
    if (selectionInside(event.currentTarget)) return;
    const reference = parseReference(label);
    if (reference) onOpenPassage(reference);
  };

  return (
    <div className="pr-sel-intro">
      <div className="pr-sel-facts">
        <span className="pr-sel-fact" style={{ background: `${accent}1a`, color: accent }}>
          {testament}
        </span>
        <span className="pr-sel-fact" style={{ background: "#f1efe6", color: "#5d6d5d" }}>
          {book.chapters} {book.chapters === 1 ? "chapter" : "chapters"}
        </span>
        <span className="pr-sel-fact" style={{ background: "#f1efe6", color: "#5d6d5d" }}>
          {book.abbr}
        </span>
      </div>

      <AnnotatedText
        as="p"
        blockId="intro-main"
        section="intro"
        text={guide.intro}
        annotations={forBlock("intro-main")}
        onAnnotate={onAnnotate}
        onRemove={onRemove}
        className="pr-sel-paragraph"
      />

      <AnnotatedText
        as="p"
        blockId="intro-soft"
        section="intro"
        text={ENCOURAGEMENT}
        annotations={forBlock("intro-soft")}
        onAnnotate={onAnnotate}
        onRemove={onRemove}
        className="pr-sel-paragraph pr-sel-paragraph-soft"
      />

      <p className="pr-sel-panel-title pr-sel-subtitle">Key passages</p>
      <div className="pr-sel-refs">
        {passages.map((label, index) => {
          const blockId = `intro-ref-${index}`;
          return (
            <button
              key={label}
              type="button"
              className="pr-sel-ref-chip"
              onClick={(event) => openReference(label, event)}
            >
              <AnnotatedText
                as="span"
                blockId={blockId}
                section="intro"
                text={label}
                annotations={forBlock(blockId)}
                onAnnotate={onAnnotate}
                onRemove={onRemove}
                className="pr-sel-ref-text"
              />
            </button>
          );
        })}
      </div>

      <p className="pr-sel-hint">
        Select any text to highlight or underline it. Tap a passage to read it here.
      </p>
    </div>
  );
}