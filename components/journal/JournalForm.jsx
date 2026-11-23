import React, { useEffect, useState } from "react";

const CATEGORIES = ["praise", "petition", "confession", "thanksgiving", "reflection"];

export default function JournalForm({ initial, onSave, onCancel, saving }) {
  const [title, setTitle] = useState(initial?.title || "");
  const [body, setBody] = useState(initial?.body || "");
  const [category, setCategory] = useState(initial?.category || "reflection");
  const [book, setBook] = useState(initial?.book || "");
  const [chapter, setChapter] = useState(initial?.chapter ? String(initial.chapter) : "");
  const [error, setError] = useState("");

  useEffect(() => {
    setTitle(initial?.title || "");
    setBody(initial?.body || "");
    setCategory(initial?.category || "reflection");
    setBook(initial?.book || "");
    setChapter(initial?.chapter ? String(initial.chapter) : "");
  }, [initial]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!title.trim() && !body.trim()) {
      setError("Write a title or a few words before saving.");
      return;
    }
    setError("");
    onSave({
      title: title.trim() || "Untitled entry",
      body: body.trim(),
      category,
      book: book.trim(),
      chapter: chapter ? Number(chapter) : null
    });
  };

  return (
    <form onSubmit={handleSubmit} className="pr-card pr-card-pad">
      <h3 className="pr-heading" style={{ margin: 0, fontSize: "1rem", fontWeight: 800 }}>
        New journal entry
      </h3>

      <div className="pr-grid pr-grid-2" style={{ marginTop: 16 }}>
        <input
          className="pr-input"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Title"
          aria-label="Title"
        />
        <select
          className="pr-select"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          aria-label="Category"
        >
          {CATEGORIES.map((item) => (
            <option key={item} value={item}>
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <textarea
        className="pr-textarea"
        style={{ marginTop: 12 }}
        value={body}
        onChange={(event) => setBody(event.target.value)}
        rows={5}
        placeholder="What is on your heart?"
        aria-label="Journal entry"
      />

      <div className="pr-grid pr-grid-2" style={{ marginTop: 12 }}>
        <input
          className="pr-input"
          value={book}
          onChange={(event) => setBook(event.target.value)}
          placeholder="Book (optional)"
          aria-label="Book"
        />
        <input
          className="pr-input"
          type="number"
          min={1}
          value={chapter}
          onChange={(event) => setChapter(event.target.value)}
          placeholder="Chapter (optional)"
          aria-label="Chapter"
        />
      </div>

      {error ? <div className="pr-error" style={{ marginTop: 12 }}>{error}</div> : null}

      <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
        <button type="submit" className="pr-btn pr-btn-primary" disabled={saving}>
          {saving ? "Saving…" : "Save entry"}
        </button>
        <button type="button" className="pr-btn pr-btn-outline" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}