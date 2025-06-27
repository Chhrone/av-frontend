import TestView from '../views/TestView.js';

class TestPresenter {
  constructor() {
    this.view = null;
  }

  init() {
    this.view = new TestView();
    this.render();
  }

  render() {
    // Clear existing content
    const appElement = document.getElementById('app');
    appElement.innerHTML = '';
    
    // Render the view
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
