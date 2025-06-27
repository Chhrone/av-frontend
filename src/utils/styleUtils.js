/**
 * Style Utilities - JavaScript functions for dynamic styling
 * Moved from styles/base.js to keep styles folder CSS-only
 */

/**
 * Apply styles to a DOM element
 * @param {HTMLElement} element - The element to style
 * @param {Object} styles - Object containing CSS properties and values
 */
export function applyStyles(element, styles) {
  Object.assign(element.style, styles);
}

/**
 * Add hover effects to an element
 * @param {HTMLElement} element - The element to add hover effects to
 * @param {Object} normalStyles - Base styles for the element
 * @param {Object} hoverStyles - Styles to apply on hover
 * @param {Object} visibleStyles - Additional styles for visible state (optional)
 */
export function addHoverEffect(element, normalStyles, hoverStyles, visibleStyles = {}) {
  applyStyles(element, normalStyles);

  element.addEventListener('mouseenter', () => {
    applyStyles(element, { ...normalStyles, ...visibleStyles, ...hoverStyles });
  });

  element.addEventListener('mouseleave', () => {
    // Remove transition for instant return to normal state
    const { transition, ...stylesWithoutTransition } = { ...normalStyles, ...visibleStyles };
    applyStyles(element, stylesWithoutTransition);
  });
}

/**
 * Create a style object from CSS class-like properties
 * Useful for converting CSS-in-JS to inline styles
 * @param {Object} cssProperties - Object with CSS properties
 * @returns {Object} Style object ready for applyStyles
 */
export function createStyleObject(cssProperties) {
  return cssProperties;
}

/**
 * Add CSS class to element with optional animation delay
 * @param {HTMLElement} element - The element to add class to
 * @param {string} className - CSS class name to add
 * @param {number} delay - Delay in milliseconds (optional)
 */
export function addClassWithDelay(element, className, delay = 0) {
  if (delay > 0) {
    setTimeout(() => {
      element.classList.add(className);
    }, delay);
  } else {
    element.classList.add(className);
  }
}

/**
 * Remove CSS class from element
 * @param {HTMLElement} element - The element to remove class from
 * @param {string} className - CSS class name to remove
 */
export function removeClass(element, className) {
  element.classList.remove(className);
}

/**
 * Toggle CSS class on element
 * @param {HTMLElement} element - The element to toggle class on
 * @param {string} className - CSS class name to toggle
 * @returns {boolean} True if class was added, false if removed
 */
export function toggleClass(element, className) {
  return element.classList.toggle(className);
}

/**
 * Apply entrance animation to element
 * @param {HTMLElement} element - The element to animate
 * @param {number} delay - Animation delay in milliseconds
 */
export function applyEntranceAnimation(element, delay = 100) {
  // Set initial state
  applyStyles(element, {
    opacity: '0',
    transform: 'translateY(20px)'
  });

  // Trigger animation after delay
  setTimeout(() => {
    applyStyles(element, {
      opacity: '1',
      transform: 'translateY(0)',
      transition: 'all 0.5s ease-out'
    });
  }, delay);
}
