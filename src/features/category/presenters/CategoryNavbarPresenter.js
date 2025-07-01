import CategoryNavbarView from '../views/CategoryNavbarView.js';

class CategoryNavbarPresenter {
  constructor() {
    this.view = null;
  }

  init() {
    const navbarData = this.getNavbarData();
    this.view = new CategoryNavbarView();
    this.render(navbarData);
  }

  render(data) {
    if (!this.view) return;
    
    const viewElement = this.view.render(data);
    return viewElement;
  }

  getNavbarData() {
    return {
      brandParts: {
        aurea: 'Aurea',
        voice: 'Voice'
      },
      navigationLinks: [
        { href: '#dashboard', text: 'Dashboard' },
        { href: '#categories', text: 'Kategori' },
        { href: '#profile', text: 'Profil' }
      ]
    };
  }

  mount(container) {
    if (this.view) {
      this.view.mount(container);
    }
  }

  destroy() {
    if (this.view) {
      this.view.destroy();
      this.view = null;
    }
  }
}

export default CategoryNavbarPresenter;
