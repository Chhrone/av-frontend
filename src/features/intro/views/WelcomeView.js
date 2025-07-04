// ...existing code...

import MicrophoneIcon from '../../../assets/MicrophoneIcon.js';

class WelcomeView {
  constructor(welcomeText = '') {
    this.container = null;
    this.welcomeText = welcomeText;
  }

  render() {
    this.container = document.createElement('div');
    this.container.className = 'intro-container';

    const welcomeText = document.createElement('h1');
    welcomeText.textContent = this.welcomeText;
    welcomeText.className = 'intro-welcome-text';
    this.container.appendChild(welcomeText);

    // Microphone button with icon
    const micButton = document.createElement('button');
    micButton.className = 'intro-microphone-btn intro-round-shadow';
    micButton.setAttribute('id', 'welcome-mic-btn');
    micButton.setAttribute('aria-label', 'Mulai Tes');
    // For view transition API
    micButton.style.viewTransitionName = 'microphone-move';

    // Microphone icon 32px
    const micIcon = new MicrophoneIcon().element;
    micIcon.classList.add('intro-microphone-icon');
    micIcon.setAttribute('id', 'microphone-icon');
    // Hapus viewTransitionName di icon, hanya di button saja
    micButton.appendChild(micIcon);

    this.container.appendChild(micButton);
    welcomeText.classList.add('visible');

    return this.container;
  }

  destroy() {
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
  }
}

export default WelcomeView;
