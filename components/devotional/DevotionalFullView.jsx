import React from "react";
import { Link } from "react-router-dom";
import { CheckIcon, ChevronLeftIcon, ChevronRightIcon, HeartIcon, Share2Icon } from "lucide-react";
import { chapterLink } from "@/lib/scriptureRefs";
import {
  bodyOf,
  coverOf,
  devotionalDate,
  languageBadge,
  longDateLabel,
  prayerOf,
  scriptureOf,
  titleOf,
  topicOf,
  verseOf
} from "@/lib/devotionals";

/**
 * The whole devotional, read from the top: the cover as a banner, the verse,
 * the body in the language the reader chose, the prayer of the day and the
 * row of actions to share it, save it or mark it as read.
 */
export default function DevotionalFullView({
  row,
  language,
  onBack,
  onShare,
  prev,
  next,
  saved,
  onToggleSave,
  read,
  onMarkRead,
  more = []
}) {
  if (!row) return null;
  const scripture = scriptureOf(row, language);
  const link = chapterLink(scripture);
  const bodyEn = bodyOf(row, "EN");
  const bodyLu = bodyOf(row, "LU");
  const verseEn = verseOf(row, "EN");
  const verseLu = verseOf(row, "LU");
  const prayerEn = prayerOf(row, "EN");
  const prayerLu = prayerOf(row, "LU");

  const actions = (
    <div className="pr-dev-actions">
      <button
        type="button"
        className="pr-btn pr-btn-outline pr-btn-sm"
        onClick={() => onBack()}
        disabled={!prev}
      >
        <ChevronLeftIcon className="h-4 w-4" /> Previous Day
      </button>
      <button
        type="button"
        className="pr-btn pr-btn-outline pr-btn-sm"
        onClick={() => (next ? onBack(next) : null)}
        disabled={!next}
      >
        Next Day <ChevronRightIcon className="h-4 w-4" />
      </button>
      <button type="button" className="pr-btn pr-btn-primary pr-btn-sm" onClick={() => onShare(row)}>
        <Share2Icon className="h-4 w-4" /> Share
      </button>
      <button
        type="button"
        className="pr-btn pr-btn-outline pr-btn-sm"
        onClick={() => onToggleSave(row)}
        aria-pressed={!!saved}
      >
        <HeartIcon className="h-4 w-4" style={{ fill: saved ? "currentColor" : "none" }} />
        {saved ? "Saved" : "Save"}
      </button>
      <button
        type="button"
        className="pr-btn pr-btn-outline pr-btn-sm"
        onClick={() => onMarkRead(row)}
        aria-pressed={!!read}
      >
        <CheckIcon className="h-4 w-4" /> {read ? "Read" : "Mark as Read"}
      </button>
    </div>
  );

  return (
    <article className="pr-dev-full">
      <div className="pr-dev-banner">
        <img src={coverOf(row)} alt="" />
        <div className="pr-dev-banner-overlay">
          <span className="pr-dev-date" style={{ color: "var(--pr-gold)" }}>
                            {longDateLabel(devotionalDate(row))}
          </span>
          <h1 className="pr-dev-title" style={{ color: "#ffffff" }}>
            {titleOf(row, language)}
          </h1>
          {language === "BOTH" && row.title_lu ? (
            <p style={{ margin: "6px 0 0", fontWeight: 700 }}>
              <span className="pr-dev-lu-badge">LU</span> {row.title_lu}
            </p>
          ) : null}
          {link ? (
            <Link to={link} className="pr-dev-ref" style={{ color: "var(--pr-gold)" }}>
              {scripture}
            </Link>
          ) : (
            <span className="pr-dev-ref" style={{ color: "var(--pr-gold)" }}>
              {scripture}
            </span>
          )}
        </div>
      </div>

      <div className="pr-dev-full-body">
        {actions}

        <div className="pr-dev-badges" style={{ margin: "18px 0 6px" }}>
          {topicOf(row) ? <span className="pr-badge pr-badge-gold">{topicOf(row)}</span> : null}
          <span className="pr-badge pr-badge-outline">{languageBadge(row)}</span>
          {row.series ? <span className="pr-badge pr-badge-outline">{row.series}</span> : null}
        </div>

        {language !== "LU" && verseEn ? <p className="pr-dev-verse">{verseEn}</p> : null}
        {language !== "EN" && verseLu ? (
          <div>
            <span className="pr-dev-lu-badge">LU</span>
            <p className="pr-dev-verse">{verseLu}</p>
          </div>
        ) : null}

        {language !== "LU" && bodyEn ? <p className="pr-dev-body-text">{bodyEn}</p> : null}
        {language !== "EN" && bodyLu ? (
          <div className="pr-dev-lu-block">
            <span className="pr-dev-lu-badge">LU</span>
            <p className="pr-dev-body-text">{bodyLu}</p>
          </div>
        ) : null}

        {prayerEn || prayerLu ? (
          <div className="pr-dev-prayer">
            <p className="pr-dev-prayer-title">Prayer for today</p>
            {language !== "LU" && prayerEn ? <p className="pr-dev-body-text">{prayerEn}</p> : null}
            {language !== "EN" && prayerLu ? (
              <div className="pr-dev-lu-block">
                <span className="pr-dev-lu-badge">LU</span>
                <p className="pr-dev-body-text">{prayerLu}</p>
              </div>
            ) : null}
          </div>
        ) : null}

        <div className="pr-dev-sticky-actions">{actions}</div>

        {more.length ? (
          <div style={{ marginTop: 34 }}>
            <h2 className="pr-section-title" style={{ fontSize: "1.25rem" }}>
              More Devotionals
            </h2>
            <div className="pr-dev-prev" style={{ marginTop: 14 }}>
              {more.map((item) => (
                <button
                  key={item.id || item.code}
                  type="button"
                  className="pr-dev-prev-card"
                  style={{ textAlign: "left", cursor: "pointer" }}
                  onClick={() => onBack(item)}
                >
                  <img className="pr-dev-prev-cover" src={coverOf(item)} alt="" loading="lazy" />
                  <span>
                    <span className="pr-dev-date" style={{ display: "block" }}>
                      {longDateLabel(devotionalDate(item))}
                    </span>
                    <strong style={{ color: "var(--pr-heading)" }}>{titleOf(item, language)}</strong>
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </article>
  );
}