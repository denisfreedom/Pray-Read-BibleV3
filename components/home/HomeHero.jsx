import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { BookOpenIcon } from "lucide-react";
import { HERO_IMAGE } from "@/lib/theme";

export default function HomeHero() {
  return (
    <section className="pr-hero">
      <div className="pr-hero-bg" style={{ backgroundImage: `url(${HERO_IMAGE})` }} />
      <div className="pr-hero-overlay" />
      <div className="pr-container pr-hero-inner">
        <h1 className="pr-hero-title">PRAY-READ BIBLE</h1>
        <p className="pr-eyebrow pr-eyebrow-light" style={{ margin: "18px 0 0" }}>
          Praying the Word • Reading the Word • Living Christ
        </p>
        <p className="pr-serif pr-hero-text" style={{ fontStyle: "italic", fontSize: "1.2rem" }}>
          “The Word of God is not merely to be read and understood; it is to be received, prayed, experienced, and
          expressed as life.”
        </p>
        <p className="pr-hero-text">
          Welcome to Pray-Read Bible, a Scripture-based spiritual formation platform devoted to helping believers
          develop a living, experiential relationship with God through His Word and the Spirit.
        </p>
        <div className="pr-hero-actions">
          <Link to={createPageUrl("BibleReader")} className="pr-btn pr-btn-gold">
            <BookOpenIcon className="h-4 w-4" />
            Begin Your Pray-Read Journey
          </Link>
          <Link to={createPageUrl("About")} className="pr-btn pr-btn-light-outline">
            About Pray-Read Bible
          </Link>
        </div>
      </div>
    </section>
  );
}