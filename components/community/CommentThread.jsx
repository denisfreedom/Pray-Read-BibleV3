import React, { useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Loader2Icon, SendIcon } from "lucide-react";
import { safeText } from "@/lib/format";

export default function CommentThread({ comments, onSubmit, isAuthenticated, busy, error }) {
  const [draft, setDraft] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!draft.trim()) return;
    onSubmit(draft.trim());
    setDraft("");
  };

  return (
    <div className="pr-card pr-card-pad" style={{ marginTop: 12 }}>
      <p className="pr-heading" style={{ margin: 0, fontWeight: 800, fontSize: "0.95rem" }}>
        Conversation
      </p>

      {comments.length === 0 ? (
        <p style={{ margin: "10px 0 0", fontSize: "0.88rem" }}>No comments yet. Start the conversation.</p>
      ) : (
        <ul className="pr-list-reset" style={{ display: "grid", gap: 12, marginTop: 12 }}>
          {comments.map((comment) => (
            <li key={comment.id} style={{ borderLeft: "2px solid var(--pr-gold)", paddingLeft: 12 }}>
              <p style={{ margin: 0, fontSize: "0.8rem", fontWeight: 700, color: "var(--pr-heading)" }}>
                {safeText(comment.author_name) || "Reader"}
              </p>
              <p style={{ margin: "4px 0 0", fontSize: "0.88rem", whiteSpace: "pre-wrap" }}>
                {safeText(comment.body)}
              </p>
            </li>
          ))}
        </ul>
      )}

      {isAuthenticated ? (
        <form onSubmit={handleSubmit} style={{ marginTop: 16 }}>
          <textarea
            className="pr-textarea"
            rows={3}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Write a comment…"
            maxLength={2000}
            aria-label="Write a comment"
          />
          {error ? (
            <div className="pr-error" style={{ marginTop: 10 }}>
              {error}
            </div>
          ) : null}
          <button
            type="submit"
            className="pr-btn pr-btn-primary pr-btn-sm"
            style={{ marginTop: 12 }}
            disabled={busy || !draft.trim()}
          >
            {busy ? <Loader2Icon className="h-4 w-4 animate-spin" /> : <SendIcon className="h-4 w-4" />}
            Post comment
          </button>
        </form>
      ) : (
        <p style={{ margin: "14px 0 0", fontSize: "0.88rem" }}>
          <Link to={`${createPageUrl("Login")}?next=${encodeURIComponent(window.location.pathname)}`} className="pr-link">
            Sign in
          </Link>{" "}
          to join the conversation.
        </p>
      )}
    </div>
  );
}