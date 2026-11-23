import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchPublicCollection } from "@/lib/contentApi";
import { LIVE_SESSIONS } from "@/lib/seedContent";
import { safeText } from "@/lib/format";
import EmptyState from "@/components/common/EmptyState";
import Spinner from "@/components/common/Spinner";
import { VideoIcon, CalendarDaysIcon, UserIcon } from "lucide-react";

export default function CommunityLiveTeaching() {
  const { data: rows, isLoading } = useQuery({
    queryKey: ["live-sessions"],
    queryFn: () => fetchPublicCollection("liveSessions")
  });

  const sessions = useMemo(() => {
    const live = rows || [];
    if (!live.length) return LIVE_SESSIONS.map((session, index) => ({ ...session, id: `seed-${index}` }));
    const merged = [...live];
    LIVE_SESSIONS.forEach((session, index) => {
      if (!merged.some((row) => safeText(row.title) === safeText(session.title))) {
        merged.push({ ...session, id: `seed-${index}` });
      }
    });
    return merged;
  }, [rows]);

  return (
    <div>
      <section className="pr-section-tight" style={{ background: "var(--pr-emerald)" }}>
        <div className="pr-container">
          <span className="pr-eyebrow pr-eyebrow-light">Community</span>
          <h1 className="pr-serif" style={{ margin: "10px 0 0", color: "#fff", fontSize: "2.2rem" }}>
            Live teaching
          </h1>
          <p style={{ margin: "8px 0 0", color: "rgba(255,255,255,0.8)", maxWidth: "62ch" }}>
            Gather with readers around the Word. These sessions are live, and every one of them ends with time for prayer.
          </p>
        </div>
      </section>

      <div className="pr-container pr-section">
        {isLoading ? (
          <Spinner label="Loading live sessions" />
        ) : sessions.length === 0 ? (
          <EmptyState
            icon={VideoIcon}
            title="No live session scheduled"
            description="New sessions are announced here first. Check back soon."
          />
        ) : (
          <div className="pr-grid pr-grid-2">
            {sessions.map((session) => (
              <article key={session.id} className="pr-card pr-card-pad">
                <span className="pr-badge pr-badge-emerald">
                  <VideoIcon className="h-3 w-3" /> Live
                </span>
                <h2 className="pr-heading" style={{ margin: "12px 0 0", fontSize: "1.12rem", fontWeight: 800 }}>
                  {safeText(session.title)}
                </h2>
                <p style={{ margin: "10px 0 0", fontSize: "0.9rem", lineHeight: 1.7 }}>
                  {safeText(session.description)}
                </p>
                <div style={{ display: "grid", gap: 8, marginTop: 14, fontSize: "0.85rem" }}>
                  <span>
                    <CalendarDaysIcon className="h-4 w-4" style={{ display: "inline", color: "var(--pr-gold-deep)" }} />{" "}
                    {safeText(session.session_date) || "Date to be announced"}
                  </span>
                  <span>
                    <UserIcon className="h-4 w-4" style={{ display: "inline", color: "var(--pr-gold-deep)" }} />{" "}
                    {safeText(session.host) || "Pray-Read team"}
                  </span>
                </div>
                {session.join_link ? (
                  <a
                    href={session.join_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pr-btn pr-btn-primary pr-btn-sm"
                    style={{ marginTop: 18 }}
                  >
                    <VideoIcon className="h-4 w-4" /> Join the session
                  </a>
                ) : null}
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}