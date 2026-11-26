import React, { useMemo, useRef, useState } from "react";
import { callAdminData } from "@/lib/adminSession";
import { BIBLE_BOOKS } from "@/lib/bibleBooks";
import { UploadIcon, DownloadIcon, Loader2Icon, CheckIcon, XIcon } from "lucide-react";

const TEMPLATE = {
  format: "pray-read-verse-songs-v1",
  songs: [
    {
      title: "Genesis 1:1  -  In the Beginning",
      series: "Genesis Songs",
      book: "Genesis",
      book_number: 1,
      chapter: 1,
      verse: "1",
      language: "EN",
      version: "KJV",
      audio_url: "https://…/genesis-1-1.mp3",
      cover_url: "https://…/cover.jpg",
      lyrics_en: "",
      lyrics_lu: "",
      order: 1,
      active: true
    }
  ]
};

const asText = (value) => (value === null || value === undefined ? "" : String(value).trim());

/**
 * The bulk upload of the verse songs.
 *
 * The file is checked before anything is written: a song without a title, a
 * series or an audio file is reported with its number in the file, and the
 * import button stays closed while there is an error.
 */
export default function VerseSongBulkImport({ seriesNames, onImported }) {
  const [rows, setRows] = useState([]);
  const [fileName, setFileName] = useState("");
  const [parseError, setParseError] = useState("");
  const [createSeries, setCreateSeries] = useState(true);
  const [importing, setImporting] = useState(false);
  const [report, setReport] = useState(null);
  const [progress, setProgress] = useState(0);
  const fileRef = useRef(null);

  const knownSeries = useMemo(() => new Set(seriesNames.map((name) => String(name).toLowerCase())), [seriesNames]);

  const checked = useMemo(
    () =>
      rows.map((row, index) => {
        const errors = [];
        const title = asText(row.title);
        const series = asText(row.series || row.series_name);
        const audio = asText(row.audio_url);
        const bookName = asText(row.book || row.book_name);
        const bookNumber = Number(row.book_number);
        const chapter = Number(row.chapter);
        const book = BIBLE_BOOKS.find((item) => item.number === bookNumber || item.name.toLowerCase() === bookName.toLowerCase());

        if (!title) errors.push("the title is missing");
        if (!series) errors.push("the series is missing");
        if (!audio) errors.push("the audio file is missing");
        if (!book) errors.push("the book must be one of the 66 books");
        else if (!chapter || chapter < 1 || chapter > book.chapters)
          errors.push(`the chapter must be between 1 and ${book.chapters}`);
        if (series && !knownSeries.has(series.toLowerCase()) && !createSeries)
          errors.push("the series does not exist yet");

        return {
          index: index + 1,
          title,
          series,
          bookChV: book ? `${book.name} ${chapter || "?"}${row.verse ? `:${asText(row.verse)}` : ""}` : " - ",
          language: asText(row.language) || "EN",
          audio: audio ? "Ready" : "Missing",
          ok: errors.length === 0,
          errors,
          raw: row
        };
      }),
    [rows, knownSeries, createSeries]
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
        : Array.isArray(parsed.songs)
        ? parsed.songs
        : Array.isArray(parsed.VerseSongEpisode)
        ? parsed.VerseSongEpisode
        : null;
      if (!list) {
        setRows([]);
        setParseError("The file has no songs. Use the template to see the shape of the file.");
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
    link.download = "verse-songs-template.json";
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  };

  const runImport = async () => {
    if (!checked.length || errorCount) return;
    setImporting(true);
    setReport(null);
    setProgress(0);
    try {
      const payload = { VerseSongEpisode: checked.map((row) => row.raw) };
      const result = await callAdminData("bulkImportJson", { payload });
      const summary = (result && result.summary && result.summary.VerseSongEpisode) || {};
      setReport({
        inserted: summary.inserted || 0,
        updated: summary.updated || 0,
        skipped: summary.skipped || 0,
        errors: (result && result.errors) || []
      });
      setProgress(100);
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
        Bulk upload the songs with a JSON file
      </h2>
      <p className="pr-muted" style={{ margin: "0 0 16px", fontSize: "0.85rem" }}>
        Upload a file of songs. Every song is checked first, and a song that is already in the app is
        updated instead of being added twice.
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
          <span className="pr-muted" style={{ alignSelf: "center", fontSize: "0.82rem" }}>{fileName}</span>
        ) : null}
      </div>

      <label style={{ display: "flex", gap: 8, alignItems: "center", fontSize: "0.86rem", marginBottom: 14 }}>
        <input
          type="checkbox"
          checked={createSeries}
          onChange={(event) => setCreateSeries(event.target.checked)}
        />
        Create missing series automatically
      </label>

      {parseError ? <div className="pr-error" style={{ marginBottom: 14 }}>{parseError}</div> : null}

      {checked.length ? (
        <>
          <p style={{ margin: "0 0 10px", fontSize: "0.88rem", fontWeight: 700 }}>
            {checked.length} {checked.length === 1 ? "song" : "songs"}, {errorCount}{" "}
            {errorCount === 1 ? "error" : "errors"}
          </p>

          <div className="pr-scroll-x">
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.83rem" }}>
              <thead>
                <tr style={{ textAlign: "start", borderBottom: "1px solid var(--pr-border)" }}>
                  {["Title", "Series", "Book Ch:V", "Language", "Audio", "Status"].map((label) => (
                    <th key={label} style={{ padding: "8px 10px", color: "var(--pr-gold-deep)", fontWeight: 800 }}>
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {checked.slice(0, 20).map((row) => (
                  <tr key={row.index} style={{ borderBottom: "1px solid var(--pr-border)" }}>
                    <td style={{ padding: "8px 10px" }}>{row.title || " - "}</td>
                    <td style={{ padding: "8px 10px" }}>{row.series || " - "}</td>
                    <td style={{ padding: "8px 10px" }}>{row.bookChV}</td>
                    <td style={{ padding: "8px 10px" }}>{row.language}</td>
                    <td style={{ padding: "8px 10px" }}>{row.audio}</td>
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
              The table shows the first 20 songs of the file. All {checked.length} are imported.
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
                "Import the songs"
              )}
            </button>
            {importing ? (
              <span className="pr-muted" style={{ fontSize: "0.82rem" }}>{progress}% done</span>
            ) : null}
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