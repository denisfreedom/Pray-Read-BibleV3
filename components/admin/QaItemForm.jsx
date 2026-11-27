import React, { useState } from "react";
import Modal from "@/components/common/Modal";

const border = (wrong) => (wrong ? "1px solid #9f2d2d" : undefined);

/**
 * The form of one question and answer.
 *
 * A question is always bilingual: the English question, the Luganda
 * question, the English answer and the Luganda answer are all required.
 * The letter the question sits under is worked out from the question
 * itself, so it is never typed here.
 */
export default function QaItemForm({ initial, topics, busy, error, onSave, onCancel }) {
  const [values, setValues] = useState(() => ({
    topic_en: "",
    topic_lu: "",
    scripture_ref: "",
    question_en: "",
    question_lu: "",
    answer_en: "",
    answer_lu: "",
    tags: "",
    featured: false,
    active: true,
    ...(initial || {})
  }));
  const [errors, setErrors] = useState([]);

  const setValue = (name, value) => setValues((previous) => ({ ...previous, [name]: value }));
  const wrong = (name) => errors.includes(name);

  const chooseTopic = (nameEn) => {
    const topic = topics.find((entry) => entry.name_en === nameEn);
    setValues((previous) => ({
      ...previous,
      topic_en: nameEn,
      topic_lu: topic ? topic.name_lu : previous.topic_lu
    }));
  };

  const submit = () => {
    const found = [];
    if (!String(values.topic_en || "").trim()) found.push("topic");
    if (!String(values.question_en || "").trim()) found.push("question_en");
    if (!String(values.question_lu || "").trim()) found.push("question_lu");
    if (!String(values.answer_en || "").trim()) found.push("answer_en");
    if (!String(values.answer_lu || "").trim()) found.push("answer_lu");
    setErrors(found);
    if (found.length) return;
    onSave({
      topic_en: values.topic_en.trim(),
      topic_lu: String(values.topic_lu || values.topic_en).trim(),
      scripture_ref: String(values.scripture_ref || "").trim(),
      question_en: values.question_en.trim(),
      question_lu: values.question_lu.trim(),
      answer_en: values.answer_en.trim(),
      answer_lu: values.answer_lu.trim(),
      tags: String(values.tags || "").trim(),
      featured: values.featured === true,
      active: values.active !== false
    });
  };

  return (
    <Modal
      open
      onClose={onCancel}
      title={initial && initial.id ? "Change the question" : "Add a question"}
      subtitle="English and Luganda are both required. The letter is worked out from the question."
      width={760}
      footer={
        <>
          <button type="button" className="pr-btn pr-btn-primary pr-btn-sm" onClick={submit} disabled={busy}>
            {busy ? "Saving…" : initial && initial.id ? "Save the changes" : "Add the question"}
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
          {errors.includes("topic") ? <div>Topic is required</div> : null}
          {errors.includes("question_en") ? <div>Question (English) is required</div> : null}
          {errors.includes("question_lu") ? <div>Question (Luganda) is required - Q&amp;A must be bilingual</div> : null}
          {errors.includes("answer_en") ? <div>Answer (English) is required</div> : null}
          {errors.includes("answer_lu") ? <div>Answer (Luganda) is required</div> : null}
        </div>
      ) : null}

      <div className="pr-grid pr-grid-2">
        <div className="pr-field">
          <label className="pr-label" htmlFor="qa-item-topic">
            Topic - required
          </label>
          <select
            id="qa-item-topic"
            className="pr-select"
            style={border(wrong("topic"))}
            value={values.topic_en || ""}
            onChange={(event) => chooseTopic(event.target.value)}
          >
            <option value="">Choose a topic</option>
            {topics.map((topic) => (
              <option key={topic.id || topic.name_en} value={topic.name_en}>
                {topic.name_en} / {topic.name_lu}
              </option>
            ))}
          </select>
        </div>
        <div className="pr-field">
          <label className="pr-label" htmlFor="qa-item-ref">
            Scripture reference
          </label>
          <input
            id="qa-item-ref"
            className="pr-input"
            value={values.scripture_ref || ""}
            onChange={(event) => setValue("scripture_ref", event.target.value)}
            placeholder="Matthew 6:5-13"
          />
        </div>
      </div>

      <div className="pr-field">
        <label className="pr-label" htmlFor="qa-item-question-en">
          Question (English) - required
        </label>
        <textarea
          id="qa-item-question-en"
          className="pr-textarea"
          style={border(wrong("question_en"))}
          value={values.question_en || ""}
          onChange={(event) => setValue("question_en", event.target.value)}
          placeholder="What is prayer?"
        />
      </div>

      <div className="pr-field">
        <label className="pr-label" htmlFor="qa-item-question-lu">
          Question (Luganda) - required
        </label>
        <textarea
          id="qa-item-question-lu"
          className="pr-textarea"
          style={border(wrong("question_lu"))}
          value={values.question_lu || ""}
          onChange={(event) => setValue("question_lu", event.target.value)}
          placeholder="Okusaba kye ki?"
        />
      </div>

      <div className="pr-field">
        <label className="pr-label" htmlFor="qa-item-answer-en">
          Answer (English) - required
        </label>
        <textarea
          id="qa-item-answer-en"
          className="pr-textarea"
          style={{ ...border(wrong("answer_en")), minHeight: 120 }}
          value={values.answer_en || ""}
          onChange={(event) => setValue("answer_en", event.target.value)}
          placeholder="Prayer is talking to God..."
        />
      </div>

      <div className="pr-field">
        <label className="pr-label" htmlFor="qa-item-answer-lu">
          Answer (Luganda) - required
        </label>
        <textarea
          id="qa-item-answer-lu"
          className="pr-textarea"
          style={{ ...border(wrong("answer_lu")), minHeight: 120 }}
          value={values.answer_lu || ""}
          onChange={(event) => setValue("answer_lu", event.target.value)}
          placeholder="Okusaba kwogera ne Katonda..."
        />
      </div>

      <div className="pr-field">
        <label className="pr-label" htmlFor="qa-item-tags">
          Keywords / tags
        </label>
        <input
          id="qa-item-tags"
          className="pr-input"
          value={values.tags || ""}
          onChange={(event) => setValue("tags", event.target.value)}
          placeholder="prayer, fasting, morning"
        />
      </div>

      <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
        <label style={{ display: "flex", gap: 8, alignItems: "center", fontSize: "0.88rem" }}>
          <input
            type="checkbox"
            checked={values.featured === true}
            onChange={(event) => setValue("featured", event.target.checked)}
          />
          Featured
        </label>
        <label style={{ display: "flex", gap: 8, alignItems: "center", fontSize: "0.88rem" }}>
          <input
            type="checkbox"
            checked={values.active !== false}
            onChange={(event) => setValue("active", event.target.checked)}
          />
          Show this question on the public page
        </label>
      </div>
    </Modal>
  );
}