import { offline } from "@/lib/offlineDb";
import { normalizeStrongCode } from "@/lib/strongs";

/**
 * The Strong's numbers are kept on the device as well.
 *
 * The definition card of a word has to work without a connection, so the
 * definitions that are in the app are copied into the offline store of the
 * reader. The copy is read first, so a reader in a place with no signal
 * still gets the meaning of the word they tapped.
 */

/** The key a definition is kept under. */
export const strongsKey = (code) => {
  const clean = normalizeStrongCode(code);
  return clean ? `strongs:${clean}` : "";
};

/** The shape a definition is kept in. */
const toEntry = (entry) => ({
  code: normalizeStrongCode(entry.code),
  language: entry.language || "",
  original_word: entry.original_word || "",
  transliteration: entry.transliteration || "",
  pronunciation: entry.pronunciation || "",
  part_of_speech: entry.part_of_speech || "",
  root_word: entry.root_word || "",
  definition: entry.definition || "",
  source: entry.source || ""
});

/** Reads a definition from the copy that is on the device. */
export const readOfflineStrong = async (code) => {
  const key = strongsKey(code);
  if (!key) return null;
  try {
    const entry = await offline.get("strongs", key);
    return entry && entry.definition ? entry : null;
  } catch {
    return null;
  }
};

/**
 * Keeps a whole list of definitions on the device.
 * They are written in one transaction, so a long dictionary does not open
 * thousands of transactions one after the other.
 */
export const writeOfflineStrongs = async (entries) => {
  const rows = [];
  (entries || []).forEach((entry) => {
    if (!entry || !entry.code) return;
    const key = strongsKey(entry.code);
    if (!key) return;
    rows.push({ key, value: toEntry(entry) });
  });
  if (!rows.length) return 0;
  try {
    await offline.putMany("strongs", rows);
    return rows.length;
  } catch {
    return 0;
  }
};

/** Keeps a definition on the device. */
export const writeOfflineStrong = async (entry) => {
  const saved = await writeOfflineStrongs([entry]);
  return saved > 0;
};

/** How many definitions are on the device. */
export const countOfflineStrong = async () => {
  try {
    return await offline.count("strongs");
  } catch {
    return 0;
  }
};

/**
 * The Strong's numbers the KJV+ chapters on the device really carry.
 * The answer is taken from the text that is stored, so the numbers that are
 * asked for are the ones the reader will actually tap.
 */
export const readOfflineStrongCodes = async () => {
  try {
    const chapters = await offline.getAll("chapters");
    const codes = new Set();
    (chapters || []).forEach((chapter) => {
      if (!chapter || chapter.version !== "kjvp") return;
      (chapter.verses || []).forEach((verse) => {
        const found = String(verse.text || "").match(/\(([GH]\d{1,5})\)/g) || [];
        found.forEach((item) => {
          const code = normalizeStrongCode(item.replace(/[()]/g, ""));
          if (code) codes.add(code);
        });
      });
    });
    return [...codes].sort();
  } catch {
    return [];
  }
};