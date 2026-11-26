import React, { useCallback, useEffect, useMemo, useState } from "react";
import { callAdminData } from "@/lib/adminSession";
import { COLLECTION_BY_ID, emptyRecord, recordTitle } from "@/lib/adminCollections";
import { BIBLE_BOOKS } from "@/lib/bibleBooks";
import RecordEditor from "@/components/admin/RecordEditor";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import {
  PlusIcon,
  PencilIcon,
  Trash2Icon,
  SearchIcon,
  Loader2Icon,
  ListIcon,
  BookOpenIcon
} from "lucide-react";

// The section of the content manager where everything that was imported for
// a book is edited: the prayer passages, the cross-references, the
// introduction of every chapter and the introduction and the closing prayer
// of the book itself.
const TABS = [
  { id: "PrayerPassage", label: "Prayer passages" },
  { id: "CrossReference", label: "Cross-references" },
  { id: "ChapterIntro", label: "Chapter introductions" },
  { id: "BookIntro", label: "Book intro and closing prayer" }
];

/** The little piece of the record that tells the admin what it holds. */
const excerptOf = (row, tab) => {
  if (tab === "PrayerPassage") return String(row.prayer_en || "");
  if (tab === "CrossReference") return String(row.ref_text_en || row.note_en || "");
  if (tab === "ChapterIntro") return String(row.intro_en || "");
  return String(row.intro_en || row.closing_prayer_en || "");
};

/**
 * The imported prayer material of every book.
 *
 * Every tab is one collection of the app: the records are read from the
 * database, changed and written back from here, so a Luganda text that is
 * still missing can be written at any time.
 */
