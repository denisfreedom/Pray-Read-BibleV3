import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { BookOpenIcon } from "lucide-react";

export default function ClosingInvite() {
  return (
    <div className="pr-container">
      <div
        className="pr-closing-panel"
        style={{
          maxWidth: "760px",
          margin: "0 auto",
          padding: "52px 32px",
          borderRadius: 24,
          background: "var(--pr-emerald)",
          color: "#faf8f2",
          textAlign: "center"
        }}
      >
        <h2 className="pr-section-title" style={{ color: "#faf8f2" }}>Begin Your Pray-Read Journey</h2>
        <p className="pr-serif" style={{ margin: "18px 0 0", fontSize: "1.15rem", lineHeight: 1.7, color: "#faf8f2" }}>
          Whether you are beginning your journey through the Scriptures or seeking a deeper experience of Christ,
          Pray-Read Bible invites you to encounter God&apos;s Word in a living and experiential way.
        </p>
        <p style={{ margin: "18px 0 0", fontWeight: 700, color: "var(--pr-gold)" }}>
          Read the Word. Pray the Word. Receive Christ. Live Christ. Express Christ.
        </p>
        <p style={{ margin: "14px 0 0", fontStyle: "italic", color: "#faf8f2" }}>Welcome to Pray-Read Bible.</p>
        <Link to={createPageUrl("BibleReader")} className="pr-btn pr-btn-gold" style={{ marginTop: 26 }}>
          <BookOpenIcon className="h-4 w-4" />
          Begin Your Pray-Read Journey
        </Link>
      </div>
    </div>
  );
}