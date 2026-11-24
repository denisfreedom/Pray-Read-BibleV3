import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fse2 } from "@/api/fse2Client";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { HERO_IMAGE, LOGO_URL } from "@/lib/theme";
import { ArrowLeftIcon, HeartHandshakeIcon, LanguagesIcon, BookOpenIcon } from "lucide-react";

export default function About() {
  return (
    <div>
      <section className="pr-hero">
        <div className="pr-hero-bg" style={{ backgroundImage: `url(${HERO_IMAGE})` }} />
        <div className="pr-hero-overlay" />
        <div className="pr-container pr-hero-inner">
          <Link to={createPageUrl("Home")} className="pr-btn pr-btn-light-outline pr-btn-sm">
            <ArrowLeftIcon className="h-4 w-4" /> Home
          </Link>
          <span className="pr-eyebrow pr-eyebrow-light" style={{ marginTop: 18 }}>
            About Pray-Read
          </span>
          <h1 className="pr-hero-title">A Bible you can live with</h1>
          <p className="pr-hero-text">
            Pray-Read exists for the person who wants more than a verse of the day and less than a theology
            course: scripture, read slowly, turned into prayer.
          </p>
        </div>
      </section>

      <div className="pr-container pr-section">
        <div className="pr-grid pr-grid-2">
          <div>
            <h2 className="pr-section-title">Why we built it</h2>
            <p style={{ marginTop: 14, lineHeight: 1.8 }}>
              Most people read the Bible in fragments: a verse shared on a screen, a chapter in the middle of a
              busy day. Both are good, and neither is enough. Pray-Read was built for the gap between them  -  a
              place where you can read a full chapter, mark what caught you, hear it read aloud, and turn it into
              a prayer without leaving the app.
            </p>
            <p style={{ marginTop: 14, lineHeight: 1.8 }}>
              Everything here is free. The devotionals are short on purpose, the prayers are plain on purpose, and
              the app works without a signal on purpose  -  because the people who read scripture most seriously
              are often the ones with the least reliable internet.
            </p>

            <div className="pr-grid pr-grid-2" style={{ marginTop: 24 }}>
              <div className="pr-card pr-card-pad">
                <BookOpenIcon className="h-5 w-5" style={{ color: "var(--pr-gold-deep)" }} />
                <p className="pr-heading" style={{ margin: "10px 0 0", fontWeight: 800 }}>
                  English and Luganda
                </p>
                <p style={{ margin: "6px 0 0", fontSize: "0.88rem" }}>
                  The full Bible in both languages, with devotionals and prayers written in each.
                </p>
              </div>
              <div className="pr-card pr-card-pad">
                <LanguagesIcon className="h-5 w-5" style={{ color: "var(--pr-gold-deep)" }} />
                <p className="pr-heading" style={{ margin: "10px 0 0", fontWeight: 800 }}>
                  Built for the local church
                </p>
                <p style={{ margin: "6px 0 0", fontSize: "0.88rem" }}>
                  Small groups, families and individuals, with the same material each week.
                </p>
              </div>
              <div className="pr-card pr-card-pad">
                <HeartHandshakeIcon className="h-5 w-5" style={{ color: "var(--pr-gold-deep)" }} />
                <p className="pr-heading" style={{ margin: "10px 0 0", fontWeight: 800 }}>
                  Prayer is the point
                </p>
                <p style={{ margin: "6px 0 0", fontSize: "0.88rem" }}>
                  Every reading ends somewhere you can pray from, not just somewhere you scroll past.
                </p>
              </div>
              <div className="pr-card pr-card-pad">
                <img
                  src={LOGO_URL}
                  alt="Pray Read Bible"
                  style={{ width: 44, height: 44, borderRadius: 14, objectFit: "contain" }}
                />
                <p className="pr-heading" style={{ margin: "10px 0 0", fontWeight: 800 }}>
                  Free and open
                </p>
                <p style={{ margin: "6px 0 0", fontSize: "0.88rem" }}>
                  Scripture in the public domain, no adverts, no paywalls.
                </p>
              </div>
            </div>
          </div>

          <div className="pr-card pr-card-pad">
            <h2 className="pr-heading" style={{ margin: "0 0 12px", fontSize: "1.1rem", fontWeight: 800 }}>
              How to use Pray-Read
            </h2>
            <ol style={{ margin: 0, paddingLeft: 20, lineHeight: 1.9, fontSize: "0.92rem" }}>
              <li>Open the reading plan or choose a book in the Bible Reader.</li>
              <li>Read the chapter slowly. Tap any verse to highlight it, bookmark it or add a note.</li>
              <li>Open the commentary and insights tabs beneath the passage.</li>
              <li>Turn the passage into a prayer in the prayer journal.</li>
              <li>Share the passage with someone who needs it.</li>
            </ol>

            <hr className="pr-divider" />

            <h3 className="pr-heading" style={{ margin: "0 0 8px", fontSize: "1rem", fontWeight: 800 }}>
              Write to us
            </h3>
            <p style={{ margin: 0, fontSize: "0.9rem" }}>
              Questions, corrections and requests for study material are all welcome.
            </p>
            <Link to={createPageUrl("Contact")} className="pr-btn pr-btn-primary pr-btn-sm" style={{ marginTop: 14 }}>
              Contact the team
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}