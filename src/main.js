import { appRouter } from './utils/appRouter.js';
import { seedIfNeeded } from './utils/database/seedDB.js';
import IntroRouter from './utils/introRouter.js';
import {
  WelcomePresenter,
  TestPresenter,
  ResultPresenter,
  SplashPresenter,
  IntroModel,
  SplashModel,
  DashboardPresenter,
  DashboardModel
} from './features/index.js';
import {
  PracticePresenter,
  PracticeTestModel,
  PracticeResultModel
} from './features/practice/index.js';
import { setupMainRoutes, setupIntroRoutes } from './utils/routerSetup.js';
import { showError } from './utils/errorHandler.js';
import { setupGlobalCleanup } from './utils/appEvents.js';
import RecordingManager from './utils/RecordingManager.js';
import { FooterPresenter } from './shared/index.js';
import './utils/ViewTransitionHelper.js'; // Initialize View Transition API support
import { categoryRouteMap, scrollToTop } from './utils/appHelpers.js';

class App {
  constructor() {
    // Initialize router instance
    this.router = appRouter;
    this.mainRouter = appRouter;
    window.router = appRouter;

    // Set up error handling
    appRouter.setErrorHandler(showError);

    // Initialize models and presenters
    this.introModel = new IntroModel();
    this.splashModel = new SplashModel();
    this.dashboardModel = new DashboardModel();
    this.practiceTestModel = new PracticeTestModel();
    this.practiceResultModel = new PracticeResultModel();
    this.currentPresenter = null;
    // this.footer = new FooterPresenter();
    this.isFromIntroFlow = false;
    
    // Check intro completion status
    this.hasCompletedIntro = this.checkIntroToken();
    
    // Initialize intro router only if needed
    this.introRouter = this.hasCompletedIntro ? null : new IntroRouter();
    
    // Set up application routes
    setupMainRoutes(this);
    if (!this.hasCompletedIntro) {
      setupIntroRoutes(this);
    }
    
    // Start the router if available
    if (typeof this.mainRouter.start === 'function') {
      this.mainRouter.start();
    }
    
    // Initialize application components
    setupGlobalCleanup();
    // this.initializeFooter();
  }

  showProfile() {
    // Implement profile view logic here
    console.log('Showing profile page');
    // You'll need to create and show the profile view
  }

  // Show category page
  showCategory(params) {
    console.log('Navigating to category with params:', params);
    this.destroyCurrentPresenter();
    
    try {
      // Get categoryId from params (either from route or direct call)
      const categoryId = params.categoryId || (params.name ? params.name : null);
      
      if (!categoryId) {
        const errorMsg = 'ID kategori tidak ditemukan';
        console.error(errorMsg, params);
        showError(errorMsg);
        return;
      }
      
      console.log('Loading category module for:', categoryId);
      
      // Show loading state
      const appContainer = document.getElementById('app');
      if (appContainer) {
        appContainer.innerHTML = '<div style="text-align: center; padding: 2rem;">Memuat konten...</div>';
      }
      
      import('./features/category/index.js')
        .then(mod => {
          console.log('Category module loaded successfully');
          try {
            const CategoryModel = mod.CategoryModel;
            const CategoryPresenter = mod.CategoryPresenter;
            const model = new CategoryModel();
            this.currentPresenter = new CategoryPresenter(model);
            this.currentPresenter.init(categoryId);
            scrollToTop();
            console.log('Category presenter initialized for:', categoryId);
          } catch (initError) {
            console.error('Error initializing category presenter:', initError);
            showError('Gagal memuat konten kategori');
          }
        })
        .catch(error => {
          console.error('Error loading category module:', error);
          showError('Gagal memuat modul kategori');
        });
    } catch (error) {
      console.error('Unexpected error in showCategory:', error);
      showError('Terjadi kesalahan tak terduga');
    }
  }

  async showPractice(params) {
    try {
      const { categoryId, practiceId } = params;
      console.log('showPractice params:', { categoryId, practiceId });
      if (!categoryId || !practiceId) {
        throw new Error('Category ID atau Practice ID tidak ditemukan');
      }
      // Destroy presenter lama
      this.destroyCurrentPresenter();
      // Bersihkan root container
      const appContainer = document.getElementById('app');
      if (appContainer) {
        appContainer.innerHTML = '';
      }
      // Normalisasi categoryId ke dash-case (dan khusus konsonan)
      let normalizedCategoryId = categoryId.replace(/_/g, '-');
      if (normalizedCategoryId === 'konsonan') {
        normalizedCategoryId = 'konsonan-inventory';
      }
      const testPresenter = new PracticePresenter(this.practiceTestModel, normalizedCategoryId, practiceId);
      await testPresenter.init();
      this.currentPresenter = testPresenter;
      // Example: to show result after test, you can call PracticeResultPresenter
      // const resultPresenter = new PracticeResultPresenter(this.practiceResultModel);
      // resultPresenter.showResult(resultData);
    } catch (error) {
      console.error('Error showing practice page:', error);
      showError('Gagal memuat halaman latihan. ' + (error.message || ''));
    }
  }

