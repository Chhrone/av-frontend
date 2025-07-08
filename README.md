# AureaVoice Frontend

Aplikasi web single-page (SPA) modern untuk latihan dan pengujian aksen berbicara bahasa Inggris. Dibangun dengan **Vite** dan **JavaScript murni** tanpa framework besar, mengadopsi arsitektur **Model-View-Presenter (MVP)** dengan hash routing dan modularisasi berbasis fitur.

---

## 🚀 Fitur Utama

- **Intro Flow**: Welcome, test, result, splash (alur pengenalan & tes awal)
- **Dashboard**: Statistik, progress, rekomendasi latihan
- **Category**: Materi pembelajaran, contoh pelafalan, latihan per kategori
- **Practice**: Sesi latihan aksen, feedback, dan hasil
- **Global Components**: Footer, navbar, dsb, reusable di seluruh aplikasi
- **AI/Mock Support**: Bisa terhubung ke API deteksi aksen nyata atau mode demo/mock

---

## 🛠️ Teknologi yang Digunakan

- **Vite**: Build tool & dev server super cepat
- **JavaScript (ES6+)**: Tanpa framework besar, logika dan UI diatur manual
- **IndexedDB**: Simpan data latihan secara lokal
- **Fetch API**: Untuk komunikasi dengan backend
- **Google Fonts**: Tipografi modern (Inter)
- **SVG Icons**: Ikon dalam format inline
- **View Transition API**: Animasi transisi halus antar halaman
- **CSS Modules**: Styling modular dan terorganisir

---

## 📁 Struktur Folder & Arsitektur

```text
src/
├── assets/      # Ikon, SVG, gambar reusable
├── config/      # Konfigurasi aplikasi (endpoint, mode demo, dsb)
├── features/    # Fitur utama aplikasi
│   ├── intro/      # Welcome, test, result (alur pengenalan & tes awal)
│   ├── dashboard/  # Dashboard pengguna (statistik, progres, rekomendasi)
│   ├── category/   # Materi pembelajaran, contoh pelafalan, latihan per kategori
│   ├── practice/   # Sesi latihan aksen, feedback, hasil
│   └── ...         # Fitur tambahan
├── shared/      # Komponen global (footer, navbar, dsb)
├── styles/      # CSS global (warna, layout, animasi)
├── utils/       # Helper, router, service, database (IndexedDB, router, dsb)
└── main.js      # Entry point aplikasi
```

### Penjelasan Struktur

