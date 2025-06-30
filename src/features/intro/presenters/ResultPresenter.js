import ResultView from '../views/ResultView.js';

class ResultPresenter {
  constructor(resultData = null, model = null) {
    this.view = null;
    this.resultData = resultData;
    this.model = model;
  }

  init() {
    this.view = new ResultView(this.resultData, this.model);
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
}

export default ResultPresenter;
