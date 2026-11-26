import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { HighlighterIcon, Trash2Icon, Tag } from "lucide-react";

// A block of text the reader can mark. Select any part of it and the small
// toolbar appears: pick a colour to highlight it, or underline it. The marks
// are stored by the parent so they survive the next visit.

const HIGHLIGHT_COLORS = [
  { id: "gold", value: "#f6dfa4" },
  { id: "green", value: "#cee6d6" },
  { id: "blue", value: "#cfe0f2" },
  { id: "rose", value: "#f3d3d8" }
];

export const highlightColor = (id) => {
  const found = HIGHLIGHT_COLORS.find((colour) => colour.id === id);
  return found ? found.value : HIGHLIGHT_COLORS[0].value;
};

const buildSegments = (text, annotations, nodes) => {
  const points = new Set([0, text.length]);
  annotations.forEach((annotation) => {
    points.add(Math.max(0, Number(annotation.start_offset) || 0));
    points.add(Math.min(text.length, Number(annotation.end_offset) || 0));
  });
  nodes.forEach((node) => {
    points.add(Math.max(0, node.start));
    points.add(Math.min(text.length, node.end));
  });
  const sorted = Array.from(points)
    .filter((point) => point >= 0 && point <= text.length)
    .sort((a, b) => a - b);
  const segments = [];
  let previous = sorted.length ? sorted[0] : 0;
  for (let index = 1; index < sorted.length; index += 1) {
    const end = sorted[index];
    const start = previous;
    previous = end;
    if (end <= start) continue;
    const highlight = annotations.find(
      (annotation) =>
        annotation.kind === "highlight" &&
        Number(annotation.start_offset) <= start &&
        Number(annotation.end_offset) >= end
    );
    const underline = annotations.some(
      (annotation) =>
        annotation.kind === "underline" &&
        Number(annotation.start_offset) <= start &&
        Number(annotation.end_offset) >= end
    );
    const node = nodes.find((item) => item.start === start && item.end === end);
    segments.push({
      key: `${start}-${end}`,
      text: text.slice(start, end),
      highlight,
      underline,
      node
    });
  }
  return segments;
};

export default function AnnotatedText({
  blockId,
  section,
  text,
  nodes = [],
  annotations = [],
  onAnnotate,
  onRemove,
  as: Tag = "p",
  className = "",
  style = {}
}) {
  const containerRef = useRef(null);
  const toolbarRef = useRef(null);
  const [selection, setSelection] = useState(null);

  const readSelection = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const dom = typeof window !== "undefined" ? window.getSelection() : null;
    if (!dom || dom.rangeCount === 0) return;
    const range = dom.getRangeAt(0);
    if (!container.contains(range.startContainer) || !container.contains(range.endContainer)) return;
    const quote = range.toString();
    if (!quote || !quote.trim()) return;
    const before = document.createRange();
    before.selectNodeContents(container);
    before.setEnd(range.startContainer, range.startOffset);
    const start = before.toString().length;
    const rect = range.getBoundingClientRect();
    setSelection({
      start,
      end: start + quote.length,
      quote,
      top: rect.top,
      left: rect.left,
      width: rect.width
    });
  }, []);

  const closeSelection = useCallback(() => {
    setSelection(null);
  }, []);

  useEffect(() => {
    const handlePointer = (event) => {
      if (!selection) return;
      const target = event.target;
      if (containerRef.current && containerRef.current.contains(target)) return;
      if (toolbarRef.current && toolbarRef.current.contains(target)) return;
      setSelection(null);
    };
    document.addEventListener("mousedown", handlePointer);
    return () => document.removeEventListener("mousedown", handlePointer);
  }, [selection]);

  const segments = useMemo(
    () => buildSegments(String(text || ""), annotations, nodes),
    [text, annotations, nodes]
  );

  const mark = (kind, color) => {
    if (!selection || !onAnnotate) return;
    onAnnotate({
      section,
      block_id: blockId,
      kind,
      color: color || null,
      start_offset: selection.start,
      end_offset: selection.end,
      quote: selection.quote
    });
    const dom = typeof window !== "undefined" ? window.getSelection() : null;
    if (dom) dom.removeAllRanges();
    setSelection(null);
  };

  const clearMarks = () => {
    if (!selection || !onRemove) return;
    annotations
      .filter(
        (annotation) =>
          Number(annotation.start_offset) < selection.end &&
          Number(annotation.end_offset) > selection.start
      )
      .forEach((annotation) => onRemove(annotation));
    const dom = typeof window !== "undefined" ? window.getSelection() : null;
    if (dom) dom.removeAllRanges();
    setSelection(null);
  };

  const toolbarLeft = selection
    ? Math.min(Math.max(selection.left + selection.width / 2, 90), window.innerWidth - 90)
    : 0;
  const toolbarTop = selection ? Math.max(selection.top - 46, 12) : 0;

  return (
    <>
      <Tag
        ref={containerRef}
        className={className}
        style={{ ...style, userSelect: "text", WebkitUserSelect: "text" }}
        data-block={blockId}
        onMouseUp={readSelection}
        onKeyUp={readSelection}
      >
        {segments.map((segment) => {
          if (segment.node) {
            return <React.Fragment key={segment.key}>{segment.node.render}</React.Fragment>;
          }
          let content = segment.text;
          if (segment.underline) {
            content = <span className="pr-annot-underline">{content}</span>;
          }
          if (segment.highlight) {
            content = (
              <span
                className="pr-annot-highlight"
                style={{ backgroundColor: highlightColor(segment.highlight.color) }}
              >
                {content}
              </span>
            );
          }
          return <React.Fragment key={segment.key}>{content}</React.Fragment>;
        })}
      </Tag>

      {selection && onAnnotate ? (
        <div
          ref={toolbarRef}
          className="pr-annot-toolbar"
          style={{ top: toolbarTop, left: toolbarLeft }}
          role="toolbar"
          aria-label="Mark this text"
          onMouseDown={(event) => event.stopPropagation()}
          onClick={(event) => event.stopPropagation()}
        >
          <span className="pr-annot-toolbar-icon" aria-hidden="true">
            <HighlighterIcon className="h-4 w-4" />
          </span>
          {HIGHLIGHT_COLORS.map((colour) => (
            <button
              key={colour.id}
              type="button"
              className="pr-annot-swatch"
              style={{ backgroundColor: colour.value }}
              aria-label={`Highlight ${colour.id}`}
              onClick={() => mark("highlight", colour.id)}
            />
          ))}
          <button
            type="button"
            className="pr-annot-action pr-annot-underline-btn"
            aria-label="Underline this text"
            onClick={() => mark("underline", null)}
          >
            U
          </button>
          {onRemove ? (
            <button
              type="button"
              className="pr-annot-action"
              aria-label="Remove the marks on this text"
              onClick={clearMarks}
            >
              <Trash2Icon className="h-4 w-4" />
            </button>
          ) : null}
        </div>
      ) : null}
    </>
  );
}