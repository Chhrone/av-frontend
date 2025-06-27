import RecordingManager from '../utils/RecordingManager.js';
import AccentDetectionService from '../utils/AccentDetectionService.js';
import MicrophoneIcon from '../assets/MicrophoneIcon.js';

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
    MicrophoneIcon.setInnerHTML(this.floatingMic, { className: 'microphone-icon' });
    this.floatingMic.className = 'floating-microphone';
    this.floatingMic.style.viewTransitionName = 'microphone-button';

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
  handlePageUnload() {
    RecordingManager.forceStop();
  }

  /**
   * Handle navigation away from test page
   */
  handleNavigation() {
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

    // Update button content to show processing spinner
    this.floatingMic.innerHTML = `
      <div class="processing-spinner"></div>
    `;

    // Hide duration display
    this.durationDisplay.style.display = 'none';

    // Stop timer
    this.stopTimer();
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
