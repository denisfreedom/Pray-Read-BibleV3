import React from "react";
import { createPageUrl } from "@/utils";
import ImageCard from "@/components/home/ImageCard";
import { HOME_IMAGES } from "@/lib/homeImages";

const CARDS = [
  {
    title: "OUR VISION",
    text: `To experience Christ through the subjective reality of the Word and the Spirit.`,
    image: HOME_IMAGES.hero
  },
  {
    title: "OUR MISSION",
    text: `To minister Christ as life and life supply through Scripture-based prayer and the ministry of the Word, for the spiritual growth, transformation, and building up of the Body of Christ.`,
    image: HOME_IMAGES.olive
  },
  {
    title: "OUR PURPOSE",
    text: `To dispense the all-inclusive Christ to believers for their experience, enjoyment, inheritance, and rest, that Christ may become their inward reality and be expressed through their living.`,
    image: HOME_IMAGES.sunrise
  }
];

export default function VisionCards() {
  return (
    <div className="pr-container">
      <div className="pr-cards-vision">
        {CARDS.map((card) => (
          <ImageCard key={card.title} image={card.image} to={createPageUrl("About")}>
            <h3 className="pr-card-label">{card.title}</h3>
            <p className="pr-serif pr-card-text" style={{ fontSize: "1.05rem", marginTop: 14 }}>
              {card.text}
            </p>
            <span className="pr-card-action">Read more →</span>
          </ImageCard>
        ))}
      </div>
    </div>
  );
}