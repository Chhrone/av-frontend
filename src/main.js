import Router from './utils/router.js';
import WelcomePresenter from './presenters/WelcomePresenter.js';
import TestPresenter from './presenters/TestPresenter.js';
import ResultPresenter from './presenters/ResultPresenter.js';
import DashboardPresenter from './presenters/DashboardPresenter.js';
import IntroModel from './models/IntroModel.js';
import DashboardModel from './models/DashboardModel.js';
import RecordingManager from './utils/RecordingManager.js';
import FooterPresenter from './presenters/FooterPresenter.js';
import './utils/ViewTransitionHelper.js'; // Initialize View Transition API support

class App {
  constructor() {
    this.router = new Router();
    this.introModel = new IntroModel();
    this.dashboardModel = new DashboardModel();
    this.currentPresenter = null;
    this.footer = new FooterPresenter();

    this.setupRoutes();
    this.setupGlobalCleanup();
    this.initializeFooter();
  }

  setupRoutes() {
    this.router.addRoute('/', () => this.showWelcome());
    this.router.addRoute('/test', () => this.showTest());
    this.router.addRoute('/result', (resultData) => this.showResult(resultData));
    this.router.addRoute('/dashboard', () => this.showDashboard());
  }

  showWelcome() {
    this.destroyCurrentPresenter();
    this.currentPresenter = new WelcomePresenter(this.introModel);
    this.currentPresenter.init();
    this.introModel.setCurrentPage('welcome');
  }

  showTest() {
    this.destroyCurrentPresenter();
    this.currentPresenter = new TestPresenter(this.introModel);
    this.currentPresenter.init();
    this.introModel.setCurrentPage('test');
  }

  showResult(resultData = null) {
    this.destroyCurrentPresenter();
    this.currentPresenter = new ResultPresenter(resultData, this.introModel);
    this.currentPresenter.init();
    this.introModel.setCurrentPage('result');
  }

  showDashboard() {
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
}

document.addEventListener('DOMContentLoaded', () => {
  new App();
});
