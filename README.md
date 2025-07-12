# AureaVoice Frontend

Aplikasi web modern *single-page application* (SPA) yang dirancang untuk membantu pengguna melatih dan menguji aksen berbicara dalam bahasa Inggris. Dibangun menggunakan **JavaScript murni (vanilla)** tanpa *framework* eksternal, aplikasi ini mengimplementasikan arsitektur **Model-View-Presenter (MVP)** yang modular dan skalabel.

Aplikasi ini menawarkan alur kerja yang terstruktur, mulai dari pengenalan awal, dasbor pengguna, hingga sesi latihan interaktif, dengan memanfaatkan teknologi web modern seperti **Vite**, **IndexedDB**, dan **View Transitions API**.

---

## 🚀 Fitur Utama

- **Alur Pengenalan (Intro Flow)**: Pengguna baru akan melalui serangkaian halaman pengenalan (`Welcome`, `Test`, `Result`) untuk mengukur kemampuan awal mereka.
- **Dasbor Pengguna**: Menampilkan ringkasan kemajuan, statistik, dan rekomendasi latihan yang dipersonalisasi.
- **Kategori Latihan**: Menyediakan materi pembelajaran yang terstruktur berdasarkan kategori fonetik (misalnya, vokal, konsonan, intonasi).
- **Sesi Latihan Interaktif**: Pengguna dapat merekam suara mereka, mengirimkannya untuk dianalisis, dan menerima umpan balik langsung.
- **Manajemen Data Lokal**: Semua kemajuan dan data latihan disimpan di sisi klien menggunakan IndexedDB, memungkinkan penggunaan offline.
- **Dukungan Mode Ganda**: Aplikasi dapat dihubungkan ke API deteksi aksen berbasis AI atau berjalan dalam mode *mock* untuk pengembangan dan demonstrasi.

---

## 🛠️ Teknologi yang Digunakan

- **Build Tool**: **Vite** untuk pengembangan dan *bundling* yang super cepat.
- **Bahasa**: **JavaScript (ES6+)** murni tanpa *framework* UI.
- **Arsitektur**: **Model-View-Presenter (MVP)** untuk pemisahan tanggung jawab yang jelas.
- **Routing**: Kombinasi **Hash Routing** (untuk alur intro) dan **History API** (untuk fitur utama).
- **Animasi Transisi**: **View Transitions API** untuk transisi antar halaman yang mulus.
- **Penyimpanan**: **IndexedDB** untuk menyimpan data aplikasi di peramban.
- **Styling**: **CSS modular** dengan variabel global untuk konsistensi tema.
- **Ikon**: **SVG** yang diimpor sebagai komponen JavaScript untuk fleksibilitas.

---

## 📂 Struktur Proyek dan Arsitektur

Struktur proyek dirancang agar modular dan mudah dikelola, dengan setiap fitur utama terisolasi dalam direktorinya sendiri.

```text
src/
├── assets/         # Ikon SVG dan aset statis lainnya.
├── config/         # Konfigurasi aplikasi (misalnya, endpoint API, mode mock).
├── features/       # Direktori utama untuk semua fitur aplikasi.
│   ├── intro/      # Alur pengenalan (Welcome, Test, Result).
│   ├── dashboard/  # Dasbor pengguna.
│   ├── category/   # Halaman kategori dan materi latihan.
│   └── practice/   # Sesi latihan interaktif.
├── lib/            # Pustaka pihak ketiga atau internal.
├── shared/         # Komponen UI global (Navbar, Footer).
├── styles/         # File CSS global (variabel, layout dasar, animasi).
├── utils/          # Utilitas dan service (Router, Audio Recorder, DB Helper).
└── main.js         # Titik masuk (entry point) aplikasi.
```

---

## 🌊 Alur Kerja Fitur (Feature Workflows)

Setiap fitur memiliki alur kerja yang spesifik untuk memandu pengguna melalui aplikasi.

### 1. Alur Pengenalan (Intro Flow)
Fitur ini dirancang sebagai SPA mini di dalam aplikasi utama untuk memberikan pengalaman pertama yang mulus.
- **Trigger**: Pengguna baru membuka aplikasi.
- **Alur**:
    1.  **Welcome (`/#/welcome`)**: Pengguna disambut dan diberikan pengantar singkat.
    2.  **Test (`/#/test`)**: Pengguna diminta merekam beberapa kalimat sampel. `RecordingManager.js` digunakan untuk mengelola proses perekaman.
    3.  **Analisis**: Rekaman dikirim ke `AccentDetectionService.js`, yang mengembalikan skor kepercayaan (baik dari API nyata atau *mock*).
    4.  **Result (`/#/result`)**: Hasil analisis ditampilkan kepada pengguna.
    5.  **Redirect**: Setelah melihat hasil, pengguna secara otomatis diarahkan ke dasbor utama.
