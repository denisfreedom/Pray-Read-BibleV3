import React, { useEffect, useRef } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { LETTERS } from "@/lib/qaLibrary";

/**
 * The sliding A to Z bar of the Q&A page.
 *
 * The letters stay on one line and slide left and right: the arrows push
 * them on a computer, a finger slides them on a phone, and the letter that
 * is chosen is always brought into the middle of the row.
 */
export default function QaLetterBar({ letter, onSelect, counts = {} }) {
  const trackRef = useRef(null);

  const centreLetter = (value) => {
    const node = trackRef.current?.querySelector(`[data-letter="${value}"]`);
    if (node && typeof node.scrollIntoView === "function") {
      node.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  };

  const slide = (direction) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: direction * 200, behavior: "smooth" });
  };

  const choose = (value) => {
    onSelect(value);
    centreLetter(value);
  };

  useEffect(() => {
    centreLetter(letter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [letter]);

  const entries = ["All", ...LETTERS];

  return (
    <div className="pr-qa-az">
      <button
        type="button"
        className="pr-qa-az-arrow"
        onClick={() => slide(-1)}
        aria-label="Slide the letters to the left"
      >
        <ChevronLeftIcon className="h-4 w-4" />
      </button>
      <div className="pr-qa-az-track" ref={trackRef}>
        {entries.map((entry) => {
          const count = counts[entry] || 0;
          const chosen = letter === entry;
          const empty = entry !== "All" && count === 0;
          return (
            <button
              key={entry}
              type="button"
              data-letter={entry}
              className={`pr-qa-az-btn${chosen ? " is-active" : ""}${empty ? " is-empty" : ""}`}
              aria-pressed={chosen}
              title={empty ? `No questions under ${entry} yet` : `${count} questions under ${entry}`}
              onClick={() => choose(entry)}
            >
              {entry}
            </button>
          );
        })}
      </div>
      <button
        type="button"
        className="pr-qa-az-arrow"
        onClick={() => slide(1)}
        aria-label="Slide the letters to the right"
      >
        <ChevronRightIcon className="h-4 w-4" />
      </button>
    </div>
  );
}