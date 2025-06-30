/**
 * Model untuk analisis data dashboard
 */
class DashboardAnalyticsModel {
  constructor(userProgressModel, exerciseModel) {
    this.userProgressModel = userProgressModel;
    this.exerciseModel = exerciseModel;
  }

  /**
   * Mendapatkan statistik utama untuk dashboard
   */
  getDashboardStats() {
    const allProgress = this.userProgressModel.getAllProgress();
    const totalExercises = this.userProgressModel.getTotalCompletedExercises();
    const averageScore = this.getWeeklyAverageScore();
    const trainingTime = this.userProgressModel.getTotalTrainingTime();
    const categoriesData = this.getCategoriesAnalysis();
    const mostActiveDay = this.userProgressModel.getMostActiveDay();

    return {
      accentScore: averageScore,
      completedExercises: totalExercises,
      trainingTime: trainingTime,
      categoriesTried: `${categoriesData.triedCount}/${categoriesData.totalCount}`,
      categoriesMastered: categoriesData.masteredCount,
      mostActiveDay: mostActiveDay,
      categoriesCompleted: categoriesData.completedCount
    };
  }

  /**
   * Menghitung rata-rata score mingguan (dihitung setiap hari Senin)
   */
  getWeeklyAverageScore() {
    const today = new Date();
    const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    // Cari hari Senin terakhir
    const lastMonday = new Date(today);
    const daysToSubtract = currentDay === 0 ? 6 : currentDay - 1; // Jika hari Minggu, mundur 6 hari
    lastMonday.setDate(today.getDate() - daysToSubtract);
    lastMonday.setHours(0, 0, 0, 0);
    
    // Minggu ini (dari Senin terakhir sampai sekarang)
    const thisWeekProgress = this.userProgressModel.getProgressByDateRange(lastMonday, today);
    
    if (thisWeekProgress.length === 0) {
      // Jika tidak ada data minggu ini, ambil rata-rata keseluruhan
      return this.userProgressModel.getAverageConfidenceScore();
    }
    
    const totalScore = thisWeekProgress.reduce((sum, progress) => sum + progress.confidenceScore, 0);
    return Math.round(totalScore / thisWeekProgress.length);
  }

  /**
   * Mendapatkan data untuk chart progress mingguan
   */
  getWeeklyProgressChartData() {
    const today = new Date();
    const chartData = [];
    const labels = [];
    
    // Ambil data 5 minggu terakhir
    for (let i = 4; i >= 0; i--) {
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - (i * 7) - today.getDay() + 1); // Mulai dari Senin
      weekStart.setHours(0, 0, 0, 0);
      
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);
      
      const weekProgress = this.userProgressModel.getProgressByDateRange(weekStart, weekEnd);
      
      let weeklyScore = 0;
      if (weekProgress.length > 0) {
        const totalScore = weekProgress.reduce((sum, progress) => sum + progress.confidenceScore, 0);
        weeklyScore = Math.round(totalScore / weekProgress.length);
      }
      
      chartData.push(weeklyScore);
      
