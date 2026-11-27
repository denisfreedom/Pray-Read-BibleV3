import React, { useRef, useState } from "react";
import { callAdminData } from "@/lib/adminSession";
import { prepareImport, importShapeOf } from "@/lib/prayerImport";
import {
  UploadIcon,
  DownloadIcon,
  ListIcon,
  Loader2Icon,
  CheckCircleIcon,
  AlertTriangleIcon
} from "lucide-react";

/**
 * The JSON import.
 *
 * A file carries one collection per key, for example "Prayer" or
 * "BibleVerse". Every row is matched against the records already in the app
 * by its natural key, so the same file can be uploaded again safely: the
 * rows that are already there are changed, the new ones are added.
 */

const TEMPLATE = {
  metadata: {
    note: "Pray-Read content import. Delete this key before you fill the file."
  },
  Prayer: [
    {
      title: "A prayer for the light",
      title_lu: "",
      category: "Passage",
      body_en: "Father, let your light shine on us today.",
      body_lu: "",
      scripture_ref: "John 3:16",
      cross_refs: ["John 1:5", "Psalm 27:1"]
    }
  ],
  Devotional: [
    {
      code: "DAY-01",
      title: "In the beginning",
      title_lu: "",
      scripture: "John 1:1",
      scripture_lu: "",
      body: "The Word was with God.",
      body_lu: "",
      related: "Genesis 1:1",
      further_readings: "Colossians 1:15-17",
      day: 1,
      category: "Gospel of John"
    }
  ],
  BibleVerse: []
};

// The friendly names a file may use for a collection.
const ALIASES = {
  prayer: "Prayer",
  prayers: "Prayer",
  passage: "Prayer",
  passages: "Prayer",
  prayer_passages: "Prayer",
  prayer_passage: "Prayer",
  devotional: "Devotional",
  devotionals: "Devotional",
  verse: "BibleVerse",
  verses: "BibleVerse",
  bible_verse: "BibleVerse",
  bible_verses: "BibleVerse",
  commentary: "Commentary",
  commentaries: "Commentary",
  insight: "Insight",
  insights: "Insight",
  qa: "QAEntry",
  qaentry: "QAEntry",
  qa_entries: "QAEntry",
  question: "QAEntry",
  questions: "QAEntry"
};

export const normalisePayload = (parsed) => {
  const source = Array.isArray(parsed) ? { Prayer: parsed } : parsed || {};
  const payload = {};
  Object.entries(source).forEach(([key, value]) => {
    if (key === "metadata" || key === "mode") return;
    // The chapters of a book file are never a collection of their own: they
    // only show where the prayers and the cross-references belong.
    if (key.toLowerCase() === "chapters") return;
    const name = ALIASES[key.toLowerCase()] || key;
    if (Array.isArray(value)) payload[name] = value;
  });
  return payload;
};

/**
 * A book file is not a list of collections: it holds one whole book with its
 * chapters and its verses. Those chapters and verses only show where the
 * prayers and the cross-references belong, so the file is read and the rows
 * of those two collections are prepared from it.
 */
const preparePayload = (parsed) => {
  // Both shapes of the prayer files are read in one place, so a whole-book
  // file is imported the same way here as it is in the other admin tab.
  const shape = importShapeOf(parsed);
  if (shape) {
    const prepared = prepareImport(parsed);
    if (!prepared.ok) {
      const first = prepared.errors.slice(0, 3).join(" ");
      if (shape === "book") return { error: first };
      return { error: `The prayer and cross-reference file is blocked: ${first}` };
    }
    return {
      collections: prepared.collections,
      notes: [
        ...(prepared.notes || []),
        "The prayers of the file are imported as the prayer passages and the cross-references as the cross-references.",
        "A prayer that has no Luganda text yet is imported with its Luganda section empty, so you can write it later in the content manager."
      ],
      warnings: prepared.warnings.map((message) => ({ message }))
    };
  }
  const collections = normalisePayload(parsed);
  if (!Object.keys(collections).length) {
    return { error: "The file has no collection to import. Use the template to see the shape." };
  }
  return { collections };
};

