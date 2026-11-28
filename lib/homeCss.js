// Premium Homepage Design System for the Home page.
// Scoped under .pr-home so it does not affect any other page.
// Injected by pages/Home.jsx with a <style> tag, the same way lib/brandCss.js is delivered.

export const HOME_CSS = `
  .pr-home {
    --pr-navy: #111b30;
    --pr-navy-light: #1b2942;
    --pr-gold: #b99a58;
    --pr-ivory: #f6f1e7;
    --pr-white: #ffffff;
    --pr-muted: #777d89;

    width: 100%;
    overflow: hidden;
    background: var(--pr-ivory);
    color: var(--pr-navy);
  }

  .pr-home .pr-container {
    width: min(1180px, calc(100% - 48px));
    margin-inline: auto;
  }

  .pr-home .pr-section {
    position: relative;
    padding: 88px 0;
  }

  /* Section backgrounds: navy, ivory, navy, ivory, so the page is never plain white. */
  .pr-home .pr-home-hero { position: relative; width: 100%; background: var(--pr-navy); }
  .pr-home .pr-scripture-section { background: var(--pr-navy-light); }
  .pr-home .pr-home-intro { background: var(--pr-ivory); }
  .pr-home .pr-journey-section { background: var(--pr-navy); }
  .pr-home .pr-vision-section { background: var(--pr-ivory); }
  .pr-home .pr-experience-section { background: var(--pr-navy-light); }
  .pr-home .pr-ways-section { background: var(--pr-navy); }
  .pr-home .pr-explore-section { background: var(--pr-ivory); }
  .pr-home .pr-closing-section { background: var(--pr-navy); padding: 56px 0; }

  /* Light text on the dark sections */
  .pr-home .pr-scripture-section,
  .pr-home .pr-journey-section,
  .pr-home .pr-experience-section,
  .pr-home .pr-ways-section,
  .pr-home .pr-closing-section {
    color: #faf8f2;
  }

  .pr-home .pr-scripture-section .pr-section-title,
  .pr-home .pr-journey-section .pr-section-title,
  .pr-home .pr-experience-section .pr-section-title,
  .pr-home .pr-ways-section .pr-section-title,
  .pr-home .pr-ways-section .pr-section-lead {
    color: #faf8f2;
  }

  /* Image cards: photo, dark scrim, light text */
  .pr-home .pr-imgcard {
    position: relative;
    isolation: isolate;
    display: flex;
    flex-direction: column;
    min-height: 240px;
    border-radius: 20px;
    overflow: hidden;
    color: #faf8f2;
    text-decoration: none;
    box-shadow: 0 18px 40px -20px rgba(8, 14, 28, 0.7);
    transition: transform 0.35s ease, box-shadow 0.35s ease;
  }

  .pr-home .pr-imgcard:hover {
    transform: translateY(-4px);
    box-shadow: 0 26px 50px -22px rgba(8, 14, 28, 0.8);
  }

  .pr-home .pr-imgcard-bg {
    position: absolute;
    inset: 0;
    z-index: -2;
    background-size: cover;
    background-position: center;
    transition: transform 0.6s ease;
  }

  .pr-home .pr-imgcard:hover .pr-imgcard-bg { transform: scale(1.04); }

  .pr-home .pr-imgcard-scrim {
    position: absolute;
    inset: 0;
    z-index: -1;
    background: linear-gradient(180deg, rgba(17, 27, 48, 0.62) 0%, rgba(17, 27, 48, 0.9) 100%);
  }

  .pr-home .pr-imgcard-body {
    position: relative;
    display: flex;
    flex: 1;
    flex-direction: column;
    padding: 28px;
  }

  .pr-home .pr-imgcard h2,
  .pr-home .pr-imgcard h3 { color: #faf8f2; margin: 0; }

  .pr-home .pr-imgcard p { color: rgba(250, 248, 242, 0.92); margin: 0; line-height: 1.7; }

  .pr-home .pr-imgcard blockquote { color: #faf8f2; margin: 0; }

  .pr-home .pr-imgcard .pr-card-title {
    font-size: clamp(1.4rem, 2.4vw, 1.8rem);
    font-weight: 700;
    line-height: 1.25;
  }

  .pr-home .pr-imgcard .pr-card-subtitle { font-size: 1.15rem; font-weight: 800; line-height: 1.35; }

  .pr-home .pr-imgcard .pr-card-label {
    color: var(--pr-gold);
    font-size: 0.78rem;
    font-weight: 800;
    letter-spacing: 0.16em;
    text-transform: uppercase;
  }

  .pr-home .pr-imgcard .pr-card-number {
    color: var(--pr-gold);
    font-size: 1.5rem;
    font-weight: 700;
    line-height: 1;
    margin-top: 16px;
  }

  .pr-home .pr-imgcard .pr-card-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 46px;
    height: 46px;
    border-radius: 14px;
    color: var(--pr-gold);
    background: rgba(185, 154, 88, 0.18);
    border: 1px solid rgba(185, 154, 88, 0.4);
  }

  .pr-home .pr-imgcard .pr-card-text { margin-top: 10px; font-size: 0.95rem; }

  .pr-home .pr-imgcard .pr-card-action {
    margin-top: auto;
    padding-top: 18px;
    color: var(--pr-gold);
    font-size: 0.9rem;
    font-weight: 700;
  }

  .pr-home .pr-imgcard .pr-verse-text {
    margin-top: 18px;
    font-size: clamp(1.25rem, 2.4vw, 1.6rem);
    line-height: 1.6;
  }

  .pr-home .pr-imgcard .pr-verse-ref {
    margin-top: 14px;
    color: var(--pr-gold);
    font-weight: 800;
  }

  .pr-home .pr-imgcard .pr-card-actions {
    margin-top: auto;
    padding-top: 22px;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  .pr-home .pr-verse-card,
  .pr-home .pr-devotional-card { min-height: 460px; }

  .pr-home .pr-cards-3 .pr-imgcard { min-height: 260px; }

  /* Verse of the Day + Today's Devotional */
  .pr-home .pr-duo-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 24px;
    align-items: stretch;
  }

  .pr-home .pr-duo-grid > * { min-width: 0; }

  /* What is Pray-Read Bible? */
  .pr-home .pr-intro-grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.05fr);
    gap: 56px;
    align-items: center;
  }

  .pr-home .pr-intro-image {
    min-height: 520px;
    border-radius: 24px;
    background-size: cover;
    background-position: center;
    box-shadow: 0 30px 60px -30px rgba(17, 27, 48, 0.5);
  }

  .pr-home .pr-intro-text { text-align: start; }
  .pr-home .pr-intro-text .pr-section-title { text-align: start; }

  /* Card grids */
  .pr-home .pr-cards-3 {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 22px;
  }

  .pr-home .pr-cards-vision {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 22px;
  }

  /* Explore band */
  .pr-home .pr-explore-band {
    position: relative;
    isolation: isolate;
    overflow: hidden;
    background-size: cover;
    background-position: center;
    padding: 120px 0;
    color: #faf8f2;
    text-align: center;
  }

  .pr-home .pr-explore-band::before {
    content: "";
    position: absolute;
    inset: 0;
    z-index: -1;
    background: linear-gradient(180deg, rgba(17, 27, 48, 0.78), rgba(17, 27, 48, 0.92));
  }

  .pr-home .pr-explore-band .pr-section-title { color: #faf8f2; }

  /* Closing */
  .pr-home .pr-closing-panel { box-shadow: 0 30px 60px -36px rgba(0, 0, 0, 0.6); }

  .pr-home .pr-section > .pr-container > * { width: 100%; }

  @media (max-width: 1023px) {
    .pr-home .pr-cards-3 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  }

  @media (max-width: 860px) {
    .pr-home .pr-duo-grid { grid-template-columns: minmax(0, 1fr); }
    .pr-home .pr-intro-grid { grid-template-columns: minmax(0, 1fr); gap: 32px; }
    .pr-home .pr-intro-image { min-height: 300px; }
  }

  @media (max-width: 640px) {
    .pr-home .pr-cards-3,
    .pr-home .pr-cards-vision { grid-template-columns: minmax(0, 1fr); }
    .pr-home .pr-explore-band { padding: 80px 0; }
  }

  @media (max-width: 768px) {
    .pr-home .pr-container { width: min(100% - 32px, 600px); }
    .pr-home .pr-section { padding: 58px 0; }
    .pr-home .pr-container.pr-duo-container { width: min(100% - 32px, 600px); }
  }

  @media (min-width: 769px) {
    .pr-home .pr-container { width: min(1180px, calc(100% - 48px)); }
  }

  @media (max-width: 480px) {
    .pr-home .pr-container { width: calc(100% - 28px); }
    .pr-home .pr-section { padding: 44px 0; }
    .pr-home .pr-imgcard-body { padding: 24px; }
    .pr-home .pr-verse-card,
    .pr-home .pr-devotional-card { min-height: 0; }
  }
`;