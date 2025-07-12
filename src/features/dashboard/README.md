# Fitur Dasbor

## Gambaran Umum

Fitur Dasbor berfungsi sebagai pusat utama bagi pengguna setelah mereka masuk. Ini menyediakan gambaran umum yang komprehensif tentang kemajuan mereka, termasuk statistik utama, grafik yang memvisualisasikan peningkatan skor aksen mereka dari waktu ke waktu, dan akses cepat ke kategori latihan. Dasbor dirancang untuk memotivasi pengguna dengan menyoroti pencapaian mereka dan menawarkan rekomendasi yang jelas dan dapat ditindaklanjuti untuk latihan lebih lanjut.

## Model

### `DashboardModel.js`

`DashboardModel` bertanggung jawab untuk mengelola semua data yang terkait dengan dasbor pengguna.

- **Tanggung Jawab**:
    - Mengambil dan memproses statistik pengguna dari IndexedDB, seperti total sesi latihan, durasi sesi, dan skor aksen.
    - Menghitung statistik turunan seperti jumlah latihan yang diselesaikan hari ini, total waktu latihan, dan kategori yang membutuhkan lebih banyak latihan.
    - Mengambil dan memformat data kemajuan untuk grafik skor aksen, menunjukkan perbandingan minggu demi minggu.
    - Menghitung peningkatan skor pengguna dari minggu sebelumnya ke minggu ini.
    - Menyediakan data tiruan sebagai cadangan jika tidak ada data nyata yang tersedia, memastikan dasbor tetap berfungsi untuk pengguna baru.
    - Menawarkan rekomendasi untuk latihan berdasarkan statistik pengguna saat ini.

## Presenter

### `DashboardPresenter.js`

`DashboardPresenter` bertindak sebagai perantara antara `DashboardModel` dan `DashboardView`.

- **Tanggung Jawab**:
    - Menginisialisasi dasbor dengan mengambil semua data yang diperlukan dari model (statistik pengguna, data kemajuan, dll.).
    - Merender tampilan dasbor utama dan menyuntikkan data dinamis ke dalamnya.
    - Menginisialisasi dan mengelola siklus hidup grafik kemajuan (menggunakan Chart.js), memberinya data dari model.
    - Menangani interaksi pengguna, seperti mengklik tombol "Mulai Latihan" atau memilih kategori latihan, dan mengarahkan pengguna ke halaman yang sesuai.
    - Mengelola siklus hidup presenter bilah navigasi dan footer, memastikan keduanya ditampilkan dengan benar dalam tata letak dasbor.
    - Membersihkan sumber daya, seperti menghancurkan instans grafik dan menghapus pendengar acara, ketika dasbor tidak lagi aktif.

## Tampilan

### `DashboardView.js`

`DashboardView` bertanggung jawab untuk merender seluruh antarmuka pengguna dasbor.

- **Tanggung Jawab**:
    - Membuat struktur HTML untuk dasbor, termasuk tata letak utama, header, kartu statistik, kanvas grafik kemajuan, dan kisi pemilihan kategori.
    - Menyediakan metode untuk memperbarui antarmuka pengguna secara dinamis dengan data, seperti mengisi skor aksen pengguna, latihan yang diselesaikan, dan statistik lainnya.
    - Mengikat pendengar acara untuk semua elemen interaktif di halaman (misalnya, tombol, tautan) dan mendelegasikan penanganan acara ini ke presenter.
    - Mengelola pemasangan dan pelepasan tampilan dari DOM, memastikan siklus hidup yang bersih dan efisien.
    - Memuat dan memasang komponen footer secara dinamis.

## Cuplikan Kode Penting

`DashboardPresenter.js` adalah pusat fungsionalitas dasbor. Metode `init`-nya mengatur seluruh proses pengambilan data, merender tampilan, dan menginisialisasi grafik kemajuan. Cuplikan ini sangat penting karena menunjukkan bagaimana presenter menangani beberapa operasi asinkron secara bersamaan untuk memberikan pengalaman pengguna yang cepat dan responsif.

```javascript
// src/features/dashboard/presenters/DashboardPresenter.js

async init() {
  // ... (view and navbar setup) ...

  // Ambil data progres, stats, dan score improvement dari model secara async
  const [progressData, userStats, scoreImprovement] = await Promise.all([
    this.model.getProgressData(),
    this.model.getUserStats(),
    this.model.getScoreImprovement()
  ]);

  // Pastikan container dan canvas sudah ada sebelum inisialisasi chart dan update stats
  if (this.view && this.view.container && document.getElementById('progressChart')) {
    this.initializeChart(progressData);
    this.view.updateStats(userStats);
  }

  // ... (score improvement display logic) ...
}
```

Cuplikan ini menyoroti:
- **Pengambilan Data Bersamaan**: Menggunakan `Promise.all`, presenter mengambil semua data yang diperlukan dari model secara paralel. Ini adalah optimasi kinerja penting yang mencegah permintaan berurutan yang memblokir.
- **Pemisahan Kekhawatiran**: Presenter mendelegasikan tugas pengambilan data ke `model` dan pembaruan UI ke `view`, sesuai dengan pola MVP.
- **Pembaruan UI Dinamis**: Setelah data diambil, presenter memanggil metode pada tampilan (`initializeChart` dan `updateStats`) untuk mengisi dasbor dengan informasi pengguna.
- **Ketahanan**: Kode memeriksa keberadaan kanvas grafik sebelum mencoba menginisialisasi grafik, mencegah potensi kesalahan runtime.

## Utilitas

Fitur Dasbor tidak memiliki folder `utils` khusus sendiri tetapi bergantung pada utilitas global untuk fungsionalitas inti:

- **`aureaVoiceDB.js`**: Digunakan untuk mengambil semua data sesi latihan dari IndexedDB, yang kemudian diproses oleh `DashboardModel` untuk menghasilkan statistik pengguna dan grafik kemajuan.
- **`appRouter.js`**: Digunakan oleh `DashboardPresenter` untuk menangani navigasi ketika pengguna mengklik kategori latihan atau tombol "Mulai Latihan".
- **Presenter Bersama (`NavbarPresenter`, `FooterPresenter`)**: `DashboardPresenter` menginisialisasi dan mengelola bilah navigasi dan footer bersama, memastikan tampilan dan nuansa yang konsisten di seluruh aplikasi.