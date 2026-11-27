import React, { useCallback, useEffect, useMemo, useState } from "react";
import { callAdminData } from "@/lib/adminSession";
import {
  bodyOf,
  buildDevotionalShareText,
  coverOf,
  devotionalDate,
  devotionalUrl,
  makeDevotionalCode,
  mergeWithBundledText,
  scriptureOf,
  sortDevotionals,
  titleOf
} from "@/lib/devotionals";
import { toISODate, shiftISODate } from "@/lib/reading";
import { fullShareChannels } from "@/lib/share";
import DevotionalForm from "@/components/admin/DevotionalForm";
import DevotionalTopicsPanel from "@/components/admin/DevotionalTopicsPanel";
import DevotionalPlansPanel from "@/components/admin/DevotionalPlansPanel";
import DevotionalBulkImport from "@/components/admin/DevotionalBulkImport";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import ShareSheet from "@/components/read/ShareSheet";
import {
  CopyIcon,
  Loader2Icon,
  PencilIcon,
  PlusIcon,
  SearchIcon,
  Share2Icon,
  StarIcon,
  Trash2Icon
} from "lucide-react";

const TABS = [
  { id: "devotionals", label: "Devotionals" },
  { id: "topics", label: "Topics" },
  { id: "plans", label: "Plans" },
  { id: "import", label: "Bulk upload" }
];

const rowsOf = (answer) => {
  if (Array.isArray(answer)) return answer;
  if (answer && Array.isArray(answer.rows)) return answer.rows;
  return [];
};

/**
 * The devotional desk of the content manager.
 *
 * The devotionals are written in both languages, scheduled by their date,
 * grouped by their topic and shared with the reader from the same place.
 */
