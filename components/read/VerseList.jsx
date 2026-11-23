import React from "react";

export default function VerseList({ verses, selectedVerse, onSelectVerse, highlights }) {
  return (
    <div className="space-y-1">
      {verses.map((verse) => {
        const selected = selectedVerse === verse.verse;
        const highlighted = highlights.includes(verse.verse);
        return (
          <button
            key={verse.verse}
            type="button"
            onClick={() => onSelectVerse(verse.verse)}
            className={`flex w-full items-start gap-2 rounded-lg px-2 py-1.5 text-left transition-colors ${
              selected ? "bg-amber-50 ring-1 ring-amber-200" : "hover:bg-slate-50"
            }`}
          >
            <span
              className={`mt-1 w-6 flex-shrink-0 text-right text-xs font-bold ${
                highlighted ? "text-amber-500" : "text-slate-400"
              }`}
            >
              {verse.verse}
            </span>
            <span className="font-serif text-base leading-8 text-slate-800">{verse.text}</span>
          </button>
        );
      })}
    </div>
  );
}