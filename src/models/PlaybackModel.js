/**
 * PlaybackModel - Manages audio playback state and data
 */
class PlaybackModel {
  constructor() {
    this.audioBlob = null;
    this.audioURL = null;
    this.filename = null;
    this.duration = null;
    this.isPlaying = false;
    this.currentTime = 0;
    this.volume = 1.0;
    this.isLoaded = false;
  }

  /**
   * Set audio data
   */
  setAudioData(audioBlob, filename = 'recording.wav') {
    this.audioBlob = audioBlob;
    this.filename = filename;
    
    // Create URL for audio
    if (this.audioURL) {
      URL.revokeObjectURL(this.audioURL);
    }
    this.audioURL = URL.createObjectURL(audioBlob);
    
    this.isLoaded = true;
    return this.audioURL;
  }

  /**
   * Update playback state
   */
  updatePlaybackState(isPlaying, currentTime = null) {
    this.isPlaying = isPlaying;
    if (currentTime !== null) {
      this.currentTime = currentTime;
    }
  }

  /**
   * Set duration
   */
  setDuration(duration) {
    this.duration = duration;
  }

  /**
   * Set volume
   */
  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
  }

  /**
   * Get formatted duration
   */
  getFormattedDuration() {
    if (!this.duration) return '--:--';
    
    const minutes = Math.floor(this.duration / 60);
    const seconds = Math.floor(this.duration % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  /**
   * Get formatted current time
   */
  getFormattedCurrentTime() {
    const minutes = Math.floor(this.currentTime / 60);
    const seconds = Math.floor(this.currentTime % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  /**
   * Get audio file size in KB
   */
  getFileSizeKB() {
    if (!this.audioBlob) return 0;
    return Math.round(this.audioBlob.size / 1024);
  }

  /**
   * Cleanup resources
   */
  cleanup() {
    if (this.audioURL) {
      URL.revokeObjectURL(this.audioURL);
      this.audioURL = null;
    }
    
    this.audioBlob = null;
    this.filename = null;
    this.duration = null;
    this.isPlaying = false;
    this.currentTime = 0;
    this.isLoaded = false;
  }
}

export default PlaybackModel;
