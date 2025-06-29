import WelcomeView from '../views/WelcomeView.js';

class WelcomePresenter {
  constructor(model) {
    this.view = null;
    this.model = model;
  }

  init() {
    const welcomeText = this.model.getWelcomeText();
    this.view = new WelcomeView(welcomeText);
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
