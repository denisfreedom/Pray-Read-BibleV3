// Styles for the About Us page. Every selector is scoped under .pr-about so
// nothing leaks into other pages. Palette matches the Home page:
// navy #111B30, navy-light #1B2942, gold #B99A58, ivory #F6F1E7.

export const ABOUT_CSS = `
.pr-about { background: #f6f1e7; color: #111b30; overflow-x: hidden; }
.pr-about .ab-wrap { width: min(1180px, calc(100% - 48px)); margin-inline: auto; }
.pr-about .ab-section { position: relative; padding: 88px 0; }
.pr-about .ab-navy { background: #111b30; color: #f6f1e7; }
.pr-about .ab-ivory { background: #f6f1e7; color: #111b30; }

.pr-about .ab-eyebrow { display: inline-block; color: #b99a58; font-size: 12px; font-weight: 700; letter-spacing: 0.22em; text-transform: uppercase; }
.pr-about .ab-ivory .ab-eyebrow { color: #8a6d2e; }
.pr-about .ab-title { margin: 12px 0 0; font-family: Georgia, "Times New Roman", serif; font-size: clamp(30px, 4vw, 44px); line-height: 1.15; font-weight: 600; color: inherit; }
.pr-about .ab-subtitle { margin: 10px 0 0; font-family: Georgia, serif; font-style: italic; font-size: clamp(18px, 2vw, 22px); color: #b99a58; }
.pr-about .ab-ivory .ab-subtitle { color: #8a6d2e; }
.pr-about .ab-lead { margin: 20px 0 0; font-size: 18px; line-height: 1.75; max-width: 760px; }
.pr-about .ab-head { max-width: 780px; }

.pr-about .ab-prose { max-width: 780px; }
.pr-about .ab-prose p { margin: 0 0 16px; font-size: 16.5px; line-height: 1.85; }
.pr-about .ab-prose .ab-note { font-family: Georgia, serif; font-size: 19px; font-weight: 600; color: #b99a58; }
.pr-about .ab-ivory .ab-prose .ab-note { color: #8a6d2e; }
.pr-about .ab-quote { margin: 22px 0; padding: 4px 0 4px 20px; border-left: 3px solid #b99a58; font-family: Georgia, serif; font-style: italic; }
.pr-about .ab-quote-ref { display: block; margin-bottom: 6px; font-style: normal; font-weight: 700; color: #b99a58; letter-spacing: 0.08em; }
.pr-about .ab-ivory .ab-quote-ref { color: #8a6d2e; }

.pr-about .ab-list { list-style: none; margin: 14px 0 20px; padding: 0; }
.pr-about .ab-list li { position: relative; margin: 10px 0; padding-left: 24px; line-height: 1.7; }
.pr-about .ab-list li::before { content: ""; position: absolute; left: 0; top: 0.62em; width: 8px; height: 8px; border-radius: 50%; background: #b99a58; }

.pr-about .ab-split { display: grid; grid-template-columns: 1fr; gap: 40px; align-items: stretch; }
.pr-about .ab-split-img { position: relative; min-height: 360px; border-radius: 24px; background-size: cover; background-position: center; box-shadow: 0 30px 60px -30px rgba(17, 27, 48, 0.6); overflow: hidden; }
.pr-about .ab-split-text { align-self: center; }
@media (min-width: 900px) {
  .pr-about .ab-split { grid-template-columns: 1fr 1fr; gap: 64px; }
  .pr-about .ab-split-img { min-height: 520px; }
  .pr-about .ab-split-reverse .ab-split-img { order: 2; }
}

.pr-about .ab-grid { display: grid; grid-template-columns: 1fr; gap: 22px; margin-top: 44px; }
@media (min-width: 640px) { .pr-about .ab-g3, .pr-about .ab-g4 { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 760px) { .pr-about .ab-g3t { grid-template-columns: repeat(3, 1fr); } }
@media (min-width: 1024px) {
  .pr-about .ab-g3 { grid-template-columns: repeat(3, 1fr); }
  .pr-about .ab-g4 { grid-template-columns: repeat(4, 1fr); }
  .pr-about .ab-g3t { grid-template-columns: repeat(3, 1fr); }
}
.pr-about .ab-card-wide { grid-column: 1 / -1; }
@media (min-width: 640px) and (max-width: 1023px) { .pr-about .ab-card-span-tablet { grid-column: 1 / -1; } }

.pr-about .ab-card { position: relative; display: flex; flex-direction: column; min-height: 240px; border-radius: 22px; overflow: hidden; color: #f6f1e7; box-shadow: 0 20px 44px -22px rgba(17, 27, 48, 0.7); transition: transform 0.35s ease, box-shadow 0.35s ease; }
.pr-about .ab-card:hover { transform: translateY(-5px); box-shadow: 0 28px 56px -22px rgba(17, 27, 48, 0.8); }
.pr-about .ab-card-bg { position: absolute; inset: 0; background-size: cover; background-position: center; transition: transform 0.6s ease; }
.pr-about .ab-card:hover .ab-card-bg { transform: scale(1.05); }
.pr-about .ab-card-scrim { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(17, 27, 48, 0.76) 0%, rgba(17, 27, 48, 0.94) 100%); }
.pr-about .ab-card-body { position: relative; z-index: 1; display: flex; flex-direction: column; flex: 1; padding: 30px 28px; }
.pr-about .ab-num { color: #b99a58; font-size: 13px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; }
.pr-about .ab-icon { width: 26px; height: 26px; color: #b99a58; }
.pr-about .ab-card-title { margin: 10px 0 0; font-family: Georgia, serif; font-size: 20px; line-height: 1.3; font-weight: 600; color: #f6f1e7; }
.pr-about .ab-card-text { margin: 12px 0 0; font-size: 15px; line-height: 1.7; color: rgba(246, 241, 231, 0.93); }
.pr-about .ab-card-link { margin-top: auto; padding-top: 18px; color: #b99a58; font-size: 14px; font-weight: 700; text-decoration: none; }
.pr-about .ab-card-link:hover { text-decoration: underline; }

.pr-about .ab-hero { position: relative; overflow: hidden; background: #111b30; color: #f6f1e7; padding: 120px 0 104px; text-align: center; }
.pr-about .ab-hero-bg { position: absolute; inset: 0; background-size: cover; background-position: center; }
.pr-about .ab-hero-scrim { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(17, 27, 48, 0.74) 0%, rgba(17, 27, 48, 0.95) 100%); }
.pr-about .ab-hero .ab-wrap, .pr-about .ab-banner .ab-wrap { position: relative; z-index: 1; }
.pr-about .ab-hero .ab-title { font-size: clamp(34px, 5vw, 60px); }
.pr-about .ab-hero .ab-lead { margin-inline: auto; }

.pr-about .ab-banner { position: relative; overflow: hidden; background: #111b30; color: #f6f1e7; padding: 104px 0; text-align: center; }
.pr-about .ab-banner .ab-prose { margin-inline: auto; }
.pr-about .ab-banner .ab-prose p { text-align: center; }
.pr-about .ab-declare { margin: 28px 0 0; font-family: Georgia, serif; font-size: clamp(18px, 2vw, 22px); line-height: 1.7; }

.pr-about .ab-actions { display: flex; flex-wrap: wrap; gap: 14px; margin-top: 32px; }
.pr-about .ab-hero .ab-actions, .pr-about .ab-banner .ab-actions { justify-content: center; }
.pr-about .ab-btn { display: inline-flex; align-items: center; gap: 8px; padding: 14px 26px; border-radius: 999px; border: 1px solid transparent; font-size: 15px; font-weight: 700; text-decoration: none; transition: transform 0.2s ease, background 0.2s ease; }
.pr-about .ab-btn:hover { transform: translateY(-2px); }
.pr-about .ab-btn-gold { background: #b99a58; color: #111b30; }
.pr-about .ab-btn-gold:hover { background: #c9aa6c; }
.pr-about .ab-btn-line { border-color: rgba(246, 241, 231, 0.6); color: #f6f1e7; }
.pr-about .ab-btn-line:hover { background: rgba(246, 241, 231, 0.1); }

.pr-about .ab-divider { height: 1px; margin: 36px 0 0; background: rgba(185, 154, 88, 0.45); border: 0; }

@media (max-width: 768px) {
  .pr-about .ab-section { padding: 60px 0; }
  .pr-about .ab-hero { padding: 88px 0 72px; }
  .pr-about .ab-banner { padding: 72px 0; }
}
@media (max-width: 480px) {
  .pr-about .ab-wrap { width: calc(100% - 28px); }
  .pr-about .ab-section { padding: 44px 0; }
  .pr-about .ab-card-body { padding: 24px 22px; }
  .pr-about .ab-card { min-height: 0; }
  .pr-about .ab-btn { width: 100%; justify-content: center; }
}
`;