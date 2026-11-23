import { format } from "date-fns";

export const toISODate = (date = new Date()) => {
  const d = new Date(date);
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
};

export const shiftISODate = (iso, delta) => {
  const d = new Date(`${iso}T00:00:00`);
  d.setDate(d.getDate() + delta);
  return toISODate(d);
};

export const formatDateLabel = (iso) => {
  if (!iso) return "";
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return format(d, "MMM d, yyyy");
};

export const shortWeekday = (iso) => {
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return "";
  return format(d, "EEE");
};

export const lastSevenDays = (iso = toISODate()) => {
  const days = [];
  for (let i = 6; i >= 0; i -= 1) {
    days.push(shiftISODate(iso, -i));
  }
  return days;
};

export const computeStreak = (readings) => {
  const dates = new Set((readings || []).filter((r) => r.read_date).map((r) => r.read_date));
  if (dates.size === 0) return 0;
  let cursor = toISODate();
  if (!dates.has(cursor)) {
    cursor = shiftISODate(cursor, -1);
    if (!dates.has(cursor)) return 0;
  }
  let streak = 0;
  while (dates.has(cursor)) {
    streak += 1;
    cursor = shiftISODate(cursor, -1);
  }
  return streak;
};

export const greetingFor = (hour = new Date().getHours()) => {
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};