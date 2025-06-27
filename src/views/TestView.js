import RecordingManager from '../utils/RecordingManager.js';
import AccentDetectionService from '../utils/AccentDetectionService.js';

// SVG microphone icon as string
const microphoneIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
  <path d="M19 10v2a7 7 0 0 1-14 0v-2a1 1 0 0 1 2 0v2a5 5 0 0 0 10 0v-2a1 1 0 0 1 2 0z"/>
  <path d="M12 19a1 1 0 0 1 1 1v1a1 1 0 0 1-2 0v-1a1 1 0 0 1 1-1z"/>
</svg>`;

class TestView {
  constructor() {
    this.container = null;
    this.floatingMic = null;
    this.isRecording = false;
    this.recordingTimer = null;
    this.durationDisplay = null;
  }

  render() {
    this.container = document.createElement('div');
    this.container.className = 'container';



    const testText = document.createElement('p');
    testText.textContent = 'I went to the store to buy some groceries. The store was busy, and there was a long line at the checkout. I still managed to get everything I needed before going home.';
    testText.className = 'test-text';

    this.floatingMic = document.createElement('button');
    this.floatingMic.innerHTML = microphoneIcon;
    this.floatingMic.className = 'floating-microphone';
    this.floatingMic.style.viewTransitionName = 'microphone-button';

    const svgIcon = this.floatingMic.querySelector('svg');
    if (svgIcon) {
      svgIcon.setAttribute('class', 'microphone-icon');
    }

    // Create duration display
    this.durationDisplay = document.createElement('div');
    this.durationDisplay.className = 'recording-duration';
    this.durationDisplay.style.display = 'none';
    this.durationDisplay.textContent = '00:00';

    this.floatingMic.addEventListener('click', () => {
      this.handleMicrophoneClick();
    });

    this.container.appendChild(testText);
    this.container.appendChild(this.durationDisplay);
    document.body.appendChild(this.floatingMic);

    // Setup cleanup listeners for navigation/reload
    this.setupCleanupListeners();

    // Check if recording is already active from welcome page
    this.checkRecordingState();

    return this.container;
  }

  /**
   * Setup cleanup listeners for navigation and page reload
   */
  setupCleanupListeners() {
    // Cleanup on page unload/reload
    window.addEventListener('beforeunload', this.handlePageUnload.bind(this));

    // Cleanup on hash change (navigation)
    window.addEventListener('hashchange', this.handleNavigation.bind(this));

    // Cleanup on visibility change (tab switch)
    document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
  }

  /**
   * Handle page unload/reload
   */
  handlePageUnload(event) {
    RecordingManager.forceStop();
  }

  /**
   * Handle navigation away from test page
   */
  handleNavigation(event) {
    const currentHash = window.location.hash;
    if (currentHash !== '#/test' && this.isRecording) {
      console.log('🎤 Navigating away from test page, cleaning up recording...');
      RecordingManager.forceStop();
    }
  }

  /**
   * Handle tab visibility change
   */
  handleVisibilityChange() {
    if (document.hidden && this.isRecording) {
      console.log('🎤 Tab hidden, cleaning up recording...');
      RecordingManager.forceStop();
    }
  }

  /**
   * Check current recording state and update UI
   */
  checkRecordingState() {
    const state = RecordingManager.getRecordingState();

    if (state.isRecording && state.recordingStartedFromWelcome) {
      this.startRecordingUI();
    } else {
      // Show loading state while recording initializes
      this.showLoadingState();
    }
  }

  /**
   * Show loading state while recording initializes
   */
  showLoadingState() {
    this.floatingMic.classList.add('loading');
    this.floatingMic.disabled = true;

    // Listen for recording initialization
    const checkInitialization = () => {
      const state = RecordingManager.getRecordingState();
      if (state.isRecording) {
        this.hideLoadingState();
        this.startRecordingUI();
      } else {
        // Check again in 100ms
        setTimeout(checkInitialization, 100);
      }
    };

    // Start checking after a short delay
    setTimeout(checkInitialization, 100);

    // Timeout after 5 seconds
    setTimeout(() => {
      this.hideLoadingState();
    }, 5000);
  }

  /**
   * Hide loading state
   */
  hideLoadingState() {
    this.floatingMic.classList.remove('loading');
    this.floatingMic.disabled = false;
  }

  /**
   * Handle microphone button click
   */
  async handleMicrophoneClick() {
    try {
      if (this.isRecording) {
        await this.stopRecording();
      } else {
        // If not recording, start new recording
        await RecordingManager.startRecordingFromWelcome();
        this.startRecordingUI();
      }
    } catch (error) {
      console.error('Error handling microphone click:', error);
    }
  }

  /**
   * Start recording UI state
   */
  startRecordingUI() {
    this.isRecording = true;

    // Update microphone button appearance
    this.floatingMic.classList.add('recording');

    // Show duration display
    this.durationDisplay.style.display = 'block';

    // Start timer
    this.startTimer();
  }

  /**
   * Stop recording and save
   */
  async stopRecording() {
    try {
      // Stop recording
      const savedRecording = await RecordingManager.stopRecording({
        name: 'Speech Test Recording',
        category: 'speech-test'
      });

      // Update UI to show processing state
      this.showProcessingUI();

      // Process recording for accent detection and navigate to result
      await AccentDetectionService.processRecordingAndShowResult(savedRecording);

    } catch (error) {
      console.error('Failed to stop recording:', error);
      this.stopRecordingUI();
    }
  }

  /**
   * Show processing UI state
   */
  showProcessingUI() {
    this.isRecording = false;

    // Update microphone button appearance
    this.floatingMic.classList.remove('recording');
    this.floatingMic.classList.add('processing');

    // Update button content to show processing
    this.floatingMic.innerHTML = `
      <div class="processing-spinner"></div>
    `;

    // Hide duration display
    this.durationDisplay.style.display = 'none';

    // Stop timer
    this.stopTimer();

    console.log('🎤 Processing UI started');
  }

  /**
   * Stop recording UI state
   */
  stopRecordingUI() {
    this.isRecording = false;

    // Update microphone button appearance
    this.floatingMic.classList.remove('recording');

    // Hide duration display
    this.durationDisplay.style.display = 'none';

    // Stop timer
    this.stopTimer();

    console.log('🎤 Recording UI stopped');
  }

  /**
   * Start recording timer
   */
  startTimer() {
    this.recordingTimer = setInterval(() => {
      const duration = RecordingManager.getCurrentDuration();
      this.updateDurationDisplay(duration);
    }, 100);
  }

  /**
   * Stop recording timer
   */
  stopTimer() {
    if (this.recordingTimer) {
      clearInterval(this.recordingTimer);
      this.recordingTimer = null;
    }
  }

  /**
   * Update duration display
   */
  updateDurationDisplay(duration) {
    const seconds = Math.floor(duration / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    const formattedTime = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    this.durationDisplay.textContent = formattedTime;
  }



  destroy() {
    // Stop any active recording
    if (this.isRecording) {
      RecordingManager.forceStop();
    }

    // Clean up timer
    this.stopTimer();

    // Remove event listeners
    window.removeEventListener('beforeunload', this.handlePageUnload.bind(this));
    window.removeEventListener('hashchange', this.handleNavigation.bind(this));
    document.removeEventListener('visibilitychange', this.handleVisibilityChange.bind(this));

    // Remove elements
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }

    if (this.floatingMic && this.floatingMic.parentNode) {
      this.floatingMic.parentNode.removeChild(this.floatingMic);
    }
  }
}

export default TestView;
