import AppRouter from './utils/appRouter.js';
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
import RecordingManager from './utils/RecordingManager.js';
import { FooterPresenter } from './shared/index.js';
import './utils/ViewTransitionHelper.js'; // Initialize View Transition API support
import { categoryRouteMap, scrollToTop } from './utils/appHelpers.js';

class App {
  constructor() {
    // Create and expose the routers globally for navigation helpers
    this.mainRouter = new AppRouter();
    this.hasCompletedIntro = this.checkIntroToken();
    
    // Only initialize intro router if intro is not completed
    if (!this.hasCompletedIntro) {
      this.introRouter = new IntroRouter();
    } else {
      this.introRouter = null;
    }
    
    // For backward compatibility, expose the main router as window.router
    window.router = this.mainRouter;
    
    // Set the default router to main router
    this.router = this.mainRouter;
    
    this.introModel = new IntroModel();
    this.splashModel = new SplashModel();
    this.dashboardModel = new DashboardModel();
    this.currentPresenter = null;
    this.footer = new FooterPresenter();
    this.isFromIntroFlow = false; // Track if coming from intro flow
    
    // Set up routes
    this.setupMainRoutes();
    
    // Only setup intro routes if intro is not completed
    if (!this.hasCompletedIntro) {
      this.setupIntroRoutes();
    }
    
    // Only start the main router if it has a start method
    if (typeof this.mainRouter.start === 'function') {
      this.mainRouter.start();
    }
    
    this.setupGlobalCleanup();
    this.initializeFooter();
  }

  setupMainRoutes() {
    // Main app routes (non-intro pages)
    this.mainRouter.addRoute('/dashboard', () => this.showDashboardDirect());
    
    // Profile route
    this.mainRouter.addRoute('/profile', () => this.showProfile());
    
    // Category routes with parameters
    this.mainRouter.addRoute('/categories/:categoryId', (params) => {
      this.showCategory(params);
    });
    
    // Root path - redirect based on intro completion
    this.mainRouter.addRoute('/', () => {
      if (this.checkIntroToken()) {
        // If intro is completed, go to dashboard
        this.showDashboardDirect();
      } else if (this.introRouter) {
        // If intro not completed and intro router exists, let it handle the welcome page
        window.location.hash = '/welcome';
      }
    });
    
    // Fallback route - must be last
    this.mainRouter.addRoute('*', () => {
      console.warn('AppRouter: No route matched for:', window.location.pathname);
      this.showError('Halaman tidak ditemukan');
    });
  }
  
  setupIntroRoutes() {
    // Home route - let the main router handle the root path
    this.introRouter.addRoute('/', () => {
      this.hasCompletedIntro = this.checkIntroToken();
      if (this.hasCompletedIntro) {
        // If intro is completed, let the main router handle the root path
        window.location.href = '/';
        return;
      }
      // Only change hash if not already on welcome
      if (window.location.hash !== '#/welcome') {
        window.location.hash = '/welcome';
      }
    });

    // Intro routes
    this.introRouter.addRoute('/welcome', () => {
      if (this.checkIntroToken()) {
        if (window.location.pathname !== '/dashboard') {
          window.location.href = '/dashboard';
        }
        return;
      }
      this.showWelcome();
    });

    this.introRouter.addRoute('/test', () => {
      if (this.checkIntroToken()) {
        if (window.location.pathname !== '/dashboard') {
          window.location.href = '/dashboard';
        }
        return;
      }
      this.showTest();
    });

    this.introRouter.addRoute('/result', () => {
      if (this.checkIntroToken()) {
        if (window.location.pathname !== '/dashboard') {
          window.location.href = '/dashboard';
        }
        return;
      }
      this.showResult();
    });

    this.introRouter.addRoute('/splash', () => {
      if (this.checkIntroToken()) {
        if (window.location.pathname !== '/dashboard') {
          window.location.href = '/dashboard';
        }
        return;
      }
      this.showSplash();
    });
    
    // Dashboard route in intro router (for redirection after intro flow)
    this.introRouter.addRoute('/dashboard', () => {
      this.setIntroToken();
      this.showDashboardDirect();
    });
    
    // Fallback route for intro router - redirect to welcome
    this.introRouter.addRoute('*', () => {
      if (this.checkIntroToken()) {
        if (window.location.pathname !== '/dashboard') {
          window.location.href = '/dashboard';
        }
        return;
      }
      if (window.location.hash !== '#/welcome') {
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
  // Show error message to user
  showError(message) {
    const appContainer = document.getElementById('app');
    if (appContainer) {
      appContainer.innerHTML = `
        <div style="text-align: center; padding: 2rem;">
          <h2>Terjadi Kesalahan</h2>
          <p>${message}</p>
          <button onclick="window.history.back()" style="padding: 0.5rem 1rem; margin-top: 1rem; cursor: pointer;">
            Kembali
          </button>
        </div>
      `;
    }
    console.error('Error:', message);
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
    // Mount footer to body, it will be persistent across all pages
    this.footer.mount(document.body);
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
