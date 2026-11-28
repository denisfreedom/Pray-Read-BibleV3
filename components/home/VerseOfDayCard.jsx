import React, { useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Share2Icon, SparklesIcon } from "lucide-react";
import ImageCard from "@/components/home/ImageCard";
import { HOME_IMAGES } from "@/lib/homeImages";

export default function VerseOfDayCard({ verse }) {
  const [copied, setCopied] = useState(false);
  const verseText = verse.text_en || verse.text_lu;
  const shareText = `“${verseText}”\n${verse.reference} · Pray-Read Bible`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: "Pray-Read Bible", text: shareText });
      } catch (err) {
        if (err.name !== "AbortError") throw err;
      }
      return;
    }
    await navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ImageCard image={HOME_IMAGES.sunrise} className="pr-verse-card">
      <h2 className="pr-card-title pr-serif">Live Verse of the Day</h2>
      <blockquote className="pr-serif pr-verse-text">“{verseText}”</blockquote>
      <p className="pr-verse-ref">{verse.reference}</p>
      <div className="pr-card-actions">
        <button type="button" className="pr-btn pr-btn-gold pr-btn-sm" onClick={handleShare}>
          <Share2Icon className="h-4 w-4" />
          {copied ? "Copied" : "Share This Verse"}
        </button>
        <Link to={createPageUrl("VerseOfDay")} className="pr-btn pr-btn-light-outline pr-btn-sm">
          <SparklesIcon className="h-4 w-4" />
          Pray-Read This Verse
        </Link>
      </div>
    </ImageCard>
  );
}