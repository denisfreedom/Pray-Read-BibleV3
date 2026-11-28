import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { HighlighterIcon, Trash2Icon, Tag } from "lucide-react";

// A block of text the reader can mark. Select any part of it and the small
// toolbar appears: pick a colour to highlight it, or underline it. The marks
// are stored by the parent so they survive the next visit. Works with mouse,
// touch and keyboard selection.

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

// Character offset of a DOM point (node, offset) measured from the start of the container.
const offsetInside = (container, node, offset) => {
  const range = document.createRange();
  range.selectNodeContents(container);
  range.setEnd(node, offset);
  return range.toString().length;
};

// Drop leading and trailing whitespace so a triple-tap or a long-press does not
// mark the spaces or the line break around the words the reader chose.
const trimToWords = (plain, start, end) => {
  let from = start;
  let to = end;
  while (from < to && /\s/.test(plain[from])) from += 1;
  while (to > from && /\s/.test(plain[to - 1])) to -= 1;
  return { start: from, end: to };
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
  const timerRef = useRef(null);
  const [selection, setSelection] = useState(null);
  const plain = String(text || "");

  const readSelection = useCallback(() => {
    const container = containerRef.current;
    if (!container || typeof window === "undefined") return;
    const dom = window.getSelection();
    if (!dom || dom.rangeCount === 0 || dom.isCollapsed) return;
    const range = dom.getRangeAt(0);
    if (!container.contains(range.startContainer) || !container.contains(range.endContainer)) return;
    const rawStart = offsetInside(container, range.startContainer, range.startOffset);
    const rawEnd = offsetInside(container, range.endContainer, range.endOffset);
    const { start, end } = trimToWords(
      plain,
      Math.max(0, Math.min(rawStart, plain.length)),
      Math.max(0, Math.min(rawEnd, plain.length))
    );
    if (end <= start) return;
    const rect = range.getBoundingClientRect();
    setSelection({
      start,
      end,
      quote: plain.slice(start, end),
      top: rect.top,
      bottom: rect.bottom,
      left: rect.left,
      width: rect.width
    });
  }, [plain]);

  // Mobile and desktop both report the finished selection through selectionchange.
  useEffect(() => {
    const handleChange = () => {
      window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(readSelection, 120);
    };
    document.addEventListener("selectionchange", handleChange);
    return () => {
      document.removeEventListener("selectionchange", handleChange);
      window.clearTimeout(timerRef.current);
    };
  }, [readSelection]);

  // Keep the toolbar attached to the words while the page scrolls.
  useEffect(() => {
    if (!selection) return undefined;
    window.addEventListener("scroll", readSelection, true);
    return () => window.removeEventListener("scroll", readSelection, true);
  }, [selection, readSelection]);

  // A tap or press outside the toolbar dismisses it. A new press on the text
  // starts a new selection, which reopens the toolbar when it is made.
  useEffect(() => {
    if (!selection) return undefined;
    const handlePress = (event) => {
      if (toolbarRef.current && toolbarRef.current.contains(event.target)) return;
      setSelection(null);
    };
    document.addEventListener("mousedown", handlePress);
    document.addEventListener("touchstart", handlePress, { passive: true });
    return () => {
      document.removeEventListener("mousedown", handlePress);
      document.removeEventListener("touchstart", handlePress);
    };
  }, [selection]);

  const segments = useMemo(() => buildSegments(plain, annotations, nodes), [plain, annotations, nodes]);

  const clearDomSelection = () => {
    const dom = typeof window !== "undefined" ? window.getSelection() : null;
    if (dom) dom.removeAllRanges();
  };

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
    clearDomSelection();
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
    clearDomSelection();
    setSelection(null);
  };

  const viewportWidth = typeof window !== "undefined" ? window.innerWidth : 360;
  const viewportHeight = typeof window !== "undefined" ? window.innerHeight : 640;
  const toolbarLeft = selection
    ? Math.min(Math.max(selection.left + selection.width / 2, 150), viewportWidth - 150)
    : 0;
  // On touch screens the phone's own selection bar opens above the words, so
  // the highlight bar always sits below the selection, clear of the handle.
  const isTouch =
    typeof window !== "undefined" &&
    ("ontouchstart" in window || (window.matchMedia && window.matchMedia("(pointer: coarse)").matches));
  // Desktop: above the selection when there is room, otherwise just below it.
  const toolbarTop = selection
    ? isTouch
      ? Math.max(8, Math.min(selection.bottom + 48, viewportHeight - 60))
      : selection.top > 64
        ? selection.top - 48
        : Math.min(selection.bottom + 10, viewportHeight - 56)
    : 0;

  return (
    <>
      <Tag
        ref={containerRef}
        className={className}
        style={{ ...style, userSelect: "text", WebkitUserSelect: "text" }}
        data-block={blockId}
        onMouseUp={readSelection}
        onKeyUp={readSelection}
        onTouchEnd={readSelection}
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
          style={{
            position: "fixed",
            top: toolbarTop,
            left: toolbarLeft,
            transform: "translateX(-50%)",
            zIndex: 60
          }}
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