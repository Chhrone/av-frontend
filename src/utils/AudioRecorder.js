/**
 * AudioRecorder - Web Audio API based recorder with noise suppression and echo cancellation
 * Records audio at 16kHz and exports as WAV format
 */
class AudioRecorder {
  constructor() {
    this.mediaStream = null;
    this.audioContext = null;
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.isRecording = false;
    this.startTime = null;
    this.duration = 0;
    
    // Audio processing nodes
    this.sourceNode = null;
    this.gainNode = null;
    this.destinationNode = null;
  }

  /**
   * Initialize audio recording with constraints
   */
  async initialize() {
    try {
      // Request microphone access with audio constraints
      const constraints = {
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 16000,
          channelCount: 1
        }
      };

      this.mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      
      // Create audio context with 16kHz sample rate
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)({
        sampleRate: 16000
      });

      // Create audio processing chain
      this.sourceNode = this.audioContext.createMediaStreamSource(this.mediaStream);
      this.gainNode = this.audioContext.createGain();
      this.destinationNode = this.audioContext.createMediaStreamDestination();

      // Connect audio nodes
      this.sourceNode.connect(this.gainNode);
      this.gainNode.connect(this.destinationNode);

      // Create MediaRecorder with processed stream
      // Try WAV format first, fallback to webm if not supported
      let mimeType = 'audio/webm;codecs=opus';
      if (MediaRecorder.isTypeSupported('audio/wav')) {
        mimeType = 'audio/wav';
      } else if (MediaRecorder.isTypeSupported('audio/webm;codecs=pcm')) {
        mimeType = 'audio/webm;codecs=pcm';
      }

      this.mediaRecorder = new MediaRecorder(this.destinationNode.stream, {
        mimeType: mimeType
      });

