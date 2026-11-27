import React, { useState } from "react";
import Modal from "@/components/common/Modal";

const border = (wrong) => (wrong ? "1px solid #9f2d2d" : undefined);

/**
 * The form of one Q&A topic.
 *
 * A topic carries both languages. The English name and the Luganda name
 * are both required, so the topic can always be shown in either language.
 */
export default function QaTopicForm({ initial, busy, error, onSave, onCancel }) {
  const [values, setValues] = useState(() => ({
    name_en: "",
    name_lu: "",
    description_en: "",
    description_lu: "",
    active: true,
    ...(initial || {})
  }));
  const [errors, setErrors] = useState([]);

  const setValue = (name, value) => setValues((previous) => ({ ...previous, [name]: value }));
  const wrong = (name) => errors.some((line) => line.startsWith(name));

  const submit = () => {
    const found = [];
    if (!String(values.name_en || "").trim()) found.push("name_en is required");
    if (!String(values.name_lu || "").trim()) found.push("name_lu is required");
    setErrors(found);
    if (found.length) return;
    onSave({
      name_en: values.name_en.trim(),
      name_lu: values.name_lu.trim(),
      description_en: String(values.description_en || "").trim(),
      description_lu: String(values.description_lu || "").trim(),
      active: values.active !== false
    });
  };

  return (
    <Modal
      open
      onClose={onCancel}
      title={initial && initial.id ? "Change the topic" : "Add a topic"}
      subtitle="The topic is shown on the public page in both languages."
      width={620}
      footer={
        <>
          <button type="button" className="pr-btn pr-btn-primary pr-btn-sm" onClick={submit} disabled={busy}>
            {busy ? "Saving…" : initial && initial.id ? "Save the changes" : "Add the topic"}
          </button>
          <button type="button" className="pr-btn pr-btn-outline pr-btn-sm" onClick={onCancel} disabled={busy}>
            Cancel
          </button>
        </>
      }
    >
      {error ? <div className="pr-error" style={{ marginBottom: 12 }}>{error}</div> : null}
      {errors.length ? (
        <div className="pr-error" style={{ marginBottom: 12 }}>
          {errors.map((line) => (
            <div key={line}>
              {line === "name_en" ? "Topic name (English) is required" : "Topic name (Luganda) is required"}
            </div>
          ))}
        </div>
      ) : null}

      <div className="pr-field">
        <label className="pr-label" htmlFor="qa-topic-name-en">
          Topic name (English) - required
        </label>
        <input
          id="qa-topic-name-en"
          className="pr-input"
          style={border(wrong("name_en"))}
          value={values.name_en || ""}
          onChange={(event) => setValue("name_en", event.target.value)}
          placeholder="Prayer"
        />
      </div>

      <div className="pr-field">
        <label className="pr-label" htmlFor="qa-topic-name-lu">
          Topic name (Luganda) - required
        </label>
        <input
          id="qa-topic-name-lu"
          className="pr-input"
          style={border(wrong("name_lu"))}
          value={values.name_lu || ""}
          onChange={(event) => setValue("name_lu", event.target.value)}
          placeholder="Okusaba"
        />
      </div>

      <div className="pr-field">
        <label className="pr-label" htmlFor="qa-topic-description-en">
          Description (English)
        </label>
        <textarea
          id="qa-topic-description-en"
          className="pr-textarea"
          value={values.description_en || ""}
          onChange={(event) => setValue("description_en", event.target.value)}
          placeholder="Questions about prayer and how to talk to God."
        />
      </div>

      <div className="pr-field">
        <label className="pr-label" htmlFor="qa-topic-description-lu">
          Description (Luganda)
        </label>
        <textarea
          id="qa-topic-description-lu"
          className="pr-textarea"
          value={values.description_lu || ""}
          onChange={(event) => setValue("description_lu", event.target.value)}
          placeholder="Ebibuwa ebikwata ku kusaba n'okwogera ne Katonda."
        />
      </div>

      <label style={{ display: "flex", gap: 8, alignItems: "center", fontSize: "0.88rem" }}>
        <input
          type="checkbox"
          checked={values.active !== false}
          onChange={(event) => setValue("active", event.target.checked)}
        />
        Show this topic on the public page
      </label>
    </Modal>
  );
}