import { openDB } from 'idb';

const DB_NAME = 'andrestory-db';
const DB_VERSION = 2; // versi dinaikkan supaya upgrade jalan
const STORE_NAME = 'pendingStories';

const dbPromise = openDB(DB_NAME, DB_VERSION, {
  upgrade(db, oldVersion, newVersion, transaction) {
    if (oldVersion < 1) {
      db.createObjectStore(STORE_NAME, { keyPath: 'id' });
    }
    if (oldVersion === 1) {
      // hapus object store lama dan buat ulang
      if (db.objectStoreNames.contains(STORE_NAME)) {
        db.deleteObjectStore(STORE_NAME);
      }
      db.createObjectStore(STORE_NAME, { keyPath: 'id' });
    }
  },
});

export async function saveStoryOffline(story) {
  const db = await dbPromise;
  await db.put(STORE_NAME, story);
}

export async function getAllPendingStories() {
  const db = await dbPromise;
  return await db.getAll(STORE_NAME);
}

export async function deleteStoryByDate(date) {
  const db = await dbPromise;
  await db.delete(STORE_NAME, date);
}

export async function clearPendingStories() {
  const db = await dbPromise;
  await db.clear(STORE_NAME);
}
