import React, { useEffect, useState } from "react";

const emptySong = () => ({ title: "", description: "", audio_url: "", duration_seconds: "", cover_url: "", active: true });
export default function VerseSongForm({ initial, seriesName, busy, error, onSave, onCancel }) {
  const [values, setValues] = useState(() => ({ ...emptySong(), ...(initial || {}) }));
  useEffect(() => {
    if (!values.audio_url || values.duration_seconds) return undefined;
    const audio = new Audio(); audio.preload = "metadata"; audio.src = values.audio_url;
    audio.onloadedmetadata = () => { if (Number.isFinite(audio.duration)) setValues((current) => ({ ...current, duration_seconds: String(Math.round(audio.duration)) })); };
    return () => { audio.onloadedmetadata = null; audio.src = ""; };
  }, [values.audio_url, values.duration_seconds]);
  const setValue = (key, value) => setValues((current) => ({ ...current, [key]: value }));
  const validAudio = (() => { try { const url = new URL(values.audio_url.trim()); return ["http:", "https:"].includes(url.protocol) && /\.(mp3|m4a|wav)$/i.test(url.pathname); } catch { return false; } })();
  const submit = (event) => { event.preventDefault(); if (!seriesName || !values.title.trim() || !validAudio) return; onSave({ ...values, title: values.title.trim(), series_name: seriesName, duration_seconds: Number(values.duration_seconds) || undefined, thumbnail: values.cover_url, cover_url: values.cover_url, active: values.active !== false }); };
  return <form onSubmit={submit} className="pr-card pr-card-pad" style={{ background: "#f0fdf4", marginBottom: 20 }}>
    <h2 className="pr-heading" style={{ margin: "0 0 10px", fontSize: "1.1rem" }}>{initial?.id ? "Edit Song" : "＋ Add New Song"}</h2>
    {seriesName ? <p className="pr-muted" style={{ margin: "0 0 14px" }}>Adding song to series: <strong>{seriesName}</strong></p> : <div style={{ padding: 12, borderRadius: 8, background: "#fff7ed", color: "#9a3412", marginBottom: 14 }}>⚠ Please select a series above first.</div>}
    {error ? <div className="pr-error" style={{ marginBottom: 12 }}>{error}</div> : null}
    <div className="pr-field"><label className="pr-label" htmlFor="vs-song-title">Song Title *</label><input id="vs-song-title" className="pr-input" placeholder="e.g., In the Beginning" value={values.title} onChange={(event) => setValue("title", event.target.value)} required /></div>
    <div className="pr-field"><label className="pr-label" htmlFor="vs-song-duration">Duration (seconds)</label><input id="vs-song-duration" className="pr-input" placeholder="Auto-detected from MP3 URL" value={values.duration_seconds} readOnly /></div>
    <div className="pr-field"><label className="pr-label" htmlFor="vs-song-description">Description</label><textarea id="vs-song-description" className="pr-textarea" placeholder="Song description..." value={values.description || ""} onChange={(event) => setValue("description", event.target.value)} /></div>
    <div className="pr-field"><label className="pr-label" htmlFor="vs-song-mp3">MP3 URL *</label><input id="vs-song-mp3" className="pr-input" type="url" placeholder="https://example.com/song.mp3" value={values.audio_url} onChange={(event) => setValue("audio_url", event.target.value)} required /><p className="pr-muted" style={{ margin: "6px 0 0", fontSize: "0.8rem" }}>💡 Duration will auto-detect when you paste a valid MP3 URL</p>{values.audio_url && !validAudio ? <p style={{ color: "#a11", margin: "6px 0 0", fontSize: "0.8rem" }}>Enter a valid MP3 URL.</p> : null}</div>
    <div className="pr-field"><label className="pr-label" htmlFor="vs-song-thumbnail">Thumbnail URL (Optional)</label><input id="vs-song-thumbnail" className="pr-input" type="url" placeholder="https://example.com/thumbnail.jpg" value={values.cover_url || ""} onChange={(event) => setValue("cover_url", event.target.value)} /></div>
    <label style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}><input type="checkbox" checked={values.active !== false} onChange={(event) => setValue("active", event.target.checked)} />✅ Published (visible to users)</label>
    <button type="submit" className="pr-btn pr-btn-primary" disabled={busy || !seriesName || !values.title.trim() || !validAudio} style={{ width: "100%" }}>{busy ? "Saving…" : "Save Song"}</button>
    {initial?.id && onCancel ? <button type="button" className="pr-btn pr-btn-outline" style={{ marginTop: 8, width: "100%" }} onClick={onCancel}>Cancel edit</button> : null}
  </form>;
}