- **features/**: Setiap fitur utama memiliki folder sendiri berisi model, view, presenter, style, dan utilitas terkait (MVP modular)
- **shared/**: Komponen global yang dapat digunakan lintas fitur (misal: navbar, footer)
- **utils/**: Berisi helper, service, router modular (`routerSetup.js`, `introRouter.js`), serta database lokal (`database/`)
- **main.js**: Entry point aplikasi, inisialisasi app, setup router, dan presenter global

---

## 🏗️ Pola Arsitektur

### Model-View-Presenter (MVP)
- **Model**: Logika bisnis dan data
- **View**: UI dan interaksi DOM
- **Presenter**: Kontrol alur, hubungkan Model dan View

### Routing: SPA & History API
- **SPA & View Transition API (Intro Pages Only)**: Halaman intro (`welcome`, `test`, `result`, `splash`) menggunakan Single Page Application (SPA) dengan hash routing (`#/welcome`, dst) dan animasi transisi halus via View Transition API.
- **History Routing (Fitur Lain)**: Halaman selain intro (dashboard, category, practice) menggunakan HTML5 History API untuk navigasi URL yang lebih natural (`/dashboard`, `/practice/:categoryId/:practiceId`, dst), memungkinkan back/forward browser tanpa reload penuh.
- **routerSetup.js**: Modularisasi routing utama aplikasi, mengatur history routing untuk fitur utama.
- **introRouter.js**: Routing khusus alur intro berbasis hash dan SPA.

### Database Lokal
- **IndexedDB**: Penyimpanan data latihan lokal melalui helper di `src/utils/database/` (akses CRUD, seed data, dan sinkronisasi lokal)

---

## 🎯 User Flow

1. **Intro**: Pengguna memulai dengan welcome → test → result → splash (SPA, hash routing, View Transition API)
2. **Dashboard**: Melihat statistik dan rekomendasi latihan (history routing)
3. **Category**: Memilih materi latihan dan melihat contoh (history routing)
4. **Practice**: Mengerjakan soal latihan dan mendapat feedback (history routing)
5. **Navigasi**: Halaman intro via hash routing, fitur utama via history routing

---

## ⚙️ Penjelasan Teknis Fitur

- **Intro Flow** (`src/features/intro/`):
  - Routing hash SPA, transisi animasi dengan View Transition API
  - Model: `IntroModel.js`, `SplashModel.js` (logika data intro & splash)
  - Presenter: `WelcomePresenter.js`, `TestPresenter.js`, `ResultPresenter.js`, `SplashPresenter.js` (kontrol alur, validasi, event)
  - View: `ResultView.js`, dsb (render UI, event handler)

- **Dashboard** (`src/features/dashboard/`):
  - Routing via history API (`/dashboard`)
  - Model: `DashboardModel.js` (statistik, progress, rekomendasi)
  - Presenter: `DashboardPresenter.js` (sinkronisasi data, update view)
  - View: `DashboardView.js` (render statistik, chart, dsb)
  - CSS modular: `dashboard-*.css`

- **Category** (`src/features/category/`):
  - Routing via history API (`/category/:id`)
  - Model: `CategoryModel.js`, `IramaBahasaModel.js`, dsb (struktur materi, data latihan)
  - Presenter: `CategoryPresenter.js`, `CategoryNavbarPresenter.js` (navigasi, filter, event)
  - View: `CategoryView.js`, `CategoryNavbarView.js` (UI materi, sidebar, dsb)
  - CSS modular: `category-*.css`

- **Practice** (`src/features/practice/`):
  - Routing via history API (`/practice/:categoryId/:practiceId`)
  - Model: latihan, hasil, feedback (per kategori)
  - Presenter: kontrol soal, validasi, feedback
  - View: render soal, input audio, feedback UI

- **Global Components** (`src/shared/`):
  - Navbar, Footer, dsb, reusable di seluruh aplikasi
  - Model, Presenter, View terpisah untuk tiap komponen

- **Utils & Services** (`src/utils/`):
  - Routing modular: `routerSetup.js`, `introRouter.js`
  - Audio: `AudioRecorder.js`, `RecordingManager.js` (rekam, kelola audio)
  - Accent Detection: `AccentDetectionService.js` (integrasi API AI/deteksi aksen)
  - Database: `database/` (IndexedDB, seed, CRUD)
  - Helper: event, error handler, dsb

- **Konfigurasi AI/Mock** (`src/config/AppConfig.js`):
  - Pilih mode AI nyata atau demo/mock
  - Endpoint API, pengaturan confidence score

- **Styling** (`src/styles/`, per fitur):
  - CSS modular, animasi, responsive, transisi

---

---

## 🧭 Navigasi Utama

- Home: `/#/welcome`
- Test: `/#/test`
- Result: `/#/result`
- Dashboard: `/dashboard`
- Practice: `/practice/:categoryId/:practiceId`

---

## 📐 Pola Desain & Best Practice

- **MVP Pattern**: Pemisahan tegas antara logika, tampilan, dan kontrol
- **Modular CSS**: Styling per komponen, import via file index.css
- **Reusable Component**: Navbar, footer, ikon, dsb
- **Helper & Service**: Fungsi utilitas di `src/utils/`
- **Routing Modular**: Dikelola di `utils/routerSetup.js` dan `utils/introRouter.js`
- **View Transition**: Transisi halaman halus via View Transition API (dengan fallback)

---

## 🤖 Konfigurasi & Integrasi AI

- **Mode AI/Mock**: Atur `USE_REAL_MODEL` di `src/config/AppConfig.js` untuk memilih antara API nyata atau demo
- **Endpoint API**: Konfigurasikan endpoint di `AppConfig.js`. Harus menerima file `.wav` dan mengembalikan `{ us_confidence: number }`
- **Demo Mode**: Skor confidence diacak sesuai rentang untuk pengembangan offline

---

## 🚀 Cara Menjalankan

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 🌐 Dukungan Browser

- Chrome/Edge 88+
- Firefox 85+
- Safari 14+
- Mendukung View Transition API dengan fallback untuk browser lama

---

## 🧪 Catatan Pengembangan & Testing

- **Tanpa Framework**: Semua logic UI, state, dan event diatur manual (pure JS), mudah dipahami dan dikembangkan
- **Scalable**: Mudah menambah fitur baru dengan menambah folder di `features/`
- **Testing**: Struktur mendukung penambahan unit test per fitur
- **Integrasi AI**: Mudah dihubungkan ke API eksternal untuk deteksi aksen

---

## 🤝 Kontribusi

1. Fork repository ini
2. Buat branch fitur baru (`git checkout -b feature/amazing-feature`)
3. Commit perubahan (`git commit -m 'Add some amazing feature'`)
4. Push ke branch (`git push origin feature/amazing-feature`)
5. Buka Pull Request

---

## 📄 Lisensi

MIT License - lihat file [LICENSE](LICENSE) untuk detail lengkap.

---

## 📞 Dukungan

Jika Anda mengalami masalah atau memiliki pertanyaan, silakan buka [issue](https://github.com/username/aureavo-frontend/issues) di repository ini.