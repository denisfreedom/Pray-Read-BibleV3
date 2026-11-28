import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ArrowRightIcon } from "lucide-react";
import ImageCard from "@/components/home/ImageCard";
import {
  bodyOf,
  coverOf,
  devotionalKey,
  excerptOf,
  longDateLabel,
  titleOf
} from "@/lib/devotionals";

export default function DailyDevotionalCard({ devotional, today }) {
  if (!devotional) return null;

  return (
    <ImageCard image={coverOf(devotional)} className="pr-devotional-card">
      <span className="pr-card-label">{longDateLabel(today)}</span>
      <h2 className="pr-card-title pr-serif" style={{ marginTop: 12 }}>Today&apos;s Devotional</h2>
      <h3 className="pr-card-subtitle" style={{ marginTop: 14 }}>{titleOf(devotional, "BOTH")}</h3>
      <p style={{ marginTop: 10 }}>{excerptOf(bodyOf(devotional, "BOTH"), 2)}</p>
      <div className="pr-card-actions">
        <Link
          to={createPageUrl("Devotionals") + `?devotional=${encodeURIComponent(devotionalKey(devotional))}`}
          className="pr-btn pr-btn-gold pr-btn-sm"
        >
          Read Full Devotional
          <ArrowRightIcon className="h-4 w-4" />
        </Link>
      </div>
    </ImageCard>
  );
}