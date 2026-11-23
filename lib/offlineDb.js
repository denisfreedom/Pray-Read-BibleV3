// A small typed-ish IndexedDB wrapper used for the offline centre.
// Stores: books, chapters, verses, devotionals, commentary, qa, verseOfDay,
// meta, highlights, bookmarks.

const DB_NAME = "prayread-offline";
const DB_VERSION = 2;

export const STORES = [
  "books",
  "chapters",
  "verses",
  "devotionals",
  "commentary",
  "qa",
  "verseOfDay",
  "meta",
  "highlights",
  "bookmarks"
];

let dbPromise = null;

const openDb = () => {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("Offline storage is not available in this browser."));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      STORES.forEach((store) => {
        if (!db.objectStoreNames.contains(store)) {
          db.createObjectStore(store, { keyPath: "key" });
        }
      });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error("Could not open offline storage."));
  });
  return dbPromise;
};

const run = async (store, mode, action) => {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, mode);
    const objectStore = tx.objectStore(store);
    let result;
    try {
      result = action(objectStore);
    } catch (error) {
      reject(error);
      return;
    }
    tx.oncomplete = () => resolve(result && result.result !== undefined ? result.result : result);
    tx.onerror = () => reject(tx.error || new Error("Offline storage failed."));
    tx.onabort = () => reject(tx.error || new Error("Offline storage was cancelled."));
  });
};

export const offline = {
  isAvailable: () => typeof indexedDB !== "undefined",

  async put(store, key, value) {
    return run(store, "readwrite", (objectStore) =>
      objectStore.put({ key, value, saved_at: Date.now() })
    );
  },

  async putMany(store, entries) {
    for (const entry of entries) {
      await offline.put(store, entry.key, entry.value);
    }
    return entries.length;
  },

  async get(store, key) {
    const record = await run(store, "readonly", (objectStore) => objectStore.get(key));
    return record ? record.value : null;
  },

  async getAll(store) {
    const records = await run(store, "readonly", (objectStore) => objectStore.getAll());
    return (records || []).map((record) => record.value);
  },

  async count(store) {
    return run(store, "readonly", (objectStore) => objectStore.count());
  },

  async remove(store, key) {
    return run(store, "readwrite", (objectStore) => objectStore.delete(key));
  },

  async clearStore(store) {
    return run(store, "readwrite", (objectStore) => objectStore.clear());
  },

  async clearAll() {
    for (const store of STORES) {
      await offline.clearStore(store);
    }
  },

  async estimate() {
    if (navigator.storage && navigator.storage.estimate) {
      const { usage = 0, quota = 0 } = await navigator.storage.estimate();
      return { usage, quota };
    }
    return { usage: 0, quota: 0 };
  }
};

export const chapterKey = (bookNumber, chapter) => `${bookNumber}:${chapter}`;
export const verseKey = (bookNumber, chapter, verse) => `${bookNumber}:${chapter}:${verse}`;