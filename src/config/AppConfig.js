/**
 * Application configuration
 */
class AppConfig {
  static get MOCK_MODE() {
    return false; // Set to false to use real API
  }

  static get API_ENDPOINT() {
    return 'http://localhost:8000/identify';
  }

  static get MOCK_DELAY_MIN() {
    return 1000; // Minimum delay in ms
  }

  static get MOCK_DELAY_MAX() {
    return 3000; // Maximum delay in ms
  }

  static get MOCK_CONFIDENCE_MIN() {
    return 60; // Minimum confidence percentage
  }

  static get MOCK_CONFIDENCE_MAX() {
    return 95; // Maximum confidence percentage
  }
}

export default AppConfig;
