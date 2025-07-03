import '../styles/practice.css';

class PracticeResultView {
  constructor() {
    this.app = document.getElementById('app');
  }

  render(resultData) {
    this.app.innerHTML = `
      <div class="practice-result-container">
        <h2>Hasil Latihan</h2>
        <pre class="practice-result-text">${resultData ? JSON.stringify(resultData, null, 2) : 'Tidak ada hasil.'}</pre>
        <button id="back-to-test" class="back-button">Kembali ke Latihan</button>
      </div>
    `;
  }
}

export default PracticeResultView;
