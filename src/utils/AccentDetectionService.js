/**
 * AccentDetectionService - Handles US accent detection API calls
 */
class AccentDetectionService {
  constructor() {
    this.apiEndpoint = 'http://localhost:8000/identify';
  }

  /**
   * Analyze audio for US accent confidence
   * @param {Blob} audioBlob - The audio file to analyze
   * @returns {Promise<Object>} - Promise resolving to { us_confidence: number }
   */
  async analyzeAccent(audioBlob) {
    try {
      // Ensure the audio blob is in WAV format
      if (!audioBlob.type.includes('wav')) {
        throw new Error('Audio file must be in WAV format');
      }

      // Create FormData to send the audio file
      const formData = new FormData();
      formData.append('file', audioBlob, 'recording.wav');

      // Make API call
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        body: formData,
        mode: 'cors',
        headers: {
          // Don't set Content-Type header - let browser set it with boundary for FormData
        }
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();

      // Validate response format - check for various possible response formats
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

      // Show error to user
      alert('Sorry, there was an error analyzing your recording. Please try again.');
    }
  }
}

// Create singleton instance
const accentDetectionService = new AccentDetectionService();

export default accentDetectionService;
