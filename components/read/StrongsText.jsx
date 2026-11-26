import React, { useMemo } from "react";

// The Strong's numbers that come with the KJV+ text are marked in the verse
// as codes such as (G2424). They are lifted out of the sentence and shown as
// small blue superscripts: tapping one opens the definition of the word it
// belongs to, without touching the verse itself.

const TOKEN = /\(([GH]\d{1,5})\)/g;

/** The parts of a verse that carries Strong's numbers. */
export const parseStrongs = (text) => {
  const value = String(text || "");
  const out = [];
  if (!value) return out;
  TOKEN.lastIndex = 0;
  let cursor = 0;
  let word = "";
  let match = TOKEN.exec(value);
  while (match) {
    if (match.index > cursor) {
      const chunk = value.slice(cursor, match.index);
      const found = chunk.match(/([A-Za-z'’-]+)[^A-Za-z'’-]*$/);
      if (found) word = found[1];
      out.push({ type: "text", value: chunk });
    }
    out.push({ type: "code", value: match[1], word });
    cursor = match.index + match[0].length;
    match = TOKEN.exec(value);
  }
  TOKEN.lastIndex = 0;
  if (cursor < value.length) out.push({ type: "text", value: value.slice(cursor) });
  return out;
};

/**
 * The plain text of a verse and the nodes that draw its Strong's numbers.
 *
 * The plain text is exactly what the reader sees on the screen, so a mark
 * that is placed on a part of the verse lands on the same words the next
 * time the chapter is opened.
 */
export const strongsContent = (text, onCodeClick) => {
  const parts = parseStrongs(text);
  let plain = "";
  let offset = 0;
  const nodes = [];

  parts.forEach((part, index) => {
    const start = offset;
    plain += part.value;
    offset += part.value.length;
    if (part.type !== "code") return;
    const code = part.value;
    const spoken = part.word;
    const open = (event) => {
      event.stopPropagation();
      event.preventDefault();
      if (typeof onCodeClick === "function") onCodeClick(code, spoken);
    };
    nodes.push({
      start,
      end: offset,
      render: (
        <sup
          key={`code-${index}`}
          className="pr-strongs"
          translate="no"
          role="button"
          tabIndex={0}
          title={`Strong's ${code}`}
          onClick={open}
          onKeyDown={(event) => {
            if (event.key !== "Enter" && event.key !== " ") return;
            open(event);
          }}
        >
          {code}
        </sup>
      )
    });
  });

  return { plain, nodes };
};

export default function StrongsText({ text, className = "", onCodeClick }) {
  const parts = useMemo(() => parseStrongs(text), [text]);

  if (!parts.length) return null;

  const open = (code, word) => {
    if (typeof onCodeClick === "function") onCodeClick(code, word);
  };

  return (
    <span className={className}>
      {parts.map((part, index) =>
        part.type === "code" ? (
          <sup
            key={`code-${index}`}
            className="pr-strongs"
            translate="no"
            role="button"
            tabIndex={0}
            title={`Strong's ${part.value}`}
            onClick={(event) => {
              event.stopPropagation();
              event.preventDefault();
              open(part.value, part.word);
            }}
            onKeyDown={(event) => {
              if (event.key !== "Enter" && event.key !== " ") return;
              event.stopPropagation();
              event.preventDefault();
              open(part.value, part.word);
            }}
          >
            {part.value}
          </sup>
        ) : (
          <span key={`text-${index}`}>{part.value}</span>
        )
      )}
    </span>
  );
}