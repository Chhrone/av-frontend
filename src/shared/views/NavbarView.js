class NavbarView {
  constructor() {
    this.element = null;
    this.scrollHandler = null;
  }

  render(data) {
    this.element = document.createElement('nav');
    this.element.className = 'dashboard-nav';
    
    // Filter out profile links (by className or text)
    const filteredLinks = data.navigationLinks.filter(link => {
      const cls = (link.className || '').toLowerCase();
      const txt = (link.text || '').toLowerCase();
      return !cls.includes('profile') && txt !== 'profil' && txt !== 'profile';
    });
    this.element.innerHTML = `
      <div class="nav-container">
        <div class="nav-logo">
          <span class="nav-logo-aurea">${data.brandParts.aurea}</span><span class="nav-logo-voice">${data.brandParts.voice}</span>
        </div>
        <div class="nav-buttons">
          ${filteredLinks.map(link =>
            `<a href="${link.href}" class="nav-button" data-type="${link.type}">${link.text}</a>`
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
    this.bindNavLinks();
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

  scrollToSection(sectionId) {
    const section = document.querySelector(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  }

  handleNavClick(event) {
    const target = event.target.closest('a');
    if (!target) return;

    const href = target.getAttribute('href');
    const linkType = target.dataset.type;
    
    // Handle scroll to section
    if (linkType === 'scroll') {
      event.preventDefault();
      event.stopPropagation();
      
      // Always just scroll to the categories section without changing the URL
      this.scrollToSection(href);
    }
    // For route links, we let the default behavior handle the navigation
  }

  bindNavLinks() {
    if (!this.element) return;
    this.element.addEventListener('click', (event) => {
      this.handleNavClick(event);
    });
  }

  destroy() {
    this.removeScrollEvent();
    if (this.element) {
      this.element.removeEventListener('click', this.handleNavClick);
    }
    this.unmount();
    this.element = null;
  }
}

export default NavbarView;
