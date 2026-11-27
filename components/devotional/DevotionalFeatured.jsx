import React from "react";
import { Link } from "react-router-dom";
import { HeartIcon, Share2Icon } from "lucide-react";
import { chapterLink } from "@/lib/scriptureRefs";
import {
  bodyOf,
  coverOf,
  devotionalDate,
  excerptOf,
  longDateLabel,
  scriptureOf,
  titleOf,
  topicOf,
  verseOf
} from "@/lib/devotionals";

/**
 * The devotional of the day: the dark card at the top of the page with the
 * cover, the date, the title, the verse in both languages and the buttons.
 */
export default function DevotionalFeatured({ row, language, onOpen, onShare, saved, onToggleSave }) {
  if (!row) return null;
  const scripture = scriptureOf(row, language);
  const link = chapterLink(scripture);
  const excerpt = excerptOf(bodyOf(row, language), 3);
  const verseEn = verseOf(row, "EN");
  const verseLu = verseOf(row, "LU");

  return (
    <article className="pr-dev-featured">
      <img className="pr-dev-featured-cover" src={coverOf(row)} alt="" />
      <div className="pr-dev-featured-body">
        <span className="pr-dev-date">{longDateLabel(devotionalDate(row))}</span>
        <h2 className="pr-dev-title">{titleOf(row, language)}</h2>
        {language === "BOTH" && row.title_lu ? (
          <p className="pr-dev-excerpt" style={{ marginTop: 6, fontWeight: 700 }}>
            <span className="pr-dev-lu-badge">LU</span> {row.title_lu}
          </p>
        ) : null}
        <div className="pr-dev-badges" style={{ marginTop: 10 }}>
          {link ? (
            <Link to={link} className="pr-dev-ref">
              {scripture}
            </Link>
          ) : (
            <span className="pr-dev-ref">{scripture}</span>
          )}
          {topicOf(row) ? <span className="pr-badge pr-badge-gold">{topicOf(row)}</span> : null}
        </div>

        {language !== "LU" && verseEn ? <p className="pr-dev-verse">{verseEn}</p> : null}
        {language !== "EN" && verseLu ? (
          <div>
            <span className="pr-dev-lu-badge">LU</span>
            <p className="pr-dev-verse">{verseLu}</p>
          </div>
        ) : null}

        {excerpt ? <p className="pr-dev-excerpt">{excerpt}</p> : null}

        <div className="pr-dev-actions">
          <button type="button" className="pr-btn pr-btn-gold pr-btn-sm" onClick={() => onOpen(row)}>
            Read Full Devotional →
          </button>
          <button type="button" className="pr-btn pr-btn-light-outline pr-btn-sm" onClick={() => onShare(row)}>
            <Share2Icon className="h-4 w-4" /> Share
          </button>
          <button
            type="button"
            className="pr-btn pr-btn-light-outline pr-btn-sm"
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