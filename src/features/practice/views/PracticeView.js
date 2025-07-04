import '../styles/index.css';
import '../styles/practice-components.css';
import '../styles/practice-animations.css';
import '../styles/practice-transitions.css';

class PracticeView {
  constructor() {
    this.app = document.getElementById('app');
    this.microphoneIcon = null;
    this.spinnerElem = null;
    this.durationElem = null;
  }

  renderTest(practiceText, currentSession, maxSession) {
    this.app.innerHTML = `
      <div class="practice-container">
        <div class="practice-session-indicator">${currentSession}/${maxSession}</div>
        <p class="practice-text">${practiceText}</p>
        <div id="practice-recording-duration" class="practice-recording-duration" style="display:none;">00:00</div>
        <button id="practice-record-button" class="practice-recording" aria-label="Record">🎤</button>
      </div>
    `;
    this.durationElem = document.getElementById('practice-recording-duration');
  }

  renderResult(resultData) {
    let scoreText = '';
    let buttonHtml = '';
    let sessionIndicator = '';
    if (resultData && resultData.isAverage) {
      scoreText = `Skor rata-rata aksen Amerika kamu: ${resultData.score ? resultData.score.toFixed(1) : '0.0'}%`;
      buttonHtml = '<button id="practice-end-btn" class="practice-end-btn">Kembali ke Kategori</button>';
      sessionIndicator = `<div class="practice-session-indicator">${resultData.maxSession}/${resultData.maxSession}</div>`;
    } else {
      scoreText = `Skor aksen Amerika kamu: ${resultData.score ? resultData.score.toFixed(1) : '0.0'}%`;
      buttonHtml = '<button id="practice-continue-btn" class="practice-continue-btn">Lanjut ke Sesi Rekaman Berikutnya</button>';
      sessionIndicator = `<div class="practice-session-indicator">${resultData.currentSession}/${resultData.maxSession}</div>`;
    }
    const motivationalDescription = resultData && resultData.motivationalDescription ? resultData.motivationalDescription : '';
    this.app.innerHTML = `
      <div class="practice-result-container">
        ${sessionIndicator}
        <div class="practice-result-text">${scoreText}</div>
        <div class="practice-result-description">${motivationalDescription}</div>
        ${buttonHtml}
      </div>
    `;
  }

  renderEnd() {
    this.app.innerHTML = `<div class="practice-end-message">Terima kasih telah berlatih! Silakan pilih kategori lain.</div>`;
  }

  getRecordButton() {
    return document.getElementById('practice-record-button');
  }

  setRecordingState(isRecording, isProcessing = false) {
    const button = this.getRecordButton();
    if (!button) return;
    button.classList.remove('practice-recording-active', 'practice-recording-processing');
    if (isProcessing) {
      button.classList.add('practice-recording-processing');
    } else if (isRecording) {
      button.classList.add('practice-recording-active');
    }
    if (this.durationElem) {
      this.durationElem.style.display = isRecording ? 'block' : 'none';
    }
  }

  setRecordingDuration(durationText) {
    if (this.durationElem) {
      this.durationElem.textContent = durationText;
    }
  }
}

export default PracticeView;
