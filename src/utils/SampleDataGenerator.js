/**
 * Utility untuk generate sample data untuk testing dashboard
 */
import ProgressTrackingService from './ProgressTrackingService.js';

class SampleDataGenerator {
  constructor() {
    this.exerciseIds = [
      'vs_001', 'vs_002', 'vs_003', 'vs_004', 'vs_005',
      'cs_001', 'cs_002', 'cs_003', 'cs_004', 'cs_005',
      'ws_001', 'ws_002', 'ws_003', 'ws_004', 'ws_005',
      'sr_001', 'sr_002', 'sr_003', 'sr_004', 'sr_005',
      'in_001', 'in_002', 'in_003', 'in_004', 'in_005',
      'csp_001', 'csp_002', 'csp_003', 'csp_004', 'csp_005',
      'fp_001', 'fp_002', 'fp_003', 'fp_004', 'fp_005'
    ];
  }

  /**
   * Generate sample progress data untuk testing
   */
  async generateSampleData(numberOfEntries = 20) {
    try {
      await ProgressTrackingService.init();
      
      const sampleData = [];
      const now = new Date();
      
      for (let i = 0; i < numberOfEntries; i++) {
        // Generate random date dalam 30 hari terakhir
        const daysAgo = Math.floor(Math.random() * 30);
        const date = new Date(now);
        date.setDate(date.getDate() - daysAgo);
        
        // Random exercise
        const exerciseId = this.exerciseIds[Math.floor(Math.random() * this.exerciseIds.length)];
        
        // Generate confidence score dengan distribusi yang realistis
        let confidenceScore;
        if (Math.random() < 0.3) {
          // 30% chance untuk score rendah (40-60)
          confidenceScore = Math.floor(Math.random() * 20) + 40;
        } else if (Math.random() < 0.7) {
          // 40% chance untuk score menengah (60-80)
          confidenceScore = Math.floor(Math.random() * 20) + 60;
        } else {
          // 30% chance untuk score tinggi (80-95)
          confidenceScore = Math.floor(Math.random() * 15) + 80;
        }
        
        // Random duration (30 detik - 3 menit)
        const duration = Math.floor(Math.random() * 150) + 30;
        
        const progressData = {
          uuid: this.generateUUID(),
          exerciseId: exerciseId,
          duration: duration,
          date: date,
          confidenceScore: confidenceScore,
          metadata: {
            source: 'sample_data',
            generated: true,
            timestamp: Date.now()
          }
        };
        
        const savedProgress = await ProgressTrackingService.saveExerciseProgress(progressData);
        sampleData.push(savedProgress);
      }
      
      console.log(`Generated ${sampleData.length} sample progress entries`);
      return sampleData;
    } catch (error) {
      console.error('Failed to generate sample data:', error);
      throw error;
    }
  }

