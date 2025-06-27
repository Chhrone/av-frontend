/**
 * PlaybackView - UI component for audio playback controls
 */
class PlaybackView {
  constructor(useGreenPlayer = false) {
    this.useGreenPlayer = useGreenPlayer;
    this.container = null;
    this.playButton = null;
    this.progressBar = null;
    this.progressFill = null;
    this.progressPin = null;
    this.timeDisplay = null;
    this.volumeSlider = null;
    this.volumePin = null;
    this.volumeControls = null;
    this.volumeBtn = null;
    this.fileInfo = null;
    this.audioElement = null;

    this.onPlayPause = null;
    this.onSeek = null;
    this.onVolumeChange = null;

    // Volume control state
    this.volumeControlsVisible = false;
  }

  /**
   * Render the playback view
   */
  render() {
    this.container = document.createElement('div');

    if (this.useGreenPlayer) {
      this.container.className = 'audio green-audio-player';
      this.container.innerHTML = this.renderGreenPlayer();
    } else {
      this.container.className = 'playback-container';
      this.container.innerHTML = this.renderDefaultPlayer();
    }

    this.setupElements();
    this.setupEventListeners();

    return this.container;
  }

  /**
   * Render the green audio player design
   */
  renderGreenPlayer() {
    return `
      <div class="play-pause-btn" id="play-pause-btn">
        <svg viewBox="0 0 18 24" height="24" width="18" xmlns="http://www.w3.org/2000/svg">
          <path id="playPause" class="play-pause-icon" d="M18 12L0 24V0" fill-rule="evenodd" fill="#566574"></path>
        </svg>
      </div>

      <div class="controls">
        <span class="current-time">0:00</span>
        <div data-direction="horizontal" class="slider" id="progress-track">
          <div class="progress" id="progress-fill">
            <div data-method="rewind" id="progress-pin" class="pin"></div>
          </div>
        </div>
        <span class="total-time">0:00</span>
      </div>

      <div class="volume">
        <div class="volume-btn" id="volume-btn">
          <svg viewBox="0 0 24 24" height="24" width="24" xmlns="http://www.w3.org/2000/svg">
            <path id="speaker" d="M14.667 0v2.747c3.853 1.146 6.666 4.72 6.666 8.946 0 4.227-2.813 7.787-6.666 8.934v2.76C20 22.173 24 17.4 24 11.693 24 5.987 20 1.213 14.667 0zM18 11.693c0-2.36-1.333-4.386-3.333-5.373v10.707c2-.947 3.333-2.987 3.333-5.334zm-18-4v8h5.333L12 22.36V1.027L5.333 7.693H0z" fill-rule="evenodd" fill="#566574"></path>
          </svg>
        </div>
        <div class="volume-controls hidden" id="volume-controls">
          <div data-direction="vertical" class="slider">
            <div class="progress" id="volume-progress">
              <div data-method="changeVolume" id="volume-pin" class="pin"></div>
            </div>
          </div>
        </div>
      </div>

      <audio crossorigin="" id="audio-element"></audio>
    `;
  }

