
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
    console.log('[LOG] PracticePresenter constructor dipanggil', { model, categoryId, practiceId });
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
    console.log('[LOG] PracticePresenter.init dipanggil', { categoryId: this.categoryId, practiceId: this.practiceId });
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
        const startLog = {
          session: this.sessionCount,
          type: 'mulai',
          time: new Date().toLocaleString(),
        };
        if (!this.sessionLogs) this.sessionLogs = [];
        this.sessionLogs.push(startLog);
        console.log(`[LOG] Sesi ${startLog.session} dimulai pada ${startLog.time}`);
        try {
          await this.recordingManager.startRecording();
          console.log('Recording started');
        } catch (error) {
          console.error('Error starting recording:', error);
          this.recordingService.isRecording = false;
          this.testView.setRecordingState(false);
          this.recordingService.stopRecordingTimer((duration) => this.testView.setRecordingDuration(duration));
          alert('Tidak dapat mengakses mikrofon. Pastikan Anda telah memberikan izin akses mikrofon.');
        }
      } else {
        this.recordingService.stopRecordingTimer((duration) => this.testView.setRecordingDuration(duration));
        const endLog = {
          session: this.sessionCount,
          type: 'berakhir',
          time: new Date().toLocaleString(),
        };
        if (!this.sessionLogs) this.sessionLogs = [];
        this.sessionLogs.push(endLog);
        console.log(`[LOG] Sesi ${endLog.session} berakhir pada ${endLog.time}`);
        try {
          this.testView.setRecordingState(false, true);
          const recording = await this.recordingManager.stopRecording();
          console.log('Recording stopped');
          if (recording && recording.audioBlob) {
            const result = await accentDetectionService.analyzeAccent(recording.audioBlob);
            const score = this.resultService.getScoreFromResult(result);
            // Pastikan durasi dalam detik (dibulatkan)
            if (recording && typeof recording.duration === 'number') {
              recording.duration = Math.round(recording.duration / 1000);
            }
            this.sessionRecordings.push(recording);
            this.sessionScores.push(score);
            this.model.savePracticeRecording(this.categoryId, this.practiceId, recording, score);
            this.resultModel.setResultData(result);
            if (this.sessionRecordings.length >= this.maxSession) {
              const avgScore = this.resultService.getAverageScore(this.sessionScores);
              // Hitung total durasi dari 4 rekaman
              let totalDuration = 0;
              if (this.sessionRecordings.length === this.maxSession) {
                totalDuration = this.sessionRecordings.reduce((sum, rec) => {
                  // rec.duration bisa berupa detik, fallback ke 0 jika tidak ada
                  return sum + (rec.duration || 0);
                }, 0);
              }
              // Ambil nama_kategori dan nama_latihan (jika ada di model)
              let nama_kategori = this.categoryId;
              let nama_latihan = this.practiceId;
              if (typeof this.model.getCategoryName === 'function') {
                nama_kategori = this.model.getCategoryName(this.categoryId) || this.categoryId;
              }
              if (typeof this.model.getPracticeName === 'function') {
                nama_latihan = this.model.getPracticeName(this.practiceId) || this.practiceId;
              }
              // Simpan ke IndexedDB dengan log sebelum dan sesudah
              console.log('[LOG] Akan menyimpan sesi ke IndexedDB:', {
                id_latihan: this.practiceId,
                nama_kategori,
                nama_latihan,
                hasil_sesi: avgScore,
                durasi: totalDuration
              });
              savePracticeSession({
                id_latihan: this.practiceId,
                nama_kategori,
                nama_latihan,
                hasil_sesi: avgScore,
                durasi: totalDuration
              })
                .then(() => {
                  console.log('[LOG] Sukses menyimpan sesi ke IndexedDB');
                })
                .catch((err) => {
                  console.error('[LOG] Gagal menyimpan sesi ke IndexedDB:', err);
                });
              // Tampilkan progress bar full sebelum result rata-rata
              this.testView.renderSessionProgress(this.maxSession, this.maxSession);
              this.showResultView({
                ...result,
                isAverage: true,
                avgScore: avgScore
              });
              this.sessionRecordings = [];
              this.sessionScores = [];
              this.sessionCount = 0;
              return;
            }
            this.showResultView(result);
            this.testView.renderSessionProgress(this.sessionCount + 1, this.maxSession);
          }
        } catch (error) {
          console.error('Error stopping recording:', error);
          alert('Terjadi kesalahan saat menghentikan perekaman.');
        } finally {
          this.testView.setRecordingState(false, false);
        }
      }
    } catch (error) {
      console.error('Error in toggleRecording:', error);
      this.recordingService.isRecording = false;
      this.testView.setRecordingState(false);
      this.recordingService.stopRecordingTimer((duration) => this.testView.setRecordingDuration(duration));
    }
  }

  showResultView(resultData) {
    // Hapus progress bar saat masuk ke result view
    if (this.testView && typeof this.testView.removeSessionProgress === 'function') {
      this.testView.removeSessionProgress();
    }
    let viewData = {};
    // Logging perpindahan ke result view
    console.log('[LOG] showResultView dipanggil, resultData:', resultData);
    // Clean up previous event listeners to avoid duplicate triggers
    // Remove from continue button
    const prevContinueBtn = this.resultView.getContinueButton && this.resultView.getContinueButton();
    if (prevContinueBtn && this._continueBtnHandler) {
      prevContinueBtn.removeEventListener('click', this._continueBtnHandler);
      console.log('[LOG] Event handler continueBtn dihapus');
    }
    // Remove from return button
    const prevReturnBtn = this.resultView.getReturnButton && this.resultView.getReturnButton();
    if (prevReturnBtn && this._returnBtnHandler) {
      prevReturnBtn.removeEventListener('click', this._returnBtnHandler);
      console.log('[LOG] Event handler returnBtn dihapus');
    }

    if (resultData && resultData.isAverage && typeof resultData.avgScore === 'number') {
      const score = this.resultService.getScoreFromResult({ us_confidence: resultData.avgScore });
      const motivationalDescription = this.resultService.getMotivationalDescription(score);
      viewData = {
        score,
        motivationalDescription,
        averageInfo: `Skor rata-rata dari 4 sesi: ${score.toFixed(2)}`
      };
      console.log('[LOG] Menampilkan result rata-rata sesi, score:', score, 'viewData:', viewData);
      this.viewService.animateViewTransition(this.testView, this.resultView, viewData);
      this.currentView = 'result';
      // Pasang handler baru
      const returnBtn = this.resultView.getReturnButton && this.resultView.getReturnButton();
      this._returnBtnHandler = () => {
        console.log('[LOG] Tombol kembali ke kategori diklik');
        if (window.appRouter) {
          window.appRouter.navigate(`/categories/${this.categoryId}`);
        } else {
          window.location.hash = `#/categories/${this.categoryId}`;
        }
      };
      if (returnBtn) {
        returnBtn.addEventListener('click', this._returnBtnHandler);
        console.log('[LOG] Event handler returnBtn dipasang');
      }
      return;
    }
    // Sesi biasa (bukan rata-rata)
    const score = this.resultService.getScoreFromResult(resultData);
    const motivationalDescription = this.resultService.getMotivationalDescription(score);
    viewData = {
      score,
      motivationalDescription
    };
    console.log('[LOG] Menampilkan result sesi biasa, score:', score, 'viewData:', viewData);
    this.viewService.animateViewTransition(this.testView, this.resultView, viewData);
    this.currentView = 'result';
    // Repeat button (jika ada)
    const repeatBtn = this.resultView.getRepeatButton && this.resultView.getRepeatButton();
    if (repeatBtn) {
      repeatBtn.addEventListener('click', () => {
        console.log('[LOG] Tombol ulangi sesi diklik');
        this.backToTest();
      });
      console.log('[LOG] Event handler repeatBtn dipasang');
    }
    // Continue button
    const continueBtn = this.resultView.getContinueButton && this.resultView.getContinueButton();
    if (continueBtn) {
      console.log('[LOG] continueBtn ditemukan, akan dipasang event handler. Elemen:', continueBtn);
      // Handler dengan log event
      this._continueBtnHandler = (e) => {
        console.log('[LOG] Tombol lanjut sesi berikutnya diklik, event:', e, 'event.type:', e?.type, 'event.isTrusted:', e?.isTrusted, 'event.detail:', e?.detail);
        this.handleContinueToNextSession();
      };
      continueBtn.addEventListener('click', this._continueBtnHandler);
      console.log('[LOG] Event handler continueBtn dipasang');
    } else {
      console.log('[LOG] continueBtn tidak ditemukan setelah render');
    }
  }

  async handleContinueToNextSession() {
    console.log('[LOG] handleContinueToNextSession dipanggil, currentView:', this.currentView, 'sessionRecordings:', this.sessionRecordings.length, 'sessionScores:', this.sessionScores.length, 'sessionCount:', this.sessionCount);
    console.trace('[TRACE] handleContinueToNextSession dipanggil dari:');
    this.viewService.animateViewTransition(this.resultView, this.testView);
    this.currentView = 'test';
    let nextSessionIdx = this.sessionRecordings.length;
    if (nextSessionIdx >= this.maxSession) {
      console.log('[LOG] Reset session karena nextSessionIdx >= maxSession');
      nextSessionIdx = 0;
      this.sessionRecordings = [];
      this.sessionScores = [];
      this.sessionCount = 0;
    }
    if (typeof this.model.getPracticeText === 'function') {
      try {
        const practiceText = await this.model.getPracticeText(this.categoryId, this.practiceId, nextSessionIdx);
        if (practiceText) {
          console.log('[LOG] Render test baru untuk sesi ke', nextSessionIdx + 1, 'dengan text:', practiceText);
          this.viewService.renderTest(this.testView, this.resultView, practiceText);
          this.bindEvents();
        } else {
          console.log('[LOG] Tidak ada practiceText ditemukan');
          this.testView.render('Latihan tidak ditemukan.');
        }
      } catch (error) {
        console.error('[LOG] Error saat memuat latihan:', error);
        this.testView.render('Terjadi kesalahan saat memuat latihan.');
      }
    }
  }

  backToTest() {
    console.log('[LOG] backToTest dipanggil, currentView:', this.currentView);
    this.viewService.animateViewTransition(this.resultView, this.testView);
    this.currentView = 'test';
    this.testView.renderSessionProgress(this.sessionCount + 1, this.maxSession);
    this.bindEvents();
  }

  renderTest(practiceText) {
    console.log('[LOG] renderTest dipanggil, currentView:', this.currentView, 'practiceText:', practiceText);
    this.viewService.renderTest(this.testView, this.resultView, practiceText);
    this.testView.renderSessionProgress(this.sessionCount + 1, this.maxSession);
  }

  animateViewTransition(fromView, toView, resultData) {
    this.viewService.animateViewTransition(fromView, toView, resultData);
  }
}

export default PracticePresenter;
