/**
 * Application Route Constants
 * This file contains all route paths used in the application
 */

export const ROUTES = {
  // Main routes
  DASHBOARD: '/dashboard',
  CATEGORY: '/category',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  
  // Auth routes
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  
  // Error pages
  NOT_FOUND: '/404',
  ERROR: '/error',
};

/**
 * Generate route with parameters
 * @param {string} baseRoute - Base route path
 * @param {Object} params - Route parameters
 * @returns {string} - Generated route with parameters
 */
export const generateRoute = (baseRoute, params = {}) => {
  let route = baseRoute;
  
  // Replace route parameters (e.g., /category/:id)
  Object.keys(params).forEach(key => {
    route = route.replace(`:${key}`, params[key]);
  });
  
  // Add query parameters if any
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && !route.includes(`:${key}`)) {
      queryParams.append(key, value);
    }
  });
  
  const queryString = queryParams.toString();
  return queryString ? `${route}?${queryString}` : route;
};

/**
 * Get route parameters from URL
 * @param {string} routePattern - The route pattern (e.g., '/category/:id')
 * @param {string} path - The actual path (e.g., '/category/123')
 * @returns {Object} - Extracted parameters
 */
export const getRouteParams = (routePattern, path) => {
  const patternParts = routePattern.split('/');
  const pathParts = path.split('/');
  const params = {};
  
  patternParts.forEach((part, index) => {
    if (part.startsWith(':')) {
      const paramName = part.slice(1);
      params[paramName] = pathParts[index];
    }
  });
  
  return params;
};

/**
 * Get query parameters from URL
 * @param {string} url - The URL to parse
 * @returns {Object} - Query parameters as key-value pairs
 */
export const getQueryParams = (url = window.location.search) => {
  const params = new URLSearchParams(url);
  const result = {};
  
  for (const [key, value] of params.entries()) {
    result[key] = value;
  }
  
  return result;
};

/**
 * Check if current route matches a pattern
 * @param {string} pattern - Route pattern to match against
 * @returns {boolean} - True if current route matches the pattern
 */
export const isRoute = (pattern) => {
  const currentPath = window.location.pathname;
  const patternRegex = new RegExp(
    '^' + pattern.replace(/:[^\/]+/g, '([^\/]+)') + '$'
  );
  
  return patternRegex.test(currentPath);
};
