import React from "react";
import { createPageUrl } from "@/utils";
import { BookOpenIcon, HandHeartIcon, MusicIcon, MessageCircleQuestionIcon, UsersIcon, NotebookPenIcon } from "lucide-react";
import ImageCard from "@/components/home/ImageCard";
import { HOME_IMAGES } from "@/lib/homeImages";

const WAYS = [
  { name: "Community", label: "Community", icon: UsersIcon, text: `It shows other sections.`, button: "Open Community", image: HOME_IMAGES.worshipPhoto },
  { name: "PrayerLibrary", label: "Prayer Library", icon: HandHeartIcon, text: `It has all category of ready prayer points.`, button: "Open Prayer Library", image: HOME_IMAGES.praying },
  { name: "BibleReader", label: "Bible Reader", icon: BookOpenIcon, text: `Read the Word. Pray the Word. Receive Christ. Live Christ. Express Christ.`, button: "Open Bible Reader", image: HOME_IMAGES.sunrise },
  { name: "VerseSongs", label: "Verse-Songs", icon: MusicIcon, text: `It has verse prayer turned into songs, and altar music, word, music series.`, button: "Open Verse-Songs", image: HOME_IMAGES.worship },
  { name: "QA", label: "Q&A", icon: MessageCircleQuestionIcon, text: `It has posed questions with life and building answers.`, button: "Open Q&A", image: HOME_IMAGES.olive },
  { name: "Devotionals", label: "Devotionals", icon: NotebookPenIcon, text: `Daily devotionals for experiencing Christ through the Word and the Spirit.`, button: "Open Devotionals", image: HOME_IMAGES.devotional }
];

export default function SixWaysGrid() {
  return (
    <div className="pr-container">
      <h2 className="pr-section-title" style={{ textAlign: "center" }}>Everything in one place</h2>
      <p className="pr-section-lead" style={{ textAlign: "center" }}>Six ways to spend time with God:</p>
      <div className="pr-cards-3" style={{ marginTop: 40 }}>
        {WAYS.map((way) => (
          <ImageCard key={way.name} image={way.image} to={createPageUrl(way.name)}>
            <span className="pr-card-icon">
              <way.icon className="h-5 w-5" />
            </span>
            <h3 className="pr-card-subtitle" style={{ marginTop: 16 }}>{way.label}</h3>
            <p className="pr-card-text">{way.text}</p>
            <span className="pr-card-action">{way.button} →</span>
          </ImageCard>
        ))}
      </div>
    </div>
  );
}