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
        { href: '/dashboard', text: 'Dashboard', className: 'nav-dashboard' },
        { href: '/profile', text: 'Profil', className: 'nav-profile' }
      ]
    };
  }

  mount(container) {
    if (this.view) {
      this.view.mount(container);
      this.bindEvents();
    }
  }

  bindEvents() {
    if (!this.view || !this.view.element) return;

    // Handle dashboard navigation
    const dashboardLink = this.view.element.querySelector('.nav-dashboard');
    if (dashboardLink) {
      dashboardLink.addEventListener('click', (e) => {
        e.preventDefault();
        if (window.router) {
          window.router.navigate('/dashboard');
        } else {
          window.location.href = '/dashboard';
        }
      });
    }

    // Handle profile navigation
    const profileLink = this.view.element.querySelector('.nav-profile');
    if (profileLink) {
      profileLink.addEventListener('click', (e) => {
        e.preventDefault();
        if (window.router) {
          window.router.navigate('/profile');
        } else {
          window.location.href = '/profile';
        }
      });
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
