class SplashModel {
  constructor() {
    this.brandName = 'AureaVoice';
    this.tagline = 'Master Your American Accent';
    this.description = 'Platform pembelajaran aksen Amerika berbasis AI untuk penutur bahasa Indonesia';
    this.minimumDisplayTime = 4000; // 4 seconds minimum display for jackpot effect
  }

  getBrandName() {
    return this.brandName;
  }

  getTagline() {
    return this.tagline;
  }

  getDescription() {
    return this.description;
  }



  getMinimumDisplayTime() {
    return this.minimumDisplayTime;
  }

  // Always show splash when coming from intro flow
  shouldShowSplash() {
    return true;
  }
}

export default SplashModel;
