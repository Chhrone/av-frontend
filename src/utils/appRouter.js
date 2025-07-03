class AppRouter {
  constructor() {
    this.routes = {};
    this.currentRoute = null;
    this.previousRoute = null;
    this.onRouteChange = null;
    this.middlewares = [];
    this.errorHandler = null;

    // Bind methods
    this.navigate = this.navigate.bind(this);
    this.handleRouteChange = this.handleRouteChange.bind(this);

    // Initialize router
    this.initializeEventListeners();
  }

  /**
   * Add a new route
   * @param {string} path - The route path
   * @param {Function} handler - The handler function for the route
   * @param {Array} middlewares - Array of middleware functions
   */
  addRoute(path, handler, middlewares = []) {
    this.routes[path] = {
      handler,
      middlewares
    };
  }

  /**
   * Add global middleware
   * @param {Function} middleware - Middleware function
   */
  /**
   * Set a handler for routing errors
   * @param {Function} handler - The function to call on error
   */
  setErrorHandler(handler) {
    this.errorHandler = handler;
  }

  use(middleware) {
    if (typeof middleware === 'function') {
      this.middlewares.push(middleware);
    }
  }

  /**
   * Initialize event listeners for routing
   */
  initializeEventListeners() {
    window.addEventListener('popstate', this.handleRouteChange);
    window.addEventListener('load', () => {
      // Trigger initial route
      this.handleRouteChange();
    });
  }

  /**
   * Handle route changes
   */
  async handleRouteChange() {
    try {
      const path = window.location.pathname;
      const hash = window.location.hash;
      
      // Skip if this is a hash-based route (handled by introRouter)
      if (hash && hash !== '#/') {
        console.log('AppRouter: Ignoring hash-based route:', hash);
        return;
      }
      
      console.log('AppRouter: Handling route:', path);
      
      const { route, params } = this.findMatchingRoute(path);
      
      if (!route) {
        // Don't warn for root path as it's handled by introRouter
        if (path !== '/') {
          console.warn('AppRouter: No matching route found for:', path);
        }
        return;
      }

      // Store previous route
      this.previousRoute = this.currentRoute;
      this.currentRoute = path;

      const routeContext = { 
        from: this.previousRoute, 
        to: path,
        params
      };

      try {
        // Execute global middlewares
        for (const middleware of this.middlewares) {
          await middleware(routeContext);
        }

        // Execute route-specific middlewares
        for (const middleware of route.middlewares) {
          await middleware(routeContext);
        }

        // Execute route handler with params
        await route.handler.call(this, params || {});

        // Notify route change subscribers
        if (this.onRouteChange) {
          this.onRouteChange({
            from: this.previousRoute,
            to: path,
            route: this.currentRoute
          });
        }
      } catch (error) {
        console.error('Error during route execution:', error);
        // Tetap di halaman saat ini, tampilkan error
        if (this.errorHandler) {
          this.errorHandler('An error occurred while loading the page');
        }
      }
    } catch (error) {
      console.error('Error during route change:', error);
      // Tetap di halaman saat ini, tampilkan error
      if (this.errorHandler) {
        this.errorHandler('An unexpected error occurred');
      }
    }
  }

  /**
   * Find matching route for the given path
   * @param {string} path - The path to match
   * @returns {Object|null} - The matched route or null
   */
  findMatchingRoute(path) {
    // Exact match
    if (this.routes[path]) {
      return { route: this.routes[path], params: {} };
    }

    // Dynamic route matching (e.g., /category/:id)
    for (const routePath in this.routes) {
      const paramNames = [];
      const pathRegex = new RegExp(
        '^' + routePath.replace(/:([^\/]+)/g, (_, paramName) => {
          paramNames.push(paramName);
          return '([^\/]+)';
        }) + '$'
      );
      
      const match = path.match(pathRegex);
      if (match) {
        const params = {};
        paramNames.forEach((paramName, index) => {
          params[paramName] = match[index + 1];
        });
        return { route: this.routes[routePath], params };
      }
    }

    return { route: null, params: {} };
  }

  /**
   * Navigate to a new route
   * @param {string} path - The path to navigate to
   * @param {Object} state - Optional state object
   */
  navigate(path, state = {}) {
    if (path === window.location.pathname) return;

    window.history.pushState(state, '', path);
    this.handleRouteChange();
  }

  /**
   * Go back to the previous route
   */
  goBack() {
    window.history.back();
  }

  /**
   * Start the router
   */
  start() {
    this.handleRouteChange();
  }
}

// Create and export a singleton instance
export const appRouter = new AppRouter();

// Make it available globally for debugging
window.appRouter = appRouter;

export default AppRouter;