      // Format label minggu
      const weekLabel = `${weekStart.getDate()}/${weekStart.getMonth() + 1}`;
      labels.push(weekLabel);
    }
    
    return { data: chartData, labels: labels };
  }

  /**
   * Analisis kategori yang dikuasai, dicoba, dan diselesaikan
   */
  getCategoriesAnalysis() {
    const allCategories = this.exerciseModel.getAllCategories();
    const totalCount = allCategories.length;
    const triedCategories = this.userProgressModel.getCategoriesTried(this.exerciseModel);
    const triedCount = triedCategories.length;
    
    // Kategori yang dikuasai (rata-rata score >= 80)
    const masteredCategories = this.getMasteredCategories();
    const masteredCount = masteredCategories.length;
    
    // Kategori yang diselesaikan (semua exercise dalam kategori sudah dicoba)
    const completedCategories = this.getCompletedCategories();
    const completedCount = completedCategories.length;
    
    return {
      totalCount,
      triedCount,
      masteredCount,
      completedCount,
      masteredCategories,
      completedCategories
    };
  }

  /**
   * Mendapatkan kategori yang paling dikuasai (rata-rata confidence score tertinggi)
   */
  getMostMasteredCategory() {
    const triedCategories = this.userProgressModel.getCategoriesTried(this.exerciseModel);
    let bestCategory = null;
    let bestScore = 0;
    
    triedCategories.forEach(categoryId => {
      const categoryExercises = this.exerciseModel.getExercisesByCategory(categoryId);
      const categoryProgress = [];
      
      categoryExercises.forEach(exercise => {
        const exerciseProgress = this.userProgressModel.getProgressByExerciseId(exercise.id);
        categoryProgress.push(...exerciseProgress);
      });
      
      if (categoryProgress.length > 0) {
        const totalScore = categoryProgress.reduce((sum, progress) => sum + progress.confidenceScore, 0);
        const averageScore = totalScore / categoryProgress.length;
        
        if (averageScore > bestScore) {
          bestScore = averageScore;
          bestCategory = this.exerciseModel.getCategoryById(categoryId);
        }
      }
    });
    
    return bestCategory ? { category: bestCategory, score: Math.round(bestScore) } : null;
  }

  /**
   * Mendapatkan kategori yang dikuasai (rata-rata score >= 80)
   */
  getMasteredCategories() {
    const triedCategories = this.userProgressModel.getCategoriesTried(this.exerciseModel);
    const masteredCategories = [];
    
    triedCategories.forEach(categoryId => {
      const categoryExercises = this.exerciseModel.getExercisesByCategory(categoryId);
      const categoryProgress = [];
      
      categoryExercises.forEach(exercise => {
        const exerciseProgress = this.userProgressModel.getProgressByExerciseId(exercise.id);
        categoryProgress.push(...exerciseProgress);
      });
      
      if (categoryProgress.length > 0) {
        const totalScore = categoryProgress.reduce((sum, progress) => sum + progress.confidenceScore, 0);
        const averageScore = totalScore / categoryProgress.length;
        
        if (averageScore >= 80) {
          const category = this.exerciseModel.getCategoryById(categoryId);
          masteredCategories.push({
            category: category,
            score: Math.round(averageScore)
          });
        }
      }
    });
    
    return masteredCategories.sort((a, b) => b.score - a.score);
  }

  /**
   * Mendapatkan kategori yang diselesaikan (semua exercise sudah dicoba)
   */
  getCompletedCategories() {
    const allCategories = this.exerciseModel.getAllCategories();
    const completedCategories = [];
    const uniqueExercisesTried = this.userProgressModel.getUniqueExercisesTried();
    
    allCategories.forEach(category => {
      const categoryExercises = this.exerciseModel.getExercisesByCategory(category.id);
      const triedExercisesInCategory = categoryExercises.filter(exercise => 
        uniqueExercisesTried.includes(exercise.id)
      );
      
      if (triedExercisesInCategory.length === categoryExercises.length) {
        completedCategories.push(category);
      }
    });
    
    return completedCategories;
  }

  /**
   * Mendapatkan rekomendasi latihan berdasarkan performa
   */
  getTrainingRecommendation() {
    const allProgress = this.userProgressModel.getAllProgress();
    
    if (allProgress.length === 0) {
      return {
        title: 'Mulai Latihan Pertama',
        description: 'Mulai dengan latihan dasar vowel sounds untuk membangun fondasi yang kuat.',
        exerciseId: 'vs_001'
      };
    }
    
    // Cari kategori dengan score terendah
    const triedCategories = this.userProgressModel.getCategoriesTried(this.exerciseModel);
    let worstCategory = null;
    let worstScore = 100;
    
    triedCategories.forEach(categoryId => {
      const categoryExercises = this.exerciseModel.getExercisesByCategory(categoryId);
      const categoryProgress = [];
      
      categoryExercises.forEach(exercise => {
        const exerciseProgress = this.userProgressModel.getProgressByExerciseId(exercise.id);
        categoryProgress.push(...exerciseProgress);
      });
      
      if (categoryProgress.length > 0) {
        const totalScore = categoryProgress.reduce((sum, progress) => sum + progress.confidenceScore, 0);
        const averageScore = totalScore / categoryProgress.length;
        
        if (averageScore < worstScore) {
          worstScore = averageScore;
          worstCategory = this.exerciseModel.getCategoryById(categoryId);
        }
      }
    });
    
    if (worstCategory) {
      return {
        title: worstCategory.name,
        description: `Tingkatkan kemampuan ${worstCategory.description.toLowerCase()} untuk hasil yang lebih baik.`,
        category: worstCategory
      };
    }
    
    return {
      title: 'Lanjutkan Latihan',
      description: 'Terus berlatih untuk mempertahankan dan meningkatkan kemampuan Kamu.',
      exerciseId: null
    };
  }
}

export default DashboardAnalyticsModel;
