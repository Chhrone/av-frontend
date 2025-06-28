/**
 * ViewTransitionHelper - Utility for managing View Transition API
 * Provides fallbacks for browsers that don't support the API
 */
class ViewTransitionHelper {
  constructor() {
    this.isSupported = this.checkSupport();
    this.init();
  }

  /**
   * Check if View Transition API is supported
   */
  checkSupport() {
    const hasStartViewTransition = 'startViewTransition' in document;
    const hasCSSSupport = CSS.supports('view-transition-name', 'none');
    const hasViewTransitionRule = CSS.supports('@view-transition', 'navigation: auto');

    console.log('🔍 View Transition API Support Check:');
    console.log('  - startViewTransition in document:', hasStartViewTransition);
    console.log('  - CSS view-transition-name support:', hasCSSSupport);
    console.log('  - CSS @view-transition support:', hasViewTransitionRule);

    return hasStartViewTransition || hasCSSSupport || hasViewTransitionRule;
  }

  /**
   * Initialize View Transition support
   */
  init() {
    if (this.isSupported) {
      console.log('✅ View Transition API is supported');
      this.setupViewTransitions();
    } else {
      console.log('⚠️ View Transition API not supported, using fallbacks');
      this.setupFallbacks();
    }
  }



  /**
   * Setup View Transition API for supported browsers
   */
  setupViewTransitions() {
    // Setup transition triggers
    this.setupTransitionTriggers();

    // Add event listeners for view transition events
    this.setupViewTransitionEvents();
  }

  /**
   * Setup event listeners for view transition debugging
   */
  setupViewTransitionEvents() {
    // Listen for view transition start (if available)
    if ('startViewTransition' in document) {
      console.log('📱 Document startViewTransition is available');
    }

    // Monitor for view transition pseudo-elements
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          const viewTransitionElements = document.querySelectorAll('::view-transition');
          if (viewTransitionElements.length > 0) {
            console.log('🎬 View transition elements detected!');
          }
        }
      });
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true
    });
  }

  /**
   * Setup fallback animations for unsupported browsers
   */
  setupFallbacks() {
    // Add fallback class to body for CSS targeting
    document.body.classList.add('no-view-transitions');
    
    // Setup manual transition effects
    this.setupManualTransitions();
  }

  /**
   * Setup transition triggers for specific elements
   */
  setupTransitionTriggers() {
    document.addEventListener('click', (event) => {
      const trigger = event.target.closest('[data-transition-trigger="true"]');
      if (trigger) {
        this.handleTransitionTrigger(trigger, event);
      }
    });

    // For SPA with hash routing, we need to handle transitions manually
    if (this.isSupported && 'startViewTransition' in document) {
      this.setupSPATransitions();
    }
  }

  /**
   * Setup SPA transitions for hash routing
   */
  setupSPATransitions() {
    // Override hash navigation to use View Transitions
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    // Listen for hash changes
    window.addEventListener('hashchange', (event) => {
      console.log('🔄 Hash changed, triggering view transition');
      this.handleSPANavigation(event);
    });
  }

  /**
   * Handle SPA navigation with View Transitions
   */
  handleSPANavigation(event) {
    if (!this.isSupported || !('startViewTransition' in document)) {
      return;
    }

    console.log('🎬 Starting view transition for SPA navigation');

    // The DOM change will happen automatically via the router
    // We just need to ensure the transition is captured
  }

  /**
   * Handle transition trigger clicks
   */
  handleTransitionTrigger(trigger, event) {
    console.log('🎬 Transition triggered on:', trigger.className);

    if (this.isSupported) {
      // Let the browser handle the view transition
      trigger.classList.add('transitioning');
      console.log('✨ Using View Transition API');

      // Remove transitioning class after animation
      setTimeout(() => {
        trigger.classList.remove('transitioning');
        console.log('🎬 Transition completed');
      }, 600);
    } else {
      // Handle manual transition for unsupported browsers
      console.log('🔄 Using fallback transition');
      this.performManualTransition(trigger);
    }
  }

  /**
   * Setup manual transitions for unsupported browsers
   */
  setupManualTransitions() {
    // Minimal fallback - let CSS handle the rest
    console.log('🔄 Setting up fallback transitions');
  }

  /**
   * Perform manual transition for unsupported browsers
   */
  performManualTransition(trigger) {
    // Minimal visual feedback without conflicting transforms
    trigger.style.opacity = '0.8';
    trigger.style.transition = 'opacity 0.1s ease-out';

    setTimeout(() => {
      trigger.style.opacity = '';
      trigger.style.transition = '';
    }, 100);
  }

  /**
   * Create a view transition (for programmatic use)
   */
  createTransition(callback) {
    if (this.isSupported && document.startViewTransition) {
      return document.startViewTransition(callback);
    } else {
      // Fallback: just execute the callback
      return Promise.resolve(callback());
    }
  }

  /**
   * Add view transition name to element
   */
  setTransitionName(element, name) {
    if (this.isSupported) {
      element.style.viewTransitionName = name;
    }
  }

  /**
   * Remove view transition name from element
   */
  removeTransitionName(element) {
    if (this.isSupported) {
      element.style.viewTransitionName = 'none';
    }
  }

  /**
   * Check if element is currently in a view transition
   */
  isInTransition(element) {
    if (!this.isSupported) return false;
    
    const computedStyle = getComputedStyle(element);
    return computedStyle.viewTransitionName !== 'none';
  }
}

// Create singleton instance
const viewTransitionHelper = new ViewTransitionHelper();

export default viewTransitionHelper;
