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
    // Support dynamic route: /category/:name
    if (path.includes(':')) {
      this.routes[path] = handler;
    } else {
      this.routes[path] = handler;
    }
  }

  handleRouteChange() {
    const hash = window.location.hash.slice(1) || '/';
    let route = this.routes[hash];
    let params = {};

    // Dynamic route matching for /category/:name
    if (!route) {
      for (const routePath in this.routes) {
        if (routePath.includes(':')) {
          // Only support /category/:name for now
          const match = hash.match(/^\/category\/([^/]+)$/);
          if (routePath === '/category/:name' && match) {
            route = this.routes[routePath];
            params = { name: match[1] };
            break;
          }
        }
      }
    }

    if (route) {
      this.previousRoute = this.currentRoute;
      this.currentRoute = hash;
      const supportsViewTransitions = 'startViewTransition' in document;
      if (supportsViewTransitions) {
        console.log('🎬 Using View Transition API for route change');
        document.startViewTransition(() => {
          this.executeRoute(hash, route, params);
        });
      } else {
        console.log('🔄 Using fallback for route change');
        this.executeRoute(hash, route, params);
      }
    } else {
      window.location.hash = '#/';
    }
  }

  executeRoute(hash, route, params) {
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
    } else if (typeof route === 'function') {
      // Pass params for dynamic routes
      route(params);
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
