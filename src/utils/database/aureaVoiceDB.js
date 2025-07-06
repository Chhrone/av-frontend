// src/utils/database/aureaVoiceDB.js
// IndexedDB helper for AureaVoice: kategori, latihan, hasil sesi latihan

const DB_NAME = 'AureaVoiceDB';
const DB_VERSION = 1;

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('categories')) {
        db.createObjectStore('categories', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('practices')) {
        const store = db.createObjectStore('practices', { keyPath: 'id_latihan' });
        store.createIndex('id_kategori', 'id_kategori', { unique: false });
      }
      if (!db.objectStoreNames.contains('practice_sessions')) {
        const store = db.createObjectStore('practice_sessions', { keyPath: 'id_sesi', autoIncrement: true });
        store.createIndex('id_latihan', 'id_latihan', { unique: false });
        store.createIndex('nama_kategori', 'nama_kategori', { unique: false });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// CATEGORY
export async function saveCategories(categories) {
  const db = await openDB();
  const tx = db.transaction('categories', 'readwrite');
  const store = tx.objectStore('categories');
  categories.forEach(cat => store.put(cat));
  return tx.complete;
}

export async function getCategories() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('categories', 'readonly');
    const req = tx.objectStore('categories').getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

// PRACTICE
export async function savePractices(practices) {
  const db = await openDB();
  const tx = db.transaction('practices', 'readwrite');
  const store = tx.objectStore('practices');
  practices.forEach(pr => store.put(pr));
  return tx.complete;
}

export async function getPracticesByCategory(id_kategori) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('practices', 'readonly');
    const idx = tx.objectStore('practices').index('id_kategori');
    const req = idx.getAll(id_kategori);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

// PRACTICE SESSION RESULT
export async function savePracticeSession({
  id_latihan,
  nama_kategori,
  nama_latihan,
  hasil_sesi, // average score atau object hasil lain
  tanggal = new Date().toISOString(),
  durasi // durasi sesi latihan dalam detik atau format lain
}) {
  const db = await openDB();
  const tx = db.transaction('practice_sessions', 'readwrite');
  const sessionData = {
    id_latihan,
    nama_kategori,
    nama_latihan,
    hasil_sesi,
    tanggal
  };
  if (typeof durasi !== 'undefined') {
    sessionData.durasi = durasi;
  }
  tx.objectStore('practice_sessions').add(sessionData);
  return tx.complete;
}

export async function getPracticeSessionsByLatihan(id_latihan) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('practice_sessions', 'readonly');
    const idx = tx.objectStore('practice_sessions').index('id_latihan');
    const req = idx.getAll(id_latihan);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function getAllPracticeSessions() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('practice_sessions', 'readonly');
    const req = tx.objectStore('practice_sessions').getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}
