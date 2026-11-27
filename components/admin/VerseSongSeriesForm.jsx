import React, { useState } from "react";
import { StarIcon, SaveIcon } from "lucide-react";

export default function VerseSongSeriesForm({ initial, busy, error, onSave }) {
  const [values, setValues] = useState(() => ({ name: "", description: "", display_order: "0", cover_image: "", featured: false, active: true, ...(initial || {}) }));
  const setValue = (key, value) => setValues((current) => ({ ...current, [key]: value }));
  const submit = (event) => {
    event.preventDefault(); if (!values.name.trim()) return;
    onSave({ name: values.name, description: values.description, display_order: Number(values.display_order) || 0, thumbnail: values.cover_image, cover_image: values.cover_image, featured: Boolean(values.featured), active: values.active !== false });
  };
  return <form onSubmit={submit} className="pr-card pr-card-pad" style={{ background: "#eff6ff", marginBottom: 20 }}>
    <h2 className="pr-heading" style={{ margin: "0 0 16px", fontSize: "1.1rem" }}>＋ Create New Series</h2>{error ? <div className="pr-error" style={{ marginBottom: 12 }}>{error}</div> : null}
    <div className="pr-field"><label className="pr-label" htmlFor="vs-series-name">Series Title *</label><input id="vs-series-name" className="pr-input" value={values.name} onChange={(event) => setValue("name", event.target.value)} required /></div>
    <div className="pr-field"><label className="pr-label" htmlFor="vs-series-order">Display Order</label><input id="vs-series-order" className="pr-input" type="number" value={values.display_order} onChange={(event) => setValue("display_order", event.target.value)} /></div>
    <div className="pr-field"><label className="pr-label" htmlFor="vs-series-description">Description</label><textarea id="vs-series-description" className="pr-textarea" placeholder="Series description..." value={values.description} onChange={(event) => setValue("description", event.target.value)} /></div>
    <div className="pr-field"><label className="pr-label" htmlFor="vs-series-thumbnail">Thumbnail URL (Optional)</label><input id="vs-series-thumbnail" className="pr-input" type="url" placeholder="https://example.com/thumbnail.jpg" value={values.cover_image} onChange={(event) => setValue("cover_image", event.target.value)} /></div>
    <label style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}><input type="checkbox" checked={Boolean(values.featured)} onChange={(event) => setValue("featured", event.target.checked)} /><StarIcon className="h-4 w-4" /> Featured Series</label>
    <button type="submit" className="pr-btn pr-btn-primary" disabled={busy || !values.name.trim()} style={{ width: "100%" }}><SaveIcon className="h-4 w-4" style={{ display: "inline" }} /> {busy ? "Saving…" : "Save Series"}</button>
  </form>;
}