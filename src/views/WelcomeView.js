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
      window.location.hash = '#/test';

      RecordingManager.startRecordingFromWelcome().catch(error => {
        console.error('Failed to start recording:', error);
      });
    });

    this.container.appendChild(welcomeText);
    this.container.appendChild(micButton);

    // Show elements immediately without transitions
    welcomeText.classList.add('visible');
    micButton.classList.add('visible');

    return this.container;
  }

  destroy() {
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
  }
}

export default WelcomeView;
