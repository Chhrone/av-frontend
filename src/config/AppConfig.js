/**
 * Application configuration
 */
class AppConfig {
  static get USE_REAL_MODEL() {
    return false;
  }

  static get API_ENDPOINT() {
    return 'http://localhost:8000/identify';
  }

  // Demo/Mock mode settings (used when USE_REAL_MODEL = false)
  static get MOCK_DELAY_MIN() {
    return 1000;
  }

  static get MOCK_DELAY_MAX() {
    return 3000;
  }

  static get MOCK_CONFIDENCE_MIN() {
    return 60;
  }

  static get MOCK_CONFIDENCE_MAX() {
    return 95;
  }
}

export default AppConfig;
