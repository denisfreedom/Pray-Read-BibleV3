// The Strong's numbers of the KJV+ text.
//
// The reader marks every Greek and Hebrew word with its Strong's number.
// This file keeps the helpers that turn the raw source markup into those
// markers, and the small helpers the definition card needs.
//
// The definitions themselves are not written here: they come from the
// public lexicon, and they are kept in the app so every reader gets the
// same answer for the same word.

/** The Greek numbers belong to the New Testament, the Hebrew ones to the Old. */
export const strongPrefixForBook = (bookNumber) =>
  Number(bookNumber) >= 40 ? "G" : "H";

/**
 * Brings a Strong's number into one shape: a capital letter and the number
 * without its leading zeros, so H0436 and H436 are the same word.
 */
export const normalizeStrongCode = (code, bookNumber = null) => {
  const value = String(code || "").trim();
  const letters = value.match(/[A-Za-z]/);
  const digits = value.match(/\d+/);
  if (!digits) return "";
  const prefix = letters
    ? letters[0].toUpperCase()
    : bookNumber
      ? strongPrefixForBook(bookNumber)
      : "";
  if (prefix !== "G" && prefix !== "H") return "";
  return `${prefix}${Number(digits[0])}`;
};

/**
 * Turns the markup of the KJV+ source into the markers the reader shows.
 * The source writes the number of a word behind the word, as <S>2424</S>.
 */
export const markStrongCodes = (text, bookNumber) =>
  String(text || "").replace(/<S>\s*([A-Za-z]?\d{1,5})\s*<\/S>/gi, (whole, code) => {
    const marked = normalizeStrongCode(code, bookNumber);
    return marked ? ` (${marked})` : " ";
  });

/** The language a Strong's number belongs to. */
export const strongLanguage = (code) => {
  const key = normalizeStrongCode(code);
  if (!key) return "";
  return key.startsWith("G") ? "Greek" : "Hebrew";
};

/** The address of the full lexicon entry of a word. */
export const strongLexiconUrl = (code) => {
  const key = normalizeStrongCode(code);
  if (!key) return "";
  const greek = key.startsWith("G");
  const number = key.slice(1).padStart(4, "0");
  return `https://www.blueletterbible.org/lexicon/${greek ? "g" : "h"}${number}/kjv/${greek ? "tr" : "wlc"}/0-1/`;
};