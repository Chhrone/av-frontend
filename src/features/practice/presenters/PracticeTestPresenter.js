import PracticeTestView from '../views/PracticeTestView.js';
import recordingManager from '../../../utils/RecordingManager.js';
import accentDetectionService from '../../../utils/AccentDetectionService.js';
import { appRouter } from '../../../utils/appRouter.js';

class PracticeTestPresenter {
  constructor(model, categoryId, practiceId) {
    this.model = model;
    this.categoryId = this.normalizeCategoryId(categoryId);
    this.practiceId = practiceId;
    this.view = new PracticeTestView();
    this.recordingManager = recordingManager;
    this.isRecording = false;
    this.recordingInterval = null;
    this.recordingStartTime = null;
    this.sessionRecordings = [];
    this.sessionScores = [];
    this.maxSession = 4;
  }

  normalizeCategoryId(categoryId) {
    // Mapping dari url ke key data model
    const map = {
      'vokal': 'vokal-inventory',
      'konsonan': 'konsonan-inventory',
      'penekanan': 'penekanan-kata',
      'skenario': 'skenario-dunia-nyata',
      'struktur': 'struktur-suku-kata',
      'irama': 'irama-bahasa',
    };
    return map[categoryId] || categoryId;
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
          // Tampilkan state processing pada tombol
          this.view.setRecordingState(false, true);
          const recording = await this.recordingManager.stopRecording();
          console.log('Recording stopped');
          if (recording && recording.audioBlob) {
            // Kirim ke AccentDetectionService
            const result = await accentDetectionService.analyzeAccent(recording.audioBlob);
            const score = result && typeof result.us_confidence === 'number' ? result.us_confidence : null;
            this.sessionRecordings.push(recording);
            this.sessionScores.push(score);
            // Simpan ke model
            this.model.savePracticeRecording(this.categoryId, this.practiceId, recording, score);

            // Simpan hasil ke localStorage sebelum navigasi ke halaman result
            localStorage.setItem('practiceResult', JSON.stringify(result));
            // Navigasi ke route result
            appRouter.navigate(`/practice/${this.categoryId}/${this.practiceId}/result`);

            // Jika sudah 4 rekaman, hitung rata-rata dan simpan hasil sesi
            if (this.sessionRecordings.length >= this.maxSession) {
              const avgScore = this.sessionScores.reduce((a, b) => a + b, 0) / this.sessionScores.length;
              this.model.savePracticeSession(this.categoryId, this.practiceId, this.sessionRecordings, this.sessionScores, avgScore);
              // Reset sesi
              this.sessionRecordings = [];
              this.sessionScores = [];
            }
          }
        } catch (error) {
          console.error('Error stopping recording:', error);
          alert('Terjadi kesalahan saat menghentikan perekaman.');
        } finally {
          // Kembalikan tombol ke state normal
          this.view.setRecordingState(false, false);
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
