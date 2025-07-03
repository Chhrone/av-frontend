import '../styles/practice.css';
import MicrophoneIcon from '../../../assets/MicrophoneIcon';

class PracticeTestView {
  constructor() {
    this.app = document.getElementById('app');
    this.microphoneIcon = null;
  }

  render(practiceText) {
    this.app.innerHTML = `
      <div class="practice-container">
        <p class="practice-text">${practiceText}</p>
        <button id="record-button" class="record-button" aria-label="Record">
        </button>
        <div id="recording-duration" class="recording-duration" style="display:none;">00:00</div>
      </div>
    `;
    const button = this.getRecordButton();
    this.microphoneIcon = new MicrophoneIcon({ isRecording: false });
    button.appendChild(this.microphoneIcon.element);
    this.durationElem = document.getElementById('recording-duration');
  }

  getRecordButton() {
    return document.getElementById('record-button');
  }

  setRecordingState(isRecording) {
    const button = this.getRecordButton();
    if (isRecording) {
      button.classList.add('recording');
      button.classList.add('recording-active');
      if (this.durationElem) {
        this.durationElem.style.display = 'block';
      }
      if (this.microphoneIcon) {
        this.microphoneIcon.update({ isRecording: true });
      }
    } else {
      button.classList.remove('recording');
      button.classList.remove('recording-active');
      if (this.durationElem) {
        this.durationElem.style.display = 'none';
      }
      if (this.microphoneIcon) {
        this.microphoneIcon.update({ isRecording: false });
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