  /**
   * Render the default player design
   */
  renderDefaultPlayer() {
    return `
      <div class="playback-controls">
        <div class="playback-main">
          <button class="playback-btn play-pause-btn" id="play-pause-btn">
            <span class="play-icon">▶</span>
            <span class="pause-icon" style="display: none;">⏸</span>
          </button>

          <div class="playback-progress">
            <div class="progress-track" id="progress-track">
              <div class="progress-fill" id="progress-fill"></div>
              <div class="progress-handle" id="progress-handle"></div>
            </div>
            <div class="time-display" id="time-display">
              <span class="current-time">0:00</span>
              <span class="duration">0:00</span>
            </div>
          </div>
        </div>

        <div class="playback-secondary">
          <div class="volume-control">
            <span class="volume-icon">🔊</span>
            <input type="range" class="volume-slider" id="volume-slider"
                   min="0" max="100" value="100">
          </div>

          <div class="file-info" id="file-info">
            <span class="filename">recording.wav</span>
            <span class="filesize">0 KB</span>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Setup element references
   */
  setupElements() {
    this.playButton = this.container.querySelector('#play-pause-btn');
    this.progressBar = this.container.querySelector('#progress-track');
    this.progressFill = this.container.querySelector('#progress-fill');
    this.progressPin = this.container.querySelector('#progress-pin');
    this.audioElement = this.container.querySelector('#audio-element');

    if (this.useGreenPlayer) {
      this.volumeBtn = this.container.querySelector('#volume-btn');
      this.volumeControls = this.container.querySelector('#volume-controls');
      this.volumePin = this.container.querySelector('#volume-pin');
      this.timeDisplay = this.container.querySelector('.controls');
    } else {
      this.progressHandle = this.container.querySelector('#progress-handle');
      this.timeDisplay = this.container.querySelector('#time-display');
      this.volumeSlider = this.container.querySelector('#volume-slider');
      this.fileInfo = this.container.querySelector('#file-info');
    }
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Play/Pause button
    this.playButton.addEventListener('click', () => {
      if (this.onPlayPause) {
        this.onPlayPause();
      }
    });

    // Progress bar seeking
    this.progressBar.addEventListener('click', (e) => {
      const rect = this.progressBar.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const percentage = clickX / rect.width;

      if (this.onSeek) {
        this.onSeek(percentage);
      }
    });

    if (this.useGreenPlayer) {
      this.setupGreenPlayerEvents();
    } else {
      this.setupDefaultPlayerEvents();
    }
  }

  /**
   * Setup events for green player
   */
  setupGreenPlayerEvents() {
    // Volume button toggle
    if (this.volumeBtn) {
      this.volumeBtn.addEventListener('click', () => {
        this.toggleVolumeControls();
      });
    }

    // Volume control
    if (this.volumeControls) {
      const volumeSlider = this.volumeControls.querySelector('.slider');
      if (volumeSlider) {
        volumeSlider.addEventListener('click', (e) => {
          const rect = volumeSlider.getBoundingClientRect();
          const clickY = e.clientY - rect.top;
          const percentage = 1 - (clickY / rect.height); // Inverted for vertical slider

          if (this.onVolumeChange) {
            this.onVolumeChange(Math.max(0, Math.min(1, percentage)));
          }
        });
      }
    }

    // Progress pin dragging
    if (this.progressPin) {
      this.setupPinDragging(this.progressPin, this.progressBar, 'horizontal', (percentage) => {
        if (this.onSeek) {
          this.onSeek(percentage);
        }
      });
    }

    // Volume pin dragging
    if (this.volumePin) {
      const volumeSlider = this.volumeControls?.querySelector('.slider');
      if (volumeSlider) {
        this.setupPinDragging(this.volumePin, volumeSlider, 'vertical', (percentage) => {
          if (this.onVolumeChange) {
            this.onVolumeChange(1 - percentage); // Inverted for vertical slider
          }
        });
      }
    }
  }

  /**
   * Setup events for default player
   */
  setupDefaultPlayerEvents() {
    // Volume control
    if (this.volumeSlider) {
      this.volumeSlider.addEventListener('input', (e) => {
        const volume = e.target.value / 100;
        if (this.onVolumeChange) {
          this.onVolumeChange(volume);
        }
      });
    }
  }

  /**
   * Toggle volume controls visibility (green player)
   */
  toggleVolumeControls() {
    if (!this.volumeControls) return;

    this.volumeControlsVisible = !this.volumeControlsVisible;

    if (this.volumeControlsVisible) {
      this.volumeControls.classList.remove('hidden');
      this.volumeBtn.classList.add('open');
    } else {
      this.volumeControls.classList.add('hidden');
      this.volumeBtn.classList.remove('open');
    }
  }

  /**
   * Setup pin dragging functionality
   */
  setupPinDragging(pin, slider, direction, onUpdate) {
    let isDragging = false;

    const startDrag = (e) => {
      isDragging = true;
      e.preventDefault();
    };

    const drag = (e) => {
      if (!isDragging) return;

      const rect = slider.getBoundingClientRect();
      let percentage;

      if (direction === 'horizontal') {
        const x = e.clientX - rect.left;
        percentage = Math.max(0, Math.min(1, x / rect.width));
      } else {
        const y = e.clientY - rect.top;
        percentage = Math.max(0, Math.min(1, y / rect.height));
      }

      onUpdate(percentage);
    };

    const stopDrag = () => {
      isDragging = false;
    };

    pin.addEventListener('mousedown', startDrag);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDrag);
  }

  /**
   * Update playback state
   */
  updatePlaybackState(isPlaying) {
    if (this.useGreenPlayer) {
      const playPauseIcon = this.playButton.querySelector('#playPause');
      if (playPauseIcon) {
        if (isPlaying) {
          // Pause icon (two rectangles)
          playPauseIcon.setAttribute('d', 'M0 0h6v24H0zM12 0h6v24h-6z');
        } else {
          // Play icon (triangle)
          playPauseIcon.setAttribute('d', 'M18 12L0 24V0');
        }
      }
    } else {
      const playIcon = this.playButton.querySelector('.play-icon');
      const pauseIcon = this.playButton.querySelector('.pause-icon');

      if (isPlaying) {
        playIcon.style.display = 'none';
        pauseIcon.style.display = 'inline';
        this.playButton.classList.add('playing');
      } else {
        playIcon.style.display = 'inline';
        pauseIcon.style.display = 'none';
        this.playButton.classList.remove('playing');
      }
    }
  }

  /**
   * Update progress
   */
  updateProgress(currentTime, duration) {
    if (duration > 0) {
      const percentage = (currentTime / duration) * 100;
      this.progressFill.style.width = `${percentage}%`;

      if (this.useGreenPlayer) {
        if (this.progressPin) {
          this.progressPin.style.right = `-8px`;
        }
      } else {
        if (this.progressHandle) {
          this.progressHandle.style.left = `${percentage}%`;
        }
      }
    }

    // Update time display
    if (this.useGreenPlayer) {
      const currentTimeEl = this.timeDisplay.querySelector('.current-time');
      const durationEl = this.timeDisplay.querySelector('.total-time');

      if (currentTimeEl) currentTimeEl.textContent = this.formatTime(currentTime);
      if (durationEl) durationEl.textContent = this.formatTime(duration);
    } else {
      const currentTimeEl = this.timeDisplay.querySelector('.current-time');
      const durationEl = this.timeDisplay.querySelector('.duration');

      if (currentTimeEl) currentTimeEl.textContent = this.formatTime(currentTime);
      if (durationEl) durationEl.textContent = this.formatTime(duration);
    }
  }

  /**
   * Update file info
   */
  updateFileInfo(filename, sizeKB) {
    if (!this.useGreenPlayer && this.fileInfo) {
      const filenameEl = this.fileInfo.querySelector('.filename');
      const filesizeEl = this.fileInfo.querySelector('.filesize');

      if (filenameEl) filenameEl.textContent = filename;
      if (filesizeEl) filesizeEl.textContent = `${sizeKB} KB`;
    }
  }

  /**
   * Update volume display
   */
  updateVolume(volume) {
    if (this.useGreenPlayer) {
      if (this.volumePin && this.volumeControls) {
        const volumeProgress = this.volumeControls.querySelector('.progress');
        if (volumeProgress) {
          const percentage = volume * 100;
          volumeProgress.style.height = `${percentage}%`;
          // Position pin at the top of the progress bar
          this.volumePin.style.top = `${100 - percentage}%`;
        }
      }
    } else {
      if (this.volumeSlider) {
        this.volumeSlider.value = volume * 100;
      }
    }
  }

  /**
   * Set loading state
   */
  setLoading(isLoading) {
    if (isLoading) {
      this.playButton.disabled = true;
      this.playButton.classList.add('loading');
    } else {
      this.playButton.disabled = false;
      this.playButton.classList.remove('loading');
    }
  }

  /**
   * Format time in MM:SS
   */
  formatTime(seconds) {
    if (!seconds || isNaN(seconds)) return '0:00';
    
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }

  /**
   * Set event handlers
   */
  setEventHandlers(handlers) {
    this.onPlayPause = handlers.onPlayPause;
    this.onSeek = handlers.onSeek;
    this.onVolumeChange = handlers.onVolumeChange;
  }

  /**
   * Cleanup
   */
  destroy() {
    // Hide volume controls if visible
    if (this.volumeControlsVisible) {
      this.toggleVolumeControls();
    }

    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }

    // Clear all references
    this.container = null;
    this.playButton = null;
    this.progressBar = null;
    this.progressFill = null;
    this.progressPin = null;
    this.timeDisplay = null;
    this.volumeSlider = null;
    this.volumePin = null;
    this.volumeControls = null;
    this.volumeBtn = null;
    this.fileInfo = null;
    this.audioElement = null;
  }
}

export default PlaybackView;
