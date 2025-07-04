// ...existing code...
import '../styles/index.css';

import MicrophoneIcon from '../../../assets/MicrophoneIcon.js';

class TestView {
  constructor(testText = '') {
    this.container = null;
    this.durationDisplay = null;
    this.testText = testText;
  }

  render() {
    this.container = document.createElement('div');
    this.container.className = 'intro-container';

    const testText = document.createElement('p');
    testText.textContent = this.testText;
    testText.className = 'intro-test-text';
    this.container.appendChild(testText);

    // Microphone button with icon (for view transition)
    const micButton = document.createElement('button');
    micButton.className = 'intro-microphone-btn intro-round-shadow';
    micButton.setAttribute('id', 'test-mic-btn');
    micButton.setAttribute('aria-label', 'Mulai Tes');
    micButton.style.viewTransitionName = 'microphone-move';

    // Microphone icon, will be swapped with spinner in processing state
    const micIcon = new MicrophoneIcon().element;
    micIcon.classList.add('intro-microphone-icon');
    micIcon.setAttribute('id', 'microphone-icon');
    micButton.appendChild(micIcon);
    this.micButton = micButton;
    this.micIcon = micIcon;


    this.durationDisplay = document.createElement('div');
    this.durationDisplay.className = 'intro-recording-duration';
    this.durationDisplay.textContent = '00:00';
    // Hide by default with CSS class
    this.durationDisplay.classList.add('hide');

    this.container.appendChild(this.durationDisplay);
    this.container.appendChild(micButton);

    // Logic: handle click for recording/processing
    micButton.addEventListener('click', () => {
      if (this.onMicClick) this.onMicClick();
    });

    return this.container;
  }


  setMicLoading(isLoading) {
    const micBtn = this.container.querySelector('#test-mic-btn');
    if (!micBtn) return;
    if (isLoading) {
      micBtn.disabled = true;
      micBtn.classList.add('intro-loading');
    } else {
      micBtn.disabled = false;
      micBtn.classList.remove('intro-loading');
    }
  }

  setMicRecording(isRecording) {
    const micBtn = this.container.querySelector('#test-mic-btn');
    if (!micBtn) return;
    if (isRecording) {
      micBtn.classList.add('intro-recording');
    } else {
      micBtn.classList.remove('intro-recording');
    }
  }

  setMicProcessing(isProcessing) {
    const micBtn = this.micButton || this.container.querySelector('#test-mic-btn');
    if (!micBtn) return;
    // Remove any existing spinner
    const existingSpinner = micBtn.querySelector('.intro-mic-spinner');
    if (existingSpinner) existingSpinner.remove();
    if (isProcessing) {
      micBtn.classList.add('intro-processing');
      micBtn.disabled = true;
      // Remove mic icon, add spinner
      if (this.micIcon && this.micIcon.parentNode === micBtn) {
        this.micIcon.remove();
      }
      const spinner = document.createElement('div');
      spinner.className = 'intro-mic-spinner';
      micBtn.appendChild(spinner);
      // Animate out duration
      if (this.durationDisplay) {
        this.durationDisplay.classList.add('hide');
      }
    } else {
      micBtn.classList.remove('intro-processing');
      micBtn.disabled = false;
      // Remove spinner, restore mic icon
      const spinner = micBtn.querySelector('.intro-mic-spinner');
      if (spinner) spinner.remove();
      if (this.micIcon && !micBtn.contains(this.micIcon)) {
        micBtn.appendChild(this.micIcon);
      }
      // Optionally show again if needed (not automatic)
    }
  }

  showDuration(show) {
    if (!this.durationDisplay) return;
    if (show) {
      this.durationDisplay.classList.remove('hide');
    } else {
      this.durationDisplay.classList.add('hide');
    }
  }

  updateDurationDisplay(duration) {
    if (!this.durationDisplay) return;
    const seconds = Math.floor(duration / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const formattedTime = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    this.durationDisplay.textContent = formattedTime;
  }

  destroy() {
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
  }
}

export default TestView;
