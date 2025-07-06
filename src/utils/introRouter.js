class IntroRouter {
  constructor() {
    this.routes = {};
    this.currentRoute = null;
    this.previousRoute = null;
    this.onRouteChange = null;

    // Bind methods
    this.navigate = this.navigate.bind(this);
    this.handleRouteChange = this.handleRouteChange.bind(this);

    // Initialize event listeners
    this.initializeEventListeners();
  }

  initializeEventListeners() {
    // Listen for hash changes
    window.addEventListener('hashchange', this.handleRouteChange);
    
    // Initial route handling
    window.addEventListener('load', () => {
      // Small delay to ensure all other load handlers have run
      setTimeout(() => this.handleRouteChange(), 0);
    });
  }

  addRoute(path, handler) {
    // Store the route handler
    this.routes[path] = handler;
    return this; // Allow chaining
  }

  // Check if a route is an intro route
  isIntroRoute(path) {
    return ['/', '/welcome', '/test', '/result', '/splash', '/dashboard'].includes(path);
  }
  
  /**
   * Find a matching route for the given path
   * @param {string} path - The path to match
   * @returns {Object|null} - Object with handler and params if found, null otherwise
   */
  findMatchingRoute(path) {
    // First try exact match
    if (this.routes[path]) {
      return { handler: this.routes[path], params: {} };
    }
    
    // Then try parameterized routes
    const routeKeys = Object.keys(this.routes);
    
    for (const route of routeKeys) {
      // Skip exact matches (already checked)
      if (route === path) continue;
      
      // Check for parameterized routes (e.g., '/category/:id')
      if (route.includes(':')) {
        const routeParts = route.split('/');
        const pathParts = path.split('/');
        
        // Skip if number of parts don't match
        if (routeParts.length !== pathParts.length) continue;
        
        const params = {};
        let match = true;
        
        for (let i = 0; i < routeParts.length; i++) {
          const routePart = routeParts[i];
          const pathPart = pathParts[i];
          
          if (routePart.startsWith(':')) {
            // It's a parameter
            const paramName = routePart.slice(1);
            params[paramName] = pathPart;
          } else if (routePart !== pathPart) {
            // Static part doesn't match
            match = false;
            break;
          }
        }
        
        if (match) {
          return { handler: this.routes[route], params };
        }
      }
    }
    
    return null;
  }

  handleRouteChange() {
    // Get the current hash, default to '/' if empty
    let hash = window.location.hash.slice(1);
    
    // If no hash but we're at the root path, default to '/welcome'
    if (!hash && window.location.pathname === '/') {
      hash = '/welcome';
    } else if (!hash) {
      hash = '/';
    }
    
    console.log('IntroRouter: Handling route change to:', hash);
    
    // Find matching route (exact match or parameterized route)
    let routeHandler = this.routes[hash];
    let params = {};
    
    // If no exact match, try to find a parameterized route
    if (!routeHandler) {
      const routeMatch = this.findMatchingRoute(hash);
      if (routeMatch) {
        routeHandler = routeMatch.handler;
        params = routeMatch.params || {};
      }
    }

    if (routeHandler) {
      this.previousRoute = this.currentRoute;
      this.currentRoute = hash;
      
      // Handle special case for splash screen
      if (hash === '/splash') {
        // After splash, navigate to dashboard
        setTimeout(() => {
          // Gunakan pathname agar AppRouter yang handle, bukan hash
          window.location.pathname = '/dashboard';
        }, 2000);
        return;
      }
      
      // Use View Transition API if available and this is an intro route
      const useTransition = this.isIntroRoute(hash) && 'startViewTransition' in document;
      
      const execute = () => {
        try {
          routeHandler(params);
          
          // Notify route change
          if (this.onRouteChange) {
            this.onRouteChange({
              from: this.previousRoute,
              to: hash,
              params: params
            });
          }
          
          console.log(`IntroRouter: Successfully navigated to ${hash}`);
        } catch (error) {
          console.error(`Error executing route ${hash}:`, error);
          // Fallback to welcome on error for intro routes
          if (this.isIntroRoute(hash)) {
            this.navigate('/welcome');
          }
        }
      };
      
      if (useTransition) {
        document.startViewTransition(execute);
      } else {
        execute();
      }
    } else {
      console.warn(`IntroRouter: No route found for: ${hash}`);
      // For unknown intro routes, redirect to welcome
      if (this.isIntroRoute(hash)) {
        console.log(`IntroRouter: Redirecting unknown intro route to /welcome`);
        this.navigate('/welcome');
      }
    }
  }

  executeRoute(hash, route, params = {}) {
    try {
      // Handle result page specially to pass any stored data
      if (hash === '/result') {
        const storedResult = sessionStorage.getItem('accentResult');
        if (storedResult) {
          const resultData = JSON.parse(storedResult);
          sessionStorage.removeItem('accentResult');
          route(resultData);
        } else {
          route();
        }
      } else if (hash.startsWith('/category/')) {
        // Handle category routes with parameters
        route(params);
      } else {
        route();
      }
      console.log(`🏁 Route changed to: ${hash}`);
    } catch (error) {
      console.error(`❌ Error executing route ${hash}:`, error);
      if (this.isIntroRoute(hash)) {
        this.navigate('/welcome');
      }
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

export default IntroRouter;
