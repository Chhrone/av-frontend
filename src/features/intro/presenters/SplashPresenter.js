import SplashView from '../views/SplashView.js';

class SplashPresenter {
  constructor(model, onComplete) {
    this.model = model;
    this.view = null;
    this.onComplete = onComplete;
    this.startTime = null;
    this.progressInterval = null;
  }

  init() {
    // Remove dashboard mode class temporarily
    this.originalBodyClasses = document.body.className;
    document.body.classList.remove('dashboard-mode');

    // Hide footer during splash
    this.hideFooter();

    const splashData = this.getSplashData();
    this.view = new SplashView();
    this.render(splashData);
    this.startLoadingSequence();
  }

  getSplashData() {
    return {
      brandName: this.model.getBrandName(),
      tagline: this.model.getTagline(),
      description: this.model.getDescription()
    };
  }

  render(data) {
    const appElement = document.getElementById('app');
    appElement.innerHTML = '';

    const viewElement = this.view.render(data);
    this.view.mount(appElement);
  }

  startLoadingSequence() {
    this.startTime = Date.now();
    this.view.startLoadingAnimation();

    // Start jackpot effect after 1.5 seconds, only if view & element exist
    setTimeout(() => {
      if (this.view && this.view.voiceElement) {
        this.view.startJackpotEffect();
      }
    }, 1500);

    // Complete loading after minimum time
    setTimeout(() => {
      this.completeLoading();
    }, this.model.getMinimumDisplayTime());
  }



  completeLoading() {
    const elapsedTime = Date.now() - this.startTime;
    const minimumTime = this.model.getMinimumDisplayTime();
    const remainingTime = Math.max(0, minimumTime - elapsedTime);

    // Ensure minimum display time
    setTimeout(() => {
      this.finishSplash();
    }, remainingTime);
  }

  async finishSplash() {
    // Fade out animation
    if (this.view && typeof this.view.fadeOut === 'function') {
      await this.view.fadeOut();
    }

    // Restore original body classes
    if (this.originalBodyClasses) {
      document.body.className = this.originalBodyClasses;
    }

    // Show footer again
    this.showFooter();

    // Call completion callback
    if (this.onComplete) {
      this.onComplete();
    }
  }

  hideFooter() {
    const footer = document.getElementById('footer');
    if (footer) {
      footer.style.display = 'none';
    }
  }

  showFooter() {
    const footer = document.getElementById('footer');
    if (footer) {
      footer.style.display = 'flex';
    }
  }

  destroy() {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }

    // Restore original body classes
    if (this.originalBodyClasses) {
      document.body.className = this.originalBodyClasses;
    }

    // Ensure footer is shown when splash is destroyed
    this.showFooter();

    if (this.view) {
      this.view.destroy();
      this.view = null;
    }
  }
}

export default SplashPresenter;
