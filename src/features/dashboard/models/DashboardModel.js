import UserProgressStorage from '../../../utils/UserProgressStorage.js';
import ExerciseModel from '../../../shared/models/ExerciseModel.js';
import UserProgressModel from '../../../shared/models/UserProgressModel.js';
import DashboardAnalyticsModel from '../../../shared/models/DashboardAnalyticsModel.js';

class DashboardModel {
  constructor() {
    this.currentPage = 'dashboard';
    // Initialize dashboard-specific data
    this.userStats = null;
    this.progressData = null;

    // Initialize storage and models
    this.userProgressStorage = new UserProgressStorage();
    this.exerciseModel = new ExerciseModel();
    this.userProgressModel = new UserProgressModel();
    this.analyticsModel = new DashboardAnalyticsModel(this.userProgressModel, this.exerciseModel);

    this.isInitialized = false;
  }

  async init() {
    if (!this.isInitialized) {
      try {
        await this.userProgressStorage.init();
        await this.loadUserProgress();
        this.isInitialized = true;
        console.log('DashboardModel initialized successfully');
      } catch (error) {
        console.error('Failed to initialize DashboardModel:', error);
        // Fallback to mock data if initialization fails
        this.loadMockData();
      }
    }
  }

  async loadUserProgress() {
    try {
      const allProgress = await this.userProgressStorage.getAllProgress();

      // Load progress data into UserProgressModel
      this.userProgressModel.progressData = allProgress;

      console.log('Loaded user progress:', allProgress.length, 'entries');
    } catch (error) {
      console.error('Failed to load user progress:', error);
      this.userProgressModel.progressData = [];
    }
  }

  loadMockData() {
    // Fallback mock data if storage fails
    this.userProgressModel.progressData = [];
    console.log('Using mock data for dashboard');
  }

  setCurrentPage(page) {
    this.currentPage = page;
  }

  getCurrentPage() {
    return this.currentPage;
  }

  async getUserStats() {
    if (!this.isInitialized) {
      await this.init();
    }

    try {
      const stats = this.analyticsModel.getDashboardStats();
      this.userStats = stats;
      return stats;
    } catch (error) {
      console.error('Failed to get user stats:', error);
      // Return fallback mock data
      return {
        accentScore: 0,
        completedExercises: 0,
        trainingTime: '0 Menit',
        categoriesTried: '0/7',
        categoriesMastered: 0
      };
    }
  }

  async getProgressData() {
    if (!this.isInitialized) {
      await this.init();
    }

    try {
      const chartData = this.analyticsModel.getWeeklyProgressChartData();
      this.progressData = chartData.data;
      return chartData;
    } catch (error) {
      console.error('Failed to get progress data:', error);
      // Return fallback mock data
      return {
        data: [0, 0, 0, 0, 0],
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5']
      };
    }
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

  async getTrainingRecommendation() {
    if (!this.isInitialized) {
      await this.init();
    }

    try {
      return this.analyticsModel.getTrainingRecommendation();
    } catch (error) {
      console.error('Failed to get training recommendation:', error);
      return {
        title: 'Mulai Latihan Pertama',
        description: 'Mulai dengan latihan dasar untuk membangun fondasi yang kuat.',
        exerciseId: null
      };
    }
  }

  async getMostMasteredCategory() {
    if (!this.isInitialized) {
      await this.init();
    }

    try {
      return this.analyticsModel.getMostMasteredCategory();
    } catch (error) {
      console.error('Failed to get most mastered category:', error);
      return null;
    }
  }

  async saveProgress(progressData) {
    if (!this.isInitialized) {
      await this.init();
    }

    try {
      // Save to storage
      const savedProgress = await this.userProgressStorage.saveProgress(progressData);

      // Update local model
      this.userProgressModel.createProgress(savedProgress);

      console.log('Progress saved successfully:', savedProgress.uuid);
      return savedProgress;
    } catch (error) {
      console.error('Failed to save progress:', error);
      throw error;
    }
  }

  getExerciseModel() {
    return this.exerciseModel;
  }

  getUserProgressModel() {
    return this.userProgressModel;
  }

  getAnalyticsModel() {
    return this.analyticsModel;
  }
}

export default DashboardModel;
