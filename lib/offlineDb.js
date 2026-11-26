// A small typed-ish IndexedDB wrapper used by the offline centre.
// Stores: books, chapters, verses, devotionals, commentary, prayers, qa,
// verseOfDay, meta, highlights, bookmarks, notes, annotations, strongs,
// prayerPassages, crossReferences, chapterIntros.
//
// The database is repaired by itself: when a device holds an older shape of
// it, the missing stores are added on the next open and nothing that is
// already saved is lost. A store that is asked for by name and is not there
// is reported in clear words, so a download never dies on a strange error.

const DB_NAME = "prayread-offline";
const DB_VERSION = 8;

export const STORES = [
  "books",
  "chapters",
  "verses",
  "devotionals",
  "commentary",
  "prayers",
  "prayerPassages",
  "crossReferences",
  "chapterIntros",
  "qa",
  "verseOfDay",
  "meta",
  "highlights",
  "bookmarks",
  "notes",
  "annotations",
  "strongs"
];

let dbPromise = null;

/**
 * Opens the database. A version number is given when it is known, and it is
 * left out when the device already holds a newer shape of it.
 */
const openAt = (version) =>
  new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("Offline storage is not available in this browser."));
      return;
    }
    let blocked = null;
    const request = version ? indexedDB.open(DB_NAME, version) : indexedDB.open(DB_NAME);
    request.onupgradeneeded = () => {
      const db = request.result;
      STORES.forEach((store) => {
        if (!db.objectStoreNames.contains(store)) {
          db.createObjectStore(store, { keyPath: "key" });
        }
      });
    };
    request.onsuccess = () => {
      if (blocked) clearTimeout(blocked);
      const db = request.result;
      // Another tab may need to change the shape of the database: the
      // connection is closed so the change is not held up.
      db.onversionchange = () => {
        db.close();
        dbPromise = null;
      };
      resolve(db);
    };
    request.onerror = () => {
      if (blocked) clearTimeout(blocked);
      reject(request.error || new Error("Could not open offline storage."));
    };
    request.onblocked = () => {
      if (blocked) return;
      blocked = setTimeout(() => {
        reject(new Error("Another tab is using the offline storage. Close it and try again."));
      }, 8000);
    };
  });

/**
 * The open database. It is opened once and kept for the whole session.
 * A device that holds an older shape of the database is taken one version
 * higher, so the stores that are missing are added and the data that is
 * already saved stays where it is.
 */
const openDb = async () => {
  if (dbPromise) return dbPromise;
  dbPromise = (async () => {
    let db = null;
    try {
      db = await openAt(DB_VERSION);
    } catch {
      // The device already holds a newer shape of the database: it is
      // opened without a number and the missing stores are added below.
      db = await openAt();
    }
    const missing = STORES.filter((store) => !db.objectStoreNames.contains(store));
    if (missing.length) {
      const higher = await openAt(db.version + 1);
      db.close();
      db = higher;
    }
    return db;
  })();
  try {
    return await dbPromise;
  } catch (error) {
    dbPromise = null;
    throw error;
  }
};

/** True when the store is ready on this device. */
export const hasStore = async (store) => {
  try {
    const db = await openDb();
    return db.objectStoreNames.contains(store);
  } catch {
    return false;
  }
};

const run = async (store, mode, action) => {
  const db = await openDb();
  if (!db.objectStoreNames.contains(store)) {
    throw new Error(`The offline store "${store}" is not ready on this device.`);
  }
  return new Promise((resolve, reject) => {
    let tx = null;
    try {
      tx = db.transaction(store, mode);
    } catch (error) {
      reject(error);
      return;
    }
    const objectStore = tx.objectStore(store);
    let result;
    try {
      result = action(objectStore);
    } catch (error) {
      try {
        tx.abort();
      } catch {
        /* the transaction was already finished */
      }
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

  /**
   * Keeps a whole list of records in one transaction, so a long download
   * does not open thousands of them one after the other.
   */
  async putMany(store, entries) {
    const list = Array.isArray(entries) ? entries.filter((entry) => entry && entry.key) : [];
    if (!list.length) return 0;
    const db = await openDb();
    if (!db.objectStoreNames.contains(store)) {
      throw new Error(`The offline store "${store}" is not ready on this device.`);
    }
    return new Promise((resolve, reject) => {
      const tx = db.transaction(store, "readwrite");
      const objectStore = tx.objectStore(store);
      const savedAt = Date.now();
      try {
        list.forEach((entry) => {
          objectStore.put({ key: entry.key, value: entry.value, saved_at: savedAt });
        });
      } catch (error) {
        try {
          tx.abort();
        } catch {
          /* the transaction was already finished */
        }
        reject(error);
        return;
      }
      tx.oncomplete = () => resolve(list.length);
      tx.onerror = () => reject(tx.error || new Error("Offline storage failed."));
      tx.onabort = () => reject(tx.error || new Error("Offline storage was cancelled."));
    });
  },

  async get(store, key) {
    const record = await run(store, "readonly", (objectStore) => objectStore.get(key));
    if (!record || typeof record !== "object") return null;
    return "value" in record ? record.value : null;
  },

  async getAll(store) {
    const records = await run(store, "readonly", (objectStore) => objectStore.getAll());
    return (records || [])
      .filter((record) => record && typeof record === "object" && "value" in record)
      .map((record) => record.value);
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
      if (!(await hasStore(store))) continue;
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

// The language is part of the key so an English chapter and its Luganda
// translation never overwrite each other in the cache.
export const chapterKey = (bookNumber, chapter, language = "en", version = "") =>
  version ? `${bookNumber}:${chapter}:${language}:${version}` : `${bookNumber}:${chapter}:${language}`;
export const verseKey = (bookNumber, chapter, verse) => `${bookNumber}:${chapter}:${verse}`;
export const markKey = (bookNumber, chapter, verse, markType) => `${bookNumber}:${chapter}:${verse}:${markType}`;