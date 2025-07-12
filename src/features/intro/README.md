# Fitur Intro

## Gambaran Umum

Fitur Intro dirancang untuk memberikan pengalaman awal yang terstruktur bagi pengguna baru. Melalui tampilan pembuka, pesan sambutan, dan evaluasi awal aksen, pengguna dipandu secara bertahap untuk memahami fungsi utama aplikasi. Alur ini tidak hanya bertujuan untuk menarik perhatian, tetapi juga memberikan umpan balik langsung terkait aksen bahasa Inggris Amerika yang digunakan. Data pelafalan awal yang dikumpulkan digunakan sebagai dasar untuk merekomendasikan area latihan yang sesuai dengan kebutuhan masing-masing pengguna.



## Model

### `IntroModel.js`

`IntroModel` mengelola status dan konten untuk seluruh alur pengantar.

- **Tanggung Jawab**:
    - Menyimpan dan menyediakan pilihan acak teks untuk tes evaluasi aksen.
    - Menyimpan semua konten teks UI, seperti pesan selamat datang dan label tombol, di satu tempat terpusat.
    - Berisi logika untuk menghasilkan umpan balik deskriptif berdasarkan skor kepercayaan aksen pengguna.
    - Mengelola status saat ini dari alur intro (misalnya, halaman mana yang aktif, apakah perekaman sedang berlangsung).
    - Menyimpan hasil tes aksen terakhir.

### `SplashModel.js`

`SplashModel` bertanggung jawab atas konten dan perilaku layar pembuka awal.

- **Tanggung Jawab**:
    - Menyimpan nama merek aplikasi, slogan, dan deskripsi singkat.
    - Menentukan waktu tampilan minimum untuk layar pembuka untuk memastikan pengalaman pemuatan yang mulus dan menarik secara visual.
    - Termasuk logika untuk menentukan apakah layar pembuka harus ditampilkan.

## Presenter

### `SplashPresenter.js`

`SplashPresenter` mengontrol siklus hidup dan animasi layar pembuka.

- **Tanggung Jawab**:
    - Menginisialisasi dan merender `SplashView` dengan data dari `SplashModel`.
    - Mengelola urutan pemuatan, termasuk efek animasi teks "jackpot".
    - Memastikan layar pembuka ditampilkan untuk durasi minimum sebelum beralih ke layar berikutnya.
    - Menangani animasi memudar dan pembersihan layar pembuka.
    - Mengelola visibilitas footer, menyembunyikannya selama urutan pembuka dan menampilkannya setelahnya.

### `WelcomePresenter.js`

`WelcomePresenter` mengelola layar selamat datang, yang meminta pengguna untuk memulai tes aksen.

- **Tanggung Jawab**:
    - Menginisialisasi dan merender `WelcomeView` dengan pesan selamat datang dari `IntroModel`.
    - Menangani klik pengguna pada tombol mikrofon.
    - Memulai proses perekaman audio melalui `RecordingManager`.
    - Memicu transisi tampilan yang mulus ke layar tes setelah perekaman dimulai.

### `TestPresenter.js`

`TestPresenter` mengatur tes evaluasi aksen.

- **Tanggung Jawab**:
    - Menginisialisasi dan merender `TestView` dengan teks yang dipilih secara acak dari `IntroModel`.
    - Mengelola proses perekaman, termasuk memulai dan menghentikan pengatur waktu perekaman dan memperbarui UI yang sesuai.
    - Berinteraksi dengan `RecordingManager` untuk menangani aspek teknis perekaman audio.
    - Berkomunikasi dengan `AccentDetectionService` untuk memproses audio yang direkam dan menerima hasil analisis.
    - Menangani perubahan status UI (misalnya, menampilkan status memuat, merekam, dan memproses).
    - Mengimplementasikan logika pembersihan untuk memastikan bahwa perekaman dihentikan jika pengguna menavigasi jauh dari halaman.

### `ResultPresenter.js`

`ResultPresenter` bertanggung jawab untuk menampilkan hasil tes aksen.

- **Tanggung Jawab**:
    - Menginisialisasi dan merender `ResultView` dengan data analisis aksen.
    - Menyimpan skor aksen awal pengguna ke `localStorage` untuk digunakan di bagian lain aplikasi (seperti dasbor).
    - Menetapkan token di `localStorage` untuk menunjukkan bahwa pengguna telah menyelesaikan alur pengantar.
    - Menangani klik pengguna pada tombol "Coba Lagi" (atau yang serupa), yang mengarahkan mereka ke dasbor.

