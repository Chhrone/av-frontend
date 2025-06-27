import TransitionController from './TransitionController.js';

class Router {
  constructor() {
    this.routes = {};
    this.currentRoute = null;
    this.previousRoute = null;
    this.isInitialLoad = true;

    // Listen for hash changes
    window.addEventListener('hashchange', () => this.handleRouteChange());
    window.addEventListener('load', () => this.handleRouteChange());
  }

  addRoute(path, handler) {
    this.routes[path] = handler;
  }

  handleRouteChange() {
    const hash = window.location.hash.slice(1) || '/';
    const route = this.routes[hash];

    if (route) {
      const fromRoute = this.currentRoute;
      const toRoute = hash;

      // Update route tracking
      this.previousRoute = this.currentRoute;
      this.currentRoute = hash;

      // Determine transition type based on navigation context
      const transitionType = TransitionController.getTransitionType(
        fromRoute,
        toRoute,
        this.isInitialLoad
      );

      // Execute navigation with appropriate transition
      TransitionController.navigate(toRoute, transitionType, () => {
        // Check if this is the result route and we have stored data
        if (hash === '/result') {
          const storedResult = sessionStorage.getItem('accentResult');
          if (storedResult) {
            const resultData = JSON.parse(storedResult);
            sessionStorage.removeItem('accentResult'); // Clean up
            route(resultData);
          } else {
            route();
          }
        } else {
          route();
        }
      });

      // Mark that initial load is complete
      this.isInitialLoad = false;
    } else {
      // Default to home route
      window.location.hash = '#/';
    }
  }

  navigate(path) {
    window.location.hash = `#${path}`;
  }

  getCurrentRoute() {
    return this.currentRoute;
  }

  getPreviousRoute() {
    return this.previousRoute;
  }
}

export default Router;
