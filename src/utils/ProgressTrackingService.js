/**
 * Service untuk tracking progress latihan pengguna
 * Mengintegrasikan hasil recording dengan sistem progress
 */
import UserProgressStorage from './UserProgressStorage.js';
import ExerciseModel from '../shared/models/ExerciseModel.js';

class ProgressTrackingService {
  constructor() {
    this.userProgressStorage = new UserProgressStorage();
    this.exerciseModel = new ExerciseModel();
    this.isInitialized = false;
  }

  async init() {
    if (!this.isInitialized) {
      try {
        await this.userProgressStorage.init();
        this.isInitialized = true;
        console.log('ProgressTrackingService initialized successfully');
      } catch (error) {
        console.error('Failed to initialize ProgressTrackingService:', error);
        throw error;
      }
    }
  }

  /**
   * Menyimpan hasil latihan dari recording
   * @param {Object} recordingResult - Hasil recording dari AccentDetectionService
   * @param {string} recordingResult.uuid - UUID recording
   * @param {number} recordingResult.us_confidence - Confidence score (0-100)
   * @param {number} recordingResult.duration - Durasi recording dalam detik
   * @param {string} exerciseId - ID latihan (opsional, default ke latihan umum)
   */
  async saveExerciseProgress(recordingResult, exerciseId = null) {
    if (!this.isInitialized) {
      await this.init();
    }

    try {
      // Jika tidak ada exerciseId, gunakan latihan umum
      const finalExerciseId = exerciseId || this.getDefaultExerciseId(recordingResult.us_confidence);

      const progressData = {
        uuid: recordingResult.uuid,
        exerciseId: finalExerciseId,
        duration: recordingResult.duration || 0,
        date: new Date(),
        confidenceScore: Math.round(recordingResult.us_confidence || 0),
        metadata: {
          originalResult: recordingResult,
          source: 'accent_test',
          timestamp: Date.now()
        }
      };

      const savedProgress = await this.userProgressStorage.saveProgress(progressData);
      console.log('Exercise progress saved:', savedProgress.uuid);
      
      return savedProgress;
    } catch (error) {
      console.error('Failed to save exercise progress:', error);
      throw error;
    }
  }

  /**
   * Mendapatkan exercise ID default berdasarkan confidence score
   * Untuk hasil test umum, pilih exercise yang sesuai dengan level
   */
  getDefaultExerciseId(confidenceScore) {
    if (confidenceScore >= 80) {
      // Level advanced - connected speech
      return 'csp_005'; // Linking Sounds
    } else if (confidenceScore >= 60) {
      // Level intermediate - sentence rhythm
      return 'sr_001'; // Basic Sentence Stress
    } else {
      // Level beginner - vowel sounds
      return 'vs_001'; // Short A Sound
    }
  }

  /**
   * Mendapatkan semua progress pengguna
   */
  async getAllProgress() {
    if (!this.isInitialized) {
      await this.init();
    }

    try {
      return await this.userProgressStorage.getAllProgress();
    } catch (error) {
      console.error('Failed to get all progress:', error);
      return [];
    }
  }

  /**
   * Mendapatkan progress untuk exercise tertentu
   */
  async getProgressByExercise(exerciseId) {
    if (!this.isInitialized) {
      await this.init();
    }

    try {
      return await this.userProgressStorage.getProgressByExerciseId(exerciseId);
    } catch (error) {
      console.error('Failed to get progress by exercise:', error);
      return [];
    }
  }

  /**
   * Mendapatkan statistik progress pengguna
   */
  async getProgressStatistics() {
    if (!this.isInitialized) {
      await this.init();
    }

    try {
      return await this.userProgressStorage.getStatistics();
    } catch (error) {
      console.error('Failed to get progress statistics:', error);
      return {
        totalExercises: 0,
        averageScore: 0,
        totalDuration: 0,
        uniqueExercises: 0
      };
    }
  }

