import { openDB } from 'idb';

const DB_NAME = 'AureaVoiceDB';
const DB_VERSION = 1;
const PRACTICE_STORE_NAME = 'practice_sessions';

const dbPromise = openDB(DB_NAME, DB_VERSION, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(PRACTICE_STORE_NAME)) {
      const store = db.createObjectStore(PRACTICE_STORE_NAME, { keyPath: 'id', autoIncrement: true });
      store.createIndex('id_sesi', 'id_sesi', { unique: false });
      store.createIndex('id_kategori', 'id_kategori', { unique: false });
    }
  },
});

export const PracticeDB = {
  async addSession(sessionData) {
    return (await dbPromise).add(PRACTICE_STORE_NAME, sessionData);
  },

  async getSessionsByCategoryId(categoryId) {
    const db = await dbPromise;
    const tx = db.transaction(PRACTICE_STORE_NAME, 'readonly');
    const store = tx.objectStore(PRACTICE_STORE_NAME);
    const index = store.index('id_kategori');
    return index.getAll(categoryId);
  },

  async getAllSessions() {
    return (await dbPromise).getAll(PRACTICE_STORE_NAME);
  },
};

export default dbPromise;
