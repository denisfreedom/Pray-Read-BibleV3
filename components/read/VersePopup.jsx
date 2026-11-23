import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { fetchChapter } from "@/lib/bibleApi";
import { ExternalLinkIcon, Loader2Icon, XIcon } from "lucide-react";
import AnnotatedText from "@/components/read/AnnotatedText";

/**
 * The in-page scripture popup. A verse opened from the sidebar is read here,
 * without leaving the book page, and it can be marked just like any other
 * passage.
 */
export default function VersePopup({
  passage,
  language = "en",
  annotations = [],
  onAnnotate,
  onRemove,
  onClose
}) {
  const [state, setState] = useState({ status: "loading", verses: [] });

  const bookNumber = passage ? passage.bookNumber : null;
  const chapter = passage ? passage.chapter : null;
  const verse = passage ? passage.verse : null;

  useEffect(() => {
    if (!bookNumber || !chapter) return undefined;
    let active = true;
    setState({ status: "loading", verses: [] });
    fetchChapter({
      bookNumber,
      bookName: passage.bookName,
      chapter,
      language
    })
      .then((data) => {
        if (!active) return;
        const verses = (data && data.verses) || [];
        setState({ status: verses.length ? "ready" : "empty", verses });
      })
      .catch(() => {
        if (active) setState({ status: "error", verses: [] });
      });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookNumber, chapter, language]);

  if (!passage) return null;

  const target = verse || passage.chapter;
  const endVerse = passage.endVerse || target;
  const shown = state.verses.filter((item) => {
    if (!verse) return item.verse === target;
    return item.verse >= Math.max(1, verse - 1) && item.verse <= endVerse + 1;
  });

  const chapterUrl = `${createPageUrl("Chapter")}?book=${bookNumber}&chapter=${chapter}${
    verse ? `&verse=${verse}` : ""
  }`;

  return (
    <div className="pr-verse-popup-backdrop" role="presentation" onClick={onClose}>
      <div
        className="pr-verse-popup"
        role="dialog"
        aria-modal="true"
        aria-label={passage.label}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="pr-verse-popup-head">
          <div>
            <p className="pr-eyebrow pr-eyebrow-light">Scripture</p>
            <h2 className="pr-verse-popup-title">
              {passage.bookName} {passage.chapter}
              {verse ? `:${verse}` : ""}
            </h2>
            {passage.luganda ? (
              <p className="pr-verse-popup-luganda">{passage.luganda}</p>
            ) : null}
          </div>
          <button
            type="button"
            className="pr-verse-popup-close"
            onClick={onClose}
            aria-label="Close the passage"
          >
            <XIcon className="h-4 w-4" />
          </button>
        </div>

        <div className="pr-verse-popup-body">
          {state.status === "loading" ? (
            <p className="pr-verse-popup-status">
              <Loader2Icon className="h-4 w-4 animate-spin" /> Opening the passage…
            </p>
          ) : null}

          {state.status === "error" ? (
            <p className="pr-verse-popup-status">
              This passage could not be opened right now. It is still available in the
              Bible Reader.
            </p>
          ) : null}

          {state.status === "empty" ? (
            <p className="pr-verse-popup-status">
              No verses were found for this passage yet.
            </p>
          ) : null}

          {shown.map((item) => {
            const isTarget = item.verse === target;
            const blockId = `verse:${bookNumber}:${chapter}:${item.verse}`;
            return (
              <div
                key={item.verse}
                className={`pr-verse-popup-verse${isTarget ? " is-target" : ""}`}
              >
                <span className="pr-verse-popup-number">{item.verse}</span>
                <AnnotatedText
                  as="p"
                  blockId={blockId}
                  section="verse"
                  text={item.text}
                  annotations={annotations.filter(
                    (annotation) => annotation.block_id === blockId
                  )}
                  onAnnotate={onAnnotate}
                  onRemove={onRemove}
                  className="pr-verse-popup-text"
                />
              </div>
            );
          })}
        </div>

        <div className="pr-verse-popup-foot">
          <p className="pr-verse-popup-hint">
            Select any part of the verse to highlight or underline it. Your marks are
            saved for this book.
          </p>
          <Link to={chapterUrl} className="pr-btn pr-btn-primary pr-btn-sm">
            <ExternalLinkIcon className="h-4 w-4" /> Open the full chapter
          </Link>
        </div>
      </div>
    </div>
  );
}