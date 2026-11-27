import React, { useState } from "react";
import QaAdminList from "@/components/admin/QaAdminList";
import QaItemForm from "@/components/admin/QaItemForm";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { PlusIcon } from "lucide-react";

/**
 * The questions of the content manager: the list, the form of one
 * question, and the step before a question is removed.
 */
export default function QaQuestionsPanel({ items, topics, busy, error, onSave, onDelete, onBulk }) {
  const [form, setForm] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);

  return (
    <div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
        <button type="button" className="pr-btn pr-btn-primary pr-btn-sm" onClick={() => setForm({ initial: null })}>
          <PlusIcon className="h-4 w-4" style={{ display: "inline" }} /> Add a question
        </button>
      </div>

      {error ? <div className="pr-error" style={{ marginBottom: 14 }}>{error}</div> : null}

      <QaAdminList
        items={items}
        topics={topics}
        onEdit={(item) => setForm({ initial: item })}
        onDelete={(item) => setPendingDelete(item)}
        onBulk={onBulk}
      />

      {form ? (
        <QaItemForm
          initial={form.initial}
          topics={topics}
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
        title="Remove this question?"
        message={
          pendingDelete
            ? `"${pendingDelete.question_en}" will be removed from the library. This cannot be undone.`
            : ""
        }
        busy={busy}
        onConfirm={() => {
          onDelete(pendingDelete);
          setPendingDelete(null);
        }}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}