  // Tambahkan method baru untuk menampilkan hasil practice
  async showPracticeResult(params) {
    try {
      // Ambil data hasil dari localStorage
      const resultData = JSON.parse(localStorage.getItem('practiceResult'));
      this.destroyCurrentPresenter();
      const resultPresenter = new PracticeResultPresenter(this.practiceResultModel);
      resultPresenter.init();
      this.currentPresenter = resultPresenter;
    } catch (error) {
      console.error('Error showing practice result:', error);
      showError('Gagal memuat hasil latihan. ' + (error.message || ''));
    }
  }

  showWelcome() {
    this.destroyCurrentPresenter();
    this.currentPresenter = new WelcomePresenter(this.introModel);
    this.currentPresenter.init();
    this.introModel.setCurrentPage('welcome');
    this.isFromIntroFlow = false; // Reset intro flow flag
  }

  showTest() {
    this.destroyCurrentPresenter();
    this.currentPresenter = new TestPresenter(this.introModel);
    this.currentPresenter.init();
    this.introModel.setCurrentPage('test');
    this.isFromIntroFlow = false; // Reset intro flow flag (in case user navigates directly)
  }

  showResult() {
    // Get the result data from sessionStorage
    const resultData = JSON.parse(sessionStorage.getItem('accentResult') || '{}');
    console.log('Showing result with data:', resultData);
    
    this.destroyCurrentPresenter();
    this.currentPresenter = new ResultPresenter(resultData, this.introModel);
    this.currentPresenter.init();
    this.introModel.setCurrentPage('result');
    this.isFromIntroFlow = true; // Mark that we're in intro flow
  }

  showDashboard() {
    console.log('[App] showDashboard dipanggil, isFromIntroFlow:', this.isFromIntroFlow);
    // Show splash screen only if coming from intro flow
    if (this.isFromIntroFlow) {
      this.isFromIntroFlow = false; // Reset flag
      this.showSplash();
    } else {
      this.showDashboardDirect();
    }
  }

  showSplash() {
    this.destroyCurrentPresenter();
    this.currentPresenter = new SplashPresenter(this.splashModel, () => {
      this.showDashboardDirect();
    });
    this.currentPresenter.init();
  }

  showDashboardDirect() {
    console.log('[App] showDashboardDirect dipanggil');
    this.destroyCurrentPresenter();
    this.currentPresenter = new DashboardPresenter(this.dashboardModel);
    this.currentPresenter.init();
    this.dashboardModel.setCurrentPage('dashboard');
    scrollToTop();
    // Set intro completed token di localStorage/sessionStorage
    this.setIntroToken();
    this.hasCompletedIntro = true;
  }

  // Fungsi untuk cek token intro
  checkIntroToken() {
    // Bisa pilih localStorage atau sessionStorage, di sini pakai localStorage
    return !!localStorage.getItem('aurea_intro_completed');
  }

  // Fungsi untuk set token intro selesai
  setIntroToken() {
    localStorage.setItem('aurea_intro_completed', '1');
  }


  // Fungsi untuk hapus token intro (untuk reset/testing)
  removeIntroToken() {
    localStorage.removeItem('aurea_intro_completed');
  }

  // Method untuk cek dan redirect ke dashboard jika sudah selesai intro
  _checkAndRedirectToDashboard() {
    if (this.checkIntroToken()) {
      window.location.pathname = '/dashboard';
      return true;
    }
    return false;
  }

  destroyCurrentPresenter() {
    if (this.currentPresenter) {
      this.currentPresenter.destroy();
      this.currentPresenter = null;
    }
  }

  // Method to navigate to a specific route
  navigateTo(route) {
    if (['/welcome', '/test', '/result', '/splash'].includes(route)) {
      // Use hash-based navigation for intro routes
      window.location.hash = route;
    } else {
      // Use main router for other routes
      window.location.pathname = route;
    }
  }

  // Method to force show splash (for testing)
  forceShowSplash() {
    this.destroyCurrentPresenter();
    window.location.hash = '/splash';
  }

  // Method to simulate intro flow (for testing)
  simulateIntroFlow() {
    this.removeIntroToken();
    window.location.hash = '/welcome';
  }
}

document.addEventListener('DOMContentLoaded', () => {

  // Seed DB jika perlu sebelum inisialisasi app
  seedIfNeeded().then(() => {
    const app = new App();

    // Make app available globally for testing/debugging
    window.aureaVoiceApp = app;

    // Make router globally accessible for DashboardView
    window.router = app.router;

    // Add global helpers for testing
    window.simulateIntroFlow = () => {
      app.simulateIntroFlow();
      console.log('🎬 Intro flow simulated - next dashboard navigation will show splash');
    };

    window.forceShowSplash = () => {
      app.forceShowSplash();
      console.log('🎬 Splash screen forced');
    };

    // Tambahkan global helper untuk reset intro agar user bisa mengulang intro flow
    window.resetIntro = () => {
      // Hapus token intro dari localStorage/sessionStorage
      app.removeIntroToken();
      app.hasCompletedIntro = false;
      // Navigasi ke root agar intro muncul lagi
      app.router.navigate('');
      console.log('🔄 Intro flow direset, reload halaman utama untuk melihat intro.');
    };
  });
});
