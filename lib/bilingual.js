// One place that reads the English and the Luganda text of a value,
// whatever shape the file used to carry it.
//
// A plain string is English text. It is never copied into the Luganda
// field, and an object that holds both languages keeps both of them.

const clean = (value) => (typeof value === "string" ? value.trim() : "");

const ENGLISH_KEYS = ["en", "english", "text_en", "intro_en", "prayer_en", "body_en", "introduction", "title_en", "body", "text"];
const LUGANDA_KEYS = ["lu", "luganda", "text_lu", "intro_lu", "prayer_lu", "body_lu", "introduction_luganda", "introduction_lu", "title_lu", "body_luganda"];

/**
 * The text of one language of a value.
 *
 * A plain string is the English text. Asking for the Luganda text of a
 * plain string gives the fallback, never the English text again.
 */
export const bilingualText = (value, language, fallback = "") => {
  const wanted = language === "lu" || language === "luganda" ? "lu" : "en";
  const keys = wanted === "lu" ? LUGANDA_KEYS : ENGLISH_KEYS;
  if (value && typeof value === "object" && !Array.isArray(value)) {
    for (const key of keys) {
      const found = clean(value[key]);
      if (found) return found;
    }
    return clean(fallback);
  }
  if (wanted === "lu") return clean(fallback);
  return clean(value) || clean(fallback);
};

/** Both languages of a value at once. */
export const textValue = (value) => {
  if (typeof value === "string") return value.trim();
  if (Array.isArray(value)) return value.map(textValue).filter(Boolean).join(", ");
  return "";
};