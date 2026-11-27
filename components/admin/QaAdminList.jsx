import React, { useMemo, useState } from "react";
import QaLetterBar from "@/components/qa/QaLetterBar";
import { letterCounts, letterOf } from "@/lib/qaLibrary";
import { PencilIcon, Trash2Icon, SearchIcon } from "lucide-react";

/**
 * The list of the questions in the content manager.
 *
 * The list is always read from A to Z, the same sliding letter bar of the
 * public page is used here, and several questions can be switched on or
 * off at once.
 */
export default function QaAdminList({ items, topics, onEdit, onDelete, onBulk }) {
  const [topic, setTopic] = useState("All");
  const [letter, setLetter] = useState("All");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState([]);

  const scoped = useMemo(
    () => items.filter((item) => topic === "All" || item.topic_en === topic),
    [items, topic]
  );

  const filtered = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return scoped
      .filter((item) => {
        if (letter !== "All" && letterOf(item.question_en) !== letter) return false;
        if (!needle) return true;
        return [
          item.question_en,
          item.question_lu,
          item.answer_en,
          item.answer_lu,
          item.topic_en
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(needle);
      })
      .sort((a, b) =>
        String(a.question_en || "").toLowerCase().localeCompare(String(b.question_en || "").toLowerCase())
      );
  }, [scoped, letter, search]);

  const counts = useMemo(() => letterCounts(scoped, "en"), [scoped]);

  const isSelected = (id) => selected.includes(id);
  const toggle = (id) =>
    setSelected((previous) =>
      previous.includes(id) ? previous.filter((entry) => entry !== id) : [...previous, id]
    );
  const toggleAll = () =>
    setSelected((previous) =>
      previous.length === filtered.length ? [] : filtered.map((item) => item.id)
    );

  return (
    <div className="pr-card pr-card-pad">
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 14 }}>
        <select
          className="pr-select"
          style={{ maxWidth: 220 }}
          value={topic}
          onChange={(event) => setTopic(event.target.value)}
          aria-label="Filter by topic"
        >
          <option value="All">All Topics</option>
          {topics.map((entry) => (
            <option key={entry.id || entry.name_en} value={entry.name_en}>
              {entry.name_en}
            </option>
          ))}
        </select>
        <div style={{ position: "relative", flex: "1 1 240px", display: "flex", alignItems: "center" }}>
          <SearchIcon
            className="h-4 w-4"
            style={{ position: "absolute", left: 12, color: "var(--pr-gold-deep)", pointerEvents: "none" }}
          />
          <input
            className="pr-input"
            style={{ width: "100%", paddingLeft: 36 }}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search the questions"
            aria-label="Search the questions"
          />
        </div>
      </div>

      <QaLetterBar letter={letter} onSelect={setLetter} counts={counts} />

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", marginBottom: 12 }}>
        <span className="pr-muted" style={{ fontSize: "0.83rem" }}>
          {filtered.length} {filtered.length === 1 ? "question" : "questions"}
        </span>
        {selected.length ? (
          <>
            <button
              type="button"
              className="pr-btn pr-btn-outline pr-btn-sm"
              onClick={() => onBulk("activate", selected)}
            >
              Activate {selected.length}
            </button>
            <button
              type="button"
              className="pr-btn pr-btn-outline pr-btn-sm"
              onClick={() => onBulk("deactivate", selected)}
            >
              Deactivate {selected.length}
            </button>
            <button
              type="button"
              className="pr-btn pr-btn-danger pr-btn-sm"
              onClick={() => onBulk("delete", selected)}
            >
              Delete {selected.length}
            </button>
            <button type="button" className="pr-btn pr-btn-outline pr-btn-sm" onClick={() => setSelected([])}>
              Clear the selection
            </button>
          </>
        ) : null}
      </div>

      {filtered.length ? (
        <div className="pr-scroll-x">
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.83rem" }}>
            <thead>
              <tr style={{ textAlign: "start", borderBottom: "1px solid var(--pr-border)" }}>
                <th style={{ padding: "8px 10px", width: 34 }}>
                  <input
                    type="checkbox"
                    checked={selected.length > 0 && selected.length === filtered.length}
                    onChange={toggleAll}
                    aria-label="Choose every question"
                  />
                </th>
                {["Topic", "Question (EN)", "Question (LU)", "Letter", "Featured", "Active", ""].map(
                  (label, index) => (
                    <th
                      key={`${label}-${index}`}
                      style={{ padding: "8px 10px", color: "var(--pr-gold-deep)", fontWeight: 800 }}
                    >
                      {label}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id} style={{ borderBottom: "1px solid var(--pr-border)" }}>
                  <td style={{ padding: "8px 10px" }}>
                    <input
                      type="checkbox"
                      checked={isSelected(item.id)}
                      onChange={() => toggle(item.id)}
                      aria-label={`Choose ${item.question_en}`}
                    />
                  </td>
                  <td style={{ padding: "8px 10px" }}>{item.topic_en || " - "}</td>
                  <td style={{ padding: "8px 10px", maxWidth: 260 }}>
                    {String(item.question_en || "").slice(0, 70)}
                  </td>
                  <td style={{ padding: "8px 10px", maxWidth: 220 }}>
                    {String(item.question_lu || "").slice(0, 60)}
                  </td>
                  <td style={{ padding: "8px 10px" }}>{letterOf(item.question_en)}</td>
                  <td style={{ padding: "8px 10px" }}>{item.featured ? "★" : ""}</td>
                  <td style={{ padding: "8px 10px" }}>{item.active === false ? "No" : "Yes"}</td>
                  <td style={{ padding: "8px 10px", whiteSpace: "nowrap" }}>
                    <button
                      type="button"
                      className="pr-btn pr-btn-outline pr-btn-sm"
                      onClick={() => onEdit(item)}
                    >
                      <PencilIcon className="h-3 w-3" style={{ display: "inline" }} /> Edit
                    </button>{" "}
                    <button
                      type="button"
                      className="pr-btn pr-btn-danger pr-btn-sm"
                      onClick={() => onDelete(item)}
                    >
                      <Trash2Icon className="h-3 w-3" style={{ display: "inline" }} /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="pr-muted" style={{ fontSize: "0.86rem" }}>
          No questions match the filters yet.
        </p>
      )}
    </div>
  );
}