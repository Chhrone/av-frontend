// ...existing code...
import '../styles/index.css';
import '../styles/intro-animation.css';

import MicrophoneIcon from '../../../assets/MicrophoneIcon.js';

class TestView {
  constructor(testText = '') {
    this.container = null;
    this.durationDisplay = null;
    this.testText = testText;
  }

  render() {
    this.container = document.createElement('div');
    this.container.className = 'container';

    const testText = document.createElement('p');
    testText.textContent = this.testText;
    testText.className = 'test-text';
    this.container.appendChild(testText);

    // Microphone button with icon (for view transition)
    const micButton = document.createElement('button');
    micButton.className = 'microphone-btn round-shadow';
    micButton.setAttribute('id', 'test-mic-btn');
    micButton.setAttribute('aria-label', 'Mulai Tes');
    micButton.style.viewTransitionName = 'microphone-move';

    const micIcon = new MicrophoneIcon().element;
    micIcon.classList.add('microphone-icon');
    micIcon.setAttribute('id', 'microphone-icon');
    micButton.appendChild(micIcon);

    this.container.appendChild(micButton);

    this.durationDisplay = document.createElement('div');
    this.durationDisplay.className = 'recording-duration';
    this.durationDisplay.style.display = 'none';
    this.durationDisplay.textContent = '00:00';
    this.container.appendChild(this.durationDisplay);

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
      micBtn.classList.add('loading');
    } else {
      micBtn.disabled = false;
      micBtn.classList.remove('loading');
    }
  }

  setMicRecording(isRecording) {
    const micBtn = this.container.querySelector('#test-mic-btn');
    if (!micBtn) return;
    if (isRecording) {
      micBtn.classList.add('recording');
    } else {
      micBtn.classList.remove('recording');
    }
  }

  setMicProcessing(isProcessing) {
    const micBtn = this.container.querySelector('#test-mic-btn');
    if (!micBtn) return;
    const micIcon = micBtn.querySelector('.microphone-icon');
    if (isProcessing) {
      micBtn.classList.add('processing');
      micBtn.disabled = true;
      // Sembunyikan icon mic (untuk fallback jika CSS gagal)
      if (micIcon) micIcon.style.display = 'none';
    } else {
      micBtn.classList.remove('processing');
      micBtn.disabled = false;
      // Tampilkan kembali icon mic
      if (micIcon) micIcon.style.display = '';
    }
  }

  showDuration(show) {
    if (!this.durationDisplay) return;
    this.durationDisplay.style.display = show ? 'block' : 'none';
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
