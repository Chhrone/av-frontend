class AudioRecorder {
  constructor() {
    this.mediaStream = null;
    this.audioContext = null;
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.isRecording = false;
    this.startTime = null;
    this.duration = 0;

    this.sourceNode = null;
    this.gainNode = null;
    this.destinationNode = null;
  }

  async initialize() {
    try {
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

      this.audioContext = new (window.AudioContext || window.webkitAudioContext)({
        sampleRate: 16000
      });

      this.sourceNode = this.audioContext.createMediaStreamSource(this.mediaStream);
      this.gainNode = this.audioContext.createGain();
      this.destinationNode = this.audioContext.createMediaStreamDestination();

      this.sourceNode.connect(this.gainNode);
      this.gainNode.connect(this.destinationNode);

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
      this.mediaRecorder.start(100);
      this.isRecording = true;

      return true;
    } catch (error) {
      console.error('Failed to start recording:', error);
      throw error;
    }
  }

  async stopRecording() {
    if (!this.isRecording) {
      return null;
    }

    try {
      this.mediaRecorder.stop();
      this.isRecording = false;
      this.duration = Date.now() - this.startTime;

      return new Promise((resolve) => {
        const originalOnStop = this.mediaRecorder.onstop;
        this.mediaRecorder.onstop = async (event) => {
          await originalOnStop(event);
          await this.cleanupMicrophoneResources();
          resolve(this.getLastRecording());
        };
      });
    } catch (error) {
      console.error('Failed to stop recording:', error);
      throw error;
    }
  }

  async processRecording() {
    if (this.audioChunks.length === 0) {
      return;
    }

    try {
      const recordedMimeType = this.mediaRecorder.mimeType;
      const audioBlob = new Blob(this.audioChunks, { type: recordedMimeType });

      let finalBlob;

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

  getLastRecording() {
    return this.lastRecording || null;
  }

  getIsRecording() {
    return this.isRecording;
  }

  getRecordingDuration() {
    if (this.isRecording && this.startTime) {
      return Date.now() - this.startTime;
    }
    return this.duration || 0;
  }

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
