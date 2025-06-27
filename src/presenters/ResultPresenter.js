import ResultView from '../views/ResultView.js';
import RecordingManager from '../utils/RecordingManager.js';
import RecordingStorage from '../utils/RecordingStorage.js';

/**
 * ResultPresenter - Manages result page logic and data flow
 */
class ResultPresenter {
  constructor() {
    this.view = null;
    this.recording = null;
    this.audioBlob = null;
  }

  /**
   * Initialize the result presenter
   */
  async init() {
    try {
      this.view = new ResultView();
      
      // Get the latest recording data
      await this.loadRecordingData();
      
      // Render the view
      this.render();
      
      // Start accent detection process
      if (this.audioBlob) {
        await this.view.startAccentDetection();
      } else {
        this.view.showError('Rekaman tidak ditemukan');
      }
      
    } catch (error) {
      console.error('Failed to initialize ResultPresenter:', error);
      
      if (this.view) {
        this.view.showError('Gagal memuat halaman hasil');
      }
    }
  }

  /**
   * Load recording data from RecordingManager or storage
   */
  async loadRecordingData() {
    try {
      // First try to get current recording from RecordingManager
      const currentRecording = RecordingManager.getCurrentRecording();
      
      if (currentRecording) {
        console.log('📁 Using current recording from RecordingManager');
        this.recording = currentRecording;
        
        // Get audio blob from IndexedDB
        this.audioBlob = await this.getAudioBlobFromStorage(currentRecording.id);
      } else {
        // Fallback: get the most recent recording from storage
        console.log('📁 Loading most recent recording from storage');
        const recentRecording = await this.getMostRecentRecording();
        
        if (recentRecording) {
          this.recording = recentRecording;
          this.audioBlob = await this.getAudioBlobFromStorage(recentRecording.id);
        }
      }

      if (!this.recording || !this.audioBlob) {
        throw new Error('No recording data available');
      }

      console.log('✅ Recording data loaded successfully:', this.recording.filename);

    } catch (error) {
      console.error('Failed to load recording data:', error);
      throw error;
    }
  }

  /**
   * Get audio blob from IndexedDB storage
   */
  async getAudioBlobFromStorage(recordingId) {
    try {
      const storage = new RecordingStorage();
      await storage.initialize();
      
      const recording = await storage.getRecording(recordingId);
      return recording ? recording.audioBlob : null;
      
    } catch (error) {
      console.error('Failed to get audio blob from storage:', error);
      return null;
    }
  }

  /**
   * Get the most recent recording from storage
   */
  async getMostRecentRecording() {
    try {
      const storage = new RecordingStorage();
      await storage.initialize();
      
      const recordings = await storage.getAllRecordings();
      
      if (recordings && recordings.length > 0) {
        // Sort by date (most recent first)
        recordings.sort((a, b) => new Date(b.date) - new Date(a.date));
        return recordings[0];
      }
      
      return null;
      
    } catch (error) {
      console.error('Failed to get recent recording:', error);
      return null;
    }
  }

  /**
   * Render the view
   */
  render() {
    // Clear existing content
    const appElement = document.getElementById('app');
    appElement.innerHTML = '';
    
    // Render the view
    const viewElement = this.view.render();
    appElement.appendChild(viewElement);
  }

  /**
   * Handle navigation to result page with specific recording
   */
  static async navigateWithRecording(recording, audioBlob) {
    try {
      // Store recording data temporarily for the result page
      if (window.resultPageData) {
        // Clean up previous data
        if (window.resultPageData.audioURL) {
          URL.revokeObjectURL(window.resultPageData.audioURL);
        }
      }

      window.resultPageData = {
        recording: recording,
        audioBlob: audioBlob,
        audioURL: audioBlob ? URL.createObjectURL(audioBlob) : null,
        timestamp: Date.now()
      };

      // Navigate to result page
      window.location.hash = '#/result';
      
    } catch (error) {
      console.error('Failed to navigate to result page:', error);
      throw error;
    }
  }

  /**
   * Get temporary recording data for result page
   */
  static getTemporaryRecordingData() {
    const data = window.resultPageData;
    
    // Check if data exists and is not too old (5 minutes)
    if (data && (Date.now() - data.timestamp) < 5 * 60 * 1000) {
      return data;
    }
    
    // Clean up old data
    if (data && data.audioURL) {
      URL.revokeObjectURL(data.audioURL);
    }
    
    window.resultPageData = null;
    return null;
  }

  /**
   * Enhanced loadRecordingData that checks temporary data first
   */
  async loadRecordingDataEnhanced() {
    try {
      // First check for temporary data from navigation
      const tempData = ResultPresenter.getTemporaryRecordingData();

      if (tempData && tempData.recording && tempData.audioBlob) {
        console.log('📁 Using temporary recording data from navigation');
        this.recording = tempData.recording;
        this.audioBlob = tempData.audioBlob;
        return;
      }

      // Fallback to regular loading method
      await this.loadRecordingData();

    } catch (error) {
      console.error('Failed to load recording data:', error);
      throw error;
    }
  }

  /**
   * Update init method to use enhanced loading
   */
  async initEnhanced() {
    try {
      this.view = new ResultView();

      // Render the view first to create DOM elements
      this.render();

      // Get recording data (check temporary data first)
      await this.loadRecordingDataEnhanced();

      // Set recording data to view after rendering
      if (this.recording && this.audioBlob) {
        await this.view.setRecording(this.recording, this.audioBlob);
      }

      // Start accent detection process
      if (this.audioBlob) {
        await this.view.startAccentDetection();
      } else {
        this.view.showError('Rekaman tidak ditemukan');
      }

    } catch (error) {
      console.error('Failed to initialize ResultPresenter:', error);

      if (this.view) {
        this.view.showError('Gagal memuat halaman hasil');
      }
    }
  }

  /**
   * Cleanup resources
   */
  destroy() {
    if (this.view) {
      this.view.destroy();
      this.view = null;
    }
    
    // Clean up temporary data if this presenter created it
    const tempData = window.resultPageData;
    if (tempData && tempData.audioURL) {
      URL.revokeObjectURL(tempData.audioURL);
      window.resultPageData = null;
    }
    
    this.recording = null;
    this.audioBlob = null;
  }
}

export default ResultPresenter;
