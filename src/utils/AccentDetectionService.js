import AppConfig from '../config/AppConfig.js';

/**
 * AccentDetectionService - AI accent detection service with demo mode
 */
class AccentDetectionService {
  constructor() {
    this.useRealModel = AppConfig.USE_REAL_MODEL;
    this.apiEndpoint = AppConfig.API_ENDPOINT;
  }

  /**
   * Analyze audio for US accent confidence
   * @param {Blob} audioBlob - The audio file to analyze
   * @returns {Promise<Object>} - Promise resolving to { us_confidence: number }
   */
  async analyzeAccent(audioBlob) {
    if (!this.useRealModel) {
      return this.getDemoResult();
    }

    try {
      if (!audioBlob.type.includes('wav')) {
        throw new Error('Audio file must be in WAV format');
      }

      const formData = new FormData();
      formData.append('file', audioBlob, 'recording.wav');

      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        body: formData,
        mode: 'cors'
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      let us_confidence;

      if (typeof result.us_confidence === 'number') {
        us_confidence = result.us_confidence;
      } else if (typeof result.confidence === 'number') {
        us_confidence = result.confidence;
      } else if (typeof result === 'number') {
        us_confidence = result;
      } else {
        throw new Error('Invalid API response format: no confidence value found');
      }

      return { us_confidence };

    } catch (error) {
      console.error('Accent detection failed:', error);
      throw error;
    }
  }

  /**
   * Generate demo result for development/testing
   * @returns {Promise<Object>} - Demo confidence data
   */
  async getDemoResult() {
    const delay = AppConfig.MOCK_DELAY_MIN +
                  Math.random() * (AppConfig.MOCK_DELAY_MAX - AppConfig.MOCK_DELAY_MIN);
    await new Promise(resolve => setTimeout(resolve, delay));

    const range = AppConfig.MOCK_CONFIDENCE_MAX - AppConfig.MOCK_CONFIDENCE_MIN;
    const us_confidence = Math.round((AppConfig.MOCK_CONFIDENCE_MIN + Math.random() * range) * 10) / 10;

    return { us_confidence };
  }

  /**
   * Process recording and navigate to result page
   * @param {Object} recording - Recording object from RecordingStorage
   */
  async processRecordingAndShowResult(recording) {
    try {
      const audioBlob = recording.audioBlob;

      if (!audioBlob) {
        throw new Error('No audio data found in recording');
      }

      const result = await this.analyzeAccent(audioBlob);

      if (result) {
        sessionStorage.setItem('accentResult', JSON.stringify(result));
      }
      window.location.hash = '#/result';

    } catch (error) {
      console.error('Failed to process recording:', error);
      alert('Sorry, there was an error analyzing your recording. Please try again.');
    }
  }
}

// Create singleton instance
const accentDetectionService = new AccentDetectionService();

export default accentDetectionService;