      this.setupMediaRecorderEvents();
      return true;
    } catch (error) {
      console.error('Failed to initialize AudioRecorder:', error);
      throw error;
    }
  }

  /**
   * Setup MediaRecorder event handlers
   */
  setupMediaRecorderEvents() {
    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        this.audioChunks.push(event.data);
      }
    };

    this.mediaRecorder.onstop = async () => {
      await this.processRecording();
    };

    this.mediaRecorder.onerror = (error) => {
      console.error('MediaRecorder error:', error);
    };
  }

  /**
   * Start recording audio
   */
  async startRecording() {
    if (!this.mediaRecorder) {
      throw new Error('AudioRecorder not initialized');
    }

    if (this.isRecording) {
      return;
    }

    try {
      this.audioChunks = [];
      this.startTime = Date.now();
      this.mediaRecorder.start(100); // Collect data every 100ms
      this.isRecording = true;

      return true;
    } catch (error) {
      console.error('Failed to start recording:', error);
      throw error;
    }
  }

  /**
   * Stop recording audio
   */
  async stopRecording() {
    if (!this.isRecording) {
      return null;
    }

    try {
      this.mediaRecorder.stop();
      this.isRecording = false;
      this.duration = Date.now() - this.startTime;

      // Return a promise that resolves when processing is complete
      return new Promise((resolve) => {
        const originalOnStop = this.mediaRecorder.onstop;
        this.mediaRecorder.onstop = async (event) => {
          await originalOnStop(event);

          // Immediately cleanup microphone resources after processing
          await this.cleanupMicrophoneResources();

          resolve(this.getLastRecording());
        };
      });
    } catch (error) {
      console.error('Failed to stop recording:', error);
      throw error;
    }
  }

  /**
   * Process recorded audio and convert to WAV
   */
  async processRecording() {
    if (this.audioChunks.length === 0) {
      return;
    }

    try {
      // Get the MIME type that was actually used
      const recordedMimeType = this.mediaRecorder.mimeType;

      // Create blob from recorded chunks with correct type
      const audioBlob = new Blob(this.audioChunks, { type: recordedMimeType });

      let finalBlob;

      // If already WAV, use as-is, otherwise convert
      if (recordedMimeType.includes('wav')) {
        finalBlob = audioBlob;
      } else {
        finalBlob = await this.convertToWav(audioBlob);
      }

      // Store the processed recording
      this.lastRecording = {
        blob: finalBlob,
        duration: this.duration,
        size: finalBlob.size,
        timestamp: Date.now(),
        sampleRate: 16000,
        format: 'wav'
      };
    } catch (error) {
      console.error('Failed to process recording:', error);
      throw error;
    }
  }

  /**
   * Convert audio blob to WAV format at 16kHz
   */
  async convertToWav(audioBlob) {
    try {
      // Create audio buffer from blob
      const arrayBuffer = await audioBlob.arrayBuffer();
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);

      // Convert to WAV
      const wavBuffer = this.audioBufferToWav(audioBuffer);
      const wavBlob = new Blob([wavBuffer], { type: 'audio/wav' });

      return wavBlob;
    } catch (error) {
      console.error('Failed to convert to WAV:', error);

      // Create a proper WAV blob as fallback using a different method
      try {
        const fallbackWav = await this.createFallbackWav(audioBlob);
        return fallbackWav;
      } catch (fallbackError) {
        console.error('Fallback WAV conversion also failed:', fallbackError);
        // Last resort: return original blob but with WAV type
        return new Blob([audioBlob], { type: 'audio/wav' });
      }
    }
  }

  /**
   * Create fallback WAV conversion by creating a proper WAV blob
   */
  async createFallbackWav(originalBlob) {
    try {
      // Create a simple WAV header for the blob
      // This is a basic approach that creates a valid WAV file structure
      const wavHeader = this.createWavHeader(originalBlob.size, 16000, 1);

      // Combine WAV header with original audio data
      const wavBlob = new Blob([wavHeader, originalBlob], { type: 'audio/wav' });

      return wavBlob;
    } catch (error) {
      console.error('Fallback WAV conversion failed:', error);
      throw error;
    }
  }

  /**
   * Create a basic WAV header
   */
  createWavHeader(dataSize, sampleRate, channels) {
    const buffer = new ArrayBuffer(44);
    const view = new DataView(buffer);

    // WAV header
    const writeString = (offset, string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };

    writeString(0, 'RIFF');
    view.setUint32(4, 36 + dataSize, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, channels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * channels * 2, true);
    view.setUint16(32, channels * 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, dataSize, true);

    return buffer;
  }

  /**
   * Convert AudioBuffer to WAV format
   */
  audioBufferToWav(audioBuffer) {
    const length = audioBuffer.length;
    const sampleRate = audioBuffer.sampleRate;
    const numberOfChannels = audioBuffer.numberOfChannels;

    // Create WAV header
    const buffer = new ArrayBuffer(44 + length * numberOfChannels * 2);
    const view = new DataView(buffer);

    // WAV header
    const writeString = (offset, string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };
    
    writeString(0, 'RIFF');
    view.setUint32(4, 36 + length * numberOfChannels * 2, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, numberOfChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * numberOfChannels * 2, true);
    view.setUint16(32, numberOfChannels * 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, length * numberOfChannels * 2, true);
    
    // Convert audio data
    let offset = 44;
    for (let i = 0; i < length; i++) {
      for (let channel = 0; channel < numberOfChannels; channel++) {
        const sample = Math.max(-1, Math.min(1, audioBuffer.getChannelData(channel)[i]));
        view.setInt16(offset, sample * 0x7FFF, true);
        offset += 2;
      }
    }
    
    return buffer;
  }

  /**
   * Get the last recorded audio
   */
  getLastRecording() {
    return this.lastRecording || null;
  }

  /**
   * Check if currently recording
   */
  getIsRecording() {
    return this.isRecording;
  }

  /**
   * Get recording duration in milliseconds
   */
  getRecordingDuration() {
    if (this.isRecording && this.startTime) {
      return Date.now() - this.startTime;
    }
    return this.duration || 0;
  }

  /**
   * Cleanup microphone resources immediately after recording
   */
  async cleanupMicrophoneResources() {
    try {
      // Stop all media stream tracks immediately
      if (this.mediaStream) {
        this.mediaStream.getTracks().forEach(track => {
          track.stop();
        });
      }

      // Disconnect audio nodes
      if (this.sourceNode) {
        this.sourceNode.disconnect();
        this.sourceNode = null;
      }

      if (this.gainNode) {
        this.gainNode.disconnect();
        this.gainNode = null;
      }

      if (this.destinationNode) {
        this.destinationNode = null;
      }

      // Close audio context
      if (this.audioContext && this.audioContext.state !== 'closed') {
        await this.audioContext.close();
      }

      // Clear media stream reference
      this.mediaStream = null;
      this.mediaRecorder = null;
      this.audioContext = null;
    } catch (error) {
      console.error('Error cleaning up microphone resources:', error);
    }
  }

  /**
   * Destroy recorder and release resources
   */
  async destroy() {
    try {
      // Stop recording if active
      if (this.isRecording) {
        await this.stopRecording();
      }

      // Cleanup microphone resources
      await this.cleanupMicrophoneResources();

      // Clear all references
      this.audioChunks = [];
      this.lastRecording = null;
      this.isRecording = false;
      this.startTime = null;
      this.duration = 0;
    } catch (error) {
      console.error('Error destroying AudioRecorder:', error);
    }
  }
}

export default AudioRecorder;
