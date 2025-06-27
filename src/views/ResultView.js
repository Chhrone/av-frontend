import AccentDetectionAPI from '../utils/AccentDetectionAPI.js';
import PlaybackController from '../utils/PlaybackController.js';

/**
 * ResultView - Displays accent detection results and audio playback
 */
class ResultView {
  constructor() {
    this.container = null;
    this.playbackInstance = null;
    this.loadingElement = null;
    this.resultElement = null;
    this.recording = null;
    this.audioBlob = null;
  }

  /**
   * Render the result view
   */
  render() {
    this.container = document.createElement('div');
    this.container.className = 'container result-container';

    // Create header
    const header = document.createElement('div');
    header.className = 'result-header';
    header.innerHTML = `
      <h1>Hasil Deteksi Aksen</h1>
      <p>Analisis aksen Amerika dari rekaman Anda</p>
    `;

    // Create audio playback section (placeholder)
    const audioSection = document.createElement('div');
    audioSection.className = 'audio-section';
    audioSection.id = 'audio-section';

    // Create loading section
    this.loadingElement = this.createLoadingSection();

    // Create result section (initially hidden)
    this.resultElement = this.createResultSection();
    this.resultElement.style.display = 'none';

    this.container.appendChild(header);
    this.container.appendChild(audioSection);
    this.container.appendChild(this.loadingElement);
    this.container.appendChild(this.resultElement);

    return this.container;
  }



  /**
   * Create loading section
   */
  createLoadingSection() {
    const section = document.createElement('div');
    section.className = 'loading-section';

    section.innerHTML = `
      <div class="loading-animation">
        <div class="loading-spinner"></div>
        <h3>Menganalisis Aksen...</h3>
        <p>Mohon tunggu, kami sedang memproses rekaman Anda</p>
        <div class="loading-progress">
          <div class="progress-bar">
            <div class="progress-fill"></div>
          </div>
          <p class="progress-text">Memproses audio...</p>
        </div>
      </div>
    `;

    return section;
  }

  /**
   * Create result section with 3-row layout
   */
  createResultSection() {
    const section = document.createElement('div');
    section.className = 'result-section';

    section.innerHTML = `
      <div class="result-container-main">
        <div class="result-row confidence-row">
          <div class="confidence-display">
            <div class="confidence-number">
              <span class="confidence-value">--</span>
              <span class="confidence-unit">%</span>
            </div>
            <div class="confidence-label">Aksen Amerika</div>
          </div>
        </div>

        <div class="result-row analysis-row">
          <h3 class="analysis-title">Hasil Analisis</h3>
          <div class="analysis-content">
            <p class="confidence-text">Tingkat aksen Amerika Anda sebesar <span class="confidence-percentage">--%</span></p>
            <p class="confidence-level">Kategori: <span class="level-text">--</span></p>
          </div>
        </div>

        <div class="result-row notes-row">
          <h4 class="notes-title">Catatan Tambahan</h4>
          <div class="notes-content">
            <p class="notes-text">Analisis ini berdasarkan karakteristik vokal, intonasi, dan pola bicara dalam rekaman Anda. Hasil dapat bervariasi tergantung kualitas audio dan durasi rekaman.</p>
          </div>
        </div>
      </div>
    `;

    return section;
  }



  /**
   * Set recording data and load audio
   */
  async setRecording(recording, audioBlob) {
    this.recording = recording;
    this.audioBlob = audioBlob;

    // Ensure DOM elements are available
    if (!this.container) {
      console.error('ResultView: DOM elements not ready for setRecording');
      return;
    }

    if (audioBlob) {
      // Create playback instance using PlaybackController with green player
      this.playbackInstance = PlaybackController.createInstance(
        audioBlob,
        recording.filename || 'recording.wav',
        true // Use green player design
      );

      // Insert playback view into audio section
      const audioSection = this.container.querySelector('#audio-section');
      if (audioSection && this.playbackInstance) {
        audioSection.appendChild(this.playbackInstance.getView());
      }
    }
  }