  /**
   * Generate sample data dengan pola progress yang realistis
   */
  async generateRealisticProgressData() {
    try {
      await ProgressTrackingService.init();
      
      const sampleData = [];
      const now = new Date();
      let baseScore = 45; // Mulai dari score rendah
      
      // Generate data untuk 4 minggu terakhir dengan progress yang meningkat
      for (let week = 3; week >= 0; week--) {
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - (week * 7) - now.getDay() + 1); // Mulai dari Senin
        
        // 3-5 latihan per minggu
        const exercisesThisWeek = Math.floor(Math.random() * 3) + 3;
        
        for (let exercise = 0; exercise < exercisesThisWeek; exercise++) {
          const exerciseDate = new Date(weekStart);
          exerciseDate.setDate(weekStart.getDate() + Math.floor(Math.random() * 7));
          
          // Score meningkat seiring waktu dengan variasi
          const weeklyImprovement = (3 - week) * 8; // 8 poin per minggu
          const variation = Math.floor(Math.random() * 10) - 5; // ±5 poin variasi
          const confidenceScore = Math.min(95, Math.max(30, baseScore + weeklyImprovement + variation));
          
          // Pilih exercise berdasarkan level
          let exerciseId;
          if (confidenceScore < 60) {
            // Beginner exercises
            exerciseId = ['vs_001', 'vs_002', 'vs_003', 'cs_001', 'cs_002'][Math.floor(Math.random() * 5)];
          } else if (confidenceScore < 80) {
            // Intermediate exercises
            exerciseId = ['ws_001', 'ws_002', 'sr_001', 'sr_002', 'in_001'][Math.floor(Math.random() * 5)];
          } else {
            // Advanced exercises
            exerciseId = ['csp_001', 'csp_002', 'fp_001', 'fp_002', 'fp_003'][Math.floor(Math.random() * 5)];
          }
          
          const duration = Math.floor(Math.random() * 120) + 60; // 1-3 menit
          
          const progressData = {
            uuid: this.generateUUID(),
            exerciseId: exerciseId,
            duration: duration,
            date: exerciseDate,
            confidenceScore: confidenceScore,
            metadata: {
              source: 'realistic_sample',
              week: 3 - week,
              generated: true,
              timestamp: Date.now()
            }
          };
          
          const savedProgress = await ProgressTrackingService.saveExerciseProgress(progressData);
          sampleData.push(savedProgress);
        }
      }
      
      console.log(`Generated ${sampleData.length} realistic progress entries`);
      return sampleData;
    } catch (error) {
      console.error('Failed to generate realistic progress data:', error);
      throw error;
    }
  }

  /**
   * Clear semua sample data
   */
  async clearSampleData() {
    try {
      await ProgressTrackingService.init();
      const allProgress = await ProgressTrackingService.getAllProgress();
      
      // Hapus hanya data yang di-generate (memiliki metadata.generated = true)
      let deletedCount = 0;
      for (const progress of allProgress) {
        if (progress.metadata && progress.metadata.generated) {
          await ProgressTrackingService.deleteProgress(progress.uuid);
          deletedCount++;
        }
      }
      
      console.log(`Deleted ${deletedCount} sample progress entries`);
      return deletedCount;
    } catch (error) {
      console.error('Failed to clear sample data:', error);
      throw error;
    }
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
   * Generate sample data untuk kategori tertentu
   */
  async generateCategoryData(categoryId, numberOfEntries = 5) {
    try {
      await ProgressTrackingService.init();
      const exerciseModel = ProgressTrackingService.getExerciseModel();
      const categoryExercises = exerciseModel.getExercisesByCategory(categoryId);
      
      if (categoryExercises.length === 0) {
        throw new Error(`No exercises found for category: ${categoryId}`);
      }
      
      const sampleData = [];
      const now = new Date();
      
      for (let i = 0; i < numberOfEntries; i++) {
        const daysAgo = Math.floor(Math.random() * 14); // 2 minggu terakhir
        const date = new Date(now);
        date.setDate(date.getDate() - daysAgo);
        
        const exercise = categoryExercises[Math.floor(Math.random() * categoryExercises.length)];
        const confidenceScore = Math.floor(Math.random() * 40) + 60; // 60-100
        const duration = Math.floor(Math.random() * 90) + 30; // 30 detik - 2 menit
        
        const progressData = {
          uuid: this.generateUUID(),
          exerciseId: exercise.id,
          duration: duration,
          date: date,
          confidenceScore: confidenceScore,
          metadata: {
            source: 'category_sample',
            category: categoryId,
            generated: true,
            timestamp: Date.now()
          }
        };
        
        const savedProgress = await ProgressTrackingService.saveExerciseProgress(progressData);
        sampleData.push(savedProgress);
      }
      
      console.log(`Generated ${sampleData.length} sample entries for category: ${categoryId}`);
      return sampleData;
    } catch (error) {
      console.error(`Failed to generate category data for ${categoryId}:`, error);
      throw error;
    }
  }
}

// Create singleton instance
const sampleDataGenerator = new SampleDataGenerator();

export default sampleDataGenerator;
