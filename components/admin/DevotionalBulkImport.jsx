import React, { useMemo, useRef, useState } from "react";
import { callAdminData } from "@/lib/adminSession";
import { devotionalDate, makeDevotionalCode } from "@/lib/devotionals";
import { DownloadIcon, UploadIcon, Loader2Icon, CheckIcon, XIcon } from "lucide-react";

// The template of the file. The names of the fields do not change.
const TEMPLATE = {
  format: "pray-read-devotionals-v1",
  devotionals: [
    {
      title_en: "The Lord Is My Shepherd",
      title_lu: "Mukama Ye Musumba Wange",
      scripture_ref: "Psalm 23:1",
      verse_en: "The LORD is my shepherd; I shall not want.",
      verse_lu: "Mukama ye musumba wange; siribulwa kintu kyonna.",
      body_en: "David begins...",
      body_lu: "Dawudi atandika...",
      prayer_en: "Lord, shepherd me today...",
      prayer_lu: "Mukama, nnunda leero...",
      topic: "Faith",
      series: "Psalms Journey",
      date: "2026-11-27",
      cover_url: "",
      featured: false,
      active: true
    }
  ]
};

const asText = (value) => (value === null || value === undefined ? "" : String(value).trim());

const rowsOf = (answer) => {
  if (Array.isArray(answer)) return answer;
  if (answer && Array.isArray(answer.rows)) return answer.rows;
  return [];
};

// The fields every devotional in the file must carry.
const REQUIRED = [
  ["title_en", "the title (English)"],
  ["title_lu", "the title (Luganda)"],
  ["verse_en", "the verse (English)"],
  ["verse_lu", "the verse (Luganda)"],
  ["body_en", "the body (English)"],
  ["body_lu", "the body (Luganda)"],
  ["prayer_en", "the prayer (English)"],
  ["prayer_lu", "the prayer (Luganda)"],
  ["scripture_ref", "the scripture reference"],
  ["date", "the date"]
];

const toRecord = (item) => ({
  title_en: asText(item.title_en),
  title_lu: asText(item.title_lu),
  scripture_ref: asText(item.scripture_ref),
  scripture_lu: asText(item.scripture_lu),
  verse_en: asText(item.verse_en),
  verse_lu: asText(item.verse_lu),
  body_en: asText(item.body_en),
  body_lu: asText(item.body_lu),
  prayer_en: asText(item.prayer_en),
  prayer_lu: asText(item.prayer_lu),
  topic: asText(item.topic),
  series: asText(item.series),
  date: asText(item.date).slice(0, 10),
  cover_url: asText(item.cover_url),
  featured: item.featured === true,
  active: item.active !== false
});

/**
 * The bulk upload of the devotionals.
 *
 * The file is checked before anything is written: a devotional without an
 * English and a Luganda title, verse, body and prayer is reported with its
 * number in the file, and the import button stays closed while there is an
 * error. The same file imported twice updates the devotionals instead of
 * adding them twice: the title and the date find the record again.
 */
