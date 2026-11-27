import React, { useEffect, useState } from "react";
import Modal from "@/components/common/Modal";
import { fse2 } from "@/api/fse2Client";
import { Loader2Icon, PlusIcon, UploadIcon } from "lucide-react";
import { toISODate } from "@/lib/reading";
import { fieldOf } from "@/lib/devotionals";
import DevotionalFeatured from "@/components/devotional/DevotionalFeatured";

// Every field the reader needs, in both languages. The devotional is
// bilingual, so one of the two is always missing.
const REQUIRED = [
  { key: "title_en", label: "Title (English)" },
  { key: "title_lu", label: "Title (Luganda)" },
  { key: "scripture_ref", label: "Scripture reference" },
  { key: "verse_en", label: "Verse text (English)" },
  { key: "verse_lu", label: "Verse text (Luganda)" },
  { key: "body_en", label: "Body (English)" },
  { key: "body_lu", label: "Body (Luganda)" },
  { key: "prayer_en", label: "Prayer (English)" },
  { key: "prayer_lu", label: "Prayer (Luganda)" },
  { key: "topic", label: "Topic" },
  { key: "date", label: "Date" }
];

// A scripture reference such as "Psalm 23:1" or "Philippians 4:6-7".
const SCRIPTURE_PATTERN = /^[A-Za-z0-9 .'()-]+\s+\d+(?::\d+(?:-\d+)?)?$/;

const emptyForm = () => ({
  code: "",
  title_en: "",
  title_lu: "",
  scripture_ref: "",
  scripture_lu: "",
  verse_en: "",
  verse_lu: "",
  body_en: "",
  body_lu: "",
  prayer_en: "",
  prayer_lu: "",
  topic: "",
  series: "",
  date: toISODate(),
  cover_url: "",
  featured: false,
  active: true
});

// The fields of the record, in the names of the backend specification. The
// names the first records were written with are still read, so a record
// that was never migrated opens in the form with all its text.
const pickFields = (row) => ({
  code: row.code || "",
  title_en: fieldOf(row, "title_en"),
  title_lu: row.title_lu || "",
  scripture_ref: fieldOf(row, "scripture_ref"),
  scripture_lu: row.scripture_lu || "",
  verse_en: row.verse_en || "",
  verse_lu: row.verse_lu || "",
  body_en: fieldOf(row, "body_en"),
  body_lu: row.body_lu || "",
  prayer_en: row.prayer_en || "",
  prayer_lu: row.prayer_lu || "",
  topic: fieldOf(row, "topic"),
  series: row.series || "",
  date: fieldOf(row, "date"),
  cover_url: fieldOf(row, "cover_url"),
  featured: row.featured === true,
  active: row.active !== false
});

/**
 * The form of one devotional.
 *
 * Both languages are written in the same form and both are required: a
 * devotional that is only in English, or only in Luganda, is never saved.
 */
export default function DevotionalForm({
  open,
  onClose,
  initial,
  topics = [],
  plans = [],
  onSave,
  onCreateTopic,
  onCreatePlan,
  busy,
  error
}) {
  const [values, setValues] = useState(emptyForm);
  const [errors, setErrors] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(false);
  const [newTopic, setNewTopic] = useState({ name_en: "", name_lu: "" });
  const [newPlan, setNewPlan] = useState({ name_en: "", name_lu: "" });

  useEffect(() => {
    if (!open) return;
    setValues(initial ? { ...emptyForm(), ...pickFields(initial) } : emptyForm());
    setErrors([]);
    setPreview(false);
    setNewTopic({ name_en: "", name_lu: "" });
    setNewPlan({ name_en: "", name_lu: "" });
  }, [open, initial]);

  const setValue = (key, value) => setValues((current) => ({ ...current, [key]: value }));

  const validate = () => {
    const found = REQUIRED.filter((field) => !String(values[field.key] || "").trim()).map(
      (field) => `${field.label} is required`
    );
    const reference = String(values.scripture_ref || "").trim();
    if (reference && !SCRIPTURE_PATTERN.test(reference)) {
      found.push("Scripture reference is not valid  -  for example Psalm 23:1");
    }
    setErrors(found);
    return found.length === 0;
  };

  const submit = () => {
    if (!validate()) return;
    onSave(values, initial ? initial.id : "");
  };

  const upload = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const result = await fse2.integrations.Core.UploadFile({ file });
      if (result && result.file_url) setValue("cover_url", result.file_url);
    } finally {
      setUploading(false);
    }
  };

  const onPickFile = (event) => {
    const file = event.target.files && event.target.files[0];
    upload(file);
    event.target.value = "";
  };

  const onDropFile = (event) => {
    event.preventDefault();
    const file = event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0];
    upload(file);
  };

  // The empty fields of a form that was sent are marked, so the admin sees
  // at once which ones are holding the save.
  const invalid = (key) =>
    errors.length && !String(values[key] || "").trim() ? "pr-input pr-input-error" : "pr-input";

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initial ? "Edit the devotional" : "New devotional"}
      subtitle="Both languages are required. Save is blocked while one of them is empty."
      width={720}
      footer={
        <>
          <button
            type="button"
            className="pr-btn pr-btn-primary pr-btn-sm"
            onClick={submit}
            disabled={busy || uploading}
          >
            {busy ? "Saving..." : "Save the devotional"}
          </button>
          <button type="button" className="pr-btn pr-btn-outline pr-btn-sm" onClick={() => setPreview(!preview)}>
            {preview ? "Hide the preview" : "Preview as Reader"}
          </button>
          <button type="button" className="pr-btn pr-btn-outline pr-btn-sm" onClick={onClose}>
            Cancel
          </button>
        </>
      }
    >
      {errors.length ? (
        <div className="pr-error" style={{ marginBottom: 16 }}>
          <strong>Fix these before saving:</strong>
          <ul className="pr-list-reset" style={{ margin: "6px 0 0", display: "grid", gap: 4 }}>
            {errors.map((message) => (
              <li key={message}>{message}</li>
            ))}
          </ul>
        </div>
      ) : null}
      {error ? <div className="pr-error" style={{ marginBottom: 16 }}>{error}</div> : null}

      {preview ? (
        <div style={{ marginBottom: 20 }}>
          <DevotionalFeatured
            row={values}
            language="BOTH"
            onOpen={() => {}}
            onShare={() => {}}
            saved={false}
            onToggleSave={() => {}}
          />
        </div>
      ) : null}

      <div className="pr-field">
        <label className="pr-label" htmlFor="dev-title-en">
          Title (English) *
        </label>
        <input
          id="dev-title-en"
          className={invalid("title_en")}
          value={values.title_en}
          onChange={(event) => setValue("title_en", event.target.value)}
        />
      </div>

      <div className="pr-field">
        <label className="pr-label" htmlFor="dev-title-lu">
          Title (Luganda) *
        </label>
        <input
          id="dev-title-lu"
          className={invalid("title_lu")}
          value={values.title_lu}
          onChange={(event) => setValue("title_lu", event.target.value)}
        />
      </div>

      <div className="pr-field">
        <label className="pr-label" htmlFor="dev-scripture">
          Scripture reference *
        </label>
        <input
          id="dev-scripture"
          className={invalid("scripture_ref")}
          placeholder="Psalm 23:1"
          value={values.scripture_ref}
          onChange={(event) => setValue("scripture_ref", event.target.value)}
        />
      </div>

      <div className="pr-field">
        <label className="pr-label" htmlFor="dev-scripture-lu">
          Scripture reference (Luganda)
        </label>
        <input
          id="dev-scripture-lu"
          className="pr-input"
          placeholder="Zabbuli 23:1"
          value={values.scripture_lu}
          onChange={(event) => setValue("scripture_lu", event.target.value)}
        />
      </div>

      <div className="pr-field">
        <label className="pr-label" htmlFor="dev-verse-en">
          Verse text (English) *
        </label>
        <textarea
          id="dev-verse-en"
          className={invalid("verse_en")}
          value={values.verse_en}
          onChange={(event) => setValue("verse_en", event.target.value)}
        />
      </div>

      <div className="pr-field">
        <label className="pr-label" htmlFor="dev-verse-lu">
          Verse text (Luganda) *
        </label>
        <textarea
          id="dev-verse-lu"
          className={invalid("verse_lu")}
          value={values.verse_lu}
          onChange={(event) => setValue("verse_lu", event.target.value)}
        />
      </div>

      <div className="pr-field">
        <label className="pr-label" htmlFor="dev-body-en">
          Body (English) *
        </label>
        <textarea
          id="dev-body-en"
          className={invalid("body_en")}
          style={{ minHeight: 150 }}
          value={values.body_en}
          onChange={(event) => setValue("body_en", event.target.value)}
        />
      </div>

      <div className="pr-field">
        <label className="pr-label" htmlFor="dev-body-lu">
          Body (Luganda) *
        </label>
        <textarea
          id="dev-body-lu"
          className={invalid("body_lu")}
          style={{ minHeight: 150 }}
          value={values.body_lu}
          onChange={(event) => setValue("body_lu", event.target.value)}
        />
      </div>

      <div className="pr-field">
        <label className="pr-label" htmlFor="dev-prayer-en">
          Prayer (English) *
        </label>
        <textarea
          id="dev-prayer-en"
          className={invalid("prayer_en")}
          value={values.prayer_en}
          onChange={(event) => setValue("prayer_en", event.target.value)}
        />
      </div>

      <div className="pr-field">
        <label className="pr-label" htmlFor="dev-prayer-lu">
          Prayer (Luganda) *
        </label>
        <textarea
          id="dev-prayer-lu"
          className={invalid("prayer_lu")}
          value={values.prayer_lu}
          onChange={(event) => setValue("prayer_lu", event.target.value)}
        />
      </div>

      <div className="pr-field">
        <label className="pr-label" htmlFor="dev-topic">
          Topic *
        </label>
        <select
          id="dev-topic"
          className={invalid("topic")}
          value={values.topic}
          onChange={(event) => setValue("topic", event.target.value)}
        >
          <option value="">Choose a topic</option>
          {topics.map((item) => (
            <option key={item.id || item.name_en} value={item.name_en}>
              {item.name_en}
              {item.name_lu ? ` · ${item.name_lu}` : ""}
            </option>
          ))}
        </select>
        <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap", alignItems: "center" }}>
          <input
            className="pr-input"
            style={{ flex: "1 1 150px", minWidth: 0 }}
            placeholder="New topic (English)"
            value={newTopic.name_en}
            onChange={(event) => setNewTopic((current) => ({ ...current, name_en: event.target.value }))}
          />
          <input
            className="pr-input"
            style={{ flex: "1 1 150px", minWidth: 0 }}
            placeholder="New topic (Luganda)"
            value={newTopic.name_lu}
            onChange={(event) => setNewTopic((current) => ({ ...current, name_lu: event.target.value }))}
          />
          <button
            type="button"
            className="pr-btn pr-btn-outline pr-btn-sm"
            onClick={() => {
              if (!newTopic.name_en.trim() || !newTopic.name_lu.trim()) return;
              if (onCreateTopic) onCreateTopic(newTopic.name_en.trim(), newTopic.name_lu.trim());
              setValue("topic", newTopic.name_en.trim());
              setNewTopic({ name_en: "", name_lu: "" });
            }}
          >
            <PlusIcon className="h-4 w-4" /> Add topic
          </button>
        </div>
      </div>

      <div className="pr-field">
        <label className="pr-label" htmlFor="dev-series">
          Series / plan
        </label>
        <select
          id="dev-series"
          className="pr-select"
          value={values.series}
          onChange={(event) => setValue("series", event.target.value)}
        >
          <option value="">No series</option>
          {plans.map((item) => (
            <option key={item.id || item.name_en} value={item.name_en}>
              {item.name_en}
              {item.name_lu ? ` · ${item.name_lu}` : ""}
            </option>
          ))}
        </select>
        <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap", alignItems: "center" }}>
          <input
            className="pr-input"
            style={{ flex: "1 1 150px", minWidth: 0 }}
            placeholder="New plan (English)"
            value={newPlan.name_en}
            onChange={(event) => setNewPlan((current) => ({ ...current, name_en: event.target.value }))}
          />
          <input
            className="pr-input"
            style={{ flex: "1 1 150px", minWidth: 0 }}
            placeholder="New plan (Luganda)"
            value={newPlan.name_lu}
            onChange={(event) => setNewPlan((current) => ({ ...current, name_lu: event.target.value }))}
          />
          <button
            type="button"
            className="pr-btn pr-btn-outline pr-btn-sm"
            onClick={() => {
              if (!newPlan.name_en.trim()) return;
              if (onCreatePlan) onCreatePlan(newPlan.name_en.trim(), newPlan.name_lu.trim());
              setValue("series", newPlan.name_en.trim());
              setNewPlan({ name_en: "", name_lu: "" });
            }}
          >
            <PlusIcon className="h-4 w-4" /> Add plan
          </button>
        </div>
      </div>

      <div className="pr-field">
        <label className="pr-label" htmlFor="dev-date">
          Date *
        </label>
        <input
          id="dev-date"
          type="date"
          className={invalid("date")}
          value={values.date}
          onChange={(event) => setValue("date", event.target.value)}
        />
        <p style={{ margin: "6px 0 0", fontSize: "0.78rem" }}>
          A devotional written for a later date waits for that day.
        </p>
      </div>

      <div className="pr-field">
        <label className="pr-label" htmlFor="dev-cover">
          Cover image
        </label>
        <input
          id="dev-cover"
          className="pr-input"
          placeholder="Paste a cover image URL"
          value={values.cover_url}
          onChange={(event) => setValue("cover_url", event.target.value)}
        />
        <div
          style={{
            display: "flex",
            gap: 10,
            marginTop: 8,
            alignItems: "center",
            flexWrap: "wrap",
            border: "1px dashed var(--pr-border)",
            borderRadius: 12,
            padding: 12
          }}
          onDragOver={(event) => event.preventDefault()}
          onDrop={onDropFile}
        >
          <label className="pr-btn pr-btn-outline pr-btn-sm" style={{ cursor: "pointer" }}>
            {uploading ? <Loader2Icon className="h-4 w-4 animate-spin" /> : <UploadIcon className="h-4 w-4" />}
            {uploading ? "Uploading..." : "Upload a cover"}
            <input type="file" accept="image/*" onChange={onPickFile} style={{ display: "none" }} />
          </label>
          <span style={{ fontSize: "0.78rem", color: "var(--pr-muted)" }}>
            or drop an image here
          </span>
          {values.cover_url ? (
            <img
              src={values.cover_url}
              alt="The cover"
              style={{ width: 72, height: 52, objectFit: "cover", borderRadius: 8 }}
            />
          ) : null}
        </div>
        <p style={{ margin: "6px 0 0", fontSize: "0.78rem" }}>
          Without a cover the default image is used: an open Bible with a cup of coffee.
        </p>
      </div>

      <label style={{ display: "flex", gap: 8, alignItems: "center", fontSize: "0.88rem", marginBottom: 10 }}>
        <input
          type="checkbox"
          checked={values.featured === true}
          onChange={(event) => setValue("featured", event.target.checked)}
        />
        Mark as featured (the gold star on the card)
      </label>

      <label style={{ display: "flex", gap: 8, alignItems: "center", fontSize: "0.88rem" }}>
        <input
          type="checkbox"
          checked={values.active !== false}
          onChange={(event) => setValue("active", event.target.checked)}
        />
        Show this devotional on the site
      </label>
    </Modal>
  );
}