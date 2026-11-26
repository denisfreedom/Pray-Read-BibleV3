import React, { useState } from "react";
import {
  HighlighterIcon,
  BookmarkIcon,
  CopyIcon,
  Share2Icon,
  NotebookPenIcon,
  Link2Icon,
  HeartHandshakeIcon,
  MessageCircleIcon,
  XIcon
} from "lucide-react";
import { copyToClipboard } from "@/lib/share";

const COLORS = [
  { id: "yellow", label: "Yellow", value: "#fde68a" },
  { id: "green", label: "Green", value: "#bbf7d0" },
  { id: "pink", label: "Pink", value: "#fbcfe8" },
  { id: "blue", label: "Blue", value: "#bfdbfe" }
];

/**
 * The actions of one verse.
 *
 * They are laid out in the order the reader works in: the prayer passage
 * first, then the cross references, the commentary, the highlight, the share
 * and the bookmark. The copy and the note keep the end of the row.
 */
export default function VerseActionBar({
  verse,
  onHighlight,
  onBookmark,
  onNote,
  onCrossRef,
  onPrayer,
  onCommentary,
  onShare,
  onClose
}) {
  const [note, setNote] = useState("");
  const [showNote, setShowNote] = useState(false);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    const ok = await copyToClipboard(verse.text);
    if (ok) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    }
  };

  const share = () => {
    if (onShare) {
      onShare(verse.verse);
      return;
    }
    if (navigator.share) {
      navigator.share({ title: `Verse ${verse.verse}`, text: verse.text }).catch(() => {});
    } else {
      copy();
    }
  };

  return (
    <div
      className="pr-card"
      style={{ padding: 14, marginBottom: 12, borderColor: "var(--pr-gold)" }}
      onClick={(event) => event.stopPropagation()}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
        <span className="pr-eyebrow">Verse {verse.verse}</span>
        <button type="button" className="pr-icon-btn" style={{ width: 32, height: 32 }} onClick={onClose} aria-label="Close actions">
          <XIcon className="h-4 w-4" />
        </button>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
        {onPrayer ? (
          <button type="button" className="pr-chip" onClick={() => onPrayer(verse.verse)} style={{ cursor: "pointer" }}>
            <HeartHandshakeIcon className="h-4 w-4" /> Prayer passage
          </button>
        ) : null}
        <button type="button" className="pr-chip" onClick={() => onCrossRef(verse.verse)} style={{ cursor: "pointer" }}>
          <Link2Icon className="h-4 w-4" /> Cross-references
        </button>
        {onCommentary ? (
          <button type="button" className="pr-chip" onClick={() => onCommentary(verse.verse)} style={{ cursor: "pointer" }}>
            <MessageCircleIcon className="h-4 w-4" /> Commentary
          </button>
        ) : null}
        {COLORS.map((color) => (
          <button
            key={color.id}
            type="button"
            onClick={() => onHighlight(verse.verse, color.id)}
            title={`Highlight the whole verse in ${color.label}`}
            aria-label={`Highlight the whole verse in ${color.label}`}
            style={{
              width: 30,
              height: 30,
              borderRadius: 999,
              background: color.value,
              border: "1px solid var(--pr-border)",
              cursor: "pointer"
            }}
          />
        ))}
        <button type="button" className="pr-chip" onClick={share} style={{ cursor: "pointer" }}>
          <Share2Icon className="h-4 w-4" /> Share
        </button>
        <button type="button" className="pr-chip" onClick={() => onBookmark(verse.verse)} style={{ cursor: "pointer" }}>
          <BookmarkIcon className="h-4 w-4" /> Bookmark
        </button>
        <button type="button" className="pr-chip" onClick={copy} style={{ cursor: "pointer" }}>
          <CopyIcon className="h-4 w-4" /> {copied ? "Copied" : "Copy"}
        </button>
        <button type="button" className="pr-chip" onClick={() => setShowNote((value) => !value)} style={{ cursor: "pointer" }}>
          <NotebookPenIcon className="h-4 w-4" /> Add note
        </button>
      </div>

      <p
        style={{
          margin: "10px 0 0",
          fontSize: "calc(0.78rem * var(--pr-verse-scale, 1))",
          color: "var(--pr-body)"
        }}
      >
        <HighlighterIcon className="h-4 w-4" style={{ display: "inline", verticalAlign: "-2px" }} /> Drag over the words you
        want to mark to highlight or underline only that part of the verse.
      </p>

      {showNote ? (
        <div style={{ marginTop: 12 }}>
          <label className="pr-label" htmlFor={`note-${verse.verse}`}>
            Your note
          </label>
          <textarea
            id={`note-${verse.verse}`}
            className="pr-textarea"
            style={{ minHeight: 84 }}
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="What is God saying to you here?"
          />
          <button
            type="button"
            className="pr-btn pr-btn-primary pr-btn-sm"
            style={{ marginTop: 8 }}
            onClick={() => {
              onNote(verse.verse, note);
              setNote("");
              setShowNote(false);
            }}
          >
            Save note
          </button>
        </div>
      ) : null}
    </div>
  );
}