import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { fetchPublicCollection } from "@/lib/contentApi";
import { useAuth } from "@/lib/AuthContext";
import { safeText } from "@/lib/format";
import { BookOpenIcon, LightbulbIcon, LandmarkIcon, MessageCircleQuestionIcon } from "lucide-react";

const bookKey = (value) => {
  const first = String(value || "").trim().toLowerCase().split(/\s+/)[0] || "";
  return first.length > 3 && first.endsWith("s") ? first.slice(0, -1) : first;
};

const matchesPassage = (passage, bookName, chapter) => {
  const text = String(passage || "").toLowerCase();
  const key = bookKey(bookName);
  if (!key) return false;
  const index = text.indexOf(key);
  if (index === -1) return false;
  const match = text.slice(index + key.length).match(/(\d+)/);
  return match ? Number(match[1]) === Number(chapter) : false;
};

const TABS = [
  { id: "commentary", label: "Commentary", icon: BookOpenIcon },
  { id: "theological", label: "Theological insight", icon: LightbulbIcon },
  { id: "historical", label: "Historical insight", icon: LandmarkIcon },
  { id: "qa", label: "Q&A for this passage", icon: MessageCircleQuestionIcon }
];

export default function PassageTabs({ book, chapter, reference, language = "en" }) {
  const { isAuthenticated } = useAuth();
  const [tab, setTab] = useState("commentary");

  const { data: commentaryRows } = useQuery({
    queryKey: ["commentary"],
    queryFn: () => fetchPublicCollection("commentary", { authenticated: isAuthenticated })
  });

  const { data: insightRows } = useQuery({
    queryKey: ["insights"],
    queryFn: () => fetchPublicCollection("insights", { authenticated: isAuthenticated })
  });

  const { data: qaRows } = useQuery({
    queryKey: ["qaItems"],
    queryFn: () => fetchPublicCollection("qaItems", { authenticated: isAuthenticated })
  });

  const commentary = useMemo(
    () =>
      (commentaryRows || []).filter(
        (row) => bookKey(row.book) === bookKey(book?.name) && Number(row.chapter) === Number(chapter)
      ),
    [commentaryRows, book, chapter]
  );

  const insights = useMemo(
    () =>
      (insightRows || []).filter(
        (row) => row.kind === tab && matchesPassage(row.passage, book?.name, chapter)
      ),
    [insightRows, book, chapter, tab]
  );

  const questions = useMemo(
    () =>
      (qaRows || []).filter(
        (row) => matchesPassage(row.scripture_ref, book?.name, chapter) && safeText(row.answer_en)
      ),
    [qaRows, book, chapter]
  );

  const activeTab = TABS.find((item) => item.id === tab) || TABS[0];
  const items = tab === "commentary" ? commentary : tab === "qa" ? questions : insights;

  return (
    <div className="pr-card pr-card-pad" style={{ marginTop: 22 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
        <h3 className="pr-heading" style={{ margin: 0, fontSize: "1rem", fontWeight: 800 }}>
          {reference}
        </h3>
        <span style={{ fontSize: "0.82rem" }}>Study notes for this chapter</span>
      </div>

      <div className="pr-tabs" style={{ marginTop: 14 }}>
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={tab === item.id ? "pr-tab pr-tab-active" : "pr-tab"}
            onClick={() => setTab(item.id)}
          >
            <item.icon className="h-4 w-4" style={{ display: "inline" }} /> {item.label}
          </button>
        ))}
      </div>

      <div style={{ marginTop: 18 }}>
        {items.length === 0 ? (
          <p style={{ margin: 0, fontSize: "0.9rem" }}>
            {tab === "qa"
              ? "No answered question for this passage yet. Send yours and the editorial team will answer it."
              : `No ${activeTab.label.toLowerCase()} is published for ${reference} yet. Read the passage slowly and write down the first line that stirs your heart.`}
            {tab === "qa" ? (
              <Link to={createPageUrl("QA")} className="pr-link" style={{ display: "inline-block", marginLeft: 6 }}>
                Ask a question →
              </Link>
            ) : null}
          </p>
        ) : tab === "commentary" ? (
          <div style={{ display: "grid", gap: 16 }}>
            {commentary.map((row) => (
              <article key={row.id}>
                <span className="pr-badge pr-badge-gold">{safeText(row.title) || "Commentary"}</span>
                <p style={{ margin: "10px 0 0", fontSize: "0.93rem", lineHeight: 1.8, whiteSpace: "pre-wrap" }}>
                  {language === "lu"
                    ? safeText(row.body_lu) || safeText(row.body_en)
                    : safeText(row.body_en) || safeText(row.body_lu)}
                </p>
              </article>
            ))}
          </div>
        ) : tab === "qa" ? (
          <div style={{ display: "grid", gap: 18 }}>
            {questions.map((row) => (
              <article key={row.id}>
                <p className="pr-heading" style={{ margin: 0, fontWeight: 800, fontSize: "0.95rem" }}>
                  {language === "lu" ? safeText(row.question_lu) : safeText(row.question_en)}
                </p>
                <p style={{ margin: "8px 0 0", fontSize: "0.9rem", lineHeight: 1.75 }}>
                  {language === "lu" ? safeText(row.answer_lu) : safeText(row.answer_en)}
                </p>
                {row.topic_en ? (
                  <p style={{ margin: "8px 0 0", fontSize: "0.78rem" }}>
                    <span className="pr-badge pr-badge-gold">{safeText(row.topic_en)}</span>
                  </p>
                ) : null}
              </article>
            ))}
          </div>
        ) : (
          <div style={{ display: "grid", gap: 18 }}>
            {insights.map((row) => (
              <article key={row.id}>
                <span className="pr-badge pr-badge-outline">{safeText(row.passage)}</span>
                <p className="pr-heading" style={{ margin: "10px 0 0", fontWeight: 800, fontSize: "0.95rem" }}>
                  {safeText(row.title)}
                </p>
                <p style={{ margin: "8px 0 0", fontSize: "0.9rem", lineHeight: 1.75 }}>
                  {safeText(row.excerpt) || safeText(row.body)}
                </p>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}