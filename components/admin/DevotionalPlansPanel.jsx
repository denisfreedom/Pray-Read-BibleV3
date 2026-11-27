import React, { useState } from "react";
import { PencilIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { devotionalDate } from "@/lib/devotionals";

/**
 * The plans of the devotional library: a run of devotionals that is read
 * day by day.
 */
export default function DevotionalPlansPanel({ plans = [], devotionals = [], onSave, onDelete, busy }) {
  const [editingId, setEditingId] = useState("");
  const [values, setValues] = useState({ name_en: "", name_lu: "", description: "", days: 21 });
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [openPlan, setOpenPlan] = useState("");

  const start = (plan) => {
    setEditingId(plan ? plan.id : "");
    setValues(
      plan
        ? {
            name_en: plan.name_en || "",
            name_lu: plan.name_lu || "",
            description: plan.description || "",
            days: Number(plan.days || 21)
          }
        : { name_en: "", name_lu: "", description: "", days: 21 }
    );
    setError("");
    setNotice("");
  };

  const save = async () => {
    if (!values.name_en.trim()) {
      setError("Plan name (English) is required");
      return;
    }
    setError("");
    await onSave(values, editingId);
    setEditingId("");
    setValues({ name_en: "", name_lu: "", description: "", days: 21 });
    setNotice("The plan was saved.");
  };

  const remove = async (plan) => {
    setError("");
    await onDelete(plan);
    setNotice("The plan was removed.");
  };

  const devotionalsOf = (plan) =>
    (devotionals || [])
      .filter((row) => String(row.series || "") === plan.name_en)
      .sort((a, b) => {
        const left = Number(a.day || 0);
        const right = Number(b.day || 0);
        if (left !== right) return left - right;
        return devotionalDate(a).localeCompare(devotionalDate(b));
      });

  return (
    <div>
      {error ? <div className="pr-error" style={{ marginBottom: 12 }}>{error}</div> : null}
      {notice ? <div className="pr-success" style={{ marginBottom: 12 }}>{notice}</div> : null}

      <div style={{ display: "grid", gap: 10, marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <input
            className="pr-input"
            style={{ flex: "1 1 180px", minWidth: 0 }}
            placeholder="Plan name (English)"
            value={values.name_en}
            onChange={(event) => setValues((current) => ({ ...current, name_en: event.target.value }))}
          />
          <input
            className="pr-input"
            style={{ flex: "1 1 180px", minWidth: 0 }}
            placeholder="Plan name (Luganda)"
            value={values.name_lu}
            onChange={(event) => setValues((current) => ({ ...current, name_lu: event.target.value }))}
          />
          <input
            className="pr-input"
            type="number"
            min="1"
            style={{ width: 110 }}
            placeholder="Days"
            value={values.days}
            onChange={(event) => setValues((current) => ({ ...current, days: event.target.value }))}
          />
        </div>
        <textarea
          className="pr-textarea"
          placeholder="What is this plan about?"
          value={values.description}
          onChange={(event) => setValues((current) => ({ ...current, description: event.target.value }))}
        />
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button type="button" className="pr-btn pr-btn-primary pr-btn-sm" onClick={save} disabled={busy}>
            {editingId ? "Save the plan" : <><PlusIcon className="h-4 w-4" /> Add plan</>}
          </button>
          {editingId ? (
            <button type="button" className="pr-btn pr-btn-outline pr-btn-sm" onClick={() => start(null)}>
              Cancel
            </button>
          ) : null}
        </div>
      </div>

      {!plans.length ? <p style={{ fontSize: "0.9rem" }}>No plans yet.</p> : null}

      <ul className="pr-list-reset" style={{ display: "grid", gap: 8 }}>
        {plans.map((plan) => {
          const items = devotionalsOf(plan);
          const open = openPlan === plan.id;
          return (
            <li
              key={plan.id}
              style={{
                padding: "12px 14px",
                border: "1px solid var(--pr-border)",
                borderRadius: 12
              }}
            >
              <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                <strong style={{ color: "var(--pr-heading)" }}>{plan.name_en}</strong>
                <span style={{ fontSize: "0.85rem" }}>{plan.name_lu}</span>
                <span className="pr-badge pr-badge-outline">{Number(plan.days || 0)} days</span>
                <span className="pr-badge pr-badge-gold">{items.length} devotionals</span>
                <span style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
                  <button
                    type="button"
                    className="pr-btn pr-btn-outline pr-btn-sm"
                    onClick={() => setOpenPlan(open ? "" : plan.id)}
                  >
                    {open ? "Hide" : "Show the days"}
                  </button>
                  <button type="button" className="pr-btn pr-btn-outline pr-btn-sm" onClick={() => start(plan)}>
                    <PencilIcon className="h-4 w-4" /> Edit
                  </button>
                  <button type="button" className="pr-btn pr-btn-outline pr-btn-sm" onClick={() => remove(plan)}>
                    <Trash2Icon className="h-4 w-4" /> Delete
                  </button>
                </span>
              </div>
              {plan.description ? (
                <p style={{ margin: "8px 0 0", fontSize: "0.88rem" }}>{plan.description}</p>
              ) : null}
              {open ? (
                <ol className="pr-list-reset" style={{ margin: "12px 0 0", display: "grid", gap: 6 }}>
                  {items.map((item, index) => (
                    <li key={item.id || item.code} style={{ fontSize: "0.88rem" }}>
                      Day {Number(item.day || index + 1)} · {item.title_en || item.title}
                    </li>
                  ))}
                  {!items.length ? <li style={{ fontSize: "0.88rem" }}>No devotionals in this plan yet.</li> : null}
                </ol>
              ) : null}
            </li>
          );
        })}
      </ul>
    </div>
  );
}