import React from "react";
import { XIcon, ExternalLinkIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function FloatingVerse({ reference, verseText, onClose, chapterUrl }) {
  return (
    <div className="pr-floating" role="dialog" aria-label={reference}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
        <span className="pr-eyebrow">{reference}</span>
        <button type="button" className="pr-icon-btn" style={{ width: 30, height: 30 }} onClick={onClose} aria-label="Close">
          <XIcon className="h-4 w-4" />
        </button>
      </div>
      <p className="pr-serif" style={{ margin: "12px 0 0", fontSize: "1rem", lineHeight: 1.75, color: "var(--pr-heading)" }}>
        {verseText}
      </p>
      <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
        <Link to={createPageUrl("Chapter") + chapterUrl} className="pr-btn pr-btn-primary pr-btn-sm">
          <ExternalLinkIcon className="h-4 w-4" />
          Open in Bible Reader
        </Link>
      </div>
    </div>
  );
}