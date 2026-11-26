import React, { useState } from "react";
import Modal from "@/components/common/Modal";
import { fse2 } from "@/api/fse2Client";
import { UploadIcon, Loader2Icon } from "lucide-react";

/**
 * The form of one verse-song series.
 *
 * The name is written exactly as the administrator types it. It is never
 * replaced by a Bible book name, because a series may be named anything.
 */
export default function VerseSongSeriesForm({ initial, busy, error, onSave, onCancel }) {
  const [values, setValues] = useState(() => ({
    name: "",
    description: "",
    cover_image: "",
    active: true,
    ...(initial || {})
  }));
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const setValue = (name, value) => setValues((prev) => ({ ...prev, [name]: value }));

  const handleUpload = async (event) => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    setUploadError("");
    if (!/\.(mp3|m4a|wav)$/i.test(file.name)) {
      setUploadError("The cover must be an image file.");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setUploadError("The cover image must be smaller than 8 MB.");
      return;
    }
    setUploading(true);
    try {
      const { file_url } = await fse2.integrations.Core.UploadFile({ file });
      setValue("cover_image", file_url);
    } catch (err) {
      setUploadError(err.message || "The image could not be uploaded.");
    } finally {
      setUploading(false);
    }
  };

  const submit = () => {
    if (!values.name.trim()) return;
    onSave({
      name: values.name.trim(),
      description: values.description.trim(),
      cover_image: values.cover_image.trim(),
      thumbnail: values.cover_image.trim(),
      accent: values.accent || "#1d4035",
      active: values.active !== false
    });
  };

  return (
    <Modal
      open
      onClose={onCancel}
      title={initial && initial.id ? "Change the series" : "Add a series"}
      subtitle="The name is shown everywhere exactly as you write it."
      width={620}
      footer={
        <>
          <button type="button" className="pr-btn pr-btn-primary pr-btn-sm" onClick={submit} disabled={busy}>
            {busy ? "Saving…" : initial && initial.id ? "Save the changes" : "Add the series"}
          </button>
          <button type="button" className="pr-btn pr-btn-outline pr-btn-sm" onClick={onCancel} disabled={busy}>
            Cancel
          </button>
        </>
      }
    >
      {error ? <div className="pr-error" style={{ marginBottom: 12 }}>{error}</div> : null}
      {uploadError ? <div className="pr-error" style={{ marginBottom: 12 }}>{uploadError}</div> : null}

      <div className="pr-field">
        <label className="pr-label" htmlFor="vs-series-name">
          Series name (required)
        </label>
        <input
          id="vs-series-name"
          className="pr-input"
          value={values.name}
          onChange={(event) => setValue("name", event.target.value)}
          placeholder="For example: Psalms of Comfort"
        />
      </div>

      <div className="pr-field">
        <label className="pr-label" htmlFor="vs-series-description">
          Description
        </label>
        <textarea
          id="vs-series-description"
          className="pr-textarea"
          value={values.description}
          onChange={(event) => setValue("description", event.target.value)}
          placeholder="What this series is about"
        />
      </div>

      <div className="pr-field">
        <label className="pr-label" htmlFor="vs-series-cover">
          Cover image URL
        </label>
        <input
          id="vs-series-cover"
          className="pr-input"
          value={values.cover_image}
          onChange={(event) => setValue("cover_image", event.target.value)}
          placeholder="https://…"
        />
      </div>

      <div className="pr-field">
        <label className="pr-label" htmlFor="vs-series-cover-file">
          Cover image from this device
        </label>
        <input id="vs-series-cover-file" type="file" accept="image/*" onChange={handleUpload} />
        {uploading ? (
          <p className="pr-muted" style={{ margin: "8px 0 0", fontSize: "0.8rem" }}>
            <Loader2Icon className="h-4 w-4 animate-spin" style={{ display: "inline" }} /> Uploading the image…
          </p>
        ) : null}
        {values.cover_image ? (
          <img
            src={values.cover_image}
            alt=""
            style={{ marginTop: 10, width: 160, height: 100, objectFit: "cover", borderRadius: 10 }}
          />
        ) : null}
        <p className="pr-muted" style={{ margin: "8px 0 0", fontSize: "0.78rem" }}>
          <UploadIcon className="h-4 w-4" style={{ display: "inline" }} /> Without a cover the page uses the
          worship photo.
        </p>
      </div>

      <label style={{ display: "flex", gap: 8, alignItems: "center", fontSize: "0.88rem" }}>
        <input
          type="checkbox"
          checked={values.active !== false}
          onChange={(event) => setValue("active", event.target.checked)}
        />
        Show this series on the public site
      </label>
    </Modal>
  );
}