import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { HOME_IMAGES } from "@/lib/homeImages";
import { ABOUT_CSS } from "@/lib/aboutCss";
import * as C from "@/lib/aboutContent";
import AboutCard from "@/components/about/AboutCard";
import AboutSplit from "@/components/about/AboutSplit";
import { BookOpenIcon, HandHeartIcon, HeartHandshakeIcon, HeartIcon, SparklesIcon, SunIcon, UsersIcon } from "lucide-react";

// Photos rotate across the cards so neighbouring cards never share a background.
const CARD_IMAGES = [
  HOME_IMAGES.sunrise,
  HOME_IMAGES.olive,
  HOME_IMAGES.praying,
  HOME_IMAGES.worship,
  HOME_IMAGES.worshipPhoto,
  HOME_IMAGES.hero
];
const pick = (index) => CARD_IMAGES[index % CARD_IMAGES.length];
const pad = (n) => String(n).padStart(2, "0");

const SERVE_ICONS = [HeartHandshakeIcon, BookOpenIcon, HandHeartIcon, UsersIcon, UsersIcon, HeartIcon, BookOpenIcon, SparklesIcon];
const OUTCOME_ICONS = [HandHeartIcon, BookOpenIcon, SunIcon, SparklesIcon, HeartIcon, HeartHandshakeIcon, UsersIcon, UsersIcon, SunIcon];

