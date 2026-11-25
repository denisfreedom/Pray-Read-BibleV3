import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchPublicCollection } from "@/lib/contentApi";
import { useAuth } from "@/lib/AuthContext";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { INSIGHTS } from "@/lib/seedContent";
import { chapterLink } from "@/lib/scriptureRefs";
import ShareRow from "@/components/common/ShareRow";
import EmptyState from "@/components/common/EmptyState";
import { STORAGE_KEYS } from "@/lib/theme";
import { LightbulbIcon, LandmarkIcon, SearchIcon } from "lucide-react";

export default function InsightsBoard({ kind }) {
  const { isAuthenticated } = useAuth();
  const [search, setSearch] = useState("");
  const [openId, setOpenId] = useState(null);
  const [saved, setSaved] = useState(() => {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEYS.savedInsights) || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  const { data: rows } = useQuery({
    queryKey: ["insights", kind],
    queryFn: () => fetchPublicCollection("insights", { authenticated: isAuthenticated })
  });

  const insights = useMemo(() => {
    const builtIn = INSIGHTS.filter((item) => item.kind === kind);
    if (!rows || !rows.length) return builtIn;
    const merged = [...rows];
    builtIn.forEach((item) => {
      if (!merged.some((row) => row.title === item.title)) merged.push(item);
    });
    return merged;
  }, [rows, kind]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return insights.filter((item) => {
      if (item.kind !== kind) return false;
      if (!query) return true;
      return (
        String(item.title || "").toLowerCase().includes(query) ||
        String(item.excerpt || "").toLowerCase().includes(query) ||
        String(item.passage || "").toLowerCase().includes(query)
      );
    });
  }, [insights, kind, search]);

  const toggleSaved = (item) => {
    const key = `${item.kind}:${item.title}`;
    setSaved((prev) => {
      const next = prev.includes(key) ? prev.filter((value) => value !== key) : [...prev, key];
      try {
        localStorage.setItem(STORAGE_KEYS.savedInsights, JSON.stringify(next));
      } catch {
        // saving is a convenience; the board still works without storage
      }
      return next;
    });
  };

  const icon = kind === "theological" ? LightbulbIcon : LandmarkIcon;

  return (
    <div>
      <section className="pr-section-tight" style={{ background: "var(--pr-emerald)" }}>
        <div className="pr-container">
          <span className="pr-eyebrow pr-eyebrow-light">
            {kind === "theological" ? "Theological insights" : "Historical insights"}
          </span>
          <h1 className="pr-serif" style={{ margin: "10px 0 0", color: "#fff", fontSize: "2.2rem" }}>
            {kind === "theological" ? "What the text means" : "The world behind the text"}
          </h1>
          <p style={{ margin: "8px 0 0", color: "rgba(255,255,255,0.8)", maxWidth: "62ch" }}>
            {kind === "theological"
              ? "The doctrine, the symbols and the heart of God that open up as you read."
              : "The people, places and history that give the words their weight."}
          </p>
        </div>
      </section>

      <div className="pr-container pr-section">
        <div className="pr-card pr-card-pad" style={{ marginBottom: 24 }}>
          <div className="pr-tabs" style={{ borderBottom: "none" }}>
            <Link
              to={createPageUrl("TheologicalInsights")}
              className={`pr-tab ${kind === "theological" ? "pr-tab-active" : ""}`}
            >
              <LightbulbIcon className="h-4 w-4" style={{ display: "inline" }} /> Theological
            </Link>
            <Link
              to={createPageUrl("HistoricalInsights")}
              className={`pr-tab ${kind === "historical" ? "pr-tab-active" : ""}`}
            >
              <LandmarkIcon className="h-4 w-4" style={{ display: "inline" }} /> Historical
            </Link>
          </div>

          <div style={{ position: "relative", marginTop: 14 }}>
            <SearchIcon
              className="h-4 w-4"
              style={{ position: "absolute", left: 14, top: 15, color: "var(--pr-gold-deep)" }}
            />
            <input
              className="pr-input"
              style={{ paddingLeft: 40 }}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search insights…"
              aria-label="Search insights"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={icon}
            title="No insight matches that search"
            description="Try a different word, or switch between theological and historical insights."
          />
        ) : (
          <div className="pr-grid pr-grid-3">
            {filtered.map((item) => {
              const key = `${item.kind}:${item.title}`;
              const isOpen = openId === key;
              const isSaved = saved.includes(key);
              return (
                <div
                  key={key}
                  className="pr-card pr-card-hover pr-card-pad"
                  style={{ display: "flex", flexDirection: "column" }}
                >
                  <span className="pr-badge pr-badge-gold">{item.passage || item.kind}</span>
                  <h2 className="pr-heading" style={{ margin: "12px 0 0", fontSize: "1.08rem", fontWeight: 800 }}>
                    {item.title}
                  </h2>
                  <p style={{ margin: "10px 0 0", fontSize: "0.9rem", flex: "1 1 auto" }}>
                    {isOpen ? item.body : item.excerpt}
                  </p>

                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 16, alignItems: "center" }}>
                    <button
                      type="button"
                      className="pr-btn pr-btn-outline pr-btn-sm"
                      onClick={() => setOpenId(isOpen ? null : key)}
                    >
                      {isOpen ? "Close" : "Read more"}
                    </button>
                    <button type="button" className="pr-chip" style={{ cursor: "pointer" }} onClick={() => toggleSaved(item)}>
                      {isSaved ? "Saved" : "Save"}
                    </button>
                  </div>

                  {isOpen ? (
                    <div style={{ marginTop: 14 }}>
                      {item.passage && chapterLink(item.passage) ? (
                        <Link
                          to={chapterLink(item.passage)}
                          className="pr-link"
                          style={{ fontSize: "0.85rem" }}
                        >
                          Read {item.passage} →
                        </Link>
                      ) : null}
                      <div style={{ marginTop: 12 }}>
                        <ShareRow
                          label="Share"
                          text={`${item.title}\n\n${item.excerpt}`}
                          url={`${window.location.origin}${createPageUrl(
                            kind === "theological" ? "TheologicalInsights" : "HistoricalInsights"
                          )}`}
                        />
                      </div>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}