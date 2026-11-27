import React, { useMemo, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { BIBLE_BOOKS } from "@/lib/bibleBooks";
import { TEMPLATE_URL, bookNameFor, missingCrossRefsTemplateText, prepareImport, prayerTemplateText, readImportedContent } from "@/lib/prayerImport";
import { callAdminData } from "@/lib/adminSession";
import { AlertTriangleIcon, CheckCircleIcon, DownloadIcon, Link2Icon, Loader2Icon, ListIcon, UploadIcon } from "lucide-react";

const truncate = (value, limit = 70) => {
  const text = String(value || "").trim();
  return text.length <= limit ? text : `${text.slice(0, limit - 1).trim()}…`;
};
const verseLabel = (verse, verseEnd) => !verse ? "Whole chapter" : verseEnd && verseEnd !== verse ? `${verse}-${verseEnd}` : String(verse);

export default function PrayerCrossRefImport() {
  const inputRef = useRef(null);
  const queryClient = useQueryClient();
  const [fileName, setFileName] = useState("");
  const [raw, setRaw] = useState("");
  const [checked, setChecked] = useState(null);
  const [parseError, setParseError] = useState("");
  const [busy, setBusy] = useState(false);
  const [report, setReport] = useState(null);
  const [bookNumber, setBookNumber] = useState(1);
  const [chapter, setChapter] = useState(1);
  const { data: installed, isLoading: installedLoading } = useQuery({ queryKey: ["installedPassages", bookNumber, chapter], queryFn: () => readImportedContent(bookNumber) });
  const installedPassages = (installed?.passages || []).filter((row) => Number(row.chapter) === chapter);
  const installedCrossRefs = (installed?.crossReferences || []).filter((row) => Number(row.chapter) === chapter);
  const installedIntros = (installed?.chapterIntros || []).filter((row) => Number(row.chapter) === chapter);

  const onFile = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!/\.json$/i.test(file.name)) { setParseError("Only a .json file can be read."); return; }
    const reader = new FileReader();
    reader.onload = () => { setFileName(file.name); setRaw(String(reader.result || "")); setChecked(null); setReport(null); setParseError(""); };
    reader.onerror = () => setParseError("The file could not be read.");
    reader.readAsText(file);
  };
  const downloadJson = (text, name) => {
    const url = URL.createObjectURL(new Blob([text], { type: "application/json" }));
    const link = document.createElement("a"); link.href = url; link.download = name; link.click(); URL.revokeObjectURL(url);
  };
  // One reader for both file shapes. A whole-book file is read the same
  // way here as it is in the other admin tab, so a book with bare
  // cross-references is never blocked by the flat-file rules.
  const check = () => {
    setReport(null); setParseError("");
    let parsed;
    try { parsed = JSON.parse(raw); } catch (error) { setParseError(`The file is not valid JSON: ${error.message}`); setChecked(null); return; }
    const result = prepareImport(parsed);
    setChecked(result);
    if (result.rows?.bookNumber) setBookNumber(result.rows.bookNumber);
    const first = result.rows?.prayers?.[0]?.chapter || result.rows?.chapterIntros?.[0]?.chapter;
    if (first) setChapter(first);
  };
  const runImport = async () => {
    if (!checked?.ok) return;
    setBusy(true); setReport(null);
    try {
      const prepared = prepareImport(JSON.parse(raw));
      if (!prepared.ok) throw new Error(prepared.errors.join("\n"));
      const payload = { ...prepared.collections };
      if (prepared.rows?.backfillOnly) payload.mode = "backfill";
      const result = await callAdminData("bulkImportJson", { payload });
      setReport({ ...result, errors: result?.errors || [] });
      await queryClient.invalidateQueries({ queryKey: ["installedPassages"] });
    } catch (error) {
      setReport({ errors: [error.message || "The import stopped early."], summary: null });
    } finally { setBusy(false); }
  };
  const rows = checked?.rows;
  const prayerRows = rows?.prayers || [];
  const crossRows = rows?.crossReferences || [];
  const introRows = rows?.chapterIntros || [];
  const crossRefsFor = useMemo(() => {
    const map = new Map();
    crossRows.forEach((reference) => { const key = `${reference.chapter}:${reference.verse}`; map.set(key, (map.get(key) || 0) + 1); });
    return map;
  }, [checked]);

  return <div>
    <div className="pr-card pr-card-pad" style={{ marginBottom: 18 }}>
      <h3 className="pr-heading" style={{ fontSize: "1.05rem", fontWeight: 800, margin: "0 0 6px" }}><ListIcon className="h-4 w-4" style={{ display: "inline", color: "var(--pr-gold-deep)" }} /> Prayers and cross-references</h3>
      <p style={{ margin: "0 0 16px", fontSize: "0.88rem" }}>Every prayer import must contain its cross-references in the same file. Whole-book files also import book and chapter introductions and closing prayers. Use cross-refs-only backfill files to repair older imports without changing prayers.</p>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 8 }}>
        <button type="button" className="pr-btn pr-btn-outline pr-btn-sm" onClick={() => downloadJson(prayerTemplateText(), "Prayer-Crossrefs-Template.json")}><DownloadIcon className="h-4 w-4" /> Download template</button>
        <button type="button" className="pr-btn pr-btn-outline pr-btn-sm" onClick={() => { setRaw(prayerTemplateText()); setFileName(""); setChecked(null); setReport(null); setParseError(""); }}><ListIcon className="h-4 w-4" /> Empty format</button>
        <button type="button" className="pr-btn pr-btn-primary pr-btn-sm" onClick={() => inputRef.current?.click()}><UploadIcon className="h-4 w-4" /> Choose JSON file</button>
        <input ref={inputRef} type="file" accept=".json,application/json" onChange={onFile} style={{ display: "none" }} />
      </div>
      <p style={{ margin: "0 0 16px", fontSize: "0.78rem" }}>The <a href={TEMPLATE_URL} download="Prayer-Crossrefs-Template.json" className="pr-link">filled sample</a> is also in the media library.</p>
      {fileName ? <p style={{ margin: "0 0 10px", fontSize: "0.82rem" }}>Ready to check: <strong>{fileName}</strong></p> : null}
      <div className="pr-field"><label className="pr-label" htmlFor="prayer-json">Or paste JSON here</label><textarea id="prayer-json" className="pr-textarea" style={{ minHeight: 160, fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: "0.82rem" }} value={raw} onChange={(event) => { setRaw(event.target.value); setChecked(null); setReport(null); }} placeholder='{ "format": "pray-read-prayer-crossrefs-v1", "book_number": 19, "prayers": [], "cross_references": [] }' /></div>
      <button type="button" className="pr-btn pr-btn-primary" onClick={check} disabled={!raw.trim()}><CheckCircleIcon className="h-4 w-4" /> Check file</button>
      <div style={{ marginTop: 16, padding: "12px 14px", borderRadius: 10, border: "1px solid var(--pr-border)", background: "rgba(255, 253, 248, 0.7)" }}><p className="pr-eyebrow" style={{ margin: "0 0 8px" }}>Accepted formats</p><p style={{ margin: 0, fontSize: "0.82rem" }}>Regular file: prayers, cross_references, optional chapter_intros and book_intro. Backfill file: format "pray-read-crossrefs-backfill-v1", book_number, book_name and cross_references. A missing translation or a cross-reference without words is reported as a warning, never as a block: the file is imported all the same.</p></div>
      {parseError ? <div className="pr-error" style={{ marginTop: 12 }}>{parseError}</div> : null}
    </div>

    {checked ? <div className="pr-card pr-card-pad" style={{ marginBottom: 18 }}>
      <h3 className="pr-heading" style={{ fontSize: "1.05rem", fontWeight: 800, margin: "0 0 10px" }}>{rows?.bookName || "Cross-reference backfill"} {rows?.bookNumber ? `(${rows.bookNumber})` : ""}</h3>
      <p style={{ margin: "0 0 12px", fontSize: "0.88rem" }}>{prayerRows.length} prayers, {crossRows.length} cross-references, {introRows.length} chapter introductions, {rows?.bookIntro && (rows.bookIntro.intro_en || rows.bookIntro.intro_lu || rows.bookIntro.closing_prayer_en || rows.bookIntro.closing_prayer_lu) ? 1 : 0} book intro/closing prayer, {checked.coverage?.filter((item) => !item.ok).length || 0} prayers missing cross-reference minimum  -  {checked.ok ? "ready to import" : "import blocked"}.</p>
      {checked.errors.length ? <div className="pr-error" style={{ marginBottom: 14 }}><strong>Import blocked  -  fix all listed problems first.</strong><ul className="pr-list-reset" style={{ display: "grid", gap: 5, marginTop: 8 }}>{checked.errors.map((message, index) => <li key={index} style={{ fontSize: "0.83rem" }}>{message}</li>)}</ul></div> : null}
      {checked.warnings?.length ? <div style={{ marginBottom: 14, padding: "12px 14px", borderRadius: 10, border: "1px solid var(--pr-gold)", background: "var(--pr-ivory-soft)" }}><p className="pr-eyebrow" style={{ margin: "0 0 8px", display: "flex", gap: 6, alignItems: "center" }}><AlertTriangleIcon className="h-4 w-4" style={{ color: "var(--pr-gold-deep)" }} /> Worth a look</p><ul className="pr-list-reset" style={{ display: "grid", gap: 6, fontSize: "0.83rem" }}>{checked.warnings.map((message, index) => <li key={index}>{message}</li>)}</ul></div> : null}
      {checked.coverage?.some((item) => !item.ok) ? <button type="button" className="pr-btn pr-btn-outline pr-btn-sm" onClick={() => downloadJson(missingCrossRefsTemplateText(checked), "Missing-Cross-Refs-Template.json")}><DownloadIcon className="h-4 w-4" /> Download Missing Cross-Refs Template</button> : null}
      {prayerRows.length ? <div style={{ margin: "14px 0 18px", overflowX: "auto" }}><table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem", minWidth: 680 }}><thead><tr>{["Book", "Chapter", "Verse", "Prayer title", "Cross-refs in file", "Status"].map((name) => <th key={name} style={{ textAlign: "left", padding: "6px 8px", borderBottom: "1px solid var(--pr-border)" }}>{name}</th>)}</tr></thead><tbody>{prayerRows.map((row, index) => { const coverage = checked.coverage?.[index]; const count = coverage?.count ?? crossRefsFor.get(`${row.chapter}:${row.verse}`) ?? 0; return <tr key={index}><td style={{ padding: "6px 8px" }}>{row.book_name || bookNameFor(row.book_number)}</td><td style={{ padding: "6px 8px" }}>{row.chapter}</td><td style={{ padding: "6px 8px" }}>{verseLabel(row.verse, row.verse_end)}</td><td style={{ padding: "6px 8px" }}>{truncate(row.title_en || row.title_lu || "Untitled", 50)}</td><td style={{ padding: "6px 8px" }}>{count}</td><td style={{ padding: "6px 8px", color: coverage?.ok ? "var(--pr-emerald)" : "#9f2d2d" }}>{coverage?.ok ? "✓ OK" : "✕ MISSING"}</td></tr>; })}</tbody></table></div> : null}
      {rows?.bookIntro ? <div className="pr-success" style={{ margin: "12px 0" }}>Book introduction and/or book closing prayer: included when supplied.</div> : null}
      <button type="button" className="pr-btn pr-btn-primary" onClick={runImport} disabled={!checked.ok || busy || (!prayerRows.length && !crossRows.length && !introRows.length && !rows?.bookIntro)}>{busy ? <Loader2Icon className="h-4 w-4 animate-spin" /> : <UploadIcon className="h-4 w-4" />}{busy ? "Importing…" : rows?.backfillOnly ? "Import cross-references only" : "Import this book"}</button>
      {report ? <div style={{ marginTop: 14 }}>{report.errors?.length ? <div className="pr-error">{report.errors.join("\n")}</div> : <div className="pr-success">Import complete. Cross-references: {report.summary?.CrossReference?.inserted || 0} new, {report.summary?.CrossReference?.updated || 0} updated.</div>}</div> : null}
    </div> : null}

    <div className="pr-card pr-card-pad"><h3 className="pr-heading" style={{ fontSize: "1.05rem", fontWeight: 800, margin: "0 0 6px" }}><Link2Icon className="h-4 w-4" style={{ display: "inline", color: "var(--pr-gold-deep)" }} /> What is already in the app</h3><p style={{ margin: "0 0 14px", fontSize: "0.88rem" }}>Pick a book and chapter to review imported content.</p>
      <div className="pr-grid pr-grid-2" style={{ marginBottom: 14 }}><div className="pr-field" style={{ margin: 0 }}><label className="pr-label" htmlFor="import-book">Book</label><select id="import-book" className="pr-select" value={bookNumber} onChange={(event) => setBookNumber(Number(event.target.value))}>{BIBLE_BOOKS.map((book) => <option key={book.number} value={book.number}>{book.number}. {book.name}</option>)}</select></div><div className="pr-field" style={{ margin: 0 }}><label className="pr-label" htmlFor="import-chapter">Chapter</label><input id="import-chapter" className="pr-input" type="number" min={1} value={chapter} onChange={(event) => setChapter(Math.max(1, Number(event.target.value) || 1))} /></div></div>
      {installedLoading ? <p style={{ fontSize: "0.85rem" }}>Looking at the app…</p> : <><p style={{ margin: "0 0 10px", fontSize: "0.85rem" }}>{installedPassages.length} prayer passages, {installedCrossRefs.length} cross-references, {installedIntros.length} chapter introductions in {bookNameFor(bookNumber)} {chapter}.</p>{installedIntros.map((row) => <div key={row.id} className="pr-success" style={{ marginBottom: 8 }}>Chapter introduction: {truncate(row.intro_en || row.intro_lu, 180)}</div>)}{(installed?.bookIntros || []).map((row) => <div key={row.id} className="pr-success" style={{ marginBottom: 8 }}>Book intro/closing prayer: {truncate(row.intro_en || row.intro_lu || row.closing_prayer_en || row.closing_prayer_lu, 180)}</div>)}{installedPassages.map((row) => <div key={row.id} className="pr-success" style={{ marginBottom: 8 }}>{row.title_en || row.title_lu || "Prayer"} · {verseLabel(row.verse, row.verse_end)}  -  {truncate(row.prayer_en || row.prayer_lu, 150)}</div>)}{installedCrossRefs.map((row) => <div key={row.id} className="pr-success" style={{ marginBottom: 8 }}>Verse {row.verse} → {bookNameFor(row.ref_book_number)} {row.ref_chapter}:{row.ref_verse}  -  {truncate(row.ref_text_en, 130)}</div>)}{!installedPassages.length && !installedCrossRefs.length && !installedIntros.length && !(installed?.bookIntros || []).length ? <div className="pr-success">Nothing has been imported for this chapter yet.</div> : null}</>}
    </div>
  </div>;
}