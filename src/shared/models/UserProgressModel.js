/**
 * Model untuk menyimpan progress latihan pengguna
 */
class UserProgressModel {
  constructor() {
    this.progressData = [];
  }

  /**
   * Membuat entry progress baru
   * @param {Object} progressData - Data progress latihan
   * @param {string} progressData.uuid - UUID unik untuk latihan ini (sama dengan UUID hasil record)
   * @param {string} progressData.exerciseId - ID latihan dari ExerciseModel
   * @param {number} progressData.duration - Durasi rekaman dalam detik
   * @param {Date} progressData.date - Tanggal latihan
   * @param {number} progressData.confidenceScore - Skor confidence (0-100)
   * @param {Object} progressData.metadata - Data tambahan (opsional)
   */
  createProgress(progressData) {
    const progress = {
      uuid: progressData.uuid || this.generateUUID(),
      exerciseId: progressData.exerciseId,
      duration: progressData.duration,
      date: progressData.date || new Date(),
      confidenceScore: progressData.confidenceScore,
      metadata: progressData.metadata || {},
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.progressData.push(progress);
    return progress;
  }

  /**
   * Mendapatkan semua progress pengguna
   */
  getAllProgress() {
    return this.progressData.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  /**
   * Mendapatkan progress berdasarkan UUID
   */
  getProgressByUUID(uuid) {
    return this.progressData.find(progress => progress.uuid === uuid);
  }

  /**
   * Mendapatkan progress berdasarkan exercise ID
   */
  getProgressByExerciseId(exerciseId) {
    return this.progressData.filter(progress => progress.exerciseId === exerciseId)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  /**
   * Mendapatkan progress dalam rentang tanggal
   */
  getProgressByDateRange(startDate, endDate) {
    return this.progressData.filter(progress => {
      const progressDate = new Date(progress.date);
      return progressDate >= startDate && progressDate <= endDate;
    }).sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  /**
   * Mendapatkan progress hari ini
   */
  getTodayProgress() {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
    
    return this.getProgressByDateRange(startOfDay, endOfDay);
  }

  /**
   * Mendapatkan progress minggu ini
   */
  getThisWeekProgress() {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // Mulai dari Minggu
    startOfWeek.setHours(0, 0, 0, 0);
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);
    
    return this.getProgressByDateRange(startOfWeek, endOfWeek);
  }

  /**
   * Mendapatkan progress bulan ini
   */
  getThisMonthProgress() {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59);
    
    return this.getProgressByDateRange(startOfMonth, endOfMonth);
  }

  /**
   * Menghitung total latihan yang diselesaikan
   */
  getTotalCompletedExercises() {
    return this.progressData.length;
  }

  /**
   * Menghitung rata-rata confidence score
   */
  getAverageConfidenceScore() {
    if (this.progressData.length === 0) return 0;
    
    const totalScore = this.progressData.reduce((sum, progress) => sum + progress.confidenceScore, 0);
    return Math.round(totalScore / this.progressData.length);
  }

  /**
   * Menghitung rata-rata confidence score untuk periode tertentu
   */
  getAverageConfidenceScoreByPeriod(startDate, endDate) {
    const periodProgress = this.getProgressByDateRange(startDate, endDate);
    if (periodProgress.length === 0) return 0;
    
    const totalScore = periodProgress.reduce((sum, progress) => sum + progress.confidenceScore, 0);
    return Math.round(totalScore / periodProgress.length);
  }

  /**
   * Menghitung total durasi latihan
   */
  getTotalTrainingTime() {
    const totalSeconds = this.progressData.reduce((sum, progress) => sum + progress.duration, 0);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours} Jam ${minutes} Menit`;
    } else {
      return `${minutes} Menit`;
    }
  }

  /**
   * Mendapatkan exercise yang unik yang sudah dicoba
   */
  getUniqueExercisesTried() {
    const uniqueExercises = [...new Set(this.progressData.map(progress => progress.exerciseId))];
    return uniqueExercises;
  }

  /**
   * Mendapatkan kategori yang sudah dicoba
   */
  getCategoriesTried(exerciseModel) {
    const uniqueExercises = this.getUniqueExercisesTried();
    const categories = new Set();
    
    uniqueExercises.forEach(exerciseId => {
      const exercise = exerciseModel.getExerciseById(exerciseId);
      if (exercise) {
        categories.add(exercise.category);
      }
    });
    
    return Array.from(categories);
  }

  /**
   * Mendapatkan latihan terbanyak dalam satu hari
   */
  getMostActiveDay() {
    const dailyCount = {};
    
    this.progressData.forEach(progress => {
      const dateKey = new Date(progress.date).toDateString();
      dailyCount[dateKey] = (dailyCount[dateKey] || 0) + 1;
    });
    
    let maxCount = 0;
    let mostActiveDate = null;
    
    Object.entries(dailyCount).forEach(([date, count]) => {
      if (count > maxCount) {
        maxCount = count;
        mostActiveDate = date;
      }
    });
    
    return { date: mostActiveDate, count: maxCount };
  }

  /**
   * Generate UUID sederhana
   */
  generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  /**
   * Update progress yang sudah ada
   */
  updateProgress(uuid, updateData) {
    const progressIndex = this.progressData.findIndex(progress => progress.uuid === uuid);
    if (progressIndex !== -1) {
      this.progressData[progressIndex] = {
        ...this.progressData[progressIndex],
        ...updateData,
        updatedAt: new Date()
      };
      return this.progressData[progressIndex];
    }
    return null;
  }

  /**
   * Hapus progress berdasarkan UUID
   */
  deleteProgress(uuid) {
    const progressIndex = this.progressData.findIndex(progress => progress.uuid === uuid);
    if (progressIndex !== -1) {
      return this.progressData.splice(progressIndex, 1)[0];
    }
    return null;
  }

  /**
   * Clear semua data progress
   */
  clearAllProgress() {
    this.progressData = [];
  }
}

export default UserProgressModel;
