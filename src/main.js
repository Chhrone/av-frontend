import { appRouter } from './utils/appRouter.js';
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
  PracticeTestPresenter,
  PracticeResultPresenter,
  PracticeTestModel,
  PracticeResultModel
} from './features/practice/index.js';
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
    appRouter.setErrorHandler(this.showError.bind(this));

    // Initialize models and presenters
    this.introModel = new IntroModel();
    this.splashModel = new SplashModel();
    this.dashboardModel = new DashboardModel();
    this.practiceTestModel = new PracticeTestModel();
    this.practiceResultModel = new PracticeResultModel();
    this.currentPresenter = null;
    this.footer = new FooterPresenter();
    this.isFromIntroFlow = false;
    
    // Check intro completion status
    this.hasCompletedIntro = this.checkIntroToken();
    
    // Initialize intro router only if needed
    this.introRouter = this.hasCompletedIntro ? null : new IntroRouter();
    
    // Set up application routes
    this.setupMainRoutes();
    if (!this.hasCompletedIntro) {
      this.setupIntroRoutes();
    }
    
    // Start the router if available
    if (typeof this.mainRouter.start === 'function') {
      this.mainRouter.start();
    }
    
    // Initialize application components
    this.setupGlobalCleanup();
    this.initializeFooter();
  }

  setupMainRoutes() {
    // Main app routes (non-intro pages)
    this.mainRouter.addRoute('/dashboard', () => this.showDashboard());
    this.mainRouter.addRoute('/practice', () => this.showPractice());
    
    // Profile route
    appRouter.addRoute('/profile', () => this.showProfile());
    
    // Category routes with parameters
    appRouter.addRoute('/categories/:categoryId', (params) => {
      this.showCategory(params);
    });

    appRouter.addRoute('/practice/:categoryId/:practiceId', (params) => this.showPractice(params));
    
    // Root path - redirect based on intro completion
    appRouter.addRoute('/', () => {
      if (this.checkIntroToken()) {
        // If intro is completed, go to dashboard
        this.showDashboardDirect();
      } else if (this.introRouter) {
        // If intro not completed and intro router exists, let it handle the welcome page
        window.location.hash = '/welcome';
      }
    });
    
    // Fallback route - must be last
    appRouter.addRoute('*', () => {
      console.warn('AppRouter: No route matched for:', window.location.pathname);
      this.showError('Halaman tidak ditemukan');
    });
  }
  
  /**
   * Check if user should be redirected to dashboard
   * @private
   * @returns {boolean} True if redirect occurred
   */
  _checkAndRedirectToDashboard() {
    if (this.checkIntroToken() && window.location.pathname !== '/dashboard') {
      window.location.href = '/dashboard';
      return true;
    }
    return false;
  }

  /**
   * Handle root path routing
   * @private
   */
  _handleRootPath() {
    this.hasCompletedIntro = this.checkIntroToken();
    if (this.hasCompletedIntro) {
      window.location.href = '/';
    } else if (window.location.hash !== '#/welcome') {
      window.location.hash = '/welcome';
    }
  }

  setupIntroRoutes() {
    // Home route
    this.introRouter.addRoute('/', () => this._handleRootPath());

    // Intro routes with common redirect logic
    const introRoutes = [
      { path: '/welcome', handler: () => this.showWelcome() },
      { path: '/test', handler: () => this.showTest() },
      { path: '/result', handler: () => this.showResult() },
      { path: '/splash', handler: () => this.showSplash() }
    ];

    // Register intro routes with common redirect logic
    introRoutes.forEach(route => {
      this.introRouter.addRoute(route.path, () => {
        if (!this._checkAndRedirectToDashboard()) {
          route.handler();
        }
      });
    });
    
    // Dashboard route in intro router (for redirection after intro flow)
    this.introRouter.addRoute('/dashboard', () => {
      this.setIntroToken();
      this.showDashboardDirect();
    });
    
    // Fallback route for intro router - redirect to welcome
    this.introRouter.addRoute('*', () => {
      if (!this._checkAndRedirectToDashboard() && window.location.hash !== '#/welcome') {
        window.location.hash = '/welcome';
      }
    });
  }
  
  showProfile() {
    // Implement profile view logic here
    console.log('Showing profile page');
    // You'll need to create and show the profile view
  }

  // Show category page
  /**
   * Show error message to user
   * @param {string|Error} message - Error message or Error object
   * @param {string} [title='Terjadi Kesalahan'] - Optional error title
   */
  showError(message, title = 'Terjadi Kesalahan') {
    const errorMessage = message instanceof Error ? message.message : String(message);
    const appContainer = document.getElementById('app');
    
    if (!appContainer) {
      console.error('App container not found');
      return;
    }

    try {
      appContainer.innerHTML = `
        <div class="error-container" style="text-align: center; padding: 2rem;">
          <h2>${title}</h2>
          <p>${errorMessage}</p>
          <button 
            onclick="window.history.back()" 
            class="error-button"
            style="padding: 0.5rem 1rem; margin-top: 1rem; cursor: pointer;"
          >
            Kembali
          </button>
        </div>
      `;
    } catch (error) {
      console.error('Failed to render error:', error);
    }
    
    console.error('Application Error:', errorMessage);
  }

  showCategory(params) {
    console.log('Navigating to category with params:', params);
    this.destroyCurrentPresenter();
    
    try {
      // Get categoryId from params (either from route or direct call)
      const categoryId = params.categoryId || (params.name ? params.name : null);
      
      if (!categoryId) {
        const errorMsg = 'ID kategori tidak ditemukan';
        console.error(errorMsg, params);
        this.showError(errorMsg);
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
            this.showError('Gagal memuat konten kategori');
          }
        })
        .catch(error => {
          console.error('Error loading category module:', error);
          this.showError('Gagal memuat modul kategori');
        });
    } catch (error) {
      console.error('Unexpected error in showCategory:', error);
      this.showError('Terjadi kesalahan tak terduga');
    }
  }

  async showPractice(params) {
    try {
      const { categoryId, practiceId } = params;
      console.log('showPractice params:', { categoryId, practiceId });
      if (!categoryId || !practiceId) {
        throw new Error('Category ID atau Practice ID tidak ditemukan');
      }
      const normalizedCategoryId = categoryId === 'konsonan' ? 'konsonan-inventory' : categoryId;
      // Show test view first, then you can show result view after recording is done
      const testPresenter = new PracticeTestPresenter(this.practiceTestModel, normalizedCategoryId, practiceId);
      await testPresenter.init();
      this.currentPresenter = testPresenter;
      // Example: to show result after test, you can call PracticeResultPresenter
      // const resultPresenter = new PracticeResultPresenter(this.practiceResultModel);
      // resultPresenter.showResult(resultData);
    } catch (error) {
      console.error('Error showing practice page:', error);
      this.showError('Gagal memuat halaman latihan. ' + (error.message || ''));
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
    // Only mount footer if not on welcome page
    const isWelcome = window.location.hash === '#/welcome' || window.location.hash === '';
    if (!isWelcome) {
      this.footer.mount(document.body);
    } else {
      // Remove if exists
      if (document.getElementById('footer')) {
        document.getElementById('footer').remove();
      }
    }
    // Listen to hashchange to update footer visibility
    window.addEventListener('hashchange', () => {
      const isWelcomeNow = window.location.hash === '#/welcome' || window.location.hash === '';
      if (isWelcomeNow) {
        if (document.getElementById('footer')) {
          document.getElementById('footer').remove();
        }
      } else {
        if (!document.getElementById('footer')) {
          this.footer.mount(document.body);
        }
      }
    });
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