export default function DevotionalsPanel() {
  const [tab, setTab] = useState("devotionals");
  const [rows, setRows] = useState([]);
  const [topics, setTopics] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [topicFilter, setTopicFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [activeFilter, setActiveFilter] = useState("all");
  const [selected, setSelected] = useState(new Set());
  const [editing, setEditing] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [shareRow, setShareRow] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [devotionals, topicRows, planRows] = await Promise.all([
        callAdminData("list", { entity: "Devotional", limit: 800 }),
        callAdminData("list", { entity: "DevotionalTopic", limit: 200 }),
        callAdminData("list", { entity: "DevotionalPlan", limit: 200 })
      ]);
      setRows(mergeWithBundledText(rowsOf(devotionals)));
      setTopics(rowsOf(topicRows));
      setPlans(rowsOf(planRows));
    } catch (err) {
      setError(err.message || "The devotionals could not be loaded.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const today = toISODate();

  const filtered = useMemo(() => {
    let list = rows;
    const needle = search.trim().toLowerCase();
    if (needle) {
      list = list.filter((row) =>
        [row.title_en, row.title_lu, row.body_en, row.body_lu, row.scripture_ref]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(needle))
      );
    }
    if (topicFilter) {
      list = list.filter((row) => (row.topic || "") === topicFilter);
    }
    if (dateFilter === "today") {
      list = list.filter((row) => devotionalDate(row) === today);
    }
    if (dateFilter === "scheduled") {
      list = list.filter((row) => devotionalDate(row) > today);
    }
    if (dateFilter === "past") {
      list = list.filter((row) => {
        const date = devotionalDate(row);
        return !!date && date < today;
      });
    }
    if (activeFilter === "active") {
      list = list.filter((row) => row.active !== false);
    }
    if (activeFilter === "inactive") {
      list = list.filter((row) => row.active === false);
    }
    return sortDevotionals(list);
  }, [rows, search, topicFilter, dateFilter, activeFilter, today]);

  const save = async (values, id) => {
    setBusy(true);
    setError("");
    try {
      if (id) {
        await callAdminData("update", { entity: "Devotional", id, values });
        setMessage("The devotional was updated.");
      } else {
        const code = makeDevotionalCode(
          values,
          rows.map((row) => String(row.code || ""))
        );
        await callAdminData("create", {
          entity: "Devotional",
          values: { ...values, code }
        });
        setMessage("The devotional was saved and is on the front page.");
      }
      setFormOpen(false);
      setEditing(null);
      await load();
    } catch (err) {
      setError(err.message || "The devotional could not be saved.");
    } finally {
      setBusy(false);
    }
  };

  const remove = async (record) => {
    setBusy(true);
    setError("");
    try {
      await callAdminData("delete", { entity: "Devotional", id: record.id });
      setMessage("The devotional was removed.");
      setPendingDelete(null);
      await load();
    } catch (err) {
      setError(err.message || "The devotional could not be removed.");
    } finally {
      setBusy(false);
    }
  };

  const duplicate = async (record) => {
    setBusy(true);
    setError("");
    try {
      const values = {
        ...record,
        code: "",
        title_en: `${record.title_en || "Devotional"} (Copy)`,
        date: shiftISODate(today, 1),
        featured: false
      };
      delete values.id;
      delete values.created_date;
      delete values.updated_date;
      delete values.created_by;
      const code = makeDevotionalCode(values, rows.map((row) => String(row.code || "")));
      await callAdminData("create", { entity: "Devotional", values: { ...values, code } });
      setMessage("The copy is scheduled for tomorrow.");
      await load();
    } catch (err) {
      setError(err.message || "The devotional could not be copied.");
    } finally {
      setBusy(false);
    }
  };

  const setActive = async (ids, active) => {
    setBusy(true);
    setError("");
    try {
      await Promise.all(
        ids.map((id) => callAdminData("update", { entity: "Devotional", id, values: { active } }))
      );
      setMessage(active ? "The devotionals are on the site." : "The devotionals are hidden.");
      await load();
    } catch (err) {
      setError(err.message || "The devotionals could not be changed.");
    } finally {
      setBusy(false);
    }
  };

  const removeSelected = async () => {
    setBusy(true);
    setError("");
    try {
      await Promise.all(
        [...selected].map((id) => callAdminData("delete", { entity: "Devotional", id }))
      );
      setSelected(new Set());
      setMessage("The selected devotionals were removed.");
      await load();
    } catch (err) {
      setError(err.message || "The devotionals could not be removed.");
    } finally {
      setBusy(false);
    }
  };

  const saveTopic = async (values, id) => {
    setBusy(true);
    setError("");
    try {
      if (id) await callAdminData("update", { entity: "DevotionalTopic", id, values });
      else await callAdminData("create", { entity: "DevotionalTopic", values: { ...values, active: true } });
      await load();
    } catch (err) {
      setError(err.message || "The topic could not be saved.");
    } finally {
      setBusy(false);
    }
  };

  const removeTopic = async (topic) => {
    setBusy(true);
    setError("");
    try {
      await callAdminData("delete", { entity: "DevotionalTopic", id: topic.id });
      await load();
    } catch (err) {
      setError(err.message || "The topic could not be removed.");
    } finally {
      setBusy(false);
    }
  };

  const savePlan = async (values, id) => {
    setBusy(true);
    setError("");
    try {
      if (id) await callAdminData("update", { entity: "DevotionalPlan", id, values });
      else
        await callAdminData("create", {
          entity: "DevotionalPlan",
          values: { ...values, active: true }
        });
      await load();
    } catch (err) {
      setError(err.message || "The plan could not be saved.");
    } finally {
      setBusy(false);
    }
  };

  const removePlan = async (plan) => {
    setBusy(true);
    setError("");
    try {
      await callAdminData("delete", { entity: "DevotionalPlan", id: plan.id });
      await load();
    } catch (err) {
      setError(err.message || "The plan could not be removed.");
    } finally {
      setBusy(false);
    }
  };

  const createTopic = async (nameEn, nameLu) => {
    try {
      await callAdminData("create", {
        entity: "DevotionalTopic",
        values: { name_en: nameEn, name_lu: nameLu, active: true }
      });
      await load();
    } catch (err) {
      setError(err.message || "The topic could not be created.");
    }
  };

  const createPlan = async (nameEn, nameLu) => {
    try {
      await callAdminData("create", {
        entity: "DevotionalPlan",
        values: { name_en: nameEn, name_lu: nameLu, days: 21, active: true }
      });
      await load();
    } catch (err) {
      setError(err.message || "The plan could not be created.");
    }
  };

  const toggleSelect = (id) => {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const shareUrl = shareRow ? devotionalUrl(shareRow) : "";

  return (
    <div>
      <div className="pr-tabs" style={{ marginBottom: 18 }}>
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
      {message ? <div className="pr-success" style={{ marginBottom: 14 }}>{message}</div> : null}

      {tab === "devotionals" ? (
        <div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 14 }}>
            <button
              type="button"
              className="pr-btn pr-btn-primary pr-btn-sm"
              onClick={() => {
                setEditing(null);
                setFormOpen(true);
              }}
            >
              <PlusIcon className="h-4 w-4" /> New devotional
            </button>
            <div className="pr-reader-search" style={{ flex: "1 1 220px", minWidth: 0 }}>
              <SearchIcon className="h-4 w-4" style={{ position: "absolute", left: 12, top: 12 }} />
              <input
                className="pr-input"
                style={{ width: "100%", paddingLeft: 36 }}
                placeholder="Search the title or the body"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
            <select
              className="pr-select"
              value={topicFilter}
              onChange={(event) => setTopicFilter(event.target.value)}
            >
              <option value="">All topics</option>
              {topics.map((topic) => (
                <option key={topic.id} value={topic.name_en}>
                  {topic.name_en}
                </option>
              ))}
            </select>
            <select
              className="pr-select"
              value={dateFilter}
              onChange={(event) => setDateFilter(event.target.value)}
            >
              <option value="all">All dates</option>
              <option value="today">Today</option>
              <option value="scheduled">Scheduled</option>
              <option value="past">Past</option>
            </select>
            <select
              className="pr-select"
              value={activeFilter}
              onChange={(event) => setActiveFilter(event.target.value)}
            >
              <option value="all">All</option>
              <option value="active">On the site</option>
              <option value="inactive">Hidden</option>
            </select>
          </div>

          {selected.size ? (
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 14 }}>
              <button
                type="button"
                className="pr-btn pr-btn-outline pr-btn-sm"
                onClick={() => setActive([...selected], true)}
                disabled={busy}
              >
                Show the selected
              </button>
              <button
                type="button"
                className="pr-btn pr-btn-outline pr-btn-sm"
                onClick={() => setActive([...selected], false)}
                disabled={busy}
              >
                Hide the selected
              </button>
              <button
                type="button"
                className="pr-btn pr-btn-danger pr-btn-sm"
                onClick={removeSelected}
                disabled={busy}
              >
                <Trash2Icon className="h-4 w-4" /> Delete the selected
              </button>
            </div>
          ) : null}

          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: "30px 0" }}>
              <Loader2Icon className="h-7 w-7 animate-spin" style={{ color: "var(--pr-emerald)" }} />
            </div>
          ) : null}

          {!loading && !filtered.length ? (
            <p style={{ fontSize: "0.9rem" }}>No devotional matches that filter yet.</p>
          ) : null}

          {!loading && filtered.length ? (
            <div className="pr-scroll-x">
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.83rem" }}>
                <thead>
                  <tr style={{ textAlign: "start", borderBottom: "1px solid var(--pr-border)" }}>
                    <th style={{ padding: "8px 6px" }}>
                      <input
                        type="checkbox"
                        aria-label="Select every devotional"
                        checked={selected.size > 0 && selected.size === filtered.length}
                        onChange={(event) =>
                          setSelected(
                            event.target.checked
                              ? new Set(filtered.map((row) => row.id))
                              : new Set()
                          )
                        }
                      />
                    </th>
                    {["", "Title (EN)", "Title (LU)", "Date", "Topic", "On the site", ""].map(
                      (label, index) => (
                        <th
                          key={`${label}-${index}`}
                          style={{ padding: "8px 10px", color: "var(--pr-gold-deep)", fontWeight: 800 }}
                        >
                          {label}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((row) => (
                    <tr key={row.id} style={{ borderBottom: "1px solid var(--pr-border)" }}>
                      <td style={{ padding: "8px 6px" }}>
                        <input
                          type="checkbox"
                          aria-label={`Select ${row.title_en || "devotional"}`}
                          checked={selected.has(row.id)}
                          onChange={() => toggleSelect(row.id)}
                        />
                      </td>
                      <td style={{ padding: "8px 10px" }}>
                        <img
                          src={coverOf(row)}
                          alt=""
                          style={{ width: 56, height: 40, objectFit: "cover", borderRadius: 6 }}
                        />
                      </td>
                      <td style={{ padding: "8px 10px", fontWeight: 700, color: "var(--pr-heading)" }}>
                        {row.title_en || " - "}
                        {row.featured ? (
                          <StarIcon className="h-4 w-4" style={{ color: "var(--pr-gold-deep)", marginLeft: 6 }} />
                        ) : null}
                      </td>
                      <td style={{ padding: "8px 10px" }}>{row.title_lu || " - "}</td>
                      <td style={{ padding: "8px 10px" }}>{devotionalDate(row) || " - "}</td>
                      <td style={{ padding: "8px 10px" }}>{row.topic || " - "}</td>
                      <td style={{ padding: "8px 10px" }}>{row.active === false ? "Hidden" : "Yes"}</td>
                      <td style={{ padding: "8px 10px", whiteSpace: "nowrap" }}>
                        <button
                          type="button"
                          className="pr-btn pr-btn-outline pr-btn-sm"
                          onClick={() => {
                            setEditing({ ...row });
                            setFormOpen(true);
                          }}
                        >
                          <PencilIcon className="h-4 w-4" /> Edit
                        </button>{" "}
                        <button
                          type="button"
                          className="pr-btn pr-btn-outline pr-btn-sm"
                          onClick={() => duplicate(row)}
                          disabled={busy}
                          title="Copy it to tomorrow"
                        >
                          <CopyIcon className="h-4 w-4" />
                        </button>{" "}
                        <button
                          type="button"
                          className="pr-btn pr-btn-outline pr-btn-sm"
                          onClick={() => setShareRow(row)}
                        >
                          <Share2Icon className="h-4 w-4" />
                        </button>{" "}
                        <button
                          type="button"
                          className="pr-btn pr-btn-outline pr-btn-sm"
                          onClick={() => setPendingDelete(row)}
                        >
                          <Trash2Icon className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </div>
      ) : null}

      {tab === "topics" ? (
        <DevotionalTopicsPanel
          topics={topics}
          devotionals={rows}
          onSave={saveTopic}
          onDelete={removeTopic}
          busy={busy}
        />
      ) : null}

      {tab === "plans" ? (
        <DevotionalPlansPanel
          plans={plans}
          devotionals={rows}
          onSave={savePlan}
          onDelete={removePlan}
          busy={busy}
        />
      ) : null}

      {tab === "import" ? <DevotionalBulkImport topics={topics} onImported={load} /> : null}

      <DevotionalForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
        initial={editing}
        topics={topics}
        plans={plans}
        onSave={save}
        onCreateTopic={createTopic}
        onCreatePlan={createPlan}
        busy={busy}
        error={error}
      />

      <ConfirmDialog
        open={!!pendingDelete}
        title="Delete this devotional?"
        message={
          pendingDelete
            ? `“${pendingDelete.title_en || "Untitled devotional"}” will be removed from the front page.`
            : ""
        }
        busy={busy}
        onConfirm={() => remove(pendingDelete)}
        onCancel={() => setPendingDelete(null)}
      />

      <ShareSheet
        open={!!shareRow}
        onClose={() => setShareRow(null)}
        title="Share this Devotional"
        subtitle={shareRow ? titleOf(shareRow, "BOTH") : ""}
        text={shareRow ? buildDevotionalShareText(shareRow, shareUrl, "BOTH") : ""}
        url={shareUrl}
        subject={shareRow ? titleOf(shareRow, "BOTH") : ""}
        preview={
          shareRow
            ? {
                image: coverOf(shareRow),
                title: titleOf(shareRow, "BOTH"),
                line: `${scriptureOf(shareRow, "BOTH")}  -  ${String(bodyOf(shareRow, "BOTH") || "").slice(0, 90)}`,
                link: shareUrl
              }
            : null
        }
        channels={fullShareChannels}
      />
    </div>
  );
}