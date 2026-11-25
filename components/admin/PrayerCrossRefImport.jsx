import React, { useMemo, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { BIBLE_BOOKS } from "@/lib/bibleBooks";
import {
  FILE_FIELDS,
  TEMPLATE_URL,
  bookNameFor,
  importPrayerFile,
  prayerTemplateText,
  readImportedContent,
  validatePrayerFile
} from "@/lib/prayerImport";
import { expandBookFile, isBookFile } from "@/lib/bookImport";
import {
  AlertTriangleIcon,
  CheckCircleIcon,
  DownloadIcon,
  Link2Icon,
  Loader2Icon,
  ListIcon,
  UploadIcon
} from "lucide-react";

/**
 * The bulk import of the prayer passages and the cross-references.
 *
 * One file holds one book, so the admin imports Genesis first and Exodus
 * after that. The file is checked before anything is written: every problem
 * is listed with the item it belongs to and the import stays closed while
 * there is a single error. The same file can be imported again, the
 * records that are already there are changed and never copied twice.
 */

const truncate = (value, limit = 70) => {
  const text = String(value || "").trim();
  if (text.length <= limit) return text;
  return `${text.slice(0, limit - 1).trim()}…`;
};

const verseLabel = (verse, verseEnd) => {
  if (!verse) return "Whole chapter";
  if (verseEnd && verseEnd !== verse) return `${verse}-${verseEnd}`;
  return String(verse);
};

export default function PrayerCrossRefImport() {
  const inputRef = useRef(null);
  const queryClient = useQueryClient();
  const [fileName, setFileName] = useState("");
  const [raw, setRaw] = useState("");
  const [checked, setChecked] = useState(null);
  const [parseError, setParseError] = useState("");
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [report, setReport] = useState(null);
  const [bookNumber, setBookNumber] = useState(1);
  const [chapter, setChapter] = useState(1);

  const { data: installed, isLoading: installedLoading } = useQuery({
    queryKey: ["installedPassages", bookNumber, chapter],
    queryFn: () => readImportedContent(bookNumber, chapter)
  });

  const installedPassages = (installed && installed.passages) || [];
  const installedCrossRefs = (installed && installed.crossReferences) || [];

  const onFile = (event) => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    if (!/\.json$/i.test(file.name)) {
      setParseError("Only a .json file can be read.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setFileName(file.name);
      setRaw(String(reader.result || ""));
      setChecked(null);
      setReport(null);
      setParseError("");
    };
    reader.onerror = () => setParseError("The file could not be read.");
    reader.readAsText(file);
  };

  // The template is written by the app itself, so the file the admin
  // downloads always carries the keys the import understands.
  const downloadTemplate = () => {
    const blob = new Blob([prayerTemplateText()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "Prayer-Crossrefs-Template.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // The empty format can also be put in the box, so the admin can copy it
  // into the file of their own book.
  const fillFormat = () => {
    setRaw(prayerTemplateText());
    setFileName("");
    setChecked(null);
    setReport(null);
    setParseError("");
  };

  const check = () => {
    setReport(null);
    setParseError("");
    let parsed = null;
    try {
      parsed = JSON.parse(raw);
    } catch (error) {
      setParseError(`The file is not valid JSON: ${error.message}`);
      setChecked(null);
      return;
    }
    // A book file holds a whole book with its chapters and its verses. Those
    // only show where the prayers and the cross-references belong, so the file
    // is read and the rows of those two collections are prepared from it.
    const expanded = isBookFile(parsed) ? expandBookFile(parsed) : null;
    const result = validatePrayerFile(
      expanded ? expanded.file : parsed,
      expanded ? { lenient: true, allowNoTitle: true } : {}
    );
    if (expanded) {
      result.warnings = [...expanded.warnings, ...result.warnings];
      result.notes = expanded.notes;
    }
    setChecked(result);
    if (result.ok && result.file && result.file.book_number) {
      setBookNumber(result.file.book_number);
      const firstChapter =
        result.prayers.length && result.prayers[0].chapter ? result.prayers[0].chapter : 1;
      setChapter(firstChapter);
    }
  };

  const runImport = async () => {
    if (!checked || !checked.ok) return;
    setBusy(true);
    setReport(null);
    setProgress({ done: 0, total: checked.prayers.length + checked.crossReferences.length });
    try {
      const result = await importPrayerFile({
        file: checked.file,
        prayers: checked.prayers,
        crossReferences: checked.crossReferences,
        onProgress: setProgress
      });
      setReport(result);
      queryClient.invalidateQueries({ queryKey: ["installedPassages"] });
    } catch (error) {
      setReport({
        summary: {
          prayers: { inserted: 0, updated: 0, skipped: 0, failed: 0, total: 0 },
          crossReferences: { inserted: 0, updated: 0, skipped: 0, failed: 0, total: 0 }
        },
        errors: [error.message || "The import stopped early."],
        warnings: []
      });
    } finally {
      setBusy(false);
      setProgress({ done: 0, total: 0 });
    }
  };

  const crossRefsFor = useMemo(() => {
    const map = new Map();
    if (!checked) return map;
    checked.crossReferences.forEach((row) => {
      const key = `${row.chapter}:${row.verse}`;
      map.set(key, (map.get(key) || 0) + 1);
    });
    return map;
  }, [checked]);

  const errorText = (entry) => {
    if (!entry.item) return entry.message;
    if (entry.kind === "prayer") return `Item ${entry.item} (prayer): ${entry.message}`;
    if (entry.kind === "cross-reference") return `Item ${entry.item} (cross-reference): ${entry.message}`;
    return `Item ${entry.item}: ${entry.message}`;
  };

  return (
    <div>
      <div className="pr-card pr-card-pad" style={{ marginBottom: 18 }}>
        <h3 className="pr-heading" style={{ fontSize: "1.05rem", fontWeight: 800, margin: "0 0 6px" }}>
          <ListIcon className="h-4 w-4" style={{ display: "inline", color: "var(--pr-gold-deep)" }} /> Prayers and
          cross-references
        </h3>
        <p style={{ margin: "0 0 16px", fontSize: "0.88rem" }}>
          One file holds one book. Fill the template in for Genesis, import it, and do the same for the next book.
          Every prayer and every cross-reference needs both the English and the Luganda text. A book file, the one
          that holds the chapters and the verses of a whole book, is read as well: its prayers and its
          cross-references are prepared for you.
        </p>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 8 }}>
          <button type="button" className="pr-btn pr-btn-outline pr-btn-sm" onClick={downloadTemplate}>
            <DownloadIcon className="h-4 w-4" /> Download the template
          </button>
          <button type="button" className="pr-btn pr-btn-outline pr-btn-sm" onClick={fillFormat}>
            <ListIcon className="h-4 w-4" /> Fill in the empty format
          </button>
          <button type="button" className="pr-btn pr-btn-primary pr-btn-sm" onClick={() => inputRef.current && inputRef.current.click()}>
            <UploadIcon className="h-4 w-4" /> Choose a JSON file
          </button>
          <input
            ref={inputRef}
            type="file"
            accept=".json,application/json"
            onChange={onFile}
            style={{ display: "none" }}
          />
        </div>

        <p style={{ margin: "0 0 16px", fontSize: "0.78rem" }}>
          The template carries the format the app reads. The{" "}
          <a href={TEMPLATE_URL} download="Prayer-Crossrefs-Template.json" className="pr-link">
            filled Genesis sample
          </a>{" "}
          is in the media library as well.
        </p>

        {fileName ? (
          <p style={{ margin: "0 0 10px", fontSize: "0.82rem", color: "var(--pr-body)" }}>
            The file <strong>{fileName}</strong> is ready to be checked.
          </p>
        ) : null}

        <div className="pr-field">
          <label className="pr-label" htmlFor="prayer-json">
            Or paste the JSON here
          </label>
          <textarea
            id="prayer-json"
            className="pr-textarea"
            style={{ minHeight: 160, fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: "0.82rem" }}
            value={raw}
            onChange={(event) => {
              setRaw(event.target.value);
              setChecked(null);
              setReport(null);
            }}
            placeholder='{ "format": "pray-read-prayer-crossrefs-v1", "book_number": 1, "book_name": "Genesis", "prayers": [ ... ], "cross_references": [ ... ] }'
          />
        </div>

        <button type="button" className="pr-btn pr-btn-primary" onClick={check} disabled={!raw.trim()}>
          <CheckCircleIcon className="h-4 w-4" /> Check the file
        </button>

        <div
          style={{
            marginTop: 16,
            padding: "12px 14px",
            borderRadius: 10,
            border: "1px solid var(--pr-border)",
            background: "rgba(255, 253, 248, 0.7)"
          }}
        >
          <p className="pr-eyebrow" style={{ margin: "0 0 8px" }}>
            The file format
          </p>
          <p style={{ margin: "0 0 8px", fontSize: "0.82rem" }}>
            One file holds one book. The keys are read exactly as they are written here.
          </p>
          <ul className="pr-list-reset" style={{ display: "grid", gap: 6, fontSize: "0.8rem" }}>
            <li>
              <strong>Every file:</strong> {FILE_FIELDS.file.join(", ")}
            </li>
            <li>
              <strong>Each prayer:</strong> {FILE_FIELDS.prayer.join(", ")}
            </li>
            <li>
              <strong>Each cross-reference:</strong> {FILE_FIELDS.crossReference.join(", ")}
            </li>
            <li>
              A null <strong>verse</strong> is the prayer of the whole chapter, and a null{" "}
              <strong>verse_end</strong> means the prayer stops at that verse. Every prayer and every
              cross-reference needs both languages.
            </li>
          </ul>
        </div>

        {parseError ? <div className="pr-error" style={{ marginTop: 12 }}>{parseError}</div> : null}
      </div>

      {checked ? (
        <div className="pr-card pr-card-pad" style={{ marginBottom: 18 }}>
          <h3 className="pr-heading" style={{ fontSize: "1.05rem", fontWeight: 800, margin: "0 0 10px" }}>
            {checked.file.book_name || "The book"}{checked.file.book_number ? ` (${checked.file.book_number})` : ""}
          </h3>

          <p style={{ margin: "0 0 12px", fontSize: "0.88rem" }}>
            {checked.prayers.length} prayer{checked.prayers.length === 1 ? "" : "s"}, {checked.crossReferences.length}{" "}
            cross-reference{checked.crossReferences.length === 1 ? "" : "s"}, {checked.errors.length} error
            {checked.errors.length === 1 ? "" : "s"}
          </p>

          {checked.notes && checked.notes.length ? (
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
              <ul className="pr-list-reset" style={{ display: "grid", gap: 5, fontSize: "0.83rem" }}>
                {checked.notes.map((note, index) => (
                  <li key={index}>{note}</li>
                ))}
              </ul>
            </div>
          ) : null}

          {checked.errors.length ? (
            <div className="pr-error" style={{ marginBottom: 14 }}>
              <p style={{ margin: "0 0 8px", fontWeight: 700 }}>
                The file was not imported. {checked.errors.length} problem{checked.errors.length === 1 ? "" : "s"} must
                be fixed first.
              </p>
              <ul className="pr-list-reset" style={{ display: "grid", gap: 5 }}>
                {checked.errors.map((entry, index) => (
                  <li key={index} style={{ fontSize: "0.83rem" }}>
                    {errorText(entry)}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {checked.warnings.length ? (
            <div
              style={{
                marginBottom: 14,
                padding: "12px 14px",
                borderRadius: 10,
                border: "1px solid var(--pr-gold)",
                background: "var(--pr-ivory-soft)"
              }}
            >
              <p style={{ margin: "0 0 8px", fontSize: "0.85rem", fontWeight: 700, display: "flex", gap: 8, alignItems: "center" }}>
                <AlertTriangleIcon className="h-4 w-4" /> Worth a look
              </p>
              <ul className="pr-list-reset" style={{ display: "grid", gap: 5 }}>
                {checked.warnings.map((entry, index) => (
                  <li key={index} style={{ fontSize: "0.83rem" }}>
                    {errorText(entry)}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {checked.prayers.length ? (
            <div style={{ marginBottom: 18, overflowX: "auto" }}>
              <p className="pr-eyebrow" style={{ margin: "0 0 8px" }}>
                The prayers in the file
              </p>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem", minWidth: 720 }}>
                <thead>
                  <tr>
                    {["Book", "Chapter", "Verse", "Title EN", "Prayer EN", "Prayer LU", "Cross-refs"].map((head) => (
                      <th key={head} style={{ textAlign: "left", padding: "6px 8px", borderBottom: "1px solid var(--pr-border)" }}>
                        {head}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {checked.prayers.slice(0, 20).map((row, index) => (
                    <tr key={index}>
                      <td style={{ padding: "6px 8px", borderBottom: "1px solid var(--pr-border)" }}>
                        {row.book_name || bookNameFor(row.book_number)}
                      </td>
                      <td style={{ padding: "6px 8px", borderBottom: "1px solid var(--pr-border)" }}>{row.chapter}</td>
                      <td style={{ padding: "6px 8px", borderBottom: "1px solid var(--pr-border)" }}>
                        {verseLabel(row.verse, row.verse_end)}
                      </td>
                      <td style={{ padding: "6px 8px", borderBottom: "1px solid var(--pr-border)" }}>
                        {truncate(row.title_en, 40)}
                      </td>
                      <td style={{ padding: "6px 8px", borderBottom: "1px solid var(--pr-border)" }}>
                        {truncate(row.prayer_en)}
                      </td>
                      <td style={{ padding: "6px 8px", borderBottom: "1px solid var(--pr-border)" }}>
                        {truncate(row.prayer_lu)}
                      </td>
                      <td style={{ padding: "6px 8px", borderBottom: "1px solid var(--pr-border)" }}>
                        {crossRefsFor.get(`${row.chapter}:${row.verse}`) || 0}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {checked.prayers.length > 20 ? (
                <p style={{ margin: "8px 0 0", fontSize: "0.78rem" }}>
                  The first 20 of {checked.prayers.length} prayers are shown.
                </p>
              ) : null}
            </div>
          ) : null}

          {checked.crossReferences.length ? (
            <div style={{ marginBottom: 18, overflowX: "auto" }}>
              <p className="pr-eyebrow" style={{ margin: "0 0 8px" }}>
                The cross-references in the file
              </p>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem", minWidth: 720 }}>
                <thead>
                  <tr>
                    {["Book", "Chapter", "Verse", "Points to", "Verse EN", "Note EN"].map((head) => (
                      <th key={head} style={{ textAlign: "left", padding: "6px 8px", borderBottom: "1px solid var(--pr-border)" }}>
                        {head}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {checked.crossReferences.slice(0, 20).map((row, index) => (
                    <tr key={index}>
                      <td style={{ padding: "6px 8px", borderBottom: "1px solid var(--pr-border)" }}>
                        {row.book_name || bookNameFor(row.book_number)}
                      </td>
                      <td style={{ padding: "6px 8px", borderBottom: "1px solid var(--pr-border)" }}>{row.chapter}</td>
                      <td style={{ padding: "6px 8px", borderBottom: "1px solid var(--pr-border)" }}>{row.verse}</td>
                      <td style={{ padding: "6px 8px", borderBottom: "1px solid var(--pr-border)" }}>
                        {bookNameFor(row.ref_book_number)} {row.ref_chapter}:{row.ref_verse}
                        {row.ref_verse_end && row.ref_verse_end !== row.ref_verse ? `-${row.ref_verse_end}` : ""}
                      </td>
                      <td style={{ padding: "6px 8px", borderBottom: "1px solid var(--pr-border)" }}>
                        {truncate(row.ref_text_en)}
                      </td>
                      <td style={{ padding: "6px 8px", borderBottom: "1px solid var(--pr-border)" }}>
                        {truncate(row.note_en, 40)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {checked.crossReferences.length > 20 ? (
                <p style={{ margin: "8px 0 0", fontSize: "0.78rem" }}>
                  The first 20 of {checked.crossReferences.length} cross-references are shown.
                </p>
              ) : null}
            </div>
          ) : null}

          <button
            type="button"
            className="pr-btn pr-btn-primary"
            onClick={runImport}
            disabled={!checked.ok || busy || (!checked.prayers.length && !checked.crossReferences.length)}
          >
            {busy ? <Loader2Icon className="h-4 w-4 animate-spin" /> : <UploadIcon className="h-4 w-4" />}
            {busy ? "Importing…" : "Import this book"}
          </button>

          {busy && progress.total ? (
            <div style={{ marginTop: 14 }}>
              <p style={{ margin: "0 0 8px", fontSize: "0.85rem" }}>
                {progress.done} of {progress.total} records written
              </p>
              <div className="pr-progress" style={{ background: "var(--pr-ivory-soft)" }}>
                <span
                  className="pr-progress-fill"
                  style={{ width: `${Math.round((progress.done / progress.total) * 100)}%`, background: "var(--pr-emerald)" }}
                />
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      {report ? (
        <div className="pr-card pr-card-pad" style={{ marginBottom: 18 }}>
          <h3 className="pr-heading" style={{ fontSize: "1.05rem", fontWeight: 800, margin: "0 0 10px" }}>
            The import report
          </h3>
          <p style={{ margin: "0 0 12px", fontSize: "0.88rem" }}>
            Prayers: {report.summary.prayers.inserted} new, {report.summary.prayers.updated} changed,{" "}
            {report.summary.prayers.skipped} skipped, {report.summary.prayers.failed} failed. Cross-references:{" "}
            {report.summary.crossReferences.inserted} new, {report.summary.crossReferences.updated} changed,{" "}
            {report.summary.crossReferences.skipped} skipped, {report.summary.crossReferences.failed} failed.
          </p>
          {report.errors.length ? (
            <div className="pr-error">
              <p style={{ margin: "0 0 8px", fontWeight: 700 }}>
                {report.errors.length} record{report.errors.length === 1 ? "" : "s"} could not be written
              </p>
              <ul className="pr-list-reset" style={{ display: "grid", gap: 5 }}>
                {report.errors.slice(0, 40).map((message, index) => (
                  <li key={index} style={{ fontSize: "0.83rem" }}>
                    {message}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="pr-success">The file is in the app and the reader can use it now.</div>
          )}
        </div>
      ) : null}

      <div className="pr-card pr-card-pad">
        <h3 className="pr-heading" style={{ fontSize: "1.05rem", fontWeight: 800, margin: "0 0 6px" }}>
          <Link2Icon className="h-4 w-4" style={{ display: "inline", color: "var(--pr-gold-deep)" }} /> What is already in
          the app
        </h3>
        <p style={{ margin: "0 0 14px", fontSize: "0.88rem" }}>
          Pick a book and a chapter to see what the reader finds there.
        </p>

        <div className="pr-grid pr-grid-2" style={{ marginBottom: 14 }}>
          <div className="pr-field" style={{ margin: 0 }}>
            <label className="pr-label" htmlFor="import-book">
              Book
            </label>
            <select
              id="import-book"
              className="pr-select"
              value={bookNumber}
              onChange={(event) => setBookNumber(Number(event.target.value))}
            >
              {BIBLE_BOOKS.map((book) => (
                <option key={book.number} value={book.number}>
                  {book.number}. {book.name}
                </option>
              ))}
            </select>
          </div>
          <div className="pr-field" style={{ margin: 0 }}>
            <label className="pr-label" htmlFor="import-chapter">
              Chapter
            </label>
            <input
              id="import-chapter"
              className="pr-input"
              type="number"
              min={1}
              value={chapter}
              onChange={(event) => setChapter(Math.max(1, Number(event.target.value) || 1))}
            />
          </div>
        </div>

        {installedLoading ? (
          <p style={{ fontSize: "0.85rem" }}>Looking at the app…</p>
        ) : (
          <>
            <p style={{ margin: "0 0 10px", fontSize: "0.85rem" }}>
              {installedPassages.length} prayer passage{installedPassages.length === 1 ? "" : "s"} and{" "}
              {installedCrossRefs.length} cross-reference{installedCrossRefs.length === 1 ? "" : "s"} in{" "}
              {bookNameFor(bookNumber)} {chapter}.
            </p>

            {installedPassages.length ? (
              <ul className="pr-list-reset" style={{ display: "grid", gap: 8, marginBottom: 12 }}>
                {installedPassages.map((row, index) => (
                  <li
                    key={row.id || index}
                    style={{
                      padding: "10px 12px",
                      borderRadius: 10,
                      border: "1px solid var(--pr-border)",
                      background: "var(--pr-ivory-soft)"
                    }}
                  >
                    <p style={{ margin: "0 0 4px", fontSize: "0.85rem", fontWeight: 700 }}>
                      {row.title_en || row.title_lu || "A prayer"} · {verseLabel(row.verse, row.verse_end)}
                    </p>
                    <p style={{ margin: 0, fontSize: "0.8rem" }}>{truncate(row.prayer_en, 150)}</p>
                    {row.scripture_ref ? (
                      <p style={{ margin: "4px 0 0", fontSize: "0.78rem", color: "var(--pr-body)" }}>
                        {row.scripture_ref}
                      </p>
                    ) : null}
                  </li>
                ))}
              </ul>
            ) : null}

            {installedCrossRefs.length ? (
              <ul className="pr-list-reset" style={{ display: "grid", gap: 8 }}>
                {installedCrossRefs.map((row, index) => (
                  <li
                    key={row.id || index}
                    style={{
                      padding: "10px 12px",
                      borderRadius: 10,
                      border: "1px solid var(--pr-border)",
                      background: "var(--pr-ivory-soft)"
                    }}
                  >
                    <p style={{ margin: "0 0 4px", fontSize: "0.85rem", fontWeight: 700 }}>
                      Verse {row.verse} → {bookNameFor(row.ref_book_number)} {row.ref_chapter}:{row.ref_verse}
                      {row.ref_verse_end && row.ref_verse_end !== row.ref_verse ? `-${row.ref_verse_end}` : ""}
                    </p>
                    <p style={{ margin: 0, fontSize: "0.8rem" }}>{truncate(row.ref_text_en, 150)}</p>
                    {row.note_en ? (
                      <p style={{ margin: "4px 0 0", fontSize: "0.78rem", color: "var(--pr-body)" }}>{row.note_en}</p>
                    ) : null}
                  </li>
                ))}
              </ul>
            ) : null}

            {!installedPassages.length && !installedCrossRefs.length ? (
              <div className="pr-success">
                Nothing has been imported for this chapter yet. Import the file of this book and it will appear here.
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}