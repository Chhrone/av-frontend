
import PracticeTestView from '../views/PracticeTestView.js';
import PracticeResultView from '../views/PracticeResultView.js';
import PracticeResultModel from '../models/PracticeResultModel.js';
import recordingManager from '../../../utils/RecordingManager.js';
import accentDetectionService from '../../../utils/AccentDetectionService.js';
import PracticeRecordingService from '../services/PracticeRecordingService.js';
import PracticeResultService from '../services/PracticeResultService.js';
import PracticeViewService from '../services/PracticeViewService.js';
import { savePracticeSession } from '../../../utils/database/aureaVoiceDB.js';


class PracticePresenter {
  constructor(model, categoryId, practiceId) {
    this.model = model;
    this.resultModel = new PracticeResultModel();
    this.categoryId = this.normalizeCategoryId(categoryId);
    this.practiceId = practiceId;
    this.testView = new PracticeTestView();
    this.resultView = new PracticeResultView();
    this.recordingManager = recordingManager;
    this.currentView = 'test';
    this.container = document.getElementById('practice-container') || document.body;

    // Service instances
    this.recordingService = new PracticeRecordingService(this.recordingManager);
    this.resultService = new PracticeResultService(this.resultModel);
    this.viewService = new PracticeViewService();
    // Session logic moved back here
    this.maxSession = 4;
    this.sessionRecordings = [];
    this.sessionScores = [];
    this.sessionCount = 0;

    // Simpan referensi handler agar bisa dihapus
    this._recordButtonClickHandler = this._recordButtonClickHandler?.bind(this) || this.toggleRecording.bind(this);
    this._recordButtonKeydownHandler = this._recordButtonKeydownHandler?.bind(this) || ((e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.toggleRecording();
      }
    });
  }

  normalizeCategoryId(categoryId) {
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
        this.renderTest(practiceText);
        this.testView.renderSessionProgress(this.sessionCount + 1, this.maxSession);
        this.bindEvents();
      } else {
        this.testView.render('Latihan tidak ditemukan.');
      }
    } catch (error) {
      console.error('Error initializing practice:', error);
      this.testView.render('Terjadi kesalahan saat memuat latihan.');
    }
  }

  bindEvents() {
    const recordButton = this.testView.getRecordButton();
    if (recordButton) {
      if (this._recordButtonClickHandler) {
        recordButton.removeEventListener('click', this._recordButtonClickHandler);
      }
      if (this._recordButtonKeydownHandler) {
        recordButton.removeEventListener('keydown', this._recordButtonKeydownHandler);
      }
      recordButton.addEventListener('click', this._recordButtonClickHandler);
      recordButton.addEventListener('keydown', this._recordButtonKeydownHandler);
    } else {
      console.error('Record button not found');
    }
  }

  destroy() {
    const recordButton = this.testView.getRecordButton();
    if (recordButton) {
      if (this._recordButtonClickHandler) {
        recordButton.removeEventListener('click', this._recordButtonClickHandler);
      }
      if (this._recordButtonKeydownHandler) {
        recordButton.removeEventListener('keydown', this._recordButtonKeydownHandler);
      }
    }
    // Hapus progress bar jika ada
    if (this.testView && typeof this.testView.removeSessionProgress === 'function') {
      this.testView.removeSessionProgress();
    }
  }

  async toggleRecording() {
    try {
      this.recordingService.isRecording = !this.recordingService.isRecording;
      this.testView.setRecordingState(this.recordingService.isRecording);
      if (this.recordingService.isRecording) {
        this.recordingService.startRecordingTimer((duration) => this.testView.setRecordingDuration(duration));
        this.sessionCount += 1;
        this.testView.renderSessionProgress(this.sessionCount, this.maxSession);
        if (typeof this.model.getPracticeText === 'function') {
          let currentPracticeText = '';
          if (this.testView && typeof this.testView.getPracticeText === 'function') {
            currentPracticeText = this.testView.getPracticeText();
          }
          if (!currentPracticeText) {
            currentPracticeText = this.model.lastPracticeText || '';
          }
          this.model.lastPracticeText = currentPracticeText;
        }
        if (!this.sessionLogs) this.sessionLogs = [];
        this.sessionLogs.push({
          session: this.sessionCount,
          type: 'mulai',
          time: new Date().toLocaleString(),
        });
        try {
          await this.recordingManager.startRecording();
        } catch (error) {
          this.recordingService.isRecording = false;
          this.testView.setRecordingState(false);
          this.recordingService.stopRecordingTimer((duration) => this.testView.setRecordingDuration(duration));
          alert('Tidak dapat mengakses mikrofon. Pastikan Anda telah memberikan izin akses mikrofon.');
        }
      } else {
        this.recordingService.stopRecordingTimer((duration) => this.testView.setRecordingDuration(duration));
        if (!this.sessionLogs) this.sessionLogs = [];
        this.sessionLogs.push({
          session: this.sessionCount,
          type: 'berakhir',
          time: new Date().toLocaleString(),
        });
        try {
          this.testView.setRecordingState(false, true);
          const recording = await this.recordingManager.stopRecording();
          this.resultModel.updateTranscriptFromService(this.recordingService);
          const transcript = this.resultModel.getTranscript();
          if (recording && recording.audioBlob) {
            const result = await accentDetectionService.analyzeAccent(recording.audioBlob);
            const score = this.resultService.getScoreFromResult(result);
            if (recording && typeof recording.duration === 'number') {
              recording.duration = Math.round(recording.duration / 1000);
            }
            this.sessionRecordings.push(recording);
            this.sessionScores.push(score);
            this.model.savePracticeRecording(this.categoryId, this.practiceId, recording, score);
            this.resultModel.setResultData(result);
            this.resultModel.setTranscript(transcript);
            if (this.sessionRecordings.length >= this.maxSession) {
              const avgScore = this.resultService.getAverageScore(this.sessionScores);
              let totalDuration = 0;
              if (this.sessionRecordings.length === this.maxSession) {
                totalDuration = this.sessionRecordings.reduce((sum, rec) => {
                  return sum + (rec.duration || 0);
                }, 0);
              }
              let nama_kategori = this.categoryId;
              let nama_latihan = this.practiceId;
              if (typeof this.model.getCategoryName === 'function') {
                nama_kategori = this.model.getCategoryName(this.categoryId) || this.categoryId;
              }
              if (typeof this.model.getPracticeName === 'function') {
                nama_latihan = this.model.getPracticeName(this.practiceId) || this.practiceId;
              }
              savePracticeSession({
                id_latihan: this.practiceId,
                nama_kategori,
                nama_latihan,
                hasil_sesi: avgScore,
                durasi: totalDuration
              })
                .then(() => {})
                .catch(() => {});
              this.testView.renderSessionProgress(this.maxSession, this.maxSession);
              this.showResultView({
                ...result,
                isAverage: true,
                avgScore: avgScore,
                transcript: transcript
              });
              this.sessionRecordings = [];
              this.sessionScores = [];
              this.sessionCount = 0;
              return;
            }
            this.showResultView({ ...result, transcript });
            this.testView.renderSessionProgress(this.sessionCount + 1, this.maxSession);
          }
        } catch (error) {
          alert('Terjadi kesalahan saat menghentikan perekaman.');
        } finally {
          this.testView.setRecordingState(false, false);
        }
      }
    } catch (error) {
      this.recordingService.isRecording = false;
      this.testView.setRecordingState(false);
      this.recordingService.stopRecordingTimer((duration) => this.testView.setRecordingDuration(duration));
    }
  }

  showResultView(resultData) {
    if (this.testView && typeof this.testView.removeSessionProgress === 'function') {
      this.testView.removeSessionProgress();
    }
    let viewData = {};
    const prevContinueBtn = this.resultView.getContinueButton && this.resultView.getContinueButton();
    if (prevContinueBtn && this._continueBtnHandler) {
      prevContinueBtn.removeEventListener('click', this._continueBtnHandler);
    }
    const prevReturnBtn = this.resultView.getReturnButton && this.resultView.getReturnButton();
    if (prevReturnBtn && this._returnBtnHandler) {
      prevReturnBtn.removeEventListener('click', this._returnBtnHandler);
    }

    if (resultData && resultData.isAverage && typeof resultData.avgScore === 'number') {
      const score = this.resultService.getScoreFromResult({ us_confidence: resultData.avgScore });
      const motivationalDescription = this.resultService.getMotivationalDescription(score);
      let practiceText = '';
      if (typeof this.model.getPracticeText === 'function') {
        practiceText = this.model.lastPracticeText || '';
      }
      viewData = {
        score,
        motivationalDescription,
        averageInfo: `Skor rata-rata dari 4 sesi: ${score.toFixed(2)}`,
        transcript: resultData.transcript,
        practiceText: practiceText
      };
      this.viewService.animateViewTransition(this.testView, this.resultView, viewData);
      this.currentView = 'result';
      const returnBtn = this.resultView.getReturnButton && this.resultView.getReturnButton();
      this._returnBtnHandler = () => {
        if (window.appRouter) {
          window.appRouter.navigate(`/categories/${this.categoryId}`);
        } else {
          window.location.hash = `#/categories/${this.categoryId}`;
        }
      };
      if (returnBtn) {
        returnBtn.addEventListener('click', this._returnBtnHandler);
      }
      return;
    }
    const score = this.resultService.getScoreFromResult(resultData);
    const motivationalDescription = this.resultService.getMotivationalDescription(score);
    const transcript = this.resultModel.getTranscript ? this.resultModel.getTranscript() : '';
    let practiceText = '';
    if (typeof this.model.getPracticeText === 'function') {
      practiceText = this.model.lastPracticeText || '';
    }
    viewData = {
      score,
      motivationalDescription,
      transcript,
      practiceText: practiceText
    };
    this.viewService.animateViewTransition(this.testView, this.resultView, viewData);
    this.currentView = 'result';
    const repeatBtn = this.resultView.getRepeatButton && this.resultView.getRepeatButton();
    if (repeatBtn) {
      repeatBtn.addEventListener('click', () => {
        this.backToTest();
      });
    }
    const continueBtn = this.resultView.getContinueButton && this.resultView.getContinueButton();
    if (continueBtn) {
      this._continueBtnHandler = (e) => {
        this.handleContinueToNextSession();
      };
      continueBtn.addEventListener('click', this._continueBtnHandler);
    }
  }

  async handleContinueToNextSession() {
    this.viewService.animateViewTransition(this.resultView, this.testView);
    this.currentView = 'test';
    let nextSessionIdx = this.sessionRecordings.length;
    if (nextSessionIdx >= this.maxSession) {
      nextSessionIdx = 0;
      this.sessionRecordings = [];
      this.sessionScores = [];
      this.sessionCount = 0;
    }
    if (typeof this.model.getPracticeText === 'function') {
      try {
        const practiceText = await this.model.getPracticeText(this.categoryId, this.practiceId, nextSessionIdx);
        // Simpan practiceText ke model agar bisa diakses di result view
        this.model.lastPracticeText = practiceText;
        if (practiceText) {
          this.viewService.renderTest(this.testView, this.resultView, practiceText);
          this.bindEvents();
        } else {
          this.testView.render('Latihan tidak ditemukan.');
        }
      } catch (error) {
        this.testView.render('Terjadi kesalahan saat memuat latihan.');
      }
    }
  }

  backToTest() {
    this.viewService.animateViewTransition(this.resultView, this.testView);
    this.currentView = 'test';
    this.testView.renderSessionProgress(this.sessionCount + 1, this.maxSession);
    this.bindEvents();
  }

  renderTest(practiceText) {
    this.viewService.renderTest(this.testView, this.resultView, practiceText);
    this.testView.renderSessionProgress(this.sessionCount + 1, this.maxSession);
  }

  animateViewTransition(fromView, toView, resultData) {
    this.viewService.animateViewTransition(fromView, toView, resultData);
  }
}

export default PracticePresenter;
