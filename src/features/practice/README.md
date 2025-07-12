# Fitur Latihan

## Gambaran Umum

Fitur Latihan adalah komponen inti dari aplikasi di mana pengguna dapat secara aktif melatih aksen bahasa Inggris Amerika mereka. Ini menyediakan lingkungan terstruktur bagi pengguna untuk menyelesaikan sesi latihan, menerima umpan balik langsung tentang pelafalan mereka, dan melacak kemajuan mereka melalui serangkaian rekaman. Fitur ini dirancang untuk berulang, memungkinkan pengguna untuk mengulang latihan dan melihat skor mereka meningkat dari waktu ke waktu.

## Model

### `PracticeTestModel.js`

`PracticeTestModel` bertanggung jawab untuk mengelola data yang terkait dengan tes latihan.

- **Tanggung Jawab**:
    - Mengambil teks latihan dari database (`aureaVoiceDB.js`) berdasarkan kategori dan item latihan yang dipilih.
    - Menyediakan kalimat latihan acak jika tidak ada yang spesifik dipilih.
    - Menyimpan teks latihan terakhir yang digunakan untuk kontinuitas.
    - Menyimpan rekaman dan skor yang sesuai untuk sesi latihan tertentu.

### `PracticeResultModel.js`

`PracticeResultModel` menangani data untuk layar hasil latihan.

- **Tanggung Jawab**:
    - Menyimpan data analisis aksen yang diterima setelah rekaman diproses.
    - Mengambil dan menyimpan transkrip ucapan-ke-teks dari layanan perekaman.
    - Memberikan deskripsi motivasi berdasarkan skor pengguna, menawarkan dorongan dan panduan.

## Presenter

### `PracticePresenter.js`

`PracticePresenter` adalah pengontrol pusat untuk seluruh alur latihan, mengelola interaksi antara model, tampilan, dan layanan.

- **Tanggung Jawab**:
    - Menginisialisasi sesi latihan dengan mengambil teks latihan dan merender tampilan tes awal.
    - Mengelola status sesi latihan, termasuk jumlah rekaman yang diambil dan jumlah sesi maksimum.
    - Menangani interaksi pengguna, seperti memulai dan menghentikan rekaman.
    - Mengatur proses perekaman audio, mengirimkannya untuk analisis, dan menerima hasilnya.
    - Menyimpan hasil setiap sesi latihan ke database.
    - Transisi antara tampilan tes dan tampilan hasil, meneruskan data yang diperlukan.
    - Mengelola alur keseluruhan latihan 4 sesi, menghitung skor rata-rata di akhir.

## Layanan

Fitur latihan dipecah menjadi beberapa layanan, masing-masing dengan tanggung jawab tertentu, mengikuti arsitektur berorientasi layanan.

### `PracticeRecordingService.js`

Layanan ini merangkum logika untuk menangani rekaman audio selama sesi latihan.

- **Tanggung Jawab**:
    - Mengelola status perekaman (misalnya, `isRecording`).
    - Memulai dan menghentikan pengatur waktu perekaman dan memperbarui UI dengan waktu yang berlalu.
    - Mengambil transkrip ucapan-ke-teks dari `RecordingManager`.
    - Mencatat waktu mulai dan berakhir setiap sesi perekaman.

### `PracticeResultService.js`

Layanan ini bertanggung jawab untuk memproses dan menafsirkan hasil sesi latihan.

- **Tanggung Jawab**:
    - Mengekstrak skor kepercayaan aksen dari hasil analisis.
    - Memberikan deskripsi motivasi berdasarkan skor dengan berinteraksi dengan `PracticeResultModel`.
    - Menghitung skor rata-rata dari serangkaian sesi latihan.

### `PracticeViewService.js`

Layanan ini mengelola transisi UI dan pembaruan untuk tampilan latihan.

- **Tanggung Jawab**:
    - Menangani transisi animasi antara tampilan tes dan tampilan hasil.
    - Merender tampilan yang sesuai dengan data yang diperlukan.
    - Mengikat dan melepaskan pendengar acara untuk elemen UI sesuai kebutuhan.

## Tampilan

### `PracticeTestView.js`

