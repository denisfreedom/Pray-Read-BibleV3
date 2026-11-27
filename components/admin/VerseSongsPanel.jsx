import React, { useCallback, useEffect, useMemo, useState } from "react";
import { callAdminData } from "@/lib/adminSession";
import VerseSongSeriesForm from "@/components/admin/VerseSongSeriesForm";
import VerseSongForm from "@/components/admin/VerseSongForm";
import VerseSongBulkImport from "@/components/admin/VerseSongBulkImport";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { Loader2Icon } from "lucide-react";

const TABS = [{ id: "manage", label: "Verse-Song Music Management" }, { id: "bulk", label: "Bulk upload" }];
const asText = (value) => value === null || value === undefined ? "" : String(value).trim();
const isOn = (value) => !(value === false || value === "false" || value === 0);

export default function VerseSongsPanel() {
  const [tab, setTab] = useState("manage"); const [seriesRows, setSeriesRows] = useState([]); const [songRows, setSongRows] = useState([]); const [selectedSeries, setSelectedSeries] = useState("");
  const [search, setSearch] = useState(""); const [playingSongId, setPlayingSongId] = useState(null); const [editingSong, setEditingSong] = useState(null);
  const [loading, setLoading] = useState(true); const [saving, setSaving] = useState(false); const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(""); const [notice, setNotice] = useState(""); const [formError, setFormError] = useState(""); const [pendingDelete, setPendingDelete] = useState(null);

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const [seriesData, songData] = await Promise.all([callAdminData("list", { entity: "VerseSongSeries", limit: 1000 }), callAdminData("list", { entity: "VerseSongEpisode", limit: 5000 })]);
      setSeriesRows(seriesData.rows || []); setSongRows(songData.rows || []); setSelectedSeries((current) => (seriesData.rows || []).some((row) => row.name === current) ? current : (seriesData.rows || [])[0]?.name || "");
    } catch (err) { setError(err.message || "The verse songs could not be loaded."); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);
  const seriesOptions = useMemo(() => seriesRows.map((row) => ({ id: row.id, name: asText(row.name) })).filter((row) => row.name), [seriesRows]);
  const filteredSongs = useMemo(() => { const needle = search.trim().toLowerCase(); return songRows.filter((row) => asText(row.series_name) === selectedSeries && (!needle || `${asText(row.title)} ${asText(row.description)}`.toLowerCase().includes(needle))); }, [songRows, selectedSeries, search]);

  const saveSeries = async (values) => {
    setSaving(true); setFormError("");
    try { const existing = seriesRows.find((row) => asText(row.name) === asText(values.name)); if (existing) await callAdminData("update", { entity: "VerseSongSeries", id: existing.id, values }); else await callAdminData("create", { entity: "VerseSongSeries", values }); setSelectedSeries(asText(values.name)); setNotice("Series saved."); await load(); }
    catch (err) { setFormError(err.message || "The series could not be saved."); } finally { setSaving(false); }
  };
  const saveSong = async (values) => {
    setSaving(true); setFormError("");
    try {
      if (editingSong?.id) await callAdminData("update", { entity: "VerseSongEpisode", id: editingSong.id, values });
      else { const duplicate = songRows.find((row) => asText(row.series_name).toLowerCase() === asText(values.series_name).toLowerCase() && asText(row.title).toLowerCase() === asText(values.title).toLowerCase()); if (duplicate) await callAdminData("update", { entity: "VerseSongEpisode", id: duplicate.id, values }); else await callAdminData("create", { entity: "VerseSongEpisode", values }); }
      setEditingSong(null); setNotice("Song saved."); await load();
    } catch (err) { setFormError(err.message || "The song could not be saved."); } finally { setSaving(false); }
  };
  const removeSong = async () => { if (!pendingDelete) return; setDeleting(true); try { await callAdminData("delete", { entity: "VerseSongEpisode", id: pendingDelete.id }); setPendingDelete(null); setNotice("Song deleted."); await load(); } catch (err) { setError(err.message || "The song could not be deleted."); } finally { setDeleting(false); } };

  return <div>
    <div className="pr-tabs" style={{ marginBottom: 16 }}>{TABS.map((item) => <button key={item.id} type="button" className={`pr-tab ${tab === item.id ? "pr-tab-active" : ""}`} onClick={() => setTab(item.id)}>{item.label}</button>)}</div>
    {error ? <div className="pr-error" style={{ marginBottom: 14 }}>{error}</div> : null}{notice ? <div className="pr-success" style={{ marginBottom: 14 }}>{notice}</div> : null}
    {loading ? <div style={{ display: "flex", gap: 10, alignItems: "center", padding: 22 }}><Loader2Icon className="h-5 w-5 animate-spin" /> Loading the verse songs…</div> : null}
    {!loading && tab === "manage" ? <>
      <header className="pr-card pr-card-pad" style={{ marginBottom: 18 }}><h1 className="pr-heading" style={{ margin: 0 }}>♫ Verse-Song Music Management</h1></header>
      <VerseSongSeriesForm busy={saving} error={formError} onSave={saveSeries} />
      <div className="pr-field" style={{ maxWidth: 520, marginBottom: 18 }}><label className="pr-label" htmlFor="vs-selected-series">Select Series</label><select id="vs-selected-series" className="pr-select" value={selectedSeries} onChange={(event) => { setSelectedSeries(event.target.value); setEditingSong(null); }}><option value="">Select a series</option>{[...seriesOptions].sort((a, b) => (Number(seriesRows.find((row) => row.id === a.id)?.display_order) || 0) - (Number(seriesRows.find((row) => row.id === b.id)?.display_order) || 0)).map((row) => <option key={row.id} value={row.name}>{row.name}</option>)}</select></div>
      <VerseSongForm key={editingSong?.id || `new-${selectedSeries}`} initial={editingSong || undefined} seriesName={editingSong?.series_name || selectedSeries} busy={saving} error={formError} onSave={saveSong} onCancel={() => setEditingSong(null)} />
      <section className="pr-card pr-card-pad"><div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center", marginBottom: 14 }}><h2 className="pr-heading" style={{ margin: 0, fontSize: "1.05rem" }}>Songs for {selectedSeries || "selected series"}</h2><input className="pr-input" style={{ maxWidth: 300, marginInlineStart: "auto" }} placeholder="Search songs..." value={search} onChange={(event) => setSearch(event.target.value)} /></div>
        {filteredSongs.length ? <div className="pr-scroll-x"><table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.84rem" }}><thead><tr>{["Cover thumb", "Song Title", "Duration", "MP3 URL", "Published", "Actions"].map((label) => <th key={label} style={{ padding: 9, textAlign: "start" }}>{label}</th>)}</tr></thead><tbody>{filteredSongs.map((row) => <tr key={row.id} style={{ borderTop: "1px solid var(--pr-border)" }}><td style={{ padding: 9 }}>{row.thumbnail || row.cover_url ? <img src={row.thumbnail || row.cover_url} alt="" style={{ width: 48, height: 36, objectFit: "cover", borderRadius: 6 }} /> : " - "}</td><td style={{ padding: 9 }}>{asText(row.title)}</td><td style={{ padding: 9 }}>{row.duration_seconds ? `${row.duration_seconds}s` : " - "}</td><td style={{ padding: 9, maxWidth: 220 }}><button type="button" className="pr-btn pr-btn-outline pr-btn-sm" onClick={() => navigator.clipboard?.writeText(asText(row.audio_url))} title="Copy MP3 URL">{asText(row.audio_url).slice(0, 42)}{asText(row.audio_url).length > 42 ? "…" : ""}</button></td><td style={{ padding: 9 }}>{isOn(row.active) ? "✓" : "✗"}</td><td style={{ padding: 9, whiteSpace: "nowrap"}}><button type="button" className="pr-btn pr-btn-outline pr-btn-sm" onClick={() => { setEditingSong({ ...row, cover_url: row.cover_url || row.thumbnail || "" }); setFormError(""); }}>Edit</button>{" "}<button type="button" className="pr-btn pr-btn-danger pr-btn-sm" onClick={() => setPendingDelete(row)}>Delete</button>{" "}<button type="button" className="pr-btn pr-btn-outline pr-btn-sm" onClick={() => setPlayingSongId(playingSongId === row.id ? null : row.id)}>{playingSongId === row.id ? "Stop" : "Play"}</button>{playingSongId === row.id ? <audio controls autoPlay src={row.audio_url} style={{ display: "block", maxWidth: 210, marginTop: 6 }} onEnded={() => setPlayingSongId(null)} onPlay={(event) => { document.querySelectorAll("audio").forEach((audio) => { if (audio !== event.currentTarget) audio.pause(); }); }} /> : null}</td></tr>)}</tbody></table></div> : <p className="pr-muted">No songs in this series yet.</p>}
      </section>
      <section className="pr-card pr-card-pad" style={{ marginTop: 20 }}><h2 className="pr-heading" style={{ marginTop: 0 }}>Series ({seriesRows.length})</h2>{seriesRows.length ? <div style={{ display: "grid", gap: 8 }}>{seriesRows.map((row) => <div key={row.id} style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: 10, borderBottom: "1px solid var(--pr-border)" }}><span>{asText(row.name)} · {songRows.filter((song) => asText(song.series_name) === asText(row.name)).length} songs</span><button type="button" className="pr-btn pr-btn-outline pr-btn-sm" onClick={() => setSelectedSeries(asText(row.name))}>Select</button></div>)}</div> : <p className="pr-muted">No series yet.</p>}</section>
    </> : null}
    {!loading && tab === "bulk" ? <VerseSongBulkImport onImported={load} /> : null}
    <ConfirmDialog open={!!pendingDelete} title="Delete this song?" message={pendingDelete ? `“${asText(pendingDelete.title)}” will be removed from the app.` : ""} busy={deleting} onConfirm={removeSong} onCancel={() => setPendingDelete(null)} />
  </div>;
}