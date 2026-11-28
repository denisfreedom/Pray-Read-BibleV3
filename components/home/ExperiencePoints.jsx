import React from "react";
import ImageCard from "@/components/home/ImageCard";
import { HOME_IMAGES } from "@/lib/homeImages";

const POINTS = [
  {
    title: "Scripture-Based Prayer",
    text: `Learn to turn the Word of God into meaningful, Spirit-led prayers, allowing the Scriptures to become the language and substance of your fellowship with God.`,
    image: HOME_IMAGES.worship
  },
  {
    title: "Experiencing Christ through the Word",
    text: `Discover Christ in the Scriptures and learn to receive Him not merely as a biblical subject, but as the living Person who becomes your life and life supply.`,
    image: HOME_IMAGES.devotionalSquare
  },
  {
    title: "Spiritual Growth and Transformation",
    text: `Allow the Word to renew your mind, enlighten your understanding, strengthen your faith, and transform your inward being.`,
    image: HOME_IMAGES.olive
  },
  {
    title: "Faith-Filled Living",
    text: `Learn to believe the Word, speak the Word, stand upon God's promises, and live according to the spiritual realities revealed in Scripture.`,
    image: HOME_IMAGES.sunrise
  },
  {
    title: "Corporate Building and Expression",
    text: `Grow beyond individual spiritual experience into the corporate expression of Christ, participating in the building up of the Body of Christ.`,
    image: HOME_IMAGES.praying
  },
  {
    title: "Expressing Christ in Daily Living",
    text: `Allow the Christ received through the Word to be expressed in your character, relationships, service, fellowship, and daily living.`,
    image: HOME_IMAGES.hero
  }
];

export default function ExperiencePoints() {
  return (
    <div className="pr-container">
      <h2 className="pr-section-title" style={{ textAlign: "center" }}>What You Will Experience</h2>
      <div className="pr-cards-3" style={{ marginTop: 40 }}>
        {POINTS.map((point, index) => (
          <ImageCard key={point.title} image={point.image}>
            <span className="pr-serif pr-card-number">{index + 1}</span>
            <h3 className="pr-card-subtitle" style={{ marginTop: 12 }}>{point.title}</h3>
            <p className="pr-card-text">{point.text}</p>
          </ImageCard>
        ))}
      </div>
    </div>
  );
}