`PracticeTestView` adalah UI untuk sesi latihan aktif di mana pengguna merekam ucapan mereka.

- **Tanggung Jawab**:
    - Merender teks latihan untuk dibaca pengguna.
    - Menampilkan bilah kemajuan yang menunjukkan nomor sesi saat ini.
    - Menyediakan tombol rekam yang mengubah statusnya untuk mencerminkan apakah sedang merekam, memproses, atau diam.
    - Menampilkan pengatur waktu untuk menampilkan durasi rekaman saat ini.

### `PracticeResultView.js`

`PracticeResultView` menampilkan umpan balik setelah pengguna menyelesaikan rekaman.

- **Tanggung Jawab**:
    - Merender skor aksen pengguna untuk rekaman.
    - Menampilkan pesan motivasi berdasarkan skor.
    - Menampilkan transkrip ucapan-ke-teks dari rekaman pengguna.
    - Menyediakan tombol untuk membandingkan teks asli dengan transkrip.
    - Termasuk tombol untuk melanjutkan ke sesi berikutnya atau kembali ke halaman kategori setelah sesi terakhir.

## Cuplikan Kode Penting

`PracticePresenter.js` adalah mesin dari fitur latihan, dan metode `toggleRecording`-nya adalah logika paling penting. Metode ini menangani seluruh siklus hidup rekaman latihan tunggal, dari memulai rekaman hingga memproses hasilnya dan memutuskan apa yang harus dilakukan selanjutnya.

```javascript
// src/features/practice/presenters/PracticePresenter.js

async toggleRecording() {
  // ... (state management and UI updates)

  if (this.recordingService.isRecording) {
    // ... (start recording logic)
  } else {
    // Stop recording logic
    try {
      this.testView.setRecordingState(false, true); // Set UI to processing
      const recording = await this.recordingManager.stopRecording();
      
      if (recording && recording.audioBlob) {
        const result = await accentDetectionService.analyzeAccent(recording.audioBlob);
        const score = this.resultService.getScoreFromResult(result);

        this.sessionRecordings.push(recording);
        this.sessionScores.push(score);

        if (this.sessionRecordings.length >= this.maxSession) {
          // 4 sessions are complete, calculate average and save
          const avgScore = this.resultService.getAverageScore(this.sessionScores);
          savePracticeSession({ ... });
          this.showResultView({ isAverage: true, avgScore });
          // Reset session
        } else {
          // Show result for the single session
          this.showResultView({ ...result });
        }
      }
    } catch (error) {
      // ... (error handling)
    } finally {
      this.testView.setRecordingState(false, false); // Reset UI
    }
  }
}
```

Cuplikan ini penting karena menunjukkan:
- **Manajemen Sesi**: Ini melacak jumlah rekaman dalam sesi dan menentukan apakah akan menampilkan hasil individu atau skor rata-rata akhir.
- **Orkestrasi Layanan**: Ini secara mulus mengintegrasikan beberapa layanan: `recordingManager` untuk menangani audio, `accentDetectionService` untuk menganalisisnya, dan `resultService` untuk memproses skor.
- **Persistensi Data**: Ketika latihan 4 sesi selesai, ia memanggil `savePracticeSession` untuk menyimpan hasilnya di database.
- **Logika Status Kompleks**: Ini mengelola status UI di seluruh proses, dari perekaman hingga pemrosesan dan akhirnya ke tampilan hasil, memberikan pengalaman yang jelas dan responsif bagi pengguna.

## Utilitas

Fitur Latihan bergantung pada beberapa utilitas global:

- **`RecordingManager.js`**: Utilitas inti untuk mengelola perekaman audio, digunakan oleh `PracticeRecordingService`.
- **`AccentDetectionService.js`**: Digunakan untuk mengirim audio yang direkam untuk analisis dan mendapatkan skor aksen.
- **`aureaVoiceDB.js`**: Antarmuka database untuk mengambil teks latihan dan menyimpan hasil sesi.
- **`appRouter.js`**: Digunakan untuk navigasi, misalnya, untuk kembali ke halaman kategori.
- **`MicrophoneIcon.js`**: Komponen UI yang dapat digunakan kembali untuk ikon mikrofon.