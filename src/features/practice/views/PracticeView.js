import '../styles/practice.css';
import MicrophoneIcon from '../../../assets/MicrophoneIcon';

class PracticeView {
  constructor() {
    this.app = document.getElementById('app');
    this.microphoneIcon = null;
  }

  render(practiceText) {
    this.app.innerHTML = `
      <div class="practice-container">
        <p class="practice-text">${practiceText}</p>
        <button id="record-button" class="record-button" aria-label="Record">
          <!-- Microphone icon will be inserted here -->
        </button>
      </div>
    `;
    
    // Initialize microphone icon
    const button = this.getRecordButton();
    this.microphoneIcon = new MicrophoneIcon({ isRecording: false });
    button.appendChild(this.microphoneIcon.element);
  }

  getRecordButton() {
    return document.getElementById('record-button');
  }

  setRecordingState(isRecording) {
    const button = this.getRecordButton();
    if (isRecording) {
      button.classList.add('recording');
      if (this.microphoneIcon) {
        this.microphoneIcon.update({ isRecording: true });
      }
    } else {
      button.classList.remove('recording');
      if (this.microphoneIcon) {
        this.microphoneIcon.update({ isRecording: false });
      }
    }
  }
}

export default PracticeView;
