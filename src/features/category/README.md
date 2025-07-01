# Category Feature

Page kategori untuk aplikasi AureaVoice yang menampilkan materi pembelajaran, contoh pelafalan, dan item latihan.

## Struktur

### 1. Banner
- Menampilkan judul dan deskripsi kategori
- Background gradient yang menarik
- Gambar ilustrasi kategori

### 2. Main Content
Terdiri dari dua bagian utama:

#### Materi Kategori (Format Artikel)
- Satu artikel lengkap dengan konten materi pembelajaran
- Header artikel dengan judul, waktu baca, dan tanggal update
- Konten artikel dengan typography yang baik (heading, paragraf, list)
- Format HTML yang mendukung struktur artikel yang panjang

#### Contoh Pelafalan
- Grid layout untuk contoh-contoh pelafalan
- Menampilkan kata, notasi fonetik, dan tombol play
- Badge tingkat kesulitan (mudah, sedang, sulit)

### 3. Sidebar
- Item latihan yang tersedia
- Setiap item memiliki judul, deskripsi, dan tingkat kesulitan
- Tombol untuk memulai latihan

## Komponen

### CategoryModel
- Mengelola data kategori
- Menyediakan mock data untuk artikel materi, contoh pelafalan, dan latihan
- Method untuk mengambil data berdasarkan kategori
- Struktur data artikel dengan konten HTML yang lengkap

### CategoryView
- Render UI untuk page kategori dengan format artikel
- Method untuk update konten artikel secara dinamis
- Event binding untuk interaksi user (pronunciation play, practice start)
- Typography styling untuk konten artikel yang panjang

### CategoryPresenter
- Koordinasi antara Model dan View
- Handle user interactions
- Method untuk update dan refresh konten

## Styling

### category-base.css
- Styling dasar untuk container, banner, dan layout
- Styling untuk artikel materi dengan typography yang baik
- Styling untuk contoh pelafalan dan difficulty badges
- Typography untuk heading, paragraf, list dalam artikel

### category-sidebar.css
- Styling khusus untuk sidebar
- Practice items dan tombol latihan
- Sticky positioning untuk sidebar

### category-responsive.css
- Responsive design untuk berbagai ukuran layar
- Mobile-first approach
- Print styles

## Demo

Untuk melihat demo page kategori, buka file `category-demo.html` di browser.

## Integrasi

Feature ini sudah terintegrasi dengan struktur aplikasi utama melalui:
- `src/features/category/index.js` - Export semua komponen
- `src/features/index.js` - Import ke main features

## Penggunaan

```javascript
import { CategoryModel, CategoryPresenter } from './src/features/category/index.js';

// Inisialisasi
const categoryModel = new CategoryModel();
const categoryPresenter = new CategoryPresenter(categoryModel);

// Render page kategori
categoryPresenter.init('pronunciation'); // atau kategori lainnya
```

## Fitur yang Belum Diimplementasi

1. **Audio Playback** - Tombol play untuk contoh pelafalan
2. **Navigation** - Integrasi dengan router aplikasi
3. **Dynamic Data** - Koneksi dengan API atau database
4. **Practice Sessions** - Implementasi sesi latihan
5. **Progress Tracking** - Tracking progress user

## Catatan

Page ini dibuat sebagai struktur dasar dan belum disambungkan ke aplikasi utama. Untuk integrasi penuh, perlu:

1. Menambahkan route di router
2. Mengintegrasikan dengan navbar/navigation
3. Menambahkan data real dari backend
4. Implementasi fitur audio dan latihan
