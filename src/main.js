import Router from './utils/router.js';
import WelcomePresenter from './presenters/WelcomePresenter.js';
import TestPresenter from './presenters/TestPresenter.js';
import ResultPresenter from './presenters/ResultPresenter.js';
import AppModel from './models/AppModel.js';
import RecordingManager from './utils/RecordingManager.js';

class App {
  constructor() {
    this.router = new Router();
    this.model = new AppModel();
    this.currentPresenter = null;

    this.setupRoutes();
    this.setupGlobalCleanup();
  }

  setupRoutes() {
    this.router.addRoute('/', () => this.showWelcome());
    this.router.addRoute('/test', () => this.showTest());
    this.router.addRoute('/result', (resultData) => this.showResult(resultData));
  }

  showWelcome() {
    this.destroyCurrentPresenter();
    this.currentPresenter = new WelcomePresenter();
    this.currentPresenter.init();
    this.model.setCurrentPage('welcome');
  }

  showTest() {
    this.destroyCurrentPresenter();
    this.currentPresenter = new TestPresenter();
    this.currentPresenter.init();
    this.model.setCurrentPage('test');
  }

  showResult(resultData = null) {
    this.destroyCurrentPresenter();
    this.currentPresenter = new ResultPresenter(resultData);
    this.currentPresenter.init();
    this.model.setCurrentPage('result');
  }



  /**
   * Setup global cleanup listeners
   */
  setupGlobalCleanup() {
    // Global cleanup on page unload/reload
    window.addEventListener('beforeunload', () => {
      console.log('🎤 App unloading, forcing cleanup...');
      RecordingManager.forceStop();
    });

    // Global cleanup on page hide (mobile/tab switch)
    window.addEventListener('pagehide', () => {
      console.log('🎤 Page hidden, forcing cleanup...');
      RecordingManager.forceStop();
    });

    // Global cleanup on visibility change
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        console.log('🎤 Document hidden, forcing cleanup...');
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
}

document.addEventListener('DOMContentLoaded', () => {
  new App();
});
