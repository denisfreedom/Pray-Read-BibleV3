import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { SendIcon, Loader2Icon } from "lucide-react";

export default function RevelationForm({ onSubmit, isAuthenticated, status, error }) {
  const [title, setTitle] = useState("");
  const [passage, setPassage] = useState("");
  const [body, setBody] = useState("");

  useEffect(() => {
    if (status === "success") {
      setTitle("");
      setPassage("");
      setBody("");
    }
  }, [status]);

  if (!isAuthenticated) {
    return (
      <div className="pr-card pr-card-pad">
        <p className="pr-heading" style={{ margin: 0, fontWeight: 800 }}>
          Share what God showed you
        </p>
        <p style={{ margin: "8px 0 0", fontSize: "0.9rem" }}>
          Sign in to share a revelation with the community and to join the conversation.
        </p>
        <Link
          to={`${createPageUrl("Login")}?next=${encodeURIComponent(window.location.pathname)}`}
          className="pr-btn pr-btn-primary pr-btn-sm"
          style={{ marginTop: 16 }}
        >
          Sign in to share
        </Link>
      </div>
    );
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!title.trim() || !body.trim()) return;
    onSubmit({ title: title.trim(), passage: passage.trim(), body: body.trim() });
  };

  return (
    <form className="pr-card pr-card-pad" onSubmit={handleSubmit}>
      <p className="pr-heading" style={{ margin: 0, fontWeight: 800 }}>
        Share what God showed you
      </p>
      <p style={{ margin: "6px 0 14px", fontSize: "0.88rem" }}>
        One insight, one passage, one honest word. It can change somebody else&apos;s week.
      </p>

      <div className="pr-field">
        <label className="pr-label" htmlFor="revelation-title">
          Title
        </label>
        <input
          id="revelation-title"
          className="pr-input"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="What did God show you?"
          maxLength={160}
        />
      </div>

      <div className="pr-field">
        <label className="pr-label" htmlFor="revelation-passage">
          Passage (optional)
        </label>
        <input
          id="revelation-passage"
          className="pr-input"
          value={passage}
          onChange={(event) => setPassage(event.target.value)}
          placeholder="Psalm 23:1"
          maxLength={80}
        />
      </div>

      <div className="pr-field">
        <label className="pr-label" htmlFor="revelation-body">
          Your revelation
        </label>
        <textarea
          id="revelation-body"
          className="pr-textarea"
          rows={4}
          value={body}
          onChange={(event) => setBody(event.target.value)}
          placeholder="Share what you are learning…"
          maxLength={4000}
        />
      </div>

      {error ? (
        <div className="pr-error" style={{ marginBottom: 12 }}>
          {error}
        </div>
      ) : null}

      <button
        type="submit"
        className="pr-btn pr-btn-primary"
        disabled={status === "loading" || !title.trim() || !body.trim()}
      >
        {status === "loading" ? (
          <>
            <Loader2Icon className="h-4 w-4 animate-spin" /> Sharing…
          </>
        ) : (
          <>
            <SendIcon className="h-4 w-4" /> Share
          </>
        )}
      </button>
    </form>
  );
}