export default function DevotionalBulkImport({ topics = [], onImported }) {
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
        const topicEn = asText(row.topic);
        const isNewTopic = topicEn ? !knownTopics.has(topicEn.toLowerCase()) : false;
        REQUIRED.forEach(([key, label]) => {
          if (!asText(row[key])) errors.push(`${label} is missing`);
        });
        if (topicEn && isNewTopic && !createTopics) {
          errors.push(`the topic "${topicEn}" does not exist yet`);
        }
        return {
          index: index + 1,
          titleEn: asText(row.title_en),
          scripture: asText(row.scripture_ref),
          topic: topicEn,
          topicLu: asText(row.topic_lu),
          date: asText(row.date).slice(0, 10),
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
        : Array.isArray(parsed.devotionals)
        ? parsed.devotionals
        : Array.isArray(parsed.Devotional)
        ? parsed.Devotional
        : null;
      if (!list) {
        setRows([]);
        setParseError("The file has no devotionals. Use the template to see the shape of the file.");
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
    link.download = "pray-read-devotionals-template.json";
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
          entity: "DevotionalTopic",
          values: {
            name_en: nameEn,
            name_lu: row.topicLu || nameEn,
            active: true
          }
        });
      }

      const existing = rowsOf(await callAdminData("list", { entity: "Devotional", limit: 800 }));
      const taken = existing.map((row) => String(row.code || ""));
      let inserted = 0;
      let updated = 0;

      for (const row of checked) {
        const values = toRecord(row.raw);
        const sameTitle = existing.filter(
          (item) =>
            String(item.title_en || item.title || "").trim().toLowerCase() ===
            row.titleEn.toLowerCase()
        );
        const match =
          sameTitle.find((item) => devotionalDate(item) === row.date) ||
          sameTitle.find((item) => !devotionalDate(item));
        if (match) {
          await callAdminData("update", { entity: "Devotional", id: match.id, values });
          updated += 1;
        } else {
          const code = makeDevotionalCode({ title_en: row.titleEn, date: row.date }, taken);
          taken.push(code);
          await callAdminData("create", { entity: "Devotional", values: { ...values, code } });
          inserted += 1;
        }
      }

      setReport({ inserted, updated, skipped: 0, errors: [] });
      if (onImported) onImported();
    } catch (err) {
      setReport({
        inserted: 0,
        updated: 0,
        skipped: 0,
        errors: [err.message || "The import failed."]
      });
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="pr-card pr-card-pad">
      <h2 className="pr-heading" style={{ margin: "0 0 6px", fontSize: "1.05rem" }}>
        Bulk upload the devotionals with a JSON file
      </h2>
      <p className="pr-muted" style={{ margin: "0 0 16px", fontSize: "0.85rem" }}>
        Every devotional needs an English and a Luganda title, verse, body and prayer, a scripture
        reference and a date. The same file imported twice updates the devotionals instead of
        adding them twice.
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
            {checked.length} {checked.length === 1 ? "devotional" : "devotionals"}, {errorCount}{" "}
            {errorCount === 1 ? "error" : "errors"}
          </p>

          <div className="pr-scroll-x">
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.83rem" }}>
              <thead>
                <tr style={{ textAlign: "start", borderBottom: "1px solid var(--pr-border)" }}>
                  {["Date", "Title (EN)", "Scripture", "Topic", "Status"].map((label) => (
                    <th key={label} style={{ padding: "8px 10px", color: "var(--pr-gold-deep)", fontWeight: 800 }}>
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {checked.slice(0, 20).map((row) => (
                  <tr key={row.index} style={{ borderBottom: "1px solid var(--pr-border)" }}>
                    <td style={{ padding: "8px 10px" }}>{row.date || " - "}</td>
                    <td style={{ padding: "8px 10px" }}>{row.titleEn || " - "}</td>
                    <td style={{ padding: "8px 10px" }}>{row.scripture || " - "}</td>
                    <td style={{ padding: "8px 10px" }}>
                      {row.topic || " - "}
                      {row.isNewTopic ? (
                        <span className="pr-badge pr-badge-gold" style={{ marginLeft: 6, fontSize: "0.66rem" }}>
                          new topic
                        </span>
                      ) : null}
                    </td>
                    <td style={{ padding: "8px 10px" }}>
                      {row.ok ? (
                        <span style={{ color: "#1d4035", fontWeight: 800 }}>
                          <CheckIcon className="h-4 w-4" style={{ display: "inline" }} /> OK
                        </span>
                      ) : (
                        <span style={{ color: "#a11", fontWeight: 800 }}>
                          <XIcon className="h-4 w-4" style={{ display: "inline" }} /> Item {row.index}:{" "}
                          {row.errors[0]}
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
              The table shows the first 20 devotionals of the file. All {checked.length} are imported.
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
                "Import the devotionals"
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