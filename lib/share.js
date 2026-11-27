// Share helpers: one share text per surface, always one link at the end.

import { getBookByNumber } from "@/lib/bibleBooks";
import { fetchPlainChapter } from "@/lib/bibleApi";

const appUrl = (path) => `${window.location.origin}${path}`;

export const shareChannels = [
  { id: "facebook", label: "Facebook" },
  { id: "whatsapp", label: "WhatsApp" },
  { id: "telegram", label: "Telegram" },
  { id: "instagram", label: "Instagram" },
  { id: "linkedin", label: "LinkedIn" },
  { id: "copy", label: "Copy link" }
];

// The full set of networks, in the order the reader expects them: the
// message networks first, then the mail, then the two copy buttons, then
// the phone's own share sheet.
export const fullShareChannels = [
  { id: "whatsapp", label: "WhatsApp", icon: "whatsapp" },
  { id: "facebook", label: "Facebook", icon: "facebook" },
  { id: "twitter", label: "X", icon: "x" },
  { id: "telegram", label: "Telegram", icon: "telegram" },
  { id: "email", label: "Email", icon: "email" },
  { id: "copyLink", label: "Copy Link", icon: "link" },
  { id: "copyText", label: "Copy Text", icon: "text" },
  { id: "native", label: "Share via...", icon: "native", phoneOnly: true }
];

/** True when the phone can open its own share sheet. */
export const canNativeShare = () =>
  typeof navigator !== "undefined" && typeof navigator.share === "function";

export const buildShareUrl = (channel, text, url) => {
  const encodedText = encodeURIComponent(text);
  const encodedUrl = encodeURIComponent(url);
  switch (channel) {
    case "facebook":
      return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
    case "twitter":
      return `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
    case "whatsapp":
      return `https://wa.me/?text=${encodedText}`;
    case "telegram":
      return `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`;
    case "linkedin":
      return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
    case "instagram":
      return `https://www.instagram.com/`;
    default:
      return url;
  }
};

export const copyToClipboard = async (text) => {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    await navigator.clipboard.writeText(text);
    return true;
  }
  const area = document.createElement("textarea");
  area.value = text;
  area.setAttribute("readonly", "");
  area.style.position = "absolute";
  area.style.left = "-9999px";
  document.body.appendChild(area);
  area.select();
  const ok = document.execCommand("copy");
  document.body.removeChild(area);
  return ok;
};

export const openShare = async (channel, text, url, options = {}) => {
  if (channel === "copy") {
    return copyToClipboard(`${text}\n\n${url}`);
  }
  if (channel === "copyLink") {
    return copyToClipboard(url);
  }
  if (channel === "copyText") {
    return copyToClipboard(text);
  }
  if (channel === "email") {
    const subject = options.subject || "Pray-Read Bible";
    const body = options.body || `${text}\n\n${url}`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    return true;
  }
  if (channel === "native") {
    if (!canNativeShare()) {
      return copyToClipboard(`${text}\n\n${url}`);
    }
    try {
      await navigator.share({
        title: options.subject || "Pray-Read Bible",
        text,
        url
      });
      return true;
    } catch {
      return copyToClipboard(`${text}\n\n${url}`);
    }
  }
  const target = buildShareUrl(channel, text, url);
  const windowRef = window.open(target, "_blank", "noopener,noreferrer");
  if (!windowRef) {
    await copyToClipboard(`${text}\n\n${url}`);
  }
  return true;
};

export const devotionalShareText = ({ title, reference, body, related, furtherReadings }, url) =>
  [
    `🙏 ${title}  -  ${reference}`,
    "",
    body,
    "",
    "📖 Related Scriptures:",
    related,
    "",
    "📖 Further readings:",
    furtherReadings,
    "",
    `👉 Read more: ${url}`
  ].join("\n");

export const pageUrl = (path) => appUrl(path);

/** The text of a verse without the Strong's numbers that mark it. */
export const plainVerseText = (text) =>
  String(text || "")
    .replace(/\s*\([GH]\d{1,5}\)/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();

/** The label of a cross-reference: "Isaiah 34:1" or "Isaiah 14:13-14". */
export const crossRefLabel = (row) => {
  const book = getBookByNumber(Number(row && row.ref_book_number));
  const name = book ? book.name : "";
  const chapter = Number(row && row.ref_chapter) || 0;
  const verse = Number(row && row.ref_verse) || 0;
  const end = Number(row && row.ref_verse_end) || 0;
  if (!name || !chapter) return "";
  if (!verse) return `${name} ${chapter}`;
  return end > verse ? `${name} ${chapter}:${verse}-${end}` : `${name} ${chapter}:${verse}`;
};

// The chapters that were already read for a share, so the same scripture is
// never asked for twice.
const sharedChapters = new Map();

/**
 * The text of the verse a cross-reference points at.
 *
 * The text that came with the file is used when it is there. When it is not,
 * the chapter the reference points at is read from the same source the
 * reader reads from, so the scripture is shared in full.
 */
export const crossRefText = async (row) => {
  const stored = String((row && (row.ref_text_en || row.ref_text_lu)) || "").trim();
  if (stored) return stored;
  const bookNumber = Number(row && row.ref_book_number) || 0;
  const chapter = Number(row && row.ref_chapter) || 0;
  if (!bookNumber || !chapter) return "";
  const book = getBookByNumber(bookNumber);
  if (!book) return "";
  const key = `${bookNumber}:${chapter}`;
  if (!sharedChapters.has(key)) {
    const rows = await fetchPlainChapter(bookNumber, book.name, chapter, "en").catch(() => []);
    sharedChapters.set(key, rows);
  }
  const rows = sharedChapters.get(key) || [];
  const list = Array.isArray(rows) ? rows : (rows && rows.verses) || [];
  const from = Number(row.ref_verse) || 0;
  const to = Number(row.ref_verse_end) || from;
  return list
    .filter((verse) => {
      const number = Number(verse && verse.verse);
      return number >= from && number <= to;
    })
    .map((verse) => `${verse.verse} ${plainVerseText(verse.text)}`)
    .join(" ");
};

/**
 * The text of a verse that is shared on social media.
 *
 * It carries the verse in English, the verse in Luganda, the prayer passage
 * in both languages, the cross-references with the text of the verse they
 * point at, and the link back to that very verse.
 */
export const verseShareText = ({
  reference = "",
  english = "",
  luganda = "",
  prayerEn = "",
  prayerLu = "",
  crossRefs = [],
  url = ""
} = {}) => {
  const lines = [];
  if (reference) lines.push(reference);
  if (english) {
    lines.push("");
    lines.push(`“${english}”`);
  }
  if (luganda && luganda !== english) {
    lines.push(`“${luganda}” (Luganda)`);
  }
  if (prayerEn || prayerLu) {
    lines.push("");
    lines.push("🙏 PRAY-READ PRAYER:");
    if (prayerEn) lines.push(prayerEn);
    if (prayerLu && prayerLu !== prayerEn) lines.push(prayerLu);
  }
  if (crossRefs && crossRefs.length) {
    lines.push("");
    lines.push("🔗 CROSS-REFERENCES:");
    crossRefs.forEach((row) => {
      const label = row.label || crossRefLabel(row);
      const text = row.text || "";
      if (label && text) lines.push(`${label}  -  ${text}`);
      else if (label) lines.push(label);
      else if (text) lines.push(text);
    });
  }
  if (url) {
    lines.push("");
    lines.push(`Read & pray this verse: ${url}`);
  }
  lines.push("");
  lines.push("Shared from Pray-Read Bible.");
  return lines.join("\n");
};