## Tampilan

### `SplashView.js`

`SplashView` merender layar pembuka awal.

- **Tanggung Jawab**:
    - Membuat struktur HTML untuk layar pembuka, termasuk nama merek dan slogan.
    - Mengimplementasikan efek animasi "jackpot" pada nama merek untuk daya tarik visual.
    - Menangani animasi memudar ketika layar pembuka ditutup.

### `WelcomeView.js`

`WelcomeView` menampilkan pesan selamat datang dan panggilan awal untuk bertindak.

- **Tanggung Jawab**:
    - Merender teks selamat datang dan tombol mikrofon besar.
    - Menggunakan View Transition API untuk memastikan transisi visual yang mulus dari tombol mikrofon ke layar berikutnya.

### `TestView.js`

`TestView` menampilkan teks untuk evaluasi aksen dan kontrol perekaman.

- **Tanggung Jawab**:
    - Merender teks yang perlu dibaca pengguna.
    - Menampilkan tombol mikrofon, yang mengubah statusnya untuk mencerminkan proses perekaman (misalnya, memuat, merekam, memproses).
    - Menampilkan pengatur waktu untuk menunjukkan durasi perekaman.
    - Memberikan umpan balik visual kepada pengguna tentang status tes saat ini.

### `ResultView.js`

`ResultView` menyajikan skor analisis aksen pengguna dan umpan balik.

- **Tanggung Jawab**:
    - Merender skor kepercayaan aksen pengguna dan teks deskriptif yang menjelaskan skor.
    - Menampilkan tombol yang memungkinkan pengguna untuk melanjutkan ke aplikasi utama (dasbor).
    - Memastikan bahwa hasilnya ditampilkan dengan jelas dan segera tanpa animasi yang kompleks.

## Cuplikan Kode Penting

`TestPresenter.js` adalah inti dari fitur intro, karena mengelola seluruh proses evaluasi aksen. Metode `stopRecording` sangat penting, karena menunjukkan integrasi yang mulus antara `RecordingManager` dan `AccentDetectionService`.

```javascript
// src/features/intro/presenters/TestPresenter.js

async stopRecording() {
  try {
    const savedRecording = await RecordingManager.stopRecording({
      name: 'Speech Test Recording',
      category: 'speech-test'
    });
    this.showProcessingUI();
    await AccentDetectionService.processRecordingAndShowResult(savedRecording);
  } catch (error) {
    this.stopRecordingUI();
  }
}
```

Cuplikan ini mengilustrasikan:
- **Orkestrasi Layanan**: Presenter pertama-tama memanggil `RecordingManager.stopRecording()` untuk menghentikan pengambilan audio dan mendapatkan data yang direkam.
- **Manajemen Status UI**: Ini segera memanggil `showProcessingUI()` untuk memberikan umpan balik visual kepada pengguna bahwa rekaman mereka sedang dianalisis.
- **Pemrosesan Asinkron**: Kemudian `await` `AccentDetectionService` untuk memproses rekaman dan menangani navigasi ke halaman hasil.
- **Penanganan Kesalahan**: Blok `try...catch` memastikan bahwa jika ada bagian dari proses yang gagal, UI diatur ulang ke status stabil.

Metode ini adalah contoh sempurna tentang bagaimana presenter bertindak sebagai koordinator pusat, mengelola status UI, dan mengatur interaksi antara berbagai layanan untuk mencapai tugas yang kompleks.

## Utilitas

Fitur Intro bergantung pada beberapa utilitas global:

- **`RecordingManager.js`**: Mengelola semua aspek perekaman audio, termasuk memulai, menghentikan, dan menyimpan rekaman. Ini memastikan bahwa status perekaman ditangani secara konsisten.
- **`AccentDetectionService.js`**: Layanan penting yang mengambil file audio yang direkam, mengirimkannya ke backend untuk analisis, dan kemudian mengarahkan pengguna ke halaman hasil dengan data yang dikembalikan.
- **`ViewTransitionHelper.js`**: Utilitas yang menyederhanakan penggunaan View Transition API browser, memungkinkan transisi yang mulus dan animasi antara tampilan yang berbeda (misalnya, dari layar selamat datang ke layar tes).
- **`MicrophoneIcon.js`**: Aset yang dapat digunakan kembali yang menyediakan SVG untuk ikon mikrofon yang digunakan di seluruh tampilan intro.