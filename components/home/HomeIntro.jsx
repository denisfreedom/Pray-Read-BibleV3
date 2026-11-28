import React from "react";
import { HOME_IMAGES } from "@/lib/homeImages";

const PARAGRAPHS = [
  `Pray-Read Bible is built upon the conviction that the Scriptures are not merely a source of religious information, historical knowledge, or doctrinal instruction. The Word of God is God's living speaking, revealing Christ, imparting life, renewing the mind, transforming the believer, and building up the Body of Christ.`,
  `Through the practice of praying the Scriptures, we learn to turn God's Word into our personal and corporate fellowship with Him. We do not merely read what God has spoken; we respond to His speaking in prayer, receive His Word by faith, allow the Spirit to make it real within us, and express Christ in our daily living.`
];

export default function HomeIntro() {
  return (
    <div className="pr-container pr-intro-grid">
      <div className="pr-intro-image" style={{ backgroundImage: `url(${HOME_IMAGES.praying})` }} />
      <div className="pr-intro-text">
        <h2 className="pr-section-title">What is Pray-Read Bible?</h2>
        {PARAGRAPHS.map((text) => (
          <p key={text.slice(0, 30)} className="pr-section-lead" style={{ margin: "18px 0 0" }}>
            {text}
          </p>
        ))}
      </div>
    </div>
  );
}