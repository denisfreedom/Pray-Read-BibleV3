import React from "react";
import { BookOpenIcon, HandHeartIcon, SparklesIcon, HeartIcon, UsersIcon, SunIcon } from "lucide-react";
import ImageCard from "@/components/home/ImageCard";
import { HOME_IMAGES } from "@/lib/homeImages";

const STEPS = [
  { title: "Pray the Word", text: `Turn Scripture into personal and corporate communion with God.`, icon: HandHeartIcon, image: HOME_IMAGES.sunrise },
  { title: "Read the Word", text: `Receive God's speaking with an open, attentive, and believing heart.`, icon: BookOpenIcon, image: HOME_IMAGES.praying },
  { title: "Receive Christ", text: `Experience the reality of Christ revealed and communicated through the Scriptures.`, icon: SparklesIcon, image: HOME_IMAGES.olive },
  { title: "Live Christ", text: `Allow the Word to become the inward reality governing our daily lives.`, icon: HeartIcon, image: HOME_IMAGES.worship },
  { title: "Express Christ", text: `Manifest Christ in our character, relationships, service, fellowship, and the building up of His Body.`, icon: UsersIcon, image: HOME_IMAGES.worshipPhoto },
  { title: "Dispense Christ", text: `To dispense the all-inclusive Christ to believers for their experience, enjoyment, inheritance, and rest, that Christ may become their inward reality and be expressed through their living.`, icon: SunIcon, image: HOME_IMAGES.hero }
];

export default function JourneySteps() {
  return (
    <div className="pr-container">
      <h2 className="pr-section-title" style={{ textAlign: "center" }}>The Pray-Read Journey</h2>
      <div className="pr-cards-3" style={{ marginTop: 40 }}>
        {STEPS.map((step, index) => (
          <ImageCard key={step.title} image={step.image}>
            <span className="pr-card-icon">
              <step.icon className="h-5 w-5" />
            </span>
            <p className="pr-card-number">{String(index + 1).padStart(2, "0")}</p>
            <h3 className="pr-card-subtitle" style={{ marginTop: 8 }}>{step.title}</h3>
            <p className="pr-card-text">{step.text}</p>
          </ImageCard>
        ))}
      </div>
    </div>
  );
}