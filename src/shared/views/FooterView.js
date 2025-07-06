class FooterView {
  constructor() {
    this.element = null;
  }

  render(data) {
    this.element = document.createElement('footer');
    this.element.id = 'footer';
    this.element.innerHTML = `
      <div class="footer-wrapper">
        <div class="container">
          <div class="footer-background-text">${data.backgroundText}</div>
          <div class="footer-content">
            <div class="footer-section footer-brand">
              <h3 class="footer-brand-title">${data.brandName}</h3>
              <p class="footer-description">${data.description}</p>
            </div>
            <div class="footer-section">
              <h3 class="footer-title">Internal</h3>
              <ul class="footer-links">
                ${data.internalLinks.map(link =>
                  `<li><a href="${link.href}">${link.text}</a></li>`
                ).join('')}
              </ul>
            </div>
            <div class="footer-section">
              <h3 class="footer-title">Komunitas</h3>
              <ul class="footer-links">
                ${data.communityLinks.map(link =>
                  `<li><a href="${link.href}">${link.text}</a></li>`
                ).join('')}
              </ul>
            </div>
            <div class="footer-section">
              <h3 class="footer-title">Resources</h3>
              <ul class="footer-links">
                ${data.resourceLinks.map(link =>
                  `<li><a href="${link.href}">${link.text}</a></li>`
                ).join('')}
              </ul>
            </div>
          </div>
          <div class="footer-bottom">
            <div class="copyright">
              <p>${data.copyrightText}</p>
            </div>
          </div>
        </div>
      </div>
    `;
    console.log('[FooterView] render() dipanggil, element:', this.element);
    return this.element;
  }

  mount(container) {
    if (!this.element) {
      console.error('[FooterView] Footer element not rendered yet. Call render() first.');
      return;
    }
    container.appendChild(this.element);
    console.log('[FooterView] mount() dipanggil, footer dimasukkan ke:', container);
  }

  unmount() {
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }

  updateBrandName(brandName) {
    if (this.element) {
      const brandTitle = this.element.querySelector('.footer-brand-title');
      if (brandTitle) {
        brandTitle.textContent = brandName;
      }
    }
  }

  updateDescription(description) {
    if (this.element) {
      const descriptionElement = this.element.querySelector('.footer-description');
      if (descriptionElement) {
        descriptionElement.textContent = description;
      }
    }
  }

  updateBackgroundText(text) {
    if (this.element) {
      const backgroundElement = this.element.querySelector('.footer-background-text');
      if (backgroundElement) {
        backgroundElement.textContent = text;
      }
    }
  }

  updateCopyrightText(text) {
    if (this.element) {
      const copyrightElement = this.element.querySelector('.copyright p');
      if (copyrightElement) {
        copyrightElement.textContent = text;
      }
    }
  }

  destroy() {
    this.unmount();
    this.element = null;
  }
}

export default FooterView;
