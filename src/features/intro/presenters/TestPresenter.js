import TestView from '../views/TestView.js';
import RecordingManager from '../../../utils/RecordingManager.js';
import AccentDetectionService from '../../../utils/AccentDetectionService.js';

class TestPresenter {
  constructor(model) {
    this.view = null;
    this.model = model;
    this.isRecording = false;
    this.recordingTimer = null;
  }

  init() {
    const testText = this.model.getTestText();
    this.view = new TestView(testText);
    this.view.onMicClick = this.handleMicrophoneClick.bind(this);
    this.render();
  }

  render() {
    const appElement = document.getElementById('app');
    appElement.innerHTML = '';
    const viewElement = this.view.render();
    appElement.appendChild(viewElement);
    this.setupCleanupListeners();
    // Cek state recording, langsung update UI jika sudah recording
    const state = RecordingManager.getRecordingState();
    if (state.isRecording && state.recordingStartedFromWelcome) {
      this.startRecordingUI();
    }
  }

  setupCleanupListeners() {
    window.addEventListener('beforeunload', this.handlePageUnload.bind(this));
    window.addEventListener('hashchange', this.handleNavigation.bind(this));
    document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
  }

  removeCleanupListeners() {
    window.removeEventListener('beforeunload', this.handlePageUnload.bind(this));
    window.removeEventListener('hashchange', this.handleNavigation.bind(this));
    document.removeEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
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

  // checkRecordingState, showLoadingState, hideLoadingState dihapus karena tidak diperlukan lagi

  async handleMicrophoneClick() {
    try {
      if (this.isRecording) {
        // Klik kedua: stop recording, set processing, transisi ke result
        this.view.setMicProcessing(true);
        await this.stopRecording();
      }
      // Klik pertama: tidak perlu mulai recording lagi, sudah dimulai dari Welcome
    } catch (error) {
      this.view.setMicRecording(false);
      this.view.setMicProcessing(false);
      alert('Gagal memulai/menghentikan rekaman. Coba lagi.');
    }
  }

  startRecordingUI() {
    this.isRecording = true;
    this.view.setMicRecording(true);
    this.view.showDuration(true);
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
      this.stopRecordingUI();
    }
  }

  showProcessingUI() {
    this.isRecording = false;
    this.view.setMicRecording(false);
    this.view.setMicProcessing(true);
    this.view.showDuration(false);
    this.stopTimer();
  }

  stopRecordingUI() {
    this.isRecording = false;
    this.view.setMicRecording(false);
    this.view.setMicProcessing(false);
    this.view.showDuration(false);
    this.stopTimer();
  }

  startTimer() {
    this.recordingTimer = setInterval(() => {
      const duration = RecordingManager.getCurrentDuration();
      this.view.updateDurationDisplay(duration);
    }, 100);
  }

  stopTimer() {
    if (this.recordingTimer) {
      clearInterval(this.recordingTimer);
      this.recordingTimer = null;
    }
  }

  destroy() {
    if (this.view) {
      this.view.destroy();
      this.view = null;
    }
    this.stopTimer();
    this.removeCleanupListeners();
  }
}

export default TestPresenter;
