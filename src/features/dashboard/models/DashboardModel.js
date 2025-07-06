import { getAllPracticeSessions, getCategories } from '../../../utils/database/aureaVoiceDB.js';

class DashboardModel {
  constructor() {
    this.currentPage = 'dashboard';
    this.userStats = null;
    this.progressData = null;
  }

  setCurrentPage(page) {
    this.currentPage = page;
  }

  getCurrentPage() {
    return this.currentPage;
  }

  /**
   * Ambil statistik user dari IndexedDB. Jika kosong, fallback ke mock.
   * @returns {Promise<Object>} userStats
   */
  async getUserStats() {
    try {
      const sessions = await getAllPracticeSessions();
      if (!sessions || sessions.length === 0) {
        // Jika tidak ada data, coba ambil skor terakhir dari localStorage (hasil tes intro)
        let introScore = 0;
        try {
          const introResult = localStorage.getItem('intro_last_result');
          if (introResult) {
            const parsed = JSON.parse(introResult);
            if (parsed && typeof parsed.confidence === 'number') {
              introScore = Number(parsed.confidence);
            }
          }
        } catch (e) {}
        return {
          accentScore: introScore,
          completedExercises: 0,
          todayExercises: 0,
          trainingTime: '0 Jam',
          latestCategory: '-',
          categoriesMastered: 0,
          needPractice: '-'
        };
      }

      // completedExercises: total sesi latihan
      const completedExercises = sessions && Array.isArray(sessions) ? sessions.length : 0;

      // todayExercises: sesi latihan hari ini
      const today = new Date();
      const todayStr = today.toISOString().slice(0, 10); // yyyy-mm-dd
      const todayExercises = sessions && Array.isArray(sessions)
        ? sessions.filter(s => (s.tanggal || '').slice(0, 10) === todayStr).length
        : 0;

      // trainingTime: total durasi (dalam jam, 1 angka di belakang koma)
      let totalSeconds = 0;
      if (sessions && Array.isArray(sessions)) {
        sessions.forEach(s => {
          if (s.durasi) {
            totalSeconds += Number(s.durasi) || 0;
          }
        });
      }
      const trainingTime = totalSeconds > 0 ? (totalSeconds / 3600).toFixed(1) + ' Jam' : '0 Jam';

      // accentScore: rata-rata hasil_sesi (1 angka di belakang koma)
      const scores = sessions && Array.isArray(sessions)
        ? sessions.map(s => Number(s.hasil_sesi)).filter(n => !isNaN(n))
        : [];
      const accentScore = scores.length > 0 ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : 0;

      // latestCategory: kategori dari sesi latihan terakhir
      let latestCategory = '-';
      if (sessions && Array.isArray(sessions) && sessions.length > 0) {
        const sorted = [...sessions].sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));
        latestCategory = sorted[0].nama_kategori || '-';
      }

      // categoriesMastered: jumlah kategori unik yang pernah dilatih (bisa diartikan sebagai dikuasai)
      const uniqueCategories = sessions && Array.isArray(sessions)
        ? new Set(sessions.map(s => s.nama_kategori))
        : new Set();
      const categoriesMastered = uniqueCategories.size;

      // needPractice: kategori dengan skor rata-rata terendah
      let needPractice = '-';
      if (uniqueCategories.size > 0) {
        const catScores = {};
        sessions.forEach(s => {
          if (!catScores[s.nama_kategori]) catScores[s.nama_kategori] = [];
          if (!isNaN(Number(s.hasil_sesi))) catScores[s.nama_kategori].push(Number(s.hasil_sesi));
        });
        let minAvg = Infinity;
        Object.entries(catScores).forEach(([cat, arr]) => {
          const avg = arr.reduce((a, b) => a + b, 0) / arr.length;
          if (avg < minAvg) {
            minAvg = avg;
            needPractice = cat;
          }
        });
      }

