import PracticeView from '../views/PracticeView.js';
import recordingManager from '../../../utils/RecordingManager.js';

class PracticePresenter {
  constructor(model, categoryId, practiceId) {
    this.model = model;
    this.categoryId = categoryId;
    this.practiceId = practiceId;
    this.view = new PracticeView();
    this.recordingManager = recordingManager;
    this.isRecording = false;
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
      
      // Add keyboard accessibility
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
  
  // Clean up event listeners when the presenter is destroyed
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
        try {
          await this.recordingManager.startRecording();
          console.log('Recording started');
        } catch (error) {
          console.error('Error starting recording:', error);
          this.isRecording = false;
          this.view.setRecordingState(false);
          alert('Tidak dapat mengakses mikrofon. Pastikan Anda telah memberikan izin akses mikrofon.');
        }
      } else {
        try {
          const audioBlob = await this.recordingManager.stopRecording();
          console.log('Recording stopped');
          // Handle the recorded audio blob, e.g., send to server
          // You can implement the upload logic here
          // await this.uploadRecording(audioBlob);
        } catch (error) {
          console.error('Error stopping recording:', error);
          alert('Terjadi kesalahan saat menghentikan perekaman.');
        }
      }
    } catch (error) {
      console.error('Error in toggleRecording:', error);
      this.isRecording = false;
      this.view.setRecordingState(false);
    }
  }
}

export default PracticePresenter;
