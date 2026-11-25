import React, { useCallback, useEffect, useMemo, useState } from "react";
import { callAdminData } from "@/lib/adminSession";
import { COLLECTION_BY_ID, emptyRecord, splitRefs } from "@/lib/adminCollections";
import { parseReference } from "@/lib/scriptureRefs";
import { BIBLE_BOOKS } from "@/lib/bibleBooks";
import RecordEditor from "@/components/admin/RecordEditor";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import {
  PlusIcon,
  PencilIcon,
  Trash2Icon,
  SearchIcon,
  Loader2Icon,
  BookOpenIcon
} from "lucide-react";

const FIELDS = COLLECTION_BY_ID.Prayer.fields;

/**
 * The prayer library and the prayer passages.
 *
 * In library mode every prayer in the app is listed. In passages mode the
 * admin picks a book, chapter and verse and sees the prayers that belong to
 * that passage, ready to be written or changed.
 */
export default function PrayersPanel({ mode = "library" }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");
  const [book, setBook] = useState("");
  const [chapter, setChapter] = useState("");
  const [verse, setVerse] = useState("");
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await callAdminData("list", { entity: "Prayer", limit: 500 });
      setRows(data.rows || []);
    } catch (err) {
      setError(err.message || "The prayer library could not be loaded.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return rows.filter((row) => {
      if (needle) {
        const haystack = [
          row.title,
          row.title_lu,
          row.category,
          row.scripture_ref,
          row.body_en,
          row.body_lu
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(needle)) return false;
      }
      if (mode !== "passages") return true;
      const reference = parseReference(row.scripture_ref);
      if (!reference) return false;
      if (book && reference.bookName !== book) return false;
      if (chapter && Number(reference.chapter) !== Number(chapter)) return false;
      if (verse && Number(reference.verse) !== Number(verse)) return false;
      return true;
    });
  }, [rows, search, mode, book, chapter, verse]);

  const openNew = () => {
    setFormError("");
    setEditing({ id: "", values: emptyRecord("Prayer") });
  };

  const openEdit = (row) => {
    setFormError("");
    const values = emptyRecord("Prayer");
    FIELDS.forEach(([name]) => {
      values[name] = row[name] === null || row[name] === undefined ? "" : String(row[name]);
    });
    setEditing({ id: row.id, values });
  };

  const save = async () => {
    const values = editing.values;
    if (!String(values.title || "").trim()) {
      setFormError("The prayer needs a title.");
      return;
    }
    setSaving(true);
    setFormError("");
    try {
      const payload = {};
      FIELDS.forEach(([name]) => {
        payload[name] = values[name] === "" ? null : values[name];
      });
      if (editing.id) {
        await callAdminData("update", { entity: "Prayer", id: editing.id, values: payload });
      } else {
        await callAdminData("create", { entity: "Prayer", values: payload });
      }
      setEditing(null);
      setNotice(editing.id ? "The prayer was changed." : "The prayer was added.");
      await load();
    } catch (err) {
      setFormError(err.message || "The prayer could not be saved.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await callAdminData("delete", { entity: "Prayer", id: pendingDelete.id });
      setPendingDelete(null);
      setNotice("The prayer was deleted.");
      await load();
    } catch (err) {
      setError(err.message || "The prayer could not be deleted.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      {mode === "passages" ? (
        <div className="pr-card pr-card-pad" style={{ marginBottom: 18 }}>
          <h2 className="pr-heading" style={{ margin: "0 0 4px", fontSize: "1.05rem" }}>
            Find a passage
          </h2>
          <p className="pr-muted" style={{ margin: "0 0 14px", fontSize: "0.85rem" }}>
            Pick the book, chapter and verse to see the prayers that belong to it.
          </p>
          <div style={{ display: "grid", gap: 12, gridTemplateColumns: "1fr" }}>
            <div className="pr-field" style={{ margin: 0 }}>
              <label className="pr-label">Book</label>
              <select
                className="pr-select"
                value={book}
                onChange={(event) => setBook(event.target.value)}
              >
                <option value="">Every book</option>
                {BIBLE_BOOKS.map((item) => (
                  <option key={item.number} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ display: "grid", gap: 12, gridTemplateColumns: "1fr 1fr" }}>
              <div className="pr-field" style={{ margin: 0 }}>
                <label className="pr-label">Chapter</label>
                <input
                  type="number"
                  className="pr-input"
                  value={chapter}
                  onChange={(event) => setChapter(event.target.value)}
                  placeholder="3"
                />
              </div>
              <div className="pr-field" style={{ margin: 0 }}>
                <label className="pr-label">Verse</label>
                <input
                  type="number"
                  className="pr-input"
                  value={verse}
                  onChange={(event) => setVerse(event.target.value)}
                  placeholder="16"
                />
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <div
        style={{
          display: "flex",
          gap: 12,
          alignItems: "flex-end",
          flexWrap: "wrap",
          marginBottom: 16
        }}
      >
        <div className="pr-field" style={{ margin: 0, flex: "1 1 240px" }}>
          <label className="pr-label">Search</label>
          <div style={{ position: "relative" }}>
            <SearchIcon
              className="h-4 w-4"
              style={{
                position: "absolute",
                left: 12,
                top: 12,
                color: "var(--pr-body)",
                pointerEvents: "none"
              }}
            />
            <input
              className="pr-input"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Title, category, passage or text"
              style={{ paddingLeft: 34 }}
            />
          </div>
        </div>
        <button type="button" className="pr-btn pr-btn-primary" onClick={openNew}>
          <PlusIcon className="h-4 w-4" style={{ display: "inline" }} /> Add a prayer
        </button>
      </div>

      {error ? <div className="pr-error" style={{ marginBottom: 14 }}>{error}</div> : null}
      {notice ? <div className="pr-success" style={{ marginBottom: 14 }}>{notice}</div> : null}

      {loading ? (
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "22px 0" }}>
          <Loader2Icon className="h-5 w-5 animate-spin" />
          <span className="pr-muted" style={{ fontSize: "0.88rem" }}>
            Loading the prayers…
          </span>
        </div>
      ) : error ? null : filtered.length === 0 ? (
        <div className="pr-card pr-card-pad" style={{ textAlign: "center" }}>
          <BookOpenIcon className="h-7 w-7" style={{ color: "var(--pr-gold-deep)" }} />
          <h3 className="pr-heading" style={{ margin: "10px 0 6px", fontSize: "1rem" }}>
            No prayer here yet
          </h3>
          <p className="pr-muted" style={{ margin: "0 0 16px", fontSize: "0.87rem" }}>
            {mode === "passages"
              ? "No prayer belongs to this passage yet. Add one, or import a JSON file from the import panel."
              : "The prayer library is empty. Add a prayer, or import a JSON file from the import panel."}
          </p>
          <button type="button" className="pr-btn pr-btn-primary" onClick={openNew}>
            <PlusIcon className="h-4 w-4" style={{ display: "inline" }} /> Add a prayer
          </button>
        </div>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {filtered.map((row) => {
            const refs = splitRefs(row.cross_refs);
            return (
              <div key={row.id} className="pr-card pr-card-pad">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 12,
                    alignItems: "flex-start",
                    flexWrap: "wrap"
                  }}
                >
                  <div style={{ minWidth: 0, flex: "1 1 240px" }}>
                    <h3 className="pr-heading" style={{ margin: 0, fontSize: "0.98rem" }}>
                      {row.title || "Untitled prayer"}
                    </h3>
                    {row.title_lu ? (
                      <p className="pr-muted" style={{ margin: "2px 0 0", fontSize: "0.82rem" }}>
                        {row.title_lu}
                      </p>
                    ) : null}
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 8,
                        marginTop: 10
                      }}
                    >
                      {row.category ? (
                        <span className="pr-badge pr-badge-outline">{row.category}</span>
                      ) : null}
                      {row.scripture_ref ? (
                        <span className="pr-badge pr-badge-gold">{row.scripture_ref}</span>
                      ) : null}
                    </div>
                    {refs.length ? (
                      <div style={{ marginTop: 10, fontSize: "0.8rem" }} className="pr-muted">
                        <strong>Cross references:</strong> {refs.join(" · ")}
                      </div>
                    ) : null}
                    {row.body_en ? (
                      <p
                        className="pr-muted"
                        style={{
                          margin: "10px 0 0",
                          fontSize: "0.86rem",
                          lineHeight: 1.6,
                          whiteSpace: "pre-line"
                        }}
                      >
                        {String(row.body_en).slice(0, 320)}
                        {String(row.body_en).length > 320 ? "…" : ""}
                      </p>
                    ) : null}
                  </div>
                  <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                    <button
                      type="button"
                      className="pr-btn pr-btn-outline pr-btn-sm"
                      onClick={() => openEdit(row)}
                    >
                      <PencilIcon className="h-4 w-4" style={{ display: "inline" }} /> Edit
                    </button>
                    <button
                      type="button"
                      className="pr-btn pr-btn-danger pr-btn-sm"
                      onClick={() => setPendingDelete(row)}
                    >
                      <Trash2Icon className="h-4 w-4" style={{ display: "inline" }} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <RecordEditor
        open={!!editing}
        title={editing && editing.id ? "Change the prayer" : "Add a prayer"}
        subtitle="The passage tells the reader where the prayer belongs. The cross references are the other scriptures it points to."
        fields={FIELDS}
        values={editing ? editing.values : {}}
        busy={saving}
        error={formError}
        onChange={(name, value) =>
          setEditing((current) => ({ ...current, values: { ...current.values, [name]: value } }))
        }
        onSave={save}
        onCancel={() => setEditing(null)}
      />

      <ConfirmDialog
        open={!!pendingDelete}
        title="Delete this prayer?"
        message={
          pendingDelete
            ? `“${pendingDelete.title || "Untitled prayer"}” will be removed from the prayer library and from the reader.`
            : ""
        }
        busy={deleting}
        onConfirm={remove}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}