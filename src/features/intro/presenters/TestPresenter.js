import TestView from '../views/TestView.js';

class TestPresenter {
  constructor(model) {
    this.view = null;
    this.model = model;
  }

  init() {
    const testText = this.model.getTestText();
    this.view = new TestView(testText);
    this.render();
  }

  render() {
    const appElement = document.getElementById('app');
    appElement.innerHTML = '';

    const viewElement = this.view.render();
    appElement.appendChild(viewElement);
  }

  destroy() {
    if (this.view) {
      this.view.destroy();
      this.view = null;
    }
  }
}

export default TestPresenter;
