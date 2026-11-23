// Shared helpers for safe rendering of any record that came from the database.

export const safeText = (value) => {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return "";
};

export const safeId = (value) => safeText(value);

export const splitList = (value) =>
  safeText(value)
    .split(/[,;\n]/)
    .map((item) => item.trim())
    .filter(Boolean);

export const titleCase = (value) =>
  safeText(value)
    .split(" ")
    .map((word) => (word ? word[0].toUpperCase() + word.slice(1) : word))
    .join(" ");

export const formatDuration = (seconds) => {
  const total = Number(seconds) || 0;
  if (!total) return "";
  const mins = Math.floor(total / 60);
  const secs = Math.floor(total % 60);
  return `${mins}:${String(secs).padStart(2, "0")}`;
};

export const clampPercent = (value) => Math.min(100, Math.max(0, Number(value) || 0));

export const bytesToMb = (bytes) => {
  const value = Number(bytes) || 0;
  if (!value) return 0;
  return Math.round((value / (1024 * 1024)) * 10) / 10;
};