  /**
   * Start accent detection process
   */
  async startAccentDetection() {
    if (!this.audioBlob) {
      this.showError('Audio tidak tersedia');
      return;
    }

    try {
      // Show loading
      this.showLoading();

      // Simulate processing time with progress
      this.animateProgress();

      // Call API
      const result = await AccentDetectionAPI.identifyAccent(
        this.audioBlob, 
        this.recording?.filename || 'recording.wav'
      );

      // Wait a bit for better UX
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (result.success) {
        this.showResult(result.data);
      } else {
        this.showError(result.error);
      }

    } catch (error) {
      console.error('Error in accent detection:', error);
      this.showError('Terjadi kesalahan saat menganalisis rekaman');
    }
  }

  /**
   * Show loading state
   */
  showLoading() {
    this.loadingElement.style.display = 'block';
    this.resultElement.style.display = 'none';
  }

  /**
   * Show result
   */
  showResult(data) {
    this.loadingElement.style.display = 'none';
    this.resultElement.style.display = 'block';

    const confidence = data.us_confidence;

    // Update confidence display
    const confidenceValue = this.container.querySelector('.confidence-value');
    const confidencePercentage = this.container.querySelector('.confidence-percentage');
    const levelText = this.container.querySelector('.level-text');

    if (confidenceValue) {
      confidenceValue.textContent = confidence.toFixed(1);
    }

    if (confidencePercentage) {
      confidencePercentage.textContent = `${confidence.toFixed(1)}%`;
    }

    if (levelText) {
      levelText.textContent = AccentDetectionAPI.getConfidenceLevel(confidence);
    }

    // Animate confidence display
    this.animateConfidenceDisplay(confidence);
  }

  /**
   * Show error state
   */
  showError(message) {
    // Ensure DOM elements are available
    if (!this.loadingElement || !this.resultElement || !this.container) {
      console.error('ResultView: DOM elements not ready for showError');
      return;
    }

    this.loadingElement.style.display = 'none';
    this.resultElement.style.display = 'block';

    const resultContent = this.container.querySelector('.result-content');
    if (resultContent) {
      resultContent.innerHTML = `
        <div class="error-display">
          <div class="error-icon">⚠️</div>
          <h3>Terjadi Kesalahan</h3>
          <p>${message}</p>
          <button class="btn btn-primary" onclick="window.location.hash = '#/test'">
            Coba Lagi
          </button>
        </div>
      `;
    }
  }

  /**
   * Animate progress bar
   */
  animateProgress() {
    const progressFill = this.container.querySelector('.progress-fill');
    const progressText = this.container.querySelector('.progress-text');
    
    if (!progressFill || !progressText) return;

    let progress = 0;
    const steps = [
      'Memproses audio...',
      'Menganalisis vokal...',
      'Mendeteksi intonasi...',
      'Menghitung confidence...',
      'Menyelesaikan analisis...'
    ];

    const interval = setInterval(() => {
      progress += Math.random() * 20;
      if (progress > 100) progress = 100;

      progressFill.style.width = `${progress}%`;
      
      const stepIndex = Math.floor((progress / 100) * steps.length);
      if (stepIndex < steps.length) {
        progressText.textContent = steps[stepIndex];
      }

      if (progress >= 100) {
        clearInterval(interval);
      }
    }, 500);
  }

  /**
   * Animate confidence display
   */
  animateConfidenceDisplay(confidence) {
    const confidenceDisplay = this.container.querySelector('.confidence-display');
    if (confidenceDisplay) {
      // Add animation class
      confidenceDisplay.classList.add('animate-in');

      // Set color based on confidence level
      if (confidence >= 80) {
        confidenceDisplay.classList.add('high-confidence');
      } else if (confidence >= 60) {
        confidenceDisplay.classList.add('medium-confidence');
      } else {
        confidenceDisplay.classList.add('low-confidence');
      }
    }
  }

  /**
   * Cleanup resources
   */
  destroy() {
    // Cleanup playback instance
    if (this.playbackInstance) {
      PlaybackController.destroyInstance(this.playbackInstance.instanceId);
      this.playbackInstance = null;
    }

    // Remove container from DOM
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }

    // Clear references
    this.container = null;
    this.recording = null;
    this.audioBlob = null;
  }
}

export default ResultView;
