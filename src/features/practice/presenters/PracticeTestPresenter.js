import PracticeTestView from '../views/PracticeTestView.js';
import recordingManager from '../../../utils/RecordingManager.js';

class PracticeTestPresenter {
  constructor(model, categoryId, practiceId) {
    this.model = model;
    this.categoryId = categoryId;
    this.practiceId = practiceId;
    this.view = new PracticeTestView();
    this.recordingManager = recordingManager;
    this.isRecording = false;
    this.recordingInterval = null;
    this.recordingStartTime = null;
  }

  async init() {
    try {
      await this.recordingManager.initialize();
      const practiceText = await this.model.getPracticeText(this.categoryId, this.practiceId);
      if (practiceText) {
        this.view.render(practiceText);
        this.bindEvents();
      } else {
        this.view.render('Latihan tidak ditemukan.');
      }
    } catch (error) {
      console.error('Error initializing practice:', error);
      this.view.render('Terjadi kesalahan saat memuat latihan.');
    }
  }

  bindEvents() {
    const recordButton = this.view.getRecordButton();
    if (recordButton) {
      recordButton.addEventListener('click', () => this.toggleRecording());
      recordButton.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.toggleRecording();
        }
      });
    } else {
      console.error('Record button not found');
    }
  }

  destroy() {
    const recordButton = this.view.getRecordButton();
    if (recordButton) {
      recordButton.removeEventListener('click', () => this.toggleRecording());
    }
  }

  async toggleRecording() {
    try {
      this.isRecording = !this.isRecording;
      this.view.setRecordingState(this.isRecording);
      if (this.isRecording) {
        // Start timer
        this.recordingStartTime = Date.now();
        this.view.setRecordingDuration('00:00');
        this.recordingInterval = setInterval(() => {
          const elapsed = Math.floor((Date.now() - this.recordingStartTime) / 1000);
          const min = String(Math.floor(elapsed / 60)).padStart(2, '0');
          const sec = String(elapsed % 60).padStart(2, '0');
          this.view.setRecordingDuration(`${min}:${sec}`);
        }, 500);
        try {
          await this.recordingManager.startRecording();
          console.log('Recording started');
        } catch (error) {
          console.error('Error starting recording:', error);
          this.isRecording = false;
          this.view.setRecordingState(false);
          if (this.recordingInterval) clearInterval(this.recordingInterval);
          this.view.setRecordingDuration('00:00');
          alert('Tidak dapat mengakses mikrofon. Pastikan Anda telah memberikan izin akses mikrofon.');
        }
      } else {
        // Stop timer
        if (this.recordingInterval) clearInterval(this.recordingInterval);
        this.view.setRecordingDuration('00:00');
        try {
          const audioBlob = await this.recordingManager.stopRecording();
          console.log('Recording stopped');
          // Handle the recorded audio blob, e.g., send to server or pass to result presenter
        } catch (error) {
          console.error('Error stopping recording:', error);
          alert('Terjadi kesalahan saat menghentikan perekaman.');
        }
      }
    } catch (error) {
      console.error('Error in toggleRecording:', error);
      this.isRecording = false;
      this.view.setRecordingState(false);
      if (this.recordingInterval) clearInterval(this.recordingInterval);
      this.view.setRecordingDuration('00:00');
    }
  }
}

export default PracticeTestPresenter;