  /**
   * Mendapatkan progress hari ini
   */
  async getTodayProgress() {
    if (!this.isInitialized) {
      await this.init();
    }

    try {
      const today = new Date();
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
      
      return await this.userProgressStorage.getProgressByDateRange(startOfDay, endOfDay);
    } catch (error) {
      console.error('Failed to get today progress:', error);
      return [];
    }
  }

  /**
   * Mendapatkan progress minggu ini
   */
  async getThisWeekProgress() {
    if (!this.isInitialized) {
      await this.init();
    }

    try {
      const today = new Date();
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay()); // Mulai dari Minggu
      startOfWeek.setHours(0, 0, 0, 0);
      
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      endOfWeek.setHours(23, 59, 59, 999);
      
      return await this.userProgressStorage.getProgressByDateRange(startOfWeek, endOfWeek);
    } catch (error) {
      console.error('Failed to get this week progress:', error);
      return [];
    }
  }

  /**
   * Menghapus progress berdasarkan UUID
   */
  async deleteProgress(uuid) {
    if (!this.isInitialized) {
      await this.init();
    }

    try {
      return await this.userProgressStorage.deleteProgress(uuid);
    } catch (error) {
      console.error('Failed to delete progress:', error);
      throw error;
    }
  }

  /**
   * Menghapus semua progress (untuk reset)
   */
  async clearAllProgress() {
    if (!this.isInitialized) {
      await this.init();
    }

    try {
      return await this.userProgressStorage.clearAllProgress();
    } catch (error) {
      console.error('Failed to clear all progress:', error);
      throw error;
    }
  }

  /**
   * Mendapatkan exercise model untuk referensi
   */
  getExerciseModel() {
    return this.exerciseModel;
  }

  /**
   * Mendapatkan exercise berdasarkan kategori
   */
  getExercisesByCategory(categoryId) {
    return this.exerciseModel.getExercisesByCategory(categoryId);
  }

  /**
   * Mendapatkan semua kategori
   */
  getAllCategories() {
    return this.exerciseModel.getAllCategories();
  }

  /**
   * Mendapatkan rekomendasi exercise berdasarkan performa
   */
  async getExerciseRecommendation() {
    try {
      const allProgress = await this.getAllProgress();
      
      if (allProgress.length === 0) {
        // Jika belum ada progress, rekomendasikan exercise beginner
        return this.exerciseModel.getExerciseById('vs_001');
      }

      // Hitung rata-rata score
      const totalScore = allProgress.reduce((sum, progress) => sum + progress.confidenceScore, 0);
      const averageScore = totalScore / allProgress.length;

      // Rekomendasikan berdasarkan level
      if (averageScore >= 80) {
        // Advanced level - connected speech atau fluency
        const advancedExercises = [
          ...this.exerciseModel.getExercisesByCategory('connected_speech'),
          ...this.exerciseModel.getExercisesByCategory('fluency_practice')
        ];
        return advancedExercises[Math.floor(Math.random() * advancedExercises.length)];
      } else if (averageScore >= 60) {
        // Intermediate level - word stress atau sentence rhythm
        const intermediateExercises = [
          ...this.exerciseModel.getExercisesByCategory('word_stress'),
          ...this.exerciseModel.getExercisesByCategory('sentence_rhythm')
        ];
        return intermediateExercises[Math.floor(Math.random() * intermediateExercises.length)];
      } else {
        // Beginner level - vowel atau consonant sounds
        const beginnerExercises = [
          ...this.exerciseModel.getExercisesByCategory('vowel_sounds'),
          ...this.exerciseModel.getExercisesByCategory('consonant_sounds')
        ];
        return beginnerExercises[Math.floor(Math.random() * beginnerExercises.length)];
      }
    } catch (error) {
      console.error('Failed to get exercise recommendation:', error);
      return this.exerciseModel.getExerciseById('vs_001'); // Fallback
    }
  }
}

// Create singleton instance
const progressTrackingService = new ProgressTrackingService();

export default progressTrackingService;
