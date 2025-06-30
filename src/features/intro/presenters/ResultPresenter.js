import ResultView from '../views/ResultView.js';
import ProgressTrackingService from '../../../utils/ProgressTrackingService.js';

class ResultPresenter {
  constructor(resultData = null, model = null) {
    this.view = null;
    this.resultData = resultData;
    this.model = model;
  }

  async init() {
    this.view = new ResultView(this.resultData, this.model);
    this.render();

    // Save progress if we have result data
    if (this.resultData) {
      await this.saveProgress();
    }
  }

  async saveProgress() {
    try {
      await ProgressTrackingService.saveExerciseProgress(this.resultData);
      console.log('Progress saved for result:', this.resultData.uuid);
    } catch (error) {
      console.error('Failed to save progress:', error);
      // Don't throw error to avoid breaking the UI
    }
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
}

export default ResultPresenter;
