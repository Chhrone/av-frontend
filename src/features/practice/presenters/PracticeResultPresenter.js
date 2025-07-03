import PracticeResultView from '../views/PracticeResultView.js';

class PracticeResultPresenter {
  constructor(model) {
    this.model = model;
    this.view = new PracticeResultView();
  }

  showResult(resultData) {
    this.model.setResultData(resultData);
    this.view.render(resultData);
  }
}

export default PracticeResultPresenter;
