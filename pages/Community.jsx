import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import { fetchPublicCollection } from "@/lib/contentApi";
import { COMMUNITY_POSTS, DISCUSSION_GROUPS, LIVE_SESSIONS } from "@/lib/seedContent";
import { safeText } from "@/lib/format";
import { LightbulbIcon, VideoIcon, UsersIcon, MessageCircleIcon, HeartIcon, ArrowRightIcon } from "lucide-react";

const HUBS = [
  {
    page: "CommunityRevelations",
    label: "Revelations",
    title: "What God showed you",
    description: "Share what the Lord is showing you, and encourage other readers with one honest word.",
    icon: LightbulbIcon,
    accent: "#a9852e",
    tint: "#fdf5e7"
  },
  {
    page: "CommunityLiveTeaching",
    label: "Live teaching",
    title: "Gather around the Word",
    description: "Live sessions with prayer and discussion, in English and Luganda.",
    icon: VideoIcon,
    accent: "#2f5d8a",
    tint: "#eef4fa"
  },
  {
    page: "DiscussionGroups",
    label: "Discussion groups",
    title: "Study it together",
    description: "Small groups reading the same passage, one chapter a week, one question each.",
    icon: UsersIcon,
    accent: "#1d4035",
    tint: "#eef4f1"
  }
];

export default function Community() {
  const { data: revelationRows } = useQuery({
    queryKey: ["revelations"],
    queryFn: () => fetchPublicCollection("revelations")
  });
  const { data: groupRows } = useQuery({
    queryKey: ["discussion-groups"],
    queryFn: () => fetchPublicCollection("groups")
  });
  const { data: sessionRows } = useQuery({
    queryKey: ["live-sessions"],
    queryFn: () => fetchPublicCollection("liveSessions")
  });

  const latest = useMemo(() => {
    const live = (revelationRows || []).filter((row) => !row.parent_id);
    const merged = [...live];
    COMMUNITY_POSTS.forEach((post, index) => {
      if (!merged.some((row) => safeText(row.title) === safeText(post.title))) {
        merged.push({ ...post, id: `seed-${index}` });
      }
    });
    return merged.slice(0, 3);
  }, [revelationRows]);

  const groupCount = (groupRows || []).length || DISCUSSION_GROUPS.length;
  const sessionCount = (sessionRows || []).length || LIVE_SESSIONS.length;
  const revelationCount = (revelationRows || []).filter((row) => !row.parent_id).length || COMMUNITY_POSTS.length;

  return (
    <div>
      <section className="pr-section-tight" style={{ background: "var(--pr-emerald)" }}>
        <div className="pr-container">
          <span className="pr-eyebrow pr-eyebrow-light">Community</span>
          <h1 className="pr-serif" style={{ margin: "10px 0 0", color: "#fff", fontSize: "2.2rem" }}>
            You are not reading alone
          </h1>
          <p style={{ margin: "8px 0 0", color: "rgba(255,255,255,0.8)", maxWidth: "62ch" }}>
            Share what God is showing you, join a live session, or settle in with a small group reading the same
            passage you are reading tonight.
          </p>
        </div>
      </section>

      <div className="pr-container pr-section">
        <div className="pr-grid pr-grid-3">
          {HUBS.map((hub) => (
            <Link
              key={hub.page}
              to={createPageUrl(hub.page)}
              className="pr-card pr-card-hover pr-card-pad"
              style={{ display: "block", textDecoration: "none" }}
            >
              <span
                className="pr-badge"
                style={{ background: hub.tint, color: hub.accent }}
              >
                <hub.icon className="h-3 w-3" /> {hub.label}
              </span>
              <h2 className="pr-heading" style={{ margin: "12px 0 0", fontSize: "1.12rem", fontWeight: 800 }}>
                {hub.title}
              </h2>
              <p style={{ margin: "10px 0 0", fontSize: "0.9rem", lineHeight: 1.7 }}>{hub.description}</p>
              <span className="pr-link" style={{ display: "inline-block", marginTop: 14, fontSize: "0.85rem" }}>
                Open {hub.label.toLowerCase()} <ArrowRightIcon className="h-4 w-4" style={{ display: "inline" }} />
              </span>
            </Link>
          ))}
        </div>

        <div className="pr-grid pr-grid-3" style={{ marginTop: 18 }}>
          <div className="pr-stat">
            <p className="pr-stat-value">{revelationCount}</p>
            <p className="pr-stat-label">Revelations shared</p>
          </div>
          <div className="pr-stat">
            <p className="pr-stat-value">{groupCount}</p>
            <p className="pr-stat-label">Discussion groups</p>
          </div>
          <div className="pr-stat">
            <p className="pr-stat-value">{sessionCount}</p>
            <p className="pr-stat-label">Live sessions</p>
          </div>
        </div>
      </div>

      <section className="pr-section-tight" style={{ background: "var(--pr-ivory-soft)" }}>
        <div className="pr-container">
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <div>
              <span className="pr-eyebrow">Latest from the community</span>
              <h2 className="pr-section-title" style={{ fontSize: "1.6rem" }}>
                What readers are sharing
              </h2>
            </div>
            <Link to={createPageUrl("CommunityRevelations")} className="pr-link" style={{ fontSize: "0.88rem" }}>
              See all revelations <ArrowRightIcon className="h-4 w-4" style={{ display: "inline" }} />
            </Link>
          </div>

          {latest.length === 0 ? (
            <p style={{ marginTop: 18 }}>No revelations have been shared yet. Be the first.</p>
          ) : (
            <div className="pr-grid pr-grid-3" style={{ marginTop: 20 }}>
              {latest.map((post) => (
                <article key={post.id} className="pr-card pr-card-pad">
                  <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                    <span className="pr-badge pr-badge-gold">{safeText(post.author_name) || "Reader"}</span>
                    {post.passage ? <span className="pr-badge pr-badge-outline">{safeText(post.passage)}</span> : null}
                  </div>
                  <h3 className="pr-heading" style={{ margin: "12px 0 0", fontSize: "1rem", fontWeight: 800 }}>
                    {safeText(post.title)}
                  </h3>
                  <p style={{ margin: "10px 0 0", fontSize: "0.89rem", lineHeight: 1.7 }}>
                    {String(safeText(post.body)).slice(0, 180)}
                    {String(safeText(post.body)).length > 180 ? "…" : ""}
                  </p>
                  <div style={{ display: "flex", gap: 14, marginTop: 14, fontSize: "0.8rem", color: "var(--pr-body)" }}>
                    <span>
                      <HeartIcon className="h-4 w-4" style={{ display: "inline", color: "var(--pr-gold-deep)" }} />{" "}
                      {Number(post.likes || 0)}
                    </span>
                    <span>
                      <MessageCircleIcon className="h-4 w-4" style={{ display: "inline", color: "var(--pr-gold-deep)" }} />{" "}
                      Join the conversation
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}