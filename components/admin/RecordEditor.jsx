import React from "react";
import { XIcon } from "lucide-react";
import CrossRefEditor from "@/components/admin/CrossRefEditor";

/**
 * The form the admin panel uses to add or change one record.
 * The fields come from the collection list, so every collection gets the
 * same form without any extra code.
 */
export default function RecordEditor({
  open,
  title,
  subtitle = "",
  fields,
  values,
  busy = false,
  error = "",
  onChange,
  onSave,
  onCancel
}) {
  if (!open) return null;
  return (
    <div className="pr-modal-backdrop" onClick={onCancel} role="presentation">
      <div
        className="pr-modal"
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="pr-modal-head">
          <button type="button" className="pr-modal-close" onClick={onCancel} aria-label="Close">
            <XIcon className="h-4 w-4" style={{ display: "inline" }} />
          </button>
          <h3 style={{ margin: 0, fontSize: "1.05rem" }}>{title}</h3>
          {subtitle ? (
            <p style={{ margin: "6px 0 0", fontSize: "0.82rem", opacity: 0.85 }}>{subtitle}</p>
          ) : null}
        </div>
        <div className="pr-modal-body">
          {fields.map(([name, label, type]) => {
            if (type === "refs") {
              return (
                <CrossRefEditor
                  key={name}
                  label={label}
                  value={values[name] || ""}
                  onChange={(next) => onChange(name, next)}
                />
              );
            }
            if (type === "boolean") {
              return (
                <div className="pr-field" key={name}>
                  <label
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      fontSize: "0.88rem",
                      color: "var(--pr-heading)",
                      fontWeight: 700
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={values[name] === true || values[name] === "true"}
                      onChange={(event) => onChange(name, event.target.checked)}
                    />
                    {label}
                  </label>
                </div>
              );
            }
            return (
              <div className="pr-field" key={name}>
                <label className="pr-label">{label}</label>
                {type === "textarea" ? (
                  <textarea
                    className="pr-textarea"
                    value={values[name] || ""}
                    onChange={(event) => onChange(name, event.target.value)}
                  />
                ) : type === "number" ? (
                  <input
                    type="number"
                    className="pr-input"
                    value={values[name] === null || values[name] === undefined ? "" : values[name]}
                    onChange={(event) => onChange(name, event.target.value)}
                  />
                ) : (
                  <input
                    className="pr-input"
                    value={values[name] || ""}
                    onChange={(event) => onChange(name, event.target.value)}
                  />
                )}
              </div>
            );
          })}
          {error ? (
            <div className="pr-error" style={{ marginBottom: 14 }}>
              {error}
            </div>
          ) : null}
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", flexWrap: "wrap" }}>
            <button type="button" className="pr-btn pr-btn-outline" onClick={onCancel} disabled={busy}>
              Cancel
            </button>
            <button type="button" className="pr-btn pr-btn-primary" onClick={onSave} disabled={busy}>
              {busy ? "Saving…" : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}