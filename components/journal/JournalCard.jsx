import React from "react";
import { PencilIcon, Trash2Icon } from "lucide-react";
import { formatDateLabel } from "@/lib/reading";

export default function JournalCard({ entry, onEdit, onDelete }) {
  return (
    <div className="pr-card pr-card-pad">
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
        <span className="pr-badge pr-badge-outline">{entry.category || "reflection"}</span>
        <div style={{ display: "flex", gap: 6 }}>
          <button
            type="button"
            onClick={() => onEdit(entry)}
            aria-label="Edit entry"
            className="pr-icon-btn"
            style={{ width: 34, height: 34 }}
          >
            <PencilIcon className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(entry)}
            aria-label="Delete entry"
            className="pr-icon-btn"
            style={{ width: 34, height: 34 }}
          >
            <Trash2Icon className="h-4 w-4" />
          </button>
        </div>
      </div>

      <h3 className="pr-heading" style={{ margin: "14px 0 0", fontSize: "1.1rem", fontWeight: 800 }}>
        {entry.title || "Untitled entry"}
      </h3>
      <p style={{ margin: "10px 0 0", whiteSpace: "pre-wrap", fontSize: "0.92rem", lineHeight: 1.75 }}>
        {entry.body}
      </p>
      <p style={{ margin: "14px 0 0", fontSize: "0.78rem" }}>
        {formatDateLabel(entry.entry_date)}
        {entry.book ? ` · ${entry.book}${entry.chapter ? ` ${entry.chapter}` : ""}` : ""}
      </p>
    </div>
  );
}