import React, { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchPublicCollection, likeRevelation, submitRevelation } from "@/lib/contentApi";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useAuth } from "@/lib/AuthContext";
import { COMMUNITY_POSTS, LIVE_SESSIONS, DISCUSSION_GROUPS } from "@/lib/seedContent";
import EmptyState from "@/components/common/EmptyState";
import { UsersIcon, LightbulbIcon, VideoIcon, MessageCircleIcon, HeartIcon, SendIcon, Loader2Icon } from "lucide-react";
import { fse2 } from "@/api/fse2Client";


export default function Community() {
  const { user, isAuthenticated } = useAuth();
  const email = user?.email || null;
  const queryClient = useQueryClient();
  const [tab, setTab] = useState("revelations");
  const [title, setTitle] = useState("");
  const [passage, setPassage] = useState("");
  const [body, setBody] = useState("");
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const { data: postRows } = useQuery({
    queryKey: ["revelations"],
    queryFn: () => fetchPublicCollection("revelations", { authenticated: isAuthenticated })
  });

  const { data: sessionRows } = useQuery({
    queryKey: ["liveSessions"],
    queryFn: () => fetchPublicCollection("liveSessions", { authenticated: isAuthenticated })
  });

  const { data: groupRows } = useQuery({
    queryKey: ["discussionGroups"],
    queryFn: () => fetchPublicCollection("groups", { authenticated: isAuthenticated })
  });

  const postMutation = useMutation({
    mutationFn: (payload) => submitRevelation(payload),
    onSuccess: () => {
      setStatus("success");
      setTitle("");
      setPassage("");
      setBody("");
      queryClient.invalidateQueries({ queryKey: ["revelations"] });
    },
    onError: (err) => {
      setStatus("error");
      setErrorMsg(err.message || "Could not share that. Please try again.");
    }
  });

  const likeMutation = useMutation({
    mutationFn: (id) => likeRevelation(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["revelations"] })
  });

  const posts = useMemo(() => {
    if (postRows && postRows.length) return postRows;
    return COMMUNITY_POSTS.map((item) => ({ ...item, id: `seed-${item.title}` }));
  }, [postRows]);

  const sessions = sessionRows && sessionRows.length ? sessionRows : LIVE_SESSIONS;
  const groups = groupRows && groupRows.length ? groupRows : DISCUSSION_GROUPS;

  const submit = (event) => {
    event.preventDefault();
    setErrorMsg("");
    if (!title.trim() || !body.trim()) {
      setStatus("error");
      setErrorMsg("Add a title and your reflection.");
      return;
    }
    setStatus("loading");
    postMutation.mutate({
      title: title.trim(),
      passage: passage.trim(),
      body: body.trim(),
      owner_email: email,
      author_name: user?.full_name || email,
      likes: 0
    });
  };

  return (
    <div>
      <section className="pr-section-tight" style={{ background: "var(--pr-emerald)" }}>
        <div className="pr-container">
          <span className="pr-eyebrow pr-eyebrow-light">Community</span>
          <h1 className="pr-serif" style={{ margin: "10px 0 0", color: "#fff", fontSize: "2.2rem" }}>
            Read alone, but not by yourself
          </h1>
          <p style={{ margin: "8px 0 0", color: "rgba(255,255,255,0.8)", maxWidth: "60ch" }}>
            Share what God is doing in your reading, join a live teaching, or find a group that studies the same
            passage with you.
          </p>
        </div>
      </section>

      <div className="pr-container pr-section">
        <div className="pr-tabs" style={{ marginBottom: 22 }}>
          <button
            type="button"
            className={`pr-tab ${tab === "revelations" ? "pr-tab-active" : ""}`}
            onClick={() => setTab("revelations")}
          >
            <LightbulbIcon className="h-4 w-4" style={{ display: "inline" }} /> Revelations
          </button>
          <button
            type="button"
            className={`pr-tab ${tab === "teaching" ? "pr-tab-active" : ""}`}
            onClick={() => setTab("teaching")}
          >
            <VideoIcon className="h-4 w-4" style={{ display: "inline" }} /> Live teaching
          </button>
          <button
            type="button"
            className={`pr-tab ${tab === "groups" ? "pr-tab-active" : ""}`}
            onClick={() => setTab("groups")}
          >
            <UsersIcon className="h-4 w-4" style={{ display: "inline" }} /> Discussion groups
          </button>
        </div>

        {tab === "revelations" ? (
          <div className="pr-grid" style={{ gridTemplateColumns: "1fr", gap: 24 }}>
            <div className="pr-grid pr-grid-2">
              {posts.map((post) => (
                <div key={post.id || post.title} className="pr-card pr-card-pad">
                  {post.passage ? (
                    <span className="pr-badge pr-badge-outline">{post.passage}</span>
                  ) : null}
                  <h2 className="pr-heading" style={{ margin: "12px 0 0", fontSize: "1.1rem", fontWeight: 800 }}>
                    {post.title}
                  </h2>
                  <p style={{ margin: "10px 0 0", fontSize: "0.92rem" }}>{post.body}</p>
                  <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 14, flexWrap: "wrap" }}>
                    <span style={{ fontSize: "0.8rem" }}>{post.author_name}</span>
                    <button
                      type="button"
                      className="pr-chip"
                      style={{ cursor: "pointer" }}
                      onClick={() => post.id && !String(post.id).startsWith("seed-") && likeMutation.mutate(post.id)}
                    >
                      <HeartIcon className="h-4 w-4" /> {post.likes || 0}
                    </button>
                    <Link to={createPageUrl("BibleReader")} className="pr-link" style={{ fontSize: "0.82rem" }}>
                      Open the passage
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div className="pr-card pr-card-pad">
              <h2 className="pr-heading" style={{ margin: 0, fontSize: "1.1rem", fontWeight: 800 }}>
                Share a revelation
              </h2>
              <p style={{ margin: "8px 0 0", fontSize: "0.88rem" }}>
                {isAuthenticated
                  ? "What did you see in the Word this week? Others are praying through the same passage."
                  : "Sign in to share what God is doing in your reading."}
              </p>

              {status === "success" ? (
                <div className="pr-success" style={{ marginTop: 14 }}>
                  Shared. Thank you for encouraging the fellowship.
                </div>
              ) : (
                <form onSubmit={submit} style={{ marginTop: 14 }}>
                  <div className="pr-field">
                    <label className="pr-label" htmlFor="revelation-title">
                      Title
                    </label>
                    <input
                      id="revelation-title"
                      className="pr-input"
                      value={title}
                      onChange={(event) => setTitle(event.target.value)}
                      placeholder="God met me in the last verse of Psalm 23"
                      disabled={!isAuthenticated}
                    />
                  </div>
                  <div className="pr-field">
                    <label className="pr-label" htmlFor="revelation-passage">
                      Passage
                    </label>
                    <input
                      id="revelation-passage"
                      className="pr-input"
                      value={passage}
                      onChange={(event) => setPassage(event.target.value)}
                      placeholder="Psalm 23:6"
                      disabled={!isAuthenticated}
                    />
                  </div>
                  <div className="pr-field">
                    <label className="pr-label" htmlFor="revelation-body">
                      Your reflection
                    </label>
                    <textarea
                      id="revelation-body"
                      className="pr-textarea"
                      value={body}
                      onChange={(event) => setBody(event.target.value)}
                      placeholder="What did the passage show you?"
                      disabled={!isAuthenticated}
                    />
                  </div>
                  {status === "error" ? <div className="pr-error">{errorMsg}</div> : null}
                  <button
                    type="submit"
                    className="pr-btn pr-btn-primary"
                    style={{ marginTop: 12 }}
                    disabled={status === "loading" || !isAuthenticated}
                  >
                    {status === "loading" ? (
                      <Loader2Icon className="h-4 w-4 animate-spin" />
                    ) : (
                      <SendIcon className="h-4 w-4" />
                    )}
                    {status === "loading" ? "Sharing…" : "Share it"}
                  </button>
                  {!isAuthenticated ? (
                    <p style={{ margin: "12px 0 0", fontSize: "0.82rem" }}>
                      <Link to={createPageUrl("Login")} className="pr-link">
                        Sign in
                      </Link>{" "}
                      to share.
                    </p>
                  ) : null}
                </form>
              )}
            </div>
          </div>
        ) : null}

        {tab === "teaching" ? (
          <div className="pr-grid pr-grid-2">
            {sessions.map((session) => (
              <div key={session.title} className="pr-card pr-card-pad">
                <span className="pr-badge pr-badge-gold">{session.session_date}</span>
                <h2 className="pr-heading" style={{ margin: "12px 0 0", fontSize: "1.1rem", fontWeight: 800 }}>
                  {session.title}
                </h2>
                <p style={{ margin: "6px 0 0", fontSize: "0.82rem", color: "var(--pr-gold-deep)", fontWeight: 700 }}>
                  Hosted by {session.host}
                </p>
                <p style={{ margin: "10px 0 0", fontSize: "0.9rem" }}>{session.description}</p>
                <a
                  href={session.join_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pr-btn pr-btn-primary pr-btn-sm"
                  style={{ marginTop: 14 }}
                >
                  <VideoIcon className="h-4 w-4" />
                  Join the session
                </a>
              </div>
            ))}
          </div>
        ) : null}

        {tab === "groups" ? (
          <div className="pr-grid pr-grid-3">
            {groups.map((group) => (
              <div key={group.name} className="pr-card pr-card-pad">
                <UsersIcon className="h-5 w-5" style={{ color: "var(--pr-gold-deep)" }} />
                <h2 className="pr-heading" style={{ margin: "12px 0 0", fontSize: "1.05rem", fontWeight: 800 }}>
                  {group.name}
                </h2>
                <p style={{ margin: "8px 0 0", fontSize: "0.9rem" }}>{group.description}</p>
                <p style={{ margin: "10px 0 0", fontSize: "0.8rem", color: "var(--pr-body)" }}>
                  {group.schedule} · {group.member_count} members
                </p>
                <button
                  type="button"
                  className="pr-btn pr-btn-outline pr-btn-sm"
                  style={{ marginTop: 14 }}
                  onClick={() => {
                    if (!isAuthenticated) {
                      window.location.href = createPageUrl("Login");
                      return;
                    }
                    window.location.href = createPageUrl("Dashboard");
                  }}
                >
                  <MessageCircleIcon className="h-4 w-4" />
                  Join the group
                </button>
              </div>
            ))}
          </div>
        ) : null}

        {posts.length === 0 && tab === "revelations" ? (
          <EmptyState
            icon={LightbulbIcon}
            title="No revelations yet"
            description="Be the first to share what God showed you this week."
          />
        ) : null}
      </div>
    </div>
  );
}