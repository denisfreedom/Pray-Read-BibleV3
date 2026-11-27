import React, { useState } from "react";
import QaTopicForm from "@/components/admin/QaTopicForm";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import Modal from "@/components/common/Modal";
import { PencilIcon, Trash2Icon, PlusIcon } from "lucide-react";

/**
 * The topics of the content manager.
 *
 * A topic that still holds questions cannot be removed straight away: the
 * questions are moved to another topic first, so no question is ever lost.
 */
export default function QaTopicsPanel({ topics, items, busy, error, onSave, onDelete, onMove }) {
  const [form, setForm] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [blocking, setBlocking] = useState(null);
  const [moveTo, setMoveTo] = useState("");

  const countFor = (nameEn) => items.filter((item) => item.topic_en === nameEn).length;

  const askDelete = (topic) => {
    const count = countFor(topic.name_en);
    if (count > 0) {
      setBlocking({ topic, count });
      setMoveTo("");
      return;
    }
    setPendingDelete(topic);
  };

  const moveAndDelete = async () => {
    if (!blocking || !moveTo) return;
    await onMove(blocking.topic.name_en, moveTo);
    setBlocking(null);
  };

  const others = topics.filter((topic) => !blocking || topic.name_en !== blocking.topic.name_en);

  return (
    <div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
        <button type="button" className="pr-btn pr-btn-primary pr-btn-sm" onClick={() => setForm({ initial: null })}>
          <PlusIcon className="h-4 w-4" style={{ display: "inline" }} /> Add a topic
        </button>
      </div>

      {error ? <div className="pr-error" style={{ marginBottom: 14 }}>{error}</div> : null}

      <div className="pr-card pr-card-pad">
        {topics.length ? (
          <div className="pr-scroll-x">
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
              <thead>
                <tr style={{ textAlign: "start", borderBottom: "1px solid var(--pr-border)" }}>
                  {["Topic (EN)", "Topic (LU)", "Questions", "Active", ""].map((label, index) => (
                    <th
                      key={`${label}-${index}`}
                      style={{ padding: "8px 10px", color: "var(--pr-gold-deep)", fontWeight: 800 }}
                    >
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {topics.map((topic) => (
                  <tr key={topic.id || topic.name_en} style={{ borderBottom: "1px solid var(--pr-border)" }}>
                    <td style={{ padding: "8px 10px" }}>{topic.name_en}</td>
                    <td style={{ padding: "8px 10px" }}>{topic.name_lu}</td>
                    <td style={{ padding: "8px 10px" }}>{countFor(topic.name_en)}</td>
                    <td style={{ padding: "8px 10px" }}>{topic.active === false ? "No" : "Yes"}</td>
                    <td style={{ padding: "8px 10px", whiteSpace: "nowrap" }}>
                      <button
                        type="button"
                        className="pr-btn pr-btn-outline pr-btn-sm"
                        onClick={() => setForm({ initial: topic })}
                      >
                        <PencilIcon className="h-3 w-3" style={{ display: "inline" }} /> Edit
                      </button>{" "}
                      <button
                        type="button"
                        className="pr-btn pr-btn-danger pr-btn-sm"
                        onClick={() => askDelete(topic)}
                      >
                        <Trash2Icon className="h-3 w-3" style={{ display: "inline" }} /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="pr-muted" style={{ fontSize: "0.86rem" }}>
            There is no topic yet. A question always belongs to one.
          </p>
        )}
      </div>

      {form ? (
        <QaTopicForm
          initial={form.initial}
          busy={busy}
          error=""
          onSave={(values) =>
            onSave(values, form.initial && form.initial.id).then((ok) => {
              if (ok) setForm(null);
            })
          }
          onCancel={() => setForm(null)}
        />
      ) : null}

      <ConfirmDialog
        open={!!pendingDelete}
        title="Remove this topic?"
        message={
          pendingDelete
            ? `"${pendingDelete.name_en}" will be removed. No question belongs to it, so nothing is lost.`
            : ""
        }
        busy={busy}
        onConfirm={() => {
          onDelete(pendingDelete);
          setPendingDelete(null);
        }}
        onCancel={() => setPendingDelete(null)}
      />

      <Modal
        open={!!blocking}
        onClose={() => setBlocking(null)}
        title="This topic still holds questions"
        subtitle="Move them to another topic first, then the topic can be removed."
        width={520}
        footer={
          <>
            <button
              type="button"
              className="pr-btn pr-btn-danger pr-btn-sm"
              onClick={moveAndDelete}
              disabled={busy || !moveTo}
            >
              {busy ? "Working…" : "Move the questions and remove the topic"}
            </button>
            <button type="button" className="pr-btn pr-btn-outline pr-btn-sm" onClick={() => setBlocking(null)}>
              Cancel
            </button>
          </>
        }
      >
        {blocking ? (
          <p style={{ margin: "0 0 14px", fontSize: "0.9rem" }}>
            <strong>{blocking.topic.name_en}</strong> has {blocking.count}{" "}
            {blocking.count === 1 ? "question" : "questions"}. Move them to another topic first or
            delete them.
          </p>
        ) : null}
        <div className="pr-field">
          <label className="pr-label" htmlFor="qa-move-topic">
            Move the questions to
          </label>
          <select
            id="qa-move-topic"
            className="pr-select"
            value={moveTo}
            onChange={(event) => setMoveTo(event.target.value)}
          >
            <option value="">Choose a topic</option>
            {others.map((topic) => (
              <option key={topic.id || topic.name_en} value={topic.name_en}>
                {topic.name_en} / {topic.name_lu}
              </option>
            ))}
          </select>
        </div>
      </Modal>
    </div>
  );
}