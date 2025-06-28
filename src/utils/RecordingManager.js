import AudioRecorder from './AudioRecorder.js';
import RecordingStorage from './RecordingStorage.js';

class RecordingManager {
  constructor() {
    this.audioRecorder = null;
    this.isInitialized = false;
    this.isRecording = false;
    this.recordingStartedFromWelcome = false;
    this.currentRecording = null;

    this.listeners = {
      recordingStart: [],
      recordingStop: [],
      recordingError: [],
      stateChange: []
    };
  }

  async initialize() {
    try {
      await RecordingStorage.initialize();
      this.isInitialized = true;
      this.notifyListeners('stateChange', { initialized: true });
      return true;
    } catch (error) {
      console.error('Failed to initialize RecordingManager:', error);
      this.notifyListeners('recordingError', error);
      throw error;
    }
  }

  async startRecordingFromWelcome() {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      this.audioRecorder = new AudioRecorder();
      await this.audioRecorder.initialize();
      await this.audioRecorder.startRecording();

      this.isRecording = true;
      this.recordingStartedFromWelcome = true;
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

  async stopRecording(metadata = {}) {
    try {
      if (!this.isRecording || !this.audioRecorder) {
        return null;
      }

      const recordingData = await this.audioRecorder.stopRecording();

      if (!recordingData) {
        throw new Error('No recording data received');
      }

      const recordingMetadata = {
        name: metadata.name || 'Speech Test Recording',
        category: metadata.category || 'speech-test',
        duration: recordingData.duration,
        sampleRate: recordingData.sampleRate,
        format: recordingData.format,
        source: this.recordingStartedFromWelcome ? 'welcome' : 'test',
        ...metadata
      };

      const savedRecording = await RecordingStorage.saveRecording(
        recordingData.blob,
        recordingMetadata
      );

      this.currentRecording = savedRecording;
      this.isRecording = false;
      this.recordingStartedFromWelcome = false;

      this.notifyListeners('recordingStop', {
        recording: savedRecording,
        duration: recordingData.duration
      });

      this.notifyListeners('stateChange', {
        isRecording: false,
        lastRecording: savedRecording
      });

      await this.cleanup();
      return savedRecording;
    } catch (error) {
      console.error('Failed to stop recording:', error);
      this.notifyListeners('recordingError', error);
      throw error;
    }
  }

  getRecordingState() {
    return {
      isInitialized: this.isInitialized,
      isRecording: this.isRecording,
      recordingStartedFromWelcome: this.recordingStartedFromWelcome,
      currentRecording: this.currentRecording,
      duration: this.audioRecorder ? this.audioRecorder.getRecordingDuration() : 0
    };
  }

  isRecordingActive() {
    return this.isRecording;
  }

  wasStartedFromWelcome() {
    return this.recordingStartedFromWelcome;
  }

  getCurrentDuration() {
    if (this.audioRecorder && this.isRecording) {
      return this.audioRecorder.getRecordingDuration();
    }
    return 0;
  }

  addEventListener(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event].push(callback);
    }
  }

  removeEventListener(event, callback) {
    if (this.listeners[event]) {
      const index = this.listeners[event].indexOf(callback);
      if (index > -1) {
        this.listeners[event].splice(index, 1);
      }
    }
  }

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

  async cleanup() {
    try {
      if (this.audioRecorder) {
        await this.audioRecorder.destroy();
        this.audioRecorder = null;
      }

      if (window.gc) {
        window.gc();
      }
    } catch (error) {
      console.error('Error during cleanup:', error);
    }
  }

  async getAllRecordings() {
    try {
      return await RecordingStorage.getAllRecordings();
    } catch (error) {
      console.error('Failed to get recordings:', error);
      throw error;
    }
  }

  async getRecording(id) {
    try {
      return await RecordingStorage.getRecording(id);
    } catch (error) {
      console.error('Failed to get recording:', error);
      throw error;
    }
  }

  async deleteRecording(id) {
    try {
      return await RecordingStorage.deleteRecording(id);
    } catch (error) {
      console.error('Failed to delete recording:', error);
      throw error;
    }
  }

  async getStorageStats() {
    try {
      return await RecordingStorage.getStats();
    } catch (error) {
      console.error('Failed to get storage stats:', error);
      throw error;
    }
  }

  async forceStop() {
    try {
      this.isRecording = false;
      this.recordingStartedFromWelcome = false;

      if (this.audioRecorder) {
        await this.audioRecorder.cleanupMicrophoneResources();
        await this.audioRecorder.destroy();
        this.audioRecorder = null;
      }

      try {
        await navigator.mediaDevices.enumerateDevices();
      } catch (e) {
        // Ignore errors
      }

      this.notifyListeners('stateChange', {
        isRecording: false,
        forceStopped: true
      });

    } catch (error) {
      console.error('Error during force stop:', error);
    }
  }
}

export default new RecordingManager();
