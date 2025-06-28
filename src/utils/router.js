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

      const transitionType = TransitionController.getTransitionType(
        fromRoute,
        toRoute,
        this.isInitialLoad
      );

      TransitionController.navigate(toRoute, transitionType, () => {
        if (hash === '/result') {
          const storedResult = sessionStorage.getItem('accentResult');
          if (storedResult) {
            const resultData = JSON.parse(storedResult);
            sessionStorage.removeItem('accentResult');
            route(resultData);
          } else {
            route();
          }
        } else {
          route();
        }
      });

      this.isInitialLoad = false;
    } else {
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
