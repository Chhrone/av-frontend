import Router from './utils/router.js';
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
import RecordingManager from './utils/RecordingManager.js';
import { FooterPresenter } from './shared/index.js';
import './utils/ViewTransitionHelper.js'; // Initialize View Transition API support
import { categoryRouteMap, scrollToTop } from './utils/appHelpers.js';

class App {
  constructor() {
    this.router = new Router();
    this.introModel = new IntroModel();
    this.splashModel = new SplashModel();
    this.dashboardModel = new DashboardModel();
    this.currentPresenter = null;
    this.footer = new FooterPresenter();
    this.isFromIntroFlow = false; // Track if coming from intro flow
    this.hasCompletedIntro = this.checkIntroToken();
    this.setupRoutes();
    this.setupGlobalCleanup();
    this.initializeFooter();
  }

  setupRoutes() {
    this.router.addRoute('/', () => {
      // Cek token intro di localStorage/sessionStorage
      this.hasCompletedIntro = this.checkIntroToken();
      if (this.hasCompletedIntro) {
        this.showDashboardDirect();
      } else {
        this.showWelcome();
      }
    });
    this.router.addRoute('/test', () => this.showTest());
    this.router.addRoute('/result', (resultData) => this.showResult(resultData));
    this.router.addRoute('/dashboard', () => this.showDashboard());
    this.router.addRoute('/splash', () => this.showSplash());
    // Dynamic category route: /category/:name
    this.router.addRoute('/category/:name', (params) => this.showCategory(params));
  }

  // Parse route and show category page
  showCategory(params) {
    this.destroyCurrentPresenter();
    let routeName = params && params.name ? params.name : null;
    if (!routeName) return;
    const categoryId = categoryRouteMap[routeName] || 'pronunciation';
    import('./features/category/index.js').then(mod => {
      const CategoryModel = mod.CategoryModel;
      const CategoryPresenter = mod.CategoryPresenter;
      const model = new CategoryModel();
      this.currentPresenter = new CategoryPresenter(model);
      this.currentPresenter.init(categoryId);
      scrollToTop();
    });
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

  showResult(resultData = null) {
    this.destroyCurrentPresenter();
    this.currentPresenter = new ResultPresenter(resultData, this.introModel);
    this.currentPresenter.init();
    this.introModel.setCurrentPage('result');
    this.isFromIntroFlow = true; // Mark that we're in intro flow
  }

  showDashboard() {
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

  setupGlobalCleanup() {
    window.addEventListener('beforeunload', () => {
      RecordingManager.forceStop();
    });

    window.addEventListener('pagehide', () => {
      RecordingManager.forceStop();
    });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        RecordingManager.forceStop();
      }
    });
  }

  destroyCurrentPresenter() {
    if (this.currentPresenter) {
      this.currentPresenter.destroy();
      this.currentPresenter = null;
    }
  }

  initializeFooter() {
    // Mount footer to body, it will be persistent across all pages
    this.footer.mount(document.body);
  }

  // Method to force show splash (for testing)
  forceShowSplash() {
    this.showSplash();
  }

  // Method to simulate intro flow (for testing)
  simulateIntroFlow() {
    this.isFromIntroFlow = true;
  }
}

document.addEventListener('DOMContentLoaded', () => {
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
