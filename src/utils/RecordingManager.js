import AudioRecorder from './AudioRecorder.js';

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
      // No IndexedDB initialization needed - just mark as initialized
      this.isInitialized = true;
      this.notifyListeners('stateChange', { initialized: true });
      return true;
    } catch (error) {
      this.notifyListeners('recordingError', error);
      throw error;
    }
  }

  async startRecording() {
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
      const transcript = this.audioRecorder.getTranscript();
      if (!recordingData) {
        throw new Error('No recording data received');
      }
      const tempRecording = {
        audioBlob: recordingData.blob,
        name: metadata.name || 'Speech Test Recording',
        category: metadata.category || 'speech-test',
        duration: recordingData.duration,
        sampleRate: recordingData.sampleRate,
        format: recordingData.format,
        source: this.recordingStartedFromWelcome ? 'welcome' : 'test',
        timestamp: Date.now(),
        transcript: transcript,
        ...metadata
      };
      this.currentRecording = tempRecording;
      this.isRecording = false;
      this.recordingStartedFromWelcome = false;
      this.notifyListeners('recordingStop', {
        recording: tempRecording,
        duration: recordingData.duration
      });
      this.notifyListeners('stateChange', {
        isRecording: false,
        lastRecording: tempRecording
      });
      await this.cleanup();
      return tempRecording;
    } catch (error) {
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

  getCurrentTranscript() {
    if (this.audioRecorder) {
      return this.audioRecorder.getTranscript();
    }
    if (this.currentRecording && this.currentRecording.transcript) {
      return this.currentRecording.transcript;
    }
    return '';
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

  // Recording storage methods removed - no longer using IndexedDB
  // Recordings are now temporary and sent directly to API

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
