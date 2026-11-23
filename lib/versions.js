// The Bible versions the reader can install and read.
//
// Every version knows the language it speaks, the file it is fetched from
// and whether it carries the Greek and Hebrew Strong's numbers, so a chapter
// can be cached under its own key and the reader can move between versions
// without losing the place they were reading.

export const VERSIONS = [
  {
    id: "kjv",
    name: "King James Version",
    short: "KJV",
    language: "en",
    translation: "kjv",
    strongs: false,
    note: "The classic 1611 English text."
  },
  {
    id: "kjvp",
    name: "KJV with Strong's numbers",
    short: "KJV+",
    language: "en",
    translation: "kjvp",
    strongs: true,
    note: "The KJV text with the Greek and Hebrew Strong's numbers marked on every verse."
  },
  {
    id: "web",
    name: "World English Bible",
    short: "WEB",
    language: "en",
    translation: "web",
    strongs: false,
    note: "A modern public domain revision of the KJV."
  },
  {
    id: "asv",
    name: "American Standard Version",
    short: "ASV",
    language: "en",
    translation: "asv",
    strongs: false,
    note: "The careful 1901 American revision."
  },
  {
    id: "bsb",
    name: "Berkeley Standard Bible",
    short: "BSB",
    language: "en",
    translation: "bsb",
    strongs: false,
    note: "A readable modern text in the public domain."
  },
  {
    id: "darby",
    name: "Darby Bible",
    short: "DARBY",
    language: "en",
    translation: "darby",
    strongs: false,
    note: "The 1881 Darby translation."
  },
  {
    id: "oeb-us",
    name: "Open English Bible",
    short: "OEB",
    language: "en",
    translation: "oeb-us",
    strongs: false,
    note: "A contemporary public domain translation."
  },
  {
    id: "luganda",
    name: "Luganda Bible",
    short: "LU",
    language: "lu",
    translation: "luganda",
    strongs: false,
    note: "The Bible in Luganda, for reading and teaching in the congregation."
  }
];

export const DEFAULT_VERSION_ID = "kjv";
export const DEFAULT_INSTALLED_IDS = ["kjv", "luganda"];

const STORAGE_KEY = "prayread.versions";
const ACTIVE_KEY = "prayread.activeVersion";

const storage = () => {
  try {
    if (typeof window === "undefined" || !window.localStorage) return null;
    return window.localStorage;
  } catch {
    return null;
  }
};

const readJson = (key, fallback) => {
  try {
    const store = storage();
    if (!store) return fallback;
    const raw = store.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed;
  } catch {
    return fallback;
  }
};

const writeJson = (key, value) => {
  try {
    const store = storage();
    if (!store) return;
    store.setItem(key, JSON.stringify(value));
  } catch {
    // storage is blocked or full: the reader still works, it just forgets
  }
};

/** The version record for an id, or null when the id is unknown. */
export const getVersion = (id) => VERSIONS.find((version) => version.id === id) || null;

/** The version record for an id, falling back to the King James Version. */
export const getVersionOrDefault = (id) => getVersion(id) || getVersion(DEFAULT_VERSION_ID);

/** The versions that are installed on this device. */
export const listInstalledVersions = () => {
  const stored = readJson(STORAGE_KEY, null);
  const ids = Array.isArray(stored) ? stored.filter((id) => getVersion(id)) : DEFAULT_INSTALLED_IDS;
  const unique = Array.from(new Set([...ids, DEFAULT_VERSION_ID]));
  return unique.map((id) => getVersion(id)).filter(Boolean);
};

/** True when the reader has this version installed. */
export const isVersionInstalled = (id) => listInstalledVersions().some((version) => version.id === id);

/** Installs a version and returns the new list of installed versions. */
export const installVersion = (id) => {
  if (!getVersion(id)) return listInstalledVersions();
  const ids = listInstalledVersions().map((version) => version.id);
  if (!ids.includes(id)) ids.push(id);
  writeJson(STORAGE_KEY, ids);
  return listInstalledVersions();
};

/** Removes a version from the device. The KJV always stays. */
export const uninstallVersion = (id) => {
  if (id === DEFAULT_VERSION_ID) return listInstalledVersions();
  const ids = listInstalledVersions()
    .map((version) => version.id)
    .filter((item) => item !== id);
  writeJson(STORAGE_KEY, ids);
  return listInstalledVersions();
};

/** The version the reader is reading in right now. */
export const getActiveVersionId = () => {
  const stored = readJson(ACTIVE_KEY, null);
  const id = typeof stored === "string" ? stored : "";
  if (id && getVersion(id) && isVersionInstalled(id)) return id;
  return DEFAULT_VERSION_ID;
};

/** Remembers the version the reader is reading in. */
export const setActiveVersionId = (id) => {
  if (!getVersion(id)) return getActiveVersionId();
  writeJson(ACTIVE_KEY, id);
  return id;
};

/** The versions that are not installed yet, so the reader can add one. */
export const listAvailableVersions = () => {
  const installed = listInstalledVersions().map((version) => version.id);
  return VERSIONS.filter((version) => !installed.includes(version.id));
};

/** The key a chapter is cached under, so two versions never overwrite. */
export const versionCacheKey = (version) => {
  const record = getVersionOrDefault(version);
  return `${record.language}:${record.id}`;
};