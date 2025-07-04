import PracticeView from '../views/PracticeView.js';

class PracticePresenter {
  constructor(model) {
    this.model = model;
    this.view = new PracticeView();
    this.isRecording = false;
    this.recordingInterval = null;
    this.recordingStartTime = null;
    this.currentPracticeText = '';
    this.categoryId = null;
    this.practiceId = null;
  }

  async init(categoryId, practiceId) {
    this.categoryId = categoryId;
    this.practiceId = practiceId;
    this.model.resetSession();
    this.currentPracticeText = await this.model.getPracticeText(categoryId, practiceId);
    this.view.renderTest(this.currentPracticeText, 1, this.model.maxSession);
    this.bindTestEvents();
  }

  bindTestEvents() {
    const recordButton = this.view.getRecordButton();
    if (recordButton) {
      recordButton.onclick = () => this.toggleRecording();
    }
  }

  async toggleRecording() {
    this.isRecording = !this.isRecording;
    this.view.setRecordingState(this.isRecording);
    if (this.isRecording) {
      this.recordingStartTime = Date.now();
      this.view.setRecordingDuration('00:00');
      this.recordingInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - this.recordingStartTime) / 1000);
        const min = String(Math.floor(elapsed / 60)).padStart(2, '0');
        const sec = String(elapsed % 60).padStart(2, '0');
        this.view.setRecordingDuration(`${min}:${sec}`);
      }, 500);
      // Simulasi rekaman
      setTimeout(() => this.stopRecording({audioBlob: {}}), 2000); // Simulasi 2 detik
    } else {
      if (this.recordingInterval) clearInterval(this.recordingInterval);
      this.view.setRecordingDuration('00:00');
    }
  }

  async stopRecording(recording) {
    if (this.recordingInterval) clearInterval(this.recordingInterval);
    this.view.setRecordingDuration('00:00');
    this.isRecording = false;
    this.view.setRecordingState(false, true);
    // Simulasi skor
    const score = Math.random() * 100;
    this.model.savePracticeRecording(this.categoryId, this.practiceId, recording, score);
    const currentSession = this.model.sessionScores.length;
    if (currentSession >= this.model.maxSession) {
      // Selesai sesi, tampilkan hasil rata-rata
      const avgScore = this.model.sessionScores.reduce((a, b) => a + b, 0) / this.model.sessionScores.length;
      const motivationalDescription = this.model.getDescriptionByScore(avgScore);
      this.model.savePracticeSession(this.categoryId, this.practiceId, this.model.sessionRecordings, this.model.sessionScores, avgScore);
      this.view.renderResult({
        score: avgScore,
        motivationalDescription,
        isAverage: true,
        currentSession: this.model.maxSession,
        maxSession: this.model.maxSession
      });
      this.bindResultEvents();
      this.model.resetSession();
    } else {
      // Tampilkan hasil rekaman saat ini
      const motivationalDescription = this.model.getDescriptionByScore(score);
      this.view.renderResult({
        score,
        motivationalDescription,
        isAverage: false,
        currentSession,
        maxSession: this.model.maxSession
      });
      this.bindResultEvents();
    }
  }

  bindResultEvents() {
    const continueBtn = document.getElementById('practice-continue-btn');
    if (continueBtn) {
      continueBtn.onclick = () => {
        // Lanjut ke sesi berikutnya
        this.view.renderTest(this.currentPracticeText, this.model.sessionScores.length + 1, this.model.maxSession);
        this.bindTestEvents();
      };
    }
    const endBtn = document.getElementById('practice-end-btn');
    if (endBtn) {
      endBtn.onclick = () => {
        // Kembali ke kategori (implementasi sesuai kebutuhan)
        this.view.renderEnd();
      };
    }
  }
}

export default PracticePresenter;
