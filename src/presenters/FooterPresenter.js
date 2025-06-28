import FooterModel from '../models/FooterModel.js';
import FooterView from '../views/FooterView.js';

class FooterPresenter {
  constructor() {
    this.model = new FooterModel();
    this.view = new FooterView();
    this.isInitialized = false;
  }

  init() {
    if (this.isInitialized) {
      return;
    }

    const footerData = this.getFooterData();
    this.view.render(footerData);
    this.isInitialized = true;
  }

  getFooterData() {
    return {
      brandName: this.model.getBrandName(),
      description: this.model.getDescription(),
      backgroundText: this.model.getBackgroundText(),
      copyrightText: this.model.getCopyrightText(),
      internalLinks: this.model.getInternalLinks(),
      communityLinks: this.model.getCommunityLinks(),
      resourceLinks: this.model.getResourceLinks()
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

  updateBrandName(brandName) {
    this.model.setBrandName(brandName);
    this.view.updateBrandName(brandName);
    this.view.updateCopyrightText(this.model.getCopyrightText());
  }

  updateDescription(description) {
    this.model.setDescription(description);
    this.view.updateDescription(description);
  }

  updateBackgroundText(text) {
    this.model.setBackgroundText(text);
    this.view.updateBackgroundText(text);
  }

  refresh() {
    if (this.isInitialized) {
      this.view.destroy();
      this.isInitialized = false;
      this.init();
    }
  }

  destroy() {
    this.view.destroy();
    this.isInitialized = false;
  }

  // Getter methods for external access
  getBrandName() {
    return this.model.getBrandName();
  }

  getDescription() {
    return this.model.getDescription();
  }

  getBackgroundText() {
    return this.model.getBackgroundText();
  }
}

export default FooterPresenter;
