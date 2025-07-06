class SplashView {
  constructor() {
    this.container = null;
    this.progressBar = null;
    this.loadingText = null;
  }

  render(data) {
    this.container = document.createElement('div');
    this.container.className = 'splash-container';

    this.container.innerHTML = `
      <div class="splash-content">
        <div class="brand-container">
          <h1 class="brand-text">
            <span class="brand-aurea">Aurea</span><span class="brand-voice">Voice</span>
          </h1>
          <p class="tagline">${data.tagline}</p>
        </div>
      </div>
    `;

    this.voiceElement = this.container.querySelector('.brand-voice');

    return this.container;
  }





  startLoadingAnimation() {
    // No loading animation needed
  }

  startJackpotEffect() {
    if (!this.voiceElement) return;

    const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V'];
    let currentIndex = 0;
    let totalChanges = 0;
    const maxChanges = 20; // Total number of letter changes before stopping at V

    const jackpotInterval = setInterval(() => {
      const letter = letters[currentIndex];
      this.voiceElement.textContent = letter + 'oice';

      // Add bounce effect
      this.voiceElement.style.transform = `translateY(-${Math.random() * 3}px)`;

      currentIndex++;
      totalChanges++;

      // Reset to beginning if we reach the end, but keep counting total changes
      if (currentIndex >= letters.length) {
        currentIndex = 0;
      }

      if (totalChanges >= maxChanges) {
        clearInterval(jackpotInterval);
        // Final reveal - always end with "Voice"
        this.voiceElement.textContent = 'Voice';
        this.voiceElement.style.transform = 'translateY(0)';
        this.voiceElement.style.textShadow = '0 0 20px rgba(251, 191, 36, 0.8)';
      }
    }, 80); // Change letter every 80ms for faster effect
  }

  fadeOut() {
    return new Promise((resolve) => {
      if (this.container) {
        this.container.classList.add('fade-out');
        setTimeout(resolve, 500); // Match CSS transition duration
      } else {
        resolve();
      }
    });
  }

  mount(container) {
    if (this.container && container) {
      container.appendChild(this.container);
      // Trigger entrance animation
      setTimeout(() => {
        if (this.container && this.container.parentNode) {
          this.container.classList.add('visible');
        }
      }, 100);
    }
  }

  unmount() {
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
  }

  destroy() {
    this.unmount();
    this.container = null;
    this.voiceElement = null;
  }
}

export default SplashView;
