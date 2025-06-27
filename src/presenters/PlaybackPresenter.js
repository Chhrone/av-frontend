import { Howl } from 'howler';
import PlaybackModel from '../models/PlaybackModel.js';
import PlaybackView from '../views/PlaybackView.js';

/**
 * PlaybackPresenter - Manages audio playback using Howler.js
 */
class PlaybackPresenter {
  constructor(useGreenPlayer = false) {
    this.model = new PlaybackModel();
    this.view = new PlaybackView(useGreenPlayer);
    this.howl = null;
    this.updateInterval = null;

    this.setupEventHandlers();
  }

  /**
   * Setup event handlers
   */
  setupEventHandlers() {
    this.view.setEventHandlers({
      onPlayPause: () => this.togglePlayPause(),
      onSeek: (percentage) => this.seek(percentage),
      onVolumeChange: (volume) => this.setVolume(volume)
    });
  }

  /**
   * Load audio data
   */
  async loadAudio(audioBlob, filename = 'recording.wav') {
    try {
      this.view.setLoading(true);
      
      // Set audio data in model
      const audioURL = this.model.setAudioData(audioBlob, filename);
      
      // Cleanup previous Howl instance
      if (this.howl) {
        this.howl.unload();
      }

      // Create new Howl instance
      this.howl = new Howl({
        src: [audioURL],
        format: ['wav', 'webm', 'mp3'],
        onload: () => {
          console.log('🎵 Audio loaded successfully');
          this.model.setDuration(this.howl.duration());
          this.updateView();
          this.view.setLoading(false);
        },
        onloaderror: (id, error) => {
          console.error('❌ Audio load error:', error);
          this.view.setLoading(false);
        },
        onplay: () => {
          console.log('▶ Audio started playing');
          this.model.updatePlaybackState(true);
          this.view.updatePlaybackState(true);
          this.startProgressUpdate();
        },
        onpause: () => {
          console.log('⏸ Audio paused');
          this.model.updatePlaybackState(false);
          this.view.updatePlaybackState(false);
          this.stopProgressUpdate();
        },
        onstop: () => {
          console.log('⏹ Audio stopped');
          this.model.updatePlaybackState(false, 0);
          this.view.updatePlaybackState(false);
          this.view.updateProgress(0, this.model.duration);
          this.stopProgressUpdate();
        },
        onend: () => {
          console.log('🏁 Audio ended');
          this.model.updatePlaybackState(false, 0);
          this.view.updatePlaybackState(false);
          this.view.updateProgress(0, this.model.duration);
          this.stopProgressUpdate();
        }
      });

      return true;
    } catch (error) {
      console.error('Error loading audio:', error);
      this.view.setLoading(false);
      return false;
    }
  }

  /**
   * Toggle play/pause
   */
  togglePlayPause() {
    if (!this.howl) return;

    if (this.model.isPlaying) {
      this.howl.pause();
    } else {
      this.howl.play();
    }
  }

  /**
   * Seek to position
   */
  seek(percentage) {
    if (!this.howl || !this.model.duration) return;

    const seekTime = this.model.duration * percentage;
    this.howl.seek(seekTime);
    this.model.currentTime = seekTime;
    this.view.updateProgress(seekTime, this.model.duration);
  }

  /**
   * Set volume
   */
  setVolume(volume) {
    if (!this.howl) return;

    this.model.setVolume(volume);
    this.howl.volume(volume);
    this.view.updateVolume(volume);
  }

  /**
   * Start progress update interval
   */
  startProgressUpdate() {
    this.stopProgressUpdate(); // Clear any existing interval
    
    this.updateInterval = setInterval(() => {
      if (this.howl && this.model.isPlaying) {
        const currentTime = this.howl.seek();
        this.model.currentTime = currentTime;
        this.view.updateProgress(currentTime, this.model.duration);
      }
    }, 100); // Update every 100ms for smooth progress
  }

  /**
   * Stop progress update interval
   */
  stopProgressUpdate() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }

  /**
   * Update view with current model state
   */
  updateView() {
    this.view.updateFileInfo(this.model.filename, this.model.getFileSizeKB());
    this.view.updateProgress(this.model.currentTime, this.model.duration);
    this.view.updateVolume(this.model.volume);
    this.view.updatePlaybackState(this.model.isPlaying);
  }

  /**
   * Get the view element
   */
  getView() {
    return this.view.render();
  }

  /**
   * Cleanup resources
   */
  destroy() {
    console.log('🧹 Cleaning up PlaybackPresenter');
    
    this.stopProgressUpdate();
    
    if (this.howl) {
      this.howl.unload();
      this.howl = null;
    }
    
    this.model.cleanup();
    this.view.destroy();
  }
}

export default PlaybackPresenter;