export default function About() {
  return (
    <div className="pr-about">
      <style>{ABOUT_CSS}</style>

      {/* Hero */}
      <section className="ab-hero">
        <div className="ab-hero-bg" style={{ backgroundImage: `url(${HOME_IMAGES.hero})` }} />
        <div className="ab-hero-scrim" />
        <div className="ab-wrap">
          <h1 className="ab-title">{C.ABOUT_HERO.title}</h1>
          <p className="ab-subtitle">{C.ABOUT_HERO.tagline}</p>
          <p className="ab-lead">{C.ABOUT_HERO.intro}</p>
        </div>
      </section>

      {/* 1. Who We Are */}
      <section className="ab-section ab-ivory">
        <div className="ab-wrap">
          <AboutSplit image={HOME_IMAGES.praying}>
            <span className="ab-eyebrow">1</span>
            <h2 className="ab-title">Who We Are</h2>
            <div className="ab-prose" style={{ marginTop: 22 }}>
              {C.WHO_WE_ARE.paragraphs.map((text) => (
                <p key={text}>{text}</p>
              ))}
              <p>{C.WHO_WE_ARE.guidingLead}</p>
              <p className="ab-note">{C.WHO_WE_ARE.guidingStatement}</p>
              <p>{C.WHO_WE_ARE.closing}</p>
            </div>
          </AboutSplit>
        </div>
      </section>

      {/* 2. Our Foundational Conviction */}
      <section className="ab-section ab-navy">
        <div className="ab-wrap">
          <span className="ab-eyebrow">2</span>
          <h2 className="ab-title">Our Foundational Conviction</h2>
          <p className="ab-subtitle">{C.CONVICTION.subtitle}</p>
          <div className="ab-prose" style={{ marginTop: 22 }}>
            {C.CONVICTION.intro.map((text) => (
              <p key={text}>{text}</p>
            ))}
            <blockquote className="ab-quote">
              <span className="ab-quote-ref">{C.CONVICTION.quoteRef}</span>
              {C.CONVICTION.quoteText}
            </blockquote>
            {C.CONVICTION.afterQuote.map((text) => (
              <p key={text}>{text}</p>
            ))}
            <p>{C.CONVICTION.beliefsLead}</p>
          </div>
          <div className="ab-grid ab-g4">
            {C.CONVICTION.beliefs.map((text, index) => (
              <AboutCard key={text} label={pad(index + 1)} paragraphs={[text]} image={pick(index)} />
            ))}
          </div>
          <div className="ab-prose" style={{ marginTop: 36 }}>
            <p>{C.CONVICTION.closing}</p>
          </div>
        </div>
      </section>

      {/* 3, 4, 5. Vision, Mission, Purpose */}
      <section className="ab-section ab-ivory">
        <div className="ab-wrap">
          <span className="ab-eyebrow">3 · 4 · 5</span>
          <h2 className="ab-title">Our Governing Vision, Mission and Purpose</h2>
          <div className="ab-grid ab-g3t">
            <AboutCard
              image={pick(0)}
              label="Our Governing Vision"
              paragraphs={[C.VISION_STATEMENT]}
              link={createPageUrl("Home")}
              linkLabel="Read more on Home"
            />
            <AboutCard
              image={pick(1)}
              label="Our Mission"
              paragraphs={[C.MISSION_STATEMENT]}
              link={createPageUrl("Home")}
              linkLabel="Read more on Home"
            />
            <AboutCard
              image={pick(2)}
              label="Our Purpose"
              paragraphs={[C.PURPOSE_STATEMENT]}
              link={createPageUrl("Home")}
              linkLabel="Read more on Home"
            />
          </div>

          <div className="ab-prose" style={{ marginTop: 48 }}>
            <h3 style={{ fontFamily: "Georgia, serif", fontSize: 22, margin: "0 0 12px" }}>Our Governing Vision</h3>
            {C.VISION_PARAGRAPHS.map((text) => (
              <p key={text}>{text}</p>
            ))}

            <h3 style={{ fontFamily: "Georgia, serif", fontSize: 22, margin: "32px 0 12px" }}>Our Mission</h3>
            {C.MISSION.intro.map((text) => (
              <p key={text}>{text}</p>
            ))}
            <p>{C.MISSION.lead}</p>
            <ul className="ab-list">
              {C.MISSION.items.map((text) => (
                <li key={text}>{text}</li>
              ))}
            </ul>
            {C.MISSION.closing.map((text) => (
              <p key={text}>{text}</p>
            ))}

            <h3 style={{ fontFamily: "Georgia, serif", fontSize: 22, margin: "32px 0 12px" }}>Our Purpose</h3>
            {C.PURPOSE.intro.map((text) => (
              <p key={text}>{text}</p>
            ))}
            <p>{C.PURPOSE.lead}</p>
            <ul className="ab-list">
              {C.PURPOSE.items.map((text) => (
                <li key={text}>{text}</li>
              ))}
            </ul>
            {C.PURPOSE.closing.map((text) => (
              <p key={text}>{text}</p>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Our Objectives */}
      <section className="ab-section ab-navy">
        <div className="ab-wrap">
          <span className="ab-eyebrow">6</span>
          <h2 className="ab-title">Our Objectives</h2>
          <p className="ab-lead">{C.OBJECTIVES_INTRO}</p>
          <div className="ab-grid ab-g3">
            {C.OBJECTIVES.map((objective, index) => (
              <AboutCard
                key={objective.title}
                label={`Objective ${index + 1}`}
                title={objective.title}
                paragraphs={[objective.text]}
                image={pick(index)}
                wide={index === 9}
                className={index === 8 ? "ab-card-span-tablet" : ""}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 7. Our Method */}
      <section className="ab-section ab-ivory">
        <div className="ab-wrap">
          <span className="ab-eyebrow">7</span>
          <h2 className="ab-title">Our Method: The Pray-Read Approach</h2>
          <p className="ab-subtitle">{C.METHOD.subtitle}</p>
          <div className="ab-prose" style={{ marginTop: 22 }}>
            {C.METHOD.intro.map((text) => (
              <p key={text}>{text}</p>
            ))}
            <p>{C.METHOD.lead}</p>
          </div>
          <div className="ab-grid ab-g3">
            {C.METHOD.steps.map((step, index) => (
              <AboutCard
                key={step.title}
                label={`Step ${index + 1}`}
                title={step.title}
                paragraphs={[step.text]}
                image={pick(index + 2)}
              />
            ))}
          </div>
          <div className="ab-prose" style={{ marginTop: 36 }}>
            <p className="ab-note">{C.METHOD.closing}</p>
          </div>
          <div className="ab-actions">
            <Link to={createPageUrl("Home")} className="ab-btn ab-btn-gold">
              View the Pray-Read Journey →
            </Link>
          </div>
        </div>
      </section>

      {/* 8. Our Bible Prayer Project Structure */}
      <section className="ab-section ab-navy">
        <div className="ab-wrap">
          <span className="ab-eyebrow">8</span>
          <h2 className="ab-title">Our Bible Prayer Project Structure</h2>
          <div className="ab-prose" style={{ marginTop: 22 }}>
            {C.STRUCTURE.intro.map((text) => (
              <p key={text}>{text}</p>
            ))}
            <p>{C.STRUCTURE.lead}</p>
          </div>
          <div className="ab-grid ab-g3">
            {C.STRUCTURE.parts.map((part, index) => (
              <AboutCard
                key={part.title}
                title={part.title}
                paragraphs={part.texts}
                image={pick(index + 1)}
                wide={index === 6}
              />
            ))}
          </div>
          <div className="ab-prose" style={{ marginTop: 36 }}>
            <p>{C.STRUCTURE.closing}</p>
          </div>
          <div className="ab-actions">
            <Link to={createPageUrl("BibleReader")} className="ab-btn ab-btn-gold">
              Explore the Bible Prayer Project →
            </Link>
          </div>
        </div>
      </section>

      {/* 9. Our Theological Emphasis */}
      <section className="ab-section ab-ivory">
        <div className="ab-wrap">
          <span className="ab-eyebrow">9</span>
          <h2 className="ab-title">Our Theological Emphasis</h2>
          <div className="ab-prose" style={{ marginTop: 22 }}>
            {C.THEOLOGY.intro.map((text) => (
              <p key={text}>{text}</p>
            ))}
            <p>{C.THEOLOGY.lead}</p>
          </div>
          <div className="ab-grid ab-g3">
            {C.THEOLOGY.items.map((item, index) => (
              <AboutCard key={item.title} title={item.title} paragraphs={[item.text]} image={pick(index + 3)} />
            ))}
          </div>
        </div>
      </section>

      {/* 10. Who Is Pray-Read Bible For? */}
      <section className="ab-section ab-navy">
        <div className="ab-wrap">
          <span className="ab-eyebrow">10</span>
          <h2 className="ab-title">Who Is Pray-Read Bible For?</h2>
          <div className="ab-prose" style={{ marginTop: 22 }}>
            {C.WHO_FOR.intro.map((text) => (
              <p key={text}>{text}</p>
            ))}
            <p>{C.WHO_FOR.lead}</p>
          </div>
          <div className="ab-grid ab-g4">
            {C.WHO_FOR.items.map((text, index) => (
              <AboutCard
                key={text}
                icon={SERVE_ICONS[index]}
                paragraphs={[text]}
                image={pick(index + 1)}
              />
            ))}
          </div>
          <div className="ab-actions">
            <Link to={createPageUrl("BibleReader")} className="ab-btn ab-btn-gold">
              Explore the Bible Prayer Project →
            </Link>
            <Link to={createPageUrl("Devotionals")} className="ab-btn ab-btn-line">
              Open Devotionals →
            </Link>
          </div>
        </div>
      </section>

      {/* 11. Our Desired Spiritual Outcome */}
      <section className="ab-section ab-ivory">
        <div className="ab-wrap">
          <span className="ab-eyebrow">11</span>
          <h2 className="ab-title">Our Desired Spiritual Outcome</h2>
          <div className="ab-prose" style={{ marginTop: 22 }}>
            {C.OUTCOME.intro.map((text) => (
              <p key={text}>{text}</p>
            ))}
            <p>{C.OUTCOME.lead}</p>
          </div>
          <div className="ab-grid ab-g3t">
            {C.OUTCOME.items.map((text, index) => (
              <AboutCard
                key={text}
                icon={OUTCOME_ICONS[index]}
                paragraphs={[text]}
                image={pick(index + 2)}
              />
            ))}
          </div>
          <div className="ab-prose" style={{ marginTop: 36 }}>
            <p>{C.OUTCOME.closing}</p>
          </div>
        </div>
      </section>

      {/* 12. Our Commitment */}
      <section className="ab-section ab-ivory">
        <div className="ab-wrap">
          <AboutSplit image={HOME_IMAGES.sunrise} reverse>
            <span className="ab-eyebrow">12</span>
            <h2 className="ab-title">Our Commitment</h2>
            <div className="ab-prose" style={{ marginTop: 22 }}>
              {C.COMMITMENT.map((text) => (
                <p key={text}>{text}</p>
              ))}
            </div>
          </AboutSplit>
        </div>
      </section>

      {/* 13. Our Declaration */}
      <section className="ab-banner">
        <div className="ab-hero-bg" style={{ backgroundImage: `url(${HOME_IMAGES.worship})` }} />
        <div className="ab-hero-scrim" />
        <div className="ab-wrap">
          <span className="ab-eyebrow">13</span>
          <h2 className="ab-title">Our Declaration</h2>
          <div className="ab-prose" style={{ marginTop: 22 }}>
            {C.DECLARATION.lines.map((text) => (
              <p key={text}>{text}</p>
            ))}
          </div>
          <p className="ab-declare">{C.DECLARATION.summary}</p>
          <p className="ab-declare">{C.DECLARATION.heart}</p>
          <p className="ab-declare">{C.DECLARATION.welcome}</p>
          <div className="ab-actions">
            <Link to={createPageUrl("BibleReader")} className="ab-btn ab-btn-gold">
              Begin Your Pray-Read Journey →
            </Link>
            <Link to={createPageUrl("Home")} className="ab-btn ab-btn-line">
              Back to Home
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}