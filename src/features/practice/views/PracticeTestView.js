import '../styles/practice-index.css';
import MicrophoneIcon from '../../../assets/MicrophoneIcon';

class PracticeTestView {
  getElement() {
    return this.testContainer;
  }
  constructor() {
    // Buat atau ambil practice-container utama
    this.practiceContainer = document.getElementById('practice-container');
    if (!this.practiceContainer) {
      this.practiceContainer = document.createElement('div');
      this.practiceContainer.id = 'practice-container';
      this.practiceContainer.className = 'practice-container';
      // Ambil root app dan append
      document.getElementById('app').appendChild(this.practiceContainer);
    }
    // Selalu gunakan container khusus untuk test
    this.testContainer = document.getElementById('practice-test-container');
    if (!this.testContainer) {
      this.testContainer = document.createElement('div');
      this.testContainer.id = 'practice-test-container';
      this.testContainer.className = 'practice-test-ctn';
      this.testContainer.style.display = '';
      this.practiceContainer.appendChild(this.testContainer);
    } else if (!this.testContainer.parentElement || this.testContainer.parentElement !== this.practiceContainer) {
      this.practiceContainer.appendChild(this.testContainer);
    }
    this.microphoneIcon = null;
  }

  render(practiceText) {
    this.testContainer.innerHTML = `
      <div class="practice-test-content">
        <div class="practice-top-group">
          <p class="practice-text">${practiceText}</p>
          <div id="practice-record-duration" class="practice-record-duration hide">00:00</div>
        </div>
        <div class="practice-record-wrapper">
          <button id="practice-record-button" class="practice-record-btn" aria-label="Record"></button>
        </div>
      </div>
    `;
    const button = this.getRecordButton();
    this.microphoneIcon = new MicrophoneIcon({ isRecording: false });
    button.appendChild(this.microphoneIcon.element);
    this.spinnerElem = null;
    this.durationElem = document.getElementById('practice-record-duration');
    this.wrapperElem = this.testContainer.querySelector('.practice-record-wrapper');
    this.testContainer.style.display = '';
  }

  getRecordButton() {
    return document.getElementById('practice-record-button');
  }

  setRecordingState(isRecording, isProcessing = false) {
    const button = this.getRecordButton();
    if (!button) return;
    button.classList.remove('practice-record-btn-active', 'practice-record-btn-processing');
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
      button.classList.add('practice-record-btn-processing');
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
      button.classList.add('practice-record-btn-active');
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
    // Animate duration and wrapper
    if (this.durationElem && this.wrapperElem) {
      if (isRecording) {
        this.durationElem.classList.remove('hide');
        this.wrapperElem.classList.add('shifted');
      } else {
        this.durationElem.classList.add('hide');
        this.wrapperElem.classList.remove('shifted');
      }
    }
  }

  setRecordingDuration(durationText) {
    if (this.durationElem) {
      this.durationElem.textContent = durationText;
    }
  }
}

export default PracticeTestView;
