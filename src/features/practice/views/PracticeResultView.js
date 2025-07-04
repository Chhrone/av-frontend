import '../styles/index.css';
import '../styles/practice-components.css';
import '../styles/practice-animations.css';
import '../styles/practice-transitions.css';

class PracticeResultView {
  constructor() {
    this.app = document.getElementById('app');
  }


  // Tidak perlu getLevelDescription lagi, deskripsi motivasi sudah diberikan dari presenter

  render(resultData) {
    // Ambil skor confidence, fallback ke 0 jika tidak ada
    const usConfidence = resultData && typeof resultData.us_confidence === 'number' ? resultData.us_confidence : 0;
    const score = usConfidence <= 1 ? (usConfidence * 100) : usConfidence;
    const scoreText = `Skor aksen Amerika kamu: ${score.toFixed(1)}%`;
    // Ambil deskripsi motivasi dari resultData
    const motivationalDescription = resultData && resultData.motivationalDescription ? resultData.motivationalDescription : '';

    this.app.innerHTML = `
      <div class="practice-result-container practice-result-ctn practice-fade-in" style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 60vh;">
        <div class="practice-result-text" style="font-size: 2rem; font-weight: bold; margin-bottom: 1rem; text-align: center;">${scoreText}</div>
        <div class="practice-result-description" style="font-size: 1.2rem; margin-bottom: 2rem; text-align: center;">${motivationalDescription}</div>
        <button id="practice-continue-btn" class="practice-continue-btn" style="padding: 0.75rem 2rem; font-size: 1rem; border-radius: 8px; background: #4f8cff; color: #fff; border: none; cursor: pointer;">Lanjut ke Sesi Rekaman Berikutnya</button>
      </div>
    `;
  }
}

export default PracticeResultView;
