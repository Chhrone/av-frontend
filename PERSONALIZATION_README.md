# Sistem Personalisasi AureaVoice

Dokumentasi untuk sistem personalisasi yang baru diimplementasikan di AureaVoice.

## Overview

Sistem personalisasi AureaVoice memungkinkan aplikasi untuk:
- Menyimpan hasil latihan pengguna ke IndexedDB
- Menampilkan statistik personal di dashboard
- Memberikan rekomendasi latihan berdasarkan performa
- Tracking progress mingguan dengan chart
- Navigasi yang dipersonalisasi (Kategori, About, Settings)

## Fitur Utama

### 1. Penyimpanan Progress Latihan
- **UserProgressStorage**: Menyimpan hasil setiap latihan ke IndexedDB
- **ExerciseModel**: Database latihan dengan 7 kategori dan 45+ exercise
- **ProgressTrackingService**: Service untuk mengelola progress pengguna

### 2. Dashboard Personal
- **Statistik Real-time**: Data dari latihan yang sudah dilakukan
- **Chart Mingguan**: Progress score rata-rata per minggu
- **Rekomendasi Latihan**: Berdasarkan performa dan kategori yang perlu diperbaiki
- **Personalisasi Teks**: Menggunakan "Kamu" alih-alih nama

### 3. Analisis Data
- **Kategori Dikuasai**: Kategori dengan rata-rata score ≥ 80%
- **Kategori Diselesaikan**: Kategori yang semua exercisenya sudah dicoba
- **Latihan Terbanyak**: Tracking aktivitas harian
- **Score Mingguan**: Dihitung setiap hari Senin

## Struktur Data

### UserProgress
```javascript
{
  uuid: "unique-id",           // UUID latihan (sama dengan recording)
  exerciseId: "vs_001",        // ID latihan dari ExerciseModel
  duration: 120,               // Durasi rekaman (detik)
  date: "2024-01-15",         // Tanggal latihan
  confidenceScore: 85,         // Score confidence (0-100)
  metadata: {                  // Data tambahan
    source: "accent_test",
    timestamp: 1705123456789
  }
}
```

### Exercise
```javascript
{
  id: "vs_001",
  name: "Short A Sound (/æ/)",
  category: "vowel_sounds",
  difficulty: "beginner"
}
```

## Kategori Latihan

1. **Vowel Sounds** (10 exercises) - Bunyi vokal Amerika
2. **Consonant Sounds** (10 exercises) - Bunyi konsonan Amerika  
3. **Word Stress** (5 exercises) - Penekanan kata
4. **Sentence Rhythm** (5 exercises) - Irama kalimat
5. **Intonation** (5 exercises) - Intonasi
6. **Connected Speech** (5 exercises) - Ucapan terhubung
7. **Fluency Practice** (5 exercises) - Latihan kelancaran

## API Usage

### Menyimpan Progress
```javascript
import ProgressTrackingService from './utils/ProgressTrackingService.js';

// Menyimpan hasil test
await ProgressTrackingService.saveExerciseProgress({
  uuid: "recording-uuid",
  us_confidence: 85,
  duration: 120
});
```

### Mendapatkan Statistik
```javascript
// Statistik dashboard
const stats = await dashboardModel.getUserStats();
// Returns: { accentScore, completedExercises, trainingTime, categoriesTried, categoriesMastered }

// Data chart mingguan
const chartData = await dashboardModel.getProgressData();
// Returns: { data: [75, 78, 80, 82, 85], labels: ["Week 1", "Week 2", ...] }
```

### Rekomendasi Latihan
```javascript
const recommendation = await dashboardModel.getTrainingRecommendation();
// Returns: { title, description, exerciseId }
```

## Testing & Development

### Console Commands
Buka browser console dan gunakan:

```javascript
// Generate sample data untuk testing
await window.aureaVoiceUtils.generateSampleData();

// Lihat semua progress
await window.aureaVoiceUtils.getAllProgress();

// Lihat statistik
await window.aureaVoiceUtils.getProgressStats();

// Hapus sample data
await window.aureaVoiceUtils.clearSampleData();
```

### Sample Data Generator
```javascript
import SampleDataGenerator from './utils/SampleDataGenerator.js';

// Generate 20 entries realistis
await SampleDataGenerator.generateRealisticProgressData();

// Generate data untuk kategori tertentu
await SampleDataGenerator.generateCategoryData('vowel_sounds', 5);
```

## Perubahan UI

### Navigation Bar
- **Sebelum**: "Kembali ke Test"
- **Sesudah**: "Kategori", "About", "Settings"

### Personalisasi Teks
- **Sebelum**: "Selamat datang kembali, Budi!"
- **Sesudah**: "Selamat datang kembali!"
- **Sebelum**: "Rekomendasi Latihan Utama Untuk Anda"
- **Sesudah**: "Rekomendasi Latihan Utama Untuk Kamu"

### Dashboard Stats
- **Score Aksen**: Rata-rata mingguan (dihitung setiap Senin)
- **Latihan Diselesaikan**: Total dari semua latihan
- **Waktu Latihan**: Total durasi semua latihan
- **Kategori Dicoba**: Jumlah kategori yang sudah dicoba
- **Kategori Dikuasai**: Kategori dengan rata-rata score ≥ 80%

## File Structure

```
src/
├── shared/models/
│   ├── ExerciseModel.js           # Database latihan
│   ├── UserProgressModel.js       # Model progress pengguna
│   └── DashboardAnalyticsModel.js # Analisis data dashboard
├── utils/
│   ├── UserProgressStorage.js     # IndexedDB storage
│   ├── ProgressTrackingService.js # Service utama
│   └── SampleDataGenerator.js     # Generator data testing
└── features/dashboard/
    ├── models/DashboardModel.js   # Model dashboard (updated)
    ├── presenters/DashboardPresenter.js # Presenter (updated)
    └── views/DashboardView.js     # View (updated)
```

## Integration Points

### 1. Result Page → Progress Storage
Ketika user menyelesaikan test, hasil otomatis disimpan:
```javascript
// ResultPresenter.js
await ProgressTrackingService.saveExerciseProgress(this.resultData);
```

### 2. Dashboard → Real Data
Dashboard menggunakan data real dari IndexedDB:
```javascript
// DashboardModel.js
const stats = this.analyticsModel.getDashboardStats();
const chartData = this.analyticsModel.getWeeklyProgressChartData();
```

### 3. Weekly Score Calculation
Score mingguan dihitung dari Senin ke Senin:
```javascript
// DashboardAnalyticsModel.js
getWeeklyAverageScore() {
  // Cari hari Senin terakhir
  // Hitung rata-rata score dari Senin sampai sekarang
}
```

## Future Enhancements

1. **Categories Page**: Halaman khusus untuk browsing kategori latihan
2. **Settings Page**: Pengaturan personal dan preferensi
3. **About Page**: Informasi aplikasi dan tutorial
4. **Exercise Details**: Halaman detail untuk setiap exercise
5. **Progress Export**: Export data progress ke file
6. **Achievement System**: Badge dan pencapaian berdasarkan progress
7. **Social Features**: Sharing progress dan kompetisi

## Troubleshooting

### IndexedDB Issues
```javascript
// Reset database jika ada masalah
await window.aureaVoiceUtils.progressTracking.clearAllProgress();
```

### No Data in Dashboard
```javascript
// Generate sample data untuk testing
await window.aureaVoiceUtils.generateSampleData();
```

### Chart Not Showing
- Pastikan ada data progress dalam 5 minggu terakhir
- Check console untuk error messages
- Verify Chart.js library loaded correctly
