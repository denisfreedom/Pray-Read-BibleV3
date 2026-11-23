import React, { useMemo } from "react";

// The Strong's numbers that come with the KJV+ text are marked in the verse
// as codes such as (G1722). They are lifted out of the sentence and shown as
// small superscripts, so the verse still reads like a verse.

const TOKEN = /\s*\(([A-Za-z]?\d{1,5})\)/g;

export default function StrongsText({ text, className = "" }) {
  const parts = useMemo(() => {
    const value = String(text || "");
    const out = [];
    if (!value) return out;
    TOKEN.lastIndex = 0;
    let cursor = 0;
    let match = TOKEN.exec(value);
    while (match) {
      if (match.index > cursor) out.push({ type: "text", value: value.slice(cursor, match.index) });
      out.push({ type: "code", value: match[1] });
      cursor = match.index + match[0].length;
      match = TOKEN.exec(value);
    }
    TOKEN.lastIndex = 0;
    if (cursor < value.length) out.push({ type: "text", value: value.slice(cursor) });
    return out;
  }, [text]);

  if (!parts.length) return null;

  return (
    <span className={className}>
      {parts.map((part, index) =>
        part.type === "code" ? (
          <sup key={`code-${index}`} className="pr-strongs" translate="no">
            {part.value}
          </sup>
        ) : (
          <span key={`text-${index}`}>{part.value}</span>
        )
      )}
    </span>
  );
}