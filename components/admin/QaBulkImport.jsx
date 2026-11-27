import React, { useMemo, useRef, useState } from "react";
import { callAdminData } from "@/lib/adminSession";
import { letterOf } from "@/lib/qaLibrary";
import { DownloadIcon, UploadIcon, Loader2Icon, CheckIcon, XIcon } from "lucide-react";

const TEMPLATE = {
  format: "pray-read-qa-v1",
  qa: [
    {
      topic_en: "Prayer",
      topic_lu: "Okusaba",
      scripture_ref: "Matthew 6:5-13",
      question_en: "What is prayer?",
      question_lu: "Okusaba kye ki?",
      answer_en: "Prayer is talking to God...",
      answer_lu: "Okusaba kwogera ne Katonda...",
      tags: ["prayer", "morning"],
      featured: false,
      active: true
    }
  ]
};

const asText = (value) => (value === null || value === undefined ? "" : String(value).trim());

/**
 * The bulk upload of the questions.
 *
 * The file is checked before anything is written: a question without an
 * English and a Luganda question and answer is reported with its number in
 * the file, and the import button stays closed while there is an error.
 * The same file imported twice updates the questions instead of adding
 * them twice.
 */
export default function QaBulkImport({ topics, onImported }) {
  const [rows, setRows] = useState([]);
  const [fileName, setFileName] = useState("");
  const [parseError, setParseError] = useState("");
  const [createTopics, setCreateTopics] = useState(true);
  const [importing, setImporting] = useState(false);
  const [report, setReport] = useState(null);
  const fileRef = useRef(null);

  const knownTopics = useMemo(
    () => new Set(topics.map((topic) => String(topic.name_en || "").toLowerCase())),
    [topics]
  );

  const checked = useMemo(
    () =>
      rows.map((row, index) => {
        const errors = [];
        const questionEn = asText(row.question_en);
        const questionLu = asText(row.question_lu);
        const answerEn = asText(row.answer_en);
        const answerLu = asText(row.answer_lu);
        const topicEn = asText(row.topic_en);
        const topicLu = asText(row.topic_lu);
        const isNewTopic = topicEn ? !knownTopics.has(topicEn.toLowerCase()) : false;

        if (!questionEn) errors.push("the question (English) is missing");
        if (!questionLu) errors.push("the question (Luganda) is missing");
        if (!answerEn) errors.push("the answer (English) is missing");
        if (!answerLu) errors.push("the answer (Luganda) is missing");
        if (!topicEn) errors.push("the topic is missing");
        else if (isNewTopic && !createTopics) errors.push(`the topic "${topicEn}" does not exist yet`);

        return {
          index: index + 1,
          topic: topicEn,
          topicLu,
          questionEn,
          questionLu,
          letter: letterOf(questionEn),
          isNewTopic,
          errors,
          ok: errors.length === 0,
          raw: row
        };
      }),
    [rows, knownTopics, createTopics]
  );

  const errorCount = checked.filter((row) => !row.ok).length;

  const handleFile = async (file) => {
    if (!file) return;
    setParseError("");
    setReport(null);
    setFileName(file.name);
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      const list = Array.isArray(parsed)
        ? parsed
        : Array.isArray(parsed.qa)
        ? parsed.qa
        : Array.isArray(parsed.QAItem)
        ? parsed.QAItem
        : null;
      if (!list) {
        setRows([]);
        setParseError("The file has no questions. Use the template to see the shape of the file.");
        return;
      }
      setRows(list);
    } catch (err) {
      setRows([]);
      setParseError(err.message || "The file could not be read as JSON.");
    }
  };

  const downloadTemplate = () => {
    const blob = new Blob([JSON.stringify(TEMPLATE, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "pray-read-qa-template.json";
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  };

  const runImport = async () => {
    if (!checked.length || errorCount) return;
    setImporting(true);
    setReport(null);
    try {
      const missing = [];
      checked.forEach((row) => {
        if (row.isNewTopic && !missing.includes(row.topic)) missing.push(row.topic);
      });
      for (const nameEn of missing) {
        const row = checked.find((entry) => entry.topic === nameEn);
        await callAdminData("create", {
          entity: "QATopic",
          values: {
            name_en: nameEn,
            name_lu: row.topicLu || nameEn,
            description_en: "",
            description_lu: "",
            active: true
          }
        });
      }
      const payload = {
        QAItem: checked.map((row) => ({
          ...row.raw,
          topic_lu: row.topicLu || row.topic,
          tags: Array.isArray(row.raw.tags) ? row.raw.tags.join(", ") : asText(row.raw.tags)
        }))
      };
      const result = await callAdminData("bulkImportJson", { payload });
      const summary = (result && result.summary && result.summary.QAItem) || {};
      setReport({
        inserted: summary.inserted || 0,
        updated: summary.updated || 0,
        skipped: summary.skipped || 0,
        errors: (result && result.errors) || []
      });
      if (onImported) onImported();
    } catch (err) {
      setReport({ inserted: 0, updated: 0, skipped: 0, errors: [err.message || "The import failed."] });
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="pr-card pr-card-pad">
      <h2 className="pr-heading" style={{ margin: "0 0 6px", fontSize: "1.05rem" }}>
        Bulk upload the questions with a JSON file
      </h2>
      <p className="pr-muted" style={{ margin: "0 0 16px", fontSize: "0.85rem" }}>
        Every question needs an English and a Luganda question and answer. The same file imported
        twice updates the questions instead of adding them twice.
      </p>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 14 }}>
        <button type="button" className="pr-btn pr-btn-outline pr-btn-sm" onClick={downloadTemplate}>
          <DownloadIcon className="h-4 w-4" style={{ display: "inline" }} /> Download JSON Template
        </button>
        <label className="pr-btn pr-btn-primary pr-btn-sm" style={{ cursor: "pointer" }}>
          <UploadIcon className="h-4 w-4" style={{ display: "inline" }} /> Bulk Upload via JSON
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            style={{ display: "none" }}
            onChange={(event) => handleFile(event.target.files && event.target.files[0])}
          />
        </label>
        {fileName ? (
          <span className="pr-muted" style={{ alignSelf: "center", fontSize: "0.82rem" }}>
            {fileName}
          </span>
        ) : null}
      </div>

      <label style={{ display: "flex", gap: 8, alignItems: "center", fontSize: "0.86rem", marginBottom: 14 }}>
        <input
          type="checkbox"
          checked={createTopics}
          onChange={(event) => setCreateTopics(event.target.checked)}
        />
        Create missing topics automatically
      </label>

      {parseError ? <div className="pr-error" style={{ marginBottom: 14 }}>{parseError}</div> : null}

      {checked.length ? (
        <>
          <p style={{ margin: "0 0 10px", fontSize: "0.88rem", fontWeight: 700 }}>
            {checked.length} {checked.length === 1 ? "question" : "questions"}, {errorCount}{" "}
            {errorCount === 1 ? "error" : "errors"}
          </p>

          <div className="pr-scroll-x">
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.83rem" }}>
              <thead>
                <tr style={{ textAlign: "start", borderBottom: "1px solid var(--pr-border)" }}>
                  {["Topic", "Question (EN)", "Question (LU)", "Letter", "Status"].map((label) => (
                    <th key={label} style={{ padding: "8px 10px", color: "var(--pr-gold-deep)", fontWeight: 800 }}>
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {checked.slice(0, 20).map((row) => (
                  <tr key={row.index} style={{ borderBottom: "1px solid var(--pr-border)" }}>
                    <td style={{ padding: "8px 10px" }}>
                      {row.topic || " - "}
                      {row.isNewTopic ? (
                        <span className="pr-badge pr-badge-gold" style={{ marginLeft: 6, fontSize: "0.66rem" }}>
                          new topic
                        </span>
                      ) : null}
                    </td>
                    <td style={{ padding: "8px 10px" }}>{row.questionEn || " - "}</td>
                    <td style={{ padding: "8px 10px" }}>{row.questionLu || " - "}</td>
                    <td style={{ padding: "8px 10px" }}>{row.letter}</td>
                    <td style={{ padding: "8px 10px" }}>
                      {row.ok ? (
                        <span style={{ color: "#1d4035", fontWeight: 800 }}>
                          <CheckIcon className="h-4 w-4" style={{ display: "inline" }} /> OK
                        </span>
                      ) : (
                        <span style={{ color: "#a11", fontWeight: 800 }}>
                          <XIcon className="h-4 w-4" style={{ display: "inline" }} /> {row.errors[0]}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {checked.length > 20 ? (
            <p className="pr-muted" style={{ margin: "10px 0 0", fontSize: "0.8rem" }}>
              The table shows the first 20 questions of the file. All {checked.length} are imported.
            </p>
          ) : null}

          <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 16, flexWrap: "wrap" }}>
            <button
              type="button"
              className="pr-btn pr-btn-primary"
              onClick={runImport}
              disabled={importing || errorCount > 0}
              title={errorCount ? "Fix the errors in the file first" : ""}
            >
              {importing ? (
                <>
                  <Loader2Icon className="h-4 w-4 animate-spin" style={{ display: "inline" }} /> Importing…
                </>
              ) : (
                "Import the questions"
              )}
            </button>
          </div>
        </>
      ) : null}

      {report ? (
        <div style={{ marginTop: 16 }}>
          <p className="pr-success" style={{ margin: "0 0 8px" }}>
            {report.inserted} added, {report.updated} updated, {report.skipped} skipped.
          </p>
          {report.errors && report.errors.length ? (
            <ul className="pr-list-reset" style={{ display: "grid", gap: 4, fontSize: "0.82rem" }}>
              {report.errors.map((message, index) => (
                <li key={index} style={{ color: "#a11" }}>
                  {message}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}