- **Teknologi**: Menggunakan `introRouter.js` (berbasis hash) dan **View Transitions API** untuk navigasi yang terasa instan tanpa memuat ulang halaman.

```javascript
// Cuplikan dari src/utils/introRouter.js
// Menangani navigasi berbasis hash dan menerapkan View Transitions API
handleRouteChange() {
    let hash = window.location.hash.slice(1) || '/welcome';
    const routeHandler = this.routes[hash];

    if (routeHandler) {
        const useTransition = this.isIntroRoute(hash) && 'startViewTransition' in document;

        if (useTransition) {
            document.startViewTransition(() => routeHandler());
        } else {
            routeHandler();
        }
    }
}
```

### 2. Dasbor Pengguna
Dasbor adalah halaman utama setelah pengguna menyelesaikan alur pengenalan.
- **Trigger**: Pengguna mengunjungi rute `/dashboard`.
- **Alur**:
    1.  `DashboardPresenter.js` mengambil data kemajuan dari `aureaVoiceDB.js` (IndexedDB).
    2.  Data ini mencakup riwayat latihan, skor rata-rata, dan kategori yang paling sering dilatih.
    3.  `DashboardView.js` merender data ini dalam bentuk kartu statistik, grafik (jika ada), dan daftar rekomendasi latihan.
    4.  Pengguna dapat menavigasi ke kategori atau sesi latihan yang direkomendasikan langsung dari dasbor.

### 3. Sesi Latihan (Practice Flow)
Ini adalah fitur inti di mana pengguna secara aktif melatih aksen mereka.
- **Trigger**: Pengguna memilih sebuah materi dari halaman kategori dan memulai latihan (`/practice/:categoryId/:practiceId`).
- **Alur**:
    1.  `PracticePresenter.js` memuat detail latihan (kalimat yang harus dibaca, instruksi) dari model.
    2.  `PracticeTestView.js` menampilkan kalimat dan mengaktifkan tombol rekam.
    3.  Pengguna menekan tombol rekam, dan `AudioRecorder.js` mulai menangkap audio.
    4.  Setelah selesai, rekaman dikirim ke `AccentDetectionService.js`.
    5.  `PracticeResultView.js` menampilkan hasil analisis, termasuk skor dan umpan balik.
    6.  Hasilnya disimpan ke IndexedDB untuk melacak kemajuan dari waktu ke waktu.

```javascript
// Cuplikan dari src/features/practice/presenters/PracticePresenter.js
// Mengelola logika saat tombol rekam ditekan
async toggleRecording() {
    if (this.recordingService.isRecording) {
        // Berhenti merekam dan proses hasil
        this.recordingService.stopRecordingTimer();
        const recording = await this.recordingManager.stopRecording();
        const result = await accentDetectionService.analyzeAccent(recording.audioBlob);
        const score = this.resultService.getScoreFromResult(result);
        this.sessionScores.push(score);
        this.showResultView(result);
    } else {
        // Mulai merekam
        this.recordingService.startRecordingTimer(/*...*/);
        await this.recordingManager.startRecording();
    }
}
```

---

## 🔧 Peran File-File Kunci

### `main.js`: Titik Masuk Aplikasi
`main.js` adalah file pertama yang dieksekusi. Perannya adalah:
1.  **Inisialisasi Global**: Mengimpor semua file CSS global dari `src/styles/` untuk memastikan gaya dasar diterapkan di seluruh aplikasi.
2.  **Setup Database**: Memanggil fungsi `seedDB.js` untuk mengisi IndexedDB dengan data awal jika diperlukan.
3.  **Inisialisasi Presenter Global**: Membuat instance dari `NavbarPresenter` dan `FooterPresenter` yang akan ditampilkan di semua halaman.
4.  **Setup Router**: Memanggil `routerSetup()` dari `utils/routerSetup.js` untuk mengonfigurasi rute utama aplikasi (berbasis History API) dan `introRouter()` dari `utils/introRouter.js` untuk rute alur pengenalan (berbasis hash).
5.  **Render Awal**: Menentukan halaman mana yang harus ditampilkan saat aplikasi pertama kali dimuat berdasarkan URL saat ini.

