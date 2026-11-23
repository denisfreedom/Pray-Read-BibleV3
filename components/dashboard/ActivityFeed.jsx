import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { fse2 } from "@/api/fse2Client";
import { createPageUrl } from "@/utils";
import { useAuth } from "@/lib/AuthContext";
import { activityLabel } from "@/lib/activity";
import { ActivityIcon, BookOpenIcon, BookmarkIcon, FlameIcon, HeartHandshakeIcon, HighlighterIcon, NotebookPenIcon } from "lucide-react";

const ICONS = {
  chapter_visit: BookOpenIcon,
  highlight: HighlighterIcon,
  bookmark: BookmarkIcon,
  note_saved: NotebookPenIcon,
  prayer_opened: HeartHandshakeIcon,
  devotional_access: FlameIcon
};

const TINTS = {
  chapter_visit: { background: "rgba(29,64,53,0.10)", color: "#1d4035" },
  highlight: { background: "rgba(233,201,129,0.28)", color: "#a9852e" },
  bookmark: { background: "rgba(47,93,138,0.10)", color: "#2f5d8a" },
  note_saved: { background: "rgba(147,51,234,0.10)", color: "#7c3aed" },
  prayer_opened: { background: "rgba(190,24,93,0.10)", color: "#be185d" },
  devotional_access: { background: "rgba(234,88,12,0.12)", color: "#c2410c" }
};

const timeAgo = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return formatDistanceToNow(date, { addSuffix: true });
};

export default function ActivityFeed() {
  const { user } = useAuth();
  const email = user?.email || null;

  const { data: rows = [], isLoading } = useQuery({
    queryKey: ["readingActivity", email],
    queryFn: () => fse2.entities.ReadingActivity.list("-created_date", 60),
    enabled: !!email,
    refetchInterval: 30000
  });

  const feed = useMemo(
    () => (rows || []).filter((row) => row.owner_email === email).slice(0, 12),
    [rows, email]
  );

  if (!email) return null;

  return (
    <section className="pr-card pr-card-pad" aria-label="Recent reading activity">
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <ActivityIcon className="h-5 w-5" style={{ color: "var(--pr-gold-deep)" }} />
        <h3 className="pr-heading" style={{ margin: 0, fontSize: "1rem", fontWeight: 800 }}>
          Your recent activity
        </h3>
      </div>

      {isLoading ? (
        <p style={{ margin: 0, fontSize: "0.88rem" }}>Loading your activity…</p>
      ) : feed.length === 0 ? (
        <p style={{ margin: 0, fontSize: "0.88rem" }}>
          Open a chapter and your reading trail appears here: chapters read, verses highlighted and notes written.
        </p>
      ) : (
        <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 10 }}>
          {feed.map((row) => {
            const Icon = ICONS[row.activity_type] || ActivityIcon;
            const tint = TINTS[row.activity_type] || { background: "rgba(29,64,53,0.10)", color: "#1d4035" };
            return (
              <li key={row.id} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <span
                  style={{
                    flex: "0 0 auto",
                    width: 30,
                    height: 30,
                    borderRadius: 999,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: tint.background,
                    color: tint.color
                  }}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <span style={{ minWidth: 0 }}>
                  {row.book_number ? (
                    <Link
                      to={
                        createPageUrl("Chapter") +
                        `?book=${row.book_number}&chapter=${row.chapter || 1}${row.verse ? `&verse=${row.verse}` : ""}`
                      }
                      className="pr-link"
                      style={{ fontWeight: 700, fontSize: "0.9rem" }}
                    >
                      {activityLabel(row)}
                    </Link>
                  ) : (
                    <span style={{ fontWeight: 700, fontSize: "0.9rem" }}>{activityLabel(row)}</span>
                  )}
                  <span translate="no" style={{ display: "block", fontSize: "0.78rem", color: "var(--pr-body)" }}>
                    {timeAgo(row.created_date)}
                  </span>
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}