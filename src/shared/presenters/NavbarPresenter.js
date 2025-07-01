import NavbarModel from '../models/NavbarModel.js';
import NavbarView from '../views/NavbarView.js';

class NavbarPresenter {
  constructor() {
    this.model = new NavbarModel();
    this.view = new NavbarView();
    this.isInitialized = false;
  }

  init() {
    if (this.isInitialized) {
      return;
    }

    const navbarData = this.getNavbarData();
    this.view.render(navbarData);
    this.isInitialized = true;
  }

  getNavbarData() {
    return {
      brandName: this.model.getBrandName(),
      brandParts: this.model.getBrandParts(),
      navigationLinks: this.model.getNavigationLinks()
    };
  }

  mount(container) {
    if (!this.isInitialized) {
      this.init();
    }
    this.view.mount(container);
  }

  unmount() {
    this.view.unmount();
  }

  destroy() {
    this.view.destroy();
    this.isInitialized = false;
  }
}

export default NavbarPresenter;
