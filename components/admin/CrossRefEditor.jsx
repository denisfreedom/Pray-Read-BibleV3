import React, { useState } from "react";
import { XIcon, PlusIcon } from "lucide-react";
import { joinRefs, splitRefs } from "@/lib/scriptureRefs";

/**
 * Edits a list of scripture references as small chips.
 * The app keeps the references on one line, so this writes them back in the
 * same shape the reader and the importer use.
 */
export default function CrossRefEditor({ value, onChange, label = "Cross references" }) {
  const refs = splitRefs(value);
  const [draft, setDraft] = useState("");

  const add = () => {
    const next = splitRefs(draft);
    if (!next.length) return;
    const merged = [...refs];
    next.forEach((item) => {
      const known = merged.some((existing) => existing.toLowerCase() === item.toLowerCase());
      if (!known) merged.push(item);
    });
    onChange(joinRefs(merged));
    setDraft("");
  };

  const remove = (item) => {
    onChange(joinRefs(refs.filter((existing) => existing !== item)));
  };

  return (
    <div className="pr-field">
      <label className="pr-label">{label}</label>
      {refs.length ? (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
          {refs.map((item) => (
            <span
              key={item}
              className="pr-chip"
              style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
            >
              {item}
              <button
                type="button"
                onClick={() => remove(item)}
                aria-label={`Remove ${item}`}
                style={{
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  padding: 0,
                  display: "inline-flex",
                  color: "inherit"
                }}
              >
                <XIcon className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      ) : null}
      <div style={{ display: "flex", gap: 8 }}>
        <input
          className="pr-input"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              add();
            }
          }}
          placeholder="John 3:16, Psalm 23:1"
        />
        <button type="button" className="pr-btn pr-btn-outline" onClick={add}>
          <PlusIcon className="h-4 w-4" style={{ display: "inline" }} /> Add
        </button>
      </div>
      <p className="pr-muted" style={{ margin: "6px 0 0", fontSize: "0.76rem" }}>
        Write the reference the way people write it, then press Enter.
      </p>
    </div>
  );
}