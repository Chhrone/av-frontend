import ResultView from '../views/ResultView.js';

class ResultPresenter {
  constructor(resultData = null, model = null) {
    this.view = null;
    this.resultData = resultData;
    this.model = model;
  }

  init() {
    this.view = new ResultView(this.resultData, this.model);
    // Simpan skor intro ke localStorage jika ada confidence (us_confidence)
    if (this.resultData && typeof this.resultData.us_confidence === 'number') {
      this.setIntroResult({ confidence: this.resultData.us_confidence });
    }
    this.render();
  }

  render() {
    const appElement = document.getElementById('app');
    appElement.innerHTML = '';

    const viewElement = this.view.render();
    appElement.appendChild(viewElement);
  }

  updateResult(newResultData) {
    this.resultData = newResultData;
    if (this.view) {
      this.view.updateResult(newResultData);
    }
    if (this.model) {
      this.model.setLastResult(newResultData);
    }
  }

  destroy() {
    if (this.view) {
      this.view.destroy();
      this.view = null;
    }
  }

  // Methods for intro token and result management
  setIntroToken() {
    localStorage.setItem('aurea_intro_completed', '1');
  }

  /**
   * Simpan hasil intro (misal skor confidence) ke localStorage
   * @param {Object} result - Contoh: { confidence: 87.5 }
   */
  setIntroResult(result) {
    if (result && typeof result.confidence === 'number') {
      localStorage.setItem('intro_last_result', JSON.stringify({ confidence: result.confidence }));
    }
  }

  checkIntroToken() {
    return !!localStorage.getItem('aurea_intro_completed');
  }

  removeIntroToken() {
    localStorage.removeItem('aurea_intro_completed');
    localStorage.removeItem('intro_last_result');
  }
}

export default ResultPresenter;
