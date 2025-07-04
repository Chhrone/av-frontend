import { appRouter } from '../../../utils/appRouter.js';
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

  async init(categoryId = 'pronunciation') {
    try {
      // Clear the app container
      const appContainer = document.getElementById('app');
      if (appContainer) {
        appContainer.innerHTML = '';
      }

      // Show loading state
      if (appContainer) {
        appContainer.innerHTML = '<div class="loading">Memuat konten...</div>';
      }

      // Set the current category in the model (awaits the async operation)
      await this.model.setCurrentCategory(categoryId);

      // Create and render the view
      this.view = new CategoryView();
      const categoryData = this.model.getCategoryData();
      await this.render(categoryData);

      // Bind event handlers
      this.bindEvents();

      // Mount footer inside .category-container after .category-content
      const categoryContainer = document.querySelector('.category-container');
      if (categoryContainer) {
        if (!this.footerPresenter) {
          this.footerPresenter = new FooterPresenter();
        }
        // Remove existing footer in categoryContainer if any (avoid duplicate)
        const existingFooter = categoryContainer.querySelector('#footer');
        if (existingFooter) existingFooter.remove();
        this.footerPresenter.mount(categoryContainer);
      }
    } catch (error) {
      console.error('Error initializing category presenter:', error);
    }
  }

  async render(categoryData) {
    if (!this.view) return null;
    
    try {
      // Get the app container
      const appContainer = document.getElementById('app');
      if (!appContainer) return null;
      
      // Clear the container
      appContainer.innerHTML = '';
      
      // Create navbar container
      const navbarContainer = document.createElement('div');
      navbarContainer.id = 'navbar-container';
      navbarContainer.className = 'navbar-container';
      
      // Create category container
      const categoryContainer = document.createElement('div');
      categoryContainer.id = 'category-container';
      categoryContainer.className = 'category-container';
      
      // Add containers to app
      appContainer.appendChild(navbarContainer);
      appContainer.appendChild(categoryContainer);
      
      // Initialize and mount the navbar
      if (!this.navbarPresenter) {
        this.navbarPresenter = new CategoryNavbarPresenter(this.model);
        await this.navbarPresenter.init();
        this.navbarPresenter.mount(navbarContainer);
      }
      
      // Render the view with the category data
      this.view.container = categoryContainer; // Set the container for the view
      const viewElement = this.view.render(categoryData);
      
      // Initialize the footer if not already initialized
      if (!this.footerPresenter) {
        this.footerPresenter = new FooterPresenter();
        await this.footerPresenter.init();
      }
      
      // Event binding is now handled once in the init method.
      
      return viewElement;
    } catch (error) {
      console.error('Error rendering category view:', error);
      const appContainer = document.getElementById('app');
      if (appContainer) {
        appContainer.innerHTML = `
          <div class="error-message">
            <h2>Terjadi Kesalahan</h2>
            <p>Gagal memuat konten. Silakan coba lagi nanti.</p>
            <button id="retry-button">Coba Lagi</button>
          </div>
        `;
        
        // Add retry functionality
        const retryButton = document.getElementById('retry-button');
        if (retryButton) {
          retryButton.addEventListener('click', () => {
            window.location.reload();
          });
        }
      }
      return null;
    }
  }

  bindEvents() {
    if (!this.view) return;

    // Bind pronunciation play button events
    this.view.bindPronunciationPlay((audioUrl) => {
      this.handlePronunciationPlay(audioUrl);
    });

    // Bind practice start button events
    this.view.bindPracticeStart((categoryId, practiceId) => {
      this.handlePracticeStart(categoryId, practiceId);
    });
  }



  handlePracticeStart(categoryId, practiceId) {
    if (categoryId && practiceId) {
      const formattedCategoryId = categoryId.replace(/_/g, '-');
      const path = `/practice/${formattedCategoryId}/${practiceId}`;
      console.log(`Navigating to path: ${path}`);
      appRouter.navigate(path);
    } else {
      console.error('Could not start practice: missing categoryId or practiceId');
    }
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
  }
}

export default CategoryPresenter;
