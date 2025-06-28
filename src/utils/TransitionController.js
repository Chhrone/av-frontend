class TransitionController {
  constructor() {
    this.currentTransition = null;
    this.transitionTypes = {
      INITIAL_LOAD: 'initial-load',
      WELCOME_TO_TEST: 'welcome-to-test',
      TEST_TO_WELCOME: 'test-to-welcome',
      TEST_TO_RESULT: 'test-to-result',
      RESULT_TO_WELCOME: 'result-to-welcome',
      DIRECT: 'direct'
    };
    
    this.transitionConfigs = {
      [this.transitionTypes.INITIAL_LOAD]: {
        useViewTransition: false,
        duration: 0,
        microphoneTransition: false
      },
      
      [this.transitionTypes.WELCOME_TO_TEST]: {
        useViewTransition: true,
        duration: 600,
        microphoneTransition: true,
        cssClass: 'welcome-to-test-transition'
      },
      
      [this.transitionTypes.TEST_TO_WELCOME]: {
        useViewTransition: true,
        duration: 600,
        microphoneTransition: true,
        cssClass: 'test-to-welcome-transition'
      },

      [this.transitionTypes.TEST_TO_RESULT]: {
        useViewTransition: true,
        duration: 600,
        microphoneTransition: false,
        cssClass: 'test-to-result-transition'
      },

      [this.transitionTypes.RESULT_TO_WELCOME]: {
        useViewTransition: true,
        duration: 600,
        microphoneTransition: false,
        cssClass: 'result-to-welcome-transition'
      },

      [this.transitionTypes.DIRECT]: {
        useViewTransition: false,
        duration: 0,
        microphoneTransition: false
      }
    };
  }

  async navigate(targetRoute, transitionType, navigationCallback) {
    const config = this.transitionConfigs[transitionType];

    if (!config) {
      console.warn(`Unknown transition type: ${transitionType}. Using direct navigation.`);
      return navigationCallback();
    }

    // Debug logging
    console.log(`🎬 Transition: ${transitionType} → ${targetRoute}`, config);

    // Set current transition for CSS targeting
    this.currentTransition = transitionType;
    
    // Add transition class to body for CSS targeting
    if (config.cssClass) {
      document.body.classList.add(config.cssClass);
    }

    try {
      if (config.useViewTransition && document.startViewTransition) {
        // Use View Transition API
        await document.startViewTransition(() => {
          navigationCallback();
        }).finished;
      } else {
        // Direct navigation without transition
        navigationCallback();
      }
    } catch (error) {
      console.error('Transition failed:', error);
      // Fallback to direct navigation
      navigationCallback();
    } finally {
      // Clean up transition class
      if (config.cssClass) {
        setTimeout(() => {
          document.body.classList.remove(config.cssClass);
        }, config.duration);
      }
      
      this.currentTransition = null;
    }
  }

  getTransitionType(fromRoute, toRoute, isInitialLoad = false) {
    if (isInitialLoad) {
      return this.transitionTypes.INITIAL_LOAD;
    }

    const transitionMap = {
      '/ -> /test': this.transitionTypes.WELCOME_TO_TEST,
      '/test -> /': this.transitionTypes.TEST_TO_WELCOME,
      '/test -> /result': this.transitionTypes.TEST_TO_RESULT,
      '/result -> /': this.transitionTypes.RESULT_TO_WELCOME
    };

    const transitionKey = `${fromRoute} -> ${toRoute}`;
    return transitionMap[transitionKey] || this.transitionTypes.DIRECT;
  }

  navigateWelcomeToTest(navigationCallback) {
    return this.navigate('/test', this.transitionTypes.WELCOME_TO_TEST, navigationCallback);
  }

  navigateTestToWelcome(navigationCallback) {
    return this.navigate('/', this.transitionTypes.TEST_TO_WELCOME, navigationCallback);
  }

  getCurrentTransition() {
    return this.currentTransition;
  }

  isTransitionActive(transitionType) {
    return this.currentTransition === transitionType;
  }

  async initializeMicrophone(testPresenter) {
    if (testPresenter && typeof testPresenter.initializeAudio === 'function') {
      try {
        await testPresenter.initializeAudio();
        console.log('🎤 Microphone initialized via TransitionController');
        return true;
      } catch (error) {
        console.error('❌ Failed to initialize microphone via TransitionController:', error);
        return false;
      }
    }
    return false;
  }

  async startRecording(testPresenter) {
    if (testPresenter && typeof testPresenter.initializeAndStartRecording === 'function') {
      try {
        await testPresenter.initializeAndStartRecording();
        return true;
      } catch (error) {
        console.error('❌ Failed to start recording via TransitionController:', error);
        return false;
      }
    }
    return false;
  }
}

export default new TransitionController();
