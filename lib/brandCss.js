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

  /* ---------- Bible reader: choose a book ---------- */
  .pr-reader-top {
    background: var(--pr-ivory);
    border-bottom: 1px solid var(--pr-border);
    padding: 22px 0 20px;
  }

  .pr-reader-topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    flex-wrap: wrap;
  }

  .pr-reader-pills { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }

  .pr-reader-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    min-height: 36px;
    padding: 0 16px;
    border-radius: 999px;
    border: 1px solid transparent;
    background: #ffffff;
    color: var(--pr-heading);
    font-family: inherit;
    font-size: 0.8rem;
    font-weight: 700;
    text-decoration: none;
    box-shadow: 0 10px 20px -18px rgba(31, 57, 46, 0.8);
  }

  .pr-reader-pill:hover { background: var(--pr-ivory-soft); color: var(--pr-heading); }
  .pr-reader-pill-dark { background: var(--pr-emerald); color: #ffffff; }
  .pr-reader-pill-dark:hover { background: var(--pr-emerald-deep); color: #ffffff; }
  .pr-reader-pill-gold { background: var(--pr-gold-btn); color: #4b3410; }
  .pr-reader-pill-gold:hover { background: var(--pr-gold); color: #4b3410; }
  .pr-reader-pill.is-button {
    cursor: pointer;
    border-color: var(--pr-border);
    transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
  }

  .pr-reader-pill.is-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 14px 24px -16px rgba(31, 57, 46, 0.9);
  }

  .pr-reader-pill.is-button:active { transform: translateY(0); }

  .pr-reader-pill-note {
    background: rgba(169, 133, 46, 0.1);
    border-color: rgba(169, 133, 46, 0.24);
    color: var(--pr-gold-deep);
    box-shadow: none;
  }

  .pr-reader-pill-note.is-button { border-color: rgba(169, 133, 46, 0.34); }
  .pr-reader-pill-note.is-button:hover { background: rgba(169, 133, 46, 0.18); color: var(--pr-gold-deep); }
  .pr-reader-pill-gold.is-button { border-color: rgba(169, 133, 46, 0.55); }
  .pr-reader-pill-gold.is-button:hover { background: var(--pr-gold); color: #4b3410; }

  .pr-reader-hero {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 18px;
    flex-wrap: wrap;
    margin-top: 22px;
  }

  .pr-reader-title {
    margin: 0;
    font-size: 2.3rem;
    font-weight: 800;
    letter-spacing: -0.03em;
    line-height: 1.08;
    color: #14261f;
  }

  .pr-reader-sub {
    margin: 8px 0 0;
    color: var(--pr-body);
    font-size: 0.96rem;
  }

  .pr-reader-stat {
    display: flex;
    align-items: center;
    gap: 14px;
    background: #10201c;
    border: 1px solid rgba(233, 201, 129, 0.28);
    border-radius: 18px;
    padding: 14px 20px;
    box-shadow: 0 20px 40px -28px rgba(16, 32, 28, 0.95);
  }

  .pr-reader-stat-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 12px;
    background: rgba(233, 201, 129, 0.16);
    color: var(--pr-gold);
    flex-shrink: 0;
  }

  .pr-reader-stat-total {
    margin: 0;
    color: #ffffff;
    font-size: 1.1rem;
    font-weight: 800;
    letter-spacing: -0.01em;
  }

  .pr-reader-stat-line {
    margin: 3px 0 0;
    color: rgba(255, 255, 255, 0.62);
    font-size: 0.74rem;
    font-weight: 600;
  }

  .pr-reader-offline {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    margin-top: 16px;
    padding: 7px 14px;
    border-radius: 999px;
    background: rgba(169, 133, 46, 0.12);
    border: 1px solid rgba(169, 133, 46, 0.28);
    color: var(--pr-gold-deep);
    font-size: 0.76rem;
    font-weight: 700;
  }

  .pr-reader-search { position: relative; display: block; }

  .pr-reader-search-input {
    width: 100%;
    min-height: 50px;
    padding: 12px 16px 12px 44px;
    border-radius: 16px;
    border: 1px solid var(--pr-border);
    background: #ffffff;
    color: var(--pr-heading);
    font-family: inherit;
    font-size: 0.94rem;
    box-shadow: 0 12px 28px -26px rgba(31, 57, 46, 0.9);
  }

  .pr-reader-search-input::placeholder { color: #9aa79f; }
  .pr-reader-search-input:focus { outline: 2px solid var(--pr-gold); outline-offset: 1px; }

  .pr-reader-search-icon {
    position: absolute;
    left: 15px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--pr-gold-deep);
    pointer-events: none;
  }

  .pr-reader-segment {
    display: flex;
    gap: 6px;
    margin-top: 14px;
    padding: 5px;
    border-radius: 16px;
    background: var(--pr-ivory-soft);
    border: 1px solid var(--pr-border);
  }

  .pr-reader-segment-btn {
    flex: 1 1 0;
    min-width: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    min-height: 44px;
    padding: 0 12px;
    border: none;
    border-radius: 12px;
    background: transparent;
    color: var(--pr-body);
    font-family: inherit;
    font-size: 0.86rem;
    font-weight: 700;
    cursor: pointer;
    transition: background 0.15s ease, color 0.15s ease, box-shadow 0.15s ease;
  }

  .pr-reader-segment-btn:hover { color: var(--pr-heading); }

  .pr-reader-segment-btn.is-active {
    background: #ffffff;
    color: var(--pr-heading);
    box-shadow: 0 12px 24px -18px rgba(31, 57, 46, 0.9);
  }

  .pr-reader-segment-count {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 24px;
    height: 20px;
    padding: 0 6px;
    border-radius: 999px;
    background: rgba(169, 133, 46, 0.12);
    color: var(--pr-gold-deep);
    font-size: 0.68rem;
    font-weight: 800;
  }

  .pr-reader-segment-btn.is-active .pr-reader-segment-count {
    background: var(--pr-emerald);
    color: #ffffff;
  }

  .pr-reader-section { margin-top: 32px; scroll-margin-top: 96px; }

  .pr-reader-section-head {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 14px;
  }

  .pr-reader-section-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    border-radius: 12px;
    font-size: 0.95rem;
    flex-shrink: 0;
  }

  .pr-reader-section-title {
    margin: 0;
    font-size: 1.12rem;
    font-weight: 800;
    letter-spacing: -0.01em;
    color: var(--pr-heading);
  }

  .pr-reader-section-count {
    margin-left: auto;
    display: inline-flex;
    align-items: center;
    padding: 5px 12px;
    border-radius: 999px;
    font-size: 0.72rem;
    font-weight: 800;
  }

  .pr-reader-books {
    display: grid;
    gap: 14px;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .pr-reader-book {
    position: relative;
    display: flex;
    flex-direction: column;
    min-width: 0;
    padding: 13px 13px 12px;
    border-radius: 16px;
    border: 1px solid var(--pr-border);
    border-top: 4px solid var(--pr-gold);
    background: #ffffff;
    text-decoration: none;
    box-shadow: 0 14px 30px -26px rgba(31, 57, 46, 0.9);
    transition: transform 0.18s ease, box-shadow 0.18s ease;
  }

  .pr-reader-book:hover {
    transform: translateY(-3px);
    box-shadow: 0 20px 38px -26px rgba(31, 57, 46, 1);
  }

  .pr-reader-book-abbr {
    font-size: 1rem;
    font-weight: 800;
    letter-spacing: -0.01em;
    color: var(--pr-heading);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .pr-reader-book.has-offline .pr-reader-book-abbr { padding-right: 26px; }

  .pr-reader-book-name {
    margin-top: 3px;
    font-size: 0.75rem;
    font-weight: 700;
    color: #3d5449;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .pr-reader-book-luganda {
    font-size: 0.68rem;
    color: #8b978f;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .pr-reader-book-foot {
    margin-top: 12px;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 8px;
  }

  .pr-reader-book-counts {
    display: inline-flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 1px;
    padding: 7px 13px;
    border-radius: 14px;
    line-height: 1.15;
  }

  .pr-reader-book-counts b { font-size: 0.82rem; font-weight: 800; }
  .pr-reader-book-counts span { font-size: 0.61rem; font-weight: 700; opacity: 0.85; }

  .pr-reader-book-go {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 26px;
    height: 26px;
    border-radius: 9px;
    background: var(--pr-ivory-soft);
    color: #9aa79f;
    flex-shrink: 0;
  }

  .pr-reader-book:hover .pr-reader-book-go { color: var(--pr-heading); }

  .pr-reader-offline-tag {
    position: absolute;
    top: 10px;
    right: 9px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    border-radius: 999px;
    background: rgba(29, 64, 53, 0.1);
    color: var(--pr-emerald);
  }

  @media (min-width: 480px) {
    .pr-reader-books { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  }

  @media (min-width: 700px) {
    .pr-reader-books { grid-template-columns: repeat(4, minmax(0, 1fr)); }
  }

  @media (min-width: 980px) {
    .pr-reader-books { grid-template-columns: repeat(6, minmax(0, 1fr)); }
  }

  @media (min-width: 1200px) {
    .pr-reader-books { grid-template-columns: repeat(8, minmax(0, 1fr)); }
  }

  @media (max-width: 560px) {
    .pr-reader-title { font-size: 1.85rem; }
    .pr-reader-stat { width: 100%; }
    .pr-reader-segment-btn { font-size: 0.78rem; gap: 6px; padding: 0 8px; }
  }

  /* ---------- Bible reader: book chapter selector ---------- */
  .pr-sel-layout {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 22px;
    align-items: start;
  }

  .pr-sel-side {
    background: #ffffff;
    border: 1px solid var(--pr-border);
    border-radius: 20px;
    padding: 18px;
    box-shadow: var(--pr-shadow);
    scroll-margin-top: 96px;
  }

  .pr-sel-side-head { display: flex; align-items: center; gap: 12px; }

  .pr-sel-side-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 38px;
    height: 38px;
    border-radius: 12px;
    color: #ffffff;
    flex-shrink: 0;
  }

  .pr-sel-side-head-text { min-width: 0; }

  .pr-sel-side-title {
    margin: 0;
    font-size: 1.05rem;
    font-weight: 800;
    color: var(--pr-heading);
  }

  .pr-sel-side-luganda {
    margin: 2px 0 0;
    font-size: 0.76rem;
    font-weight: 700;
    color: var(--pr-gold-deep);
  }

  .pr-sel-tabs {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 4px;
    margin-top: 16px;
    border-bottom: 1px solid var(--pr-border);
  }

  .pr-sel-tab {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    flex-wrap: wrap;
    min-height: 42px;
    padding: 6px 4px;
    border: none;
    border-bottom: 3px solid transparent;
    background: transparent;
    color: var(--pr-body);
    font-family: inherit;
    font-size: 0.72rem;
    font-weight: 700;
    cursor: pointer;
    transition: color 0.15s ease, border-color 0.15s ease;
  }

  .pr-sel-tab:hover { color: var(--pr-heading); }
  .pr-sel-tab.is-active { color: var(--pr-emerald); border-bottom-color: var(--pr-gold-btn); }

  .pr-sel-panel { padding-top: 16px; }

  .pr-sel-scroll {
    max-height: 420px;
    overflow-y: auto;
    padding-right: 6px;
    scrollbar-width: thin;
  }

  .pr-sel-scroll::-webkit-scrollbar { width: 6px; }
  .pr-sel-scroll::-webkit-scrollbar-thumb { background: var(--pr-border); border-radius: 999px; }

  .pr-sel-hint {
    margin: 12px 0 0;
    font-size: 0.72rem;
    line-height: 1.6;
    color: #8b978f;
  }

  .pr-sel-subtitle { margin-top: 18px; }

  .pr-sel-facts { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 12px; }

  .pr-sel-fact {
    display: inline-flex;
    align-items: center;
    padding: 5px 11px;
    border-radius: 999px;
    font-size: 0.68rem;
    font-weight: 800;
  }

  .pr-sel-paragraph { margin: 0; font-size: 0.88rem; line-height: 1.75; color: var(--pr-body); }
  .pr-sel-paragraph + .pr-sel-paragraph { margin-top: 12px; }
  .pr-sel-paragraph-soft { color: #8b978f; font-style: italic; }

  .pr-sel-panel-title {
    margin: 0 0 10px;
    font-size: 0.95rem;
    font-weight: 800;
    color: var(--pr-heading);
  }

  .pr-sel-outline-row {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 12px;
    padding: 9px 0;
    border-bottom: 1px dashed var(--pr-border);
  }

  .pr-sel-outline-row:last-child { border-bottom: none; }
  .pr-sel-outline-label { font-size: 0.82rem; font-weight: 600; color: #3d5449; }

  .pr-sel-outline-range {
    font-size: 0.74rem;
    font-weight: 800;
    color: var(--pr-gold-deep);
    white-space: nowrap;
  }

  .pr-sel-main { min-width: 0; }

  .pr-sel-head {
    padding-bottom: 18px;
    border-bottom: 1px solid var(--pr-border);
    margin-bottom: 22px;
  }

  .pr-sel-tagline {
    display: inline-flex;
    align-items: center;
    padding: 5px 13px;
    border-radius: 999px;
    font-size: 0.7rem;
    font-weight: 800;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  .pr-sel-title {
    margin: 12px 0 0;
    font-size: 2.4rem;
    font-weight: 800;
    letter-spacing: -0.03em;
    line-height: 1.05;
    color: #14261f;
  }

  .pr-sel-luganda { margin: 4px 0 0; font-size: 1rem; font-weight: 700; color: var(--pr-gold-deep); }
  .pr-sel-lead { margin: 8px 0 0; font-size: 0.92rem; color: var(--pr-body); }

  .pr-sel-offline {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    margin-top: 12px;
    padding: 6px 13px;
    border-radius: 999px;
    background: rgba(169, 133, 46, 0.12);
    border: 1px solid rgba(169, 133, 46, 0.28);
    color: var(--pr-gold-deep);
    font-size: 0.74rem;
    font-weight: 700;
  }

  .pr-sel-card {
    background: #ffffff;
    border: 1px solid var(--pr-border);
    border-radius: 22px;
    padding: 20px;
    box-shadow: var(--pr-shadow);
  }

  .pr-sel-eyebrow {
    margin: 0 0 14px;
    text-transform: uppercase;
    letter-spacing: 0.16em;
    font-size: 0.68rem;
    font-weight: 800;
    color: var(--pr-gold-deep);
  }

  .pr-chap-grid {
    display: grid;
    gap: 6px;
    grid-template-columns: repeat(7, minmax(0, 1fr));
  }

  .pr-chap-chip {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 32px;
    padding: 0 2px;
    border-radius: 10px;
    background: var(--pr-sel-accent, #b98428);
    color: #ffffff;
    font-family: inherit;
    font-size: 0.8rem;
    font-weight: 800;
    line-height: 1;
    letter-spacing: -0.01em;
    text-decoration: none;
    box-shadow: 0 8px 14px -14px rgba(31, 57, 46, 0.9);
    transition: transform 0.15s ease, box-shadow 0.15s ease;
  }

  .pr-chap-chip:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 20px -14px rgba(31, 57, 46, 1);
  }

  .pr-chap-chip.is-selected { outline: 2px solid var(--pr-emerald); outline-offset: 2px; }

  @media (min-width: 480px) {
    .pr-chap-grid { grid-template-columns: repeat(9, minmax(0, 1fr)); }
  }

  @media (min-width: 700px) {
    .pr-chap-grid { gap: 7px; grid-template-columns: repeat(11, minmax(0, 1fr)); }
    .pr-chap-chip { min-height: 34px; border-radius: 10px; font-size: 0.84rem; }
  }

  @media (min-width: 980px) {
    .pr-sel-layout { grid-template-columns: minmax(0, 320px) minmax(0, 1fr); gap: 30px; }
    .pr-sel-side { position: sticky; top: 92px; }
    .pr-chap-grid { grid-template-columns: repeat(12, minmax(0, 1fr)); }
  }

  @media (min-width: 1200px) {
    .pr-chap-grid { grid-template-columns: repeat(14, minmax(0, 1fr)); }
  }

  @media (max-width: 979px) {
    .pr-sel-main { order: 1; }
    .pr-sel-side { order: 2; }
  }

  @media (max-width: 560px) {
    .pr-sel-title { font-size: 1.9rem; }
    .pr-sel-tab { font-size: 0.64rem; }
  }

  /* ---------- Bible reader: sidebar study marks and the verse popup ---------- */
  .pr-sel-outline-label { cursor: pointer; }
  .pr-sel-outline-label:hover { color: var(--pr-emerald); }

  .pr-sel-outline-row.is-selected {
    background: rgba(29, 64, 53, 0.06);
    border-radius: 12px;
    padding-left: 10px;
    margin-left: -10px;
    border-left: 3px solid var(--pr-sel-accent, #b98428);
  }

  .pr-sel-range-link {
    border: none;
    background: transparent;
    padding: 0;
    font-family: inherit;
    font-size: 0.74rem;
    font-weight: 800;
    color: var(--pr-gold-deep);
    cursor: pointer;
    text-decoration: underline;
    text-underline-offset: 2px;
  }

  .pr-sel-range-link:hover { color: var(--pr-emerald); }
  .pr-sel-range-dash { margin: 0 3px; color: #a9b3ac; }

  .pr-sel-refs { display: flex; flex-wrap: wrap; gap: 8px; }

  .pr-sel-ref-chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    border-radius: 999px;
    border: 1px solid rgba(169, 133, 46, 0.28);
    background: rgba(169, 133, 46, 0.08);
    color: var(--pr-gold-deep);
    font-family: inherit;
    font-size: 0.76rem;
    font-weight: 800;
    cursor: pointer;
    transition: background 0.15s ease, transform 0.15s ease;
  }

  .pr-sel-ref-chip:hover { background: rgba(169, 133, 46, 0.18); transform: translateY(-1px); }
  .pr-sel-ref-text { display: inline; }

  .pr-sel-inline-ref {
    display: inline;
    padding: 1px 6px;
    border-radius: 8px;
    border: 1px solid rgba(169, 133, 46, 0.3);
    background: rgba(169, 133, 46, 0.1);
    color: var(--pr-gold-deep);
    font-family: inherit;
    font-size: 0.88em;
    font-weight: 700;
    cursor: pointer;
    white-space: nowrap;
  }

  .pr-sel-inline-ref:hover { background: rgba(169, 133, 46, 0.2); }

  .pr-sel-prayer-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    flex-wrap: wrap;
  }

  .pr-sel-lang-toggle {
    display: inline-flex;
    gap: 4px;
    padding: 3px;
    border-radius: 999px;
    background: var(--pr-ivory-soft);
    border: 1px solid var(--pr-border);
  }

  .pr-sel-lang-btn {
    border: none;
    background: transparent;
    border-radius: 999px;
    padding: 5px 12px;
    font-family: inherit;
    font-size: 0.72rem;
    font-weight: 800;
    color: var(--pr-body);
    cursor: pointer;
  }

  .pr-sel-lang-btn.is-active {
    background: var(--pr-emerald);
    color: #ffffff;
  }

  .pr-sel-prayer-body {
    margin: 12px 0 0;
    font-family: Georgia, "Times New Roman", serif;
    font-size: 0.94rem;
    line-height: 1.85;
    color: var(--pr-heading);
  }

  .pr-sel-prayer-library { margin-top: 20px; }

  .pr-sel-library-card {
    padding: 12px 14px;
    border-radius: 14px;
    border: 1px solid var(--pr-border);
    background: var(--pr-ivory-soft);
    margin-bottom: 10px;
  }

  .pr-sel-library-title {
    margin: 0 0 6px;
    font-size: 0.82rem;
    font-weight: 800;
    color: var(--pr-heading);
  }

  .pr-sel-library-body {
    margin: 8px 0 0;
    font-size: 0.82rem;
    line-height: 1.7;
    color: var(--pr-body);
  }

  .pr-annot-highlight {
    border-radius: 4px;
    padding: 1px 0;
    box-decoration-break: clone;
    -webkit-box-decoration-break: clone;
  }

  .pr-annot-underline {
    text-decoration: underline;
    text-decoration-thickness: 2px;
    text-underline-offset: 2px;
    text-decoration-color: var(--pr-emerald);
  }

  .pr-annot-toolbar {
    position: fixed;
    z-index: 95;
    transform: translateX(-50%);
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 10px;
    border-radius: 999px;
    background: var(--pr-emerald-deep);
    border: 1px solid rgba(233, 201, 129, 0.4);
    box-shadow: 0 18px 40px -22px rgba(15, 32, 27, 0.85);
  }

  .pr-annot-toolbar-icon { display: inline-flex; color: var(--pr-gold); }

  .pr-annot-swatch {
    width: 20px;
    height: 20px;
    border-radius: 999px;
    border: 1px solid rgba(0, 0, 0, 0.12);
    cursor: pointer;
    padding: 0;
  }

  .pr-annot-swatch:hover { transform: scale(1.12); }

  .pr-annot-action {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 24px;
    height: 24px;
    border-radius: 999px;
    border: 1px solid rgba(255, 255, 255, 0.24);
    background: rgba(255, 255, 255, 0.08);
    color: #ffffff;
    font-family: inherit;
    font-size: 0.78rem;
    font-weight: 800;
    cursor: pointer;
  }

  .pr-annot-action:hover { background: rgba(255, 255, 255, 0.18); }

  .pr-annot-underline-btn {
    text-decoration: underline;
    text-decoration-thickness: 2px;
    text-underline-offset: 2px;
  }

  .pr-verse-popup-backdrop {
    position: fixed;
    inset: 0;
    z-index: 96;
    background: rgba(15, 32, 27, 0.55);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 18px;
  }

  .pr-verse-popup {
    width: 100%;
    max-width: 620px;
    max-height: 86vh;
    overflow-y: auto;
    background: #ffffff;
    border-radius: 22px;
    box-shadow: 0 34px 80px -40px rgba(15, 32, 27, 0.8);
  }

  .pr-verse-popup-head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    padding: 20px 22px;
    background: var(--pr-emerald);
    color: #ffffff;
  }

  .pr-verse-popup-title {
    margin: 6px 0 0;
    font-size: 1.35rem;
    font-weight: 800;
    letter-spacing: -0.02em;
    color: #ffffff;
  }

  .pr-verse-popup-luganda {
    margin: 3px 0 0;
    font-size: 0.8rem;
    font-weight: 700;
    color: var(--pr-gold);
  }

  .pr-verse-popup-close {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    border-radius: 999px;
    border: 1px solid rgba(255, 255, 255, 0.3);
    background: rgba(255, 255, 255, 0.12);
    color: #ffffff;
    cursor: pointer;
  }

  .pr-verse-popup-body { padding: 20px 22px 8px; }

  .pr-verse-popup-status {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0;
    font-size: 0.88rem;
    color: var(--pr-body);
  }

  .pr-verse-popup-verse {
    display: flex;
    gap: 12px;
    padding: 10px 12px;
    border-radius: 14px;
  }

  .pr-verse-popup-verse.is-target { background: rgba(233, 201, 129, 0.14); }

  .pr-verse-popup-number {
    flex-shrink: 0;
    width: 26px;
    text-align: right;
    font-size: 0.72rem;
    font-weight: 800;
    color: var(--pr-gold-deep);
    padding-top: 5px;
  }

  .pr-verse-popup-text {
    margin: 0;
    font-family: Georgia, "Times New Roman", serif;
    font-size: 1.02rem;
    line-height: 1.8;
    color: var(--pr-heading);
  }

  .pr-verse-popup-foot {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
    flex-wrap: wrap;
    padding: 14px 22px 20px;
    border-top: 1px solid var(--pr-border);
  }

  .pr-verse-popup-hint {
    margin: 0;
    font-size: 0.74rem;
    line-height: 1.6;
    color: #8b978f;
    max-width: 34ch;
  }

  .pr-study {
    margin-top: 26px;
    scroll-margin-top: 96px;
    background: #ffffff;
    border: 1px solid var(--pr-border);
    border-radius: 20px;
    box-shadow: var(--pr-shadow);
    overflow: hidden;
  }

  .pr-study-head {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 18px 22px;
    border-bottom: 1px solid var(--pr-border);
    background: linear-gradient(180deg, #ffffff 0%, var(--pr-ivory-soft) 100%);
  }

  .pr-study-head-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 42px;
    height: 42px;
    flex-shrink: 0;
    border-radius: 14px;
    background: var(--pr-emerald);
    color: #ffffff;
  }

  .pr-study-head-text { min-width: 0; flex: 1 1 auto; }

  .pr-study-title {
    margin: 2px 0 0;
    font-size: 1.18rem;
    font-weight: 800;
    color: var(--pr-heading);
  }

  .pr-study-luganda {
    margin-left: 8px;
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--pr-gold-deep);
  }

  .pr-study-toggle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 38px;
    height: 38px;
    flex-shrink: 0;
    border-radius: 999px;
    border: 1px solid var(--pr-border);
    background: #ffffff;
    color: var(--pr-emerald);
    cursor: pointer;
  }

  .pr-study-toggle svg { transition: transform 0.2s ease; }
  .pr-study-toggle svg.is-collapsed { transform: rotate(-90deg); }

  .pr-study-tabs {
    display: flex;
    align-items: stretch;
    gap: 4px;
    overflow-x: auto;
    padding: 0 12px;
    border-bottom: 1px solid var(--pr-border);
    background: #ffffff;
  }

  .pr-study-tab {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 14px 14px 12px;
    border: 0;
    border-bottom: 3px solid transparent;
    background: transparent;
    color: var(--pr-body);
    font-size: 0.92rem;
    font-weight: 600;
    white-space: nowrap;
    cursor: pointer;
    transition: color 0.18s ease, border-color 0.18s ease;
  }

  .pr-study-tab:hover { color: var(--pr-heading); }

  .pr-study-tab.is-active {
    color: var(--pr-emerald);
    border-bottom-color: var(--pr-gold-btn);
    font-weight: 800;
  }

  .pr-study-count {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 22px;
    height: 20px;
    padding: 0 7px;
    border-radius: 999px;
    background: var(--pr-ivory-soft);
    color: var(--pr-gold-deep);
    font-size: 0.72rem;
    font-weight: 700;
  }

  .pr-study-tab.is-active .pr-study-count { background: rgba(169, 133, 46, 0.16); }

  .pr-study-body { padding: 18px 22px 22px; }

  .pr-study-notes { display: grid; gap: 14px; }

  .pr-study-note {
    border: 1px solid var(--pr-border);
    border-left: 3px solid var(--pr-gold-btn);
    border-radius: 14px;
    background: var(--pr-ivory-soft);
    padding: 14px 16px;
  }

  .pr-study-note-head {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
  }

  .pr-study-badge {
    display: inline-flex;
    align-items: center;
    padding: 3px 10px;
    border-radius: 999px;
    border: 0;
    background: rgba(29, 64, 53, 0.08);
    color: var(--pr-emerald);
    font-size: 0.74rem;
    font-weight: 700;
    letter-spacing: 0.02em;
  }

  .pr-study-badge.is-link { cursor: pointer; }
  .pr-study-badge.is-link:hover { background: rgba(29, 64, 53, 0.18); }

  .pr-study-link {
    padding: 2px 0;
    border: 0;
    background: transparent;
    color: var(--pr-gold-deep);
    font-size: 0.78rem;
    font-weight: 700;
    cursor: pointer;
  }

  .pr-study-link:hover { text-decoration: underline; }

  .pr-study-link.is-range {
    text-decoration: underline;
    text-underline-offset: 3px;
  }

  .pr-study-note-title {
    margin: 8px 0 0;
    font-size: 1rem;
    font-weight: 800;
    color: var(--pr-heading);
  }

  .pr-study-note-body {
    margin: 8px 0 0;
    font-size: 0.92rem;
    line-height: 1.75;
    color: var(--pr-body);
  }

  .pr-study-note-body.is-lu { color: #7b8a80; }

  .pr-study-empty {
    padding: 26px 20px;
    border: 1px dashed var(--pr-gold-btn);
    border-radius: 16px;
    background: #fffdf7;
    text-align: center;
  }

  .pr-study-empty-icon { display: inline-flex; color: var(--pr-gold-deep); }

  .pr-study-empty-title {
    margin: 10px 0 0;
    font-size: 0.98rem;
    font-weight: 800;
    color: var(--pr-heading);
  }

  .pr-study-empty-hint {
    margin: 6px 0 0;
    font-size: 0.84rem;
    color: var(--pr-body);
  }

  .pr-study-chips {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 8px;
    margin-top: 16px;
  }

  .pr-study-chip {
    padding: 5px 12px;
    border-radius: 999px;
    border: 1px solid var(--pr-gold-btn);
    background: #ffffff;
    color: var(--pr-gold-deep);
    font-size: 0.78rem;
    font-weight: 600;
  }

  .pr-pager {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
    padding: 0 22px 18px;
  }

  .pr-pager-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    border-radius: 10px;
    border: 1px solid var(--pr-border);
    background: #ffffff;
    color: var(--pr-emerald);
    cursor: pointer;
  }

  .pr-pager-btn:disabled { opacity: 0.35; cursor: not-allowed; }

  .pr-pager-pages { display: flex; align-items: center; gap: 4px; }

  .pr-pager-page {
    min-width: 32px;
    height: 32px;
    padding: 0 8px;
    border-radius: 10px;
    border: 1px solid var(--pr-border);
    background: #ffffff;
    color: var(--pr-body);
    font-size: 0.84rem;
    font-weight: 700;
    cursor: pointer;
  }

  .pr-pager-page.is-active {
    background: var(--pr-emerald);
    border-color: var(--pr-emerald);
    color: #ffffff;
  }

  .pr-pager-gap { padding: 0 2px; color: #a9b3ac; font-size: 0.8rem; }

  .pr-pager-label {
    margin-left: auto;
    font-size: 0.78rem;
    color: var(--pr-body);
  }

  /* ── The chapter reader ─────────────────────────────────────────────── */

  .pr-chapter-head {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 14px;
    flex-wrap: wrap;
  }

  .pr-chapter-head-title {
    margin: 0;
    font-family: Georgia, "Times New Roman", "Fraunces", serif;
    font-size: 2rem;
    font-weight: 700;
    letter-spacing: -0.02em;
    color: var(--pr-heading);
  }

  .pr-chapter-head-sub { margin: 4px 0 0; font-size: 0.92rem; color: var(--pr-body); }

  .pr-chapter-page { min-height: 100vh; background: var(--pr-ivory); color: var(--pr-body); }
  .pr-chapter-grid { grid-template-columns: minmax(0, 1fr); gap: 20px; }
  .pr-chapter-tabs { grid-column: 1; grid-row: 1; }
  .pr-chapter-side { grid-column: 1; grid-row: 2; display: none; gap: 14px; min-width: 0; }
  .pr-chapter-side.is-open { display: grid; }
  .pr-chapter-content { grid-column: 1; grid-row: 3; display: grid; gap: 16px; min-width: 0; }
  .pr-chapter-tabs { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; padding: 6px; border-radius: 18px; background: var(--pr-ivory-soft); border: 1px solid var(--pr-border); }
  .pr-chapter-tab { display: inline-flex; align-items: center; justify-content: center; flex: 1 1 0; min-width: 0; min-height: 44px; padding: 0 10px; border: none; border-radius: 13px; background: transparent; color: var(--pr-body); font-family: inherit; font-size: 0.82rem; font-weight: 700; cursor: pointer; }
  .pr-chapter-tab.is-active { background: #ffffff; color: var(--pr-heading); box-shadow: 0 12px 24px -18px rgba(31, 57, 46, 0.9); }
  .pr-chapter-panel-toggle { margin-left: auto; display: inline-flex; align-items: center; justify-content: center; min-height: 44px; padding: 0 14px; border-radius: 13px; border: 1px solid var(--pr-border); background: #ffffff; color: var(--pr-emerald); font-family: inherit; font-size: 0.78rem; font-weight: 800; cursor: pointer; }
  @media (max-width: 1023px) {
    .pr-chapter-tabs { flex-wrap: nowrap; }
    .pr-chapter-tab { font-size: 0.72rem; padding: 0 5px; line-height: 1.2; }
    .pr-chapter-panel-toggle { min-height: 38px; padding: 0 8px; font-size: 0.68rem; }
    .pr-version-menu { left: 10px; right: 10px; bottom: 12px; max-height: 68vh; z-index: 120; }
  }

  .pr-chapter-tabs {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
    padding: 6px;
    border-radius: 18px;
    background: var(--pr-ivory-soft);
    border: 1px solid var(--pr-border);
  }

  .pr-chapter-tab {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    min-height: 44px;
    padding: 0 16px;
    border: none;
    border-radius: 13px;
    background: transparent;
    color: var(--pr-body);
    font-family: inherit;
    font-size: 0.86rem;
    font-weight: 700;
    cursor: pointer;
    transition: background 0.16s ease, color 0.16s ease, box-shadow 0.16s ease;
  }

  .pr-chapter-tab:hover { color: var(--pr-heading); }

  .pr-chapter-tab.is-active {
    background: #ffffff;
    color: var(--pr-heading);
    box-shadow: 0 12px 24px -18px rgba(31, 57, 46, 0.9);
  }

  .pr-chapter-tab.is-active svg { color: var(--pr-emerald); }

  .pr-chapter-panel-toggle {
    margin-left: auto;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    min-height: 44px;
    padding: 0 14px;
    border-radius: 13px;
    border: 1px solid var(--pr-border);
    background: #ffffff;
    color: var(--pr-emerald);
    font-family: inherit;
    font-size: 0.78rem;
    font-weight: 800;
    cursor: pointer;
  }

  @media (min-width: 1024px) {
    .pr-chapter-grid { grid-template-columns: 330px minmax(0, 1fr); }
    .pr-chapter-tabs { grid-column: 2; grid-row: 1; }
    .pr-chapter-grid > .pr-chapter-side {
      display: grid;
      grid-column: 1;
      grid-row: 1 / span 2;
      align-self: start;
    }
    .pr-chapter-content { grid-column: 2; grid-row: 2; }
    .pr-chapter-panel-toggle { display: none; }
  }

  .pr-chapter-card {
    border: 1px solid var(--pr-border);
    border-radius: 18px;
    background: #ffffff;
    box-shadow: var(--pr-shadow);
    overflow: hidden;
  }

  .pr-chapter-card-head {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 13px 16px;
    border-bottom: 1px solid var(--pr-border);
    background: var(--pr-ivory-soft);
    color: var(--pr-emerald);
  }

  .pr-chapter-card-title { margin: 0; font-size: 0.9rem; font-weight: 800; color: var(--pr-heading); }
  .pr-chapter-card-sub { margin: 2px 0 0; font-size: 0.72rem; color: var(--pr-body); }

  .pr-chapter-scroll {
    max-height: 300px;
    overflow-y: auto;
    padding: 16px;
  }

  .pr-chapter-heading { margin: 0; font-size: 1.05rem; font-weight: 800; color: var(--pr-heading); }
  .pr-chapter-range { margin: 4px 0 0; font-size: 0.75rem; font-weight: 700; color: var(--pr-gold-deep); }
  .pr-chapter-body { margin: 10px 0 0; font-size: 0.9rem; line-height: 1.7; color: var(--pr-body); }

  .pr-chapter-anchor {
    margin: 14px 0 0;
    padding: 12px 14px;
    border-left: 3px solid var(--pr-gold-btn);
    background: var(--pr-ivory-soft);
    border-radius: 0 12px 12px 0;
    font-family: Georgia, "Times New Roman", serif;
    font-size: 0.92rem;
    line-height: 1.7;
    color: var(--pr-heading);
  }

  .pr-chapter-anchor-verse { font-weight: 800; color: var(--pr-gold-deep); margin-right: 6px; }

  .pr-chapter-refs { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; }

  .pr-chapter-ref {
    border: 1px solid var(--pr-border);
    background: #ffffff;
    color: var(--pr-emerald);
    border-radius: 999px;
    padding: 4px 11px;
    font-family: inherit;
    font-size: 0.74rem;
    font-weight: 800;
    cursor: pointer;
  }

  .pr-chapter-ref:hover { background: var(--pr-ivory-soft); }

  .pr-chapter-hint { margin: 14px 0 0; font-size: 0.72rem; color: var(--pr-body); opacity: 0.8; }

  .pr-chapter-note { padding: 12px 0; border-bottom: 1px dashed var(--pr-border); }
  .pr-chapter-note:last-of-type { border-bottom: none; padding-bottom: 0; }

  .pr-chapter-badge {
    display: inline-block;
    padding: 3px 9px;
    border-radius: 999px;
    background: var(--pr-gold-btn);
    color: #1a352c;
    font-size: 0.66rem;
    font-weight: 800;
    letter-spacing: 0.04em;
  }

  .pr-chapter-note-title { margin: 8px 0 0; font-size: 0.92rem; font-weight: 800; color: var(--pr-heading); }
  .pr-chapter-note-body { margin: 6px 0 0; font-size: 0.86rem; line-height: 1.7; color: var(--pr-body); }
  .pr-chapter-note-body.is-lu { margin-top: 8px; padding-top: 8px; border-top: 1px solid var(--pr-gold-btn); }
  .pr-chapter-prayer-body.is-lu { margin-top: 10px; padding-top: 10px; border-top: 1px solid var(--pr-gold-btn); color: var(--pr-body); }

  .pr-chapter-prayer { padding: 12px 0; }
  .pr-chapter-prayer-title { margin: 0; font-size: 0.92rem; font-weight: 800; color: var(--pr-heading); }
  .pr-chapter-prayer-body {
    margin: 8px 0 0;
    font-family: Georgia, "Times New Roman", serif;
    font-size: 0.88rem;
    line-height: 1.75;
    color: var(--pr-heading);
  }

  .pr-strongs {
    font-size: 0.62em;
    font-weight: 700;
    color: var(--pr-gold-deep);
    margin-left: 2px;
    letter-spacing: 0.02em;
  }

  /* ── The chapter reader: hero, control bar and the closing prayer ──── */

  .pr-chapter-hero {
    background: linear-gradient(140deg, var(--pr-emerald) 0%, var(--pr-emerald-deep) 100%);
    color: #ffffff;
    padding: 24px 0 30px;
  }

  .pr-chapter-hero-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    flex-wrap: wrap;
  }

  .pr-chapter-hero-pills { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }

  .pr-chapter-hero-pill {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    min-height: 38px;
    padding: 0 16px;
    border-radius: 999px;
    border: 1px solid rgba(255, 255, 255, 0.42);
    background: transparent;
    color: #ffffff;
    font-family: inherit;
    font-size: 0.8rem;
    font-weight: 700;
    text-decoration: none;
    cursor: pointer;
    transition: background 0.15s ease, transform 0.15s ease;
  }

  .pr-chapter-hero-pill:hover { background: rgba(255, 255, 255, 0.16); color: #ffffff; transform: translateY(-1px); }
  .pr-chapter-hero-pill.is-soft { background: rgba(255, 255, 255, 0.16); border-color: transparent; }

  .pr-chapter-hero-title {
    margin: 20px 0 0;
    font-family: Georgia, "Times New Roman", "Fraunces", serif;
    font-size: 2.3rem;
    line-height: 1.06;
    font-weight: 700;
    letter-spacing: -0.02em;
    color: #ffffff;
  }

  .pr-chapter-hero-sub { margin: 8px 0 0; font-size: 0.94rem; font-weight: 600; color: rgba(255, 255, 255, 0.72); }

  .pr-chapter-shell { padding-top: 20px; padding-bottom: 56px; }

  .pr-chapter-controls {
    position: relative;
    z-index: 30;
    padding: 14px 18px;
    border-radius: 20px;
    margin-bottom: 14px;
  }

  .pr-chapter-controls-row { display: flex; align-items: center; justify-content: space-between; gap: 10px; flex-wrap: wrap; }
  .pr-chapter-controls-left { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
  .pr-chapter-controls-right { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-left: auto; }

  .pr-lang-toggle {
    display: inline-flex;
    gap: 3px;
    padding: 3px;
    border-radius: 999px;
    background: var(--pr-ivory-soft);
    border: 1px solid var(--pr-border);
  }

  .pr-lang-btn {
    border: none;
    background: transparent;
    border-radius: 999px;
    padding: 6px 12px;
    font-family: inherit;
    font-size: 0.72rem;
    font-weight: 800;
    color: var(--pr-body);
    cursor: pointer;
  }

  .pr-lang-btn.is-active { background: var(--pr-emerald); color: #ffffff; }

  .pr-chapter-gridpanel {
    margin-top: 14px;
    padding-top: 14px;
    border-top: 1px solid var(--pr-border);
    max-height: 236px;
    overflow-y: auto;
  }

  .pr-chapter-gridpanel .pr-chap-chip.is-selected { background: var(--pr-emerald); color: #ffffff; }
  .pr-chap-chip.is-read { position: relative; }
  .pr-chap-chip.is-read::after {
    content: "";
    position: absolute;
    top: 4px;
    right: 4px;
    width: 6px;
    height: 6px;
    border-radius: 999px;
    background: var(--pr-gold);
  }

  .pr-verse-divider { display: block; height: 1px; margin: 10px 0; background: var(--pr-gold-btn); opacity: 0.65; }
  .pr-verse-lu { display: block; font-size: 0.92em; line-height: 1.75; color: var(--pr-body); }
  .pr-verse-lu-badge {
    display: inline-block;
    margin-right: 6px;
    padding: 1px 6px;
    border-radius: 7px;
    background: rgba(169, 133, 46, 0.14);
    color: var(--pr-gold-deep);
    font-family: "Inter", "Segoe UI", sans-serif;
    font-size: 0.6rem;
    font-weight: 800;
    letter-spacing: 0.08em;
  }
  .pr-verse-missing { display: block; margin-top: 6px; font-family: "Inter", "Segoe UI", sans-serif; font-size: 0.74rem; color: var(--pr-body); opacity: 0.8; }

  .pr-closing-card { padding: 22px; background: linear-gradient(160deg, #ffffff 0%, var(--pr-ivory-soft) 100%); }
  .pr-closing-head { display: flex; align-items: center; gap: 12px; }
  .pr-closing-icon { display: inline-flex; align-items: center; justify-content: center; width: 44px; height: 44px; border-radius: 14px; background: var(--pr-emerald); color: #ffffff; flex-shrink: 0; }
  .pr-closing-title { margin: 2px 0 0; font-size: 1.15rem; font-weight: 800; color: var(--pr-heading); }
  .pr-closing-body { margin-top: 16px; }
  .pr-closing-prayer-title { margin: 0; font-size: 0.95rem; font-weight: 800; color: var(--pr-heading); }
  .pr-closing-text { margin: 10px 0 0; font-family: Georgia, "Times New Roman", serif; font-size: 1rem; line-height: 1.9; color: var(--pr-heading); white-space: pre-line; }
  .pr-closing-text.is-lu { margin-top: 14px; padding-top: 14px; border-top: 1px solid var(--pr-gold-btn); color: var(--pr-body); font-size: 0.95rem; }
  .pr-closing-amen { margin: 14px 0 0; font-family: Georgia, "Times New Roman", serif; font-weight: 800; color: var(--pr-gold-deep); }
  .pr-closing-foot { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-top: 18px; padding-top: 14px; border-top: 1px solid var(--pr-border); }

  .pr-chapter-nav { display: flex; align-items: center; justify-content: space-between; gap: 10px; flex-wrap: wrap; }

  /* The reader can be read in the dark. The dark palette is a controlled
     variant of the brand colours, never a new theme. */
  .pr-chapter-page[data-pr-theme="dark"] {
    --pr-ivory: #12211c;
    --pr-ivory-soft: #16261f;
    --pr-heading: #e8e6da;
    --pr-body: #a8b5a8;
    --pr-border: #274038;
    --pr-shadow: 0 12px 35px -30px rgba(0, 0, 0, 0.9);
    background: #12211c;
    color: #a8b5a8;
  }

  .pr-chapter-page[data-pr-theme="dark"] .pr-card,
  .pr-chapter-page[data-pr-theme="dark"] .pr-chapter-card,
  .pr-chapter-page[data-pr-theme="dark"] .pr-modal,
  .pr-chapter-page[data-pr-theme="dark"] .pr-verse-popup,
  .pr-chapter-page[data-pr-theme="dark"] .pr-floating,
  .pr-chapter-page[data-pr-theme="dark"] .pr-empty,
  .pr-chapter-page[data-pr-theme="dark"] .pr-icon-btn,
  .pr-chapter-page[data-pr-theme="dark"] .pr-version-menu,
  .pr-chapter-page[data-pr-theme="dark"] .pr-chapter-tab.is-active,
  .pr-chapter-page[data-pr-theme="dark"] .pr-pager-btn,
  .pr-chapter-page[data-pr-theme="dark"] .pr-pager-page {
    background: #1a2f28;
    border-color: #274038;
    color: #e8e6da;
  }

  .pr-chapter-page[data-pr-theme="dark"] .pr-closing-card { background: #1a2f28; }
  .pr-chapter-page[data-pr-theme="dark"] .pr-verse:hover { background: rgba(233, 201, 129, 0.08); }
  .pr-chapter-page[data-pr-theme="dark"] .pr-success { background: rgba(233, 201, 129, 0.08); border-color: rgba(233, 201, 129, 0.22); }
  .pr-chapter-page[data-pr-theme="dark"] .pr-link { color: var(--pr-gold); }
  .pr-chapter-page[data-pr-theme="dark"] .pr-icon-btn { color: var(--pr-gold); }
  .pr-chapter-page[data-pr-theme="dark"] .pr-input,
  .pr-chapter-page[data-pr-theme="dark"] .pr-textarea,
  .pr-chapter-page[data-pr-theme="dark"] .pr-select { background: #16261f; border-color: #274038; color: #e8e6da; }
  .pr-chapter-page[data-pr-theme="dark"] .pr-chapter-card-head { background: #16261f; }

  /* ── The version switch ─────────────────────────────────────────────── */

  .pr-version { position: relative; display: inline-flex; }

  .pr-version-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
  }

  .pr-version-menu {
    position: fixed;
    left: 10px;
    right: 10px;
    top: auto;
    bottom: 12px;
    z-index: 60;
    width: auto;
    padding: 12px 12px 18px;
    background: #ffffff;
    border: 1px solid var(--pr-border);
    border-radius: 20px;
    box-shadow: 0 -18px 50px -24px rgba(15, 32, 27, 0.7);
    max-height: 68vh;
    z-index: 120;
    overscroll-behavior: contain;
    overflow-y: auto;
  }

  .pr-version-menu-title {
    margin: 8px 6px 6px;
    font-size: 0.66rem;
    text-transform: uppercase;
    letter-spacing: 0.16em;
    font-weight: 800;
    color: var(--pr-body);
    opacity: 0.7;
  }

  .pr-version-row { display: flex; align-items: center; gap: 4px; }

  .pr-version-option {
    flex: 1 1 auto;
    display: flex;
    align-items: center;
    gap: 10px;
    text-align: left;
    padding: 9px 10px;
    border-radius: 12px;
    border: 1px solid transparent;
    background: transparent;
    font-family: inherit;
    cursor: pointer;
  }

  .pr-version-option:hover { background: var(--pr-ivory-soft); }
  .pr-version-option.is-active { border-color: var(--pr-gold-btn); background: var(--pr-ivory-soft); }

  .pr-version-short {
    font-size: 0.68rem;
    font-weight: 800;
    color: var(--pr-emerald);
    background: var(--pr-ivory-soft);
    border-radius: 8px;
    padding: 3px 7px;
  }

  .pr-version-text { display: flex; flex-direction: column; min-width: 0; }
  .pr-version-text strong { font-size: 0.82rem; color: var(--pr-heading); }
  .pr-version-text em { font-style: normal; font-size: 0.7rem; color: var(--pr-body); }

  .pr-version-remove {
    border: none;
    background: transparent;
    color: var(--pr-body);
    padding: 6px;
    cursor: pointer;
  }

  /* ── The share sheet ────────────────────────────────────────────────── */

  .pr-share { display: grid; gap: 14px; }

  .pr-share-block { border-left: 3px solid var(--pr-gold-btn); padding-left: 12px; }

  .pr-share-label {
    margin: 0;
    font-size: 0.68rem;
    text-transform: uppercase;
    letter-spacing: 0.14em;
    font-weight: 800;
    color: var(--pr-gold-deep);
  }

  .pr-share-text {
    margin: 6px 0 0;
    font-size: 0.9rem;
    line-height: 1.7;
    color: var(--pr-heading);
    white-space: pre-line;
  }

  .pr-share-channels { display: flex; flex-wrap: wrap; gap: 8px; }
  .pr-share-copied { margin: 0; font-size: 0.78rem; font-weight: 700; color: var(--pr-emerald); }
  .pr-share-link { margin: 0; font-size: 0.72rem; color: var(--pr-body); word-break: break-all; }

  .pr-passage-prayer-ref {
    margin: 4px 0 0;
    padding: 0;
    border: none;
    background: transparent;
    font-family: inherit;
    font-size: 0.78rem;
    font-weight: 700;
    color: var(--pr-gold-deep);
    text-decoration: underline;
    cursor: pointer;
  }

  .pr-passage-prayer-body { white-space: pre-line; }

  @media (prefers-reduced-motion: reduce) {
    * { animation-duration: 0.001ms !important; transition-duration: 0.001ms !important; }
  }
`;