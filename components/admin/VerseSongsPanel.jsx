import React, { useCallback, useEffect, useMemo, useState } from "react";
import { callAdminData } from "@/lib/adminSession";
import { BIBLE_BOOKS } from "@/lib/bibleBooks";
import VerseSongSeriesForm from "@/components/admin/VerseSongSeriesForm";
import VerseSongForm from "@/components/admin/VerseSongForm";
import VerseSongBulkImport from "@/components/admin/VerseSongBulkImport";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import {
  PlusIcon,
  PencilIcon,
  Trash2Icon,
  SearchIcon,
  Loader2Icon,
  MusicIcon,
  ListIcon
} from "lucide-react";

const TABS = [
  { id: "songs", label: "Songs" },
  { id: "series", label: "Series" },
  { id: "bulk", label: "Bulk upload" }
];

const asText = (value) => (value === null || value === undefined ? "" : String(value).trim());
const isOn = (value) => !(value === false || value === "false" || value === 0);

/**
 * The verse-song desk of the content manager.
 *
 * The series come first, because a song always belongs to a series. The
 * name of a series is stored exactly as it was typed and is shown that way
 * on the public site.
 */
export default function VerseSongsPanel() {
  const [tab, setTab] = useState("songs");
  const [seriesRows, setSeriesRows] = useState([]);
  const [songRows, setSongRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");
  const [seriesFilter, setSeriesFilter] = useState("");
  const [languageFilter, setLanguageFilter] = useState("");
  const [selected, setSelected] = useState([]);
  const [editingSeries, setEditingSeries] = useState(null);
  const [editingSong, setEditingSong] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [seriesData, songData] = await Promise.all([
        callAdminData("list", { entity: "VerseSongSeries", limit: 500 }),
        callAdminData("list", { entity: "VerseSongEpisode", limit: 1000 })
      ]);
      setSeriesRows(seriesData.rows || []);
      setSongRows(songData.rows || []);
    } catch (err) {
      setError(err.message || "The verse songs could not be loaded.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const seriesOptions = useMemo(
    () => seriesRows.map((row) => ({ id: row.id, name: asText(row.name) })).filter((row) => row.name),
    [seriesRows]
  );

  const songsInSeries = (name) => songRows.filter((row) => asText(row.series_name) === name).length;

  const filteredSongs = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return songRows.filter((row) => {
      if (seriesFilter && asText(row.series_name) !== seriesFilter) return false;
      if (languageFilter && asText(row.language).toUpperCase() !== languageFilter) return false;
      if (!needle) return true;
      return [row.title, row.series_name, row.book_name, row.verse_ref, row.language]
        .map((value) => asText(value).toLowerCase())
        .join(" ")
        .includes(needle);
    });
  }, [songRows, search, seriesFilter, languageFilter]);

  const saveSeries = async (values) => {
    setSaving(true);
    setFormError("");
    try {
      if (editingSeries && editingSeries.id) {
        await callAdminData("update", { entity: "VerseSongSeries", id: editingSeries.id, values });
        setNotice("The series was changed.");
      } else {
        await callAdminData("create", { entity: "VerseSongSeries", values });
        setNotice("The series was added.");
      }
      setEditingSeries(null);
      await load();
    } catch (err) {
      setFormError(err.message || "The series could not be saved.");
    } finally {
      setSaving(false);
    }
  };

  const saveSong = async (values) => {
    setSaving(true);
    setFormError("");
    try {
      if (editingSong && editingSong.id) {
        await callAdminData("update", { entity: "VerseSongEpisode", id: editingSong.id, values });
        setNotice("The song was changed.");
      } else {
        await callAdminData("create", { entity: "VerseSongEpisode", values });
        setNotice("The song was added.");
      }
      setEditingSong(null);
      await load();
    } catch (err) {
      setFormError(err.message || "The song could not be saved.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      if (pendingDelete.kind === "series") {
        const name = asText(pendingDelete.row.name);
        const songs = songRows.filter((row) => asText(row.series_name) === name);
        for (const song of songs) {
          await callAdminData("update", {
            entity: "VerseSongEpisode",
            id: song.id,
            values: { series_name: "No Series" }
          });
        }
        await callAdminData("delete", { entity: "VerseSongSeries", id: pendingDelete.row.id });
        setNotice(`The series was removed. ${songs.length} songs are now without a series.`);
      } else {
        await callAdminData("delete", { entity: "VerseSongEpisode", id: pendingDelete.row.id });
        setNotice("The song was deleted.");
      }
      setPendingDelete(null);
      await load();
    } catch (err) {
      setError(err.message || "The record could not be deleted.");
    } finally {
      setDeleting(false);
    }
  };

  const bulkUpdate = async (active) => {
    setSaving(true);
    try {
      for (const id of selected) {
        await callAdminData("update", { entity: "VerseSongEpisode", id, values: { active } });
      }
      setNotice(`${selected.length} songs were ${active ? "shown" : "hidden"}.`);
      setSelected([]);
      await load();
    } catch (err) {
      setError(err.message || "The songs could not be changed.");
    } finally {
      setSaving(false);
    }
  };

  const bulkDelete = async () => {
    setSaving(true);
    try {
      for (const id of selected) {
        await callAdminData("delete", { entity: "VerseSongEpisode", id });
      }
      setNotice(`${selected.length} songs were deleted.`);
      setSelected([]);
      await load();
    } catch (err) {
      setError(err.message || "The songs could not be deleted.");
    } finally {
      setSaving(false);
    }
  };

  const toggleSelected = (id) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((row) => row !== id) : [...prev, id]));

  return (
    <div>
      <div className="pr-tabs" style={{ marginBottom: 16 }}>
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`pr-tab ${tab === item.id ? "pr-tab-active" : ""}`}
            onClick={() => setTab(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      {error ? <div className="pr-error" style={{ marginBottom: 14 }}>{error}</div> : null}
      {notice ? <div className="pr-success" style={{ marginBottom: 14 }}>{notice}</div> : null}

      {loading ? (
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "22px 0" }}>
          <Loader2Icon className="h-5 w-5 animate-spin" />
          <span className="pr-muted" style={{ fontSize: "0.88rem" }}>
            Loading the verse songs…
          </span>
        </div>
      ) : null}

      {!loading && tab === "series" ? (
        <div className="pr-card pr-card-pad">
          <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", marginBottom: 14 }}>
            <h2 className="pr-heading" style={{ margin: 0, fontSize: "1.05rem" }}>
              Series ({seriesRows.length})
            </h2>
            <button
              type="button"
              className="pr-btn pr-btn-primary pr-btn-sm"
              style={{ marginLeft: "auto" }}
              onClick={() => {
                setFormError("");
                setEditingSeries({});
              }}
            >
              <PlusIcon className="h-4 w-4" style={{ display: "inline" }} /> Add a series
            </button>
          </div>

          {seriesRows.length === 0 ? (
            <p className="pr-muted" style={{ margin: 0, fontSize: "0.88rem" }}>
              No series yet. Add the first one, then add the songs to it.
            </p>
          ) : (
            <div style={{ display: "grid", gap: 10 }}>
              {seriesRows.map((row) => (
                <div key={row.id} className="pr-card pr-card-pad">
                  <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                    {row.cover_image || row.thumbnail ? (
                      <img
                        src={row.cover_image || row.thumbnail}
                        alt=""
                        style={{ width: 64, height: 44, objectFit: "cover", borderRadius: 8 }}
                      />
                    ) : null}
                    <div style={{ minWidth: 0, flex: "1 1 200px" }}>
                      <strong className="pr-heading" style={{ fontSize: "0.94rem" }}>
                        {asText(row.name)}
                      </strong>
                      <p className="pr-muted" style={{ margin: "4px 0 0", fontSize: "0.78rem" }}>
                        {songsInSeries(asText(row.name))} songs · {isOn(row.active) ? "shown" : "hidden"}
                      </p>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        type="button"
                        className="pr-btn pr-btn-outline pr-btn-sm"
                        onClick={() => {
                          setFormError("");
                          setEditingSeries({
                            id: row.id,
                            name: asText(row.name),
                            description: asText(row.description),
                            cover_image: asText(row.cover_image || row.thumbnail),
                            active: isOn(row.active)
                          });
                        }}
                      >
                        <PencilIcon className="h-4 w-4" style={{ display: "inline" }} /> Edit
                      </button>
                      <button
                        type="button"
                        className="pr-btn pr-btn-danger pr-btn-sm"
                        onClick={() => setPendingDelete({ kind: "series", row })}
                      >
                        <Trash2Icon className="h-4 w-4" style={{ display: "inline" }} /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : null}

      {!loading && tab === "songs" ? (
        <div>
          <div style={{ display: "flex", gap: 12, alignItems: "flex-end", flexWrap: "wrap", marginBottom: 14 }}>
            <div className="pr-field" style={{ margin: 0, flex: "1 1 220px" }}>
              <label className="pr-label">Search</label>
              <div style={{ position: "relative" }}>
                <SearchIcon
                  className="h-4 w-4"
                  style={{ position: "absolute", left: 12, top: 12, color: "var(--pr-body)", pointerEvents: "none" }}
                />
                <input
                  className="pr-input"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Title, series, book or verse"
                  style={{ paddingLeft: 34 }}
                />
              </div>
            </div>
            <div className="pr-field" style={{ margin: 0 }}>
              <label className="pr-label">Series</label>
              <select className="pr-select" value={seriesFilter} onChange={(event) => setSeriesFilter(event.target.value)}>
                <option value="">All series</option>
                {seriesOptions.map((row) => (
                  <option key={row.id} value={row.name}>
                    {row.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="pr-field" style={{ margin: 0 }}>
              <label className="pr-label">Language</label>
              <select className="pr-select" value={languageFilter} onChange={(event) => setLanguageFilter(event.target.value)}>
                <option value="">All</option>
                {["EN", "LU", "BOTH"].map((row) => (
                  <option key={row} value={row}>
                    {row}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="button"
              className="pr-btn pr-btn-primary"
              onClick={() => {
                setFormError("");
                setEditingSong({});
              }}
            >
              <PlusIcon className="h-4 w-4" style={{ display: "inline" }} /> Add a song
            </button>
          </div>

          {selected.length ? (
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
              <button type="button" className="pr-btn pr-btn-outline pr-btn-sm" onClick={() => bulkUpdate(true)}>
                Activate {selected.length}
              </button>
              <button type="button" className="pr-btn pr-btn-outline pr-btn-sm" onClick={() => bulkUpdate(false)}>
                Deactivate {selected.length}
              </button>
              <button type="button" className="pr-btn pr-btn-danger pr-btn-sm" onClick={bulkDelete}>
                Delete {selected.length}
              </button>
            </div>
          ) : null}

          <div className="pr-card pr-card-pad">
            {filteredSongs.length === 0 ? (
              <div style={{ textAlign: "center" }}>
                <ListIcon className="h-7 w-7" style={{ color: "var(--pr-gold-deep)" }} />
                <h3 className="pr-heading" style={{ margin: "10px 0 6px", fontSize: "1rem" }}>
                  No songs here yet
                </h3>
                <p className="pr-muted" style={{ margin: "0 0 14px", fontSize: "0.87rem" }}>
                  Add the first song with the form, or upload a JSON file of songs.
                </p>
                <button
                  type="button"
                  className="pr-btn pr-btn-primary"
                  onClick={() => {
                    setFormError("");
                    setEditingSong({});
                  }}
                >
                  <PlusIcon className="h-4 w-4" style={{ display: "inline" }} /> Add a song
                </button>
              </div>
            ) : (
              <div className="pr-scroll-x">
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.83rem" }}>
                  <thead>
                    <tr style={{ textAlign: "start", borderBottom: "1px solid var(--pr-border)" }}>
                      <th style={{ padding: "8px 10px" }} />
                      {["Cover", "Title", "Series", "Book Ch:V", "Language", "Active", "Plays", "Actions"].map((label) => (
                        <th key={label} style={{ padding: "8px 10px", color: "var(--pr-gold-deep)", fontWeight: 800 }}>
                          {label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSongs.map((row) => (
                      <tr key={row.id} style={{ borderBottom: "1px solid var(--pr-border)" }}>
                        <td style={{ padding: "8px 10px" }}>
                          <input
                            type="checkbox"
                            checked={selected.includes(row.id)}
                            onChange={() => toggleSelected(row.id)}
                            aria-label="Choose this song"
                          />
                        </td>
                        <td style={{ padding: "8px 10px" }}>
                          {row.cover_url || row.thumbnail ? (
                            <img
                              src={row.cover_url || row.thumbnail}
                              alt=""
                              style={{ width: 46, height: 32, objectFit: "cover", borderRadius: 6 }}
                            />
                          ) : (
                            <MusicIcon className="h-4 w-4" style={{ color: "var(--pr-body)" }} />
                          )}
                        </td>
                        <td style={{ padding: "8px 10px" }}>{asText(row.title)}</td>
                        <td style={{ padding: "8px 10px" }}>{asText(row.series_name)}</td>
                        <td style={{ padding: "8px 10px" }}>
                          {[asText(row.book_name), row.chapter ? `Ch ${row.chapter}` : "", asText(row.verse)]
                            .filter(Boolean)
                            .join(" ") || " - "}
                        </td>
                        <td style={{ padding: "8px 10px" }}>{asText(row.language) || " - "}</td>
                        <td style={{ padding: "8px 10px" }}>{isOn(row.active) ? "Yes" : "No"}</td>
                        <td style={{ padding: "8px 10px" }}>{Number(row.plays_count || 0)}</td>
                        <td style={{ padding: "8px 10px" }}>
                          <div style={{ display: "flex", gap: 6 }}>
                            <button
                              type="button"
                              className="pr-icon-btn"
                              style={{ width: 32, height: 32 }}
                              onClick={() => {
                                setFormError("");
                                setEditingSong({
                                  id: row.id,
                                  title: asText(row.title),
                                  series_name: asText(row.series_name),
                                  book_number: row.book_number ? String(row.book_number) : "",
                                  chapter: row.chapter ? String(row.chapter) : "",
                                  verse: asText(row.verse),
                                  verse_ref: asText(row.verse_ref),
                                  language: asText(row.language) || "EN",
                                  version: asText(row.version),
                                  audio_url: asText(row.audio_url),
                                  cover_url: asText(row.cover_url || row.thumbnail),
                                  lyrics_en: asText(row.lyrics_en),
                                  lyrics_lu: asText(row.lyrics_lu),
                                  episode_order: row.episode_order ? String(row.episode_order) : "",
                                  active: isOn(row.active)
                                });
                              }}
                              aria-label="Edit"
                            >
                              <PencilIcon className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              className="pr-icon-btn"
                              style={{ width: 32, height: 32 }}
                              onClick={() => setPendingDelete({ kind: "song", row })}
                              aria-label="Delete"
                            >
                              <Trash2Icon className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      ) : null}

      {!loading && tab === "bulk" ? (
        <VerseSongBulkImport
          seriesNames={seriesOptions.map((row) => row.name)}
          onImported={load}
        />
      ) : null}

      {editingSeries ? (
        <VerseSongSeriesForm
          key={editingSeries.id || "new-series"}
          initial={editingSeries}
          busy={saving}
          error={formError}
          onSave={saveSeries}
          onCancel={() => setEditingSeries(null)}
        />
      ) : null}

      {editingSong ? (
        <VerseSongForm
          key={editingSong.id || "new-song"}
          initial={editingSong}
          seriesOptions={seriesOptions}
          busy={saving}
          error={formError}
          onSave={saveSong}
          onCancel={() => setEditingSong(null)}
        />
      ) : null}

      <ConfirmDialog
        open={!!pendingDelete}
        title={pendingDelete && pendingDelete.kind === "series" ? "Delete this series?" : "Delete this song?"}
        message={
          pendingDelete && pendingDelete.kind === "series"
            ? `“${asText(pendingDelete.row.name)}” will be removed. The songs of the series are kept, but they will no longer belong to a series.`
            : pendingDelete
            ? `“${asText(pendingDelete.row.title)}” will be removed from the app.`
            : ""
        }
        busy={deleting}
        onConfirm={remove}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}