const downloadTemplate = () => {
  const blob = new Blob([JSON.stringify(TEMPLATE, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "pray-read-content-template.json";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export default function JsonImportPanel() {
  const [raw, setRaw] = useState("");
  const [fileName, setFileName] = useState("");
  const [payload, setPayload] = useState(null);
  const [notes, setNotes] = useState([]);
  const [warnings, setWarnings] = useState([]);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);
  const inputRef = useRef(null);

  const check = (text, name) => {
    setError("");
    setNotice("");
    setResult(null);
    if (!String(text || "").trim()) {
      setError("The file is empty.");
      setPayload(null);
      return;
    }
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (err) {
      setError(`The file could not be read: ${err.message}`);
      setPayload(null);
      return;
    }
    const prepared = preparePayload(parsed);
    if (prepared.error) {
      setError(prepared.error);
      setPayload(null);
      setNotes([]);
      setWarnings([]);
      return;
    }
    const next = prepared.collections;
    setPayload(next);
    setNotes(prepared.notes || []);
    setWarnings(prepared.warnings || []);
    setFileName(name || "pasted content");
    const total = Object.values(next).reduce((sum, rows) => sum + rows.length, 0);
    setNotice(
      prepared.notes
        ? `The book file is ready: ${total} row(s) were prepared from its prayers and cross-references. Check them below, then import.`
        : `The file is ready: ${Object.keys(next).length} collection(s), ${total} row(s). Check it below, then import.`
    );
  };

  const onFile = (event) => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".json")) {
      setError("The file must be a JSON file (.json).");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => check(String(reader.result || ""), file.name);
    reader.onerror = () => setError("The file could not be read.");
    reader.readAsText(file);
  };

  const runImport = async () => {
    if (!payload) return;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const data = await callAdminData("bulkImportJson", { payload });
      setResult(data);
      const summary = data.summary || {};
      const added = Object.values(summary).reduce((sum, item) => sum + (item.inserted || 0), 0);
      const changed = Object.values(summary).reduce((sum, item) => sum + (item.updated || 0), 0);
      setNotice(
        `The import finished: ${added} record(s) added and ${changed} record(s) changed.`
      );
    } catch (err) {
      setError(err.message || "The import did not finish.");
    } finally {
      setBusy(false);
    }
  };

  const collections = payload ? Object.entries(payload) : [];

  return (
    <div className="pr-grid pr-grid-2">
      <div className="pr-card pr-card-pad">
        <h2 className="pr-heading" style={{ margin: "0 0 4px", fontSize: "1.05rem" }}>
          1. Choose the file
        </h2>
        <p className="pr-muted" style={{ margin: "0 0 16px", fontSize: "0.85rem" }}>
          One JSON file, one collection per key. The importer changes the records that are
          already in the app and adds the new ones. A book file (one that holds a book with its
          chapters and its verses) is read as well: its prayers and its cross-references are
          prepared for you.
        </p>

        <div
          style={{
            border: "2px dashed var(--pr-border)",
            borderRadius: 16,
            padding: "26px 18px",
            textAlign: "center",
            marginBottom: 16
          }}
        >
          <ListIcon className="h-7 w-7" style={{ color: "var(--pr-gold-deep)" }} />
          <p className="pr-heading" style={{ margin: "10px 0 4px", fontSize: "0.95rem" }}>
            {fileName || "No file chosen yet"}
          </p>
          <p className="pr-muted" style={{ margin: "0 0 14px", fontSize: "0.8rem" }}>
            A prayer file holds the title, the passage and the cross references. A book file
            holds the chapters, the verses, the prayers and the cross references.
          </p>
          <input
            ref={inputRef}
            type="file"
            accept=".json,application/json"
            onChange={onFile}
            style={{ display: "none" }}
          />
          <button
            type="button"
            className="pr-btn pr-btn-primary"
            onClick={() => inputRef.current && inputRef.current.click()}
          >
            <UploadIcon className="h-4 w-4" style={{ display: "inline" }} /> Choose a JSON file
          </button>
        </div>

        <div className="pr-field">
          <label className="pr-label">Or paste the JSON</label>
          <textarea
            className="pr-textarea"
            value={raw}
            onChange={(event) => setRaw(event.target.value)}
            placeholder='{ "Prayer": [ { "title": "…", "scripture_ref": "John 3:16", "cross_refs": ["John 1:5"] } ] }'
            style={{ minHeight: 150, fontFamily: "monospace", fontSize: "0.82rem" }}
          />
          <div style={{ display: "flex", gap: 10, marginTop: 10, flexWrap: "wrap" }}>
            <button type="button" className="pr-btn pr-btn-outline" onClick={() => check(raw, "pasted content")}>
              Check the content
            </button>
            <button type="button" className="pr-btn pr-btn-outline" onClick={downloadTemplate}>
              <DownloadIcon className="h-4 w-4" style={{ display: "inline" }} /> Download the template
            </button>
          </div>
        </div>
      </div>

      <div className="pr-card pr-card-pad">
        <h2 className="pr-heading" style={{ margin: "0 0 4px", fontSize: "1.05rem" }}>
          2. Check and import
        </h2>
        <p className="pr-muted" style={{ margin: "0 0 16px", fontSize: "0.85rem" }}>
          Nothing is written to the app until you press import.
        </p>

        {error ? <div className="pr-error" style={{ marginBottom: 14 }}>{error}</div> : null}
        {notice ? <div className="pr-success" style={{ marginBottom: 14 }}>{notice}</div> : null}

        {collections.length ? (
          <div style={{ marginBottom: 16 }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "8px 6px",
                      borderBottom: "1px solid var(--pr-border)",
                      fontSize: "0.76rem",
                      color: "var(--pr-heading)"
                    }}
                  >
                    Collection
                  </th>
                  <th
                    style={{
                      textAlign: "right",
                      padding: "8px 6px",
                      borderBottom: "1px solid var(--pr-border)",
                      fontSize: "0.76rem",
                      color: "var(--pr-heading)"
                    }}
                  >
                    Rows
                  </th>
                </tr>
              </thead>
              <tbody>
                {collections.map(([name, rows]) => (
                  <tr key={name}>
                    <td style={{ padding: "8px 6px", fontSize: "0.85rem" }}>{name}</td>
                    <td style={{ padding: "8px 6px", fontSize: "0.85rem", textAlign: "right" }}>
                      {rows.length}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="pr-muted" style={{ margin: "0 0 16px", fontSize: "0.86rem" }}>
            Choose a file, or paste the JSON above, to see what will be imported.
          </p>
        )}

        {notes.length ? (
          <div
            style={{
              marginBottom: 14,
              padding: "12px 14px",
              borderRadius: 10,
              border: "1px solid var(--pr-border)",
              background: "var(--pr-ivory-soft)"
            }}
          >
            <p className="pr-eyebrow" style={{ margin: "0 0 8px" }}>
              How this file was read
            </p>
            <ul className="pr-list-reset" style={{ display: "grid", gap: 6, fontSize: "0.83rem" }}>
              {notes.map((note, index) => (
                <li key={index}>{note}</li>
              ))}
            </ul>
          </div>
        ) : null}

        {warnings.length ? (
          <div
            style={{
              marginBottom: 14,
              padding: "12px 14px",
              borderRadius: 10,
              border: "1px solid var(--pr-gold)",
              background: "var(--pr-ivory-soft)"
            }}
          >
            <p
              className="pr-eyebrow"
              style={{ margin: "0 0 8px", display: "flex", gap: 6, alignItems: "center" }}
            >
              <AlertTriangleIcon className="h-4 w-4" style={{ color: "var(--pr-gold-deep)" }} /> Worth a
              look
            </p>
            <ul className="pr-list-reset" style={{ display: "grid", gap: 6, fontSize: "0.83rem" }}>
              {warnings.map((warning, index) => (
                <li key={index}>{warning.message}</li>
              ))}
            </ul>
          </div>
        ) : null}

        <button
          type="button"
          className="pr-btn pr-btn-primary pr-btn-block"
          onClick={runImport}
          disabled={!payload || busy}
        >
          {busy ? (
            <>
              <Loader2Icon className="h-4 w-4 animate-spin" style={{ display: "inline" }} /> Importing…
            </>
          ) : (
            <>
              <UploadIcon className="h-4 w-4" style={{ display: "inline" }} /> Import into the app
            </>
          )}
        </button>

        {result && result.summary ? (
          <div style={{ marginTop: 18 }}>
            <h3 className="pr-heading" style={{ margin: "0 0 10px", fontSize: "0.95rem" }}>
              What happened
            </h3>
            <ul className="pr-list-reset" style={{ display: "grid", gap: 8 }}>
              {Object.entries(result.summary).map(([name, value]) => (
                <li key={name} style={{ fontSize: "0.85rem" }}>
                  <CheckCircleIcon
                    className="h-4 w-4"
                    style={{ display: "inline", color: "var(--pr-emerald)" }}
                  />{" "}
                  <strong>{name}</strong>: {value.inserted || 0} added, {value.updated || 0} changed,{" "}
                  {value.skipped || 0} skipped
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {result && result.errors && result.errors.length ? (
          <div style={{ marginTop: 16 }}>
            <h3
              className="pr-heading"
              style={{ margin: "0 0 8px", fontSize: "0.95rem", display: "flex", gap: 6, alignItems: "center" }}
            >
              <AlertTriangleIcon className="h-4 w-4" style={{ color: "#9f2d2d" }} /> Rows that were not
              imported
            </h3>
            <ul className="pr-list-reset" style={{ display: "grid", gap: 6 }}>
              {result.errors.slice(0, 40).map((message, index) => (
                <li key={index} style={{ fontSize: "0.82rem", color: "#9f2d2d" }}>
                  {message}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  );
}