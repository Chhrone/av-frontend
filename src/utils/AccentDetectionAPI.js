/**
 * AccentDetectionAPI - Service for communicating with accent detection backend
 * Handles audio file upload and response processing
 */
class AccentDetectionAPI {
  constructor() {
    this.baseURL = 'http://localhost:8000';
    this.endpoint = '/identify';
  }

  /**
   * Send audio file to accent detection API
   * @param {Blob} audioBlob - The audio file blob (.wav format)
   * @param {string} filename - The filename for the audio file
   * @returns {Promise<Object>} API response with us_confidence
   */
  async identifyAccent(audioBlob, filename = 'recording.wav') {
    try {
      // Validate input
      if (!audioBlob || !(audioBlob instanceof Blob)) {
        throw new Error('Invalid audio blob provided');
      }

      // Log detailed blob information for debugging
      console.log('🌐 Sending audio to accent detection API...');
      console.log('📁 File size:', Math.round(audioBlob.size / 1024), 'KB');
      console.log('📁 Filename:', filename);
      console.log('📁 Blob type:', audioBlob.type);
      console.log('📁 Blob size (bytes):', audioBlob.size);

      // Ensure filename has .wav extension
      if (!filename.endsWith('.wav')) {
        filename = filename.replace(/\.[^/.]+$/, '') + '.wav';
        console.log('📁 Updated filename to:', filename);
      }

      // Ensure blob has correct MIME type for WAV
      let finalBlob = audioBlob;
      if (audioBlob.type !== 'audio/wav') {
        console.log('🔄 Converting blob type to audio/wav');
        finalBlob = new Blob([audioBlob], { type: 'audio/wav' });
      }

      // Create FormData for file upload
      const formData = new FormData();
      formData.append('file', finalBlob, filename);

      // Send POST request to API
      const response = await fetch(`${this.baseURL}${this.endpoint}`, {
        method: 'POST',
        body: formData,
        // Don't set Content-Type header - let browser set it with boundary for FormData
      });

      // Check if response is ok
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API request failed: ${response.status} ${response.statusText} - ${errorText}`);
      }

      // Parse JSON response
      const result = await response.json();
      
      // Validate response format
      if (typeof result.us_confidence !== 'number') {
        throw new Error('Invalid API response format: missing or invalid us_confidence');
      }

      console.log('✅ Accent detection successful:', result);
      
      return {
        success: true,
        data: result,
        timestamp: Date.now()
      };

    } catch (error) {
      console.error('❌ Accent detection failed:', error);
      
      // Return error response in consistent format
      return {
        success: false,
        error: error.message,
        timestamp: Date.now()
      };
    }
  }

  /**
   * Check if API is available
   * @returns {Promise<boolean>} True if API is reachable
   */
  async checkAPIHealth() {
    try {
      const response = await fetch(`${this.baseURL}/health`, {
        method: 'GET',
        timeout: 5000
      });
      
      return response.ok;
    } catch (error) {
      console.warn('API health check failed:', error);
      return false;
    }
  }

  /**
   * Format confidence percentage for display
   * @param {number} confidence - Confidence value (0-100)
   * @returns {string} Formatted confidence string
   */
  formatConfidence(confidence) {
    if (typeof confidence !== 'number' || isNaN(confidence)) {
      return 'N/A';
    }
    
    return `${confidence.toFixed(1)}%`;
  }

  /**
   * Get confidence level description
   * @param {number} confidence - Confidence value (0-100)
   * @returns {string} Description of confidence level
   */
  getConfidenceLevel(confidence) {
    if (typeof confidence !== 'number' || isNaN(confidence)) {
      return 'Unknown';
    }

    if (confidence >= 80) {
      return 'Sangat Baik';
    } else if (confidence >= 60) {
      return 'Baik';
    } else if (confidence >= 40) {
      return 'Cukup';
    } else if (confidence >= 20) {
      return 'Kurang';
    } else {
      return 'Perlu Latihan';
    }
  }
}

// Export singleton instance
export default new AccentDetectionAPI();
