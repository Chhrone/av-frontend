import CategoryView from '../views/CategoryView.js';
import CategoryNavbarPresenter from './CategoryNavbarPresenter.js';
import { FooterPresenter } from '../../../shared/index.js';

class CategoryPresenter {
  constructor(model) {
    this.model = model;
    this.view = null;
    this.navbarPresenter = null;
    this.footerPresenter = null;
  }

  init(categoryId = 'pronunciation') {
    // Set the current category in the model
    this.model.setCurrentCategory(categoryId);

    // Create and render the view
    this.view = new CategoryView();
    const categoryData = this.model.getCategoryData();
    this.render(categoryData);

    // Initialize and mount navbar
    this.navbarPresenter = new CategoryNavbarPresenter();
    this.navbarPresenter.init();
    this.navbarPresenter.mount(document.body);

    // Initialize and mount footer
    this.footerPresenter = new FooterPresenter();
    this.footerPresenter.init();
    const footerContainer = document.getElementById('category-footer-container');
    if (footerContainer) {
      this.footerPresenter.mount(footerContainer);
    }

    // Bind event handlers
    this.bindEvents();

    // Add dashboard mode class for consistent styling
    document.body.classList.add('dashboard-mode');
  }

  render(categoryData) {
    if (!this.view) return;
    
    const viewElement = this.view.render(categoryData);
    return viewElement;
  }

  bindEvents() {
    if (!this.view) return;

    // Bind pronunciation play button events
    this.view.bindPronunciationPlay((audioUrl) => {
      this.handlePronunciationPlay(audioUrl);
    });

    // Bind practice start button events
    this.view.bindPracticeStart((practiceId) => {
      this.handlePracticeStart(practiceId);
    });
  }



  handlePronunciationPlay(audioUrl) {
    console.log('Playing pronunciation audio:', audioUrl);
    
    // For now, just show a message
    // In a real app, this would play the actual audio file
    if (audioUrl && audioUrl !== '#') {
      // Here you would implement actual audio playback
      // For example: new Audio(audioUrl).play();
      alert('Fitur audio akan segera tersedia!');
    } else {
      alert('Audio belum tersedia untuk contoh ini');
    }
  }

  handlePracticeStart(practiceId) {
    console.log('Starting practice:', practiceId);
    
    // Get practice item data from model
    const practiceItems = this.model.getPracticeItems();
    const practiceItem = practiceItems.find(p => p.id === practiceId);
    
    if (practiceItem) {
      // For now, just show practice info
      // In a real app, this might navigate to a practice session
      alert(`Memulai latihan: ${practiceItem.title}\n\n${practiceItem.description}`);
    }
  }



  // Method to update category content
  updateCategory(categoryId) {
    this.model.setCurrentCategory(categoryId);
    const categoryData = this.model.getCategoryData();
    
    if (this.view) {
      // Update the view with new category data
      this.view.updateMaterial(categoryData.material || null);
      this.view.updatePronunciationExamples(categoryData.pronunciationExamples || []);
      this.view.updatePracticeItems(categoryData.practiceItems || []);
      this.view.updateCommonMistakes(categoryData.commonMistakes || null);
      this.view.updateMoreMaterials(categoryData.moreMaterials || null);

      // Re-bind events for new content
      this.bindEvents();
    }
  }

  // Method to refresh current category data
  refresh() {
    const categoryData = this.model.getCategoryData();
    if (this.view && categoryData) {
      this.view.updateMaterial(categoryData.material || null);
      this.view.updatePronunciationExamples(categoryData.pronunciationExamples || []);
      this.view.updatePracticeItems(categoryData.practiceItems || []);
      this.view.updateCommonMistakes(categoryData.commonMistakes || null);
      this.view.updateMoreMaterials(categoryData.moreMaterials || null);
      this.bindEvents();
    }
  }

  // Get current category info
  getCurrentCategoryInfo() {
    return {
      categoryId: this.model.getCurrentCategory(),
      categoryData: this.model.getCategoryData(),
      material: this.model.getMaterial(),
      pronunciationExamples: this.model.getPronunciationExamples(),
      practiceItems: this.model.getPracticeItems()
    };
  }

  // Clean up method
  destroy() {
    if (this.view) {
      this.view.destroy();
      this.view = null;
    }

    if (this.navbarPresenter) {
      this.navbarPresenter.destroy();
      this.navbarPresenter = null;
    }

    if (this.footerPresenter) {
      this.footerPresenter.destroy();
      this.footerPresenter = null;
    }

    // Remove dashboard mode class
    document.body.classList.remove('dashboard-mode');
  }
}

export default CategoryPresenter;