### Utilitas Penting (`src/utils/`)
Direktori `utils` berisi modul-modul penting yang mendukung fungsionalitas aplikasi:

- **`appRouter.js` & `routes.js`**: Mengelola navigasi utama aplikasi. `routes.js` mendefinisikan pasangan rute (URL) dan presenter yang sesuai, sementara `appRouter.js` menangani logika untuk merender presenter yang benar berdasarkan URL.

```javascript
// Cuplikan dari src/utils/routes.js
// Mendefinisikan rute aplikasi
export const ROUTES = {
  DASHBOARD: '/dashboard',
  PRACTICE_DYNAMIC: '/practice/:categoryId/:practiceId',
  // ...rute lainnya
};

// Cuplikan dari src/utils/appRouter.js
// Menangani perubahan rute menggunakan History API
async handleRouteChange() {
    const path = window.location.pathname;
    const { route, params } = this.findMatchingRoute(path);
    if (route) {
        await route.handler.call(this, params || {});
    }
}
```

- **`AudioRecorder.js`**: Sebuah kelas *wrapper* di atas `MediaRecorder API` yang menyederhanakan proses perekaman audio, termasuk memulai, menghentikan, dan mendapatkan hasil rekaman dalam format yang diinginkan.

```javascript
// Cuplikan dari src/utils/AudioRecorder.js
// Menyederhanakan proses perekaman audio
async startRecording() {
    if (!this.mediaRecorder) throw new Error('Not initialized');
    this.audioChunks = [];
    this.mediaRecorder.start();
    this.isRecording = true;
}

async stopRecording() {
    return new Promise(resolve => {
        this.mediaRecorder.onstop = () => {
            const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
            resolve({ audioBlob });
        };
        this.mediaRecorder.stop();
        this.isRecording = false;
    });
}
```

- **`database/aureaVoiceDB.js`**: Menyediakan metode-metode praktis (seperti `get`, `put`, `getAll`) untuk berinteraksi dengan IndexedDB, menyembunyikan kompleksitas API aslinya.

```javascript
// Cuplikan dari src/utils/database/aureaVoiceDB.js
// Menyimpan sesi latihan ke IndexedDB
export async function savePracticeSession({ id_latihan, nama_kategori, hasil_sesi }) {
  const db = await openDB();
  const tx = db.transaction('practice_sessions', 'readwrite');
  tx.objectStore('practice_sessions').add({ 
      id_latihan, 
      nama_kategori, 
      hasil_sesi, 
      tanggal: new Date().toISOString() 
  });
  return tx.complete;
}
```

---

## 🎨 Modularisasi CSS

Strategi styling dirancang agar mudah dikelola dan diskalakan:
- **Global Styles (`src/styles/`)**: Direktori ini berisi file-file CSS yang berlaku secara global:
    - `color-global.css`: Mendefinisikan semua variabel warna CSS.
    - `base.css`: Aturan dasar seperti `box-sizing`, *font-family*, dan reset gaya.
    - `layout.css`: Kelas-kelas utilitas untuk layout (misalnya, `.container`, `.grid`).
    - `components.css`: Gaya untuk komponen kecil yang digunakan kembali (misalnya, tombol, kartu).
    - `animations.css` & `transitions.css`: Animasi dan transisi global.
- **Feature-Specific Styles (`src/features/*/styles/`)**: Setiap fitur memiliki direktorinya sendiri untuk gaya yang hanya berlaku untuk fitur tersebut. Misalnya, `src/features/dashboard/styles/` berisi `dashboard-cards.css` dan `dashboard-chart.css`. File-file ini diimpor hanya oleh presenter fitur yang relevan, sehingga tidak membebani halaman lain.
- **Impor CSS**: File CSS diimpor langsung ke dalam file JavaScript yang relevan (misalnya, `DashboardPresenter.js` mengimpor gaya dasbor). Vite kemudian secara otomatis menangani *bundling* dan optimisasi CSS.

---

## ⚙️ Cara Menjalankan

```bash
# 1. Install dependensi
npm install

# 2. Jalankan server pengembangan
npm run dev

# 3. Build untuk produksi
npm run build

# 4. Pratinjau hasil build produksi
npm run preview
```

---

## 🤝 Kontribusi

Kontribusi sangat diterima! Silakan *fork* repositori ini, buat *branch* baru untuk fitur Anda, dan kirimkan *Pull Request*.

---

## 📄 Lisensi

Proyek ini dilisensikan di bawah [MIT License](LICENSE).