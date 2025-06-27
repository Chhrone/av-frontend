import AudioRecorder from './AudioRecorder.js';
import RecordingStorage from './RecordingStorage.js';

/**
 * RecordingManager - Manages recording state across views
 * Coordinates AudioRecorder and RecordingStorage
 */
class RecordingManager {
  constructor() {
    this.audioRecorder = null;
    this.isInitialized = false;
    this.isRecording = false;
    this.recordingStartedFromWelcome = false;
    this.currentRecording = null;
    
    // Event listeners for state changes
    this.listeners = {
      recordingStart: [],
      recordingStop: [],
      recordingError: [],
      stateChange: []
    };
  }

  /**
   * Initialize recording system
   */
  async initialize() {
    try {
      // Initialize storage only (lightweight)
      await RecordingStorage.initialize();

      this.isInitialized = true;
      console.log('🎙️ RecordingManager initialized');

      this.notifyListeners('stateChange', { initialized: true });
      return true;
    } catch (error) {
      console.error('Failed to initialize RecordingManager:', error);
      this.notifyListeners('recordingError', error);
      throw error;
    }
  }

  /**
   * Start recording from welcome page
   */
  async startRecordingFromWelcome() {
    try {
      console.log('🎙️ Starting recording initialization...');

      if (!this.isInitialized) {
        await this.initialize();
      }

      // Create audio recorder instance
      this.audioRecorder = new AudioRecorder();

      // Initialize audio recorder (this requests microphone permission)
      console.log('🎙️ Requesting microphone permission...');
      await this.audioRecorder.initialize();

      // Start recording
      console.log('🎙️ Starting audio recording...');
      await this.audioRecorder.startRecording();

      this.isRecording = true;
      this.recordingStartedFromWelcome = true;

      console.log('🎙️ Recording started successfully from welcome page');
      this.notifyListeners('recordingStart', {
        source: 'welcome',
        timestamp: Date.now()
      });

      this.notifyListeners('stateChange', {
        isRecording: true,
        source: 'welcome'
      });

      return true;
    } catch (error) {
      console.error('Failed to start recording from welcome:', error);
      this.isRecording = false;
      this.recordingStartedFromWelcome = false;

      this.notifyListeners('recordingError', error);
      this.notifyListeners('stateChange', {
        isRecording: false,
        error: error.message
      });

      throw error;
    }
  }

  /**
   * Stop recording and save to IndexedDB
   */
  async stopRecording(metadata = {}) {
    try {
      if (!this.isRecording || !this.audioRecorder) {
        console.warn('No active recording to stop');
        return null;
      }

      console.log('🎙️ Stopping recording...');
      
      // Stop recording and get audio data
      const recordingData = await this.audioRecorder.stopRecording();
      
      if (!recordingData) {
        throw new Error('No recording data received');
      }

      // Prepare metadata
      const recordingMetadata = {
        name: metadata.name || 'Speech Test Recording',
        category: metadata.category || 'speech-test',
        duration: recordingData.duration,
        sampleRate: recordingData.sampleRate,
        format: recordingData.format,
        source: this.recordingStartedFromWelcome ? 'welcome' : 'test',
        ...metadata
      };

      // Save to IndexedDB
      const savedRecording = await RecordingStorage.saveRecording(
        recordingData.blob,
        recordingMetadata
      );

      this.currentRecording = savedRecording;
      this.isRecording = false;
      this.recordingStartedFromWelcome = false;

      console.log('🎙️ Recording stopped and saved:', savedRecording.filename);
      
      this.notifyListeners('recordingStop', {
        recording: savedRecording,
        duration: recordingData.duration
      });
      
      this.notifyListeners('stateChange', { 
        isRecording: false,
        lastRecording: savedRecording
      });

      // Clean up audio recorder resources immediately
      await this.cleanup();

      return savedRecording;
    } catch (error) {
      console.error('Failed to stop recording:', error);
      this.notifyListeners('recordingError', error);
      throw error;
    }
  }

  /**
   * Get current recording state
   */
  getRecordingState() {
    return {
      isInitialized: this.isInitialized,
      isRecording: this.isRecording,
      recordingStartedFromWelcome: this.recordingStartedFromWelcome,
      currentRecording: this.currentRecording,
      duration: this.audioRecorder ? this.audioRecorder.getRecordingDuration() : 0
    };
  }

  /**
   * Check if recording is active
   */
  isRecordingActive() {
    return this.isRecording;
  }

  /**
   * Check if recording was started from welcome page
   */
  wasStartedFromWelcome() {
    return this.recordingStartedFromWelcome;
  }

  /**
   * Get recording duration in real-time
   */
  getCurrentDuration() {
    if (this.audioRecorder && this.isRecording) {
      return this.audioRecorder.getRecordingDuration();
    }
    return 0;
  }

  /**
   * Add event listener
   */
  addEventListener(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event].push(callback);
    }
  }

  /**
   * Remove event listener
   */
  removeEventListener(event, callback) {
    if (this.listeners[event]) {
      const index = this.listeners[event].indexOf(callback);
      if (index > -1) {
        this.listeners[event].splice(index, 1);
      }
    }
  }

  /**
   * Notify all listeners of an event
   */
  notifyListeners(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in ${event} listener:`, error);
        }
      });
    }
  }

  /**
   * Clean up audio recorder resources
   */
  async cleanup() {
    try {
      if (this.audioRecorder) {
        await this.audioRecorder.destroy();
        this.audioRecorder = null;
      }

      // Force garbage collection hint
      if (window.gc) {
        window.gc();
      }

      console.log('🎙️ RecordingManager resources cleaned up');
    } catch (error) {
      console.error('Error during cleanup:', error);
    }
  }

  /**
   * Get all recordings from storage
   */
  async getAllRecordings() {
    try {
      return await RecordingStorage.getAllRecordings();
    } catch (error) {
      console.error('Failed to get recordings:', error);
      throw error;
    }
  }

  /**
   * Get recording by ID
   */
  async getRecording(id) {
    try {
      return await RecordingStorage.getRecording(id);
    } catch (error) {
      console.error('Failed to get recording:', error);
      throw error;
    }
  }

  /**
   * Delete recording
   */
  async deleteRecording(id) {
    try {
      return await RecordingStorage.deleteRecording(id);
    } catch (error) {
      console.error('Failed to delete recording:', error);
      throw error;
    }
  }

  /**
   * Get storage statistics
   */
  async getStorageStats() {
    try {
      return await RecordingStorage.getStats();
    } catch (error) {
      console.error('Failed to get storage stats:', error);
      throw error;
    }
  }

  /**
   * Force stop recording and cleanup (emergency cleanup)
   */
  async forceStop() {
    try {
      console.log('🎙️ Force stopping recording...');

      this.isRecording = false;
      this.recordingStartedFromWelcome = false;

      if (this.audioRecorder) {
        // Force cleanup microphone resources immediately
        await this.audioRecorder.cleanupMicrophoneResources();
        await this.audioRecorder.destroy();
        this.audioRecorder = null;
      }

      // Additional cleanup - try to stop any remaining media streams
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        console.log('🎙️ Available devices after cleanup:', devices.length);
      } catch (e) {
        // Ignore errors in device enumeration
      }

      this.notifyListeners('stateChange', {
        isRecording: false,
        forceStopped: true
      });

      console.log('🎙️ Recording force stopped and all resources cleaned up');
    } catch (error) {
      console.error('Error during force stop:', error);
    }
  }
}

// Export singleton instance
export default new RecordingManager();
