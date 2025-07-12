# Fitur Kategori

Halaman kategori untuk aplikasi AureaVoice yang menampilkan materi pembelajaran, contoh pelafalan, dan item latihan.

## Struktur

### 1. Banner
- Menampilkan judul dan deskripsi kategori
- Latar belakang gradien yang menarik
- Gambar ilustrasi kategori

### 2. Konten Utama
Terdiri dari dua bagian utama:

#### Materi Kategori (Format Artikel)
- Satu artikel lengkap dengan konten materi pembelajaran
- Header artikel dengan judul, waktu baca, dan tanggal pembaruan
- Konten artikel dengan tipografi yang baik (judul, paragraf, daftar)
- Format HTML yang mendukung struktur artikel yang panjang

#### Contoh Pelafalan
- Tata letak grid untuk contoh-contoh pelafalan
- Menampilkan kata, notasi fonetik, dan tombol putar
- Lencana tingkat kesulitan (mudah, sedang, sulit)

#### Kesalahan Umum (Common Errors)

Bagian ini akan membahas kesalahan-kesalahan umum yang mungkin terjadi saat mengembangkan atau menggunakan fitur kategori, beserta solusi atau langkah-langkah penanganan yang direkomendasikan.

#### Materi Tambahan (Additional Materials)

Bagian ini akan berisi tautan atau referensi ke materi tambahan yang relevan, seperti dokumentasi eksternal, artikel, atau sumber daya lain yang dapat membantu pemahaman lebih lanjut tentang fitur kategori atau teknologi yang digunakan.

### 3. Konten Samping
- Item latihan yang tersedia
- Setiap item memiliki judul, deskripsi, dan tingkat kesulitan
- Tombol untuk memulai latihan

## Komponen

### CategoryModel
- Mengelola data kategori
- Menyediakan data tiruan untuk artikel materi, contoh pelafalan, dan latihan
- Metode untuk mengambil data berdasarkan kategori
- Struktur data artikel dengan konten HTML yang lengkap

### CategoryView
- Merender antarmuka pengguna untuk halaman kategori dengan format artikel
- Metode untuk memperbarui konten artikel secara dinamis
- Pengikatan acara untuk interaksi pengguna (putar pelafalan, mulai latihan)
- Penataan tipografi untuk konten artikel yang panjang

### CategoryPresenter
- Koordinasi antara Model dan View
- Menangani interaksi pengguna
- Metode untuk memperbarui dan menyegarkan konten

## Penataan Gaya

### category-base.css
- Penataan gaya dasar untuk wadah, spanduk, dan tata letak
- Penataan gaya untuk artikel materi dengan tipografi yang baik
- Penataan gaya untuk contoh pelafalan dan lencana kesulitan
- Tipografi untuk judul, paragraf, daftar dalam artikel

### category-sidebar.css
- Penataan gaya khusus untuk bilah sisi
- Item latihan dan tombol latihan
- Penempatan lengket untuk bilah sisi

### category-responsive.css
- Desain responsif untuk berbagai ukuran layar
- Pendekatan mobile-first
- Gaya cetak

## Demo

Untuk melihat demo halaman kategori, buka file `category-demo.html` di browser.

## Integrasi

Fitur ini sudah terintegrasi dengan struktur aplikasi utama melalui:
- `src/features/category/index.js` - Mengekspor semua komponen
- `src/features/index.js` - Mengimpor ke fitur utama

## Cuplikan Kode Penting

`CategoryPresenter.js` sangat penting untuk menginisialisasi halaman kategori, mengambil data, dan menangani interaksi pengguna. Metode `init`, khususnya, menunjukkan logika inti dari fitur tersebut:

```javascript
// src/features/category/presenters/CategoryPresenter.js

async init(categoryId = 'pronunciation') {
  try {
    // Clear the app container
    const appContainer = document.getElementById('app');
    if (appContainer) {
      appContainer.innerHTML = '';
    }

    // Show loading state
    if (appContainer) {
      appContainer.innerHTML = '<div class="loading">Memuat konten...</div>';
    }

    // Set the current category in the model (awaits the async operation)
    await this.model.setCurrentCategory(categoryId);

    // Create and render the view
    this.view = new CategoryView();
    const categoryData = this.model.getCategoryData();
    await this.render(categoryData);

    // Bind event handlers
    this.bindEvents();

    // Mount footer inside .category-container after .category-content
    const categoryContainer = document.querySelector('.category-container');
    if (categoryContainer) {
      if (!this.footerPresenter) {
        this.footerPresenter = new FooterPresenter();
      }
      // Remove existing footer in categoryContainer if any (avoid duplicate)
      const existingFooter = categoryContainer.querySelector('#footer');
      if (existingFooter) existingFooter.remove();
      this.footerPresenter.mount(categoryContainer);
    }
  } catch (error) {
    console.error('Error initializing category presenter:', error);
  }
}
```

Cuplikan ini menunjukkan:
- **Inisialisasi Asinkron**: Sifat `async` dari fungsi memungkinkan untuk `await` pengambilan data dari model sebelum merender tampilan.
- **Manajemen Status**: Ini menunjukkan status pemuatan kepada pengguna saat data sedang diambil.
- **Interaksi MVP**: Presenter mengambil data dari `model`, meneruskannya ke `view` untuk dirender, dan kemudian mengikat acara untuk menangani masukan pengguna.
- **Komposisi Komponen**: Ini secara dinamis memasang `FooterPresenter` bersama, menunjukkan bagaimana komponen yang dapat digunakan kembali diintegrasikan.

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

1. **Audio Playback** - Tombol putar untuk contoh pelafalan
2. **Navigation** - Integrasi dengan router aplikasi
3. **Dynamic Data** - Koneksi dengan API atau database
4. **Practice Sessions** - Implementasi sesi latihan
5. **Progress Tracking** - Pelacakan kemajuan pengguna

## Catatan

Halaman ini dibuat sebagai struktur dasar dan belum disambungkan ke aplikasi utama. Untuk integrasi penuh, perlu:

1. Menambahkan rute di router
2. Mengintegrasikan dengan bilah navigasi/navigasi
3. Menambahkan data nyata dari backend
4. Implementasi fitur audio dan latihan