import '../styles/index.css';
import MicrophoneIcon from '../../../assets/MicrophoneIcon';

class PracticeTestView {
  constructor() {
    this.app = document.getElementById('app');
    this.microphoneIcon = null;
  }

  render(practiceText) {
    this.app.innerHTML = `
      <div class="practice-container">
        <div class="practice-top-group">
          <p class="practice-text">${practiceText}</p>
          <div id="practice-recording-duration" class="practice-recording-duration" style="display:none;">00:00</div>
        </div>
        <button id="practice-record-button" class="practice-recording" aria-label="Record">
        </button>
      </div>
    `;
    const button = this.getRecordButton();
    this.microphoneIcon = new MicrophoneIcon({ isRecording: false });
    button.appendChild(this.microphoneIcon.element);
    this.spinnerElem = null;
    this.durationElem = document.getElementById('practice-recording-duration');
  }

  getRecordButton() {
    return document.getElementById('practice-record-button');
  }

  setRecordingState(isRecording, isProcessing = false) {
    const button = this.getRecordButton();
    if (!button) return;
    button.classList.remove('practice-recording-active', 'practice-recording-processing');
    // Remove spinner if exists
    if (this.spinnerElem) {
      this.spinnerElem.remove();
      this.spinnerElem = null;
    }
    // Show/hide mic icon
    if (this.microphoneIcon && this.microphoneIcon.element && !button.contains(this.microphoneIcon.element)) {
      button.appendChild(this.microphoneIcon.element);
    }
    if (isProcessing) {
      button.classList.add('practice-recording-processing');
      // Hide mic icon
      if (this.microphoneIcon && this.microphoneIcon.element) {
        this.microphoneIcon.element.style.display = 'none';
      }
      // Add spinner
      this.spinnerElem = document.createElement('span');
      this.spinnerElem.className = 'practice-spinner';
      this.spinnerElem.setAttribute('aria-label', 'Loading');
      button.appendChild(this.spinnerElem);
    } else if (isRecording) {
      button.classList.add('practice-recording-active');
      if (this.microphoneIcon) {
        this.microphoneIcon.element.style.display = '';
        this.microphoneIcon.update({ isRecording: true, isProcessing: false });
      }
    } else {
      if (this.microphoneIcon) {
        this.microphoneIcon.element.style.display = '';
        this.microphoneIcon.update({ isRecording: false, isProcessing: false });
      }
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

export default PracticeTestView;
