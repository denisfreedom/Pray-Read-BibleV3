import React from "react";
import { parseReference } from "@/lib/scriptureRefs";
import { HeartHandshakeIcon, RotateCcwIcon, Share2Icon } from "lucide-react";

/**
 * The closing prayer of a chapter.
 *
 * It closes the chapter after the last verse: the full prayer for the chapter
 * in the language the reader is reading, with the amen, a share button and a
 * way back to the prayer in the side panel.
 */
export default function ChapterClosingPrayer({
  book,
  chapter,
  prayer,
  mode = "en",
  onShare,
  onPrayAgain,
  onOpenPassage
}) {
  if (!book || !prayer) return null;

  const english = prayer.body || "";
  const luganda = prayer.bodyLu || "";
  const showEnglish = mode !== "lu" && !!english;
  const showLuganda = mode === "lu" ? !!luganda : mode === "both" && !!luganda;

  return (
    <section className="pr-card pr-closing-card" id="chapter-closing-prayer">
      <header className="pr-closing-head">
        <span className="pr-closing-icon">
          <HeartHandshakeIcon className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <p className="pr-eyebrow">Closing prayer</p>
          <h3 className="pr-closing-title">
            {book.name} {chapter}
          </h3>
        </div>
      </header>

      <div className="pr-closing-body">
        <p className="pr-closing-prayer-title">
          {mode === "lu" && prayer.titleLu ? prayer.titleLu : prayer.title}
        </p>

        {showEnglish ? <p className="pr-closing-text">{english}</p> : null}
        {mode === "lu" && !english && luganda ? <p className="pr-closing-text">{luganda}</p> : null}
        {showLuganda ? <p className="pr-closing-text is-lu">{luganda}</p> : null}

        {prayer.ref ? (
          <button
            type="button"
            className="pr-chapter-ref"
            style={{ marginTop: 12 }}
            onClick={(event) => {
              if (!onOpenPassage) return;
              const parsed = parseReference(prayer.ref);
              if (parsed) onOpenPassage(parsed);
            }}
          >
            {prayer.ref}
          </button>
        ) : null}

        <p className="pr-closing-amen">Amen.</p>
      </div>

      <footer className="pr-closing-foot">
        <button type="button" className="pr-chip" onClick={() => onShare && onShare(prayer)}>
          <Share2Icon className="h-4 w-4" aria-hidden="true" />
          Share prayer
        </button>
        <button type="button" className="pr-chip" onClick={onPrayAgain}>
          <RotateCcwIcon className="h-4 w-4" aria-hidden="true" />
          Pray again
        </button>
      </footer>
    </section>
  );
}