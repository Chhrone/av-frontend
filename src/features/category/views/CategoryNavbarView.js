class CategoryNavbarView {
  constructor() {
    this.element = null;
  }

  render(data) {
    this.element = document.createElement('nav');
    this.element.className = 'category-nav';
    
    this.element.innerHTML = `
      <div class="category-nav-container">
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
      console.error('Category navbar element not rendered yet. Call render() first.');
      return;
    }
    container.prepend(this.element);
  }

  unmount() {
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }

  destroy() {
    this.unmount();
    this.element = null;
  }
}

export default CategoryNavbarView;
