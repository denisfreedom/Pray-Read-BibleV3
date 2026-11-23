import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ArrowLeftIcon } from "lucide-react";

export default function Privacy() {
  return (
    <div>
      <section className="pr-section-tight" style={{ background: "var(--pr-emerald)" }}>
        <div className="pr-container">
          <Link to={createPageUrl("Home")} className="pr-btn pr-btn-light-outline pr-btn-sm">
            <ArrowLeftIcon className="h-4 w-4" /> Home
          </Link>
          <h1 className="pr-serif" style={{ margin: "16px 0 0", color: "#fff", fontSize: "2.1rem" }}>
            Privacy policy
          </h1>
        </div>
      </section>

      <div className="pr-container pr-section">
        <div className="pr-card pr-card-pad" style={{ maxWidth: 760 }}>
          <h2 className="pr-heading" style={{ fontSize: "1.1rem", fontWeight: 800 }}>What we store</h2>
          <p style={{ lineHeight: 1.85 }}>
            When you sign in, we store your name and email address with your reading history, highlights,
            bookmarks, notes, journal entries, completed devotionals and saved prayers. This is so your reading
            follows you between devices. We never sell your data and we never share it with advertisers.
          </p>

          <h2 className="pr-heading" style={{ marginTop: 24, fontSize: "1.1rem", fontWeight: 800 }}>What stays on your device</h2>
          <p style={{ lineHeight: 1.85 }}>
            Downloaded chapters, devotionals, prayers and comments are stored in your browser's offline storage so
            they work without a connection. Clearing the offline centre, or clearing your browser data, removes
            them. Your completion streaks and devotional progress are also kept locally on the device.
          </p>

          <h2 className="pr-heading" style={{ marginTop: 24, fontSize: "1.1rem", fontWeight: 800 }}>Community posts</h2>
          <p style={{ lineHeight: 1.85 }}>
            Revelations you post, and the questions you ask, are visible to other readers. Write only what you are
            happy to share publicly. We can remove a post on request.
          </p>

          <h2 className="pr-heading" style={{ marginTop: 24, fontSize: "1.1rem", fontWeight: 800 }}>Contact messages</h2>
          <p style={{ lineHeight: 1.85 }}>
            Messages sent through the contact form are kept in the admin inbox so the team can reply. They are
            used for that purpose only.
          </p>

          <h2 className="pr-heading" style={{ marginTop: 24, fontSize: "1.1rem", fontWeight: 800 }}>Your choices</h2>
          <p style={{ lineHeight: 1.85 }}>
            You can ask us to export or delete your account and everything attached to it. Write to us and we will
            action it.
          </p>

          <p style={{ marginTop: 24, fontSize: "0.85rem" }}>
            <Link to={createPageUrl("Contact")} className="pr-link">
              Contact the team
            </Link>{" "}
            ·{" "}
            <Link to={createPageUrl("Terms")} className="pr-link">
              Terms of use
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}