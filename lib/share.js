// Share helpers: one share text per surface, always one link at the end.

const appUrl = (path) => `${window.location.origin}${path}`;

export const shareChannels = [
  { id: "facebook", label: "Facebook" },
  { id: "whatsapp", label: "WhatsApp" },
  { id: "telegram", label: "Telegram" },
  { id: "instagram", label: "Instagram" },
  { id: "linkedin", label: "LinkedIn" },
  { id: "copy", label: "Copy link" }
];

export const buildShareUrl = (channel, text, url) => {
  const encodedText = encodeURIComponent(text);
  const encodedUrl = encodeURIComponent(url);
  switch (channel) {
    case "facebook":
      return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
    case "whatsapp":
      return `https://api.whatsapp.com/send?text=${encodedText}`;
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

export const openShare = async (channel, text, url) => {
  if (channel === "copy") {
    return copyToClipboard(`${text}\n\n${url}`);
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