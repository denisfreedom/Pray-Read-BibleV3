import React, { useState } from "react";
import { PencilIcon, PlusIcon, Trash2Icon } from "lucide-react";

/**
 * The topics of the devotional library.
 *
 * A topic that still holds devotionals cannot be deleted: the devotionals
 * have to move to another topic first, so nothing is ever lost.
 */
export default function DevotionalTopicsPanel({ topics = [], devotionals = [], onSave, onDelete, busy }) {
  const [editingId, setEditingId] = useState("");
  const [values, setValues] = useState({ name_en: "", name_lu: "" });
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const start = (topic) => {
    setEditingId(topic ? topic.id : "");
    setValues(topic ? { name_en: topic.name_en || "", name_lu: topic.name_lu || "" } : { name_en: "", name_lu: "" });
    setError("");
    setNotice("");
  };

  const save = async () => {
    if (!values.name_en.trim()) {
      setError("Topic (English) is required");
      return;
    }
    if (!values.name_lu.trim()) {
      setError("Topic (Luganda) is required");
      return;
    }
    setError("");
    await onSave(values, editingId);
    setEditingId("");
    setValues({ name_en: "", name_lu: "" });
    setNotice("The topic was saved.");
  };

  const remove = async (topic) => {
    const used = (devotionals || []).filter(
      (row) => (row.topic || row.category || "") === (topic.name_en || "")
    ).length;
    if (used) {
      setError(
        `“${topic.name_en}” still holds ${used} devotional${used === 1 ? "" : "s"}. Move ${used === 1 ? "it" : "them"} to another topic first.`
      );
      return;
    }
    setError("");
    await onDelete(topic);
    setNotice("The topic was removed.");
  };

  return (
    <div>
      {error ? <div className="pr-error" style={{ marginBottom: 12 }}>{error}</div> : null}
      {notice ? <div className="pr-success" style={{ marginBottom: 12 }}>{notice}</div> : null}

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", marginBottom: 16 }}>
        <input
          className="pr-input"
          style={{ flex: "1 1 180px", minWidth: 0 }}
          placeholder="Topic (English)"
          value={values.name_en}
          onChange={(event) => setValues((current) => ({ ...current, name_en: event.target.value }))}
        />
        <input
          className="pr-input"
          style={{ flex: "1 1 180px", minWidth: 0 }}
          placeholder="Topic (Luganda)"
          value={values.name_lu}
          onChange={(event) => setValues((current) => ({ ...current, name_lu: event.target.value }))}
        />
        <button type="button" className="pr-btn pr-btn-primary pr-btn-sm" onClick={save} disabled={busy}>
          {editingId ? "Save the topic" : <><PlusIcon className="h-4 w-4" /> Add topic</>}
        </button>
        {editingId ? (
          <button type="button" className="pr-btn pr-btn-outline pr-btn-sm" onClick={() => start(null)}>
            Cancel
          </button>
        ) : null}
      </div>

      {!topics.length ? (
        <p style={{ fontSize: "0.9rem" }}>No topics yet. The first topic groups the devotionals.</p>
      ) : null}

      <ul className="pr-list-reset" style={{ display: "grid", gap: 8 }}>
        {topics.map((topic) => (
          <li
            key={topic.id}
            style={{
              display: "flex",
              gap: 12,
              alignItems: "center",
              flexWrap: "wrap",
              padding: "10px 12px",
              border: "1px solid var(--pr-border)",
              borderRadius: 12
            }}
          >
            <strong style={{ color: "var(--pr-heading)" }}>{topic.name_en}</strong>
            <span style={{ fontSize: "0.85rem" }}>{topic.name_lu}</span>
            <span style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
              <button type="button" className="pr-btn pr-btn-outline pr-btn-sm" onClick={() => start(topic)}>
                <PencilIcon className="h-4 w-4" /> Edit
              </button>
              <button type="button" className="pr-btn pr-btn-outline pr-btn-sm" onClick={() => remove(topic)}>
                <Trash2Icon className="h-4 w-4" /> Delete
              </button>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}