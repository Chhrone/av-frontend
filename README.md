
# AureaVoice Frontend

AureaVoice Frontend adalah aplikasi web single-page (SPA) modern yang dibangun dengan Vite dan JavaScript murni (tanpa framework), menerapkan arsitektur Model-View-Presenter (MVP) serta hash routing untuk navigasi client-side. Aplikasi ini dirancang modular, mudah dikembangkan, dan responsif untuk latihan serta pengujian kemampuan aksen berbicara.


## Fitur Utama

- **Arsitektur MVP**: Pemisahan logika aplikasi (Model), tampilan (View), dan pengendali (Presenter) secara tegas untuk maintainability dan scalability.
- **Organisasi Berbasis Fitur**: Setiap fitur utama (intro, dashboard, practice, dsb) memiliki folder sendiri yang berisi model, view, presenter, style, dan utilitas terkait.
- **Hash Routing**: Navigasi antar halaman dilakukan di sisi klien menggunakan hash (`#/route`) tanpa reload.
- **Modular CSS**: CSS dipisah per fitur dan komponen, mudah diatur dan di-maintain.
- **Responsif & Modern**: Tampilan adaptif di berbagai perangkat, warna netral, dan animasi transisi halus.
- **Komponen Global**: Komponen seperti footer, navbar, dan utilitas dapat digunakan lintas fitur.
- **Dukungan AI/Mock**: Bisa terhubung ke API deteksi aksen nyata atau mode demo/mock untuk pengembangan.


## Arsitektur & Struktur Folder

### 1. Model-View-Presenter (MVP)
- **Model**: Menyimpan dan mengelola data, logika bisnis, serta komunikasi dengan storage/API (misal: `DashboardModel.js`, `IntroModel.js`).
- **View**: Bertanggung jawab atas rendering UI dan interaksi DOM (misal: `DashboardView.js`, `ResultView.js`).
- **Presenter**: Penghubung antara Model dan View, menangani event, logika navigasi, dan orchestrasi data (misal: `DashboardPresenter.js`, `SplashPresenter.js`).

### 2. Organisasi Berbasis Fitur
Setiap fitur utama memiliki struktur seperti berikut:

```
src/features/
  ├── intro/         # Welcome, test, result (intro flow)
  ├── dashboard/     # Dashboard pengguna
  ├── category/      # Kategori latihan
  ├── practice/      # Latihan/praktik aksen
  └── ...
```
Setiap folder fitur berisi:
- `models/`      → Model data & logika bisnis
- `views/`       → Komponen tampilan (UI)
- `presenters/`  → Pengendali/interaksi fitur
- `styles/`      → CSS modular khusus fitur

### 3. Komponen & Utilitas Global
- `src/shared/`  → Komponen global (footer, navbar, dsb)
- `src/utils/`   → Helper, service, router, database, dsb
- `src/assets/`  → Ikon, gambar, SVG
- `src/styles/`  → CSS global (warna, layout, animasi)
- `src/config/`  → Konfigurasi aplikasi (API endpoint, mode demo, dsb)

### 4. Routing
- **Hash Routing**: Navigasi antar halaman menggunakan hash (`#/welcome`, `#/test`, `#/result`, dsb) dengan router modular.
- **SPA**: Semua halaman di-render secara dinamis tanpa reload browser.

### 5. Entry Point
- `src/main.js` → Inisialisasi aplikasi, setup router, dan pengelolaan presenter global.


## Struktur Proyek (Contoh)

```
src/
├── assets/          # Ikon, SVG, gambar
├── config/          # Konfigurasi aplikasi
├── features/        # Fitur utama (intro, dashboard, category, practice, dst)
│   ├── intro/
│   ├── dashboard/
│   ├── category/
│   ├── practice/
│   └── ...
├── shared/          # Komponen global (footer, navbar, dsb)
├── styles/          # CSS global
├── utils/           # Helper, router, service, database
└── main.js          # Entry point aplikasi
```


## Halaman Utama

- **Welcome Page (`#/welcome`)**: Halaman pembuka, ajakan tes aksen, tombol mikrofon, animasi masuk.
- **Test Page (`#/test`)**: Teks latihan, tombol rekam, proses rekaman otomatis, transisi ke hasil.
- **Result Page (`#/result`)**: Menampilkan skor confidence aksen US, feedback deskriptif, tombol coba lagi.
- **Dashboard (`/dashboard`)**: Statistik latihan, grafik progres, rekomendasi latihan, dsb.
- **Practice (`/practice/:categoryId/:practiceId`)**: Halaman latihan per kategori dan soal.


## Konfigurasi & Integrasi AI

- **Mode AI/Mock**: Atur `USE_REAL_MODEL` di `src/config/AppConfig.js` untuk memilih antara API nyata atau demo.
- **Endpoint API**: Konfigurasi endpoint di AppConfig, menerima file `.wav` dan mengembalikan `{ us_confidence: number }`.
- **Demo Mode**: Untuk pengembangan, skor confidence diacak sesuai rentang yang diatur.


## Cara Menjalankan

1. Install dependencies:
   ```bash
   npm install
   ```
2. Jalankan server pengembangan:
   ```bash
   npm run dev
   ```
3. Buka browser ke `http://localhost:5173/`


## Navigasi

- **Home**: `http://localhost:5173/#/welcome`
- **Test**: `http://localhost:5173/#/test`
- **Result**: `http://localhost:5173/#/result`
- **Dashboard**: `http://localhost:5173/dashboard`
- **Practice**: `http://localhost:5173/practice/:categoryId/:practiceId`


## Pendekatan Styling

- **Modular CSS**: CSS dipisah per fitur dan komponen, mudah diatur dan di-maintain.
- **Global Styles**: Warna, layout, animasi global diatur di `src/styles/`.
- **Responsive**: Layout dan komponen responsif di berbagai perangkat.


## Teknologi yang Digunakan

- **Vite**: Build tool & dev server super cepat untuk aplikasi modern.
- **JavaScript Murni (ES6+)**: Tidak menggunakan framework besar, seluruh logika dan UI diatur manual untuk fleksibilitas penuh.
- **MVP Pattern**: Arsitektur Model-View-Presenter untuk pemisahan logika, tampilan, dan kontrol.
- **Modular CSS**: CSS terorganisir per fitur dan komponen.
- **IndexedDB**: Penyimpanan data latihan lokal (melalui helper di `utils/database/`).
- **Fetch API**: Komunikasi dengan API deteksi aksen.
- **Google Fonts**: Tipografi modern (Inter).
- **SVG Icons**: Ikon mikrofon dan lainnya dalam format SVG inline.
- **View Transition API**: Animasi transisi halaman yang halus (dengan fallback untuk browser lama).


## Dukungan Browser

Aplikasi ini berjalan optimal di browser modern yang mendukung ES6 modules, CSS custom properties, dan (opsional) View Transition API.
