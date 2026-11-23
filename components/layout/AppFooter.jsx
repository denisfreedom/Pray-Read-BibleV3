import React, { useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { LOGO_URL, DONATE_URL, DONATE_LINK_PROPS } from "@/lib/theme";

const QUICK_LINKS = [
  { name: "BibleReader", label: "Bible Reader" },
  { name: "Devotionals", label: "Daily Devotionals" },
  { name: "PrayerLibrary", label: "Prayer Library" },
  { name: "VerseSongs", label: "Verse-Songs" },
  { name: "QA", label: "Q&A" },
  { name: "TheologicalInsights", label: "Theological insights" },
  { name: "HistoricalInsights", label: "Historical insights" },
  { name: "Community", label: "Community" },
  { name: "CommunityRevelations", label: "Revelations" },
  { name: "CommunityLiveTeaching", label: "Live teaching" },
  { name: "DiscussionGroups", label: "Discussion groups" },
  { name: "Plan", label: "Reading plan" },
  { name: "Journal", label: "Prayer journal" },
  { name: "Dashboard", label: "Dashboard" },
  { name: "Offline", label: "Offline centre" }
];

export default function AppFooter() {
  const [logoFailed, setLogoFailed] = useState(false);

  return (
    <footer className="pr-footer">
      <div className="pr-container pr-footer-grid">
        <div>
          <div className="pr-footer-brand">
            <span className="pr-brand-tile pr-brand-tile-sm">
              {logoFailed ? (
                <span className="pr-serif" style={{ color: "#fff", fontWeight: 700, fontSize: "0.8rem" }}>
                  PR
                </span>
              ) : (
                <img
                  src={LOGO_URL}
                  alt="Pray-Read Bible"
                  className="pr-brand-logo"
                  onError={() => setLogoFailed(true)}
                />
              )}
            </span>
            <span className="pr-wordmark">
              <span className="pr-wordmark-light">Pray-Read</span>{" "}
              <span className="pr-wordmark-gold">Bible</span>
            </span>
          </div>
          <p className="pr-footer-text">
            Pray · Read · Listen. A daily practice that puts the Word of God in your hands and a
            prayer on your lips  -  in English and Luganda.
          </p>
          <a href={DONATE_URL} {...DONATE_LINK_PROPS} className="pr-btn pr-btn-gold pr-btn-sm">
            Support this ministry
          </a>
        </div>

        <div>
          <h3 className="pr-footer-heading">Explore</h3>
          <ul className="pr-footer-list">
            {QUICK_LINKS.map((link) => (
              <li key={link.name}>
                <Link to={createPageUrl(link.name)}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="pr-footer-heading">Contact</h3>
          <ul className="pr-footer-list">
            <li>
              <Link to={createPageUrl("Contact")}>Send us a message</Link>
            </li>
            <li>
              <Link to={createPageUrl("About")}>About Pray-Read</Link>
            </li>
            <li>
              <Link to={createPageUrl("InstallPrompt")}>Install the app</Link>
            </li>
            <li>
              <Link to={createPageUrl("Terms")}>Terms of use</Link>
            </li>
            <li>
              <Link to={createPageUrl("Privacy")}>Privacy policy</Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="pr-container pr-footer-bottom">
        <p>© {new Date().getFullYear()} Pray-Read Bible. Scripture in the public domain.</p>
        <p>Built for churches, small groups and families.</p>
      </div>
    </footer>
  );
}