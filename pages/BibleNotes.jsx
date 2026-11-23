import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fse2 } from "@/api/fse2Client";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useAuth } from "@/lib/AuthContext";
import { offline } from "@/lib/offlineDb";
import { formatDateLabel } from "@/lib/reading";
import EmptyState from "@/components/common/EmptyState";
import { BookmarkIcon, HighlighterIcon, NotebookPenIcon } from "lucide-react";

export default function BibleNotes() {
  const { user, isAuthenticated } = useAuth();
  const email = user?.email || null;

  const { data: marks } = useQuery({
    queryKey: ["studyMarks", email],
    queryFn: () => fse2.entities.StudyMark.list("-updated_date", 300),
    enabled: !!email
  });

  const { data: readings } = useQuery({
    queryKey: ["readings"],
    queryFn: () => fse2.entities.Reading.list("-updated_date", 300),
    enabled: !!email
  });

  const mine = useMemo(
    () => (marks || []).filter((row) => !email || row.owner_email === email),
    [marks, email]
  );

  const highlights = mine.filter((row) => row.mark_type === "highlight");
  const bookmarks = mine.filter((row) => row.mark_type === "bookmark");
  const notes = mine.filter((row) => row.mark_type === "note");

  const link = (row) => createPageUrl("Chapter") + `?book=${row.book_number}&chapter=${row.chapter}&verse=${row.verse}`;

  if (!isAuthenticated) {
    return (
      <div className="pr-container pr-section">
        <EmptyState
          icon={NotebookPenIcon}
          title="Sign in to see your notes"
          description="Highlights, bookmarks and notes are stored on your account so they follow you between devices."
          action={
            <Link to={createPageUrl("Login")} className="pr-btn pr-btn-primary">
              Sign in
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div>
      <section className="pr-section-tight" style={{ background: "var(--pr-emerald)" }}>
        <div className="pr-container">
          <span className="pr-eyebrow pr-eyebrow-light">Your library</span>
          <h1 className="pr-serif" style={{ margin: "10px 0 0", color: "#fff", fontSize: "2.1rem" }}>
            Highlights, bookmarks and notes
          </h1>
          <p style={{ margin: "8px 0 0", color: "rgba(255,255,255,0.8)" }}>
            {highlights.length} highlights · {bookmarks.length} bookmarks · {notes.length} notes
          </p>
        </div>
      </section>

      <div className="pr-container pr-section">
        {mine.length === 0 ? (
          <EmptyState
            icon={HighlighterIcon}
            title="Nothing saved yet"
            description="Open a chapter, tap any verse and highlight it, bookmark it or add a note."
            action={
              <Link to={createPageUrl("BibleReader")} className="pr-btn pr-btn-primary">
                Open the Bible Reader
              </Link>
            }
          />
        ) : (
          <div className="pr-grid pr-grid-2">
            {highlights.map((row) => (
              <div key={row.id} className="pr-card pr-card-pad">
                <span className="pr-badge pr-badge-gold">
                  <HighlighterIcon className="h-3 w-3" /> {row.book} {row.chapter}:{row.verse}
                </span>
                <p style={{ margin: "10px 0 0", fontSize: "0.9rem" }}>
                  Highlighted on {formatDateLabel(String(row.updated_date || "").slice(0, 10))}
                </p>
                <Link to={link(row)} className="pr-btn pr-btn-outline pr-btn-sm" style={{ marginTop: 12 }}>
                  Open the passage
                </Link>
              </div>
            ))}

            {bookmarks.map((row) => (
              <div key={row.id} className="pr-card pr-card-pad">
                <span className="pr-badge pr-badge-outline">
                  <BookmarkIcon className="h-3 w-3" /> {row.book} {row.chapter}:{row.verse}
                </span>
                <p style={{ margin: "10px 0 0", fontSize: "0.9rem" }}>Bookmarked for later.</p>
                <Link to={link(row)} className="pr-btn pr-btn-outline pr-btn-sm" style={{ marginTop: 12 }}>
                  Open the passage
                </Link>
              </div>
            ))}

            {notes.map((row) => (
              <div key={row.id} className="pr-card pr-card-pad">
                <span className="pr-badge pr-badge-outline">
                  <NotebookPenIcon className="h-3 w-3" /> {row.book} {row.chapter}:{row.verse}
                </span>
                <p className="pr-serif" style={{ margin: "10px 0 0", lineHeight: 1.8, color: "var(--pr-heading)" }}>
                  {row.note_text}
                </p>
                <Link to={link(row)} className="pr-btn pr-btn-outline pr-btn-sm" style={{ marginTop: 12 }}>
                  Open the passage
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}