import TransitionController from '../utils/TransitionController.js';
import RecordingManager from '../utils/RecordingManager.js';
import MicrophoneIcon from '../assets/MicrophoneIcon.js';

class WelcomeView {
  constructor() {
    this.container = null;
  }

  render() {
    this.container = document.createElement('div');
    this.container.className = 'container';

    const welcomeText = document.createElement('h1');
    welcomeText.textContent = 'Wanna test how good your speaking skill is?';
    welcomeText.className = 'welcome-text';

    const micButton = document.createElement('button');
    MicrophoneIcon.setInnerHTML(micButton, { className: 'microphone-icon' });
    micButton.className = 'microphone-button';

    micButton.addEventListener('click', () => {
      // Navigate immediately for smooth transition
      window.location.hash = '#/test';

      // Start recording initialization in background (non-blocking)
      RecordingManager.startRecordingFromWelcome().catch(error => {
        console.error('Failed to start recording:', error);
      });
    });

    this.container.appendChild(welcomeText);
    this.container.appendChild(micButton);

    // Skip entrance animation only for specific transitions, not initial load
    const currentTransition = TransitionController.getCurrentTransition();
    const isFromTestPage = currentTransition === 'test-to-welcome';

    if (isFromTestPage) {
      // Coming from test page - let View Transition API handle animation
      welcomeText.classList.add('visible');
      micButton.classList.add('visible');
    } else {
      // Initial load or other cases - use entrance animation
      setTimeout(() => {
        welcomeText.classList.add('visible');
        micButton.classList.add('visible');
      }, 100);
    }

    return this.container;
  }

  destroy() {
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
  }
}

export default WelcomeView;