      return {
        accentScore,
        completedExercises,
        todayExercises,
        trainingTime,
        latestCategory,
        categoriesMastered,
        needPractice
      };
    } catch (e) {
      // Jika error, kembalikan statistik 0/default
      return {
        accentScore: 0,
        completedExercises: 0,
        todayExercises: 0,
        trainingTime: '0 Jam',
        latestCategory: '-',
        categoriesMastered: 0,
        needPractice: '-'
      };
    }
  }

  /**
   * Ambil data progres (skor per minggu, 5 minggu terakhir) dari IndexedDB. Fallback ke mock jika kosong.
   * @returns {Promise<number[]>}
   */
  async getProgressData() {
    try {
      const sessions = await getAllPracticeSessions();
      if (!sessions || sessions.length === 0) {
        // Jika tidak ada data, kembalikan array 0
        return [0, 0, 0, 0, 0];
      }

      // Kelompokkan sesi latihan berdasarkan minggu (5 minggu terakhir)
      // Gunakan minggu ISO (Senin sebagai awal minggu)
      const now = new Date();
      const weeks = [];
      for (let i = 4; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i * 7);
        // ISO week: Senin sebagai awal minggu
        const monday = new Date(d);
        monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6);
        weeks.push({ start: monday, end: sunday });
      }

      // Untuk setiap minggu, hitung rata-rata skor
      const weekScores = weeks.map(({ start, end }) => {
        const weekSessions = sessions.filter(s => {
          const tgl = new Date(s.tanggal);
          return tgl >= start && tgl <= end && !isNaN(Number(s.hasil_sesi));
        });
        if (weekSessions.length === 0) return null;
        const avg = weekSessions.reduce((a, b) => a + Number(b.hasil_sesi), 0) / weekSessions.length;
        return Number(avg.toFixed(1));
      });
      // Jika semua minggu null, kembalikan array 0
      if (weekScores.every(x => x === null)) return [0, 0, 0, 0, 0];
      // Ganti null dengan 0
      return weekScores.map(x => x === null ? 0 : x);
    } catch (e) {
      // Jika error, kembalikan array 0
      return [0, 0, 0, 0, 0];
    }
  }

  /**
   * Menghitung improvement skor minggu ini dibanding minggu lalu.
   * @returns {Promise<{show: boolean, value: number}>}
   */
  async getScoreImprovement() {
    try {
      const progress = await this.getProgressData();
      // progress: [4 minggu lalu, 3 minggu lalu, 2 minggu lalu, minggu lalu, minggu ini]
      if (!Array.isArray(progress) || progress.length < 2) {
        return { show: false, value: 0 };
      }
      const lastWeek = progress[3];
      const thisWeek = progress[4];
      // Jangan tampilkan jika minggu lalu null/0 (user baru mulai)
      if (lastWeek === null || lastWeek === 0 || typeof lastWeek !== 'number' || typeof thisWeek !== 'number') {
        return { show: false, value: 0 };
      }
      const diff = thisWeek - lastWeek;
      return {
        show: diff > 0,
        value: diff > 0 ? Number(diff.toFixed(1)) : 0
      };
    } catch (e) {
      return { show: false, value: 0 };
    }
  }

  updateUserStats(newStats) {
    this.userStats = { ...this.userStats, ...newStats };
  }

  updateProgressData(newData) {
    this.progressData = newData;
  }

  resetStats() {
    this.userStats = null;
    this.progressData = null;
  }

  getRecommendations() {
    // Recommendations based on user stats
    const stats = this.userStats || {
      accentScore: 0,
      completedExercises: 0,
      todayExercises: 0,
      trainingTime: '0 Jam',
      latestCategory: '-',
      categoriesMastered: 0,
      needPractice: '-'
    };
    const recommendations = [];

    if (stats.accentScore < 80) {
      recommendations.push({
        title: 'Improve Pronunciation',
        description: 'Focus on vowel sounds and consonant clusters',
        priority: 'high'
      });
    }

    if (stats.categoriesMastered < 3) {
      recommendations.push({
        title: 'Practice More Categories',
        description: 'Try different accent training categories',
        priority: 'medium'
      });
    }

    return recommendations;
  }
}

export default DashboardModel;
