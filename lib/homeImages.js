import {
  HERO_IMAGE,
  WORSHIP_IMAGE,
  WORSHIP_PHOTO,
  DEVOTIONAL_DEFAULT_IMAGE,
  DEVOTIONAL_DEFAULT_IMAGE_SQUARE
} from "@/lib/theme";

// Background photographs for the Home page cards. Every card sits on one of
// these, with a dark scrim on top so the text stays readable.
const BASE = "/api/appfiles/public/app_73e21b4aa5684452/assets/";

export const HOME_IMAGES = {
  sunrise: `${BASE}generated_487ab3d1.png`,
  olive: `${BASE}generated_ced758b6.png`,
  praying: `${BASE}generated_c415d1ed.png`,
  hero: HERO_IMAGE,
  worship: WORSHIP_IMAGE,
  worshipPhoto: WORSHIP_PHOTO,
  devotional: DEVOTIONAL_DEFAULT_IMAGE,
  devotionalSquare: DEVOTIONAL_DEFAULT_IMAGE_SQUARE
};