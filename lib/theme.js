// Brand tokens for the Pray-Read Bible app.
// Front-end colours are FIXED by the brand guide: ivory, emerald, gold.

export const BRAND = {
  siteName: "Pray-Read Bible",
  ivory: "#faf8f2",
  ivorySoft: "#f8f6ef",
  ivoryWarm: "#F7F5F0",
  emerald: "#1d4035",
  emeraldDeep: "#17372f",
  emeraldHover: "#285445",
  gold: "#e9c981",
  goldButton: "#E7C873",
  goldDeep: "#a9852e",
  heading: "#1c382e",
  body: "#5d6d5d",
  border: "#e8e7de",
  shadow: "0 12px 35px -30px rgba(31,57,46,0.5)"
};

// The app icon uploaded by the owner: the single brand mark used everywhere.
export const LOGO_URL = "/api/appfiles/public/app_73e21b4aa5684452/assets/media-library/4345fa1c4c79_icon-512x512.png";
export const APPLE_ICON_URL = LOGO_URL;
// The favicon shown in the browser tab.
export const FAVICON_URL = "/api/appfiles/public/app_73e21b4aa5684452/assets/media-library/ee6ae196bbbc_favicon.ico";
export const HERO_IMAGE = "/api/appfiles/public/app_73e21b4aa5684452/assets/generated_022a23b6.png";
export const WORSHIP_IMAGE = "/api/appfiles/public/app_73e21b4aa5684452/assets/generated_f0778e1c.png";
// The PrayRead logo the owner uploaded, used on the verse-song pages.
export const PRAYREAD_LOGO_URL =
  "/api/appfiles/public/app_73e21b4aa5684452/assets/media-library/b8660c2286d0_PrayRead-logo-2.png";
// The worship photo that sits behind the verse songs and covers the songs
// that have no picture of their own.
export const WORSHIP_PHOTO = "/api/appfiles/public/app_73e21b4aa5684452/assets/generated_42d36dd2.png";
export const DEFAULT_COVER = "/api/appfiles/public/app_73e21b4aa5684452/assets/generated_022a23b6.png";
export const DONATE_URL = "https://store.pesapal.com/donatetoprayreadbibleproject";
export const SITE_NAME = "Pray-Read Bible";
export const APP_ID = "app_73e21b4aa5684452";

export const STORAGE_KEYS = {
  doneDevotionals: "pr_done_devotionals",
  fontScale: "pr_font_scale",
  installDismissed: "pr_install_dismissed",
  savedInsights: "pr_saved_insights",
  joinedGroups: "pr_joined_groups"
};

export const DONATE_LINK_PROPS = {
  target: "_blank",
  rel: "noopener noreferrer"
};