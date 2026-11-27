import React from "react";
import { Link } from "react-router-dom";
import { HeartIcon, Share2Icon } from "lucide-react";
import { chapterLink } from "@/lib/scriptureRefs";
import {
  bodyOf,
  coverOf,
  devotionalDate,
  excerptOf,
  languageBadge,
  longDateLabel,
  scriptureOf,
  titleOf,
  topicOf
} from "@/lib/devotionals";

/**
 * One devotional in the list: the cover, the date, the title, the scripture,
 * the topic and the first lines of the body.
 */
export default function DevotionalCard({ row, language, onOpen, onShare, saved, onToggleSave }) {
  const scripture = scriptureOf(row, language);
  const link = chapterLink(scripture);
  const excerpt = excerptOf(bodyOf(row, language), 2);

  return (
    <article className="pr-dev-card">
      <img className="pr-dev-cover" src={coverOf(row)} alt="" loading="lazy" />
      <div className="pr-dev-card-body">
        <span className="pr-dev-date">{longDateLabel(devotionalDate(row))}</span>
        <h3 className="pr-dev-title">{titleOf(row, language)}</h3>
        {language === "BOTH" && row.title_lu ? (
          <p className="pr-dev-excerpt" style={{ margin: 0, fontWeight: 700 }}>
            <span className="pr-dev-lu-badge">LU</span> {row.title_lu}
          </p>
        ) : null}
        <div className="pr-dev-badges">
          {link ? (
            <Link to={link} className="pr-dev-ref">
              {scripture}
            </Link>
          ) : (
            <span className="pr-dev-ref">{scripture}</span>
          )}
          {topicOf(row) ? <span className="pr-badge pr-badge-gold">{topicOf(row)}</span> : null}
          <span className="pr-badge pr-badge-outline">{languageBadge(row)}</span>
        </div>
        {excerpt ? <p className="pr-dev-excerpt">{excerpt}</p> : null}
        <div className="pr-dev-actions" style={{ marginTop: "auto" }}>
          <button type="button" className="pr-btn pr-btn-primary pr-btn-sm" onClick={() => onOpen(row)}>
            Read →
          </button>
          <button type="button" className="pr-btn pr-btn-outline pr-btn-sm" onClick={() => onShare(row)}>
            <Share2Icon className="h-4 w-4" /> Share
          </button>
          <button
            type="button"
            className="pr-btn pr-btn-outline pr-btn-sm"
            onClick={() => onToggleSave(row)}
            aria-pressed={!!saved}
            title={saved ? "Saved to your library" : "Save to your library"}
          >
            <HeartIcon className="h-4 w-4" style={{ fill: saved ? "currentColor" : "none" }} />
            {saved ? "Saved" : "Save"}
          </button>
        </div>
      </div>
    </article>
  );
}