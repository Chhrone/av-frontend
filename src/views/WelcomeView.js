import TransitionController from '../utils/TransitionController.js';
import RecordingManager from '../utils/RecordingManager.js';

// SVG microphone icon as string
const microphoneIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
  <path d="M19 10v2a7 7 0 0 1-14 0v-2a1 1 0 0 1 2 0v2a5 5 0 0 0 10 0v-2a1 1 0 0 1 2 0z"/>
  <path d="M12 19a1 1 0 0 1 1 1v1a1 1 0 0 1-2 0v-1a1 1 0 0 1 1-1z"/>
</svg>`;

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
    micButton.innerHTML = microphoneIcon;
    micButton.className = 'microphone-button';

    const svgIcon = micButton.querySelector('svg');
    if (svgIcon) {
      svgIcon.setAttribute('class', 'microphone-icon');
    }

    micButton.addEventListener('click', () => {
      // Navigate immediately for smooth transition
      window.location.hash = '#/test';

      // Start recording initialization in background (non-blocking)
      RecordingManager.startRecordingFromWelcome().catch(error => {
        console.error('Failed to start recording:', error);
      });
    });

    // Temporary test button for result view (remove in production)
    const testButton = document.createElement('button');
    testButton.textContent = 'Test Result View (Demo)';
    testButton.className = 'test-result-button';
    testButton.addEventListener('click', () => {
      // Generate random mock data and navigate to result
      const mockResult = {
        us_confidence: Math.random() * 45 + 50 // 50-95 range
      };
      sessionStorage.setItem('accentResult', JSON.stringify(mockResult));
      window.location.hash = '#/result';
    });

    this.container.appendChild(welcomeText);
    this.container.appendChild(micButton);
    this.container.appendChild(testButton);

    // Skip entrance animation only for specific transitions, not initial load
    const currentTransition = TransitionController.getCurrentTransition();
    const isFromTestPage = currentTransition === 'test-to-welcome';

    if (isFromTestPage) {
      // Coming from test page - let View Transition API handle animation
      welcomeText.classList.add('visible');
      micButton.classList.add('visible');
      testButton.classList.add('visible');
    } else {
      // Initial load or other cases - use entrance animation
      setTimeout(() => {
        welcomeText.classList.add('visible');
        micButton.classList.add('visible');
        testButton.classList.add('visible');
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
