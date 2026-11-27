// The bilingual text of one field.
//
// A file can carry the words of a field in three ways: as one plain string
// (the English words), as an object with one slot per language
// ({ en, lu } or { english, luganda }), or not at all.
//
// The resolver below always answers with plain text for one language. It
// never hands an object back, it never copies the English words into the
// Luganda column, and an empty string, null and undefined all mean "there
// is no text here".

const SLOTS = {
  en: ["en", "english", "eng"],
  lu: ["lu", "luganda", "lug", "lg"]
};

/** The language a request is written in: "en" or "lu". */
export const languageOf = (language) => {
  const raw = String(language || "").trim().toLowerCase();
  if (!raw) return "en";
  if (raw === "lu" || raw === "lug" || raw.startsWith("lug")) return "lu";
  return "en";
};

/** The plain words of a value that is already text. */
const textOf = (value) => {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return "";
};

/**
 * The words of one language slot of a value.
 *
 * A plain string is English text, so it is only ever read as English. An
 * object is read through the slot of the language that was asked for, and a
 * value that carries no such slot gives no words at all.
 */
export const slotText = (value, language) => {
  if (value === null || value === undefined) return "";
  if (typeof value === "object" && !Array.isArray(value)) {
    for (const slot of SLOTS[language] || SLOTS.en) {
      const found = textOf(value[slot]);
      if (found) return found;
    }
    return "";
  }
  return language === "en" ? textOf(value) : "";
};

/**
 * The text of one field in one language.
 *
 * The value can be a plain string, an object with a slot per language, or
 * nothing at all. The fallback is only used when it carries the words of
 * the language that was asked for, so an English fallback never fills the
 * Luganda column.
 */
export const bilingualText = (value, language, fallback = "") => {
  const wanted = languageOf(language);
  const found = slotText(value, wanted);
  if (found) return found;
  return slotText(fallback, wanted);
};

/**
 * The words of a field that the file keeps for Luganda.
 *
 * A plain string in a Luganda field is Luganda text, and it is kept as it
 * is. An object is read through its Luganda slot.
 */
export const lugandaFieldText = (value) => {
  if (value === null || value === undefined) return "";
  if (typeof value === "object" && !Array.isArray(value)) return slotText(value, "lu");
  return textOf(value);
};

/**
 * The two languages of one field, when the file keeps them apart.
 *
 * The English field and the Luganda field are read one by one. When the
 * Luganda field is missing, the English field is looked at again, so an
 * object that carries both languages still reaches the Luganda column. An
 * English field that carries one plain string never fills the Luganda
 * column: it stays empty until the Luganda words are written.
 */
export const bilingualPair = (englishValue, lugandaValue) => ({
  en: bilingualText(englishValue, "en"),
  lu:
    lugandaValue === undefined || lugandaValue === null
      ? slotText(englishValue, "lu")
      : lugandaFieldText(lugandaValue)
});