# Database

## Cuplikan Kode Penting

Fungsi `openDB` di `aureaVoiceDB.js` adalah landasan modul database. Ini menangani koneksi ke IndexedDB dan mengelola peningkatan skema, memastikan bahwa struktur database selalu mutakhir.

```javascript
// src/utils/database/aureaVoiceDB.js

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
```

Cuplikan ini sangat penting karena menunjukkan:
- **Inisialisasi Database**: Ini mendefinisikan nama dan versi database, yang penting untuk operasi IndexedDB.
- **Manajemen Skema**: Penanganan acara `onupgradeneeded` digunakan untuk membuat dan memperbarui penyimpanan objek dan indeks. Ini memastikan bahwa skema database diatur dengan benar ketika aplikasi pertama kali dijalankan atau ketika versi database ditingkatkan.
- **Operasi Asinkron**: Fungsi mengembalikan Promise, memungkinkan operasi database asinkron, yang merupakan tipikal untuk API web.
- **Penanganan Kesalahan**: Ini mencakup panggilan balik `onsuccess` dan `onerror` untuk menangani hasil permintaan pembukaan database.

Aplikasi ini menggunakan **IndexedDB**, database sisi klien yang dibangun ke dalam browser web modern, untuk menyimpan data persisten. Pilihan teknologi ini memungkinkan aplikasi untuk berfungsi offline dan untuk mempertahankan data pengguna di seluruh sesi tanpa bergantung pada database sisi server untuk konten inti.

Database, bernama `AureaVoiceDB`, distrukturkan menjadi tiga penyimpanan objek utama:

1.  **`categories`**: Penyimpanan ini menyimpan informasi utama untuk setiap kategori latihan, seperti ID dan judulnya.
2.  **`practices`**: Penyimpanan ini berisi item latihan individual. Setiap item ditautkan ke kategori dan mencakup kalimat atau kata-kata tertentu untuk dilatih pengguna.
3.  **`practice_sessions`**: Penyimpanan ini mencatat hasil setiap sesi latihan pengguna, termasuk ID latihan, kategori, skor rata-rata, dan tanggal sesi.

Arsitektur ini memastikan pemisahan data yang jelas, membuatnya mudah untuk mengelola dan mengkueri informasi yang dibutuhkan untuk berbagai bagian aplikasi.

## Operasi Data

Semua interaksi dengan IndexedDB ditangani oleh modul `aureaVoiceDB.js`, yang menyediakan serangkaian fungsi asinkron untuk membaca dan menulis data.

### Operasi Baca

-   **`getCategories()`**: Mengambil semua kategori latihan dari penyimpanan `categories`.
-   **`getPracticesByCategory(id_kategori)`**: Mengambil semua item latihan untuk kategori tertentu dari penyimpanan `practices` menggunakan indeks pada ID kategori.
-   **`getAllPracticeSessions()`**: Mengambil semua hasil sesi latihan yang disimpan, yang digunakan oleh dasbor untuk menghitung statistik pengguna.

### Operasi Tulis

-   **`saveCategories(categories)`**: Menyimpan array objek kategori ke penyimpanan `categories`.
-   **`savePractices(practices)`**: Menyimpan array item latihan ke penyimpanan `practices`.
-   **`savePracticeSession({ ... })`**: Menambahkan catatan baru ke penyimpanan `practice_sessions`, mencatat detail sesi latihan yang telah selesai.

## Integrasi dengan Basis Kode

Database terutama diintegrasikan melalui proses seeding dan oleh model fitur yang membutuhkan data persisten.

### Seeding Database

### `seedDB.js`

Modul ini bertanggung jawab untuk mengisi database dengan data awal jika kosong. Ini memeriksa apakah kategori dan latihan ada, dan jika tidak, ia menggunakan `practiceDataSeed.js` untuk mengisi database.