export default function PassagesPanel() {
  const [tab, setTab] = useState(TABS[0].id);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");
  const [book, setBook] = useState("");
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const meta = COLLECTION_BY_ID[tab];

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await callAdminData("list", { entity: tab, limit: 800 });
      setRows(data.rows || []);
    } catch (err) {
      setError(err.message || "The records could not be loaded.");
    } finally {
      setLoading(false);
    }
  }, [tab]);

  useEffect(() => {
    setRows([]);
    setSearch("");
    load();
  }, [load]);

  const filtered = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return rows.filter((row) => {
      const matchSearch =
        !needle ||
        Object.values(row || {}).some(
          (value) => typeof value === "string" && value.toLowerCase().includes(needle)
        );
      const matchBook = !book || Number(row.book_number) === Number(book);
      return matchSearch && matchBook;
    });
  }, [rows, search, book]);

  const openNew = () => {
    setFormError("");
    const values = emptyRecord(tab);
    if (book) values.book_number = String(book);
    setEditing({ id: "", values });
  };

  const openEdit = (row) => {
    setFormError("");
    const values = emptyRecord(tab);
    meta.fields.forEach(([name]) => {
      const value = row[name];
      values[name] = value === null || value === undefined ? "" : String(value);
    });
    setEditing({ id: row.id, values });
  };

  const save = async () => {
    const values = editing.values;
    setSaving(true);
    setFormError("");
    try {
      const payload = {};
      meta.fields.forEach(([name, , type]) => {
        if (values[name] === "") {
          payload[name] = null;
          return;
        }
        payload[name] = type === "number" ? Number(values[name]) : values[name];
      });
      if (editing.id) {
        await callAdminData("update", { entity: tab, id: editing.id, values: payload });
      } else {
        await callAdminData("create", { entity: tab, values: payload });
      }
      setEditing(null);
      setNotice(editing.id ? "The record was changed." : "The record was added.");
      await load();
    } catch (err) {
      setFormError(err.message || "The record could not be saved.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await callAdminData("delete", { entity: tab, id: pendingDelete.id });
      setPendingDelete(null);
      setNotice("The record was deleted.");
      await load();
    } catch (err) {
      setError(err.message || "The record could not be deleted.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <div className="pr-card pr-card-pad" style={{ marginBottom: 18 }}>
        <h2 className="pr-heading" style={{ margin: "0 0 4px", fontSize: "1.05rem" }}>
          Prayer passages and the imported book material
        </h2>
        <p className="pr-muted" style={{ margin: "0 0 14px", fontSize: "0.85rem" }}>
          Everything a book file carries is edited here: the prayer written for
          a verse, the cross-references, the introduction of a chapter and the
          introduction and the closing prayer of the book.
        </p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {TABS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`pr-btn pr-btn-sm ${tab === item.id ? "pr-btn-primary" : "pr-btn-outline"}`}
              onClick={() => setTab(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: 12,
          alignItems: "flex-end",
          flexWrap: "wrap",
          marginBottom: 16
        }}
      >
        <div className="pr-field" style={{ margin: 0, flex: "1 1 200px" }}>
          <label className="pr-label">Book</label>
          <select
            className="pr-select"
            value={book}
            onChange={(event) => setBook(event.target.value)}
          >
            <option value="">Every book</option>
            {BIBLE_BOOKS.map((item) => (
              <option key={item.number} value={item.number}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
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
              placeholder="Search every field"
              style={{ paddingLeft: 34 }}
            />
          </div>
        </div>
        <button type="button" className="pr-btn pr-btn-primary" onClick={openNew}>
          <PlusIcon className="h-4 w-4" style={{ display: "inline" }} /> Add a record
        </button>
      </div>

      {error ? <div className="pr-error" style={{ marginBottom: 14 }}>{error}</div> : null}
      {notice ? <div className="pr-success" style={{ marginBottom: 14 }}>{notice}</div> : null}

      {loading ? (
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "22px 0" }}>
          <Loader2Icon className="h-5 w-5 animate-spin" />
          <span className="pr-muted" style={{ fontSize: "0.88rem" }}>
            Loading the records…
          </span>
        </div>
      ) : error ? null : filtered.length === 0 ? (
        <div className="pr-card pr-card-pad" style={{ textAlign: "center" }}>
          <ListIcon className="h-7 w-7" style={{ color: "var(--pr-gold-deep)" }} />
          <h3 className="pr-heading" style={{ margin: "10px 0 6px", fontSize: "1rem" }}>
            Nothing here yet
          </h3>
          <p className="pr-muted" style={{ margin: "0 0 16px", fontSize: "0.87rem" }}>
            {meta.note}
          </p>
          <button type="button" className="pr-btn pr-btn-primary" onClick={openNew}>
            <PlusIcon className="h-4 w-4" style={{ display: "inline" }} /> Add a record
          </button>
        </div>
      ) : (
        <div style={{ display: "grid", gap: 10 }}>
          {filtered.map((row) => {
            const excerpt = excerptOf(row, tab);
            return (
              <div key={row.id} className="pr-card pr-card-pad">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 12,
                    alignItems: "center",
                    flexWrap: "wrap"
                  }}
                >
                  <div style={{ minWidth: 0, flex: "1 1 220px" }}>
                    <strong className="pr-heading" style={{ fontSize: "0.92rem" }}>
                      {recordTitle(row, tab)}
                    </strong>
                    {excerpt ? (
                      <p
                        className="pr-muted"
                        style={{
                          margin: "4px 0 0",
                          fontSize: "0.8rem",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden"
                        }}
                      >
                        {excerpt}
                      </p>
                    ) : null}
                    <p className="pr-muted" style={{ margin: "4px 0 0", fontSize: "0.76rem" }}>
                      {String(row.id)}
                    </p>
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
        title={editing && editing.id ? `Change ${meta.label.toLowerCase()}` : `Add ${meta.label.toLowerCase()}`}
        subtitle={meta.note}
        fields={meta.fields}
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
        title="Delete this record?"
        message={
          pendingDelete
            ? `“${recordTitle(pendingDelete, tab)}” will be removed from the app and from the reader.`
            : ""
        }
        busy={deleting}
        onConfirm={remove}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}