/**
 * Style Constants - CSS class names and inline style objects
 * This provides backward compatibility while transitioning to CSS-first approach
 */

// CSS Class Names (recommended approach)
export const cssClasses = {
  // Layout
  container: 'container',
  
  // Welcome page
  welcomeText: 'welcome-text',
  welcomeTextVisible: 'welcome-text visible',
  
  // Buttons
  microphoneButton: 'microphone-button',
  microphoneButtonVisible: 'microphone-button visible',
  floatingMicrophone: 'floating-microphone',
  backButton: 'btn back-button',
  demoLink: 'demo-link',
  
  // Text
  testText: 'test-text',
  
  // Icons
  microphoneIcon: 'microphone-icon',
  
  // Utilities
  fadeIn: 'fade-in',
  fadeOut: 'fade-out',
  slideUp: 'slide-up',
  slideDown: 'slide-down'
};

// Inline Style Objects (for dynamic styling when CSS classes aren't sufficient)
export const inlineStyles = {
  // Reset and base styles
  reset: {
    margin: '0',
    padding: '0',
    boxSizing: 'border-box'
  },

  body: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    backgroundColor: '#e2e8f0',
    color: '#2d3748',
    lineHeight: '1.6',
    minHeight: '100vh',
    overflow: 'hidden'
  },

  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: '2rem',
    position: 'relative'
  },

  // Welcome page styles
  welcomeText: {
    fontSize: '2.5rem',
    fontWeight: '600',
    textAlign: 'center',
    color: '#2d3748',
    marginBottom: '3rem',
    maxWidth: '800px',
    lineHeight: '1.3',
    opacity: '0',
    transform: 'translateY(20px)'
  },

  welcomeTextVisible: {
    opacity: '1',
    transform: 'translateY(0)',
    transition: 'all 0.5s ease-out'
  },

  microphoneButton: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    backgroundColor: '#4299e1',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '2rem',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(66, 153, 225, 0.3)',
    opacity: '0',
    transform: 'translateY(20px)',
    viewTransitionName: 'microphone-button'
  },

  microphoneButtonVisible: {
    opacity: '1',
    transform: 'translateY(0)',
    transition: 'all 0.5s ease-out',
    transitionDelay: '0.2s'
  },

  microphoneButtonHover: {
    backgroundColor: '#3182ce',
    transform: 'scale(1.05)',
    boxShadow: '0 6px 16px rgba(66, 153, 225, 0.4)',
    opacity: '1'
  },

  // Test page styles
  testText: {
    fontSize: '1.8rem',
    fontWeight: '500',
    textAlign: 'center',
    color: '#2d3748',
    maxWidth: '1200px',
    lineHeight: '1.6',
    marginBottom: '2rem',
    opacity: '1'
  },

  floatingMicrophone: {
    position: 'fixed',
    bottom: '300px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    backgroundColor: '#4299e1',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '2rem',
    boxShadow: '0 4px 12px rgba(66, 153, 225, 0.3)',
    opacity: '1',
    viewTransitionName: 'microphone-button',
    transition: 'all 0.3s ease'
  },

  floatingMicrophoneHover: {
    backgroundColor: '#3182ce',
    transform: 'translateX(-50%) scale(1.05)',
    boxShadow: '0 6px 16px rgba(66, 153, 225, 0.4)',
    opacity: '1',
    transition: 'all 0.3s ease'
  },

  microphoneIcon: {
    width: '24px',
    height: '24px',
    fill: 'currentColor'
  },

  // Button styles
  button: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#4299e1',
    color: 'white',
    border: 'none',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '500',
    transition: 'all 0.3s ease'
  },

  buttonHover: {
    backgroundColor: '#3182ce',
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(66, 153, 225, 0.3)'
  },

  backButton: {
    position: 'absolute',
    top: '2rem',
    left: '2rem',
    padding: '0.75rem 1.5rem',
    backgroundColor: '#4299e1',
    color: 'white',
    border: 'none',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '500',
    transition: 'all 0.3s ease',
    zIndex: '1000'
  },

  demoLink: {
    position: 'absolute',
    bottom: '2rem',
    right: '2rem',
    color: '#4299e1',
    textDecoration: 'none',
    fontSize: '0.9rem',
    fontWeight: '500',
    padding: '0.5rem 1rem',
    border: '1px solid #4299e1',
    borderRadius: '0.25rem',
    transition: 'all 0.3s ease'
  }
};

// Legacy export for backward compatibility
export const baseStyles = inlineStyles;
