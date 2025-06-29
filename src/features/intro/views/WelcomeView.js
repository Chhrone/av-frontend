import RecordingManager from '../../../utils/RecordingManager.js';
import MicrophoneIcon from '../../../assets/MicrophoneIcon.js';

class WelcomeView {
  constructor(welcomeText = '') {
    this.container = null;
    this.welcomeText = welcomeText;
  }

  render() {
    this.container = document.createElement('div');
    this.container.className = 'container';

    const welcomeText = document.createElement('h1');
    welcomeText.textContent = this.welcomeText;
    welcomeText.className = 'welcome-text';

    const micButton = document.createElement('button');
    MicrophoneIcon.setInnerHTML(micButton, { className: 'microphone-icon' });
    micButton.className = 'microphone-button';

    // Add data attribute for view transition
    micButton.setAttribute('data-transition-trigger', 'true');

    micButton.addEventListener('click', () => {
      // Add transitioning class for enhanced animation
      micButton.classList.add('transitioning');

      // Navigate to test page
      window.location.hash = '#/test';

      RecordingManager.startRecordingFromWelcome().catch(error => {
        console.error('Failed to start recording:', error);
      });
    });

    // Add dashboard link
    const dashboardLink = document.createElement('a');
    dashboardLink.href = '#/dashboard';
    dashboardLink.textContent = 'Dashboard';
    dashboardLink.className = 'dashboard-link';
    dashboardLink.style.cssText = `
      position: absolute;
      top: 20px;
      right: 20px;
      background-color: #2563eb;
      color: white;
      padding: 8px 16px;
      border-radius: 6px;
      text-decoration: none;
      font-size: 14px;
      font-weight: 600;
      transition: background-color 0.2s;
    `;

    dashboardLink.addEventListener('mouseenter', () => {
      dashboardLink.style.backgroundColor = '#1d4ed8';
    });

    dashboardLink.addEventListener('mouseleave', () => {
      dashboardLink.style.backgroundColor = '#2563eb';
    });

    this.container.appendChild(dashboardLink);
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
