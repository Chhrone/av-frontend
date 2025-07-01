class NavbarView {
  constructor() {
    this.element = null;
    this.scrollHandler = null;
  }

  render(data) {
    this.element = document.createElement('nav');
    this.element.className = 'dashboard-nav';
    
    this.element.innerHTML = `
      <div class="nav-container">
        <div class="nav-logo">
          <span class="nav-logo-aurea">${data.brandParts.aurea}</span><span class="nav-logo-voice">${data.brandParts.voice}</span>
        </div>
        <div class="nav-buttons">
          ${data.navigationLinks.map(link =>
            `<a href="${link.href}" class="nav-button">${link.text}</a>`
          ).join('')}
        </div>
      </div>
    `;

    return this.element;
  }

  mount(container) {
    if (!this.element) {
      console.error('Navbar element not rendered yet. Call render() first.');
      return;
    }
    container.appendChild(this.element);
    this.bindScrollEvent();
  }

  unmount() {
    this.removeScrollEvent();
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }

  bindScrollEvent() {
    const navContainer = this.element.querySelector('.nav-container');
    const dashboardNav = this.element;
    if (!navContainer || !dashboardNav) return;

    this.scrollHandler = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      if (scrollTop > 50) {
        navContainer.classList.add('scrolled');
        dashboardNav.classList.add('scrolled');
      } else {
        navContainer.classList.remove('scrolled');
        dashboardNav.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', this.scrollHandler);
  }

  removeScrollEvent() {
    if (this.scrollHandler) {
      window.removeEventListener('scroll', this.scrollHandler);
      this.scrollHandler = null;
    }
  }

  destroy() {
    this.removeScrollEvent();
    this.unmount();
    this.element = null;
  }
}

export default NavbarView;
