class DashboardModel {
  constructor() {
    this.currentPage = 'dashboard';
    // Initialize dashboard-specific data
    this.userStats = null;
    this.progressData = null;
  }

  setCurrentPage(page) {
    this.currentPage = page;
  }

  getCurrentPage() {
    return this.currentPage;
  }

  getUserStats() {
    // In a real app, this would fetch from a database or local storage
    // For now, return mock data
    if (!this.userStats) {
      this.userStats = {
        accentScore: 82,
        completedExercises: 128,
        todayExercises: 5,
        trainingTime: '14 Jam',
        latestCategory: 'Pronunciation',
        categoriesMastered: 2,
        needPractice: 'Intonation'
      };
    }
    return this.userStats;
  }

  getProgressData() {
    // Mock progress data for the chart
    if (!this.progressData) {
      this.progressData = [75, 78, 77, 80, 82];
    }
    return this.progressData;
  }

  updateUserStats(newStats) {
    // In a real app, this would save to a database or local storage
    console.log('Updating user stats:', newStats);
    this.userStats = { ...this.userStats, ...newStats };
  }

  updateProgressData(newData) {
    // Update progress data
    this.progressData = newData;
  }

  // Additional dashboard-specific methods can be added here
  resetStats() {
    this.userStats = null;
    this.progressData = null;
  }

  getRecommendations() {
    // Mock recommendations based on user stats
    const stats = this.getUserStats();
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
