// The Pray-Read design system, expressed once as CSS so every page uses the
// same ivory / emerald / gold tokens. Values are exposed as CSS variables so
// the admin theme editor can update them live.

export const BRAND_CSS = `
  :root {
    --pr-ivory: #faf8f2;
    --pr-ivory-soft: #f8f6ef;
    --pr-emerald: #1d4035;
    --pr-emerald-deep: #17372f;
    --pr-gold: #e9c981;
    --pr-gold-btn: #e7c873;
    --pr-gold-deep: #a9852e;
    --pr-heading: #1c382e;
    --pr-body: #5d6d5d;
    --pr-border: #e8e7de;
    --pr-shadow: 0 12px 35px -30px rgba(31, 57, 46, 0.5);
  }

  * { box-sizing: border-box; }

  html, body {
    margin: 0;
    padding: 0;
    background: var(--pr-ivory);
    color: var(--pr-body);
  }

  body {
    font-family: "Inter", "Segoe UI", system-ui, -apple-system, sans-serif;
    -webkit-font-smoothing: antialiased;
  }

  .pr-page {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background: var(--pr-ivory);
    color: var(--pr-body);
  }

  .pr-main { flex: 1 1 auto; }

  .pr-container {
    width: 100%;
    max-width: 1180px;
    margin: 0 auto;
    padding: 0 20px;
  }

  .pr-serif { font-family: Georgia, "Times New Roman", "Fraunces", serif; }
  .pr-heading { color: var(--pr-heading); }
  .pr-muted { color: var(--pr-body); }
  .pr-gold-text { color: var(--pr-gold-deep); }

  .pr-header {
    position: sticky;
    top: 0;
    z-index: 40;
    background: rgba(250, 248, 242, 0.94);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid var(--pr-border);
  }

  .pr-header-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    min-height: 68px;
    padding-top: 10px;
    padding-bottom: 10px;
  }

  .pr-brand { display: inline-flex; align-items: center; gap: 10px; text-decoration: none; }

  .pr-brand-tile {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 12px;
    background: #ffffff;
    border: 1px solid var(--pr-gold);
    overflow: hidden;
    flex-shrink: 0;
  }

  .pr-brand-tile-sm { width: 34px; height: 34px; border-radius: 10px; }

  .pr-brand-logo { width: 100%; height: 100%; object-fit: cover; }

  .pr-wordmark { font-weight: 700; font-size: 1.05rem; letter-spacing: -0.01em; }
  .pr-wordmark-dark { color: var(--pr-heading); }
  .pr-wordmark-light { color: #ffffff; }
  .pr-wordmark-gold { color: var(--pr-gold-deep); }

  .pr-nav-desktop { display: none; gap: 2px; flex-wrap: nowrap; }

  .pr-nav-link {
    padding: 7px 9px;
    border-radius: 999px;
    text-decoration: none;
    color: var(--pr-body);
    font-size: 0.82rem;
    font-weight: 600;
    white-space: nowrap;
  }

  .pr-nav-link:hover { background: var(--pr-ivory-soft); color: var(--pr-heading); }
  .pr-nav-link-active { background: var(--pr-emerald); color: #ffffff; }

  .pr-header-actions { display: flex; align-items: center; gap: 8px; }
  .pr-header-user { display: none; align-items: center; gap: 8px; }

  .pr-user-name {
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--pr-heading);
    max-width: 140px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .pr-icon-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 999px;
    border: 1px solid var(--pr-border);
    background: #ffffff;
    color: var(--pr-emerald);
    cursor: pointer;
  }

  .pr-menu-toggle { display: inline-flex; }

  .pr-offline-badge {
    display: none;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    border-radius: 999px;
    background: rgba(169, 133, 46, 0.12);
    color: var(--pr-gold-deep);
    font-size: 0.75rem;
    font-weight: 700;
  }

  .pr-mobile-nav {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: 10px 20px 18px;
    border-top: 1px solid var(--pr-border);
    background: var(--pr-ivory);
  }

  .pr-mobile-nav .pr-nav-link {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 14px;
    border-radius: 12px;
    font-size: 0.95rem;
  }

  .pr-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    min-height: 46px;
    padding: 0 22px;
    border-radius: 999px;
    border: 1px solid transparent;
    font-weight: 700;
    font-size: 0.9rem;
    text-decoration: none;
    cursor: pointer;
    transition: transform 0.15s ease, background 0.15s ease, color 0.15s ease;
  }

  .pr-btn:hover { transform: translateY(-1px); }
  .pr-btn:disabled { opacity: 0.55; cursor: not-allowed; transform: none; }
  .pr-btn-primary { background: var(--pr-emerald); color: #ffffff; }
  .pr-btn-primary:hover { background: var(--pr-emerald-deep); }
  .pr-btn-gold { background: var(--pr-gold-btn); color: #1a352c; }
  .pr-btn-gold:hover { background: var(--pr-gold); }
  .pr-btn-outline { background: transparent; color: var(--pr-emerald); border-color: var(--pr-emerald); }
  .pr-btn-outline:hover { background: rgba(29, 64, 53, 0.08); }
  .pr-btn-light-outline { background: transparent; color: #ffffff; border-color: rgba(255, 255, 255, 0.7); }
  .pr-btn-light-outline:hover { background: rgba(255, 255, 255, 0.12); }
  .pr-btn-danger { background: #9f2d2d; color: #ffffff; }
  .pr-btn-sm { min-height: 38px; padding: 0 16px; font-size: 0.82rem; }
  .pr-btn-block { width: 100%; }

  .pr-card {
    background: #ffffff;
    border: 1px solid var(--pr-border);
    border-radius: 24px;
    box-shadow: var(--pr-shadow);
  }

  .pr-card-pad { padding: 22px; }
  .pr-card-hover { transition: transform 0.18s ease, box-shadow 0.18s ease; }
  .pr-card-hover:hover { transform: translateY(-3px); box-shadow: 0 18px 40px -28px rgba(31, 57, 46, 0.55); }

  .pr-section { padding: 56px 0; }
  .pr-section-tight { padding: 32px 0; }

  .pr-eyebrow {
    display: inline-block;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    font-size: 0.7rem;
    font-weight: 800;
    color: var(--pr-gold-deep);
  }

  .pr-eyebrow-light { color: var(--pr-gold); }

  .pr-section-title {
    color: var(--pr-heading);
    font-size: 1.9rem;
    line-height: 1.2;
    font-weight: 800;
    letter-spacing: -0.02em;
    margin: 10px 0 0;
  }

  .pr-section-lead { margin: 12px 0 0; color: var(--pr-body); max-width: 60ch; }

  .pr-grid { display: grid; gap: 18px; }
  .pr-grid-2 { grid-template-columns: 1fr; }
  .pr-grid-3 { grid-template-columns: 1fr; }
  .pr-grid-4 { grid-template-columns: repeat(2, minmax(0, 1fr)); }

  .pr-chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    border-radius: 999px;
    background: var(--pr-ivory-soft);
    border: 1px solid var(--pr-border);
    color: var(--pr-heading);
    font-size: 0.75rem;
    font-weight: 700;
  }

  .pr-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 10px;
    border-radius: 999px;
    font-size: 0.7rem;
    font-weight: 800;
    letter-spacing: 0.04em;
  }

  .pr-badge-gold { background: var(--pr-gold-btn); color: #1a352c; }
  .pr-badge-emerald { background: var(--pr-emerald); color: #ffffff; }
  .pr-badge-outline { border: 1px solid var(--pr-border); color: var(--pr-heading); background: #fff; }

  .pr-input, .pr-textarea, .pr-select {
    width: 100%;
    min-height: 46px;
    padding: 11px 14px;
    border-radius: 14px;
    border: 1px solid var(--pr-border);
    background: #ffffff;
    color: var(--pr-heading);
    font-size: 0.92rem;
    font-family: inherit;
  }

  .pr-textarea { min-height: 110px; resize: vertical; line-height: 1.6; }

  .pr-input:focus, .pr-textarea:focus, .pr-select:focus {
    outline: 2px solid var(--pr-gold);
    outline-offset: 1px;
  }

  .pr-label { display: block; font-size: 0.78rem; font-weight: 700; color: var(--pr-heading); margin-bottom: 6px; }
  .pr-field { margin-bottom: 14px; }

  .pr-error {
    background: #fdf1f1;
    border: 1px solid #e8c4c4;
    color: #8f2727;
    border-radius: 12px;
    padding: 10px 14px;
    font-size: 0.85rem;
  }

  .pr-success {
    background: rgba(29, 64, 53, 0.08);
    border: 1px solid rgba(29, 64, 53, 0.25);
    color: var(--pr-heading);
    border-radius: 12px;
    padding: 10px 14px;
    font-size: 0.85rem;
  }

  .pr-hero { position: relative; background: var(--pr-emerald-deep); overflow: hidden; }
  .pr-hero-bg { position: absolute; inset: 0; background-size: cover; background-position: center; opacity: 0.55; }
  .pr-hero-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(100deg, rgba(23, 55, 47, 0.94) 0%, rgba(29, 64, 53, 0.72) 55%, rgba(23, 55, 47, 0.45) 100%);
  }

  .pr-hero-inner { position: relative; padding: 76px 0 84px; color: #ffffff; }
  .pr-hero-title {
    margin: 14px 0 0;
    font-size: 2.35rem;
    line-height: 1.12;
    font-weight: 800;
    letter-spacing: -0.025em;
    color: #ffffff;
    max-width: 16ch;
  }

  .pr-hero-text {
    margin: 18px 0 0;
    max-width: 56ch;
    color: rgba(255, 255, 255, 0.85);
    font-size: 1.02rem;
    line-height: 1.65;
  }

  .pr-hero-actions { margin-top: 28px; display: flex; flex-wrap: wrap; gap: 12px; }

  .pr-footer {
    background: var(--pr-emerald-deep);
    color: rgba(255, 255, 255, 0.78);
    margin-top: 64px;
  }

  .pr-footer-grid { display: grid; gap: 34px; padding-top: 48px; padding-bottom: 32px; }
  .pr-footer-brand { display: flex; align-items: center; gap: 10px; }
  .pr-footer-text { margin: 14px 0 18px; font-size: 0.88rem; line-height: 1.7; max-width: 40ch; }

  .pr-footer-heading {
    color: #ffffff;
    font-size: 0.78rem;
    text-transform: uppercase;
    letter-spacing: 0.18em;
    margin: 0 0 14px;
    font-weight: 800;
  }

  .pr-footer-list { list-style: none; margin: 0; padding: 0; display: grid; gap: 10px; }
  .pr-footer-list a { color: rgba(255, 255, 255, 0.78); text-decoration: none; font-size: 0.88rem; }
  .pr-footer-list a:hover { color: var(--pr-gold); }

  .pr-footer-bottom {
    border-top: 1px solid rgba(255, 255, 255, 0.12);
    padding-top: 18px;
    padding-bottom: 22px;
    display: flex;
    flex-direction: column;
    gap: 6px;
    font-size: 0.78rem;
  }

  .pr-footer-bottom p { margin: 0; }

  .pr-player {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 60;
    background: #0d1512;
    color: #ffffff;
    border-top: 1px solid rgba(233, 201, 129, 0.35);
  }

  .pr-player-inner { display: flex; align-items: center; gap: 14px; padding: 12px 20px; }
  .pr-player-track { flex: 1 1 auto; min-width: 0; }
  .pr-player-title { font-size: 0.85rem; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .pr-player-sub { font-size: 0.72rem; color: rgba(255, 255, 255, 0.6); }
  .pr-player-controls { display: flex; align-items: center; gap: 6px; }

  .pr-player-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 38px;
    height: 38px;
    border-radius: 999px;
    border: none;
    background: rgba(255, 255, 255, 0.08);
    color: #ffffff;
    cursor: pointer;
  }

  .pr-player-btn-main { background: var(--pr-gold-btn); color: #1a352c; width: 44px; height: 44px; }

  .pr-progress {
    position: relative;
    height: 5px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.16);
    margin-top: 8px;
    cursor: pointer;
  }

  .pr-progress-fill { position: absolute; left: 0; top: 0; bottom: 0; border-radius: 999px; background: var(--pr-gold); }

  .pr-player-sheet { background: #111a17; border-bottom: 1px solid rgba(233, 201, 129, 0.25); padding: 20px; }
  .pr-player-error { background: #7f1d1d; color: #ffffff; font-size: 0.8rem; padding: 8px 14px; border-radius: 10px; }

  .pr-tabs { display: flex; gap: 6px; overflow-x: auto; padding-bottom: 6px; border-bottom: 1px solid var(--pr-border); }

  .pr-tab {
    white-space: nowrap;
    padding: 10px 16px;
    border-radius: 999px;
    border: 1px solid transparent;
    background: transparent;
    color: var(--pr-body);
    font-weight: 700;
    font-size: 0.85rem;
    cursor: pointer;
  }

  .pr-tab-active { background: var(--pr-emerald); color: #ffffff; }

  .pr-modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(15, 32, 27, 0.62);
    z-index: 80;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding: 24px 16px;
    overflow-y: auto;
  }

  .pr-modal {
    width: 100%;
    max-width: 720px;
    background: #ffffff;
    border-radius: 24px;
    overflow: hidden;
    box-shadow: 0 30px 70px -40px rgba(15, 32, 27, 0.7);
  }

  .pr-modal-body { padding: 24px; }
  .pr-modal-close {
    position: absolute;
    top: 14px;
    right: 14px;
    width: 38px;
    height: 38px;
    border-radius: 999px;
    border: none;
    background: rgba(0, 0, 0, 0.45);
    color: #ffffff;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .pr-modal-head { position: relative; padding: 26px 24px; background: var(--pr-emerald); color: #ffffff; }

  .pr-verse {
    display: flex;
    gap: 12px;
    width: 100%;
    text-align: left;
    padding: 10px 12px;
    border-radius: 14px;
    border: 1px solid transparent;
    background: transparent;
    cursor: pointer;
  }

  .pr-verse:hover { background: var(--pr-ivory-soft); }
  .pr-verse-active { background: rgba(233, 201, 129, 0.16); border-color: var(--pr-gold); }

  .pr-verse-number {
    flex-shrink: 0;
    width: 30px;
    text-align: right;
    font-size: 0.72rem;
    font-weight: 800;
    color: var(--pr-gold-deep);
    padding-top: 6px;
  }

  .pr-verse-text {
    font-family: Georgia, "Times New Roman", serif;
    font-size: calc(1.06rem * var(--pr-verse-scale, 1));
    line-height: 1.85;
    color: var(--pr-heading);
  }

  .pr-stat {
    background: #ffffff;
    border: 1px solid var(--pr-border);
    border-radius: 20px;
    padding: 18px;
    box-shadow: var(--pr-shadow);
  }

  .pr-stat-value { font-size: 1.8rem; font-weight: 800; color: var(--pr-heading); line-height: 1.1; }
  .pr-stat-label { font-size: 0.76rem; text-transform: uppercase; letter-spacing: 0.12em; color: var(--pr-body); margin-top: 6px; }

  .pr-list-reset { list-style: none; margin: 0; padding: 0; }
  .pr-divider { height: 1px; background: var(--pr-border); border: none; margin: 22px 0; }
  .pr-scroll-x { overflow-x: auto; }

  .pr-floating {
    position: fixed;
    right: 16px;
    bottom: 92px;
    z-index: 55;
    width: min(340px, calc(100vw - 32px));
    background: #ffffff;
    border: 1px solid var(--pr-gold);
    border-radius: 20px;
    box-shadow: 0 24px 50px -30px rgba(15, 32, 27, 0.6);
    padding: 18px;
  }

  .pr-toast {
    position: fixed;
    left: 50%;
    transform: translateX(-50%);
    bottom: 104px;
    z-index: 90;
    background: var(--pr-emerald-deep);
    color: #ffffff;
    padding: 12px 20px;
    border-radius: 999px;
    font-size: 0.85rem;
    font-weight: 600;
    box-shadow: 0 18px 40px -24px rgba(15, 32, 27, 0.8);
  }

  .pr-empty {
    border: 1px dashed var(--pr-border);
    border-radius: 20px;
    background: #ffffff;
    padding: 40px 24px;
    text-align: center;
  }

  .pr-spinner {
    display: inline-block;
    width: 22px;
    height: 22px;
    border-radius: 999px;
    border: 2px solid var(--pr-gold);
    border-top-color: transparent;
    animation: pr-spin 0.8s linear infinite;
  }

  @keyframes pr-spin { to { transform: rotate(360deg); } }

  .pr-link { color: var(--pr-emerald); font-weight: 700; text-decoration: none; }
  .pr-link:hover { text-decoration: underline; }

  .pr-focus:focus-visible { outline: 2px solid var(--pr-gold); outline-offset: 2px; }

  @media (min-width: 640px) {
    .pr-grid-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .pr-grid-3 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .pr-grid-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
    .pr-footer-bottom { flex-direction: row; justify-content: space-between; }
    .pr-hero-title { font-size: 3.1rem; }
    .pr-hero-inner { padding: 96px 0 104px; }
  }

  @media (min-width: 900px) {
    .pr-nav-desktop { display: flex; }
    .pr-menu-toggle { display: none; }
    .pr-header-user { display: flex; }
    .pr-offline-badge { display: inline-flex; }
    .pr-footer-grid { grid-template-columns: 1.4fr 1fr 1fr; }
  }

  @media (min-width: 1200px) {
    .pr-nav-link { padding: 8px 11px; font-size: 0.87rem; }
    .pr-nav-desktop { gap: 4px; }
  }

  @media (prefers-reduced-motion: reduce) {
    * { animation-duration: 0.001ms !important; transition-duration: 0.001ms !important; }
  }
`;