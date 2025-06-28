class Router {
  constructor() {
    this.routes = {};
    this.currentRoute = null;
    this.previousRoute = null;

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
      // Update route tracking
      this.previousRoute = this.currentRoute;
      this.currentRoute = hash;

      // Check if View Transition API is supported
      const supportsViewTransitions = 'startViewTransition' in document;

      if (supportsViewTransitions) {
        console.log('🎬 Using View Transition API for route change');
        document.startViewTransition(() => {
          this.executeRoute(hash, route);
        });
      } else {
        console.log('🔄 Using fallback for route change');
        this.executeRoute(hash, route);
      }
    } else {
      window.location.hash = '#/';
    }
  }

  executeRoute(hash, route) {
    // Execute route handler
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
