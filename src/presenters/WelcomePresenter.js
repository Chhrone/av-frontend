import WelcomeView from '../views/WelcomeView.js';

class WelcomePresenter {
  constructor() {
    this.view = null;
  }

  init() {
    this.view = new WelcomeView();
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

export default WelcomePresenter;
