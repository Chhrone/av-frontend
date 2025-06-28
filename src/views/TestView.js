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

    this.setupCleanupListeners();
    this.checkRecordingState();

    return this.container;
  }

  setupCleanupListeners() {
    window.addEventListener('beforeunload', this.handlePageUnload.bind(this));
    window.addEventListener('hashchange', this.handleNavigation.bind(this));
    document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
  }

  handlePageUnload() {
    RecordingManager.forceStop();
  }

  handleNavigation() {
    const currentHash = window.location.hash;
    if (currentHash !== '#/test' && this.isRecording) {
      RecordingManager.forceStop();
    }
  }

  handleVisibilityChange() {
    if (document.hidden && this.isRecording) {
      RecordingManager.forceStop();
    }
  }

  checkRecordingState() {
    const state = RecordingManager.getRecordingState();

    if (state.isRecording && state.recordingStartedFromWelcome) {
      this.startRecordingUI();
    } else {
      this.showLoadingState();
    }
  }

  showLoadingState() {
    this.floatingMic.classList.add('loading');
    this.floatingMic.disabled = true;

    const checkInitialization = () => {
      const state = RecordingManager.getRecordingState();
      if (state.isRecording) {
        this.hideLoadingState();
        this.startRecordingUI();
      } else {
        setTimeout(checkInitialization, 100);
      }
    };

    setTimeout(checkInitialization, 100);

    setTimeout(() => {
      this.hideLoadingState();
    }, 5000);
  }

  hideLoadingState() {
    this.floatingMic.classList.remove('loading');
    this.floatingMic.disabled = false;
  }

  async handleMicrophoneClick() {
    try {
      if (this.isRecording) {
        await this.stopRecording();
      } else {
        await RecordingManager.startRecordingFromWelcome();
        this.startRecordingUI();
      }
    } catch (error) {
      console.error('Error handling microphone click:', error);
    }
  }

  startRecordingUI() {
    this.isRecording = true;
    this.floatingMic.classList.add('recording');
    this.durationDisplay.style.display = 'block';
    this.startTimer();
  }

  async stopRecording() {
    try {
      const savedRecording = await RecordingManager.stopRecording({
        name: 'Speech Test Recording',
        category: 'speech-test'
      });

      this.showProcessingUI();
      await AccentDetectionService.processRecordingAndShowResult(savedRecording);

    } catch (error) {
      console.error('Failed to stop recording:', error);
      this.stopRecordingUI();
    }
  }

  showProcessingUI() {
    this.isRecording = false;
    this.floatingMic.classList.remove('recording');
    this.floatingMic.classList.add('processing');

    this.floatingMic.innerHTML = `
      <div class="processing-spinner"></div>
    `;

    this.durationDisplay.style.display = 'none';
    this.stopTimer();
  }

  stopRecordingUI() {
    this.isRecording = false;
    this.floatingMic.classList.remove('recording');
    this.durationDisplay.style.display = 'none';
    this.stopTimer();
  }

  startTimer() {
    this.recordingTimer = setInterval(() => {
      const duration = RecordingManager.getCurrentDuration();
      this.updateDurationDisplay(duration);
    }, 100);
  }

  stopTimer() {
    if (this.recordingTimer) {
      clearInterval(this.recordingTimer);
      this.recordingTimer = null;
    }
  }

  updateDurationDisplay(duration) {
    const seconds = Math.floor(duration / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    const formattedTime = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    this.durationDisplay.textContent = formattedTime;
  }

  destroy() {
    if (this.isRecording) {
      RecordingManager.forceStop();
    }

    this.stopTimer();

    window.removeEventListener('beforeunload', this.handlePageUnload.bind(this));
    window.removeEventListener('hashchange', this.handleNavigation.bind(this));
    document.removeEventListener('visibilitychange', this.handleVisibilityChange.bind(this));

    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }

    if (this.floatingMic && this.floatingMic.parentNode) {
      this.floatingMic.parentNode.removeChild(this.floatingMic);
    }
  }
}

export default TestView;
