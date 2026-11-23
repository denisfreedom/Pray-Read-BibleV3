import React, { useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Loader2Icon, SendIcon } from "lucide-react";
import { safeText } from "@/lib/format";

export default function ThreadMessages({ messages, onSubmit, isAuthenticated, busy, error, groupName }) {
  const [draft, setDraft] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!draft.trim()) return;
    onSubmit(draft.trim());
    setDraft("");
  };

  return (
    <div className="pr-card pr-card-pad" style={{ marginTop: 18 }}>
      <p className="pr-heading" style={{ margin: 0, fontWeight: 800, fontSize: "0.95rem" }}>
        Messages{safeText(groupName) ? ` · ${safeText(groupName)}` : ""}
      </p>

      {messages.length === 0 ? (
        <p style={{ margin: "10px 0 0", fontSize: "0.88rem" }}>
          No messages yet. Start the conversation for this group.
        </p>
      ) : (
        <ul className="pr-list-reset" style={{ display: "grid", gap: 14, marginTop: 14 }}>
          {messages.map((message) => (
            <li key={message.id} style={{ borderLeft: "2px solid var(--pr-gold)", paddingLeft: 12 }}>
              <p style={{ margin: 0, fontSize: "0.8rem", fontWeight: 700, color: "var(--pr-heading)" }}>
                {safeText(message.author_name) || "Reader"}
                {message.title ? ` · ${safeText(message.title)}` : ""}
              </p>
              <p style={{ margin: "4px 0 0", fontSize: "0.9rem", whiteSpace: "pre-wrap" }}>{safeText(message.body)}</p>
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
            placeholder="Share a thought with the group…"
            maxLength={4000}
            aria-label="Write a message"
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
            Post message
          </button>
        </form>
      ) : (
        <p style={{ margin: "14px 0 0", fontSize: "0.88rem" }}>
          <Link to={`${createPageUrl("Login")}?next=${encodeURIComponent(window.location.pathname)}`} className="pr-link">
            Sign in
          </Link>{" "}
          to join the discussion.
        </p>
      )}
    </div>
  );
}