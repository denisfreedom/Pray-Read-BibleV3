import React from "react";
import { HeartIcon, MessageCircleIcon, Loader2Icon } from "lucide-react";
import { safeText } from "@/lib/format";

export default function RevelationCard({ post, onLike, commentCount, commentsOpen, onToggleComments, liking }) {
  const likes = Number(post.likes || 0);

  return (
    <article className="pr-card pr-card-pad">
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <span className="pr-badge pr-badge-gold">{safeText(post.author_name) || "Reader"}</span>
        {post.passage ? <span className="pr-badge pr-badge-outline">{safeText(post.passage)}</span> : null}
      </div>

      <h3 className="pr-heading" style={{ margin: "12px 0 0", fontSize: "1.1rem", fontWeight: 800 }}>
        {safeText(post.title)}
      </h3>
      <p style={{ margin: "10px 0 0", fontSize: "0.93rem", lineHeight: 1.75, whiteSpace: "pre-wrap" }}>
        {safeText(post.body)}
      </p>

      <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 16, flexWrap: "wrap" }}>
        <button
          type="button"
          className="pr-btn pr-btn-outline pr-btn-sm"
          onClick={() => onLike(post)}
          disabled={liking}
        >
          {liking ? <Loader2Icon className="h-4 w-4 animate-spin" /> : <HeartIcon className="h-4 w-4" />}
          {likes} {likes === 1 ? "like" : "likes"}
        </button>
        <button type="button" className="pr-chip" style={{ cursor: "pointer" }} onClick={() => onToggleComments(post.id)}>
          <MessageCircleIcon className="h-4 w-4" />
          {commentCount} {commentCount === 1 ? "comment" : "comments"}
        </button>
      </div>
    </article>
  );
}