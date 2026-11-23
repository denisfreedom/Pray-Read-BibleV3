import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ArrowLeftIcon } from "lucide-react";

export default function Terms() {
  return (
    <div>
      <section className="pr-section-tight" style={{ background: "var(--pr-emerald)" }}>
        <div className="pr-container">
          <Link to={createPageUrl("Home")} className="pr-btn pr-btn-light-outline pr-btn-sm">
            <ArrowLeftIcon className="h-4 w-4" /> Home
          </Link>
          <h1 className="pr-serif" style={{ margin: "16px 0 0", color: "#fff", fontSize: "2.1rem" }}>
            Terms of use
          </h1>
        </div>
      </section>

      <div className="pr-container pr-section">
        <div className="pr-card pr-card-pad" style={{ maxWidth: 760 }}>
          <h2 className="pr-heading" style={{ fontSize: "1.1rem", fontWeight: 800 }}>Using Pray-Read Bible</h2>
          <p style={{ lineHeight: 1.85 }}>
            Pray-Read Bible is provided free of charge for personal and church use. You may read, print and share
            the devotionals, prayers and insights freely, including in a church bulletin or small group, as long as
            the content is not sold or republished as your own.
          </p>

          <h2 className="pr-heading" style={{ marginTop: 24, fontSize: "1.1rem", fontWeight: 800 }}>Scripture</h2>
          <p style={{ lineHeight: 1.85 }}>
            Bible text is drawn from public-domain sources. The English text is served from a public Bible
            service; the Luganda text comes from the public Luganda Bible. Translations may differ slightly
            between passages, so always check the wording against your own preferred translation when it matters
            for doctrine or quotation.
          </p>

          <h2 className="pr-heading" style={{ marginTop: 24, fontSize: "1.1rem", fontWeight: 800 }}>Your account</h2>
          <p style={{ lineHeight: 1.85 }}>
            You are responsible for keeping your password safe and for what is posted under your name in the
            community. You can ask us to remove a post or an account at any time through the contact form.
          </p>

          <h2 className="pr-heading" style={{ marginTop: 24, fontSize: "1.1rem", fontWeight: 800 }}>Donations</h2>
          <p style={{ lineHeight: 1.85 }}>
            Donations are processed by our payment partner and are voluntary. Pray-Read Bible itself never stores
            your card details. Donations are gifts, not purchases, and do not create any entitlement to a service.
          </p>

          <h2 className="pr-heading" style={{ marginTop: 24, fontSize: "1.1rem", fontWeight: 800 }}>No guarantee</h2>
          <p style={{ lineHeight: 1.85 }}>
            The app is offered as is. We correct errors as we find them, but we cannot promise that every passage,
            translation or note is perfect. Nothing in the app replaces pastoral care or the reading of scripture
            in community.
          </p>

          <p style={{ marginTop: 24, fontSize: "0.85rem" }}>
            <Link to={createPageUrl("Contact")} className="pr-link">
              Ask us a question
            </Link>{" "}
            ·{" "}
            <Link to={createPageUrl("Privacy")} className="pr-link">
              Privacy policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}