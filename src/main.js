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

class App {
  constructor() {
    this.router = new Router();
    this.introModel = new IntroModel();
    this.splashModel = new SplashModel();
    this.dashboardModel = new DashboardModel();
    this.currentPresenter = null;
    this.footer = new FooterPresenter();
    this.isFromIntroFlow = false; // Track if coming from intro flow

    this.setupRoutes();
    this.setupGlobalCleanup();
    this.initializeFooter();
  }

  setupRoutes() {
    this.router.addRoute('/', () => this.showWelcome());
    this.router.addRoute('/test', () => this.showTest());
    this.router.addRoute('/result', (resultData) => this.showResult(resultData));
    this.router.addRoute('/dashboard', () => this.showDashboard());
    this.router.addRoute('/splash', () => this.showSplash());
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

  // Add global helpers for testing
  window.simulateIntroFlow = () => {
    app.simulateIntroFlow();
    console.log('🎬 Intro flow simulated - next dashboard navigation will show splash');
  };

  window.forceShowSplash = () => {
    app.forceShowSplash();
    console.log('🎬 Splash screen forced');
  };
});
