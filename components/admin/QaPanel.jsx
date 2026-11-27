import React, { useCallback, useEffect, useState } from "react";
import { callAdminData } from "@/lib/adminSession";
import QaQuestionsPanel from "@/components/admin/QaQuestionsPanel";
import QaTopicsPanel from "@/components/admin/QaTopicsPanel";
import QaBulkImport from "@/components/admin/QaBulkImport";
import { Loader2Icon } from "lucide-react";

const TABS = [
  { id: "questions", label: "Questions" },
  { id: "topics", label: "Topics" },
  { id: "import", label: "Bulk upload" }
];

const rowsOf = (answer) => {
  if (Array.isArray(answer)) return answer;
  if (answer && Array.isArray(answer.rows)) return answer.rows;
  return [];
};

/**
 * The Q&A desk of the content manager.
 *
 * The topics come first, because every question belongs to a topic. The
 * questions are always bilingual, and the letter a question sits under is
 * worked out from the question itself.
 */
export default function QaPanel() {
  const [tab, setTab] = useState("questions");
  const [topics, setTopics] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [topicRows, itemRows] = await Promise.all([
        callAdminData("list", { entity: "QATopic" }),
        callAdminData("list", { entity: "QAItem" })
      ]);
      setTopics(rowsOf(topicRows));
      setItems(rowsOf(itemRows));
      setError("");
    } catch (err) {
      setError(err.message || "The Q&A library could not be loaded.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const saveTopic = async (values, id) => {
    setBusy(true);
    setError("");
    try {
      if (id) await callAdminData("update", { entity: "QATopic", id, values });
      else await callAdminData("create", { entity: "QATopic", values });
      setNotice("The topic was saved.");
      await load();
      return true;
    } catch (err) {
      setError(err.message || "The topic could not be saved.");
      return false;
    } finally {
      setBusy(false);
    }
  };

  const saveItem = async (values, id) => {
    setBusy(true);
    setError("");
    try {
      if (id) await callAdminData("update", { entity: "QAItem", id, values });
      else await callAdminData("create", { entity: "QAItem", values });
      setNotice("The question was saved.");
      await load();
      return true;
    } catch (err) {
      setError(err.message || "The question could not be saved.");
      return false;
    } finally {
      setBusy(false);
    }
  };

  const removeItem = async (item) => {
    if (!item) return;
    setBusy(true);
    setError("");
    try {
      await callAdminData("delete", { entity: "QAItem", id: item.id });
      setNotice("The question was removed.");
      await load();
    } catch (err) {
      setError(err.message || "The question could not be removed.");
    } finally {
      setBusy(false);
    }
  };

  const removeTopic = async (topic) => {
    if (!topic) return;
    setBusy(true);
    setError("");
    try {
      await callAdminData("delete", { entity: "QATopic", id: topic.id });
      setNotice("The topic was removed.");
      await load();
    } catch (err) {
      setError(err.message || "The topic could not be removed.");
    } finally {
      setBusy(false);
    }
  };

  const moveQuestions = async (fromName, toName) => {
    const target = topics.find((topic) => topic.name_en === toName);
    if (!target) return false;
    setBusy(true);
    setError("");
    try {
      const moving = items.filter((item) => item.topic_en === fromName);
      for (const item of moving) {
        await callAdminData("update", {
          entity: "QAItem",
          id: item.id,
          values: { topic_en: target.name_en, topic_lu: target.name_lu }
        });
      }
      const source = topics.find((topic) => topic.name_en === fromName);
      if (source) await callAdminData("delete", { entity: "QATopic", id: source.id });
      setNotice("The questions were moved and the topic was removed.");
      await load();
      return true;
    } catch (err) {
      setError(err.message || "The questions could not be moved.");
      return false;
    } finally {
      setBusy(false);
    }
  };

  const runBulk = async (action, ids) => {
    if (!ids || !ids.length) return;
    setBusy(true);
    setError("");
    try {
      if (action === "delete") {
        for (const id of ids) await callAdminData("delete", { entity: "QAItem", id });
        setNotice(`${ids.length} questions were removed.`);
      } else {
        const active = action === "activate";
        for (const id of ids) {
          await callAdminData("update", { entity: "QAItem", id, values: { active } });
        }
        setNotice(`${ids.length} questions were ${active ? "published" : "hidden"}.`);
      }
      await load();
    } catch (err) {
      setError(err.message || "The questions could not be changed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 18 }}>
        {TABS.map((entry) => (
          <button
            key={entry.id}
            type="button"
            className={`pr-tab ${tab === entry.id ? "pr-tab-active" : ""}`}
            onClick={() => setTab(entry.id)}
          >
            {entry.label}
          </button>
        ))}
      </div>

      {notice ? (
        <p className="pr-success" style={{ margin: "0 0 14px" }}>
          {notice}
        </p>
      ) : null}

      {loading ? (
        <div className="pr-empty">
          <Loader2Icon className="h-6 w-6 animate-spin" />
          <p>Loading the Q&amp;A library...</p>
        </div>
      ) : null}

      {!loading && tab === "questions" ? (
        <QaQuestionsPanel
          items={items}
          topics={topics}
          busy={busy}
          error={error}
          onSave={(values, id) => saveItem(values, id)}
          onDelete={removeItem}
          onBulk={runBulk}
        />
      ) : null}

      {!loading && tab === "topics" ? (
        <QaTopicsPanel
          topics={topics}
          items={items}
          busy={busy}
          error={error}
          onSave={(values, id) => saveTopic(values, id)}
          onDelete={removeTopic}
          onMove={moveQuestions}
        />
      ) : null}

      {!loading && tab === "import" ? <QaBulkImport topics={topics} onImported={load} /> : null}
    </div>
  );
}