import React, { useMemo, useRef, useState } from "react";
import { callAdminData } from "@/lib/adminSession";
import { UploadIcon, DownloadIcon, Loader2Icon, CheckIcon, XIcon } from "lucide-react";

const TEMPLATE = { format: "pray-read-verse-songs-v1", series: { series_title: "philemon", display_order: 0, description: "", thumbnail_url: "", featured: false }, songs: [{ song_title: "In the Beginning", description: "", mp3_url: "https://example.com/song.mp3", thumbnail_url: "", published: true }] };
const asText = (value) => value === null || value === undefined ? "" : String(value).trim();
const validMp3 = (value) => { try { const url = new URL(value); return ["http:", "https:"].includes(url.protocol) && /\.(mp3|m4a|wav)$/i.test(url.pathname); } catch { return false; } };
const supplied = (object, key) => Object.prototype.hasOwnProperty.call(object, key);
export default function VerseSongBulkImport({ onImported }) {
  const inputRef = useRef(null); const [fileName, setFileName] = useState(""); const [raw, setRaw] = useState(""); const [busy, setBusy] = useState(false); const [report, setReport] = useState(null); const [error, setError] = useState("");
  const parsed = useMemo(() => { if (!raw) return null; try { return JSON.parse(raw); } catch { return null; } }, [raw]);
  const songs = Array.isArray(parsed?.songs) ? parsed.songs : [];
  const errors = [];
  if (raw && !parsed) errors.push("The file is not valid JSON.");
  if (parsed && parsed.format !== "pray-read-verse-songs-v1") errors.push("Use the pray-read-verse-songs-v1 format.");
  if (parsed && !asText(parsed.series?.series_title)) errors.push("Series Title is required.");
  if (parsed && !Array.isArray(parsed.songs)) errors.push("Songs must be an array.");
  songs.forEach((song, index) => { if (!asText(song.song_title)) errors.push(`Song ${index + 1}: Song Title is required.`); if (!validMp3(asText(song.mp3_url))) errors.push(`Song ${index + 1}: Enter a valid MP3 URL.`); });
  const downloadTemplate = () => { const url = URL.createObjectURL(new Blob([JSON.stringify(TEMPLATE, null, 2)], { type: "application/json" })); const anchor = document.createElement("a"); anchor.href = url; anchor.download = "verse-songs-template.json"; anchor.click(); URL.revokeObjectURL(url); };
  const readFile = async (file) => { setError(""); setReport(null); setFileName(file?.name || ""); setRaw(file ? await file.text() : ""); };
  const runImport = async () => {
    if (errors.length || !parsed) return; setBusy(true); setError(""); setReport(null);
    try {
      const title = parsed.series.series_title; const allSeries = (await callAdminData("list", { entity: "VerseSongSeries", limit: 5000 })).rows || [];
      const existingSeries = allSeries.find((row) => row.name === title);
      const seriesValues = { name: title };
      if (supplied(parsed.series, "display_order")) seriesValues.display_order = Number(parsed.series.display_order) || 0;
      if (supplied(parsed.series, "description")) seriesValues.description = parsed.series.description ?? "";
      if (supplied(parsed.series, "thumbnail_url")) { seriesValues.thumbnail = parsed.series.thumbnail_url ?? ""; seriesValues.cover_image = parsed.series.thumbnail_url ?? ""; }
      if (supplied(parsed.series, "featured")) seriesValues.featured = Boolean(parsed.series.featured);
      let seriesId = existingSeries?.id;
      if (existingSeries) await callAdminData("update", { entity: "VerseSongSeries", id: existingSeries.id, values: seriesValues });
      else { const result = await callAdminData("create", { entity: "VerseSongSeries", values: seriesValues }); seriesId = result?.row?.id || result?.id; }
      const allSongs = (await callAdminData("list", { entity: "VerseSongEpisode", limit: 10000 })).rows || [];
      const matches = new Map(allSongs.filter((row) => asText(row.series_name).toLowerCase() === title.toLowerCase()).map((row) => [asText(row.title).toLowerCase(), row]));
      let inserted = 0; let updated = 0;
      for (const item of songs) {
        const values = { title: item.song_title, series_name: title, audio_url: item.mp3_url };
        if (supplied(item, "description")) values.description = item.description ?? "";
        if (supplied(item, "duration_seconds")) values.duration_seconds = Number(item.duration_seconds) || 0;
        if (supplied(item, "thumbnail_url")) { values.thumbnail = item.thumbnail_url ?? ""; values.cover_url = item.thumbnail_url ?? ""; }
        if (supplied(item, "published")) values.active = item.published !== false;
        const prior = matches.get(asText(item.song_title).toLowerCase());
        if (prior) { await callAdminData("update", { entity: "VerseSongEpisode", id: prior.id, values }); updated += 1; }
        else { await callAdminData("create", { entity: "VerseSongEpisode", values }); inserted += 1; }
      }
      setReport({ seriesId, inserted, updated, skipped: 0 }); await onImported?.();
    } catch (err) { setError(err.message || "The file could not be imported."); } finally { setBusy(false); }
  };
  return <div className="pr-card pr-card-pad"><p className="pr-muted">Import creates or updates the matching series and songs; it does not delete other songs.</p>
    <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 14 }}><button type="button" className="pr-btn pr-btn-outline pr-btn-sm" onClick={downloadTemplate}><DownloadIcon className="h-4 w-4" style={{ display: "inline" }} /> Download template</button><button type="button" className="pr-btn pr-btn-primary pr-btn-sm" onClick={() => inputRef.current?.click()}><UploadIcon className="h-4 w-4" style={{ display: "inline" }} /> Choose JSON file</button><input ref={inputRef} type="file" accept="application/json,.json" hidden onChange={(event) => readFile(event.target.files?.[0])} /></div>
    {fileName ? <p className="pr-muted">Selected: {fileName}</p> : null}{errors.length ? <ul style={{ color: "#a11", paddingInlineStart: 20 }}>{errors.map((item) => <li key={item}>{item}</li>)}</ul> : null}{error ? <div className="pr-error">{error}</div> : null}
    <button type="button" className="pr-btn pr-btn-primary" disabled={busy || errors.length > 0 || !parsed} onClick={runImport}>{busy ? <Loader2Icon className="h-4 w-4 animate-spin" /> : <UploadIcon className="h-4 w-4" />} Import songs</button>
    {report ? <div className="pr-success" style={{ marginTop: 14 }}><CheckIcon className="h-4 w-4" style={{ display: "inline" }} /> Import complete: {report.inserted} inserted, {report.updated} updated, {report.skipped} skipped. Series saved.</div> : null}{raw && !parsed ? <div style={{ color: "#a11", marginTop: 10 }}><XIcon className="h-4 w-4" style={{ display: "inline" }} /> Check the JSON file and try again.</div> : null}
  </div>;
}