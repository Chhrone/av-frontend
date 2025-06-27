import PlaybackPresenter from '../presenters/PlaybackPresenter.js';

/**
 * PlaybackController - Singleton controller for managing audio playback instances
 * Ensures only one audio playback is active at a time across the application
 */
class PlaybackController {
  constructor() {
    this.activePlayback = null;
    this.instances = new Map();
    this.instanceCounter = 0;
  }

  /**
   * Create a new playback instance
   */
  createInstance(audioBlob, filename = 'recording.wav', useGreenPlayer = false) {
    const instanceId = `playback_${++this.instanceCounter}`;

    console.log(`🎵 Creating playback instance: ${instanceId} (Green Player: ${useGreenPlayer})`);

    // Stop any currently active playback
    this.stopActivePlayback();

    // Create new presenter with green player option
    const presenter = new PlaybackPresenter(useGreenPlayer);

    // Store instance
    this.instances.set(instanceId, {
      presenter,
      audioBlob,
      filename,
      isActive: false,
      useGreenPlayer
    });

    // Load audio
    presenter.loadAudio(audioBlob, filename).then(success => {
      if (success) {
        this.setActivePlayback(instanceId);
        console.log(`✅ Playback instance ${instanceId} loaded successfully`);
      } else {
        console.error(`❌ Failed to load playback instance ${instanceId}`);
        this.destroyInstance(instanceId);
      }
    });

    return {
      instanceId,
      presenter,
      getView: () => presenter.getView()
    };
  }

  /**
   * Set active playback instance
   */
  setActivePlayback(instanceId) {
    // Deactivate current active playback
    if (this.activePlayback && this.instances.has(this.activePlayback)) {
      const currentInstance = this.instances.get(this.activePlayback);
      currentInstance.isActive = false;
      // Pause current playback without destroying
      if (currentInstance.presenter.model.isPlaying) {
        currentInstance.presenter.togglePlayPause();
      }
    }
    
    // Set new active playback
    if (this.instances.has(instanceId)) {
      this.activePlayback = instanceId;
      this.instances.get(instanceId).isActive = true;
      console.log(`🎯 Active playback set to: ${instanceId}`);
    }
  }

  /**
   * Stop currently active playback
   */
  stopActivePlayback() {
    if (this.activePlayback && this.instances.has(this.activePlayback)) {
      const instance = this.instances.get(this.activePlayback);
      if (instance.presenter.model.isPlaying) {
        instance.presenter.togglePlayPause();
      }
      console.log(`⏹ Stopped active playback: ${this.activePlayback}`);
    }
  }

  /**
   * Pause all playback instances
   */
  pauseAll() {
    console.log('⏸ Pausing all playback instances');
    this.instances.forEach((instance, instanceId) => {
      if (instance.presenter.model.isPlaying) {
        instance.presenter.togglePlayPause();
        console.log(`⏸ Paused instance: ${instanceId}`);
      }
    });
  }

  /**
   * Get active playback instance
   */
  getActivePlayback() {
    if (this.activePlayback && this.instances.has(this.activePlayback)) {
      return this.instances.get(this.activePlayback);
    }
    return null;
  }

  /**
   * Get instance by ID
   */
  getInstance(instanceId) {
    return this.instances.get(instanceId) || null;
  }

  /**
   * Destroy specific instance
   */
  destroyInstance(instanceId) {
    if (this.instances.has(instanceId)) {
      const instance = this.instances.get(instanceId);
      
      console.log(`🗑️ Destroying playback instance: ${instanceId}`);
      
      // Clean up presenter
      instance.presenter.destroy();
      
      // Remove from instances
      this.instances.delete(instanceId);
      
      // Clear active playback if this was the active one
      if (this.activePlayback === instanceId) {
        this.activePlayback = null;
      }
      
      console.log(`✅ Instance ${instanceId} destroyed`);
    }
  }

  /**
   * Destroy all instances
   */
  destroyAll() {
    console.log('🧹 Destroying all playback instances');
    
    const instanceIds = Array.from(this.instances.keys());
    instanceIds.forEach(instanceId => {
      this.destroyInstance(instanceId);
    });
    
    this.activePlayback = null;
    console.log('✅ All playback instances destroyed');
  }

  /**
   * Get total number of instances
   */
  getInstanceCount() {
    return this.instances.size;
  }

  /**
   * Get list of all instance IDs
   */
  getInstanceIds() {
    return Array.from(this.instances.keys());
  }

  /**
   * Check if any instance is currently playing
   */
  isAnyPlaying() {
    for (const instance of this.instances.values()) {
      if (instance.presenter.model.isPlaying) {
        return true;
      }
    }
    return false;
  }

  /**
   * Get debug info
   */
  getDebugInfo() {
    return {
      activePlayback: this.activePlayback,
      totalInstances: this.instances.size,
      instanceIds: this.getInstanceIds(),
      isAnyPlaying: this.isAnyPlaying()
    };
  }
}

// Create singleton instance
const playbackController = new PlaybackController();

export default playbackController;
