/**
 * TransitionController - Manages different transition types based on navigation context
 * Prevents transition conflicts by controlling which transition is used for each navigation
 */
class TransitionController {
  constructor() {
    this.currentTransition = null;
    this.transitionTypes = {
      // Initial page load - no transition
      INITIAL_LOAD: 'initial-load',

      // Welcome to Test transitions
      WELCOME_TO_TEST: 'welcome-to-test',

      // Test to Welcome transitions
      TEST_TO_WELCOME: 'test-to-welcome',

      // Test to Result transitions (microphone disappears)
      TEST_TO_RESULT: 'test-to-result',

      // Result to Test transitions
      RESULT_TO_TEST: 'result-to-test',

      // Result to Welcome transitions
      RESULT_TO_WELCOME: 'result-to-welcome',

      // Direct navigation (fallback)
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
        microphoneTransition: false, // Microphone disappears
        cssClass: 'test-to-result-transition'
      },

      [this.transitionTypes.RESULT_TO_TEST]: {
        useViewTransition: true,
        duration: 600,
        microphoneTransition: false,
        cssClass: 'result-to-test-transition'
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

  /**
   * Navigate with a specific transition type
   * @param {string} targetRoute - The route to navigate to
   * @param {string} transitionType - Type of transition to use
   * @param {Function} navigationCallback - Function to execute the navigation
   */
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

  /**
   * Get the appropriate transition type based on current and target routes
   * @param {string} fromRoute - Current route
   * @param {string} toRoute - Target route
   * @param {boolean} isInitialLoad - Whether this is the initial page load
   */
  getTransitionType(fromRoute, toRoute, isInitialLoad = false) {
    if (isInitialLoad) {
      return this.transitionTypes.INITIAL_LOAD;
    }

    const transitionMap = {
      '/ -> /test': this.transitionTypes.WELCOME_TO_TEST,
      '/test -> /': this.transitionTypes.TEST_TO_WELCOME,
      '/test -> /result': this.transitionTypes.TEST_TO_RESULT,
      '/result -> /test': this.transitionTypes.RESULT_TO_TEST,
      '/result -> /': this.transitionTypes.RESULT_TO_WELCOME
    };

    const transitionKey = `${fromRoute} -> ${toRoute}`;
    return transitionMap[transitionKey] || this.transitionTypes.DIRECT;
  }

  /**
   * Navigate from welcome to test with microphone button transition
   */
  navigateWelcomeToTest(navigationCallback) {
    return this.navigate('/test', this.transitionTypes.WELCOME_TO_TEST, navigationCallback);
  }

  /**
   * Navigate from test to welcome with reverse microphone transition
   */
  navigateTestToWelcome(navigationCallback) {
    return this.navigate('/', this.transitionTypes.TEST_TO_WELCOME, navigationCallback);
  }

  /**
   * Get current transition type
   */
  getCurrentTransition() {
    return this.currentTransition;
  }

  /**
   * Check if a specific transition is currently active
   */
  isTransitionActive(transitionType) {
    return this.currentTransition === transitionType;
  }

  /**
   * Initialize microphone for test page
   */
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

  /**
   * Start recording on test page
   */
  async startRecording(testPresenter) {
    if (testPresenter && typeof testPresenter.initializeAndStartRecording === 'function') {
      try {
        await testPresenter.initializeAndStartRecording();
        console.log('🔴 Recording started via TransitionController');
        return true;
      } catch (error) {
        console.error('❌ Failed to start recording via TransitionController:', error);
        return false;
      }
    }
    return false;
  }
}

// Export singleton instance
export default new TransitionController();
