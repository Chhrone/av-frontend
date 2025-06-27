/**
 * AccentDetectionService - Handles US accent detection API calls
 */
class AccentDetectionService {
  constructor() {
    this.apiEndpoint = '/api/accent-detection'; // Replace with your actual API endpoint
  }

  /**
   * Analyze audio for US accent confidence
   * @param {Blob} audioBlob - The audio file to analyze
   * @returns {Promise<Object>} - Promise resolving to { us_confidence: number }
   */
  async analyzeAccent(audioBlob) {
    try {
      // Simulate API delay for realistic experience
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Always return mock data for now
      return this.getMockResult();

      /*
      // Real API implementation (commented out for mock mode)
      // Uncomment this section when ready to use real API

      // Create FormData to send the audio file
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.wav');

      // Make API call
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        body: formData,
        headers: {
          // Don't set Content-Type header - let browser set it with boundary for FormData
        }
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();

      // Validate response format
      if (typeof result.us_confidence !== 'number') {
        throw new Error('Invalid API response format: missing us_confidence');
      }

      return result;
      */

    } catch (error) {
      console.error('Accent detection failed:', error);

      // Fallback to mock data
      return this.getMockResult();
    }
  }

  /**
   * Get mock result for development/testing
   * @returns {Object} - Mock result with random confidence
   */
  getMockResult() {
    // Generate a random confidence between 50-95 for demo purposes
    const us_confidence = Math.random() * 45 + 50; // 50-95 range
    return {
      us_confidence: Math.round(us_confidence * 100) / 100 // Round to 2 decimal places
    };
  }

  /**
   * Process recording and navigate to result page
   * @param {Object} recording - Recording object from RecordingStorage
   */
  async processRecordingAndShowResult(recording) {
    try {
      // Get the audio blob from the recording
      const audioBlob = recording.audioBlob;

      if (!audioBlob) {
        throw new Error('No audio data found in recording');
      }

      // Analyze the accent
      const result = await this.analyzeAccent(audioBlob);

      // Navigate to result page with the confidence data
      // Store result data temporarily in sessionStorage for the route handler
      if (result) {
        sessionStorage.setItem('accentResult', JSON.stringify(result));
      }
      window.location.hash = '#/result';

    } catch (error) {
      console.error('Failed to process recording:', error);

      // Show error to user or fallback behavior
      alert('Sorry, there was an error analyzing your recording. Please try again.');
    }
  }
}

// Create singleton instance
const accentDetectionService = new AccentDetectionService();

export default accentDetectionService;