```javascript
// src/utils/database/seedDB.js

import { getCategories, saveCategories, getPracticesByCategory, savePractices } from './aureaVoiceDB.js';
import CategoryModel from '../../features/category/models/CategoryModel.js';
import { practiceSeedData } from './practiceDataSeed.js';

const CATEGORY_IDS = [
  'inventaris-vokal',
  'inventaris-konsonan',
  'struktur-suku-kata',
  'penekanan-kata',
  'irama-bahasa',
  'skenario-dunia-nyata'
];

export async function seedIfNeeded() {
  // Seed kategori
  const categories = await getCategories();
  if (!categories || categories.length === 0) {
    const categoryModel = new CategoryModel();
    const categoryData = [];
    for (const id of CATEGORY_IDS) {
      await categoryModel.setCurrentCategory(id);
      const data = categoryModel.getCategoryData();
      categoryData.push({
        id: data.id,
        title: data.title,
        // Tambahkan field lain jika perlu
      });
    }
    await saveCategories(categoryData);
  }

  // Seed latihan/practice
  for (const categoryId of CATEGORY_IDS) {
    const practices = await getPracticesByCategory(categoryId);
    if (!practices || practices.length === 0) {
      const items = practiceSeedData.filter(item => item.id_kategori === categoryId);
      if (items.length > 0) {
        await savePractices(items);
      }
    }
  }
}
```

Cuplikan ini menunjukkan fungsi `seedIfNeeded`, yang bertanggung jawab untuk memastikan bahwa IndexedDB diisi dengan data awal. Ini memeriksa apakah kategori dan data latihan sudah ada di database, dan jika tidak, ia menggunakan `CategoryModel` dan `practiceSeedData` untuk mengisinya. Fungsi ini sangat penting untuk menyiapkan status awal aplikasi dan memastikan bahwa pengguna memiliki konten untuk berinteraksi sejak awal.

### `practiceDataSeed.js`

File ini berisi data mentah untuk semua latihan, yang terstruktur sebagai array objek JavaScript. Data ini digunakan oleh `seedDB.js` untuk mengisi penyimpanan `practices`.

```javascript
// src/utils/database/practiceDataSeed.js

export const practiceSeedData = [
  // Irama Bahasa
  {
    id_latihan: "IB-001",
    id_kategori: "irama-bahasa",
    nama_latihan: "Intonasi WH- Questions",
    instruksi:
      "Latih intonasi turun untuk pertanyaan WH- dengan kalimat berikut.",
    kata_kata: [
      "What is your name, and can you please spell it for me? ➘ Where are you from, and how long have you lived there? ➘ Why did she leave early even though the event was still ongoing? ➘ How do you make this recipe step by step so I can try it at home? ➘",
      "Who called you last night when you were about to go to sleep? ➘ When does the meeting start, and do we need to prepare anything in advance? ➘ Which one do you prefer, the blue dress or the red one for the party? ➘ Whose car is parked outside in front of our house since this morning? ➘",
      // ... (more sentences)
    ],
  },
  // Inventaris Konsonan
  {
    id_latihan: "KI-001",
    id_kategori: "inventaris-konsonan",
    nama_latihan: "Latihan Dasar /θ/ dan /t/",
    instruksi:
      "Latih perbedaan antara bunyi /θ/ (seperti pada 'think') dan /t/ (seperti pada 'tink'). Letakkan ujung lidah di antara gigi untuk /θ/.",
    kata_kata: [
      "I think the tree in the garden is taller than the tree in the park, but my friend said he tink the tree in the park is bigger. The teacher asked us to think carefully before we act, but my brother always tink he knows best. Sometimes I think about the future and wonder what it will bring, while my cousin tink only about the present. She said she would think of a solution, but he just tink it’s not a big problem.",
      // ... (more sentences)
    ],
  },
  // ... (more practice data)
];
```

Cuplikan ini memberikan contoh yang jelas tentang struktur data latihan. Setiap objek mewakili item latihan dengan ID unik, kategori, nama, instruksi, dan array kalimat (`kata_kata`) untuk dilatih pengguna. Data terstruktur ini penting untuk mengisi latihan aplikasi dan memastikan pengalaman belajar yang konsisten.

### Integrasi Fitur

-   **`CategoryModel.js`**: Model ini berinteraksi dengan database untuk mengambil detail kategori latihan tertentu.
-   **`DashboardModel.js`**: Model ini sangat bergantung pada database untuk mendapatkan semua data sesi latihan, yang kemudian diproses untuk menghasilkan statistik pengguna dan grafik kemajuan.
-   **`PracticePresenter.js`**: Setelah pengguna menyelesaikan latihan 4 sesi, presenter memanggil `savePracticeSession` untuk mencatat skor rata-rata dan data relevan lainnya ke database.

Dengan memusatkan semua operasi database di `aureaVoiceDB.js` dan menggunakan mekanisme seeding yang jelas, aplikasi memastikan manajemen data yang konsisten dan andal, memungkinkan komponen fitur untuk tetap fokus pada logika spesifik mereka tanpa terikat erat dengan implementasi database.