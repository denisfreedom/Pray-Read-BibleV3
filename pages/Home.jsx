import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import { fetchPublicCollection } from "@/lib/contentApi";
import { useAuth } from "@/lib/AuthContext";
import { DEVOTIONALS, VERSE_OF_THE_DAY, COMMUNITY_POSTS } from "@/lib/seedContent";
import { HERO_IMAGE, WORSHIP_IMAGE, LOGO_URL, DONATE_URL, DONATE_LINK_PROPS } from "@/lib/theme";
import { toISODate } from "@/lib/reading";
import ShareRow from "@/components/common/ShareRow";
import { BookOpenIcon, HandHeartIcon, MusicIcon, MessageCircleQuestionIcon, UsersIcon, NotebookPenIcon, ArrowRightIcon, DownloadIcon, SmartphoneIcon, SparklesIcon } from "lucide-react";
import { fse2 } from "@/api/fse2Client";


const GRID = [
  { name: "BibleReader", label: "Bible Reader", text: "All 66 books in English and Luganda, with highlights, notes and audio.", icon: BookOpenIcon },
  { name: "Devotionals", label: "Daily Devotionals", text: "Short, rich devotionals that put one passage into practice.", icon: NotebookPenIcon },
  { name: "PrayerLibrary", label: "Prayer Library", text: "Prayers for morning, healing, family, work, peace and guidance.", icon: HandHeartIcon },
  { name: "VerseSongs", label: "Verse-Songs", text: "Sing the scripture with a player that follows you across the site.", icon: MusicIcon },
  { name: "QA", label: "Q&A", text: "Real questions from readers, answered with care and a passage.", icon: MessageCircleQuestionIcon },
  { name: "Community", label: "Community", text: "Revelations, live teaching and discussion groups for the fellowship.", icon: UsersIcon }
];

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [installDismissed, setInstallDismissed] = useState(false);

  const { data: verseRows } = useQuery({
    queryKey: ["verseOfDay"],
    queryFn: () => fetchPublicCollection("verseOfDay", { authenticated: isAuthenticated })
  });

  const today = toISODate();

  const verse = useMemo(() => {
    const rows = verseRows && verseRows.length ? verseRows : VERSE_OF_THE_DAY;
    return rows.find((row) => row.verse_date === today) || rows[0];
  }, [verseRows, today]);

  const devotional = DEVOTIONALS[0];
  const post = COMMUNITY_POSTS[0];

  return (
    <div>
      <section className="pr-hero">
        <div className="pr-hero-bg" style={{ backgroundImage: `url(${HERO_IMAGE})` }} />
        <div className="pr-hero-overlay" />
        <div className="pr-container pr-hero-inner">
          <span className="pr-eyebrow pr-eyebrow-light">Pray · Read · Listen</span>
          <h1 className="pr-hero-title">The Word, the prayer and the habit that holds.</h1>
          <p className="pr-hero-text">
            Pray · Read · Listen takes you through scripture in English and Luganda, then walks with you into
            prayer. Read a chapter, keep what matters, and come back tomorrow.
          </p>
          <div className="pr-hero-actions">
            <Link to={createPageUrl("BibleReader")} className="pr-btn pr-btn-gold">
              <BookOpenIcon className="h-4 w-4" />
              Open the Bible Reader
            </Link>
            <Link to={createPageUrl("Devotionals")} className="pr-btn pr-btn-light-outline">
              Read today&apos;s devotional
            </Link>
          </div>
        </div>
      </section>

      {!installDismissed ? (
        <section className="pr-container" style={{ marginTop: -34, position: "relative", zIndex: 2 }}>
          <div className="pr-card pr-card-pad" style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 48,
                height: 48,
                borderRadius: 16,
                background: "var(--pr-ivory-soft)",
                color: "var(--pr-gold-deep)"
              }}
            >
              <SmartphoneIcon className="h-6 w-6" />
            </span>
            <div style={{ flex: "1 1 260px" }}>
              <p className="pr-heading" style={{ margin: 0, fontWeight: 800 }}>
                Take Pray-Read with you
              </p>
              <p style={{ margin: "4px 0 0", fontSize: "0.88rem" }}>
                Install the app for quick access, offline chapters and a player that never stops.
              </p>
            </div>
            <Link to={createPageUrl("InstallPrompt")} className="pr-btn pr-btn-primary pr-btn-sm">
              <DownloadIcon className="h-4 w-4" />
              Install
            </Link>
            <button
              type="button"
              className="pr-btn pr-btn-outline pr-btn-sm"
              onClick={() => setInstallDismissed(true)}
            >
              Not now
            </button>
          </div>
        </section>
      ) : null}

      <section className="pr-container pr-section">
        <div className="pr-grid pr-grid-2" style={{ alignItems: "center" }}>
          <div>
            <span className="pr-eyebrow">Verse of the day</span>
            <blockquote
              className="pr-serif"
              style={{
                margin: "16px 0 0",
                fontSize: "1.6rem",
                lineHeight: 1.6,
                color: "var(--pr-heading)"
              }}
            >
              “{verse?.text_en || verse?.text_lu}”
            </blockquote>
            <p style={{ margin: "14px 0 0", fontWeight: 700, color: "var(--pr-gold-deep)" }}>
              {verse?.reference}
            </p>
            {verse?.note ? (
              <p style={{ margin: "10px 0 0", fontSize: "0.92rem", maxWidth: "52ch" }}>{verse.note}</p>
            ) : null}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 20 }}>
              <Link
                to={createPageUrl("VerseOfDay")}
                className="pr-btn pr-btn-primary"
              >
                <SparklesIcon className="h-4 w-4" />
                Read and reflect
              </Link>
              <Link to={createPageUrl("Chapter") + "?book=43&chapter=1&verse=14"} className="pr-btn pr-btn-outline">
                Open in Bible Reader
              </Link>
            </div>
            <div style={{ marginTop: 18 }}>
              <ShareRow
                label="Share this verse"
                text={`${verse?.text_en || ""}  -  ${verse?.reference || ""}`}
                url={`${window.location.origin}${createPageUrl("VerseOfDay")}`}
              />
            </div>
          </div>

          <div className="pr-card" style={{ overflow: "hidden" }}>
            <img
              src={WORSHIP_IMAGE}
              alt="A Bible lit by a warm lamp"
              style={{ width: "100%", height: 240, objectFit: "cover", display: "block" }}
            />
            <div className="pr-card-pad">
              <span className="pr-badge pr-badge-gold">{devotional.code}</span>
              <h2 className="pr-heading" style={{ margin: "12px 0 0", fontSize: "1.3rem", fontWeight: 800 }}>
                {devotional.title}
              </h2>
              <p className="pr-serif" style={{ margin: "8px 0 0", color: "var(--pr-gold-deep)", fontWeight: 700 }}>
                {devotional.scripture}
              </p>
              <p style={{ margin: "10px 0 0", fontSize: "0.92rem" }}>
                {devotional.body.split("\n\n")[0]}
              </p>
              <Link
                to={createPageUrl("Devotionals") + `?devotional=${devotional.code}`}
                className="pr-btn pr-btn-primary pr-btn-sm"
                style={{ marginTop: 16 }}
              >
                Read more
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="pr-section" style={{ background: "var(--pr-ivory-soft)" }}>
        <div className="pr-container">
          <span className="pr-eyebrow">Everything in one place</span>
          <h2 className="pr-section-title">Six ways to spend time with God</h2>
          <p className="pr-section-lead">
            The same scripture, shaped for the way you actually live: reading, praying, listening, asking and
            sharing.
          </p>

          <div className="pr-grid pr-grid-3" style={{ marginTop: 26 }}>
            {GRID.map((item) => (
              <Link
                key={item.name}
                to={createPageUrl(item.name)}
                className="pr-card pr-card-hover pr-card-pad"
                style={{ textDecoration: "none", display: "block" }}
              >
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 44,
                    height: 44,
                    borderRadius: 14,
                    background: "rgba(29,64,53,0.09)",
                    color: "var(--pr-emerald)"
                  }}
                >
                  <item.icon className="h-5 w-5" />
                </span>
                <h3 className="pr-heading" style={{ margin: "14px 0 0", fontSize: "1.05rem", fontWeight: 800 }}>
                  {item.label}
                </h3>
                <p style={{ margin: "8px 0 0", fontSize: "0.9rem" }}>{item.text}</p>
                <span className="pr-link" style={{ display: "inline-block", marginTop: 12, fontSize: "0.86rem" }}>
                  Open →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="pr-container pr-section">
        <div className="pr-grid pr-grid-2" style={{ alignItems: "center" }}>
          <div className="pr-card pr-card-pad">
            <span className="pr-eyebrow">From the community</span>
            <h2 className="pr-heading" style={{ margin: "12px 0 0", fontSize: "1.4rem", fontWeight: 800 }}>
              {post.title}
            </h2>
            <p style={{ margin: "6px 0 0", color: "var(--pr-gold-deep)", fontWeight: 700 }}>{post.passage}</p>
            <p style={{ margin: "12px 0 0", fontSize: "0.92rem" }}>{post.body}</p>
            <p style={{ margin: "12px 0 0", fontSize: "0.8rem", color: "var(--pr-body)" }}>
              {post.author_name} · {post.likes} people praying
            </p>
            <Link to={createPageUrl("Community")} className="pr-btn pr-btn-outline pr-btn-sm" style={{ marginTop: 14 }}>
              Join the conversation
            </Link>
          </div>

          <div>
            <span className="pr-eyebrow">Support the work</span>
            <h2 className="pr-section-title">Keep Pray-Read free for every church</h2>
            <p className="pr-section-lead">
              Every translation, every devotional and every prayer in this app is free. If it has blessed you,
              help us keep it free for someone else.
            </p>
            <a href={DONATE_URL} {...DONATE_LINK_PROPS} className="pr-btn pr-btn-gold" style={{ marginTop: 20 }}>
              Donate to Pray-Read
            </a>
            <p style={{ margin: "14px 0 0", fontSize: "0.8rem" }}>
              <Link to={createPageUrl("Contact")} className="pr-link">
                Contact the team
              </Link>{" "}
              ·{" "}
              <Link to={createPageUrl("About")} className="pr-link">
                About this ministry
              </Link>
            </p>
            <img
              src={LOGO_URL}
              alt="Pray-Read Bible"
              style={{ display: "none" }}
              onError={(event) => {
                event.currentTarget.style.display = "none";
              }}
            />
          </div>
        </div>
      </section>
    </div>
  );
}